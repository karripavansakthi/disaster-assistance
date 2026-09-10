import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisasterLogo from '../components/DisasterLogo';
import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Minus,
  Plus,
  Compass
} from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('victim'); // 'victim', 'volunteer', 'admin'
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('17.3850, 78.4867 (Live GPS)');
  const [peopleCount, setPeopleCount] = useState(4);
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleUseMyLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Detected GPS)`);
          setLocating(false);
        },
        () => {
          setLocation('17.3850, 78.4867 (Ward 7, Hyderabad)');
          setLocating(false);
        }
      );
    } else {
      setLocation('17.3850, 78.4867 (Ward 7, Hyderabad)');
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await register({
        fullName,
        name: fullName,
        phone: mobileNumber,
        email,
        password,
        location,
        role: role === 'victim' ? 'victim' : role,
        peopleAffected: peopleCount,
        specialRequirements: specialNeeds
      });

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/victim/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7FC] flex flex-col justify-center items-center px-4 py-12">
      {/* Subtle Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-100/40 rounded-full blur-3xl top-10 left-10 pointer-events-none" />

      {/* Main Register Card matching reference image top-right */}
      <div className="relative w-full max-w-[460px] bg-white rounded-2xl border border-[#E4EAF2] shadow-sm p-7 sm:p-9 text-center">
        {/* DisasterAssist Logo */}
        <div className="flex justify-center mb-4">
          <DisasterLogo size="default" to="/" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-[#172B4D] tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-[#667085] mt-1 mb-5">
          Join us to get help or provide help
        </p>

        {/* Role Selector Tabs matching reference */}
        <div className="bg-[#F3F7FC] p-1 rounded-xl flex items-center mb-6 border border-[#E4EAF2]">
          <button
            type="button"
            onClick={() => setRole('victim')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'victim'
                ? 'bg-[#1268E8] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172B4D]'
            }`}
          >
            Victim / Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'volunteer'
                ? 'bg-[#1268E8] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172B4D]'
            }`}
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'admin'
                ? 'bg-[#1268E8] text-white shadow-sm'
                : 'text-[#667085] hover:text-[#172B4D]'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullName" className="block text-xs font-semibold text-[#172B4D] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="reg-fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E4EAF2] bg-white text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="reg-mobile" className="block text-xs font-semibold text-[#172B4D] mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="reg-mobile"
                name="mobileNumber"
                type="tel"
                autoComplete="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E4EAF2] bg-white text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-[#172B4D] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E4EAF2] bg-white text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-[#172B4D] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E4EAF2] bg-white text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Current Location */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="reg-location" className="text-xs font-semibold text-[#172B4D]">
                Current Location
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="text-[11px] font-bold text-[#1268E8] hover:underline inline-flex items-center gap-1"
              >
                <Compass className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                <span>Use GPS</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="reg-location"
                name="location"
                type="text"
                autoComplete="street-address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E4EAF2] bg-white text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Victim-Specific Fields matching reference */}
          {role === 'victim' && (
            <>
              {/* Number of People Counter */}
              <div>
                <span className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Number of People
                </span>
                <div className="flex items-center justify-between px-4 py-2 rounded-lg border border-[#E4EAF2] bg-white">
                  <span className="text-xs text-[#667085]">Total persons with you</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-[#172B4D] w-4 text-center">
                      {peopleCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPeopleCount(peopleCount + 1)}
                      className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label htmlFor="reg-special-needs" className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Special Requirements (Optional)
                </label>
                <input
                  id="reg-special-needs"
                  name="specialRequirements"
                  type="text"
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  placeholder="Any special needs (e.g. elderly, children, medical...)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E4EAF2] bg-white text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-[#1268E8] hover:bg-[#0d56c4] text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-xs text-[#667085]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1268E8] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
