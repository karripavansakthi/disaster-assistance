import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogIn, UserCheck, AlertCircle, LayoutDashboard, LogOut } from 'lucide-react';

export default function LoginPage() {
  const { login, user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
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
              Already Signed In
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              You are currently authenticated as <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> (<span style={{ color: 'var(--cyan-medical)', fontWeight: 600, textTransform: 'uppercase' }}>{user.role}</span>).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => navigate(from, { replace: true })}
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
                <LogOut size={15} /> Sign Out to Switch Account
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
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', marginBottom: '0.75rem', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
            <Shield size={24} color="white" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Relief<span style={{ color: 'var(--cyan-medical)' }}>Pulse</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            One Platform. One Response. Every Life Matters.
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ borderColor: 'var(--border-active)', padding: '1.75rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Sign In to Command System
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 8, padding: '0.65rem 0.85rem', color: 'var(--red-critical)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="legacy-login-email" className="form-label">Email Address</label>
              <input
                id="legacy-login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="name@reliefpulse.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="legacy-login-password" className="form-label">Password</label>
              <input
                id="legacy-login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}
            >
              {loading ? <div className="spinner" /> : <><LogIn size={15} /> Sign In</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Need an account? <Link to="/register" style={{ color: 'var(--cyan-medical)', textDecoration: 'none', fontWeight: 600 }}>Register as Citizen / Volunteer</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none' }}>
            ← Back to Public Command Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
