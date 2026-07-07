import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';
import { 
  AlertTriangle, 
  UserPlus, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  Loader,
  Megaphone,
  Plus
} from 'lucide-react';

export default function Incidents({ state, onUpdateIncident, onGenerateAnnouncement, onNavigate }) {
  const { incidents, zones, staffing } = state;
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('unresolved');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Manual creation form
  const [showLogForm, setShowLogForm] = useState(false);
  const [newIncZone, setNewIncZone] = useState(zones[0]?.id || '');
  const [newIncType, setNewIncType] = useState('crowd');
  const [newIncSeverity, setNewIncSeverity] = useState('medium');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // AI Recommendation state
  const [recommendation, setRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Reset recommendation when incident changes
  useEffect(() => {
    setRecommendation(null);
    setAiError('');
    if (selectedIncident) {
      fetchRecommendation(selectedIncident.id);
    }
  }, [selectedIncident]);

  const fetchRecommendation = async (incidentId) => {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/recommend/${incidentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to get recommendation");
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setAiError("Could not retrieve AI recommendations. Ensure the API key is configured.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!newIncDesc.trim()) return;

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newIncType,
          zoneId: newIncZone,
          severity: newIncSeverity,
          description: newIncDesc
        })
      });

      if (!res.ok) throw new Error("Failed to log incident");
      const loggedInc = await res.json();
      
      // Auto-update parent state locally or trigger parent reload
      onUpdateIncident(loggedInc);
      setSelectedIncident(loggedInc);
      setShowLogForm(false);
      setNewIncDesc('');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleAssignVolunteer = async (volunteerName) => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents/${selectedIncident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: volunteerName })
      });
      if (!res.ok) throw new Error("Failed to assign staff");
      const updated = await res.json();
      onUpdateIncident(updated);
      setSelectedIncident(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents/${selectedIncident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      onUpdateIncident(updated);
      setSelectedIncident(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateAnnouncementShortcut = () => {
    if (!selectedIncident) return;
    onGenerateAnnouncement(selectedIncident);
    onNavigate('announcements');
  };

  // Filter incidents list
  const filteredIncidents = incidents.filter(inc => {
    const matchStatus = statusFilter === 'all' || 
                        (statusFilter === 'unresolved' && inc.status !== 'resolved') ||
                        (statusFilter === inc.status);
    const matchType = typeFilter === 'all' || inc.type === typeFilter;
    return matchStatus && matchType;
  });

  // Get available volunteers
  const availableStaff = staffing.filter(s => s.status === 'available');

  return (
    <div className="page-container">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Incident Operations Center</h1>
          <p style={styles.subtitle}>Prioritized Event Log & AI Triage Assistant</p>
        </div>
        <button 
          style={styles.logBtn} 
          onClick={() => setShowLogForm(!showLogForm)}
          className="btn"
        >
          <Plus size={16} /> Log New Incident
        </button>
      </div>

      <div style={styles.layout}>
        {/* Left Side: Incidents List & Filters */}
        <div style={styles.listSection}>
          {/* Form to log incident */}
          {showLogForm && (
            <form style={styles.formCard} className="glass-panel" onSubmit={handleCreateIncident}>
              <h3 style={styles.formTitle}>Log Incident</h3>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Zone Location</label>
                  <select 
                    value={newIncZone} 
                    onChange={(e) => setNewIncZone(e.target.value)}
                    className="input-field"
                  >
                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select 
                    value={newIncType} 
                    onChange={(e) => setNewIncType(e.target.value)}
                    className="input-field"
                  >
                    <option value="crowd">Crowd / Congestion</option>
                    <option value="medical">Medical Urgent</option>
                    <option value="security">Security</option>
                    <option value="facilities">Facilities Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Severity</label>
                  <select 
                    value={newIncSeverity} 
                    onChange={(e) => setNewIncSeverity(e.target.value)}
                    className="input-field"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Severity</option>
                  </select>
                </div>
              </div>
              <div style={{ ...styles.formGroup, marginTop: '12px' }}>
                <label style={styles.label}>Operational Description</label>
                <textarea 
                  value={newIncDesc} 
                  onChange={(e) => setNewIncDesc(e.target.value)}
                  placeholder="Describe the situation clearly..." 
                  className="input-field"
                  rows={3}
                  required
                />
              </div>
              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowLogForm(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn" disabled={creating}>
                  {creating ? <Loader size={16} className="spin" /> : 'Log Event'}
                </button>
              </div>
            </form>
          )}

          {/* Filters Bar */}
          <div style={styles.filterBar} className="glass-panel scroll-reveal">
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>Status:</span>
              <button 
                onClick={() => setStatusFilter('unresolved')} 
                style={{ ...styles.filterTab, borderBottomColor: statusFilter === 'unresolved' ? 'var(--primary)' : 'transparent' }}
              >
                Active
              </button>
              <button 
                onClick={() => setStatusFilter('resolved')} 
                style={{ ...styles.filterTab, borderBottomColor: statusFilter === 'resolved' ? 'var(--primary)' : 'transparent' }}
              >
                Resolved
              </button>
              <button 
                onClick={() => setStatusFilter('all')} 
                style={{ ...styles.filterTab, borderBottomColor: statusFilter === 'all' ? 'var(--primary)' : 'transparent' }}
              >
                All
              </button>
            </div>
            
            <div style={styles.filterGroup}>
              <span style={styles.filterLabel}>Type:</span>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                style={styles.typeDropdown}
              >
                <option value="all">All Types</option>
                <option value="crowd">Crowd</option>
                <option value="medical">Medical</option>
                <option value="security">Security</option>
                <option value="facilities">Facilities</option>
              </select>
            </div>
          </div>

          {/* List items */}
          <div style={styles.incidentsList}>
            {filteredIncidents.length === 0 ? (
              <div style={styles.noIncidents} className="glass-panel">
                <AlertTriangle size={24} color="var(--text-dim)" />
                <p>No incidents match the selected filters.</p>
              </div>
            ) : (
              filteredIncidents.map((inc) => {
                const zone = zones.find(z => z.id === inc.zoneId);
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <div 
                    key={inc.id} 
                    onClick={() => setSelectedIncident(inc)}
                    className="glass-panel incident-item scroll-reveal"
                    style={{
                      ...styles.incidentItem,
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)'
                    }}
                  >
                    <div style={styles.itemHeader}>
                      <span className={`status-badge ${inc.severity}`}>{inc.severity.toUpperCase()} +</span>
                      <span style={styles.itemId}>{inc.id.toUpperCase()}</span>
                    </div>
                    <p style={styles.itemDesc}>{inc.description}</p>
                    <div style={styles.itemMeta}>
                      <span>Zone: {zone?.name || inc.zoneId}</span>
                      <span style={{ textTransform: 'capitalize' }}>Status: {inc.status}</span>
                      <span>{inc.assignedTo ? `Owner: ${inc.assignedTo}` : 'Unassigned'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Incident Detail & AI Assistant */}
        <div style={styles.detailSection}>
          {selectedIncident ? (
            <div style={styles.detailCard} className="glass-panel scroll-reveal">
              
              {/* Detail Header */}
              <div style={styles.detailHeader}>
                <div>
                  <h3 style={styles.detailTitle}>Incident Triage Report</h3>
                  <p style={styles.detailSubtitle}>ID: {selectedIncident.id.toUpperCase()}</p>
                </div>
                <div style={styles.detailBadgeRow}>
                  <span className={`status-badge ${selectedIncident.severity}`}>{selectedIncident.severity.toUpperCase()} +</span>
                  <span className={`status-badge ${selectedIncident.status}`}>{selectedIncident.status.toUpperCase()} +</span>
                </div>
              </div>

              {/* Description */}
              <div style={styles.detailDescBlock}>
                <p style={styles.sectionHeading}>Description</p>
                <p style={styles.detailDescText}>{selectedIncident.description}</p>
                <div style={styles.detailDescMeta}>
                  <span>Zone: {zones.find(z => z.id === selectedIncident.zoneId)?.name || selectedIncident.zoneId}</span>
                  <span>Logged: {new Date(selectedIncident.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Actions Section */}
              {selectedIncident.status !== 'resolved' && (
                <div style={styles.actionsPanel}>
                  <p style={styles.sectionHeading}>Operations Control</p>
                  <div style={styles.actionsRow}>
                    
                    {/* Volunteer Assign Dropdown */}
                    <div style={styles.assignBlock}>
                      <UserPlus size={16} color="var(--text-muted)" />
                      <select 
                        onChange={(e) => handleAssignVolunteer(e.target.value)}
                        value={selectedIncident.assignedTo || ''}
                        style={styles.assignDropdown}
                      >
                        <option value="">-- Assign Volunteer / Staff --</option>
                        {availableStaff.map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                        ))}
                        {selectedIncident.assignedTo && (
                          <option value={selectedIncident.assignedTo}>{selectedIncident.assignedTo}</option>
                        )}
                      </select>
                    </div>

                    <div style={styles.btnControls}>
                      {selectedIncident.status === 'open' && (
                        <button onClick={() => handleUpdateStatus('in-progress')} className="btn btn-secondary btn-sm">
                          Set In-Progress
                        </button>
                      )}
                      <button onClick={() => handleUpdateStatus('resolved')} className="btn btn-sm" style={{ backgroundColor: 'var(--color-success)' }}>
                        <CheckCircle size={14} /> Resolve Incident
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* AI Triage Copilot Recommendation */}
              <div style={styles.aiPanel}>
                <div style={styles.aiHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--accent)" />
                    <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>GenAI Triage Recommendation</strong>
                  </div>
                  {aiLoading && <Loader size={14} className="spin" />}
                </div>

                {aiLoading ? (
                  <div style={styles.aiLoadingBlock}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing incident factors, crowd metrics, transport alerts, and staff load...</p>
                  </div>
                ) : aiError ? (
                  <div style={styles.aiErrorBlock}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>{aiError}</p>
                    <button style={styles.retryBtn} onClick={() => fetchRecommendation(selectedIncident.id)}>Retry</button>
                  </div>
                ) : recommendation ? (
                  <div style={styles.recommendationContent}>
                    
                    <div style={styles.recItem}>
                      <span style={styles.recLabel}>What is happening</span>
                      <p style={styles.recValue}>{recommendation.whatIsHappening}</p>
                    </div>

                    <div style={styles.recItem}>
                      <span style={styles.recLabel}>Why it matters</span>
                      <p style={styles.recValue}>{recommendation.whyItMatters}</p>
                    </div>

                    <div style={styles.recItem}>
                      <span style={styles.recLabel}>Recommended action</span>
                      <p style={{ ...styles.recValue, color: 'var(--text-main)', borderLeft: '2px solid var(--primary)', paddingLeft: '8px' }}>
                        {recommendation.recommendedAction}
                      </p>
                    </div>

                    <div style={styles.recFooterRow}>
                      <div style={styles.recMetaItem}>
                        <span style={styles.recLabel}>Suggested role</span>
                        <strong>{recommendation.suggestedOwnerRole}</strong>
                      </div>
                      
                      {recommendation.announcementNeeded && selectedIncident.status !== 'resolved' && (
                        <button 
                          onClick={handleCreateAnnouncementShortcut} 
                          style={styles.announceShortcutBtn}
                          className="btn btn-sm btn-secondary"
                        >
                          <Megaphone size={14} color="var(--color-info)" /> Generate Announcement
                        </button>
                      )}
                    </div>

                  </div>
                ) : (
                  <div style={styles.aiLoadingBlock}>
                    <HelpCircle size={20} color="var(--text-dim)" />
                    <p style={{ fontSize: '0.85rem' }}>Select an incident to view automatic AI triage suggestions.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div style={styles.emptyDetail} className="glass-panel">
              <HelpCircle size={40} color="var(--text-dim)" />
              <h3>No Incident Selected</h3>
              <p>Choose an incident from the log feed to inspect its details, assign volunteer staff, and view GenAI triage suggestions.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .incident-item {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .incident-item:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border-color: var(--border-active);
          transform: translateX(4px);
        }
      `}</style>
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
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    fontSize: '0.85rem'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  filterLabel: {
    color: 'var(--text-dim)',
    fontWeight: '500'
  },
  filterTab: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '4px 6px',
    fontSize: '0.85rem',
    fontWeight: '550',
    transition: 'all 0.2s'
  },
  typeDropdown: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '0.8rem',
    outline: 'none'
  },
  formCard: {
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '12px'
  },
  incidentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  noIncidents: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
    gap: '8px'
  },
  incidentItem: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemId: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-dim)',
    fontWeight: '600'
  },
  itemDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.4',
    color: 'var(--text-main)'
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    borderTop: '1px dashed rgba(255,255,255,0.05)',
    paddingTop: '8px',
    marginTop: '4px'
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
  sectionHeading: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    marginBottom: '6px'
  },
  detailDescBlock: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid var(--border)'
  },
  detailDescText: {
    fontSize: '0.9rem',
    lineHeight: '1.4',
    marginBottom: '8px'
  },
  detailDescMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-dim)'
  },
  actionsPanel: {
    borderBottom: '1px solid var(--border)',
    paddingBottom: '16px'
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  assignBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border)',
    padding: '6px 12px',
    borderRadius: '6px'
  },
  assignDropdown: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer'
  },
  btnControls: {
    display: 'flex',
    gap: '8px'
  },
  btnSm: {
    padding: '6px 12px',
    fontSize: '0.8rem'
  },
  aiPanel: {
    background: 'rgba(139, 92, 246, 0.03)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  aiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    paddingBottom: '8px'
  },
  aiLoadingBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    gap: '8px',
    color: 'var(--text-dim)'
  },
  aiErrorBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    textAlign: 'center',
    gap: '8px'
  },
  retryBtn: {
    background: 'none',
    border: '1px solid var(--color-danger)',
    color: 'var(--color-danger)',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  recommendationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  recItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  recLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '500'
  },
  recValue: {
    fontSize: '0.85rem',
    lineHeight: '1.4',
    color: 'var(--text-muted)'
  },
  recFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '10px',
    marginTop: '4px'
  },
  recMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.8rem'
  },
  announceShortcutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '6px 10px'
  }
};
