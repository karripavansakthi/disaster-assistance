import React from 'react';
import { AlertOctagon, AlertTriangle, Info, Bell, MapPin, Clock } from 'lucide-react';

export default function AlertCard({ alert, expanded = false }) {
  if (!alert) return null;

  const severity = alert.severity || alert.type || 'critical';

  const styles = {
    critical: {
      leftBorder: 'border-l-4 border-l-red-600',
      badge: 'bg-red-50 text-red-700 border-red-200',
      icon: AlertOctagon,
      iconColor: 'text-red-600 bg-red-50 border-red-100',
    },
    high: {
      leftBorder: 'border-l-4 border-l-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    warning: {
      leftBorder: 'border-l-4 border-l-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    moderate: {
      leftBorder: 'border-l-4 border-l-blue-500',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    low: {
      leftBorder: 'border-l-4 border-l-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Bell,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  }[severity] || {
    leftBorder: 'border-l-4 border-l-slate-400',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Bell,
    iconColor: 'text-slate-600 bg-slate-50 border-slate-200',
  };

  const Icon = styles.icon;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs transition-all hover:shadow-md ${styles.leftBorder}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${styles.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
              {alert.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-semibold">
              {(alert.affectedAreas?.length > 0 || alert.districts?.length > 0) && (
                <span className="flex items-center gap-1 text-blue-600">
                  <MapPin className="w-3 h-3" />
                  {(alert.affectedAreas || alert.districts).join(', ')}
                </span>
              )}
              {(alert.issuedAt || alert.createdAt) && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(alert.issuedAt || alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${styles.badge}`}>
          {severity}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 sm:pl-12">
        {alert.message || alert.description}
      </p>

      {alert.actionRequired && (
        <div className="mt-3 sm:ml-12 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
          <span className="font-bold text-amber-700">⚠️ Recommended Action:</span>
          <span>{alert.actionRequired}</span>
        </div>
      )}
    </div>
  );
}
