import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getAlerts } from '../data/mockData';
import {
  AlertTriangle,
  CloudRain,
  Info,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Share2
} from 'lucide-react';

export default function DisasterAlerts() {
  const alerts = getAlerts();

  const getAlertStyles = (severity) => {
    switch (severity) {
      case 'red':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-[#F52D3D]',
          border: 'border-red-200',
          bg: 'bg-white hover:bg-red-50/30',
          accent: 'text-[#F52D3D]',
          badge: 'bg-red-50 text-red-600 border-red-200'
        };
      case 'orange':
        return {
          icon: CloudRain,
          iconBg: 'bg-[#FF8A1F]',
          border: 'border-orange-200',
          bg: 'bg-white hover:bg-orange-50/30',
          accent: 'text-[#FF8A1F]',
          badge: 'bg-orange-50 text-orange-600 border-orange-200'
        };
      case 'blue':
        return {
          icon: Info,
          iconBg: 'bg-[#1268E8]',
          border: 'border-blue-200',
          bg: 'bg-white hover:bg-blue-50/30',
          accent: 'text-[#1268E8]',
          badge: 'bg-blue-50 text-blue-600 border-blue-200'
        };
      case 'green':
      default:
        return {
          icon: CheckCircle2,
          iconBg: 'bg-[#20A464]',
          border: 'border-emerald-200',
          bg: 'bg-white hover:bg-emerald-50/30',
          accent: 'text-[#20A464]',
          badge: 'bg-emerald-50 text-emerald-600 border-emerald-200'
        };
    }
  };

  return (
    <DashboardLayout
      title="Disaster Alerts"
      subtitle="Latest updates and notifications"
      roleOverride="victim"
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        {alerts.map((item) => {
          const styles = getAlertStyles(item.severity);
          const Icon = styles.icon;

          return (
            <div
              key={item.id}
              className={`rounded-xl border ${styles.border} ${styles.bg} p-5 shadow-sm transition-all flex items-start gap-4`}
            >
              {/* Circular Color Icon matching reference */}
              <div className={`w-11 h-11 rounded-full ${styles.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className={`text-base font-bold ${styles.accent}`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.timeAgo}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#172B4D] mt-1.5 leading-relaxed font-medium">
                  {item.message}
                </p>

                {item.actionRequired && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-[#667085]">
                    <strong className="text-slate-800">Action Recommended:</strong> {item.actionRequired}
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Official Bulletin • {item.authority}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${item.title}: ${item.message}`);
                        alert('Alert copied to clipboard to share.');
                      }
                    }}
                    className="hover:text-[#1268E8] flex items-center gap-1 font-semibold"
                  >
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
