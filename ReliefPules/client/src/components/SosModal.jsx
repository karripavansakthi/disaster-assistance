import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation as useDisasterLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { createEmergencyRequest } from '../data/mockData';
import {
  AlertTriangle,
  X,
  MapPin,
  Users,
  CheckCircle2,
  PhoneCall,
  Activity,
  ShieldAlert,
  Compass
} from 'lucide-react';

export default function SosModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentLocation } = useDisasterLocation();
  const { user } = useAuth();

  const [emergencyType, setEmergencyType] = useState('Flood');
  const [peopleCount, setPeopleCount] = useState(2);
  const [hasInjuries, setHasInjuries] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleConfirmSos = () => {
    setSubmitting(true);

    const locationString = currentLocation?.fullAddress || '17.3850, 78.4867 (Verified GPS Sector)';
    const lat = currentLocation?.lat || 17.3850;
    const lng = currentLocation?.lng || 78.4867;

    setTimeout(() => {
      const newRequest = createEmergencyRequest({
        type: emergencyType,
        peopleAffected: peopleCount,
        adults: Math.max(1, peopleCount - 1),
        children: Math.max(0, peopleCount - 2),
        elderly: 0,
        injuries: hasInjuries,
        medicalNeeds: hasInjuries || emergencyType === 'Medical',
        requiredAssistance: hasInjuries ? ['Rescue', 'Medical'] : ['Rescue'],
        location: locationString,
        lat,
        lng,
        name: user?.name || 'Citizen Requester (SOS Broadcast)',
        phone: user?.phone || '+91 98765 43210',
        details: `CRITICAL SOS BROADCAST: ${emergencyType} emergency. Immediate evacuation and response required. ${hasInjuries ? '[INJURIES REPORTED]' : ''}`
      });

      setSubmitting(false);
      setSuccessData(newRequest);
    }, 600);
  };

  const handleViewTracking = () => {
    onClose();
    navigate('/victim/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0d1726] rounded-3xl border-2 border-red-500/40 shadow-2xl overflow-hidden transition-all text-[#172B4D] dark:text-white">
        
        {/* Red Warning Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight leading-tight">
                Emergency Distress Signal (SOS)
              </h2>
              <p className="text-xs text-white/90 font-medium">
                High-Priority Emergency Response Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {successData ? (
            /* Successful SOS Created View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-[#F52D3D] flex items-center justify-center mx-auto ring-8 ring-red-50 dark:ring-red-950/30 animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-extrabold text-xs uppercase tracking-wider mb-2">
                  🚨 SOS Broadcast Active
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {successData.id} Created
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  Your distress coordinates have been broadcast to regional emergency response teams and field volunteers.
                </p>
              </div>

              {/* AI Triage Banner */}
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-left text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-red-700 dark:text-red-400">
                  <span>AI Triage Priority:</span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold uppercase text-[10px]">
                    {successData.priority || 'Critical'}
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  {successData.aiTriage?.reason || 'Critical hazard reported with immediate rescue mobilization.'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  Location: {successData.location}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleViewTracking}
                  className="w-full py-3.5 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01]"
                >
                  View Live Response Tracking ➔
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Form */
            <>
              {/* Question Banner */}
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center">
                <div className="text-base font-extrabold text-red-700 dark:text-red-400">
                  Are you in immediate danger?
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Clicking below will dispatch emergency search & rescue teams to your verified location.
                </p>
              </div>

              {/* Location display */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-semibold truncate max-w-[280px]">
                    {currentLocation?.fullAddress || '17.3850, 78.4867 (Verified GPS Sector)'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  GPS Active
                </span>
              </div>

              {/* Quick Details Selection */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nature of Emergency:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Flood', 'Fire', 'Medical', 'Earthquake'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setEmergencyType(t)}
                        className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                          emergencyType === t
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Number of People:
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 4, '5+'].map((num) => {
                      const val = num === '5+' ? 5 : Number(num);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPeopleCount(val)}
                          className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all ${
                            peopleCount === val
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInjuries}
                    onChange={(e) => setHasInjuries(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="font-bold text-red-700 dark:text-red-400">
                    Injuries present? (Alerts emergency trauma ambulance)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmSos}
                  className="w-full py-3.5 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-red-500/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                  <span>{submitting ? 'Broadcasting SOS...' : 'YES – SEND SOS EMERGENCY'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
