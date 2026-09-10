import React from 'react';
import {
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Circle,
  Ambulance,
  Shield,
  Users,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pending', label: 'Request Received' },
  { key: 'assigned', label: 'Volunteer Assigned' },
  { key: 'en_route', label: 'Assistance Arriving' },
  { key: 'resolved', label: 'Completed' },
];

export default function EmergencyCard({ emergency, onStatusUpdate }) {
  if (!emergency) return null;

  const sosId = emergency.sosId || `#REQ${emergency._id?.slice(-4) || '1024'}`;
  const severity = emergency.severity || 'high';
  const status = emergency.status || 'pending';

  // Determine current step index in the 4-step workflow
  let currentStep = 0;
  if (status === 'assigned') currentStep = 1;
  else if (status === 'en_route' || status === 'on_scene') currentStep = 2;
  else if (status === 'rescued' || status === 'resolved') currentStep = 3;

  const severityBadge =
    severity === 'critical'
      ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
      : severity === 'high'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : severity === 'moderate'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const statusDisplay =
    status === 'assigned'
      ? '🚑 Rescue Assigned'
      : status === 'en_route'
      ? '🚨 Team En Route'
      : status === 'on_scene'
      ? '📍 Rescuers On Scene'
      : status === 'resolved' || status === 'rescued'
      ? '✅ Completed'
      : '⏳ Pending Assignment';

  return (
    <div className="bg-white rounded-2xl border border-red-200 p-5 sm:p-6 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-lg text-red-600">{sosId}</span>
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${severityBadge}`}>
              {severity} Priority
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Emergency Type: <strong className="capitalize text-slate-800">{emergency.disasterType || 'Disaster Incident'}</strong>
          </p>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            {statusDisplay}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-semibold">
            {new Date(emergency.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Incident Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
        <div className="flex items-start gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Incident Location</span>
            <span>{emergency.location?.address || 'Current victim coordinates attached'}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 text-slate-600">
          <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">People Affected</span>
            <span>{emergency.peopleCount || 1} people registered with this request</span>
          </div>
        </div>
      </div>

      {/* Required Assistance Badges */}
      {emergency.assistanceRequired?.length > 0 && (
        <div className="mb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Required Assistance
          </span>
          <div className="flex flex-wrap gap-1.5">
            {emergency.assistanceRequired.map((ast) => (
              <span
                key={ast}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
              >
                {ast}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Triage Reason if available */}
      {emergency.triageReason && (
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 mb-5">
          <strong className="block text-blue-700 font-bold mb-0.5">🤖 AI Triage Analysis:</strong>
          {emergency.triageReason}
        </div>
      )}

      {/* 4-Step Progress Tracker */}
      <div className="pt-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Rescue Progress Status
        </div>
        <div className="grid grid-cols-4 gap-2">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.key} className="text-center">
                <div className="flex items-center justify-center mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    } ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                </div>
                <div
                  className={`text-[10px] font-bold leading-tight ${
                    isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Action Buttons for Volunteer/Admin */}
      {onStatusUpdate && status !== 'resolved' && (
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
          {status === 'pending' && (
            <button
              onClick={() => onStatusUpdate(emergency._id, 'assigned')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Accept Mission
            </button>
          )}
          {status === 'assigned' && (
            <button
              onClick={() => onStatusUpdate(emergency._id, 'en_route')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              Mark En Route
            </button>
          )}
          {status === 'en_route' && (
            <button
              onClick={() => onStatusUpdate(emergency._id, 'on_scene')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Mark On Scene
            </button>
          )}
          {(status === 'on_scene' || status === 'assigned' || status === 'en_route') && (
            <button
              onClick={() => onStatusUpdate(emergency._id, 'resolved')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
}
