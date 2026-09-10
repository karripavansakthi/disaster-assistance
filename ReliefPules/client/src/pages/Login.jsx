import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisasterLogo from '../components/DisasterLogo';
import ThemeToggle from '../components/ThemeToggle';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Zap,
  ShieldCheck,
  Headphones,
  ArrowRight
} from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('victim@demo.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(identifier, password);
      const role = res?.user?.role || 'victim';
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/victim/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email) => {
    setIdentifier(email);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-[#F3F7FC] dark:bg-[#070d18] flex items-center justify-center p-3 sm:p-6 lg:p-10 transition-colors">
      {/* Split-Screen Login Container matching reference image 2 */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0d1726] rounded-3xl border border-[#E4EAF2] dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Dark Navy Relief Camp Hero Banner (45% width on desktop) */}
        <div className="lg:col-span-5 relative bg-[#062B4C] text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Background Disaster Relief Tents Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#062B4C]/95 via-[#08345A]/90 to-[#041F38] pointer-events-none" />

          {/* Top: Logo & Tagline */}
          <div className="relative z-10">
            <DisasterLogo inverted={true} size="default" to="/" />
          </div>

          {/* Middle: Welcome & Value Propositions matching reference */}
          <div className="relative z-10 my-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Welcome Back!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Login to your account to continue accessing emergency assistance, volunteer dispatches, and relief coordination.
              </p>
            </div>

            {/* 3 Trust Features matching reference */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-[#1268E8]/25 text-[#60a5fa] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Fast Response</div>
                  <div className="text-[11px] text-slate-300">During emergencies</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-[#20A464]/25 text-[#4ade80] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Trusted Platform</div>
                  <div className="text-[11px] text-slate-300">By communities & state rescue teams</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-[#FF8A1F]/25 text-[#fb923c] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">24/7 Support</div>
                  <div className="text-[11px] text-slate-300">Always here when seconds count</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between pt-4 border-t border-white/10">
            <span>DisasterAssist Network</span>
            <span>Emergency Operations Hub</span>
          </div>
        </div>

        {/* Right Side: Clean Login Form (55% width on desktop) */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center relative bg-white dark:bg-[#0d1726] transition-colors">
          {/* Top Right Controls: Theme Toggle */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <ThemeToggle />
          </div>

          <div className="max-w-md mx-auto w-full">
            {/* Form Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] dark:text-white tracking-tight">
                Login to DisasterAssist
              </h1>
              <p className="text-xs sm:text-sm text-[#667085] dark:text-slate-400 mt-1">
                Enter your credentials to access your account
              </p>
            </div>

            {/* 1-Click Demo Logins */}
            <div className="mb-5 p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <div className="text-[11px] font-bold text-[#1268E8] dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> 1-Click Instant Demo Login:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('victim@demo.com')}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                    identifier === 'victim@demo.com'
                      ? 'bg-[#1268E8] text-white border-[#1268E8] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Citizen / Victim
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('volunteer@demo.com')}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                    identifier === 'volunteer@demo.com'
                      ? 'bg-[#1268E8] text-white border-[#1268E8] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@demo.com')}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                    identifier === 'admin@demo.com'
                      ? 'bg-[#1268E8] text-white border-[#1268E8] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or Mobile Number */}
              <div>
                <label htmlFor="login-identifier" className="block text-xs font-semibold text-[#172B4D] dark:text-slate-200 mb-1.5">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or mobile number"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#172B4D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#172B4D] dark:text-slate-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#172B4D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label htmlFor="login-remember-me" className="flex items-center gap-2 text-[#667085] dark:text-slate-400 cursor-pointer select-none">
                  <input
                    id="login-remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#1268E8] focus:ring-[#1268E8]"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="text-[#1268E8] dark:text-blue-400 font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#1268E8] hover:bg-[#0d56c4] text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Logging in...' : 'Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E4EAF2] dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] font-bold uppercase text-[#667085] dark:text-slate-400">
                <span className="bg-white dark:bg-[#0d1726] px-3">OR</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E4EAF2] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#172B4D] dark:text-slate-200 flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E4EAF2] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#172B4D] dark:text-slate-200 flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Footer */}
            <p className="mt-7 text-xs text-center text-[#667085] dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#1268E8] dark:text-blue-400 font-bold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
