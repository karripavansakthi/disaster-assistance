import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, UserPlus, AlertCircle, LayoutDashboard, LogOut, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register, user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'citizen',
    district: 'Visakhapatnam',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'radial-gradient(circle at 50% 20%, rgba(6,182,212,0.08) 0%, rgba(6,12,26,1) 80%)' }}>
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', marginBottom: '0.75rem', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
              <Shield size={24} color="white" />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Relief<span style={{ color: 'var(--cyan-medical)' }}>Pulse</span>
            </h1>
          </div>

          <div className="card" style={{ borderColor: 'var(--border-active)', padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--cyan-medical)' }}>
              <UserCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Already Registered & Signed In
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              You are signed in as <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> (<span style={{ color: 'var(--cyan-medical)', fontWeight: 600, textTransform: 'uppercase' }}>{user.role}</span>).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700 }}
              >
                <LayoutDashboard size={16} /> Continue to Command Center
              </button>
              <button
                onClick={logout}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', fontSize: '0.82rem' }}
              >
                <LogOut size={15} /> Sign Out to Register New Account
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none' }}>
              ← Return to Public Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'radial-gradient(circle at 50% 20%, rgba(6,182,212,0.08) 0%, rgba(6,12,26,1) 80%)' }}>
      <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', marginBottom: '0.75rem' }}>
            <Shield size={24} color="white" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Join Relief<span style={{ color: 'var(--cyan-medical)' }}>Pulse</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Citizen & Volunteer Emergency Network Registration
          </p>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 8, padding: '0.65rem 0.85rem', color: 'var(--red-critical)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="form-group">
              <label htmlFor="legacy-reg-name" className="form-label">Full Name *</label>
              <input
                id="legacy-reg-name"
                name="name"
                autoComplete="name"
                className="form-input"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Citizen or Responder Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="legacy-reg-email" className="form-label">Email Address *</label>
              <input
                id="legacy-reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="legacy-reg-phone" className="form-label">Contact Phone *</label>
              <input
                id="legacy-reg-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="legacy-reg-password" className="form-label">Password *</label>
              <input
                id="legacy-reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="citizen">Citizen</option>
                  <option value="volunteer">Volunteer Responder</option>
                  <option value="medical">Medical Staff</option>
                  <option value="rescue">Rescue Personnel</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <select
                  className="form-input"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                >
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Kakinada">Kakinada</option>
                  <option value="East Godavari">East Godavari</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}
            >
              {loading ? <div className="spinner" /> : <><UserPlus size={15} /> Create Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--cyan-medical)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
