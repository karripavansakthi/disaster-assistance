import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Tent,
  Radio,
  User
} from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'volunteer') return '/volunteer/dashboard';
    return '/victim/dashboard';
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shelters', path: '/shelters', icon: Tent },
    { label: 'Alerts', path: '/alerts', icon: Radio },
    { label: isAuthenticated ? 'Profile' : 'Login', path: getDashboardPath(), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b1320]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
              isActive
                ? 'text-[#1268E8] dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
