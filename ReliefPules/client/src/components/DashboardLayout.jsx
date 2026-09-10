import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardLayout({ children, roleOverride, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F3F7FC] dark:bg-[#070d18] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        roleOverride={roleOverride}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#F3F7FC]/90 dark:bg-[#070d18]/90 backdrop-blur-md px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#E4EAF2]/60 dark:border-slate-800/80 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E4EAF2] dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:text-slate-900 lg:hidden shadow-sm"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {title && (
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#172B4D] dark:text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* Right Header Actions: ThemeToggle + Bell Notification + Avatar */}
          <div className="flex items-center gap-3">
            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle />

            <Link
              to="/victim/alerts"
              className="relative p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#E4EAF2] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#1268E8] shadow-sm transition-colors"
              aria-label="Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F52D3D] ring-2 ring-white dark:ring-slate-800"></span>
            </Link>

            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full bg-[#1268E8]/10 border border-[#1268E8]/20 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#172B4D] dark:text-white leading-tight">
                  {user?.name || 'Ramesh Kumar'}
                </div>
                <div className="text-[10px] text-[#667085] dark:text-slate-400 capitalize">
                  {user?.role || 'Citizen'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-7 max-w-[1400px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
