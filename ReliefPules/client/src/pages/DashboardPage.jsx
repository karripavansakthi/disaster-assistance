import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import {
  AlertTriangle, Home, Heart, Megaphone, Activity,
  Wind, Droplets, Users, BedDouble, Ambulance, Radio,
  TrendingUp, ArrowRight, Shield,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_STATUS = {
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
};

const ALERTS_DEMO = [
  { type: 'critical', title: 'CYCLONE ALERT — HIGH RISK', msg: 'Cyclone Michaung making landfall near Visakhapatnam coast. Wind speeds 86 km/h. Immediate evacuation required.', time: '2 min ago' },
  { type: 'critical', title: 'FLOOD WARNING — KAKINADA', msg: 'River Godavari at DANGER MARK. Low-lying areas must evacuate within 2 hours.', time: '11 min ago' },
  { type: 'warning', title: 'ROAD CLOSURE — NH-16 BYPASS', msg: 'NH-16 near Gajuwaka flooded. Use Steel Plant Road alternate.', time: '25 min ago' },
  { type: 'warning', title: 'SHELTER CAPACITY ALERT', msg: 'Gajuwaka NDRF Camp at 70% capacity. Redirect to St. Mary Hub.', time: '40 min ago' },
  { type: 'info', title: 'POWER RESTORATION UPDATE', msg: 'Electricity restored to MVP Colony Sectors 1–6. ETA for Sectors 7–14: 6 hours.', time: '1 hr ago' },
];

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card" style={{ borderColor: `${color}30` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{label}</div>
          <div className="stat-number" style={{ color }}>{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</div>
          {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{sub}</div>}
        </div>
        <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 10, padding: '0.6rem', flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);
  const [liveSos, setLiveSos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statusRes, sosRes] = await Promise.all([
          axios.get(`${API}/api/status`),
          axios.get(`${API}/api/emergency?limit=5`),
        ]);
        if (statusRes.data?.data) setStatus(statusRes.data.data);
        if (sosRes.data?.data) setLiveSos(sosRes.data.data);
      } catch { /* fallback to defaults */ }
      finally { setLoading(false); }
    };
    load();

    const socket = getSocket();
    const onSos = (data) => {
      setStatus((s) => ({ ...s, activeSosCount: s.activeSosCount + 1 }));
      setLiveSos((prev) => [data, ...prev.slice(0, 4)]);
    };
    socket.on('sos.created', onSos);
    return () => socket.off('sos.created', onSos);
  }, []);

  const sevColor = { critical: 'var(--red-critical)', high: 'var(--amber-warning)', moderate: 'var(--blue-info)', low: 'var(--emerald-safe)' };
  const alertIcon = { critical: 'var(--red-critical)', warning: 'var(--amber-warning)', info: 'var(--blue-info)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">

      {/* ── Disaster Status Banner ─────────────────────────────── */}
      <div className="status-banner pulse-critical">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red-critical)', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--red-critical)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ACTIVE DISASTER — {status.riskLevel?.toUpperCase()}
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{status.disasterName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Affected: {(status.affectedDistricts || []).join(' · ')}
          </div>
        </div>
        <div className="status-stats">
          {[
            { icon: Droplets, label: `${status.rainfallMm} mm`, sub: 'Rainfall', color: '#60a5fa' },
            { icon: Wind, label: `${status.windSpeedKmh} km/h`, sub: 'Wind Speed', color: '#e2e8f0' },
            { icon: Activity, label: status.floodRisk, sub: 'Flood Risk', color: 'var(--amber-warning)' },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div className="stat-chip" key={sub} style={{ color }}>
              <Icon size={13} /> {label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Emergency Action Buttons ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        <button className="action-btn-sos" onClick={() => navigate('/emergency')}>
          <AlertTriangle size={26} />
          <span>I NEED HELP</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.85 }}>Submit Emergency SOS</span>
        </button>
        <button className="action-btn-shelter" onClick={() => navigate('/shelters')}>
          <Home size={26} />
          <span>FIND SHELTER</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.85 }}>{status.bedsAvailableCount?.toLocaleString()} beds available</span>
        </button>
        <button className="action-btn-medical" onClick={() => navigate('/medical')}>
          <Heart size={26} />
          <span>FIND MEDICAL HELP</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.85 }}>{status.ambulancesAvailableCount} ambulances active</span>
        </button>
        <button className="action-btn-info" onClick={() => navigate('/chat')}>
          <Megaphone size={26} />
          <span>EMERGENCY INSTRUCTIONS</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.85 }}>AI + Multilingual Guide</span>
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="stats-grid-4">
        <StatCard label="Active SOS" value={status.activeSosCount} icon={Radio} color="var(--red-critical)" sub="Awaiting response" />
        <StatCard label="Evacuated" value={status.evacuatedCount} icon={Users} color="var(--amber-warning)" sub="Since alert issued" />
        <StatCard label="Beds Available" value={status.bedsAvailableCount} icon={BedDouble} color="var(--emerald-safe)" sub={`${status.sheltersOpenCount} shelters open`} />
        <StatCard label="Ambulances" value={status.ambulancesAvailableCount} icon={Ambulance} color="var(--cyan-medical)" sub="Across all districts" />
      </div>

      {/* ── Live SOS Feed + Active Alerts ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Live SOS Feed */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={16} color="var(--red-critical)" />
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Live SOS Feed</h3>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }} onClick={() => navigate('/emergency')}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {liveSos.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1rem 0', textAlign: 'center' }}>No active SOS</div>
            ) : liveSos.map((s, i) => (
              <div key={s._id || i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.75rem', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${sevColor[s.severity]}20`, border: `1px solid ${sevColor[s.severity]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.7rem', color: sevColor[s.severity] }}>{s.priorityScore || 75}</span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }} className="font-mono">{s.sosId || 'RP-PENDING'}</span>
                    <span className={`badge badge-${s.severity || 'high'}`}>{s.severity || 'high'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.location?.address || 'Location pending'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.peopleCount} person{s.peopleCount !== 1 ? 's' : ''} · {s.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="var(--amber-warning)" />
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Active Alerts</h3>
            </div>
            <span className="badge badge-critical">{ALERTS_DEMO.filter((a) => a.type === 'critical').length} Critical</span>
          </div>
          <div>
            {ALERTS_DEMO.map((a, i) => (
              <div key={i} className={`alert-item ${a.type}`}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.2rem', color: alertIcon[a.type] }}>{a.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.msg}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
