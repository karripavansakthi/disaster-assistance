import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck, Check } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Ramesh Kumar');
  const [email, setEmail] = useState(user?.email || 'victim@demo.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98451 23456');
  const [location, setLocation] = useState(user?.location || 'Ward 7, Hyderabad');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="User Profile"
      subtitle="Manage your personal information and contact settings"
      roleOverride={user?.role || 'victim'}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#E4EAF2] p-6 sm:p-8 shadow-sm">
        {saved && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Profile updated successfully!
          </div>
        )}

        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-[#1268E8] overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">{name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#667085] capitalize">{user?.role || 'Citizen'}</span>
              <span className="text-[10px] font-bold bg-blue-50 text-[#1268E8] px-2 py-0.5 rounded-full border border-blue-100">
                Verified
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-6">
          <div>
            <label htmlFor="user-profile-name" className="block text-xs font-bold text-[#172B4D] mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="user-profile-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-[#E4EAF2] text-xs sm:text-sm text-[#172B4D] focus:outline-none focus:border-[#1268E8]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-profile-email" className="block text-xs font-bold text-[#172B4D] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="user-profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-[#E4EAF2] text-xs sm:text-sm text-[#172B4D] focus:outline-none focus:border-[#1268E8]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-profile-phone" className="block text-xs font-bold text-[#172B4D] mb-1">Mobile Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="user-profile-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-[#E4EAF2] text-xs sm:text-sm text-[#172B4D] focus:outline-none focus:border-[#1268E8]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-profile-location" className="block text-xs font-bold text-[#172B4D] mb-1">Current Sector / Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="user-profile-location"
                name="location"
                type="text"
                autoComplete="street-address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-[#E4EAF2] text-xs sm:text-sm text-[#172B4D] focus:outline-none focus:border-[#1268E8]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
