import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Globe, Bot, User, AlertTriangle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
];

const QUICK_PROMPTS = {
  en: [
    'What should I do during a cyclone?',
    'How to safely evacuate with elderly parents?',
    'Where is the nearest shelter?',
    'My child has fever during evacuation — what to do?',
    'How to purify flood water for drinking?',
  ],
  te: [
    'తుఫాను సమయంలో ఏమి చేయాలి?',
    'సురక్షితంగా ఖాళీ చేయడం ఎలా?',
    'దగ్గరలో ఆశ్రయం ఎక్కడ ఉంది?',
    'వరద నీటిని శుభ్రం చేయడం ఎలా?',
  ],
  hi: [
    'चक्रवात में क्या करें?',
    'सुरक्षित निकासी कैसे करें?',
    'निकटतम आश्रय कहाँ है?',
    'बाढ़ के पानी को पीने योग्य कैसे बनाएं?',
  ],
};

const AUTH_TOKEN = () => localStorage.getItem('rp_token');

export default function ChatPage() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `**ReliefPulse AI Emergency Assistant** is online.\n\n🌊 Active disaster: Cyclone Michaung — High Risk. I can help you with:\n- Evacuation guidance\n- Finding nearest shelters\n- Medical emergency first-aid instructions\n- Survival tips for floods & cyclones\n\n*Please select your language above, then ask me anything.*\n\n⚠️ *Disclaimer: AI-assisted guidance — requires human emergency verification. For immediate danger, call 112.*`,
      timestamp: new Date(),
      model: 'ReliefPulse-AI',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8));
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');

    const userMsg = { role: 'user', content: userText, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: userText });

      const res = await axios.post(
        `${API}/api/chat/message`,
        { message: userText, messages: history, language, sessionId },
        { headers: { Authorization: `Bearer ${AUTH_TOKEN()}` } }
      );

      const data = res.data?.data || res.data?.reply || res.data;
      const content = res.data?.content || data?.content || data?.message || 'Response received.';
      const model = res.data?.model || data?.model || 'ReliefPulse AI';
      setMessages((m) => [...m, {
        role: 'assistant',
        content,
        model,
        timestamp: new Date(),
      }]);
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Connection issue. Please try again.';
      setMessages((m) => [...m, { role: 'assistant', content: `⚠️ ${errMsg}\n\nFor immediate assistance, call **112** or **1070**.`, timestamp: new Date(), isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)', gap: 0 }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 1rem 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan-medical), var(--purple-resource))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>ReliefPulse AI Assistant</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--emerald-safe)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald-safe)', animation: 'pulse 2s infinite' }} />
              Online · Emergency Guidance Mode
            </div>
          </div>
        </div>

        {/* Language selector */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {LANGUAGES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                background: language === code ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${language === code ? 'var(--cyan-medical)' : 'var(--border-subtle)'}`,
                borderRadius: 8, padding: '0.35rem 0.65rem', cursor: 'pointer',
                color: language === code ? 'var(--cyan-medical)' : 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s',
              }}
            >
              {flag} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem', flexShrink: 0 }}>
        {(QUICK_PROMPTS[language] || QUICK_PROMPTS.en).map((p) => (
          <button key={p} onClick={() => sendMessage(p)} className="btn btn-outline" style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', borderRadius: 99 }}>
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? 'linear-gradient(135deg, var(--cyan-medical), var(--purple-resource))' : 'linear-gradient(135deg, #1e3a5f, #1a2e4a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
            }}>
              {msg.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="var(--cyan-medical)" />}
            </div>
            <div style={{
              maxWidth: '75%',
              background: msg.role === 'user' ? 'rgba(6,182,212,0.1)' : msg.isError ? 'rgba(255,59,59,0.08)' : 'var(--bg-card)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(6,182,212,0.25)' : msg.isError ? 'rgba(255,59,59,0.2)' : 'var(--border-subtle)'}`,
              borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '0.75rem 1rem',
            }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }} />
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {msg.timestamp?.toLocaleTimeString?.()}
                {msg.model && <span>· {msg.model}</span>}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f, #1a2e4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
              <Bot size={14} color="var(--cyan-medical)" />
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px 12px 12px 12px', padding: '0.75rem 1rem' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d) => (
                  <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan-medical)', animation: `pulse 1.2s ${d}s infinite` }} />
                ))}
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>ReliefPulse AI is responding…</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="form-input"
            placeholder="Ask about emergency procedures, shelter locations, evacuation routes…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn btn-primary" style={{ padding: '0.6rem 1rem', flexShrink: 0 }}>
            <Send size={15} />
          </button>
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <AlertTriangle size={10} />
          AI-assisted guidance — requires human emergency verification. For immediate danger, call 112 or 1070.
        </div>
      </div>
    </div>
  );
}
