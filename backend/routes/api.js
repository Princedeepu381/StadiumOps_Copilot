import express from 'express';
import { 
  store, 
  getPrioritizedIncidents, 
  getPrioritizedAccessibilityRequests, 
  addLog 
} from '../store.js';
import { 
  resetState, 
  triggerGateBCongestion, 
  triggerAccessibilityEscalation 
} from '../scenarioEngine.js';
import { 
  handleCopilotChat, 
  getIncidentRecommendation, 
  generateMultilingualAnnouncement, 
  generateSituationSummary 
} from '../services/aiService.js';
import { rateLimiter } from '../server.js';

const router = express.Router();

// Security: Basic input sanitizer to strip HTML/script tags (XSS prevention)
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 1. Snapshot State
router.get('/state', (req, res) => {
  res.json({
    zones: store.zones,
    incidents: getPrioritizedIncidents(),
    accessibilityRequests: getPrioritizedAccessibilityRequests(),
    transportAlerts: store.transportAlerts,
    staffing: store.staffing,
    announcements: store.announcements,
    activityLog: store.activityLog.slice(-50) // Return last 50 entries
  });
});

// 2. Zones
router.get('/zones', (req, res) => {
  res.json(store.zones);
});

// 3. Incidents
router.get('/incidents', (req, res) => {
  res.json(getPrioritizedIncidents());
});

router.post('/incidents', (req, res) => {
  const { type, zoneId, severity, description } = req.body;
  if (!type || !zoneId || !severity || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newIncident = {
    id: `inc-${Date.now()}`,
    type: sanitize(type),
    zoneId: sanitize(zoneId),
    severity: sanitize(severity),
    status: "open",
    createdAt: new Date().toISOString(),
    description: sanitize(description),
    assignedTo: null
  };

  store.incidents.push(newIncident);
  addLog("incident", newIncident.id, "created");
  
  // Dynamic updates: if critical severity incident, increase congestion level in zone
  if (severity === "critical" || severity === "high") {
    const zone = store.zones.find(z => z.id === zoneId);
    if (zone && zone.congestionLevel === "low") {
      zone.congestionLevel = severity === "critical" ? "high" : "medium";
      zone.capacityPercent = Math.min(90, zone.capacityPercent + 20);
      zone.lastUpdated = new Date().toISOString();
      addLog("zone", zone.id, `congestion_elevated_due_to_${newIncident.id}`);
    }
  }

  res.status(201).json(newIncident);
});

router.patch('/incidents/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedTo, severity } = req.body;
  
  const incident = store.incidents.find(i => i.id === id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  if (status !== undefined) {
    incident.status = status;
    addLog("incident", id, `status_updated_to_${status}`);
  }
  if (assignedTo !== undefined) {
    incident.assignedTo = assignedTo;
    addLog("incident", id, `assigned_to_${assignedTo}`);
    
    // Mark volunteer status as assigned
    const staff = store.staffing.find(s => s.name === assignedTo || s.id === assignedTo);
    if (staff) {
      staff.status = "assigned";
    }
  }
  if (severity !== undefined) {
    incident.severity = severity;
    addLog("incident", id, `severity_updated_to_${severity}`);
  }

  res.json(incident);
});

// 4. Accessibility Requests
router.get('/accessibility', (req, res) => {
  res.json(getPrioritizedAccessibilityRequests());
});

router.post('/accessibility', (req, res) => {
  const { type, zoneId, urgency } = req.body;
  if (!type || !zoneId || !urgency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newRequest = {
    id: `acc-${Date.now()}`,
    type,
    zoneId,
    urgency,
    status: "queued",
    requestedAt: new Date().toISOString(),
    assignedTo: null
  };

  store.accessibilityRequests.push(newRequest);
  addLog("accessibility", newRequest.id, "queued");
  res.status(201).json(newRequest);
});

router.patch('/accessibility/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  const request = store.accessibilityRequests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  if (status !== undefined) {
    request.status = status;
    addLog("accessibility", id, `status_updated_to_${status}`);
  }
  if (assignedTo !== undefined) {
    request.assignedTo = assignedTo;
    addLog("accessibility", id, `assigned_to_${assignedTo}`);

    // Update staff status
    const staff = store.staffing.find(s => s.name === assignedTo || s.id === assignedTo);
    if (staff) {
      staff.status = "assigned";
    }
  }

  res.json(request);
});

