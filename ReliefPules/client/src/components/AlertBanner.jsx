import React, { useEffect, useState } from 'react';
import { AlertTriangle, ChevronRight, X, PhoneCall } from 'lucide-react';
import { alertService } from '../services/alertService';

const AlertBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await alertService.getActiveAlerts();
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
        }
      } catch (err) {
        console.warn('Could not fetch active disaster alerts:', err.message);
      }
    };
    fetchAlerts();
  }, []);

  if (dismissed || alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex];

  const nextAlert = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-sm font-medium px-4 py-2.5 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <div className="flex items-center space-x-2 truncate">
            <AlertTriangle className="w-4 h-4 text-amber-200 flex-shrink-0" />
            <span className="uppercase tracking-wider text-xs font-extrabold bg-black/25 px-2 py-0.5 rounded text-amber-100">
              {currentAlert.severity} ALERT
            </span>
            <span className="font-semibold truncate">{currentAlert.title}:</span>
            <span className="text-white/90 hidden md:inline truncate">{currentAlert.message}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0 text-xs">
          <div className="flex items-center space-x-1.5 bg-black/20 px-2.5 py-1 rounded-full text-white/95">
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            <span>Helpline: <strong className="text-white font-bold">{currentAlert.emergencyHelpline || '1070'}</strong></span>
          </div>

          {alerts.length > 1 && (
            <button
              onClick={nextAlert}
              className="text-xs bg-white/15 hover:bg-white/25 px-2 py-1 rounded transition flex items-center"
              title="Next alert"
            >
              Next ({currentIndex + 1}/{alerts.length})
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white p-1 rounded transition"
            aria-label="Dismiss alert banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
