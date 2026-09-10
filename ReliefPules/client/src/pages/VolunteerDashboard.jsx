import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InteractiveMapCard from '../components/InteractiveMapCard';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getRequests, saveRequests, addNotification } from '../data/mockData';
import {
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Droplets,
  HeartPulse,
  Home,
  Shield,
  ArrowRight,
  UserCheck,
  ChevronRight,
  Phone,
  Power,
  Navigation,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isOnDuty, setIsOnDuty] = useState(() => {
    return localStorage.getItem('da_volunteer_on_duty') !== 'false';
  });
  const [selectedReq, setSelectedReq] = useState(null);

  const loadRequests = () => {
    setRequests(getRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('da_data_updated', loadRequests);
    return () => window.removeEventListener('da_data_updated', loadRequests);
  }, []);

  const toggleDuty = () => {
    const next = !isOnDuty;
    setIsOnDuty(next);
    localStorage.setItem('da_volunteer_on_duty', String(next));
  };

  // Assigned requests to Suresh or assigned in general
  const myAssignedRequests = requests.filter(
    (r) =>
      r.assignedVolunteer === 'Suresh' ||
      r.assignedVolunteer === 'Field Responder Unit #1' ||
      r.status === 'Assigned'
  );

  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  const handleMarkArrived = (reqId) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'In Progress',
          timeline: r.timeline ? r.timeline.map((t) => t.title.includes('Arriving') ? { ...t, done: true } : t) : []
        };
      }
      return r;
    });
    saveRequests(updated);
    addNotification({
      type: 'dispatch',
      title: `Volunteer Arrived at ${reqId}`,
      message: `Responder Suresh reached ${selectedReq?.location || 'scene'}.`,
      link: '/volunteer/dashboard'
    });
    setSelectedReq(null);
    loadRequests();
  };

  const handleMarkResolved = (reqId) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'Completed'
        };
      }
      return r;
    });
    saveRequests(updated);
    addNotification({
      type: 'dispatch',
      title: `Request ${reqId} Completed`,
      message: 'Citizen emergency successfully addressed by volunteer response.',
      link: '/volunteer/dashboard'
    });
    setSelectedReq(null);
    loadRequests();
  };

  return (
    <DashboardLayout
      title={`Hello, ${user?.name ? user.name.split(' ')[0] : 'Suresh'},`}
      subtitle="Thank you for serving on the frontlines of disaster response!"
      roleOverride="volunteer"
    >
      <div className="space-y-6 font-sans">
        {/* Volunteer Active Badge & Duty Toggle */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4EAF2] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <div>
              <div className="text-xs font-bold text-[#172B4D] flex items-center gap-2">
                <span>Certified Disaster Responder (Level 2)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${isOnDuty ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {isOnDuty ? 'ACTIVE ON DUTY' : 'STANDBY MODE'}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] mt-0.5">
                Designated Sector: Central Emergency Buffer Zone • Radio Call-Sign: RESCUE-BRAVO-4
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleDuty}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isOnDuty
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnDuty ? 'Switch to Standby' : 'Go Active On Duty'}</span>
          </button>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 1. Assigned Requests */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAF2] border-t-4 border-t-[#1268E8] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667085]">My Active Missions</span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1268E8] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-[#172B4D] tracking-tight mt-2">
              {myAssignedRequests.filter((r) => r.status !== 'Completed').length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Pending or en-route to scene</div>
          </div>

          {/* 2. Completed */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAF2] border-t-4 border-t-[#20A464] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667085]">Completed Rescues</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#20A464] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-[#172B4D] tracking-tight mt-2">
              {completedCount + 5}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Verified safe handoffs</div>
          </div>

          {/* 3. Field Hours */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4EAF2] border-t-4 border-t-purple-600 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667085]">Active Field Hours</span>
              <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-black text-[#172B4D] tracking-tight mt-2">
              48.5 hrs
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">Disaster Assistance Badge</div>
          </div>
        </div>

        {/* Main Card: My Assigned Requests */}
        <div className="bg-white rounded-2xl p-6 border border-[#E4EAF2] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#172B4D]">My Active Response Tasks</h3>
              <p className="text-xs text-[#667085]">Requests triaged and assigned to your responder squad</p>
            </div>
            <Link
              to="/volunteer/available"
              className="text-xs font-bold text-[#1268E8] hover:underline inline-flex items-center gap-1"
            >
              <span>Browse All Unassigned</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {myAssignedRequests.map((req) => (
              <div
                key={req.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1268E8] flex items-center justify-center shrink-0 border border-blue-100">
                    {req.type === 'Flood' ? (
                      <Droplets className="w-5 h-5 text-blue-600" />
                    ) : req.type === 'Medical' ? (
                      <HeartPulse className="w-5 h-5 text-red-600" />
                    ) : (
                      <Home className="w-5 h-5 text-amber-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-[#172B4D]">{req.id}</span>
                      <span className="text-xs font-semibold text-[#667085]">• {req.type}</span>
                      <span className="text-[11px] text-slate-400">({req.timeAgo || 'Recent'})</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <StatusBadge status={req.priority} />
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {req.peopleAffected || 1} Person(s)
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {req.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <StatusBadge status={req.status} />

                  <button
                    type="button"
                    onClick={() => setSelectedReq(req)}
                    className="px-4 py-2 rounded-xl bg-[#062B4C] hover:bg-[#0A3D69] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}

            {myAssignedRequests.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs">
                No active tasks currently assigned. Check unassigned incidents nearby.
              </div>
            )}
          </div>
        </div>

        {/* Nearby Victims Map Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E4EAF2] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#172B4D]">Live Incident Heatmap & Nearby Victims</h3>
              <p className="text-xs text-[#667085]">Geo-coordinates of victims reporting urgent aid in your perimeter</p>
            </div>
            <Link
              to="/volunteer/available"
              className="px-3.5 py-1.5 rounded-xl bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              Browse Incidents
            </Link>
          </div>

          <InteractiveMapCard height="320px" showLegend={true} zoom={13} />
        </div>
      </div>

      {/* Action Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#172B4D]">
                  Mission Action: {selectedReq.id}
                </h3>
                <span className="text-xs font-bold text-blue-600">{selectedReq.type} Emergency</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div><strong>Victim Contact:</strong> {selectedReq.victimName || 'Citizen'} ({selectedReq.phone || '+91 98451 23456'})</div>
              <div><strong>Location:</strong> {selectedReq.location}</div>
              <div><strong>Headcount:</strong> {selectedReq.peopleAffected || 1} person(s) requiring assistance</div>
              {selectedReq.details && (
                <div className="p-2 bg-white rounded-lg border border-slate-200 mt-2">
                  <span className="font-semibold text-slate-700">Report Details:</span> {selectedReq.details}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>

              <a
                href={`tel:${selectedReq.phone || '112'}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" /> Call Victim
              </a>

              {selectedReq.status !== 'In Progress' && selectedReq.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => handleMarkArrived(selectedReq.id)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm"
                >
                  Mark Arrived At Scene
                </button>
              )}

              {selectedReq.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => handleMarkResolved(selectedReq.id)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-sm"
                >
                  Mark Evacuated & Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
