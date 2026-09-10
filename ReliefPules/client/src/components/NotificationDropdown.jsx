import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../data/mockData';
import {
  Bell,
  Check,
  AlertTriangle,
  Home,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => loadNotifications();
    window.addEventListener('da_data_updated', handleUpdate);
    return () => window.removeEventListener('da_data_updated', handleUpdate);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    loadNotifications();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'shelter':
        return <Home className="w-4 h-4 text-emerald-500" />;
      case 'dispatch':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-[#0b1320] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Tray */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 text-[#172B4D] dark:text-white animate-fade-in">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 font-bold text-xs">
              <span>Live Emergency Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-extrabold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#1268E8] dark:text-blue-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active notifications
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link || '#'}
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={`p-3 block transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className={`text-xs font-bold truncate ${!n.read ? 'text-[#1268E8] dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                          {n.title}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {n.timeAgo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              to="/alerts"
              onClick={() => setOpen(false)}
              className="text-[11px] font-bold text-[#1268E8] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All Disaster Alerts</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
