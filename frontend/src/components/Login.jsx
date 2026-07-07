import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Accessibility, 
  Megaphone, 
  ArrowRight, 
  ChevronDown, 
  TrendingUp, 
  Globe, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';

export default function Login({ onLogin }) {
  const [livingTab, setLivingTab] = useState('thriving');
  
  const personas = [
    {
      role: 'ops-manager',
      name: 'STADIUM-MGR',
      fullName: 'Operations Manager',
      icon: Shield,
      rating: 94,
      pos: 'MGR',
      tier: 'gold-tier',
      stats: [
        { name: 'FLO', val: 92 },
        { name: 'TRA', val: 88 },
        { name: 'ACC', val: 95 },
        { name: 'SEC', val: 91 },
        { name: 'TRI', val: 94 },
        { name: 'COM', val: 89 }
      ]
    },
    {
      role: 'volunteer-coordinator',
      name: 'CRISIS-COORD',
      fullName: 'Volunteer Coordinator',
      icon: Users,
      rating: 91,
      pos: 'COORD',
      tier: 'gold-tier',
      stats: [
        { name: 'FLO', val: 89 },
        { name: 'TRA', val: 90 },
        { name: 'ACC', val: 85 },
        { name: 'SEC', val: 95 },
        { name: 'TRI', val: 88 },
        { name: 'COM', val: 92 }
      ]
    },
    {
      role: 'accessibility-staff',
      name: 'ACCESS-LEAD',
      fullName: 'Accessibility Staff',
      icon: Accessibility,
      rating: 95,
      pos: 'ACC',
      tier: 'green-tier',
      stats: [
        { name: 'FLO', val: 82 },
        { name: 'TRA', val: 86 },
        { name: 'ACC', val: 99 },
        { name: 'SEC', val: 80 },
        { name: 'TRI', val: 90 },
        { name: 'COM', val: 94 }
      ]
    },
    {
      role: 'comms-staff',
      name: 'COMMS-EXEC',
      fullName: 'Public Communications',
      icon: Megaphone,
      rating: 89,
      pos: 'COMM',
      tier: 'green-tier',
      stats: [
        { name: 'FLO', val: 85 },
        { name: 'TRA', val: 88 },
        { name: 'ACC', val: 92 },
        { name: 'SEC', val: 83 },
        { name: 'TRI', val: 99 },
        { name: 'COM', val: 96 }
      ]
    }
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.landingContainer}>
      {/* Navbar */}
      <nav style={styles.navbar} className="glass-blur" role="navigation" aria-label="Landing Page Navigation">
        <div style={styles.navLogo}>
          <img src="/logo.png" alt="StadiumOps Brand Logo" style={styles.navLogoImg} />
          <span style={styles.navLogoText}>StadiumOps <span style={{ color: 'var(--primary)' }}>Copilot</span></span>
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => scrollToSection('solution')} style={styles.navLinkBtn} aria-label="Scroll to Simulator Section">Simulator</button>
          <button onClick={() => scrollToSection('features')} style={styles.navLinkBtn} aria-label="Scroll to Features Section">Features</button>
          <button onClick={() => scrollToSection('role-selector')} className="clay-btn clay-btn-primary" style={{ fontSize: '0.72rem', padding: '6px 12px' }} aria-label="Scroll to Squad Draft Selector to Deploy Dashboard">
            Deploy Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero} className="scroll-reveal visible" role="banner" aria-label="Introduction Banner">
        <div style={styles.heroGrid}>
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>
              🏟️ Your Decisions <br />
              <span className="prismatic-text">Shape the Arena</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Coordinate spectator flows, dispatch standby volunteers, and publish multilingual safety announcements with Google Gemini AI.
            </p>
            <div style={styles.heroActions}>
              <button onClick={() => scrollToSection('role-selector')} className="clay-btn clay-btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem' }} aria-label="Get Started and choose your command center role">
                Get Started
              </button>
              <button onClick={() => scrollToSection('solution')} className="clay-btn clay-btn-secondary" style={{ padding: '12px 24px', fontSize: '0.85rem' }} aria-label="Try simulation simulator">
                Try Simulator
              </button>
            </div>
          </div>

          <div style={styles.heroRight}>
            {/* Tactical Pitch Map Preview Card */}
            <div style={styles.mockupCard} className="glass-panel" role="img" aria-label="Tactical pitch map simulation preview">
              <div style={styles.mockupHeader}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                </div>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>STADIUMPITCH_MAP_SYS_V2.6</span>
              </div>
              <div style={{ width: '100%', height: '120px', position: 'relative', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'radial-gradient(circle, #0e1b33 0%, #050814 100%)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: '88%', height: '76%', top: '12%', left: '6%', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', width: '1.5px', height: '100%', left: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', left: 'calc(50% - 12px)', top: 'calc(50% - 12px)' }} />
                <div className="pulse-critical" style={{ position: 'absolute', right: '12%', top: '46%', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', border: '2.5px solid #050814', boxShadow: '0 0 12px var(--color-danger)', cursor: 'pointer' }} title="Gate B: Congestion Bottleneck Warning" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Solution Section */}
      <section id="solution" style={styles.section} className="scroll-reveal visible" role="region" aria-label="Matchday Simulator Preview">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEmoji}>⚽</span>
          <h2 style={styles.sectionTitle}>Meet the Living Stadium</h2>
          <p style={styles.sectionSubtitle}>
            Watch spectator flows and congestion heatmaps adapt dynamically based on volunteer deployments.
          </p>
        </div>

        <div style={styles.livingShowcaseGrid}>
          <div style={styles.livingShowcaseLeft}>
            <div style={styles.livingTabs} role="tablist" aria-label="Stadium health state preview tabs">
              <button 
                className={`clay-btn ${livingTab === 'thriving' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                onClick={() => setLivingTab('thriving')}
                style={{ fontSize: '0.7rem', padding: '6px 12px' }}
                role="tab"
                aria-selected={livingTab === 'thriving'}
                aria-controls="living-preview-panel"
                id="tab-thriving"
              >
                ⚽ Matchday Ready
              </button>
              <button 
                className={`clay-btn ${livingTab === 'critical' ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
                onClick={() => setLivingTab('critical')}
                style={{ fontSize: '0.7rem', padding: '6px 12px' }}
                role="tab"
                aria-selected={livingTab === 'critical'}
                aria-controls="living-preview-panel"
                id="tab-critical"
              >
                ⚠️ Congested Bottleneck
              </button>
            </div>

            <div style={styles.livingPreviewImg} id="living-preview-panel" role="tabpanel" aria-labelledby={`tab-${livingTab}`}>
              {livingTab === 'thriving' ? (
                <div style={styles.previewBoxThriving}>
                  <span style={{ fontSize: '3rem', marginBottom: '12px' }}>🏆</span>
                  <h4 style={{ color: 'var(--primary)', fontWeight: '800', margin: '0 0 6px 0' }}>OPTIMAL FLOW</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Turnstiles cleared, queue time under 4 minutes. Spectators flowing steadily through Gate A, B, C, D.
                  </p>
                </div>
              ) : (
                <div style={styles.previewBoxCritical}>
                  <span style={{ fontSize: '3rem', marginBottom: '12px' }}>🚨</span>
                  <h4 style={{ color: 'var(--color-danger)', fontWeight: '800', margin: '0 0 6px 0' }}>CRITICAL CONGESTION</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Gate B turnstile failure causing backlog of 3,500+ fans. Average wait time is 28m. Urgent volunteer dispatch required.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={styles.livingShowcaseRight}>
            <h3>Interactive Arena Simulation</h3>
            <p>Our predictive AI-driven engine continually computes stadium ingress/egress load balancing metrics.</p>
            <ul role="list">
              <li>📍 Real-time crowd mapping and turnstile flow logs</li>
              <li>📢 Gemini AI automatic localized audio and text announcements</li>
              <li>🙋 Volunteer deployment dispatch & tasks workload stats</li>
            </ul>
            
            <div style={styles.livingShowcaseStats}>
              <div style={styles.livingStatBlock}>
                <span style={styles.livingStatLabel}>Operational Health</span>
                <span style={{ fontSize: '2.2rem', fontWeight: '900', color: livingTab === 'thriving' ? 'var(--primary)' : 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
                  {livingTab === 'thriving' ? '98%' : '64%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={styles.section} className="scroll-reveal visible" role="region" aria-label="Core Capabilities">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📊 Command Center Capabilities</h2>
          <p style={styles.sectionSubtitle}>Professional operational monitoring tools paired with Gemini AI models.</p>
        </div>

        <div style={styles.featuresGrid} role="list" aria-label="Feature overview cards">
          <div style={styles.featureCard} className="glass-panel" role="listitem">
            <div style={{ ...styles.featureIconBg, color: 'var(--primary)' }}><Globe size={20} /></div>
            <h3>Understand Crowd Flows</h3>
            <p>Track live spectator densities at entry gates and seating stands.</p>
          </div>

          <div style={styles.featureCard} className="glass-panel" role="listitem">
            <div style={{ ...styles.featureIconBg, color: 'var(--accent)' }}><Cpu size={20} /></div>
            <h3>Resolve Active Alerts</h3>
            <p>Triage crowd incidents, security sweeps, and accessibility wheelchair dispatches.</p>
          </div>

          <div style={styles.featureCard} className="glass-panel" role="listitem">
            <div style={{ ...styles.featureIconBg, color: 'var(--primary)' }}><Shield size={20} /></div>
            <h3>Google Gemini Guidance</h3>
            <p>Draft multilingual safety broadcasts instantly, generate comprehensive shift summaries.</p>
          </div>
        </div>
      </section>

      {/* Role Selector Section (The Login) */}
      <section id="role-selector" style={styles.roleSection} className="scroll-reveal visible" role="region" aria-label="Squad Draft Role Selector">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionEmoji}>🏆</span>
          <h2 style={styles.sectionTitle}>Squad Draft Selection</h2>
          <p style={styles.sectionSubtitle}>Select operations role card to deploy command center:</p>
        </div>

        <div style={styles.grid} role="list" aria-label="Selectable player card personas">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <button 
                key={p.role} 
                onClick={() => onLogin(p.role)}
                className={`fut-card ${p.tier} fut-login-card`}
                aria-label={`Select Role ${p.fullName}. Rating ${p.rating}, Position ${p.pos}. Click to deploy dashboard as this persona.`}
                role="listitem"
              >
                <div style={styles.futTopRow}>
                  <div style={styles.futRatingCol}>
                    <span style={styles.futRating}>{p.rating}</span>
                    <span style={styles.futPos}>{p.pos}</span>
                  </div>
                  <div style={styles.futBadge} aria-hidden="true">🏆</div>
                </div>
                
                <div style={styles.futAvatarWrapper}>
                  <div style={styles.futAvatarCircle}>
                    <Icon size={26} color={p.tier === 'gold-tier' ? 'var(--accent)' : 'var(--primary)'} />
                  </div>
                </div>

                <div style={styles.futCardName}>{p.name}</div>
                <div style={styles.futDivider} />

                <div style={styles.futStatsGrid} aria-label="Persona stats mapping">
                  {p.stats.map((s, idx) => (
                    <div key={idx} style={styles.futStatItem}>
                      <span style={styles.futStatVal}>{s.val}</span>
                      <span style={styles.futStatName}>{s.name}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.futCardFooter}>{p.fullName}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer} role="contentinfo">
        © 2026 StadiumOps Copilot. Developed for FIFA World Cup 2026 Match Day Operations.
      </footer>

      <style>{`
        .fut-login-card {
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          cursor: pointer;
          min-height: 310px;
          text-decoration: none;
          outline: none;
          text-align: left;
        }
      `}</style>
    </div>
  );
}

const styles = {
  landingContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)',
    overflowX: 'hidden',
    position: 'relative'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(5, 8, 20, 0.75)'
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  navLogoImg: {
    width: '28px',
    height: '28px',
    borderRadius: '6px'
  },
  navLogoText: {
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  navLinkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'color 0.2s'
  },
  hero: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    boxSizing: 'border-box'
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    maxWidth: '1000px',
    width: '100%',
    alignItems: 'center'
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'left'
  },
  heroTitle: {
    fontSize: '2.8rem',
    fontWeight: '900',
    fontFamily: 'var(--font-display)',
    lineHeight: '1.15',
    margin: 0
  },
  heroSubtitle: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: 0,
    fontWeight: '500'
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  heroRight: {
    display: 'flex',
    justifyContent: 'center'
  },
  mockupCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '16px',
    borderRadius: '24px',
    background: 'rgba(5, 8, 20, 0.45)',
    border: '1.5px solid rgba(212, 175, 55, 0.15)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
  },
  mockupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  mockupPill: {
    fontSize: '0.68rem',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    padding: '3px 8px',
    color: 'var(--text-muted)',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)'
  },
  section: {
    padding: '80px 24px',
    maxWidth: '1000px',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  roleSection: {
    padding: '80px 24px',
    maxWidth: '1000px',
    margin: '0 auto',
    boxSizing: 'border-box',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  sectionEmoji: {
    fontSize: '2.5rem',
    marginBottom: '8px',
    display: 'block'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    margin: '0 0 10px 0'
  },
  sectionSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.4'
  },
  livingShowcase: {
    padding: '24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  livingTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px'
  },
  livingShowcaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    alignItems: 'stretch'
  },
  livingPreviewImg: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '180px',
    background: 'rgba(0, 0, 0, 0.15)'
  },
  previewBoxThriving: {
    padding: '24px',
    textAlign: 'center'
  },
  previewBoxCritical: {
    padding: '24px',
    textAlign: 'center'
  },
  livingShowcaseStats: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'left'
  },
  livingStatBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  livingStatLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  featureCard: {
    padding: '24px',
    borderRadius: '20px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    transition: 'transform 0.2s',
    cursor: 'default'
  },
  featureIconBg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  featureCardTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    margin: 0
  },
  featureCardDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    justifyContent: 'center'
  },
  futTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: '0 4px',
    marginBottom: '4px'
  },
  futRatingCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    lineHeight: '1.1'
  },
  futRating: {
    fontSize: '1.8rem',
    fontWeight: '900',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-main)'
  },
  futPos: {
    fontSize: '0.65rem',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  futBadge: {
    fontSize: '1.2rem'
  },
  futAvatarWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
    width: '100%'
  },
  futAvatarCircle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1.5px solid rgba(255, 255, 255, 0.08)'
  },
  futCardName: {
    fontSize: '0.95rem',
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
    marginBottom: '12px'
  },
  futStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '6px 12px',
    padding: '0 8px',
    width: '100%',
    marginBottom: '16px'
  },
  futStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    justifyContent: 'flex-start'
  },
  futStatVal: {
    fontWeight: '700',
    color: 'var(--text-main)',
    minWidth: '18px',
    textAlign: 'right'
  },
  futStatName: {
    color: 'var(--text-muted)',
    fontSize: '0.68rem',
    fontWeight: '500'
  },
  futCardFooter: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    marginTop: 'auto',
    textAlign: 'center',
    paddingTop: '8px',
    borderTop: '1.5px solid rgba(255, 255, 255, 0.04)'
  },
  footer: {
    padding: '30px 24px',
    textAlign: 'center',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};
