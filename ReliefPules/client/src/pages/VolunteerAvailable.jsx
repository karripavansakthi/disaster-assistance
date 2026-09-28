import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InteractiveMapCard from '../components/InteractiveMapCard';
import StatusBadge from '../components/StatusBadge';
import { getRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useRealtimeEmergency } from '../context/RealtimeEmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Check,
  Plus,
  AlertTriangle,
  Users,
  HeartHandshake,
  Navigation,
  Clock,
  Radio,
  Flame,
  Droplets,
  HeartPulse
} from 'lucide-react';

export default function VolunteerAvailable() {
  const { user } = useAuth();
  const { acceptSos } = useRealtimeEmergency();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [claimingId, setClaimingId] = useState(null);

  const loadPending = () => {
    const all = getRequests();
    setRequests(all);
  };

  useEffect(() => {
    loadPending();
    window.addEventListener('da_data_updated', loadPending);
    return () => window.removeEventListener('da_data_updated', loadPending);
  }, []);

  const pendingRequests = requests.filter(
    (r) => r.status === 'Pending' || r.status === 'pending'
  );

  const handleClaim = async (reqId) => {
    setClaimingId(reqId);
    try {
      await acceptSos(reqId, {
        name: user?.name || 'Suresh (Field Volunteer)',
        phone: user?.phone || '+91 98490 12345',
        id: user?._id || null,
      });

      // Navigate to assigned requests view so volunteer immediately starts navigation
      navigate('/volunteer/assigned');
    } catch (err) {
      alert('Failed to accept request. Please try again.');
    } finally {
      setClaimingId(null);
    }
  };

  // Prepare map pins for pending requests
  const mapItems = pendingRequests.map((r) => ({
    id: r.id,
    type: 'victim',
    name: `${r.id} - ${r.type} (${r.peopleAffected || 1} Persons)`,
    lat: r.lat || 17.385,
    lng: r.lng || 78.4867,
    desc: `${r.priority} Priority · ${r.details || 'Evacuation needed'}`,
  }));

  return (
    <DashboardLayout
      title="Live Available Requests"
      subtitle="Pending citizen SOS calls awaiting rapid responder deployment"
      roleOverride="volunteer"
    >
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        
        {/* Banner with Live Dispatch Telemetry */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-200">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
              <span>Real-Time Sector Triage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {pendingRequests.length} Emergency Signals Awaiting Dispatch
            </h2>
            <p className="text-xs text-blue-100 font-medium mt-1">
              Select an open incident below to accept deployment and receive victim GPS coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold">Auto-Listening for SOS Calls</span>
          </div>
        </div>

        {/* Live Interactive Map of Pending Incidents */}
        <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Live Distress Pins in Your Sector</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {mapItems.length} locations mapped
            </span>
          </div>
          <InteractiveMapCard height="280px" items={mapItems} showLegend={true} zoom={13} />
        </div>

        {/* Pending Requests List */}
        <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Open Incidents Seeking Responders
          </h3>

          {pendingRequests.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-200">
                All Current Incidents Assigned
              </h4>
              <p className="text-xs">
                Great job! No pending SOS signals in your immediate radius right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingRequests.map((r) => {
                const isClaiming = claimingId === r.id;

                return (
                  <div
                    key={r.id}
                    className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 -mx-3 px-3 rounded-xl transition-colors"
                  >
                    <div className="space-y-2.5 flex-1 min-w-0">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          #{r.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {r.type}
                        </span>
                        <StatusBadge status={r.priority} />
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {r.timeAgo || 'Recently'}
                        </span>
                      </div>

                      {/* Details & Victim */}
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {r.details}
                      </p>

                      {/* Location & Assistance Tags */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{r.location}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">({r.distance || '1.4 km'})</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.peopleAffected || 1} Persons Affected</span>
                        </span>
                      </div>

                      {/* Required Assistance Badges */}
                      {r.requiredAssistance && r.requiredAssistance.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-400">Assistance:</span>
                          {r.requiredAssistance.map((ast) => (
                            <span
                              key={ast}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]"
                            >
                              {ast}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button: Accept Assignment */}
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleClaim(r.id)}
                        disabled={isClaiming}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1268E8] hover:bg-blue-700 active:scale-95 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 disabled:opacity-50"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>{isClaiming ? 'Deploying...' : 'Accept Assignment'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
