import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, MapPin, Users, Clock, CheckCircle, Circle, Loader, Send } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_FORM = {
  victimName: '',
  phone: '',
  alternatePhone: '',
  disasterType: 'cyclone',
  assistanceType: 'rescue',
  medicalEmergency: false,
  location: { address: '', city: 'Visakhapatnam', district: 'Visakhapatnam', coordinates: { lat: 17.7231, lng: 83.3012 } },
  peopleCount: 1,
  vulnerablePeople: { children: 0, elderly: 0, injured: 0, disabled: 0, pregnant: 0 },
  description: '',
};

function TimelineItem({ stage, notes, status }) {
  const cfg = {
    done: { dot: 'done', icon: '✓', color: 'var(--emerald-safe)' },
    active: { dot: 'active', icon: '●', color: 'var(--amber-warning)' },
    pending: { dot: 'pending', icon: '○', color: 'var(--text-muted)' },
  }[status];
  return (
    <div className="timeline-item" style={{ paddingLeft: '1.75rem', position: 'relative', paddingBottom: '1rem' }}>
      <div className={`timeline-dot ${cfg.dot}`} style={{ position: 'absolute', left: 0, top: 2 }}>{cfg.icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: cfg.color }}>{stage}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{notes}</div>
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [trackId, setTrackId] = useState('');
  const [tracked, setTracked] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [tab, setTab] = useState('submit'); // submit | track

  const set = (path, val) =>
    setForm((prev) => {
      const keys = path.split('.');
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = val;
      return next;
    });

  const detectGps = () => {
    setGpsLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        set('location.coordinates.lat', pos.coords.latitude);
        set('location.coordinates.lng', pos.coords.longitude);
        set('location.address', `GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setGpsLoading(false);
      },
      () => {
        set('location.address', 'GPS unavailable — please enter address manually');
        setGpsLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/emergency`, form);
      setResult(res.data.data);
      setTab('result');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit SOS. Please call 112 immediately.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setTrackLoading(true);
    try {
      const res = await axios.get(`${API}/api/emergency/${trackId.trim().toUpperCase()}`);
      setTracked(res.data.data);
    } catch {
      alert('SOS ID not found. Please check and retry.');
    } finally {
      setTrackLoading(false);
    }
  };

  const sevColor = { critical: '#ff3b3b', high: '#f59e0b', moderate: '#60a5fa', low: '#34d399' };
  const getTimelineStatus = (item, idx, arr) => {
    if (item.completed) return 'done';
    if (idx > 0 && arr[idx - 1]?.completed) return 'active';
    return 'pending';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      {/* Tab Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <AlertTriangle size={20} color="var(--red-critical)" />
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Emergency SOS System</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          {['submit', 'track'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              {t === 'submit' ? '🆘 Submit SOS' : '🔍 Track SOS'}
            </button>
          ))}
        </div>
      </div>

      {/* ── SOS Form ─────────────────────────────────────────────── */}
      {tab === 'submit' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.25rem', alignItems: 'start' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ borderColor: 'rgba(255,59,59,0.3)' }}>
              <div className="card-header">
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--red-critical)' }}>🆘 Distress Information</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>All fields required for emergency processing</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Full Name *</label>
                  <input className="form-input" value={form.victimName} onChange={(e) => set('victimName', e.target.value)} placeholder="Name of person in distress" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input className="form-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Active mobile number" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Type *</label>
                  <select className="form-input" value={form.assistanceType} onChange={(e) => set('assistanceType', e.target.value)} required>
                    <option value="rescue">Water Rescue / Evacuation</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="food_water">Food & Water</option>
                    <option value="shelter">Need Shelter</option>
                    <option value="evacuation">Evacuation Assistance</option>
                    <option value="all_critical">All — Critical Situation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Disaster Type</label>
                  <select className="form-input" value={form.disasterType} onChange={(e) => set('disasterType', e.target.value)}>
                    <option value="cyclone">Cyclone</option>
                    <option value="flood">Flood</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="landslide">Landslide</option>
                    <option value="fire">Fire</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--red-critical)' }}>
                  <input type="checkbox" checked={form.medicalEmergency} onChange={(e) => set('medicalEmergency', e.target.checked)} />
                  ⚠️ Medical Emergency (Injury, Labour, Unconscious person)
                </label>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />Location</h3>
                <button type="button" onClick={detectGps} className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                  {gpsLoading ? '⏳ Detecting…' : '📍 Detect GPS'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Full Address / Landmark *</label>
                  <input className="form-input" value={form.location.address} onChange={(e) => set('location.address', e.target.value)} placeholder="House No, Street, Area, Landmark" required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={form.location.city} onChange={(e) => set('location.city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <select className="form-input" value={form.location.district} onChange={(e) => set('location.district', e.target.value)}>
                    <option>Visakhapatnam</option>
                    <option>Kakinada</option>
                    <option>East Godavari</option>
                  </select>
                </div>
              </div>
            </div>

            {/* People */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}><Users size={14} style={{ display: 'inline', marginRight: 4 }} />People</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Total People *', key: 'peopleCount', top: true },
                  { label: 'Children (< 12)', key: 'children' },
                  { label: 'Elderly (> 65)', key: 'elderly' },
                  { label: 'Injured', key: 'injured' },
                  { label: 'Disabled', key: 'disabled' },
                  { label: 'Pregnant', key: 'pregnant' },
                ].map(({ label, key, top }) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      type="number" min="0" className="form-input"
                      value={top ? form.peopleCount : form.vulnerablePeople[key]}
                      onChange={(e) => top ? set('peopleCount', Number(e.target.value)) : set(`vulnerablePeople.${key}`, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <div className="form-group">
                <label className="form-label">Situation Description *</label>
                <textarea className="form-input" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe immediate danger: water level, structural damage, injuries, access road status..." required style={{ resize: 'vertical' }} />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-danger" style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 800, justifyContent: 'center', boxShadow: '0 0 20px rgba(255,59,59,0.3)' }}>
              {submitting ? <><div className="spinner" />&nbsp;Submitting SOS…</> : <><Send size={16} />&nbsp;SUBMIT EMERGENCY SOS</>}
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              SOS submission is processed immediately 24/7. If unable to access internet, call <strong>112</strong> or <strong>1070</strong>.
            </p>
          </form>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ borderColor: 'rgba(6,182,212,0.25)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--cyan-medical)' }}>Emergency Helplines</h3>
              {[
                { num: '112', label: 'National Emergency Helpline' },
                { num: '1070', label: 'AP Disaster Helpline' },
                { num: '108', label: 'Ambulance / Medical' },
                { num: '101', label: 'Fire Brigade' },
                { num: '100', label: 'Police Control Room' },
              ].map(({ num, label }) => (
                <div key={num} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
                  <a href={`tel:${num}`} style={{ fontWeight: 800, color: 'var(--red-critical)', fontSize: '1.05rem', textDecoration: 'none' }}>{num}</a>
                </div>
              ))}
            </div>

            <div className="card" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--amber-warning)' }}>⚡ Immediate Safety Steps</h3>
              {[
                'Move to highest floor immediately. Do NOT go to basement.',
                'Turn off electricity mains if safe to do so.',
                'Stay away from power lines and poles.',
                'Keep mobile charged. Signal rescuers with light.',
                'Do NOT cross flooded roads on foot or vehicle.',
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '0.3rem 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--amber-warning)', fontWeight: 700 }}>{i + 1}.</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SOS Result ─────────────────────────────────────────────── */}
      {tab === 'result' && result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="animate-fadeIn">
          <div>
            {/* SOS Confirmation */}
            <div className="card" style={{ borderColor: 'rgba(16,185,129,0.35)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle size={32} color="var(--emerald-safe)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--emerald-safe)' }}>SOS Registered Successfully</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI triage complete — response team alerted</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>SOS REFERENCE ID</div>
                <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cyan-medical)', letterSpacing: '0.04em' }}>{result.sosId}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Save this ID to track your SOS status</div>
              </div>
              {/* AI Triage */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>🤖 AI TRIAGE ASSESSMENT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.6rem' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: `conic-gradient(${sevColor[result.severity] || 'var(--red-critical)'} ${result.priorityScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: sevColor[result.severity] }}>{result.priorityScore}</span>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/100</span>
                    </div>
                  </div>
                  <div>
                    <span className={`badge badge-${result.severity}`} style={{ marginBottom: '0.35rem', display: 'inline-flex' }}>{result.severity?.toUpperCase()}</span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.triageReason}</p>
                  </div>
                </div>
                {result.assignedTeam?.teamId && (
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, padding: '0.6rem', fontSize: '0.78rem' }}>
                    ✅ <strong>Team {result.assignedTeam.teamId}</strong> assigned — Led by {result.assignedTeam.leader} · ETA {result.assignedTeam.etaMinutes} min
                  </div>
                )}
              </div>
            </div>

            {/* Recommended shelter */}
            {result.recommendedShelter?.name && (
              <div className="card" style={{ borderColor: 'rgba(16,185,129,0.25)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--emerald-safe)' }}>🏠 Nearest Safe Shelter</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{result.recommendedShelter.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  📍 {result.recommendedShelter.distance} away · 🛏 {result.recommendedShelter.availableBeds} beds available
                </div>
                {result.routeSafety?.recommendedRoute && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--emerald-safe)' }}>
                    🛣 {result.routeSafety.recommendedRoute} (≈{result.routeSafety.estimatedMinutes} min)
                  </div>
                )}
                {result.routeSafety?.warnings?.map((w, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', color: 'var(--amber-warning)', marginTop: '0.2rem' }}>⚠️ {w}</div>
                ))}
              </div>
            )}
          </div>

          {/* Rescue Timeline */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--cyan-medical)" />
              Rescue Timeline
            </div>
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, background: 'var(--border-subtle)' }} />
              {(result.rescueTimeline || []).map((item, idx, arr) => (
                <TimelineItem key={idx} stage={item.stage} notes={item.notes} status={getTimelineStatus(item, idx, arr)} />
              ))}
            </div>
            <button onClick={() => setTab('submit')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
              ← Submit Another SOS
            </button>
          </div>
        </div>
      )}

      {/* ── Track SOS ─────────────────────────────────────────────── */}
      {tab === 'track' && (
        <div style={{ maxWidth: 600 }}>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              className="form-input"
              placeholder="Enter SOS ID (e.g. RP-2026-00038)"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              required
              style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', letterSpacing: '0.04em' }}
            />
            <button type="submit" className="btn btn-primary" disabled={trackLoading} style={{ flexShrink: 0 }}>
              {trackLoading ? <div className="spinner" /> : 'Track'}
            </button>
          </form>

          {tracked && (
            <div className="card animate-fadeIn">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cyan-medical)' }}>{tracked.sosId}</span>
                <span className={`badge badge-${tracked.severity}`}>{tracked.severity}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Status: </span><strong>{tracked.status}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Priority: </span><strong>{tracked.priorityScore}/100</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Location: </span>{tracked.location?.address}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>People: </span>{tracked.peopleCount}</div>
              </div>
              {tracked.assignedTeam?.teamId && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6, padding: '0.6rem', fontSize: '0.78rem', marginBottom: '1rem' }}>
                  Team <strong>{tracked.assignedTeam.teamId}</strong> — {tracked.assignedTeam.leader} · ETA {tracked.assignedTeam.etaMinutes} min
                </div>
              )}
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, background: 'var(--border-subtle)' }} />
                {(tracked.rescueTimeline || []).map((item, idx, arr) => (
                  <TimelineItem key={idx} stage={item.stage} notes={item.notes} status={getTimelineStatus(item, idx, arr)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
