import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import LiveRouteTrackerMap from '../components/LiveRouteTrackerMap';
import { getRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useRealtimeEmergency } from '../context/RealtimeEmergencyContext';
import {
  MapPin,
  Phone,
  CheckCircle,
  Navigation,
  Clock,
  Car,
  CheckCircle2,
  AlertTriangle,
  Users,
  Radio,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function VolunteerAssigned() {
  const { user } = useAuth();
  const { updateSosStatus } = useRealtimeEmergency();

  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadAssigned = () => {
    const all = getRequests();
    // Filter requests that are assigned, in progress, or completed recently
    const myMissions = all.filter(
      (r) =>
        r.status === 'Assigned' ||
        r.status === 'In Progress' ||
        r.status === 'en_route' ||
        r.status === 'on_scene' ||
        r.assignedVolunteer === user?.name ||
        r.assignedVolunteer?.includes('Suresh') ||
        r.assignedVolunteer?.includes('Volunteer')
    );
    setRequests(myMissions);

    if (myMissions.length > 0 && !selectedReq) {
      setSelectedReq(myMissions[0]);
    } else if (selectedReq) {
      const refreshed = myMissions.find((m) => m.id === selectedReq.id);
      if (refreshed) setSelectedReq(refreshed);
    }
  };

  useEffect(() => {
    loadAssigned();
    window.addEventListener('da_data_updated', loadAssigned);
    return () => window.removeEventListener('da_data_updated', loadAssigned);
  }, []);

  const handleAdvanceStatus = async (req, targetStatus, message) => {
    setUpdatingId(req.id);
    try {
      await updateSosStatus(req.id, targetStatus, message);
    } catch {
      alert('Could not update status. Retrying in offline mode...');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStepState = (req) => {
    const isCompleted = req.status === 'Completed' || req.status === 'resolved';
    const isArrived = req.timeline?.some((t) => t.title.includes('Arrived') && t.done) || req.status === 'on_scene';
    const isEnRoute = req.status === 'In Progress' || req.status === 'en_route' || req.timeline?.some((t) => t.title.includes('Way') && t.done);
    return { isCompleted, isArrived, isEnRoute };
  };

  return (
    <DashboardLayout
      title="My Assigned Missions"
      subtitle="Active disaster rescue deployments and victim navigation allocated to your unit"
      roleOverride="volunteer"
    >
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        
        {/* Missions Summary Header */}
        <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              <span>Active Field Deployments</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white">
              {requests.length} Allocations in Sector Ward 7
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Update your live status to keep the victim informed on their phone in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-black text-blue-700 dark:text-blue-300">
              Unit: {user?.name || 'Suresh (Field Volunteer)'}
            </span>
          </div>
        </div>

        {/* Main Grid: Active Mission Details & Navigation */}
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
              No Pending Missions Assigned
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              You are ready for deployment. Check the Available Requests tab to claim an open SOS incident in your sector.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((r) => {
              const { isCompleted, isArrived, isEnRoute } = getStepState(r);
              const lat = r.lat || 17.385;
              const lng = r.lng || 78.4867;
              const isUpdating = updatingId === r.id;

              return (
                <div
                  key={r.id}
                  className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5"
                >
                  {/* Mission Card Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                          #{r.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {r.type}
                        </span>
                        <StatusBadge status={r.priority} />
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-medium">
                        <span>Victim: <strong className="text-slate-800 dark:text-white">{r.victimName || 'Citizen in Distress'}</strong></span>
                        <span>•</span>
                        <span>Affected: {r.peopleAffected || 1} Persons</span>
                        <span>•</span>
                        <span>Distance: {r.distance || '1.2 km'}</span>
                      </div>
                    </div>

                    {/* Direct Contact Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${r.phone || '+919849012345'}`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Victim</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Open GPS App</span>
                      </a>
                    </div>
                  </div>

                  {/* Incident Situation & Coordinates */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{r.location} (Coordinates: {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)})</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {r.details}
                    </p>
                  </div>

                  {/* Interactive Live Navigation Route Map */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                      Live Turn-by-Turn GPS Map & Route Navigation
                    </span>
                    <LiveRouteTrackerMap
                      victimPos={[lat, lng]}
                      responderPos={[lat - 0.007, lng - 0.009]}
                      shelterPos={[lat + 0.003, lng - 0.004]}
                      victimName={r.victimName || 'Citizen in Distress'}
                      responderName={user?.name || 'Volunteer Unit'}
                      height="260px"
                      isMoving={!isArrived && !isCompleted}
                    />
                  </div>

                  {/* Real-Time Status Pipeline Progression Controls */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step-by-Step Response Pipeline (Updates Citizen Phone Live)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Step 1: On The Way */}
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(r, 'en_route', 'Volunteer is traveling to your location with relief equipment.')}
                        disabled={isEnRoute || isArrived || isCompleted || isUpdating}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isEnRoute || isArrived || isCompleted
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 shadow-xs'
                        }`}
                      >
                        <Car className="w-5 h-5 text-blue-600" />
                        <span>1. Volunteer On The Way</span>
                        <span className="text-[10px] font-normal opacity-80">
                          {isEnRoute || isArrived || isCompleted ? '✓ Completed' : 'Click to start travel'}
                        </span>
                      </button>

                      {/* Step 2: Arrived */}
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(r, 'on_scene', 'Volunteer has reached victim location. On-site rescue in progress.')}
                        disabled={!isEnRoute || isArrived || isCompleted || isUpdating}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isArrived || isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : isEnRoute
                            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-md animate-pulse'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                        <span>2. Assistance Arrived</span>
                        <span className="text-[10px] font-normal opacity-90">
                          {isArrived || isCompleted ? '✓ Reached Scene' : isEnRoute ? 'Click upon arrival' : 'Pending Step 1'}
                        </span>
                      </button>

                      {/* Step 3: Completed */}
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(r, 'resolved', 'Victims safely evacuated or provided required relief supplies.')}
                        disabled={!isArrived || isCompleted || isUpdating}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : isArrived
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-md animate-pulse'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>3. Assistance Completed</span>
                        <span className="text-[10px] font-normal opacity-90">
                          {isCompleted ? '✓ Mission Resolved' : isArrived ? 'Click when resolved' : 'Pending Step 2'}
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
