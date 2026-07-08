import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';
import { Send, X, Bot, User, Loader } from 'lucide-react';

export default function Copilot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your StadiumOps Copilot. I have real-time visibility into the stadium's zones, active incidents, accessibility requests, transport alerts, and staffing loads. Ask me anything about the current situation."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What is the status of Gate B?",
    "Show me critical incidents",
    "Are there any shuttle delays?",
    "Any pending accessibility requests?"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) setInputValue('');

    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Structure the chat history for API ingestion
      const chatHistory = messages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch(`${API_BASE_URL}/api/ai/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory,
          userQuestion: text
        })
      });

      if (!res.ok) throw new Error("Failed to contact Copilot");
      const data = await res.json();
      
      setMessages([...newMessages, { sender: 'ai', text: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: 'ai', text: "⚠️ Error contacting Copilot. Please verify that the backend server is running and a valid GEMINI_API_KEY is configured in your .env file." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} className="slide-in">
      <div style={styles.container} className="glass-blur">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <Bot size={22} color="var(--primary-hover)" />
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>StadiumOps Copilot</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.messageRow,
                justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {m.sender === 'ai' && (
                <div style={{ ...styles.avatar, backgroundColor: 'rgba(16, 64, 38, 0.08)' }}>
                  <Bot size={16} color="var(--primary)" />
                </div>
              )}
              
              <div 
                style={{
                  ...styles.bubble,
                  background: m.sender === 'user' ? 'var(--primary)' : 'rgba(16, 64, 38, 0.03)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px'
                }}
              >
                {/* Parse Markdown-like bolding and bullets in a very simple way */}
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {m.text.split('\n').map((line, lIdx) => {
                    // Simple bullet points
                    if (line.startsWith('*') || line.startsWith('-')) {
                      return <div key={lIdx} style={{ marginLeft: '12px', marginTop: '4px' }}>• {line.substring(1).trim()}</div>;
                    }
                    // Simple bolding parsing
                    const parts = line.split('**');
                    if (parts.length > 1) {
                      return (
                        <div key={lIdx} style={{ marginTop: lIdx > 0 ? '6px' : '0' }}>
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)' }}>{p}</strong> : p)}
                        </div>
                      );
                    }
                    return <div key={lIdx} style={{ marginTop: lIdx > 0 ? '6px' : '0' }}>{line}</div>;
                  })}
                </div>
              </div>

              {m.sender === 'user' && (
                <div style={{ ...styles.avatar, backgroundColor: 'rgba(16, 64, 38, 0.08)' }}>
                  <User size={16} color="var(--text-main)" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={styles.messageRow}>
              <div style={{ ...styles.avatar, backgroundColor: 'rgba(16, 64, 38, 0.08)' }}>
                <Bot size={16} color="var(--primary)" />
              </div>
              <div style={{ ...styles.bubble, background: 'rgba(16, 64, 38, 0.03)', border: '1px solid var(--border)' }}>
                <Loader className="spin" size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={styles.suggestionsContainer}>
            <p style={styles.suggestionsLabel}>Suggested Queries:</p>
            <div style={styles.suggestionsGrid}>
              {suggestions.map((s, idx) => (
                <button 
                  key={idx} 
                  style={styles.suggestionBtn} 
                  onClick={() => handleSendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form 
          style={styles.inputForm} 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input 
            type="text" 
            placeholder="Ask Copilot about stadium state..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={styles.chatInput}
          />
          <button type="submit" style={styles.sendBtn} disabled={loading || !inputValue.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '420px',
    height: '100vh',
    zIndex: '1000',
    padding: '16px',
    boxSizing: 'border-box'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    border: '1px solid var(--border-active)',
    boxShadow: 'var(--shadow-card)',
    borderRadius: '16px',
    backgroundColor: 'var(--bg-card)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: '1px solid var(--border)'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    maxWidth: '100%'
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: '2px'
  },
  bubble: {
    padding: '10px 14px',
    maxWidth: 'calc(100% - 36px)',
  },
  suggestionsContainer: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border)'
  },
  suggestionsLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  suggestionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  suggestionBtn: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '0.8rem',
    color: 'var(--text-main)',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  inputForm: {
    display: 'flex',
    padding: '12px',
    borderTop: '1px solid var(--border)',
    gap: '8px',
    alignItems: 'center'
  },
  chatInput: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.02)',
    border: '1px solid var(--border)',
    color: 'var(--text-main)',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none'
  },
  sendBtn: {
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0
  }
};
const _s = `
  .suggestionBtn:hover {
    background: rgba(16, 64, 38, 0.04);
    border-color: var(--border-active);
  }
  .closeBtn:hover {
    color: var(--text-main);
    background: rgba(16, 64, 38, 0.03);
  }
  .sendBtn:disabled {
    background: rgba(16, 64, 38, 0.03);
    color: var(--text-dim);
    cursor: not-allowed;
  }
`;
