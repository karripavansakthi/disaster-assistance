import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Clock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onMenuClick, title = 'ReliefPulse Command Center' }) {
  const { user } = useAuth();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="topbar">
      <button
        onClick={onMenuClick}
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.35rem', borderRadius: 6, display: 'flex', alignItems: 'center' }}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{title}</span>
      </div>

      {/* Emergency hotline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--red-critical)', fontWeight: 700, background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.25)', borderRadius: 6, padding: '0.3rem 0.6rem' }}>
        <Phone size={12} />
        <span>112 / 1070</span>
      </div>

      {/* Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <Clock size={13} />
        <span style={{ fontWeight: 600 }}>{timeStr}</span>
        <span style={{ color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>

      {/* Active User Indicator */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan-medical), var(--purple-resource))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ display: 'none', md: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.name?.split(' ')[0]}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--cyan-medical)', textTransform: 'capitalize', fontWeight: 600 }}>
              {user.role}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
