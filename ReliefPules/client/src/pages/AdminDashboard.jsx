import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InteractiveMapCard from '../components/InteractiveMapCard';
import StatusBadge from '../components/StatusBadge';
import {
  getRequests,
  saveRequests,
  getShelters,
  getVolunteers,
  getHospitals,
  getRescueTeams,
  getSimulationState,
  startSimulation,
  pauseSimulation,
  resetSimulation,
  addNotification
} from '../data/mockData';
import {
  Users,
  AlertTriangle,
  Home,
  Shield,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Ambulance,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const toSafeString = (val, fallback = '') => {
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object' && val !== null) {
    if (val.disasterType) return toSafeString(val.disasterType, fallback);
    if (val.severity) return toSafeString(val.severity, fallback);
    if (val.name) return toSafeString(val.name, fallback);
    if (val.type) return toSafeString(val.type, fallback);
  }
  return fallback;
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [rescueTeams, setRescueTeams] = useState([]);
  const [simulation, setSimulation] = useState(getSimulationState());
  const [simDisasterType, setSimDisasterType] = useState('Cyclone');
  const [simSeverity, setSimSeverity] = useState('High');
  const [filterType, setFilterType] = useState('All');

  const refreshState = () => {
    setRequests(getRequests());
    setShelters(getShelters());
    setVolunteers(getVolunteers());
    setHospitals(getHospitals());
    setRescueTeams(getRescueTeams());
    setSimulation(getSimulationState());
  };

  useEffect(() => {
    refreshState();
    window.addEventListener('da_data_updated', refreshState);
    return () => window.removeEventListener('da_data_updated', refreshState);
  }, []);

  const handleStartSim = () => {
    startSimulation({ disasterType: simDisasterType, severity: simSeverity });
    refreshState();
  };

  const handlePauseSim = () => {
    pauseSimulation();
    refreshState();
  };

  const handleResetSim = () => {
    resetSimulation();
    refreshState();
  };

  const handleQuickAssign = (requestId) => {
    const current = getRequests();
    const updated = current.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Assigned',
          assignedTeam: 'Rescue Team Alpha',
          assignedVolunteer: 'Field Responder Unit #1'
        };
      }
      return r;
    });
    saveRequests(updated);
    addNotification({
      type: 'dispatch',
      title: `Team Dispatched to ${requestId}`,
      message: 'Rescue Team Alpha assigned and deployed for immediate extraction.',
      link: '/admin/requests'
    });
    refreshState();
  };

  const handleQuickResolve = (requestId) => {
    const current = getRequests();
    const updated = current.map((r) => {
      if (r.id === requestId) {
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
      title: `Request ${requestId} Resolved`,
      message: 'Victims safely evacuated or provided essential medical/shelter relief.',
      link: '/admin/requests'
    });
    refreshState();
  };

  const activeEmergencies = requests.filter((r) => r.status !== 'Completed');
  const totalBedsAvailable = shelters.reduce((acc, s) => acc + (s.available || (s.capacity - s.occupied) || 0), 0);
  const activeResponders = volunteers.filter((v) => v.status === 'Available' || v.status === 'Assigned').length;
  const filteredRequests = requests.filter(
    (r) => filterType === 'All' || r.type.toLowerCase() === filterType.toLowerCase()
  );

  return (
    <DashboardLayout
      title="Incident Command Center"
      subtitle="Real-time multi-agency coordination, live triage, and disaster simulation"
      roleOverride="admin"
    >
      <div className="space-y-6 font-sans">
        {/* Disaster Simulation Control Center */}
        <div className="bg-gradient-to-r from-[#062B4C] via-[#0A3D69] to-[#062B4C] rounded-2xl p-6 text-white border border-white/10 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                  Viva Demonstration & Training Mode
                </span>
                {simulation.active && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider">
                    {simulation.paused ? 'DRILL PAUSED' : 'DRILL LIVE'}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Disaster Simulation Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Simulate sudden disaster waves (Cyclone, Inundation, Tremors) to demonstrate dynamic triage, auto-dispatch alerts, and shelter capacity absorption during evaluator demonstrations.
              </p>
            </div>

            {/* Simulation Controls */}
            <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
              <div className="flex items-center gap-2">
                <label htmlFor="sim-disaster-select" className="text-xs text-slate-300 font-medium">Hazard:</label>
                <select
                  id="sim-disaster-select"
                  name="simDisasterType"
                  value={simDisasterType}
                  onChange={(e) => setSimDisasterType(e.target.value)}
                  disabled={simulation.active}
                  className="bg-[#041A2E] text-white text-xs font-bold rounded-lg px-2.5 py-2 border border-white/20 focus:outline-none"
                >
                  <option value="Cyclone">Cyclone (Category 4)</option>
                  <option value="Flood">Flash Flood (Inundation)</option>
                  <option value="Earthquake">Earthquake (Magnitude 6.8)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sim-severity-select" className="text-xs text-slate-300 font-medium">Severity:</label>
                <select
                  id="sim-severity-select"
                  name="simSeverity"
                  value={simSeverity}
                  onChange={(e) => setSimSeverity(e.target.value)}
                  disabled={simulation.active}
                  className="bg-[#041A2E] text-white text-xs font-bold rounded-lg px-2.5 py-2 border border-white/20 focus:outline-none"
                >
                  <option value="High">High (Standard Drill)</option>
                  <option value="Critical">Critical (Massive Surge)</option>
                  <option value="Medium">Medium (Localized)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                {!simulation.active ? (
                  <button
                    type="button"
                    onClick={handleStartSim}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Live Drill</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handlePauseSim}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>{simulation.paused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetSim}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Baseline</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Simulation Live Telemetry Status */}
          {Boolean(simulation?.active) && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-black/20 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Active Drill Type:</span>
                <span className="font-extrabold text-red-300">
                  {toSafeString(simulation?.disasterType, 'Cyclone')} ({toSafeString(simulation?.severity, 'High')})
                </span>
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Affected Zone:</span>
                <span className="font-extrabold text-white truncate">{toSafeString(simulation?.affectedArea, 'Coastal Zone')}</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Generated Influx:</span>
                <span className="font-extrabold text-amber-300">+{Number(simulation?.metrics?.addedRequests) || 0} Requests</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Displaced Individuals:</span>
                <span className="font-extrabold text-emerald-300">+{Number(simulation?.metrics?.addedVictims) || 0} Trapped</span>
              </div>
            </div>
          )}
        </div>

        {/* 4 Primary Operational Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Active Emergencies */}
          <div className="bg-white rounded-xl p-5 border border-[#E4EAF2] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#F52D3D] flex items-center justify-center shrink-0 border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#667085]">Active Emergencies</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172B4D] tracking-tight">{activeEmergencies.length}</span>
                <span className="text-[11px] font-bold text-[#F52D3D] bg-red-50 px-1.5 py-0.5 rounded">
                  {requests.filter((r) => r.priority === 'Critical').length} Critical
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Shelter Beds Available */}
          <div className="bg-white rounded-xl p-5 border border-[#E4EAF2] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#20A464] flex items-center justify-center shrink-0 border border-emerald-100">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#667085]">Available Shelter Beds</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172B4D] tracking-tight">{totalBedsAvailable}</span>
                <span className="text-[11px] font-bold text-[#20A464] bg-emerald-50 px-1.5 py-0.5 rounded">
                  {shelters.length} Hubs
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Field Responders */}
          <div className="bg-white rounded-xl p-5 border border-[#E4EAF2] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1268E8] flex items-center justify-center shrink-0 border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#667085]">Active Responders</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172B4D] tracking-tight">{activeResponders}</span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {rescueTeams.length} Squads
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Medical Facilities */}
          <div className="bg-white rounded-xl p-5 border border-[#E4EAF2] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#667085]">Medical Facilities</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#172B4D] tracking-tight">{hospitals.length}</span>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  Active Triage
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Disaster GIS Map Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#E4EAF2] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#172B4D]">Live Operational GIS Map</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded">
                  Multi-Agency Telemetry
                </span>
              </div>
              <p className="text-xs text-[#667085]">
                Victim distress clusters with people counts, rescue boats, safe shelters, and trauma hospitals
              </p>
            </div>
            <Link
              to="/shelters"
              className="text-xs font-bold text-[#1268E8] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Full Screen Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <InteractiveMapCard height="380px" showLegend={true} zoom={13} />
        </div>

        {/* Emergency Dispatch & Triage Table */}
        <div className="bg-white rounded-2xl p-6 border border-[#E4EAF2] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-[#172B4D]">Live Incident Triage & Dispatch Desk</h3>
              <p className="text-xs text-[#667085]">
                One-click rescue assignment and status progression for rapid field coordination
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Filter Hazard:</span>
              <select
                id="filter-hazard-type"
                name="filterHazardType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1268E8]"
              >
                <option value="All">All Incidents</option>
                <option value="Flood">Flood & Water</option>
                <option value="Medical">Medical / Trauma</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Shelter">Shelter Evacuation</option>
                <option value="Food">Food / Ration</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4EAF2] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Disaster Type</th>
                  <th className="py-3 px-4">Victim / Trapped</th>
                  <th className="py-3 px-4">AI Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4 text-right">Quick Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172B4D]">
                      <div>{req.id}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{req.timeAgo}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <div>{req.type}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px] font-normal">{req.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{req.victimName || 'Citizen'}</span>
                      <div className="text-[10px] text-red-600 font-bold">
                        {req.peopleAffected || 1} Person(s)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {req.assignedTeam && req.assignedTeam !== '-' ? (
                        <span className="text-blue-600">{req.assignedTeam}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => handleQuickAssign(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm transition-colors"
                        >
                          Dispatch Team
                        </button>
                      ) : req.status === 'Assigned' ? (
                        <button
                          type="button"
                          onClick={() => handleQuickResolve(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition-colors"
                        >
                          Mark Evacuated
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px] inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
