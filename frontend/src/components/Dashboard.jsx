import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock, 
  Accessibility, 
  Bus, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function Dashboard({ 
  state, 
  onNavigate, 
  onTriggerGateB, 
  onTriggerAccessibility, 
  onResetState 
}) {
  const { zones, incidents, accessibilityRequests, transportAlerts, staffing } = state;
  const [selectedPitchZone, setSelectedPitchZone] = useState(null);
  const [simTab, setSimTab] = useState('thriving');
  const [dismissedNudges, setDismissedNudges] = useState([]);

  // Filter unresolved items
  const openIncidents = incidents.filter(i => i.status !== 'resolved');
  const openAccRequests = accessibilityRequests.filter(r => r.status !== 'resolved');

  // Helper: calculate SLA styling
  const isSlaExceeded = (requestedAt) => {
    const minutes = Math.floor((Date.now() - new Date(requestedAt)) / 60000);
    return minutes > 30; // 30 minutes SLA
  };

  // Helper: Get status color class
  const getCongestionClass = (level) => {
    switch (level) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  };

  // Helper: Count staff in a zone
  const getStaffCount = (zoneId) => {
    return staffing.filter(s => s.zoneId === zoneId).length;
  };

  // Determine active AI nudge based on live state
  const getAiNudgeContent = () => {
    const hasGateB = zones.some(z => z.id === 'zone-gateB' && z.congestionLevel === 'critical');
    const hasAccSla = openAccRequests.some(r => isSlaExceeded(r.requestedAt));
    
    if (hasGateB) {
      return {
        id: 'nudge-gateB',
        title: "Gemini Safety Nudge",
        message: "Gate B turnstiles congested. Dispatch Comm volunteers to redirect Gate B arrivals to Gate A?",
        savings: "Est. Savings: 15m Queue Reduction = 4 Vol. Freed",
        actionText: "Accept Dispatch",
        onAccept: () => {
          onTriggerGateB(); 
          alert("Safety Directive Accepted: Dispatching Comm volunteers to Gate B.");
        }
      };
    } else if (hasAccSla) {
      return {
        id: 'nudge-accSla',
        title: "Gemini Staff Nudge",
        message: "Accessibility SLA breached in Seating Bowl. Reassign 2 volunteers from Gate D to Seating Bowl?",
        savings: "Est. Savings: 22m waiting time reduction = SLA Secured",
        actionText: "Reassign Staff",
        onAccept: () => {
          alert("Staff Directive Accepted: Reassigning 2 volunteers to Seating Bowl.");
        }
      };
    } else {
      return {
        id: 'nudge-normal',
        title: "Gemini Operations Tip",
        message: "Maintain Gate D open stance to balance oncoming post-match spectator egress load.",
        savings: "Est. Savings: Optimal post-match egress flow",
        actionText: "Maintain Stance",
        onAccept: () => {
          alert("Operational directive logged.");
        }
      };
    }
  };

  const currentNudge = getAiNudgeContent();

  return (
    <div className="page-container" role="region" aria-label="Stadium Operations Dashboard">
      {/* Living Stadium State interactive simulation panel */}
      <div style={styles.livingStadiumCard} className="glass-panel" role="region" aria-label="Living Stadium Simulation">
        <div style={styles.livingStadiumHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🏟️</span>
            <div style={{ textAlign: 'left' }}>
              <h3 style={styles.livingStadiumTitle}>Living Stadium Operations</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive match day system health simulation</p>
            </div>
          </div>

          <div style={styles.livingStadiumTabs}>
            <button 
              className={`clay-btn ${simTab === 'thriving' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
              onClick={() => {
                onResetState();
                setSimTab('thriving');
              }}
              style={{ fontSize: '0.7rem', padding: '6px 12px' }}
              aria-label="Switch to matchday ready healthy state"
              aria-pressed={simTab === 'thriving'}
            >
              ⚽ Matchday Ready
            </button>
            <button 
              className={`clay-btn ${simTab === 'critical' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
              onClick={() => {
                onTriggerGateB();
                onTriggerAccessibility();
                setSimTab('critical');
              }}
              style={{ fontSize: '0.7rem', padding: '6px 12px' }}
              aria-label="Trigger congested bottleneck crisis scenario"
              aria-pressed={simTab === 'critical'}
            >
              ⚠️ Critical State
            </button>
          </div>
        </div>

        <div style={styles.livingStadiumBody}>
          <div style={styles.livingStadiumLeft}>
            {simTab === 'thriving' ? (
              <div style={styles.livingStadiumStatusThriving}>
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🏆</div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '800', color: 'var(--primary)' }}>THRIVING SYSTEM HEALTH</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Gates are operating normally. Fans are entering smoothly with minimal waiting times. Volunteer dispatch counts are optimal.
                </p>
              </div>
            ) : (
              <div style={styles.livingStadiumStatusCritical}>
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🚨</div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '800', color: 'var(--color-danger)' }}>CRITICAL SYSTEM HEALTH</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Queue times are exceeding SLAs. Congestion bottlenecks detected at Gate B. Multiple incidents require volunteer dispatch.
                </p>
              </div>
            )}
          </div>

          <div style={styles.livingStadiumRight}>
            <div style={styles.livingStadiumStatBlock}>
              <span style={styles.livingStadiumStatLabel}>System Health Score</span>
              <span style={{ 
                fontSize: '1.8rem', 
                fontWeight: '900', 
                color: simTab === 'thriving' ? 'var(--primary)' : 'var(--color-danger)', 
                fontFamily: 'var(--font-mono)' 
              }}>
                {simTab === 'thriving' ? '98%' : '64%'}
              </span>
            </div>
            
            <div style={styles.livingStadiumStatBlock}>
              <span style={styles.livingStadiumStatLabel}>Crowd Flow</span>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: '800', 
                color: simTab === 'thriving' ? 'var(--text-main)' : 'var(--accent)',
                fontFamily: 'var(--font-mono)' 
              }}>
                {simTab === 'thriving' ? 'STEADY (98%)' : 'CONGESTED (62%)'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', width: '100%' }}>
              {simTab === 'critical' && (
                <>
                  <button 
                    onClick={onTriggerAccessibility} 
                    className="clay-btn clay-btn-secondary"
                    style={{ flex: 1, fontSize: '0.65rem', padding: '6px' }}
                    title="Escalate wheelchair escorts wait times"
                  >
                    ♿ Urgent Access
                  </button>
                  <button 
                    onClick={onTriggerGateB} 
                    className="clay-btn clay-btn-secondary"
                    style={{ flex: 1, fontSize: '0.65rem', padding: '6px' }}
                    title="Simulate Gate B congestion again"
                  >
                    💥 Gate B Cong.
                  </button>
                </>
              )}
              <button 
                onClick={() => {
                  onResetState();
                  setSimTab('thriving');
                }} 
                className="clay-btn clay-btn-secondary"
                style={{ flex: simTab === 'thriving' ? 1 : 'none', fontSize: '0.65rem', padding: '6px 12px' }}
              >
                <RotateCcw size={12} /> Reset State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={styles.grid}>
        
        {/* Left Column - Zone Grid (Crowd Management Focus) */}
        <div style={styles.leftCol}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Stadium Zone Monitor</h2>
            <span style={styles.zoneSubtitle}>Live Occupancy & Congestion Grid</span>
          </div>
          
          <div style={styles.zoneGrid} role="list" aria-label="Stadium zone status cards">
            {zones.map((zone) => {
              const congClass = getCongestionClass(zone.congestionLevel);
              const isCrit = zone.congestionLevel === 'critical';
              const isHigh = zone.congestionLevel === 'high';
              const tierClass = isCrit ? 'red-tier' : isHigh ? 'gold-tier' : 'green-tier';
              
              // Short name (e.g. GATE B)
              const cardName = zone.name.split(' - ')[0].toUpperCase();
              const subName = zone.name.split(' - ')[1] || 'Entry';
              
              return (
                <div 
                  key={zone.id} 
                  className={`fut-card ${tierClass} zone-card scroll-reveal ${isCrit ? 'pulse-critical' : ''}`}
                  style={{
                    ...styles.zoneCard,
                    borderColor: isCrit ? 'var(--color-danger)' : isHigh ? 'var(--accent)' : 'rgba(212, 175, 55, 0.3)'
                  }}
                  role="listitem"
                  aria-label={`${zone.name}: ${zone.congestionLevel} congestion, ${zone.capacityPercent}% capacity, ${getStaffCount(zone.id)} staff assigned`}
                  tabIndex={0}
                >
                  {/* FUT Top Row */}
                  <div style={styles.futZoneTop}>
                    <div style={styles.futZoneRatingCol}>
                      <span style={styles.futZoneRating}>{zone.capacityPercent}</span>
                      <span style={styles.futZonePos}>CAP</span>
                    </div>
                    <span className={`status-badge ${congClass}`} style={{ fontSize: '0.62rem', padding: '3px 6px' }}>
                      {zone.congestionLevel}
                    </span>
                  </div>

                  {/* FUT Name */}
                  <div style={styles.futZoneName}>
                    {cardName}
                  </div>

                  <div style={styles.futDivider} />

                  {/* Zone Stats Grid */}
                  <div style={styles.futZoneStats}>
                    <div style={styles.futZoneStatItem}>
                      <span style={styles.futZoneStatVal}>{getStaffCount(zone.id)}</span>
                      <span style={styles.futZoneStatName}>STF</span>
                    </div>
                    <div style={styles.futZoneStatItem}>
                      <span style={styles.futZoneStatVal}>{zone.id.split('-')[1].toUpperCase()}</span>
                      <span style={styles.futZoneStatName}>LOC</span>
                    </div>
                    <div style={styles.futZoneStatItem}>
                      <span style={styles.futZoneStatVal}>30M</span>
                      <span style={styles.futZoneStatName}>SLA</span>
                    </div>
                    <div style={styles.futZoneStatItem}>
                      <span style={styles.futZoneStatVal}>{zone.capacityPercent > 85 ? 'HI' : 'OK'}</span>
                      <span style={styles.futZoneStatName}>FLO</span>
                    </div>
                  </div>

                  {/* Full Zone Name Footer */}
                  <div style={styles.futZoneFooter}>
                    {subName}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive FIFA Pitch Map */}
          <div style={{ marginTop: '24px' }} className="scroll-reveal">
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Interactive FIFA Field Map</h2>
              <span style={styles.zoneSubtitle}>Click gates or stands to inspect crowd dynamics</span>
            </div>
            
            <div className="pitch-container">
              {/* Field Lines */}
              <div className="pitch-field">
                <div className="pitch-center-line" />
                <div className="pitch-center-circle" />
                <div className="pitch-penalty-left" />
                <div className="pitch-penalty-right" />
              </div>
              
              {/* Hotspots */}
              {zones.map((zone) => {
                const positionStyle = getHotspotPosition(zone.id);
                const congClass = getCongestionClass(zone.congestionLevel);
                const activeIncs = openIncidents.filter(i => i.zoneId === zone.id);
                const isSelected = selectedPitchZone === zone.id;
                
                return (
                  <div 
                    key={zone.id}
                    onClick={() => setSelectedPitchZone(zone.id === selectedPitchZone ? null : zone.id)}
                    className={`pitch-hotspot-wrapper ${isSelected ? 'selected' : ''}`}
                    style={positionStyle}
                  >
                    <div className={`pitch-hotspot-circle ${congClass}`}>
                      {zone.id.split('-')[1].charAt(4).toUpperCase() || 'S'}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="hotspot-tooltip">
                      <div style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-main)' }}>{zone.name}</div>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', width: '100%', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span>Congestion:</span>
                        <span className={`status-badge ${congClass}`} style={{ fontSize: '0.6rem', padding: '2px 5px' }}>
                          {zone.congestionLevel.toUpperCase()} +
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span>Capacity:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{zone.capacityPercent}%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span>Staff:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{getStaffCount(zone.id)} Deployed</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span>Incidents:</span>
                        <span style={{ color: activeIncs.length > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: '700' }}>
                          {activeIncs.length} Active
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Selected Zone Detail Panel */}
            {selectedPitchZone && (
              <div style={styles.pitchDetailCard} className="glass-panel slide-in">
                {(() => {
                  const z = zones.find(zone => zone.id === selectedPitchZone);
                  const activeIncs = openIncidents.filter(i => i.zoneId === z.id);
                  const congClass = getCongestionClass(z.congestionLevel);
                  return (
                    <>
                      <div style={styles.pitchDetailHeader}>
                        <h4 style={styles.pitchDetailTitle}>{z.name}</h4>
                        <span className={`status-badge ${congClass}`} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
                          {z.congestionLevel.toUpperCase()} +
                        </span>
                      </div>
                      <div style={styles.pitchDetailGrid}>
                        <div style={styles.pitchDetailItem}>
                          <span style={styles.pitchDetailLabel}>Current Capacity</span>
                          <span style={styles.pitchDetailVal}>{z.capacityPercent}%</span>
                        </div>
                        <div style={styles.pitchDetailItem}>
                          <span style={styles.pitchDetailLabel}>Assigned Staff</span>
                          <span style={styles.pitchDetailVal}>{getStaffCount(z.id)} volunteers</span>
                        </div>
                        <div style={styles.pitchDetailItem}>
                          <span style={styles.pitchDetailLabel}>Flow Rate</span>
                          <span style={styles.pitchDetailVal}>{z.capacityPercent > 85 ? 'CONGESTED' : 'STEADY'}</span>
                        </div>
                        <div style={styles.pitchDetailItem}>
                          <span style={styles.pitchDetailLabel}>Active Events</span>
                          <span style={styles.pitchDetailVal} style={{ color: activeIncs.length > 0 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                            {activeIncs.length} pending
                          </span>
                        </div>
                      </div>
                      {activeIncs.length > 0 && (
                        <div style={styles.pitchIncidentsList}>
                          <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-danger)', marginBottom: '8px' }}>Active Incidents in this Sector:</p>
                          {activeIncs.map(inc => (
                            <div key={inc.id} style={styles.pitchIncidentRow}>
                              <span style={{ color: 'var(--color-danger)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>[{inc.severity.toUpperCase()} +]</span>
                              <span>{inc.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Incident Feed & Accessibility snapshots */}
        <div style={styles.rightCol}>
          
          {/* AI Quick Nudge Widget (CarbonCoach Gemini Card Style) */}
          {!dismissedNudges.includes(currentNudge.id) && (
            <div style={styles.aiNudgeCard} className="glass-panel scroll-reveal">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={styles.aiNudgeIcon}>AI</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h4 style={styles.aiNudgeTitle}>{currentNudge.title}</h4>
                  <p style={styles.aiNudgeMessage}>"{currentNudge.message}"</p>
                  
                  <div style={styles.aiNudgeSavings}>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{currentNudge.savings}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button 
                      onClick={() => {
                        currentNudge.onAccept();
                        setDismissedNudges([...dismissedNudges, currentNudge.id]);
                      }} 
                      className="clay-btn clay-btn-primary"
                      style={{ fontSize: '0.68rem', padding: '6px 12px' }}
                    >
                      {currentNudge.actionText}
                    </button>
                    <button 
                      onClick={() => setDismissedNudges([...dismissedNudges, currentNudge.id])} 
                      className="clay-btn clay-btn-secondary"
                      style={{ fontSize: '0.68rem', padding: '6px 12px' }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Incidents Snapshot */}
          <div style={styles.panel} className="glass-panel scroll-reveal">
            <div style={styles.panelHeader}>
              <div style={styles.panelTitleWrapper}>
                <AlertTriangle size={18} color="var(--color-danger)" />
                <h3 style={styles.panelTitle}>Active Incidents ({openIncidents.length})</h3>
              </div>
              <button onClick={() => onNavigate('incidents')} style={styles.viewAllBtn}>
                Manage <ArrowRight size={14} />
              </button>
            </div>
            
            <div style={styles.panelContent}>
              {openIncidents.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🎉</div>
                  <p>All clear. No active incidents reported.</p>
                </div>
              ) : (
                <div style={styles.list}>
                  {openIncidents.slice(0, 4).map((inc) => (
                    <div key={inc.id} style={styles.listItem} onClick={() => onNavigate('incidents')}>
                      <div style={styles.listBadgeRow}>
                        <span className={`status-badge ${inc.severity}`}>
                          {inc.severity.toUpperCase()} +
                        </span>
                        <span style={styles.listAge}>
                          <Clock size={12} />
                          {Math.floor((Date.now() - new Date(inc.createdAt)) / 60000)}m ago
                        </span>
                      </div>
                      <p style={styles.listDesc}>{inc.description}</p>
                      <div style={styles.listFooter}>
                        <span>Zone: {zones.find(z => z.id === inc.zoneId)?.name || inc.zoneId}</span>
                        <span style={{ color: inc.assignedTo ? 'var(--color-success)' : 'var(--color-warning)' }}>
                          {inc.assignedTo ? `Assigned: ${inc.assignedTo}` : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Accessibility Queue Snapshot */}
          <div style={styles.panel} className="glass-panel scroll-reveal">
            <div style={styles.panelHeader}>
              <div style={styles.panelTitleWrapper}>
                <Accessibility size={18} color="var(--color-success)" />
                <h3 style={styles.panelTitle}>Accessibility Requests ({openAccRequests.length})</h3>
              </div>
              <button onClick={() => onNavigate('accessibility')} style={styles.viewAllBtn}>
                Queue <ArrowRight size={14} />
              </button>
            </div>
            
            <div style={styles.panelContent}>
              {openAccRequests.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>♿</div>
                  <p>No pending accessibility requests.</p>
                </div>
              ) : (
                <div style={styles.list}>
                  {openAccRequests.slice(0, 3).map((req) => {
                    const isExceeded = isSlaExceeded(req.requestedAt);
                    const ageMins = Math.floor((Date.now() - new Date(req.requestedAt)) / 60000);
                    return (
                      <div 
                        key={req.id} 
                        style={{
                          ...styles.listItem,
                          borderColor: isExceeded ? 'var(--color-danger)' : 'var(--border)'
                        }}
                        onClick={() => onNavigate('accessibility')}
                      >
                        <div style={styles.listBadgeRow}>
                          <span className={`status-badge ${req.urgency}`}>
                            {req.urgency.toUpperCase()} +
                          </span>
                          <span style={{ ...styles.listAge, color: isExceeded ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                            <Clock size={12} />
                            {ageMins}m {isExceeded ? '(! SLA)' : ''}
                          </span>
                        </div>
                        <p style={styles.listDesc}>
                          <strong>{req.type.toUpperCase()}</strong> assistance requested in {zones.find(z => z.id === req.zoneId)?.name || req.zoneId}
                        </p>
                        <div style={styles.listFooter}>
                          <span>SLA Target: 30m</span>
                          <span>{req.assignedTo ? `En Route: ${req.assignedTo}` : 'Awaiting Staff'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Transport Alerts Snapshot */}
          <div style={styles.panel} className="glass-panel scroll-reveal">
            <div style={styles.panelHeader}>
              <div style={styles.panelTitleWrapper}>
                <Bus size={18} color="var(--color-info)" />
                <h3 style={styles.panelTitle}>Active Transport Alerts ({transportAlerts.length})</h3>
              </div>
            </div>
            
            <div style={styles.panelContent}>
              {transportAlerts.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>All shuttle services running normally.</p>
                </div>
              ) : (
                <div style={styles.transportList}>
                  {transportAlerts.map((alert) => (
                    <div key={alert.id} style={styles.transportItem}>
                      <Bus size={16} color="var(--color-info)" />
                      <div style={styles.transportDetails}>
                        <div style={styles.transportHeaderRow}>
                          <strong style={{ fontSize: '0.85rem' }}>{alert.route}</strong>
                          <span style={styles.delayBadge}>{alert.estimatedDelayMinutes}m delay</span>
                        </div>
                        <p style={styles.transportText}>
                          Impacts zone: {zones.find(z => z.id === alert.affectedZoneId)?.name || alert.affectedZoneId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  simBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    marginBottom: '24px',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    border: '1px dashed var(--border-active)',
    flexWrap: 'wrap',
    gap: '12px'
  },
  simLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-display)'
  },
  simActions: {
    display: 'flex',
    gap: '10px'
  },
  simBtn: {
    padding: '6px 12px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '24px',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionHeader: {
    marginBottom: '8px'
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '600'
  },
  zoneSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  zoneGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px'
  },
  zoneCard: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'default',
    minHeight: '260px'
  },
  futZoneTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: '0 4px',
    marginBottom: '8px'
  },
  futZoneRatingCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    lineHeight: '1.1'
  },
  futZoneRating: {
    fontSize: '1.6rem',
    fontWeight: '900',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-main)'
  },
  futZonePos: {
    fontSize: '0.6rem',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)'
  },
  futZoneName: {
    fontSize: '1rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em',
    color: 'var(--text-main)',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '8px'
  },
  futDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.08) 50%, transparent 90%)',
    width: '100%',
    marginBottom: '10px'
  },
  futZoneStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '6px 12px',
    padding: '0 8px',
    width: '100%',
    marginBottom: '10px'
  },
  futZoneStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    justifyContent: 'flex-start'
  },
  futZoneStatVal: {
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  futZoneStatName: {
    color: 'var(--text-muted)',
    fontSize: '0.65rem'
  },
  futZoneFooter: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    marginTop: 'auto',
    textAlign: 'center',
    paddingTop: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)'
  },
  zoneHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  zoneName: {
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    fontSize: '1rem'
  },
  zoneMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  metricVal: {
    fontSize: '1.5rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)'
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '2px'
  },
  progressBar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease-out'
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border)',
    paddingTop: '10px',
    marginTop: '4px'
  },
  subMetric: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  subMetricVal: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  panel: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px'
  },
  panelTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  panelTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)'
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-hover)',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s'
  },
  panelContent: {
    minHeight: '80px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    color: 'var(--text-dim)',
    fontSize: '0.85rem'
  },
  emptyIcon: {
    fontSize: '1.5rem',
    marginBottom: '8px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  listItem: {
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px',
    background: 'rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  listBadgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listAge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  listDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    lineHeight: '1.4'
  },
  listFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    borderTop: '1px dashed var(--border)',
    paddingTop: '6px',
    marginTop: '2px'
  },
  transportList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  transportItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    background: 'rgba(6, 182, 212, 0.05)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    borderRadius: '8px'
  },
  transportDetails: {
    flex: 1
  },
  transportHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px'
  },
  delayBadge: {
    fontSize: '0.7rem',
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--color-danger)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600'
  },
  transportText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  pitchDetailCard: {
    padding: '16px',
    marginTop: '16px',
    borderRadius: '12px',
    textAlign: 'left'
  },
  pitchDetailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  pitchDetailTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-main)',
    margin: '0'
  },
  pitchDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  pitchDetailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  pitchDetailLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  pitchDetailVal: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-mono)'
  },
  pitchIncidentsList: {
    marginTop: '14px',
    paddingTop: '12px',
    borderTop: '1px dashed var(--border)'
  },
  pitchIncidentRow: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--text-main)',
    marginBottom: '4px',
    alignItems: 'center'
  },
  
  // Living Stadium State Widget Styles
  livingStadiumCard: {
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    border: '1.5px solid rgba(212, 175, 55, 0.15)',
    borderRadius: '16px',
    background: 'rgba(5, 8, 20, 0.4)'
  },
  livingStadiumHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '14px'
  },
  livingStadiumTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-main)',
    margin: '0 0 2px 0'
  },
  livingStadiumTabs: {
    display: 'flex',
    gap: '8px'
  },
  livingStadiumBody: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '20px',
    alignItems: 'stretch'
  },
  livingStadiumLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'left'
  },
  livingStadiumStatusThriving: {
    display: 'flex',
    flexDirection: 'column'
  },
  livingStadiumStatusCritical: {
    display: 'flex',
    flexDirection: 'column'
  },
  livingStadiumRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'left'
  },
  livingStadiumStatBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  livingStadiumStatLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  // AI Quick Nudge Card (CarbonCoach Style)
  aiNudgeCard: {
    padding: '16px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '14px',
    background: 'rgba(212, 175, 55, 0.02)',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.08), 0 4px 14px rgba(212, 175, 55, 0.06)',
    marginBottom: '20px'
  },
  aiNudgeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(180deg, #f0ca4d 0%, #d4af37 100%)',
    color: '#0a0e1a',
    fontFamily: 'var(--font-display)',
    fontWeight: '900',
    fontSize: '0.8rem',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 10px rgba(212, 175, 55, 0.2)',
    flexShrink: 0
  },
  aiNudgeTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0'
  },
  aiNudgeMessage: {
    fontSize: '0.8rem',
    color: 'var(--text-main)',
    lineHeight: '1.4',
    margin: '0 0 8px 0',
    fontStyle: 'italic'
  },
  aiNudgeSavings: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)'
  }
};

const getHotspotPosition = (zoneId) => {
  switch (zoneId) {
    case 'zone-gateA': 
      return { top: '5%', left: '50%', transform: 'translateX(-50%)' };
    case 'zone-gateB': 
      return { top: '50%', right: '4%', transform: 'translateY(-50%)' };
    case 'zone-gateC': 
      return { bottom: '5%', left: '50%', transform: 'translateX(-50%)' };
    case 'zone-gateD': 
      return { top: '50%', left: '4%', transform: 'translateY(-50%)' };
    case 'zone-seating': 
      return { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' };
    default: 
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
};
