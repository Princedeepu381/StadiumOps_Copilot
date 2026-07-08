import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Users, 
  Accessibility, 
  Megaphone, 
  Globe, 
  Cpu,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function Login({ onLogin }) {
  const [livingTab, setLivingTab] = useState('thriving');
  const [hoveredZone, setHoveredZone] = useState(null);

  const getHotspotPosition = (zoneId) => {
    switch (zoneId) {
      case 'zone-gateA': 
        return { top: '23.5%', left: '18.3%', transform: 'translate(-50%, -50%)' };
      case 'zone-gateB': 
        return { top: '50%', left: '81.7%', transform: 'translate(-50%, -50%)' };
      case 'zone-gateC': 
        return { top: '23.5%', left: '81.7%', transform: 'translate(-50%, -50%)' };
      case 'zone-north': 
        return { top: '24.4%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'zone-south': 
        return { top: '75.3%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'zone-eastShuttle': 
        return { top: '50%', left: '89.2%', transform: 'translate(-50%, -50%)' };
      default: 
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const getSectorFill = (zoneId) => {
    if (livingTab === 'thriving') {
      if (zoneId === 'zone-gateB') return 'rgba(154, 52, 18, 0.08)';
      return 'rgba(22, 101, 52, 0.06)';
    } else {
      if (zoneId === 'zone-gateB' || zoneId === 'zone-south') return 'rgba(153, 27, 27, 0.12)';
      if (zoneId === 'zone-eastShuttle') return 'rgba(154, 52, 18, 0.08)';
      return 'rgba(22, 101, 52, 0.06)';
    }
  };

  const getSectorStroke = (zoneId) => {
    if (livingTab === 'thriving') {
      if (zoneId === 'zone-gateB') return 'var(--color-warning)';
      return 'var(--color-success)';
    } else {
      if (zoneId === 'zone-gateB' || zoneId === 'zone-south') return 'var(--color-danger)';
      if (zoneId === 'zone-eastShuttle') return 'var(--color-warning)';
      return 'var(--color-success)';
    }
  };

  const getSectorText = (zoneId) => {
    if (livingTab === 'thriving') {
      if (zoneId === 'zone-gateB') return 'var(--color-warning)';
      return 'var(--color-success)';
    } else {
      if (zoneId === 'zone-gateB' || zoneId === 'zone-south') return 'var(--color-danger)';
      if (zoneId === 'zone-eastShuttle') return 'var(--color-warning)';
      return 'var(--color-success)';
    }
  };

  const previewZones = [
    { id: 'zone-gateA', name: 'Gate A (Main Entry)', cap: 35, level: 'low' },
    { id: 'zone-gateB', name: 'Gate B (East Entry)', cap: livingTab === 'thriving' ? 68 : 95, level: livingTab === 'thriving' ? 'medium' : 'critical' },
    { id: 'zone-gateC', name: 'Gate C (North Entry)', cap: 42, level: 'low' },
    { id: 'zone-north', name: 'North Concourse', cap: 30, level: 'low' },
    { id: 'zone-south', name: 'South Concourse', cap: livingTab === 'thriving' ? 25 : 88, level: livingTab === 'thriving' ? 'low' : 'high' },
    { id: 'zone-eastShuttle', name: 'East Shuttle Drop-off', cap: livingTab === 'thriving' ? 15 : 55, level: livingTab === 'thriving' ? 'low' : 'medium' }
  ];

  // Animated stat counter
  const [animatedStat, setAnimatedStat] = useState(0);
  const targetStat = livingTab === 'thriving' ? 98 : 64;
  useEffect(() => {
    let start = 0;
    const end = targetStat;
    const duration = 800;
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    const increment = (end - start) / steps;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setAnimatedStat(Math.round(current));
    }, stepTime);
    return () => clearInterval(timer);
  }, [targetStat]);

  // Scroll-reveal IntersectionObserver
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    const targets = container.querySelectorAll('.scroll-reveal');
    targets.forEach(t => observer.observe(t));
    return () => targets.forEach(t => observer.unobserve(t));
  }, []);

  // Hero staggered entrance
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(timer);
  }, []);
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
    <div style={styles.landingContainer} ref={containerRef}>
      {/* Floating Decorative Emojis */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="float-slow" style={{ position: 'absolute', fontSize: '2rem', left: '8%', top: '12%', opacity: 0.15 }}>⚽</div>
        <div className="float-medium" style={{ position: 'absolute', fontSize: '1.6rem', left: '85%', top: '20%', opacity: 0.12 }}>🏟️</div>
        <div className="float-slow" style={{ position: 'absolute', fontSize: '1.8rem', left: '70%', top: '65%', opacity: 0.1 }}>🏆</div>
        <div className="float-medium" style={{ position: 'absolute', fontSize: '1.4rem', left: '15%', top: '75%', opacity: 0.1 }}>🎯</div>
        <div className="float-slow" style={{ position: 'absolute', fontSize: '1.5rem', left: '50%', top: '8%', opacity: 0.08 }}>⚽</div>
      </div>

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
      <section style={styles.hero} role="banner" aria-label="Introduction Banner">
        <div style={styles.heroGrid}>
          <div style={{ ...styles.heroLeft, opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <h1 style={{ ...styles.heroTitle, opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(25px)', transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }}>
              🏟️ Your Decisions <br />
              <span className="prismatic-text">Shape the Arena</span>
            </h1>
            <p style={{ ...styles.heroSubtitle, opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(25px)', transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s' }}>
              Coordinate spectator flows, dispatch standby volunteers, and publish multilingual safety announcements with Google Gemini AI.
            </p>
            <div style={{ ...styles.heroActions, opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateY(0)' : 'translateY(25px)', transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s' }}>
              <button onClick={() => scrollToSection('role-selector')} className="clay-btn clay-btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }} aria-label="Get Started and choose your command center role">
                Get Started <ArrowRight size={18} strokeWidth={3} />
              </button>
              <button onClick={() => scrollToSection('solution')} className="clay-btn clay-btn-secondary" style={{ padding: '12px 24px', fontSize: '0.85rem' }} aria-label="Try simulation simulator">
                Try Simulator
              </button>
            </div>
          </div>

          <div style={{ ...styles.heroRight, opacity: heroReady ? 1 : 0, transform: heroReady ? 'translateX(0)' : 'translateX(50px)', transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' }}>
            {/* Tactical Pitch Map Preview HUD Widget */}
            <div style={{ ...styles.mockupCard, background: 'linear-gradient(135deg, #091a11 0%, #030a06 100%)', borderColor: 'rgba(34, 197, 94, 0.25)', boxShadow: '0 8px 32px rgba(16, 64, 38, 0.4), inset 0 0 16px rgba(34, 197, 94, 0.05)', padding: '12px' }} className="glass-panel" role="img" aria-label="Tactical pitch map simulation preview">
              <div style={{ ...styles.mockupHeader, borderBottom: '1px solid rgba(34, 197, 94, 0.15)', borderTop: 'none', marginTop: 0, paddingBottom: '6px', paddingTop: 0 }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                </div>
                <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#22c55e', letterSpacing: '0.05em' }}>LIVE_TELEMETRY_FEED_V2.6</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.1fr', gap: '12px', marginTop: '10px' }}>
                {/* Mini Holographic Stadium Plot */}
                <div className="telemetry-grid" style={{ width: '100%', height: '115px', position: 'relative', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.15)', background: '#040b07', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="radar-sweep" />
                  
                  {/* Miniature Stadium Outline */}
                  <svg width="80" height="80" viewBox="0 0 100 100" style={{ opacity: 0.85, margin: 'auto' }}>
                    {/* Pitch */}
                    <rect x="25" y="35" width="50" height="30" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" />
                    <line x1="50" y1="35" x2="50" y2="65" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" />
                    
                    {/* Seating Rings */}
                    <path d="M 15 25 A 40 40 0 0 1 85 25" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="4" />
                    <path d="M 15 75 A 40 40 0 0 0 85 75" fill="none" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="4" />
                    
                    {/* Pulsing Hotspots */}
                    <circle cx="85" cy="50" r="4" fill="#ef4444" className="telemetry-pulse" />
                    <circle cx="50" cy="18" r="3" fill="#10b981" />
                    <circle cx="50" cy="82" r="3" fill="#10b981" />
                    <circle cx="15" cy="50" r="3" fill="#10b981" />
                  </svg>
                  
                  <span style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', color: 'rgba(34, 197, 94, 0.6)' }}>STAD_MAP_INIT</span>
                </div>

                {/* HUD Live Diagnostics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#a7f3d0', justifyContent: 'center', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <span>ALERT: <strong style={{ color: '#ef4444' }}>GATE_B</strong></span>
                  </div>
                  <div>CAP: <span style={{ color: '#f59e0b' }}>94% CRIT</span></div>
                  <div>COPILOT: <span style={{ color: '#22c55e' }}>MITIGATING</span></div>
                  <div>DISPATCH: <span style={{ color: '#60a5fa' }}>VOL_R2</span></div>
                  
                  {/* Miniature graph lines */}
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px', width: '100%', borderBottom: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <div style={{ height: '30%', width: '4px', backgroundColor: 'rgba(34, 197, 94, 0.4)' }} />
                    <div style={{ height: '45%', width: '4px', backgroundColor: 'rgba(34, 197, 94, 0.4)' }} />
                    <div style={{ height: '60%', width: '4px', backgroundColor: 'rgba(34, 197, 94, 0.4)' }} />
                    <div style={{ height: '85%', width: '4px', backgroundColor: '#f59e0b' }} />
                    <div style={{ height: '95%', width: '4px', backgroundColor: '#ef4444' }} />
                  </div>
                </div>
              </div>

              {/* Scrolling Terminal Output Console */}
              <div style={{ marginTop: '10px', padding: '6px 8px', borderRadius: '4px', background: '#020604', border: '1px solid rgba(34, 197, 94, 0.1)', textAlign: 'left', minHeight: '38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: '#22c55e', lineHeight: '1.3' }}>
                  <span style={{ color: 'rgba(34, 197, 94, 0.5)' }}>&gt;</span> AI_CORR: East Shuttle delay correlated with Gate B congestion.
                </div>
                <div style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', lineHeight: '1.3', marginTop: '2px' }}>
                  <span style={{ color: 'rgba(245, 158, 11, 0.5)' }}>&gt;</span> TASK: Redirecting 12 standby volunteers to Gate B.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Down Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 16px 0', opacity: heroReady ? 0.5 : 0, transition: 'opacity 1s ease 1.2s' }}>
        <ChevronDown size={32} className="bounce-slow" style={{ color: 'var(--primary)' }} />
      </div>

      {/* Interactive Solution Section */}
      <section id="solution" style={styles.section} className="scroll-reveal" role="region" aria-label="Matchday Simulator Preview">
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div className="pitch-container" style={{ position: 'relative', width: '100%', maxWidth: '100%', aspectRatio: '600 / 340', background: 'radial-gradient(circle, #f9fbf9 0%, #eef3f0 100%)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', margin: '0 auto' }}>
                {/* Stadium SVG Blueprint */}
                <svg width="100%" height="100%" viewBox="0 0 600 340" style={{ position: 'absolute', top: 0, left: 0 }}>
                  {/* Outer Stadium Ring */}
                  <rect x="50" y="30" width="500" height="280" rx="140" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
                  <rect x="70" y="50" width="460" height="240" rx="120" fill="none" stroke="rgba(16, 64, 38, 0.08)" strokeWidth="8" />
                  
                  {/* Soccer Pitch in Center */}
                  <g opacity="0.8">
                    <rect x="190" y="100" width="220" height="140" rx="4" fill="rgba(16, 64, 38, 0.04)" stroke="rgba(16, 64, 38, 0.15)" strokeWidth="1.5" />
                    <line x1="300" y1="100" x2="300" y2="240" stroke="rgba(16, 64, 38, 0.15)" strokeWidth="1.5" />
                    <circle cx="300" cy="170" r="25" fill="none" stroke="rgba(16, 64, 38, 0.15)" strokeWidth="1.5" />
                    <rect x="190" y="140" width="20" height="60" fill="none" stroke="rgba(16, 64, 38, 0.15)" strokeWidth="1.5" />
                    <rect x="390" y="140" width="20" height="60" fill="none" stroke="rgba(16, 64, 38, 0.15)" strokeWidth="1.5" />
                  </g>
                  
                  {/* Seating Stands Sectors */}
                  <path 
                    d="M 120,72 A 200,100 0 0,1 480,72 L 440,95 A 160,70 0 0,0 160,95 Z" 
                    fill={getSectorFill('zone-north')} 
                    stroke={getSectorStroke('zone-north')} 
                    strokeWidth="1.5" 
                    style={{ transition: 'all 0.3s' }}
                  />
                  <path 
                    d="M 120,268 A 200,100 0 0,0 480,268 L 440,245 A 160,70 0 0,1 160,245 Z" 
                    fill={getSectorFill('zone-south')} 
                    stroke={getSectorStroke('zone-south')} 
                    strokeWidth="1.5" 
                    style={{ transition: 'all 0.3s' }}
                  />
                  <path 
                    d="M 90,110 A 100,180 0 0,1 90,230 L 115,205 A 70,140 0 0,0 115,135 Z" 
                    fill="rgba(16, 64, 38, 0.02)" 
                    stroke="rgba(16, 64, 38, 0.1)" 
                    strokeWidth="1.5" 
                  />
                  <path 
                    d="M 510,110 A 100,180 0 0,0 510,230 L 485,205 A 70,140 0 0,1 485,135 Z" 
                    fill={getSectorFill('zone-eastShuttle')} 
                    stroke={getSectorStroke('zone-eastShuttle')} 
                    strokeWidth="1.5" 
                    style={{ transition: 'all 0.3s' }}
                  />
                </svg>
                
                {/* Hotspot nodes on top */}
                {previewZones.map((zone) => {
                  const positionStyle = getHotspotPosition(zone.id);
                  const isSelected = hoveredZone === zone.id;
                  
                  let nodeLetter = 'S';
                  if (zone.id === 'zone-gateA') nodeLetter = 'A';
                  else if (zone.id === 'zone-gateB') nodeLetter = 'B';
                  else if (zone.id === 'zone-gateC') nodeLetter = 'C';
                  else if (zone.id === 'zone-north') nodeLetter = 'N';
                  else if (zone.id === 'zone-south') nodeLetter = 'S';
                  else if (zone.id === 'zone-eastShuttle') nodeLetter = 'T';

                  return (
                    <div 
                      key={zone.id}
                      className={`pitch-hotspot-wrapper ${isSelected ? 'selected' : ''}`}
                      style={positionStyle}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                    >
                      <div className={`pitch-hotspot-circle ${zone.level} ${zone.level === 'critical' ? 'active-pulse' : ''}`}>
                        {nodeLetter}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="hotspot-tooltip">
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-main)' }}>{zone.name}</div>
                        <div style={{ height: '1px', background: 'var(--border)', width: '100%', margin: '4px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', gap: '20px' }}>
                          <span>Congestion:</span>
                          <span className={`status-badge ${zone.level}`} style={{ fontSize: '0.6rem', padding: '2px 5px' }}>
                            {zone.level.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                          <span>Capacity:</span>
                          <strong style={{ color: 'var(--text-main)' }}>{zone.cap}%</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Explanation Card */}
              <div style={livingTab === 'thriving' ? styles.previewBoxThriving : styles.previewBoxCritical}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', margin: '0 0 6px 0', fontSize: '0.95rem' }}>
                  {livingTab === 'thriving' ? '🏆 OPTIMAL FLOW' : '🚨 CRITICAL CONGESTION ALERT'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {livingTab === 'thriving' 
                    ? 'Turnstiles cleared, queue time under 4 minutes. Spectators flowing steadily through Gate A, B, C.' 
                    : 'Gate B turnstile failure causing backlog of 3,500+ fans. Average wait time is 28m. Directing volunteers to assist.'
                  }
                </p>
              </div>
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
                  {animatedStat}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={styles.section} className="scroll-reveal" role="region" aria-label="Core Capabilities">
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
      <section id="role-selector" style={styles.roleSection} className="scroll-reveal" role="region" aria-label="Squad Draft Role Selector">
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
    borderBottom: '1px solid var(--border)',
    backgroundColor: 'var(--bg-card)'
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
    fontSize: '3.2rem',
    fontWeight: '900',
    fontFamily: 'var(--font-display)',
    lineHeight: '1.1',
    margin: 0,
    letterSpacing: '-0.02em'
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
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border)',
    boxShadow: 'var(--shadow-card)'
  },
  mockupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border)'
  },
  mockupPill: {
    fontSize: '0.68rem',
    background: 'rgba(16, 64, 38, 0.04)',
    border: '1px solid var(--border)',
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
    borderTop: '1px solid var(--border)'
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
    fontWeight: '900',
    fontFamily: 'var(--font-display)',
    margin: '0 0 10px 0',
    letterSpacing: '-0.01em'
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
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '180px',
    background: 'rgba(0, 0, 0, 0.02)'
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
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
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
    background: 'rgba(16, 64, 38, 0.03)',
    border: '1px solid var(--border)'
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
    background: 'rgba(16, 64, 38, 0.04)',
    border: '1.5px solid var(--border)'
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