// 5. Transport Alerts
router.get('/transport', (req, res) => {
  res.json(store.transportAlerts);
});

// 6. Staffing
router.get('/staffing', (req, res) => {
  res.json(store.staffing);
});

// 7. AI Copilot Chat
router.post('/ai/copilot', rateLimiter, async (req, res) => {
  const { chatHistory, userQuestion } = req.body;
  if (!userQuestion) {
    return res.status(400).json({ error: "Missing userQuestion" });
  }

  const fullState = {
    zones: store.zones,
    incidents: getPrioritizedIncidents(),
    accessibilityRequests: getPrioritizedAccessibilityRequests(),
    transportAlerts: store.transportAlerts,
    staffing: store.staffing
  };

  try {
    const responseText = await handleCopilotChat(chatHistory || [], userQuestion, fullState);
    res.json({ text: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. AI Incident Action Recommendations
router.post('/ai/recommend/:incidentId', rateLimiter, async (req, res) => {
  const { incidentId } = req.params;
  const incident = store.incidents.find(i => i.id === incidentId);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }

  const zone = store.zones.find(z => z.id === incident.zoneId);
  const relevantTransport = store.transportAlerts.filter(t => t.affectedZoneId === incident.zoneId);
  const staffingContext = store.staffing;

  try {
    const recommendation = await getIncidentRecommendation(incident, zone, relevantTransport, staffingContext);
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. AI Multilingual Announcement Generator
router.post('/ai/announce', rateLimiter, async (req, res) => {
  const { incidentContext } = req.body;
  if (!incidentContext) {
    return res.status(400).json({ error: "Missing incidentContext" });
  }

  try {
    const announcementText = await generateMultilingualAnnouncement(incidentContext);
    
    // Auto-save generated announcement to store as a draft
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      sourceIncidentId: incidentContext.id || null,
      textEn: announcementText.textEn,
      textHi: announcementText.textHi,
      textEs: announcementText.textEs,
      status: "draft",
      createdAt: new Date().toISOString()
    };
    
    store.announcements.push(newAnnouncement);
    addLog("announcement", newAnnouncement.id, "generated");
    
    res.json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ai/announce/publish/:announcementId', (req, res) => {
  const { announcementId } = req.params;
  const announcement = store.announcements.find(a => a.id === announcementId);
  if (!announcement) {
    return res.status(404).json({ error: "Announcement not found" });
  }

  announcement.status = "published";
  addLog("announcement", announcementId, "published");
  res.json(announcement);
});

// 10. AI Summaries & Report Generator
router.post('/ai/summary', rateLimiter, async (req, res) => {
  const { windowName } = req.body; // e.g. "Last 30 Minutes" or "Shift Handoff"
  const windowLabel = windowName || "Shift Handoff";

  const recentLogs = store.activityLog.slice(-15);
  const openIncidents = store.incidents.filter(i => i.status !== "resolved");
  const openAccRequests = store.accessibilityRequests.filter(r => r.status !== "resolved");
  const activeTransport = store.transportAlerts;

  try {
    const summary = await generateSituationSummary(
      windowLabel, 
      recentLogs, 
      openIncidents, 
      openAccRequests, 
      activeTransport
    );
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Scenario Controller Endpoints
router.post('/scenario/reset', (req, res) => {
  const result = resetState();
  res.json(result);
});

router.post('/scenario/gateb', (req, res) => {
  const result = triggerGateBCongestion();
  res.json(result);
});

router.post('/scenario/accessibility', (req, res) => {
  const result = triggerAccessibilityEscalation();
  res.json(result);
});

export default router;
