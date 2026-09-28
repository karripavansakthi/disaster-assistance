import React from 'react';
import { useRealtimeEmergency } from '../context/RealtimeEmergencyContext';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, LifeBuoy, X, ShieldAlert } from 'lucide-react';

export default function LiveDisasterAlertModal() {
  const { activeOfficialAlert, clearOfficialAlert } = useRealtimeEmergency();

  if (!activeOfficialAlert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1524] max-w-lg w-full rounded-3xl border-2 border-red-500 shadow-2xl p-6 sm:p-8 relative space-y-6 text-[#172B4D] dark:text-white">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={clearOfficialAlert}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          title="Dismiss Alert"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block">
              Official Government Bulletin
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-red-600 dark:text-red-400">
              ⚠️ DISASTER ALERT
            </h3>
          </div>
        </div>

        {/* Alert Information Body */}
        <div className="space-y-3 bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 p-4 sm:p-5 rounded-2xl">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
            {activeOfficialAlert.title || `${activeOfficialAlert.disasterType || 'Disaster'} Warning`}
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            {activeOfficialAlert.message || 'Severe weather conditions or disaster impact detected in your sector. Take immediate safety precautions.'}
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-red-200 dark:border-red-900/40 flex items-center justify-between">
            <span>Issued by: <strong>{activeOfficialAlert.issuedBy || 'National Disaster Management (NDMA)'}</strong></span>
            <span>Helpline: <strong className="text-red-600 font-mono">1070 / 112</strong></span>
          </div>
        </div>

        {/* Immediate Call to Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            to="/shelters"
            onClick={clearOfficialAlert}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Find Safe Shelter</span>
          </Link>

          <Link
            to="/emergency"
            onClick={clearOfficialAlert}
            className="py-3 px-4 rounded-xl bg-[#F52D3D] hover:bg-red-600 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-red-500/30 transition-all active:scale-95"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Emergency Help (SOS)</span>
          </Link>
        </div>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          If unable to reach shelter safely, stay indoors on an elevated floor and call 112 immediately.
        </p>

      </div>
    </div>
  );
}
