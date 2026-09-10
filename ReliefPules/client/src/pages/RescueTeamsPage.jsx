import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, MapPin, Clock, Radio } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  Available: { color: 'var(--emerald-safe)', bg: 'rgba(16,185,129,0.1)', badge: 'open' },
  Assigned: { color: 'var(--amber-warning)', bg: 'rgba(245,158,11,0.1)', badge: 'limited' },
  'En Route': { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', badge: 'moderate' },
  'On Scene': { color: 'var(--red-critical)', bg: 'rgba(255,59,59,0.1)', badge: 'critical' },
  Completed: { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)', badge: 'low' },
};

export default function RescueTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/rescue-teams`),
      axios.get(`${API}/api/rescue-teams/summary`),
    ]).then(([tRes, sRes]) => {
      setTeams(tRes.data.data || []);
      setSummary(sRes.data.data || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? teams : teams.filter((t) => t.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Users size={18} color="var(--amber-warning)" />
        <h2 style={{ fontWeight: 700 }}>Rescue Teams & Ambulance Tracking</h2>
      </div>

      {summary && (
        <div className="stats-grid-4">
          {[
            { label: 'Total Teams', value: summary.total, color: 'var(--text-primary)' },
            { label: 'Available', value: summary.available, color: 'var(--emerald-safe)' },
            { label: 'Assigned', value: summary.assigned, color: 'var(--amber-warning)' },
            { label: 'En Route / On Scene', value: (summary.enRoute || 0) + (summary.onScene || 0), color: 'var(--red-critical)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card">
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
              <div className="stat-number" style={{ fontSize: '1.5rem', color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Available', 'Assigned', 'En Route', 'On Scene', 'Completed'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {filtered.map((t) => {
            const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.Available;
            return (
              <div key={t._id} className="card" style={{ borderColor: cfg.color + '40', background: cfg.bg }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="font-mono" style={{ fontWeight: 800, fontSize: '0.9rem', color: cfg.color }}>{t.teamId}</span>
                      <span className={`badge badge-${cfg.badge}`}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.specialization}</div>
                  </div>
                  {(t.status === 'En Route' || t.status === 'Assigned') && t.etaMinutes > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: cfg.color }}>{t.etaMinutes}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>min ETA</div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.78rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Leader: </span>
                    <strong>{t.leaderName}</strong>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Team Size: </span>
                    <strong>{t.rescuersCount} responders</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <MapPin size={11} color="var(--text-muted)" />
                  {t.currentLocation?.name || 'Unknown Location'}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                  <Radio size={11} color={cfg.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  {t.currentAssignment}
                </div>

                {t.assignedSosId && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>SOS: </span>
                    <span className="font-mono" style={{ color: 'var(--cyan-medical)', fontWeight: 700 }}>{t.assignedSosId}</span>
                  </div>
                )}

                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                  <a href={`tel:${t.contactPhone}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.72rem', padding: '0.35rem' }}>
                    📞 {t.contactPhone}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
