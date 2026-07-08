import React, { useState } from 'react';
import { API_BASE_URL } from '../config.js';
import { 
  Accessibility, 
  Clock, 
  AlertOctagon, 
  CheckSquare, 
  UserPlus, 
  HelpCircle,
  Plus
} from 'lucide-react';

export default function AccessibilityComponent({ state, onUpdateAccessibility }) {
  const { accessibilityRequests, zones, staffing } = state;
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Form State
  const [showLogForm, setShowLogForm] = useState(false);
  const [newReqType, setNewReqType] = useState('wheelchair');
  const [newReqZone, setNewReqZone] = useState(zones[0]?.id || '');
  const [newReqUrgency, setNewReqUrgency] = useState('standard');
  const [submitting, setSubmitting] = useState(false);

  const [statusFilter, setStatusFilter] = useState('unresolved');

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/accessibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newReqType,
          zoneId: newReqZone,
          urgency: newReqUrgency
        })
      });

      if (!res.ok) throw new Error("Failed to create request");
      const loggedReq = await res.json();
      
      onUpdateAccessibility(loggedReq);
      setSelectedRequest(loggedReq);
      setShowLogForm(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignStaff = async (staffName) => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/accessibility/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: staffName, status: 'in-progress' })
      });
      if (!res.ok) throw new Error("Failed to assign staff");
      const updated = await res.json();
      onUpdateAccessibility(updated);
      setSelectedRequest(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolveRequest = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/accessibility/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (!res.ok) throw new Error("Failed to resolve request");
      const updated = await res.json();
      onUpdateAccessibility(updated);
      setSelectedRequest(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // Helpers
  const getAgeMinutes = (timestamp) => {
    return Math.floor((Date.now() - new Date(timestamp)) / 60000);
  };

  const isSlaBreached = (req) => {
    if (req.status === 'resolved') return false;
    return getAgeMinutes(req.requestedAt) > 30; // 30 mins SLA
  };

  // Filter requests
  const filteredRequests = accessibilityRequests.filter(req => {
    if (statusFilter === 'unresolved') return req.status !== 'resolved';
    return req.status === statusFilter;
  });

  // Get accessibility staff
  const accStaff = staffing.filter(s => s.role === 'accessibility-staff' || s.role === 'volunteer');

  return (
    <div className="page-container">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Accessibility Support Queue</h1>
          <p style={styles.subtitle}>Escort & Assistance Requests (30-Minute SLA Target)</p>
        </div>
        <button 
          style={styles.logBtn} 
          onClick={() => setShowLogForm(!showLogForm)}
          className="btn"
        >
          <Plus size={16} /> Log Assistance Request
        </button>
      </div>

      <div style={styles.layout}>
        {/* Left Side: Request List & SLA Alert banner */}
        <div style={styles.listSection}>
          
          {/* Create Request Form */}
          {showLogForm && (
            <form style={styles.formCard} className="glass-panel" onSubmit={handleCreateRequest}>
              <h3 style={styles.formTitle}>Log Accessibility Request</h3>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location Zone</label>
                  <select 
                    value={newReqZone} 
                    onChange={(e) => setNewReqZone(e.target.value)}
                    className="input-field"
                  >
                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Request Type</label>
                  <select 
                    value={newReqType} 
                    onChange={(e) => setNewReqType(e.target.value)}
                    className="input-field"
                  >
                    <option value="wheelchair">Wheelchair Assistance</option>
                    <option value="escort">Guide / Escort Service</option>
                    <option value="restroom">Restroom Navigation Help</option>
                    <option value="medical-escalation">Medical Standby Support</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Urgency</label>
                  <select 
                    value={newReqUrgency} 
                    onChange={(e) => setNewReqUrgency(e.target.value)}
                    className="input-field"
                  >
                    <option value="standard">Standard Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical (Immediate Dispatch)</option>
                  </select>
                </div>
              </div>
              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowLogForm(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Register Request'}
                </button>
              </div>
            </form>
          )}

          {/* SLA Stats / Info Banner */}
          <div style={styles.slaBanner} className="glass-panel scroll-reveal">
            <div style={styles.slaStat}>
              <span style={styles.slaStatLabel}>Pending Requests</span>
              <span style={styles.slaStatVal}>{accessibilityRequests.filter(r => r.status !== 'resolved').length}</span>
            </div>
            <div style={styles.slaStat}>
              <span style={styles.slaStatLabel}>SLA Breached (&gt;30m)</span>
              <span 
                style={{ 
                  ...styles.slaStatVal, 
                  color: accessibilityRequests.some(isSlaBreached) ? 'var(--color-danger)' : 'var(--text-main)' 
                }}
              >
                {accessibilityRequests.filter(isSlaBreached).length}
              </span>
            </div>
            <div style={styles.slaTabs}>
              <button 
                onClick={() => setStatusFilter('unresolved')} 
                style={{ ...styles.slaTab, borderBottomColor: statusFilter === 'unresolved' ? 'var(--primary)' : 'transparent' }}
              >
                Active
              </button>
              <button 
                onClick={() => setStatusFilter('resolved')} 
                style={{ ...styles.slaTab, borderBottomColor: statusFilter === 'resolved' ? 'var(--primary)' : 'transparent' }}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* List queue */}
          <div style={styles.queueList}>
            {filteredRequests.length === 0 ? (
              <div style={styles.noRequests} className="glass-panel">
                <Accessibility size={24} color="var(--text-dim)" />
                <p>No active accessibility requests.</p>
              </div>
            ) : (
              filteredRequests.map((req) => {
                const zone = zones.find(z => z.id === req.zoneId);
                const isSelected = selectedRequest?.id === req.id;
                const isBreached = isSlaBreached(req);
                const age = getAgeMinutes(req.requestedAt);
                return (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className="glass-panel queue-item scroll-reveal"
                    style={{
                      ...styles.queueItem,
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                      borderColor: isBreached ? 'var(--color-danger)' : isSelected ? 'var(--color-success)' : 'var(--border)'
                    }}
                  >
                    <div style={styles.itemHeader}>
                      <span className={`status-badge ${req.urgency}`}>{req.urgency.toUpperCase()} +</span>
                      <span style={{ 
                        ...styles.itemAge, 
                        color: isBreached ? 'var(--color-danger)' : 'var(--text-muted)' 
                      }}>
                        <Clock size={12} /> {age}m open {isBreached ? '(! SLA)' : ''}
                      </span>
                    </div>
                    <div style={styles.itemBody}>
                      <h4 style={styles.itemTitle}>{req.type.toUpperCase()} assistance</h4>
                      <p style={styles.itemLocation}>Location: {zone?.name || req.zoneId}</p>
                    </div>
                    <div style={styles.itemMeta}>
                      <span style={{ textTransform: 'capitalize' }}>Status: {req.status}</span>
                      <span>{req.assignedTo ? `Assigned: ${req.assignedTo}` : 'Unassigned'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detail & Action Panel */}
        <div style={styles.detailSection}>
          {selectedRequest ? (
            <div style={styles.detailCard} className="glass-panel scroll-reveal">
              
              {/* Detail Header */}
              <div style={styles.detailHeader}>
                <div>
                  <h3 style={styles.detailTitle}>Accessibility Task Detail</h3>
                  <p style={styles.detailSubtitle}>ID: {selectedRequest.id.toUpperCase()}</p>
                </div>
                <div style={styles.detailBadgeRow}>
                  <span className={`status-badge ${selectedRequest.urgency}`}>{selectedRequest.urgency.toUpperCase()} +</span>
                  <span className={`status-badge ${selectedRequest.status}`}>{selectedRequest.status.toUpperCase()} +</span>
                </div>
              </div>

              {/* SLA Warning banner */}
              {isSlaBreached(selectedRequest) && (
                <div style={styles.breachWarning}>
                  <AlertOctagon size={16} color="var(--color-danger)" />
                  <span>SLA target breached! Open for {getAgeMinutes(selectedRequest.requestedAt)} minutes (SLA: 30 minutes). Dispatch staff immediately.</span>
                </div>
              )}

              {/* Description */}
              <div style={styles.descBlock}>
                <p style={styles.label}>Requested Assistance</p>
                <h2 style={styles.descTitle}>{selectedRequest.type.toUpperCase()} Service</h2>
                <div style={styles.descMeta}>
                  <p><strong>Location:</strong> {zones.find(z => z.id === selectedRequest.zoneId)?.name || selectedRequest.zoneId}</p>
                  <p><strong>Logged Time:</strong> {new Date(selectedRequest.requestedAt).toLocaleTimeString()}</p>
                  <p><strong>Total Wait Time:</strong> {getAgeMinutes(selectedRequest.requestedAt)} minutes</p>
                </div>
              </div>

              {/* Claim / Dispatch Actions */}
              {selectedRequest.status !== 'resolved' && (
                <div style={styles.actionsPanel}>
                  <h4 style={styles.sectionHeading}>Staff Triage</h4>
                  
                  <div style={styles.assignRow}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assign an available staff member or volunteer to dispatch them to the location:</p>
                    
                    <div style={styles.assignControls}>
                      <div style={styles.assignBlock}>
                        <UserPlus size={16} color="var(--text-dim)" />
                        <select 
                          onChange={(e) => handleAssignStaff(e.target.value)}
                          value={selectedRequest.assignedTo || ''}
                          style={styles.assignDropdown}
                        >
                          <option value="">-- Select Staff to Dispatch --</option>
                          {accStaff.map(s => (
                            <option key={s.id} value={s.name}>{s.name} ({s.role}) - {s.status}</option>
                          ))}
                          {selectedRequest.assignedTo && (
                            <option value={selectedRequest.assignedTo}>{selectedRequest.assignedTo}</option>
                          )}
                        </select>
                      </div>

                      <button 
                        onClick={handleResolveRequest} 
                        style={styles.resolveBtn}
                        className="btn"
                      >
                        <CheckSquare size={16} /> Resolve Request
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Log Audit */}
              <div style={styles.auditBlock}>
                <span style={styles.label}>Lifecycle Status</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selectedRequest.status === 'queued' && "Task is currently pending in queue and awaiting volunteer dispatch."}
                  {selectedRequest.status === 'in-progress' && `Staff member ${selectedRequest.assignedTo} has been dispatched and is currently en route to the zone.`}
                  {selectedRequest.status === 'resolved' && `Request successfully completed. Assisted by ${selectedRequest.assignedTo || 'Staff'}.`}
                </p>
              </div>

            </div>
          ) : (
            <div style={styles.emptyDetail} className="glass-panel">
              <HelpCircle size={40} color="var(--text-dim)" />
              <h3>No Request Selected</h3>
              <p>Choose an accessibility item from the queue list to dispatch volunteer coordinators or mark tasks as resolved.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-display)'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  logBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start'
  },
  listSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formCard: {
    padding: '16px',
    backgroundColor: 'rgba(16, 64, 38, 0.02)',
    border: '1px solid var(--border-active)'
  },
  formTitle: {
    fontSize: '1rem',
    marginBottom: '12px',
    fontFamily: 'var(--font-display)'
  },
  formRow: {
    display: 'flex',
    gap: '12px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px'
  },
  slaBanner: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    gap: '32px'
  },
  slaStat: {
    display: 'flex',
    flexDirection: 'column'
  },
  slaStatLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  slaStatVal: {
    fontSize: '1.4rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)'
  },
  slaTabs: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '12px'
  },
  slaTab: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '4px 6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  queueList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  noRequests: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
    gap: '8px'
  },
  queueItem: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemAge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem'
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  itemTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    textTransform: 'capitalize'
  },
  itemLocation: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    borderTop: '1px dashed var(--border)',
    paddingTop: '8px'
  },
  detailSection: {
    position: 'sticky',
    top: '24px'
  },
  detailCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px'
  },
  detailTitle: {
    fontSize: '1.2rem',
    fontFamily: 'var(--font-display)'
  },
  detailSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)'
  },
  detailBadgeRow: {
    display: 'flex',
    gap: '8px'
  },
  breachWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '6px',
    color: 'var(--color-danger)',
    fontSize: '0.8rem',
    lineHeight: '1.4'
  },
  descBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  descTitle: {
    fontSize: '1.4rem',
    margin: '6px 0 12px 0',
    fontFamily: 'var(--font-display)',
    textTransform: 'capitalize'
  },
  descMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  actionsPanel: {
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px'
  },
  sectionHeading: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    marginBottom: '8px'
  },
  assignRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  assignControls: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  assignBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.02)',
    border: '1px solid var(--border)',
    padding: '8px 14px',
    borderRadius: '8px',
    flex: 1,
    minWidth: '220px'
  },
  assignDropdown: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer',
    width: '100%'
  },
  resolveBtn: {
    backgroundColor: 'var(--color-success)',
    padding: '10px 16px',
    fontSize: '0.85rem'
  },
  auditBlock: {
    backgroundColor: 'var(--bg-main)',
    padding: '12px',
    borderRadius: '6px'
  },
  emptyDetail: {
    padding: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-dim)',
    gap: '12px'
  }
};
