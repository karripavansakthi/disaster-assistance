import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Navigation,
  Shield,
  Phone,
  AlertTriangle,
  HeartHandshake,
  Activity,
  MapPin,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import LiveRouteTrackerMap from './LiveRouteTrackerMap';

export default function EmergencyTrackingView({ request, onStatusChange }) {
  if (!request) return null;

  // Extract coordinates safely
  const lat = request.lat || (request.location?.coordinates?.lat) || 17.3850;
  const lng = request.lng || (request.location?.coordinates?.lng) || 78.4867;
  const victimPos = [lat, lng];

  // Responder start position (slightly offset)
  const responderPos = [lat - 0.009, lng - 0.012];

  // Shelter position
  const shelterPos = [lat + 0.004, lng - 0.005];

  const defaultSteps = [
    { id: 'received', title: 'Request Received', subtitle: request.timeAgo || '12 Aug 2026, 08:45 AM', done: true },
    { id: 'triage', title: 'AI Triage Completed', subtitle: `Classified as ${request.priority || 'Critical'} Priority`, done: true },
    { id: 'assigned', title: 'Rescue Team Assigned', subtitle: request.assignedTeam || 'Rescue Team Alpha', done: true },
    { id: 'enroute', title: 'Team En Route', subtitle: 'Live GPS Tracked · ETA 18 mins', current: true },
    { id: 'arrived', title: 'Assistance Arrived', subtitle: 'On-site evacuation & medical triage', pending: true },
    { id: 'resolved', title: 'Request Resolved', subtitle: 'Safe shelter transfer verified', pending: true }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(3); // 3 = Team En Route

  const steps = defaultSteps.map((st, i) => ({
    ...st,
    done: i < currentStepIdx,
    current: i === currentStepIdx,
    pending: i > currentStepIdx
  }));

  const activeIndex = currentStepIdx;
  const progressPercent = Math.min(100, Math.round(((activeIndex + 0.5) / steps.length) * 100));

  const etaMinutes = Math.max(2, 18 - (currentStepIdx - 3) * 8);

  const handleAdvanceStage = () => {
    if (currentStepIdx < steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (onStatusChange) {
        onStatusChange(steps[nextIdx].title);
      }
    }
  };

  const handleResetStage = () => {
    setCurrentStepIdx(3);
    if (onStatusChange) {
      onStatusChange(steps[3].title);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 text-[#172B4D] dark:text-white">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
            <span className="font-extrabold text-base sm:text-lg">
              Live Emergency Response Tracking
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-extrabold text-xs uppercase">
              {request.priority || 'Critical'}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Request ID: <strong className="text-slate-800 dark:text-white font-mono">{request.id || request.sosId}</strong></span>
            <span>&bull;</span>
            <span>Type: {request.type || request.assistanceType || 'Disaster Relief'}</span>
            <span>&bull;</span>
            <span>People: {request.peopleAffected || request.peopleCount || 1} persons</span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Estimated Arrival (ETA)</div>
          <div className="text-lg font-black text-[#1268E8] dark:text-blue-400">
            {currentStepIdx >= 4 ? (currentStepIdx === 5 ? 'Relief Complete' : 'On-Scene Now') : `${etaMinutes} Minutes (${(etaMinutes * 0.08).toFixed(1)} km away)`}
          </div>
        </div>
      </div>

      {/* Interactive Live Route Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Live GPS Dispatch Route & Moving Responder
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Signal Verified
          </span>
        </div>
        <LiveRouteTrackerMap
          victimPos={victimPos}
          responderPos={responderPos}
          shelterPos={shelterPos}
          victimName={request.name || request.victimName || 'Citizen in Distress'}
          responderName={request.assignedTeam || 'Rescue Team Alpha'}
          height="320px"
          isMoving={currentStepIdx === 3}
        />
      </div>

      {/* Progress Bar & Stepper Controls */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Dispatch Progress: {steps[currentStepIdx].title}</span>
          <div className="flex items-center gap-2">
            <span className="text-[#1268E8] dark:text-blue-400">{progressPercent}%</span>
            <button
              type="button"
              onClick={handleAdvanceStage}
              disabled={currentStepIdx >= steps.length - 1}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-all flex items-center gap-1 disabled:opacity-40"
              title="Simulate next step of rescue response"
            >
              <span>Advance Stage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            {currentStepIdx > 3 && (
              <button
                type="button"
                onClick={handleResetStage}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                title="Reset simulation"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {steps.map((step, idx) => {
          return (
            <div key={step.title} className="relative flex items-start gap-4">
              {/* Status Circle */}
              <div className="absolute -left-6 mt-0.5">
                {step.done ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-emerald-50 dark:ring-emerald-950/40 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : step.current ? (
                  <div className="w-5 h-5 rounded-full bg-[#1268E8] text-white flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-950/40 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs sm:text-sm font-extrabold ${step.current ? 'text-[#1268E8] dark:text-blue-400' : step.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {step.title}
                  </h4>
                  {step.current && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] animate-pulse">
                      Live Phase
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Responder & AI Triage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Assigned Team Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Assigned Emergency Unit
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ● Active Radio 156.8 MHz
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#1268E8] flex items-center justify-center font-bold text-lg">
              🚑
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                {request.assignedTeam || 'Rescue Team Alpha (Boat Unit)'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Commander Rajesh Varma &bull; 8 Specialists
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Emergency Team</span>
            </a>
            <span className="text-slate-500 text-[11px]">GPS Verified Responders</span>
          </div>
        </div>

        {/* AI Triage Decision Support Card */}
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>AI Triage Decision Support</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Verified Protocol</span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {request.aiTriage?.reason ||
              request.details ||
              'High-priority triage recommendation based on severity score and presence of vulnerable persons.'}
          </p>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 flex items-center justify-between">
            <span><strong>Response:</strong> Search & Rescue + Medical</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Auto-Dispatched</span>
          </div>
        </div>
      </div>

    </div>
  );
}
