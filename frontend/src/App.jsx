import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config.js';
import { 
  Shield, 
  Users, 
  Accessibility, 
  Megaphone, 
  FileText, 
  Bot, 
  LogOut,
  Bell
} from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Incidents from './components/Incidents';
import AccessibilityComponent from './components/Accessibility';
import Announcements from './components/Announcements';
import Handoff from './components/Handoff';
import Copilot from './components/Copilot';

export default function App() {
  const [role, setRole] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const getRoleCardInfo = (roleName) => {
    switch (roleName) {
      case 'ops-manager': return { rating: 94, pos: 'MGR', tier: 'gold' };
      case 'volunteer-coordinator': return { rating: 91, pos: 'COOR', tier: 'gold' };
      case 'accessibility-staff': return { rating: 95, pos: 'ACC', tier: 'green' };
      case 'comms-staff': return { rating: 89, pos: 'COMM', tier: 'green' };
      default: return { rating: 90, pos: 'STAFF', tier: 'green' };
    }
  };

  const cardInfo = getRoleCardInfo(role);
  
  // Incident shortcut state for Announcements
  const [activeIncidentShortcut, setActiveIncidentShortcut] = useState(null);

  // Live state from backend
  const [state, setState] = useState({
    zones: [],
    incidents: [],
    accessibilityRequests: [],
    transportAlerts: [],
    staffing: [],
    announcements: [],
    activityLog: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch state snapshot from backend
  const fetchState = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/state`);
      if (!res.ok) throw new Error("Backend connection failed");
      const data = await res.json();
      setState(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching state:", err);
    }
  };

  // Poll state every 5 seconds
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    const targets = document.querySelectorAll('.scroll-reveal');
    targets.forEach(t => observer.observe(t));

    return () => {
      targets.forEach(t => observer.unobserve(t));
    };
  }, [currentPage, state]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    // Persona landing pages
    if (selectedRole === 'accessibility-staff') {
      setCurrentPage('accessibility');
    } else if (selectedRole === 'comms-staff') {
      setCurrentPage('announcements');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setRole(null);
  };

  // Scenario Triggers
  const handleTriggerGateB = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scenario/gateb`, { method: 'POST' });
      if (!res.ok) throw new Error("Failed to trigger scenario");
      await fetchState();
      alert("Flagship Scenario Loaded: Check Gate B, transport alerts, and the incident queue.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleTriggerAccessibility = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scenario/accessibility`, { method: 'POST' });
      if (!res.ok) throw new Error("Failed to trigger scenario");
      await fetchState();
      alert("Accessibility Escalation Scenario Loaded: Check the queue for an aging wheelchair request.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleResetState = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scenario/reset`, { method: 'POST' });
      if (!res.ok) throw new Error("Failed to reset state");
      await fetchState();
      setActiveIncidentShortcut(null);
      alert("Scenario database reset to baseline seeded state.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // State Updates from Childs
  const handleUpdateIncident = (updatedIncident) => {
    setState((prev) => {
      const updatedIncidents = prev.incidents.map(i => i.id === updatedIncident.id ? updatedIncident : i);
      if (!prev.incidents.some(i => i.id === updatedIncident.id)) {
        updatedIncidents.push(updatedIncident);
      }
      return { ...prev, incidents: updatedIncidents };
    });
  };

  const handleUpdateAccessibility = (updatedReq) => {
    setState((prev) => {
      const updatedReqs = prev.accessibilityRequests.map(r => r.id === updatedReq.id ? updatedReq : r);
      if (!prev.accessibilityRequests.some(r => r.id === updatedReq.id)) {
        updatedReqs.push(updatedReq);
      }
      return { ...prev, accessibilityRequests: updatedReqs };
    });
  };

  const handlePublishAnnouncement = (announcement) => {
    setState((prev) => {
      const updatedAnns = prev.announcements.map(a => a.id === announcement.id ? announcement : a);
      if (!prev.announcements.some(a => a.id === announcement.id)) {
        updatedAnns.push(announcement);
      }
      return { ...prev, announcements: updatedAnns };
    });
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Bot size={48} className="spin" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <h2>Initializing Command Center Data Registers...</h2>
      </div>
    );
  }

  // Count alerts
  const criticalCount = state.incidents.filter(i => i.status !== 'resolved' && i.severity === 'critical').length + 
                        state.accessibilityRequests.filter(r => r.status !== 'resolved' && r.urgency === 'critical').length;

  return (
    <div className="app-container" role="application" aria-label="StadiumOps Command Center">
      {/* Top Bar */}
      <header style={styles.topBar} className="glass-blur" role="banner">
        <div style={styles.branding} onClick={() => setCurrentPage('dashboard')} tabIndex={0} role="button" aria-label="Go to Dashboard Home" onKeyDown={(e) => e.key === 'Enter' && setCurrentPage('dashboard')}>
          <img src="/logo.png" alt="StadiumOps Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 0 8px rgba(212,175,55,0.2)' }} />
          <div>
            <h1 style={styles.brandTitle} className="prismatic-text">StadiumOps Copilot</h1>
            <p style={styles.brandMatch}>FIFA World Cup 26 — Match Day Center</p>
          </div>
        </div>

        {/* Global Nav Tabs */}
        <nav style={styles.nav} role="navigation" aria-label="Main Navigation">
          <button 
            className={`clay-btn ${currentPage === 'dashboard' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setCurrentPage('dashboard')}
            aria-label="Dashboard view"
            aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          >
            Dashboard
          </button>
          
          <button 
            className={`clay-btn ${currentPage === 'incidents' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setCurrentPage('incidents')}
            aria-label={`Incidents view, ${state.incidents.filter(i => i.status !== 'resolved').length} open`}
            aria-current={currentPage === 'incidents' ? 'page' : undefined}
          >
            Incidents {state.incidents.filter(i => i.status !== 'resolved').length > 0 && `(${state.incidents.filter(i => i.status !== 'resolved').length})`}
          </button>
          
          <button 
            className={`clay-btn ${currentPage === 'accessibility' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setCurrentPage('accessibility')}
            aria-label={`Accessibility requests, ${state.accessibilityRequests.filter(r => r.status !== 'resolved').length} open`}
            aria-current={currentPage === 'accessibility' ? 'page' : undefined}
          >
            Accessibility {state.accessibilityRequests.filter(r => r.status !== 'resolved').length > 0 && `(${state.accessibilityRequests.filter(r => r.status !== 'resolved').length})`}
          </button>

          <button 
            className={`clay-btn ${currentPage === 'announcements' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setCurrentPage('announcements')}
            aria-label="Announcements view"
            aria-current={currentPage === 'announcements' ? 'page' : undefined}
          >
            Announcements
          </button>

          <button 
            className={`clay-btn ${currentPage === 'handoff' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            onClick={() => setCurrentPage('handoff')}
            aria-label="Shift summary and handoff"
            aria-current={currentPage === 'handoff' ? 'page' : undefined}
          >
            Shift Summary
          </button>
        </nav>

        {/* Persona Display & Controls */}
        <div style={styles.controls}>
          {criticalCount > 0 && (
            <div style={styles.alertIndicator} className="pulse-critical" role="alert" aria-live="assertive" aria-label={`${criticalCount} critical alerts active`}>
              <Bell size={16} color="var(--color-danger)" />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>{criticalCount} CRIT</span>
            </div>
          )}
          
          {/* Mini FUT Badge for active user */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: cardInfo.tier === 'gold' ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 229, 255, 0.08)',
            border: cardInfo.tier === 'gold' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(0, 229, 255, 0.3)',
            padding: '5px 12px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            boxShadow: cardInfo.tier === 'gold' ? '0 0 10px rgba(212,175,55,0.15)' : '0 0 10px rgba(0,229,255,0.15)'
          }}>
            <span style={{ fontWeight: '900', color: cardInfo.tier === 'gold' ? 'var(--accent)' : 'var(--primary)' }}>{cardInfo.rating}</span>
            <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.75rem' }}>{cardInfo.pos}</span>
          </div>

          <button 
            onClick={() => setIsCopilotOpen(!isCopilotOpen)} 
            className={`clay-btn ${isCopilotOpen ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
            style={{ padding: '8px 14px' }}
            aria-label={isCopilotOpen ? 'Close AI Copilot panel' : 'Open AI Copilot panel'}
            aria-expanded={isCopilotOpen}
          >
            <Bot size={16} /> Copilot
          </button>

          <button onClick={handleLogout} style={styles.logoutBtn} title="Change Role" aria-label="Logout and change role">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="main-content" role="main" aria-label="Page Content">
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: isCopilotOpen ? '420px' : '0', transition: 'padding-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {currentPage === 'dashboard' && (
            <Dashboard 
              state={state}
              onNavigate={setCurrentPage}
              onTriggerGateB={handleTriggerGateB}
              onTriggerAccessibility={handleTriggerAccessibility}
              onResetState={handleResetState}
            />
          )}

          {currentPage === 'incidents' && (
            <Incidents 
              state={state}
              onUpdateIncident={handleUpdateIncident}
              onGenerateAnnouncement={setActiveIncidentShortcut}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'accessibility' && (
            <AccessibilityComponent 
              state={state}
              onUpdateAccessibility={handleUpdateAccessibility}
            />
          )}

          {currentPage === 'announcements' && (
            <Announcements 
              state={state}
              onPublishAnnouncement={handlePublishAnnouncement}
              activeIncidentShortcut={activeIncidentShortcut}
              onClearIncidentShortcut={() => setActiveIncidentShortcut(null)}
            />
          )}

          {currentPage === 'handoff' && (
            <Handoff state={state} />
          )}
        </div>

        {/* Copilot Drawer */}
        <Copilot 
          isOpen={isCopilotOpen} 
          onClose={() => setIsCopilotOpen(false)}
          state={state}
        />
      </main>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
    backgroundColor: 'rgba(5, 8, 20, 0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: '100'
  },
  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
  },
  brandScorePill: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    border: '1.5px solid var(--primary)',
    color: 'var(--primary)',
    fontWeight: '900',
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
  },
  brandTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)'
  },
  brandMatch: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)'
  },
  nav: {
    display: 'flex',
    gap: '8px'
  },
  navTab: {
    background: 'none',
    border: '1px solid transparent',
    padding: '6px 14px',
    fontSize: '0.8rem',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  alertIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  personaBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    padding: '6px 12px',
    borderRadius: '6px'
  },
  roleLabel: {
    color: 'var(--text-dim)'
  },
  roleVal: {
    color: 'var(--text-main)'
  },
  copilotToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  }
};
const _as = `
  .logoutBtn:hover {
    color: var(--color-danger);
    background: rgba(239, 68, 68, 0.05);
  }
  .copilotToggle:hover {
    border-color: var(--primary-hover);
  }
  .navTab:hover {
    background: rgba(255,255,255,0.02);
  }
`;
