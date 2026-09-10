import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DisasterLogo from './DisasterLogo';
import {
  LayoutDashboard,
  AlertTriangle,
  Home,
  Shield,
  HeartHandshake,
  Radio,
  Clock,
  User,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  X,
  FileSpreadsheet,
  Layers,
  PhoneCall
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, roleOverride }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current role from pathname or auth user
  let activeRole = roleOverride || user?.role || 'victim';
  if (location.pathname.startsWith('/admin')) activeRole = 'admin';
  else if (location.pathname.startsWith('/volunteer')) activeRole = 'volunteer';
  else if (location.pathname.startsWith('/victim')) activeRole = 'victim';

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const victimLinks = [
    { label: 'Dashboard', path: '/victim/dashboard', icon: LayoutDashboard },
    { label: 'Emergency Requests', path: '/victim/emergency-request', icon: AlertTriangle },
    { label: 'Nearby Shelters', path: '/victim/shelters', icon: Home },
    { label: 'Food & Medical', path: '/victim/resources', icon: HeartHandshake },
    { label: 'Alerts', path: '/victim/alerts', icon: Radio },
    { label: 'Request History', path: '/victim/history', icon: Clock },
    { label: 'Profile', path: '/victim/profile', icon: User },
  ];

  const volunteerLinks = [
    { label: 'Dashboard', path: '/volunteer/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Requests', path: '/volunteer/assigned', icon: FileSpreadsheet },
    { label: 'Manage Volunteers', path: '/admin/volunteers', icon: Shield },
    { label: 'Shelters', path: '/volunteer/shelters', icon: Home },
    { label: 'Emergency Requests', path: '/volunteer/available', icon: AlertTriangle },
    { label: 'Resources', path: '/volunteer/resources', icon: Layers },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Alerts', path: '/victim/alerts', icon: Radio },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Victims', path: '/admin/users', icon: Users },
    { label: 'Manage Volunteers', path: '/admin/volunteers', icon: Shield },
    { label: 'Shelters', path: '/admin/shelters', icon: Home },
    { label: 'Emergency Requests', path: '/admin/requests', icon: AlertTriangle },
    { label: 'Resources', path: '/admin/resources', icon: Layers },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Alerts', path: '/admin/alerts', icon: Radio },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = activeRole === 'admin' ? adminLinks : activeRole === 'volunteer' ? volunteerLinks : victimLinks;

  // Profile details per role
  const profileName = activeRole === 'admin'
    ? 'Admin'
    : activeRole === 'volunteer'
    ? (user?.name || 'Suresh Patel')
    : (user?.name || 'Ramesh Kumar');

  const profileRole = activeRole === 'admin'
    ? 'Administrator'
    : activeRole === 'volunteer'
    ? 'Volunteer'
    : 'Victim';

  const profileAvatar = activeRole === 'admin'
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    : activeRole === 'volunteer'
    ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 bg-[#062B4C] text-white z-50 flex flex-col transition-transform duration-300 ease-in-out select-none shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#0A3D69]">
          <DisasterLogo inverted={true} size="default" to={links[0].path} />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card beneath logo matching reference */}
        <div className="px-4 py-3.5 border-b border-[#0A3D69]/80 flex items-center gap-3 bg-[#05233E]/50">
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={profileAvatar}
              alt={profileName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{profileName}</div>
            <div className="text-[10px] text-slate-300 font-medium capitalize">{profileRole}</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path.includes('/dashboard') && location.pathname.endsWith(item.path.replace('/victim', '').replace('/volunteer', '').replace('/admin', '')));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#1268E8] text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Logout Button */}
        <div className="p-3.5 border-t border-[#0A3D69]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
