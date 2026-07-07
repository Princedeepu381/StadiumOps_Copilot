import React, { useState } from 'react';
import { API_BASE_URL } from '../config.js';
import { 
  Megaphone, 
  Globe, 
  Sparkles, 
  Loader, 
  Volume2, 
  CheckCircle,
  FileText,
  History
} from 'lucide-react';

export default function Announcements({ state, onPublishAnnouncement, activeIncidentShortcut, onClearIncidentShortcut }) {
  const { announcements, incidents, zones } = state;
  
  // Custom manual context if not using shortcut
  const [useManualText, setUseManualText] = useState(false);
  const [manualDescription, setManualDescription] = useState('');
  const [manualZone, setManualZone] = useState(zones[0]?.id || '');
  
  // Generation state
  const [generating, setGenerating] = useState(false);
  const [activeDraft, setActiveDraft] = useState(null);
  const [activeTab, setActiveTab] = useState('en'); // en / hi / es

  const handleGenerate = async () => {
    setGenerating(true);
    let context = {};

    if (activeIncidentShortcut && !useManualText) {
      context = {
        id: activeIncidentShortcut.id,
        type: activeIncidentShortcut.type,
        zoneId: activeIncidentShortcut.zoneId,
        description: activeIncidentShortcut.description
      };
    } else {
      context = {
        id: `manual-${Date.now()}`,
        type: 'manual',
        zoneId: manualZone,
        description: manualDescription
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/announce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentContext: context })
      });
      if (!res.ok) throw new Error("Failed to generate announcement");
      const data = await res.json();
      
      setActiveDraft(data);
      setActiveTab('en');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!activeDraft) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/announce/publish/${activeDraft.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error("Failed to publish");
      const data = await res.json();
      
      onPublishAnnouncement(data);
      setActiveDraft(null);
      if (onClearIncidentShortcut) onClearIncidentShortcut();
      alert("Announcement published successfully to public display boards!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Web Speech API Preview
  const handleSpeakPreview = () => {
    if (!activeDraft) return;
    let text = '';
    let lang = 'en-US';
    
    if (activeTab === 'en') {
      text = activeDraft.textEn;
      lang = 'en-US';
    } else if (activeTab === 'hi') {
      text = activeDraft.textHi;
      lang = 'hi-IN';
    } else if (activeTab === 'es') {
      text = activeDraft.textEs;
      lang = 'es-ES';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.cancel(); // Stop current speech
    window.speechSynthesis.speak(utterance);
  };

  const publishedHistory = announcements.filter(a => a.status === 'published');

  return (
    <div className="page-container">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Multilingual Announcement Broadcaster</h1>
          <p style={styles.subtitle}>GenAI-Powered Public PA Announcement Generator</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left: Input Selection & Generator */}
        <div style={styles.generatorSection}>
          
          <div style={styles.card} className="glass-panel scroll-reveal">
            <h3 style={styles.cardTitle}>
              <Megaphone size={18} color="var(--primary-hover)" /> 
              Select Announcement Trigger Context
            </h3>

            {activeIncidentShortcut && !useManualText ? (
              <div style={styles.shortcutBlock}>
                <div style={styles.shortcutHeader}>
                  <strong style={{ color: 'var(--color-warning)' }}>Selected Incident Trigger</strong>
                  <button style={styles.clearBtn} onClick={onClearIncidentShortcut}>Use Custom Text Instead</button>
                </div>
                <p style={styles.shortcutDesc}>
                  <strong>[{activeIncidentShortcut.severity.toUpperCase()}]</strong> {activeIncidentShortcut.description}
                </p>
                <span style={styles.shortcutMeta}>Zone: {zones.find(z => z.id === activeIncidentShortcut.zoneId)?.name}</span>
              </div>
            ) : (
              <div style={styles.manualBlock}>
                {activeIncidentShortcut && (
                  <button style={{ ...styles.clearBtn, marginBottom: '12px' }} onClick={() => setUseManualText(false)}>
                    Back to Selected Incident
                  </button>
                )}
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Zone Context</label>
                  <select 
                    value={manualZone} 
                    onChange={(e) => setManualZone(e.target.value)}
                    className="input-field"
                  >
                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>

                <div style={{ ...styles.formGroup, marginTop: '12px' }}>
                  <label style={styles.label}>Broadcast / Incident Description</label>
                  <textarea 
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    placeholder="Enter details here (e.g. East Shuttle delay of 25 minutes, redirecting traffic)..."
                    className="input-field"
                    rows={4}
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerate} 
              style={styles.generateBtn} 
              disabled={generating || (!activeIncidentShortcut && !manualDescription.trim())}
              className="btn"
            >
              {generating ? (
                <>
                  <Loader size={16} className="spin" /> Generating Drafts...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate Trilingual Draft
                </>
              )}
            </button>
          </div>

          {/* Published History */}
          <div style={styles.card} className="glass-panel scroll-reveal">
            <h3 style={styles.cardTitle}>
              <History size={18} color="var(--text-muted)" />
              Published Broadcast Log
            </h3>
            
            <div style={styles.historyList}>
              {publishedHistory.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
                  No announcements published yet.
                </p>
              ) : (
                publishedHistory.map((ann) => (
                  <div key={ann.id} style={styles.historyItem}>
                    <div style={styles.historyHeader}>
                      <span style={styles.historyId}>{ann.id.toUpperCase()}</span>
                      <span style={styles.historyTime}>{new Date(ann.createdAt).toLocaleTimeString()}</span>
                    </div>
                    
                    <div style={styles.historyLangs}>
                      <div style={styles.historyLangText}>
                        <span style={styles.langLabel}>EN:</span> {ann.textEn}
                      </div>
                      <div style={styles.historyLangText}>
                        <span style={styles.langLabel}>HI:</span> {ann.textHi}
                      </div>
                      <div style={styles.historyLangText}>
                        <span style={styles.langLabel}>ES:</span> {ann.textEs}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right: Draft Review & Publish Screen */}
        <div style={styles.draftSection}>
          {activeDraft ? (
            <div style={styles.draftCard} className="glass-panel scroll-reveal">
              
              <div style={styles.draftHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="var(--accent)" />
                  <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>Trilingual Draft Approval</strong>
                </div>
                <span style={styles.draftStatus}>Draft (Awaiting Review)</span>
              </div>

              {/* Tabs */}
              <div style={styles.tabsRow}>
                <button 
                  onClick={() => setActiveTab('en')} 
                  style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'en' ? 'var(--primary)' : 'transparent' }}
                >
                  🇺🇸 English
                </button>
                <button 
                  onClick={() => setActiveTab('hi')} 
                  style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'hi' ? 'var(--primary)' : 'transparent' }}
                >
                  🇮🇳 Hindi
                </button>
                <button 
                  onClick={() => setActiveTab('es')} 
                  style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'es' ? 'var(--primary)' : 'transparent' }}
                >
                  🇪🇸 Spanish
                </button>
              </div>

              {/* Tab Content */}
              <div style={styles.tabContent}>
                <p style={styles.draftText}>
                  {activeTab === 'en' && activeDraft.textEn}
                  {activeTab === 'hi' && activeDraft.textHi}
                  {activeTab === 'es' && activeDraft.textEs}
                </p>

                <div style={styles.textActionRow}>
                  <button onClick={handleSpeakPreview} style={styles.voiceBtn} className="btn-secondary">
                    <Volume2 size={16} /> Listen Audio Preview
                  </button>
                  <span style={styles.voiceNote}>Verifies text-to-speech phrasing and clarity</span>
                </div>
              </div>

              {/* Publish Button */}
              <div style={styles.publishBlock}>
                <button onClick={handlePublish} style={styles.publishBtn} className="btn">
                  <CheckCircle size={16} /> Approve & Publish Announcement
                </button>
                <p style={styles.publishDisclaimer}>
                  Publishing sends announcements to digital message boards and triggers PA broadcasts.
                </p>
              </div>

            </div>
          ) : (
            <div style={styles.emptyDraft} className="glass-panel scroll-reveal">
              <Globe size={40} color="var(--text-dim)" />
              <h3>Draft Review Standby</h3>
              <p>Select an active incident context and generate drafts. The trilingual translations will appear here for audit, speech verification, and final deployment.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  header: {
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '24px',
    alignItems: 'start'
  },
  generatorSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  card: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontFamily: 'var(--font-display)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  shortcutBlock: {
    padding: '14px',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.15)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  shortcutHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-hover)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  shortcutDesc: {
    fontSize: '0.875rem',
    lineHeight: '1.4'
  },
  shortcutMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)'
  },
  manualBlock: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  generateBtn: {
    marginTop: '6px',
    width: '100%'
  },
  draftSection: {
    position: 'sticky',
    top: '24px'
  },
  draftCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  draftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px'
  },
  draftStatus: {
    fontSize: '0.75rem',
    color: 'var(--color-warning)',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  tabsRow: {
    display: 'flex',
    gap: '16px',
    borderBottom: '1px solid var(--border)'
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '8px 12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  tabContent: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--border)',
    padding: '18px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  draftText: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'var(--text-main)',
    minHeight: '80px'
  },
  textActionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '12px'
  },
  voiceBtn: {
    padding: '6px 12px',
    fontSize: '0.75rem'
  },
  voiceNote: {
    fontSize: '0.7rem',
    color: 'var(--text-dim)'
  },
  publishBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    textAlign: 'center'
  },
  publishBtn: {
    backgroundColor: 'var(--primary)',
    width: '100%'
  },
  publishDisclaimer: {
    fontSize: '0.7rem',
    color: 'var(--text-dim)'
  },
  emptyDraft: {
    padding: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-dim)',
    gap: '12px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  historyItem: {
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-dim)'
  },
  historyId: {
    fontWeight: '600'
  },
  historyTime: {},
  historyLangs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  historyLangText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.3'
  },
  langLabel: {
    fontWeight: '600',
    color: 'var(--text-main)',
    marginRight: '4px'
  }
};
