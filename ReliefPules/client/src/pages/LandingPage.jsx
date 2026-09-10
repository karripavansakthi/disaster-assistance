import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, MapPin, Heart, Home, Package,
  Users, Bot, ArrowRight, Radio, Activity, CheckCircle,
  Clock, Phone, Globe, ChevronRight, Zap, Eye, Compass,
  Layers, MessageSquare, Search, BedDouble, Wind, Droplets, LogOut
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [status, setStatus] = useState({
    disasterName: 'Cyclone Michaung Impact & Storm Surge',
    riskLevel: 'High Risk',
    affectedDistricts: ['Visakhapatnam', 'Kakinada', 'East Godavari'],
    rainfallMm: 142,
    windSpeedKmh: 86,
    floodRisk: 'High',
    evacuatedCount: 12480,
    activeSosCount: 38,
    sheltersOpenCount: 17,
    bedsAvailableCount: 4280,
    ambulancesAvailableCount: 26,
  });

  // Interactive Live AI preview on landing page
  const [query, setQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    axios.get(`${API}/api/status`)
      .then((res) => {
        if (res.data?.data) setStatus(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleAskAi = async (customText) => {
    const textToAsk = customText || query;
    if (!textToAsk.trim()) return;
    setAiLoading(true);
    try {
      const res = await axios.post(`${API}/api/chat/message`, {
        message: textToAsk,
        messages: [{ role: 'user', content: textToAsk }],
        language: lang,
      });
      const replyText = res.data?.content || res.data?.message || res.data?.reply?.content || res.data?.data?.content;
      setAiAnswer(replyText || 'AI response received.');
    } catch {
      setAiAnswer('Immediate guidance: Head to the nearest high ground or St. Mary Evacuation Hub. Turn off main circuit breaker. Emergency national helpline: 112 / 1070.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050a17', color: '#e2e8f0', overflowX: 'hidden' }}>
      
      {/* ── TOP ANNOUNCEMENT BAR ─────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(90deg, rgba(220,38,38,0.2) 0%, rgba(245,158,11,0.2) 100%)', borderBottom: '1px solid rgba(220,38,38,0.3)', padding: '0.45rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          <strong style={{ color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LIVE EMERGENCY ALERT:</strong>
          <span>{status.disasterName} — {status.riskLevel} (Visakhapatnam, Kakinada, East Godavari)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#94a3b8' }}>Rainfall: <strong style={{ color: '#60a5fa' }}>{status.rainfallMm} mm</strong> · Wind: <strong style={{ color: '#f8fafc' }}>{status.windSpeedKmh} km/h</strong></span>
          <a href="tel:112" style={{ color: '#ef4444', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Phone size={12} /> Helpline 112 / 1070
          </a>
        </div>
      </div>

      {/* ── LANDING NAVBAR ───────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2.5rem', borderBottom: '1px solid rgba(99,179,237,0.12)', background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Relief<span style={{ color: '#06b6d4' }}>Pulse</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.08em' }}>DISASTER RESPONSE COMMAND</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <Link to="/map" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Live GIS Map</Link>
          <Link to="/shelters" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Safe Shelters</Link>
          <Link to="/medical" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Medical Support</Link>
          <Link to="/resources" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Relief Inventory</Link>
          <Link to="/chat" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>AI Guide</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/emergency')} style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', color: 'white', border: '1px solid rgba(220,38,38,0.5)', padding: '0.55rem 1.1rem', borderRadius: 8, fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 0 15px rgba(220,38,38,0.3)' }}>
            <AlertTriangle size={14} /> SOS DISTRESS
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#06b6d4', color: '#000', border: 'none', padding: '0.55rem 1.1rem', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} /> Enter Command Center
          </button>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.2)', padding: '0.25rem 0.65rem 0.25rem 0.45rem', borderRadius: 99 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem', marginLeft: '0.2rem', borderRadius: 4, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)', padding: '0.55rem 0.9rem', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section style={{ padding: '4.5rem 2.5rem 3.5rem', maxWidth: 1240, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 99, padding: '0.35rem 1rem', fontSize: '0.78rem', color: '#22d3ee', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Zap size={14} /> Next-Generation AI Disaster Management & Emergency Response
        </div>

        <h1 style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 auto 1.25rem', maxWidth: 960, background: 'linear-gradient(180deg, #ffffff 30%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          One Platform. One Response.<br />
          <span style={{ background: 'linear-gradient(90deg, #ef4444, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Every Life Matters.
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: 740, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          ReliefPulse connects stranded citizens, NDRF/SDRF rescue teams, medical staff, and shelter administrators into a unified, sub-second disaster operations command system.
        </p>

        {/* 4 Big Action Launchers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: 1050, margin: '0 auto 3.5rem', textAlign: 'left' }}>
          <div onClick={() => navigate('/emergency')} style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(153,27,27,0.1) 100%)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 14, padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 0 25px rgba(220,38,38,0.15)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <AlertTriangle size={20} color="white" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f87171', marginBottom: '0.2rem' }}>🔴 I NEED HELP</div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>1-click SOS distress dispatch with browser GPS & vulnerable counters.</div>
          </div>

          <div onClick={() => navigate('/shelters')} style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Home size={20} color="white" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#34d399', marginBottom: '0.2rem' }}>🟢 FIND SAFE SHELTER</div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>{status.bedsAvailableCount.toLocaleString()} beds & food ready with route safety bypasses.</div>
          </div>

          <div onClick={() => navigate('/medical')} style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(14,116,144,0.08) 100%)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 14, padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Heart size={20} color="white" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#22d3ee', marginBottom: '0.2rem' }}>🏥 FIND MEDICAL HELP</div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>ICU telemetry, {status.ambulancesAvailableCount} ambulances & emergency blood banks.</div>
          </div>

          <div onClick={() => navigate('/chat')} style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(126,34,206,0.08) 100%)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 14, padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Bot size={20} color="white" />
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#c084fc', marginBottom: '0.2rem' }}>🤖 RELIEFPULSE AI</div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>Multilingual emergency survival guide in English, Telugu & Hindi.</div>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div style={{ background: 'rgba(15,30,53,0.7)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: 16, padding: '1.75rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>{status.activeSosCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>Active SOS Distress</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{status.evacuatedCount.toLocaleString()}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>Citizens Evacuated</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>{status.bedsAvailableCount.toLocaleString()}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>Safe Shelter Beds</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06b6d4', lineHeight: 1 }}>{status.ambulancesAvailableCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.35rem', textTransform: 'uppercase' }}>Ambulances On Scene</div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE AI EMERGENCY TRIAL ON LANDING PAGE ───────── */}
      <section style={{ padding: '3rem 2.5rem', background: 'linear-gradient(180deg, rgba(6,12,26,0) 0%, rgba(10,22,40,0.6) 100%)', borderTop: '1px solid rgba(99,179,237,0.1)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#06b6d4', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              <Bot size={15} /> ReliefPulse AI Emergency Assistant
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Ask Survival Instructions in Real-Time</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Instant guidance tailored to Cyclone Michaung conditions with language support for English, Telugu, and Hindi.</p>
          </div>

          <div style={{ background: '#0a1628', border: '1px solid rgba(99,179,237,0.25)', borderRadius: 16, padding: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['en', 'te', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    background: lang === l ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${lang === l ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
                    color: lang === l ? '#22d3ee' : '#94a3b8',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {l === 'en' ? '🇬🇧 English' : l === 'te' ? '🇮🇳 తెలుగు' : '🇮🇳 हिंदी'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'te' ? 'తుఫాను సమయంలో ప్రాథమిక రక్షణ చర్యలు ఏమిటి?' : lang === 'hi' ? 'बाढ़ के समय क्या करें?' : 'What are the immediate survival steps during this cyclone?'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                style={{ flex: 1, padding: '0.8rem 1rem' }}
              />
              <button
                onClick={() => handleAskAi()}
                disabled={aiLoading}
                className="btn btn-primary"
                style={{ padding: '0.8rem 1.5rem', fontWeight: 800 }}
              >
                {aiLoading ? 'Thinking…' : 'Ask AI'}
              </button>
            </div>

            {/* Pre-canned quick questions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: aiAnswer ? '1rem' : 0 }}>
              {[
                'How to protect infant during flood?',
                'Where is St. Mary Shelter?',
                'Water reached ground floor — action plan?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); handleAskAi(q); }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '0.25rem 0.75rem', fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer' }}
                >
                  💡 {q}
                </button>
              ))}
            </div>

            {aiAnswer && (
              <div style={{ marginTop: '1rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10, padding: '1rem', fontSize: '0.85rem', lineHeight: 1.6, color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                <div style={{ fontWeight: 700, color: '#06b6d4', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bot size={15} /> ReliefPulse AI Emergency Response:
                </div>
                {aiAnswer}
                <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                  *Disclaimer: AI-assisted guidance — requires human emergency verification.*
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 10 CORE RESCUE MODULES SHOWCASE ──────────────────────── */}
      <section style={{ padding: '4.5rem 2.5rem', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Built for Real-World Emergency Coordination
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 680, margin: '0 auto' }}>
            Comprehensive operational capability from survivor distress calls to regional command analytics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            {
              icon: MapPin,
              title: 'Live GIS Disaster Map',
              desc: 'Interactive Leaflet OpenStreetMap layers for SOS beacons, safe shelters, hospitals, rescue teams, and road closures.',
              path: '/map',
              badge: 'Leaflet GIS',
              color: '#3b82f6',
            },
            {
              icon: AlertTriangle,
              title: 'Emergency SOS & Timeline',
              desc: 'One-click SOS generation (RP-2026-XXXXX), AI priority scoring (0-100), and 6-stage milestone rescue progress tracking.',
              path: '/emergency',
              badge: 'Sub-Second Triage',
              color: '#ef4444',
            },
            {
              icon: Home,
              title: 'Safe Shelters & Route Safety',
              desc: 'Real-time bed occupancy, potable water, hot meals, and route warnings to bypass waterlogged roads.',
              path: '/shelters',
              badge: 'Live Bed Meter',
              color: '#10b981',
            },
            {
              icon: Heart,
              title: 'Medical Support Dashboard',
              desc: 'Telemetric bed counts, ICU availability, ambulance tracking, blood supply, and trauma doctor availability.',
              path: '/medical',
              badge: 'Hospital Network',
              color: '#06b6d4',
            },
            {
              icon: Package,
              title: 'Food & Relief Inventory',
              desc: 'Automated depot supply monitoring tracking available vs required meals, water bottles, and infant baby kits.',
              path: '/resources',
              badge: 'Warehouse Logistics',
              color: '#a855f7',
            },
            {
              icon: Users,
              title: 'Rescue Teams & Ambulances',
              desc: 'NDRF and SDRF team locations, squad specializations (Flood/Boat/Structural), team leaders, and live arrival ETAs.',
              path: '/rescue-teams',
              badge: 'Squad Dispatch',
              color: '#f59e0b',
            },
            {
              icon: Search,
              title: 'Family Reunification Portal',
              desc: 'Report missing individuals, search found evacuees, confidence matching, and confidential contact protection.',
              path: '/reunification',
              badge: 'Confidential Match',
              color: '#38bdf8',
            },
            {
              icon: Activity,
              title: 'Command Center Analytics',
              desc: 'Visualized Recharts telemetry of SOS surge patterns, triage severity breakdown, and district resource allocations.',
              path: '/analytics',
              badge: 'Recharts Telemetry',
              color: '#f43f5e',
            },
            {
              icon: Radio,
              title: 'Field Reports & Feedback',
              desc: 'Crowdsourced geo-tagged hazard reporting and 1-5 star survivor evaluations of shelter conditions.',
              path: '/reports',
              badge: 'Citizen Intel',
              color: '#eab308',
            },
          ].map((feat) => (
            <div
              key={feat.title}
              onClick={() => navigate(feat.path)}
              style={{
                background: '#0a1628',
                border: '1px solid rgba(99,179,237,0.15)',
                borderRadius: 14,
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = feat.color;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,179,237,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${feat.color}15`, border: `1px solid ${feat.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <feat.icon size={22} color={feat.color} />
                </div>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
                  {feat.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>{feat.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1.25rem' }}>{feat.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: feat.color }}>
                Open Module <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ────────────────────────────────── */}
      <section style={{ padding: '3.5rem 2.5rem', maxWidth: 1240, margin: '0 auto 4rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f2b48 0%, #061325 100%)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 20, padding: '3rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.75rem', color: '#ffffff' }}>
            In Emergencies, Seconds Save Lives.
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto 1.75rem', fontSize: '1rem', lineHeight: 1.5 }}>
            Access the live disaster operations dashboard immediately or connect your responder credentials.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 800 }}
            >
              Launch Live Command Center <ArrowRight size={16} />
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/map')}
                className="btn btn-outline"
                style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                View Live GIS Incident Map
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-outline"
                style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                Sign In with Responder Role
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(99,179,237,0.12)', background: '#030712', padding: '3rem 2.5rem 2rem', fontSize: '0.8rem', color: '#64748b' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={16} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                Relief<span style={{ color: '#06b6d4' }}>Pulse</span>
              </span>
            </div>
            <p style={{ maxWidth: 320, lineHeight: 1.5, marginBottom: '1rem' }}>
              AI-powered disaster management & emergency response platform. Designed for citizens, rescue agencies, medical officers, and command operators.
            </p>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>
              National Emergency: 112 · Disaster Helpline: 1070
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>Operations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Command Center</Link>
              <Link to="/map" style={{ color: '#94a3b8', textDecoration: 'none' }}>Live GIS Map</Link>
              <Link to="/emergency" style={{ color: '#94a3b8', textDecoration: 'none' }}>SOS Dispatch</Link>
              <Link to="/shelters" style={{ color: '#94a3b8', textDecoration: 'none' }}>Safe Shelters</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>Resources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link to="/medical" style={{ color: '#94a3b8', textDecoration: 'none' }}>Medical Support</Link>
              <Link to="/resources" style={{ color: '#94a3b8', textDecoration: 'none' }}>Food & Water Depots</Link>
              <Link to="/reunification" style={{ color: '#94a3b8', textDecoration: 'none' }}>Family Reunification</Link>
              <Link to="/chat" style={{ color: '#94a3b8', textDecoration: 'none' }}>Multilingual AI Guide</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>Access</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Command Dashboard</Link>
                  <Link to="/reports" style={{ color: '#94a3b8', textDecoration: 'none' }}>Incident Reports</Link>
                  <span onClick={logout} style={{ color: '#ef4444', textDecoration: 'none', cursor: 'pointer', fontSize: '0.78rem' }}>Sign Out ({user?.name?.split(' ')[0] || 'User'})</span>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Responder Sign In</Link>
                  <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>Citizen Registration</Link>
                </>
              )}
              <Link to="/analytics" style={{ color: '#94a3b8', textDecoration: 'none' }}>Telemetry Analytics</Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1240, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>© 2026 ReliefPulse. All rights reserved. “One Platform. One Response. Every Life Matters.”</div>
          <div style={{ fontSize: '0.72rem' }}>AI-assisted triage requires human emergency verification.</div>
        </div>
      </footer>
    </div>
  );
}
