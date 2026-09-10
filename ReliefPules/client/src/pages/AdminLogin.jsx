import React, { useState } from 'react';
import { AlertCircle, Lock, Shield, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const { user, login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin, redirect
  if (user && user.role === 'admin') {
    navigate('/dashboard/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/admin-login`, {
        username,
        password,
      });
      const { token, user: userData } = res.data;
      localStorage.setItem('rp_token', token);
      if (userData) {
        localStorage.setItem('rp_user', JSON.stringify(userData));
      }
      // Force page reload to reinitialize auth state properly
      window.location.href = '/dashboard/admin';
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Invalid admin credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" />

      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Shield className="admin-icon-svg" />
          </div>
          <h1 className="admin-login-title">Admin Command Center</h1>
          <p className="admin-login-subtitle">
            Secure access for authorized personnel only
          </p>
        </div>

        {/* Security Badge */}
        <div className="admin-security-badge">
          <ShieldCheck className="admin-badge-icon" />
          <span>256-bit encrypted connection</span>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-login-error" role="alert">
            <AlertCircle className="admin-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <label htmlFor="admin-username" className="admin-form-label">
            <span className="admin-label-text">Username</span>
            <span className="admin-input-wrap">
              <User className="admin-input-icon" />
              <input
                id="admin-username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="admin-input"
              />
            </span>
          </label>

          <label htmlFor="admin-password" className="admin-form-label">
            <span className="admin-label-text">Password</span>
            <span className="admin-input-wrap">
              <Lock className="admin-input-icon" />
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="admin-input"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? (
              <span className="admin-btn-loading">
                <span className="admin-spinner" />
                Authenticating...
              </span>
            ) : (
              <span className="admin-btn-content">
                <ShieldCheck className="admin-btn-icon" />
                Access Command Center
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <p>Unauthorized access is strictly prohibited.</p>
          <p>All login attempts are monitored and logged.</p>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: #030712;
        }

        .admin-login-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(168, 85, 247, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(239, 68, 68, 0.05) 0%, transparent 50%);
          animation: adminBgPulse 8s ease-in-out infinite alternate;
        }
        @keyframes adminBgPulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .admin-login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(17, 24, 39, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 40px 32px 32px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.03),
            0 25px 60px rgba(0, 0, 0, 0.5),
            0 0 120px rgba(59, 130, 246, 0.05);
          animation: adminCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes adminCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .admin-login-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          margin-bottom: 16px;
        }
        .admin-icon-svg {
          width: 28px;
          height: 28px;
          color: #fff;
        }
        .admin-login-title {
          font-size: 24px;
          font-weight: 900;
          color: #f9fafb;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .admin-login-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 6px;
        }

        .admin-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          margin-bottom: 24px;
        }
        .admin-badge-icon {
          width: 14px;
          height: 14px;
          color: #22c55e;
        }
        .admin-security-badge span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #22c55e;
        }

        .admin-login-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 20px;
          font-size: 13px;
          color: #fca5a5;
          animation: adminShake 0.4s ease-out;
        }
        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .admin-error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 1px;
          color: #ef4444;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .admin-form-label {
          display: block;
        }
        .admin-label-text {
          display: block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .admin-input-wrap {
          position: relative;
          display: block;
        }
        .admin-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #6b7280;
          pointer-events: none;
        }
        .admin-input {
          width: 100%;
          padding: 14px 16px 14px 42px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.4);
          color: #f9fafb;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .admin-input::placeholder {
          color: #4b5563;
        }
        .admin-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(0, 0, 0, 0.6);
        }

        .admin-login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
        }
        .admin-login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          box-shadow: 0 6px 24px rgba(59, 130, 246, 0.35);
          transform: translateY(-1px);
        }
        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .admin-btn-content, .admin-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .admin-btn-icon {
          width: 18px;
          height: 18px;
        }
        .admin-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: adminSpin 0.7s linear infinite;
        }
        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }

        .admin-login-footer {
          text-align: center;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .admin-login-footer p {
          font-size: 11px;
          color: #6b7280;
          margin: 2px 0;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}
