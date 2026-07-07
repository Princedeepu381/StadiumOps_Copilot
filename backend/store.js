// In-memory data store for StadiumOps Copilot

export const store = {
  zones: [
    { id: "zone-gateA", name: "Gate A (Main Entry)", congestionLevel: "low", capacityPercent: 35, lastUpdated: new Date().toISOString() },
    { id: "zone-gateB", name: "Gate B (East Entry)", congestionLevel: "medium", capacityPercent: 68, lastUpdated: new Date().toISOString() },
    { id: "zone-gateC", name: "Gate C (North Entry)", congestionLevel: "low", capacityPercent: 42, lastUpdated: new Date().toISOString() },
    { id: "zone-north", name: "North Concourse", congestionLevel: "low", capacityPercent: 30, lastUpdated: new Date().toISOString() },
    { id: "zone-south", name: "South Concourse", congestionLevel: "low", capacityPercent: 25, lastUpdated: new Date().toISOString() },
    { id: "zone-eastShuttle", name: "East Shuttle Drop-off", congestionLevel: "low", capacityPercent: 15, lastUpdated: new Date().toISOString() }
  ],
  incidents: [
    {
      id: "inc-1",
      type: "facilities",
      zoneId: "zone-south",
      severity: "medium",
      status: "open",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      description: "Minor water leakage near South Concourse restroom entrance",
      assignedTo: null
    }
  ],
  accessibilityRequests: [
    {
      id: "acc-1",
      type: "wheelchair",
      zoneId: "zone-gateA",
      urgency: "standard",
      status: "queued",
      requestedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 mins ago
      assignedTo: null
    },
    {
      id: "acc-2",
      type: "escort",
      zoneId: "zone-north",
      urgency: "high",
      status: "queued",
      requestedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      assignedTo: null
    }
  ],
  transportAlerts: [
    {
      id: "trn-1",
      route: "West Shuttle Line",
      alertType: "delay",
      affectedZoneId: "zone-gateA",
      estimatedDelayMinutes: 10,
      activeSince: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ],
  staffing: [
    { id: "vol-1", name: "John Doe", role: "volunteer", zoneId: "zone-gateB", status: "available" },
    { id: "vol-2", name: "Jane Smith", role: "volunteer", zoneId: "zone-gateB", status: "available" },
    { id: "vol-3", name: "Carlos Ruiz", role: "volunteer", zoneId: "zone-gateA", status: "available" },
    { id: "vol-4", name: "Amina Patel", role: "accessibility-staff", zoneId: "zone-north", status: "available" },
    { id: "vol-5", name: "Yuki Tanaka", role: "ops-staff", zoneId: "zone-south", status: "available" },
    { id: "vol-6", name: "Liam Brown", role: "volunteer", zoneId: "zone-gateC", status: "available" },
    { id: "vol-7", name: "Sophia Martinez", role: "accessibility-staff", zoneId: "zone-gateB", status: "available" }
  ],
  announcements: [],
  activityLog: [
    { id: "log-1", entityType: "incident", entityId: "inc-1", action: "created", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: "log-2", entityType: "accessibility", entityId: "acc-1", action: "queued", timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: "log-3", entityType: "accessibility", entityId: "acc-2", action: "queued", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() }
  ]
};

// Log helper
export function addLog(entityType, entityId, action) {
  const log = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    entityType,
    entityId,
    action,
    timestamp: new Date().toISOString()
  };
  store.activityLog.push(log);
  return log;
}

// Severity priority scoring
const SEVERITY_WEIGHTS = { critical: 4, high: 3, medium: 2, low: 1 };
const URGENCY_WEIGHTS = { critical: 4, high: 3, standard: 1 };

// Prioritizes incidents
export function getPrioritizedIncidents() {
  return [...store.incidents].sort((a, b) => {
    // Open/In-progress first, resolved last
    if (a.status !== "resolved" && b.status === "resolved") return -1;
    if (a.status === "resolved" && b.status !== "resolved") return 1;

    // Both same status (or both unresolved) -> Sort by severity weight
    const aSev = SEVERITY_WEIGHTS[a.severity] || 0;
    const bSev = SEVERITY_WEIGHTS[b.severity] || 0;
    if (aSev !== bSev) return bSev - aSev;

    // Same severity -> Sort by age (older first)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

// Prioritizes accessibility requests
export function getPrioritizedAccessibilityRequests() {
  return [...store.accessibilityRequests].sort((a, b) => {
    // Queued/In-progress first, resolved last
    if (a.status !== "resolved" && b.status === "resolved") return -1;
    if (a.status === "resolved" && b.status !== "resolved") return 1;

    // Sort by urgency weight
    const aUrg = URGENCY_WEIGHTS[a.urgency] || 0;
    const bUrg = URGENCY_WEIGHTS[b.urgency] || 0;
    if (aUrg !== bUrg) return bUrg - aUrg;

    // Sort by age (older first)
    return new Date(a.requestedAt) - new Date(b.requestedAt);
  });
}
