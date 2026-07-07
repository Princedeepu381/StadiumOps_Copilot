import { store, addLog } from './store.js';

// Deep clone helper to reset seed data
const initialZones = [
  { id: "zone-gateA", name: "Gate A (Main Entry)", congestionLevel: "low", capacityPercent: 35, lastUpdated: new Date().toISOString() },
  { id: "zone-gateB", name: "Gate B (East Entry)", congestionLevel: "medium", capacityPercent: 68, lastUpdated: new Date().toISOString() },
  { id: "zone-gateC", name: "Gate C (North Entry)", congestionLevel: "low", capacityPercent: 42, lastUpdated: new Date().toISOString() },
  { id: "zone-north", name: "North Concourse", congestionLevel: "low", capacityPercent: 30, lastUpdated: new Date().toISOString() },
  { id: "zone-south", name: "South Concourse", congestionLevel: "low", capacityPercent: 25, lastUpdated: new Date().toISOString() },
  { id: "zone-eastShuttle", name: "East Shuttle Drop-off", congestionLevel: "low", capacityPercent: 15, lastUpdated: new Date().toISOString() }
];

const initialIncidents = [
  {
    id: "inc-1",
    type: "facilities",
    zoneId: "zone-south",
    severity: "medium",
    status: "open",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    description: "Minor water leakage near South Concourse restroom entrance",
    assignedTo: null
  }
];

const initialAccessibilityRequests = [
  {
    id: "acc-1",
    type: "wheelchair",
    zoneId: "zone-gateA",
    urgency: "standard",
    status: "queued",
    requestedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    assignedTo: null
  },
  {
    id: "acc-2",
    type: "escort",
    zoneId: "zone-north",
    urgency: "high",
    status: "queued",
    requestedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    assignedTo: null
  }
];

const initialTransportAlerts = [
  {
    id: "trn-1",
    route: "West Shuttle Line",
    alertType: "delay",
    affectedZoneId: "zone-gateA",
    estimatedDelayMinutes: 10,
    activeSince: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

const initialStaffing = [
  { id: "vol-1", name: "John Doe", role: "volunteer", zoneId: "zone-gateB", status: "available" },
  { id: "vol-2", name: "Jane Smith", role: "volunteer", zoneId: "zone-gateB", status: "available" },
  { id: "vol-3", name: "Carlos Ruiz", role: "volunteer", zoneId: "zone-gateA", status: "available" },
  { id: "vol-4", name: "Amina Patel", role: "accessibility-staff", zoneId: "zone-north", status: "available" },
  { id: "vol-5", name: "Yuki Tanaka", role: "ops-staff", zoneId: "zone-south", status: "available" },
  { id: "vol-6", name: "Liam Brown", role: "volunteer", zoneId: "zone-gateC", status: "available" },
  { id: "vol-7", name: "Sophia Martinez", role: "accessibility-staff", zoneId: "zone-gateB", status: "available" }
];

export function resetState() {
  store.zones = JSON.parse(JSON.stringify(initialZones));
  store.incidents = JSON.parse(JSON.stringify(initialIncidents));
  store.accessibilityRequests = JSON.parse(JSON.stringify(initialAccessibilityRequests));
  store.transportAlerts = JSON.parse(JSON.stringify(initialTransportAlerts));
  store.staffing = JSON.parse(JSON.stringify(initialStaffing));
  store.announcements = [];
  store.activityLog = [
    { id: "log-1", entityType: "incident", entityId: "inc-1", action: "created", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: "log-2", entityType: "accessibility", entityId: "acc-1", action: "queued", timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: "log-3", entityType: "accessibility", entityId: "acc-2", action: "queued", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() }
  ];
  return { message: "State reset to initial seed values." };
}

// Scenario 1: Flagship Gate B Congestion + Shuttle Delay
export function triggerGateBCongestion() {
  // 1. Update Gate B zone to critical congestion
  const gateB = store.zones.find(z => z.id === "zone-gateB");
  if (gateB) {
    gateB.congestionLevel = "critical";
    gateB.capacityPercent = 94;
    gateB.lastUpdated = new Date().toISOString();
  }

  // 2. Add Transport Alert for East Shuttle Line
  const shuttleAlertExists = store.transportAlerts.some(t => t.id === "trn-gateB");
  if (!shuttleAlertExists) {
    const trnAlert = {
      id: "trn-gateB",
      route: "East Shuttle Line",
      alertType: "delay",
      affectedZoneId: "zone-gateB",
      estimatedDelayMinutes: 25,
      activeSince: new Date().toISOString()
    };
    store.transportAlerts.push(trnAlert);
    addLog("transport", trnAlert.id, "created");
  }

  // 3. Add Incident for Gate B Crowd Bottleneck
  const incidentExists = store.incidents.some(i => i.id === "inc-gateB");
  if (!incidentExists) {
    const newInc = {
      id: "inc-gateB",
      type: "crowd",
      zoneId: "zone-gateB",
      severity: "high",
      status: "open",
      createdAt: new Date().toISOString(),
      description: "Bottleneck forming at Gate B turnstiles. East Shuttle delays have paused outbound dispersal, leading to inbound backing up.",
      assignedTo: null
    };
    store.incidents.push(newInc);
    addLog("incident", newInc.id, "created");
  }

  return { message: "Gate B Congestion Scenario triggered successfully." };
}

// Scenario 2: Accessibility Escalation (Wheelchair escort aging, overdue warning)
export function triggerAccessibilityEscalation() {
  // Add a new accessibility request that is already aged
  const accId = `acc-esc-${Date.now()}`;
  const newAcc = {
    id: accId,
    type: "wheelchair",
    zoneId: "zone-gateB",
    urgency: "critical",
    status: "queued",
    requestedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago (exceeds 30-min SLA)
    assignedTo: null
  };
  
  store.accessibilityRequests.push(newAcc);
  addLog("accessibility", newAcc.id, "queued");

  // Also elevate Gate B congestion slightly if it isn't already critical
  const gateB = store.zones.find(z => z.id === "zone-gateB");
  if (gateB && gateB.congestionLevel === "low") {
    gateB.congestionLevel = "medium";
    gateB.capacityPercent = 70;
    gateB.lastUpdated = new Date().toISOString();
  }

  return { message: "Accessibility Escalation Scenario triggered successfully." };
}
