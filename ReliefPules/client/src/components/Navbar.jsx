import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DisasterLogo from './DisasterLogo';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import LocationButton from './LocationButton';
import LocationModal from './LocationModal';
import SosModal from './SosModal';
import { useAuth } from '../context/AuthContext';
import { useLocation as useDisasterLocation } from '../context/LocationContext';
import { Menu, X, AlertTriangle, MapPin } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { currentLocation, modalOpen, setModalOpen } = useDisasterLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Emergency Help', path: '/emergency' },
    { label: 'Shelters', path: '/shelters' },
    { label: 'Medical Help', path: '/medical' },
    { label: 'Resources', path: '/resources' },
    { label: 'Alerts', path: '/alerts' },
    { label: 'Safety Assistant', path: '/safety' },
    { label: 'Showcase', path: '/showcase' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1320]/95 backdrop-blur-md border-b border-[#E4EAF2] dark:border-slate-800 shadow-xs transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Left: DisasterAssist Logo */}
          <div className="shrink-0 flex items-center gap-3">
            <DisasterLogo size="default" to="/" />
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[13px] font-semibold transition-colors ${
                    isActive
                      ? 'text-[#1268E8] dark:text-blue-400'
                      : 'text-[#172B4D] dark:text-slate-300 hover:text-[#1268E8] dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Location Selector Button */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-[#172B4D] dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
                title="Change active disaster monitoring zone"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-[140px]">
                  {currentLocation?.name || 'Set Location'}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold ml-0.5">
                  Change
                </span>
              </button>
            </div>

            {/* Live Notification Dropdown */}
            <NotificationDropdown />

            {/* Light / Dark Mode Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'volunteer' ? '/volunteer/dashboard' : '/victim/dashboard'}
                  className="text-xs font-bold text-[#172B4D] dark:text-slate-200 hover:text-[#1268E8] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
                >
                  {user?.role === 'admin' ? 'Admin Ops' : user?.role === 'volunteer' ? 'Volunteer Ops' : 'Victim Portal'}
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-[#667085] dark:text-slate-400 hover:text-red-500 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-block text-xs font-bold text-[#172B4D] dark:text-slate-200 hover:text-[#1268E8] transition-colors"
              >
                Login
              </Link>
            )}

            {/* Prominent High-Visibility SOS Button */}
            <button
              type="button"
              onClick={() => setSosModalOpen(true)}
              className="relative inline-flex items-center gap-1.5 bg-[#F52D3D] hover:bg-[#dc2030] text-white px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold shadow-md shadow-red-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <AlertTriangle className="w-4 h-4" />
              <span>SOS EMERGENCY</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-1 xl:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[#172B4D] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="xl:hidden bg-white dark:bg-[#0b1320] border-b border-slate-200 dark:border-slate-800 p-4 space-y-3">
            {/* Mobile Location Selector */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Zone: {currentLocation?.fullAddress || 'Set Location'}</span>
              </div>
              <span className="text-[#1268E8] font-bold">Change ➔</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <ThemeToggle />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-xs font-bold text-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-bold text-[#1268E8]"
                >
                  Responder / Victim Login ➔
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <LocationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
    </>
  );
}
