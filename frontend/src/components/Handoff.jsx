import React, { useState } from 'react';
import { API_BASE_URL } from '../config.js';
import { FileText, Clock, Sparkles, Loader, Clipboard, Check } from 'lucide-react';

export default function Handoff({ state }) {
  const [selectedWindow, setSelectedWindow] = useState('Last 30 Minutes');
  const [loading, setLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [copied, setCopied] = useState(false);
  const [summaryHistory, setSummaryHistory] = useState([]);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummaryText('');
    setCopied(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ windowName: selectedWindow })
      });

      if (!res.ok) throw new Error("Failed to generate summary");
      const data = await res.json();
      
      setSummaryText(data.summary);
      
      // Save to local history list
      setSummaryHistory(prev => [
        {
          id: `sum-${Date.now()}`,
          window: selectedWindow,
          text: data.summary,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-container">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Situation & Handoff Summaries</h1>
          <p style={styles.subtitle}>GenAI-Compiled Shift Briefings for Inbound Operations Staff</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left: Generator Panel & History */}
        <div style={styles.leftCol}>
          <div style={styles.card} className="glass-panel scroll-reveal">
            <h3 style={styles.cardTitle}>
              <Clock size={18} color="var(--primary-hover)" /> Configure Briefing Parameters
            </h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Time Range / Mode</label>
              <div style={styles.radioGrid}>
                {['Last 30 Minutes', 'Full Shift (Last 8 Hours)', 'Incident Handoff Only'].map((windowName) => (
                  <button 
                    key={windowName}
                    onClick={() => setSelectedWindow(windowName)}
                    style={{
                      ...styles.radioBtn,
                      borderColor: selectedWindow === windowName ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: selectedWindow === windowName ? 'rgba(37,99,235,0.05)' : 'rgba(0,0,0,0.1)'
                    }}
                  >
                    {windowName}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerateSummary} 
              style={styles.generateBtn}
              disabled={loading}
              className="btn"
            >
              {loading ? (
                <>
                  <Loader size={16} className="spin" /> Compiling Report Factors...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate Situation Briefing
                </>
              )}
            </button>
          </div>

          {/* History */}
          <div style={styles.card} className="glass-panel scroll-reveal">
            <h3 style={styles.cardTitle}>
              <FileText size={18} color="var(--text-muted)" /> Briefing Log History
            </h3>
            <div style={styles.historyList}>
              {summaryHistory.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
                  No briefings compiled during this session.
                </p>
              ) : (
                summaryHistory.map((historyItem) => (
                  <button 
                    key={historyItem.id} 
                    style={styles.historyItemBtn}
                    onClick={() => setSummaryText(historyItem.text)}
                  >
                    <div style={styles.historyItemHeader}>
                      <strong>{historyItem.window}</strong>
                      <span>{historyItem.timestamp}</span>
                    </div>
                    <p style={styles.historyItemSnippet}>
                      {historyItem.text.substring(0, 80)}...
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Display Panel */}
        <div style={styles.rightCol}>
          {summaryText ? (
            <div style={styles.reportCard} className="glass-panel scroll-reveal">
              <div style={styles.reportHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="var(--color-success)" />
                  <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>Shift Handoff Report</strong>
                </div>
                
                <button 
                  onClick={handleCopyToClipboard} 
                  style={styles.copyBtn}
                  className="btn btn-secondary btn-sm"
                >
                  {copied ? <Check size={14} color="var(--color-success)" /> : <Clipboard size={14} />}
                  {copied ? 'Copied!' : 'Copy Report'}
                </button>
              </div>

              {/* Render Markdown Summary */}
              <div style={styles.reportContent}>
                {summaryText.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h2 key={idx} style={styles.mdH1}>{line.substring(2)}</h2>;
                  }
                  if (line.startsWith('## ')) {
                    return <h3 key={idx} style={styles.mdH2}>{line.substring(3)}</h3>;
                  }
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return (
                      <div key={idx} style={styles.mdBullet}>
                        • {line.substring(2)}
                      </div>
                    );
                  }
                  if (line.trim() === '') return <div key={idx} style={{ height: '10px' }} />;
                  
                  // Bold tags inline
                  const parts = line.split('**');
                  if (parts.length > 1) {
                    return (
                      <p key={idx} style={styles.mdPara}>
                        {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{p}</strong> : p)}
                      </p>
                    );
                  }

                  return <p key={idx} style={styles.mdPara}>{line}</p>;
                })}
              </div>

              <div style={styles.reportFooter}>
                <span>Compiled using live stadium status registers.</span>
              </div>

            </div>
          ) : (
            <div style={styles.emptyReport} className="glass-panel scroll-reveal">
              <FileText size={40} color="var(--text-dim)" />
              <h3>Shift Briefing Standby</h3>
              <p>Configure the briefing timeframe parameters and hit "Generate". The final structured Operations report will load here for transfer and team briefing.</p>
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
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '24px',
    alignItems: 'start'
  },
  leftCol: {
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  radioGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  radioBtn: {
    padding: '12px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    textAlign: 'left',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  generateBtn: {
    width: '100%'
  },
  rightCol: {
    position: 'sticky',
    top: '24px'
  },
  reportCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '12px'
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  reportContent: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--border)',
    padding: '20px',
    borderRadius: '8px',
    maxHeight: '520px',
    overflowY: 'auto'
  },
  reportFooter: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    textAlign: 'center',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px'
  },
  emptyReport: {
    padding: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-dim)',
    gap: '12px'
  },
  mdH1: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-display)',
    margin: '16px 0 8px 0',
    color: 'var(--text-main)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '4px'
  },
  mdH2: {
    fontSize: '1.05rem',
    fontFamily: 'var(--font-display)',
    margin: '12px 0 6px 0',
    color: 'var(--primary-hover)'
  },
  mdBullet: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: 'var(--text-muted)',
    marginLeft: '12px',
    marginTop: '4px'
  },
  mdPara: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: 'var(--text-muted)'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '260px',
    overflowY: 'auto'
  },
  historyItemBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '10px 12px',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    transition: 'all 0.2s'
  },
  historyItemBtn: {
    // hover helper
  },
  historyItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-main)'
  },
  historyItemSnippet: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};
const _hs = `
  .historyItemBtn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--border-active);
    color: var(--text-main);
  }
`;
