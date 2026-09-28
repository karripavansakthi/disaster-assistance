import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmergencyTrackingView from '../components/EmergencyTrackingView';
import { getRequests } from '../data/mockData';
import {
  Search,
  Radio,
  AlertTriangle,
  Compass,
  Phone,
  Share2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LiveTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'REQ1024';

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [activeRequest, setActiveRequest] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Load requests from mockData and optionally backend
  const loadRequests = async (targetId = searchQuery) => {
    setLoading(true);
    setNotFound(false);

    const localList = getRequests();
    setAllRequests(localList);

    // Try finding in local mock store first
    let found = localList.find(
      (r) =>
        r.id?.toUpperCase() === targetId.trim().toUpperCase() ||
        r.sosId?.toUpperCase() === targetId.trim().toUpperCase()
    );

    // If not found in local store, try fetching from backend /api/emergency/track/:id
    if (!found) {
      try {
        const res = await axios.get(`${API}/api/emergency/track/${targetId.trim().toUpperCase()}`);
        if (res.data?.data) {
          const bData = res.data.data;
          found = {
            id: bData.sosId || bData._id,
            type: bData.assistanceType || bData.disasterType,
            priority: bData.severity ? bData.severity.charAt(0).toUpperCase() + bData.severity.slice(1) : 'Critical',
            assignedTeam: bData.assignedTeam?.teamId ? `Team ${bData.assignedTeam.teamId}` : 'Rescue Team Alpha',
            peopleAffected: bData.peopleCount || 1,
            details: bData.description || 'Distress signal received',
            location: bData.location?.address || 'GPS Coordinates',
            lat: bData.location?.coordinates?.lat || 17.385,
            lng: bData.location?.coordinates?.lng || 78.4867,
            timeAgo: 'Recently',
            timeline: bData.rescueTimeline?.map((t) => ({
              title: t.stage,
              time: t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : 'In Progress',
              done: t.completed,
              current: !t.completed,
            })) || [],
          };
        }
      } catch (err) {
        // Backend not reachable or ID not found
      }
    }

    if (found) {
      setActiveRequest(found);
      setNotFound(false);
    } else {
      setNotFound(true);
      // Fallback to first available request
      if (localList.length > 0 && !activeRequest) {
        setActiveRequest(localList[0]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadRequests(initialId);

    const onDataUpdated = () => {
      loadRequests(searchQuery);
    };

    window.addEventListener('da_data_updated', onDataUpdated);
    return () => window.removeEventListener('da_data_updated', onDataUpdated);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchParams({ id: searchQuery.trim().toUpperCase() });
    loadRequests(searchQuery.trim().toUpperCase());
  };

  const handleSelectPill = (id) => {
    setSearchQuery(id);
    setSearchParams({ id });
    loadRequests(id);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/tracker?id=${activeRequest?.id || searchQuery}`;
    navigator.clipboard?.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060D17] text-[#172B4D] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-[#062B4C] via-[#0A3D69] to-[#0D4B7E] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
                <span>Live Mission Telemetry & GPS Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Live Emergency SOS Tracker
              </h1>
              <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                Track assigned rescue teams, emergency response units, vehicle telemetry, and evacuation status in real-time 24/7.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copySuccess ? 'Link Copied!' : 'Share Live Tracking'}</span>
              </button>

              <Link
                to="/emergency"
                className="px-4 py-2 rounded-xl bg-[#F52D3D] hover:bg-red-600 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-red-600/30"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Submit New SOS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Search Bar & Quick Switcher */}
        <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Emergency SOS ID (e.g. REQ1024, REQ1023, RP-2026-00038)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{loading ? 'Searching...' : 'Track Live Status'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-semibold text-[11px]">
              Active Missions:
            </span>
            {allRequests.slice(0, 6).map((req) => (
              <button
                key={req.id}
                type="button"
                onClick={() => handleSelectPill(req.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  activeRequest?.id === req.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                #{req.id} ({req.type})
              </button>
            ))}
          </div>

          {notFound && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Request ID <strong>{searchQuery}</strong> was not found in active records. Displaying latest logged active incident below.
              </span>
            </div>
          )}
        </div>

        {/* Main Tracking Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main 2-Column: Interactive Live Tracker */}
          <div className="lg:col-span-2 space-y-6">
            {activeRequest ? (
              <EmergencyTrackingView
                request={activeRequest}
                onStatusChange={(newStatus) => {
                  setActiveRequest((prev) => ({
                    ...prev,
                    status: newStatus,
                  }));
                }}
              />
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
                <LifeBuoy className="w-10 h-10 mx-auto text-blue-500 animate-spin mb-3" />
                <p className="text-sm font-semibold">Loading Live Telemetry Stream...</p>
              </div>
            )}
          </div>

          {/* Right Column: Emergency Helplines & Safety Protocols */}
          <div className="space-y-6">
            
            {/* Immediate Help Lines Card */}
            <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-extrabold text-sm text-red-600 dark:text-red-400">
                  <Phone className="w-4 h-4" />
                  <span>Direct Emergency Helplines</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  Toll-Free 24/7
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { num: '112', label: 'National Disaster / All Emergencies', desc: 'Unified Police, Fire & Medical dispatch' },
                  { num: '1070', label: 'State Disaster Management Authority', desc: 'State Relief & Rescue operations' },
                  { num: '108', label: 'Emergency Medical & Ambulance', desc: 'Critical medical trauma transport' },
                  { num: '101', label: 'Fire & Rescue Service', desc: 'Hazmat, structural fire & flood extraction' },
                  { num: '100', label: 'Police Control Room', desc: 'Law, order & cordon security' },
                ].map(({ num, label, desc }) => (
                  <div
                    key={num}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
                    </div>
                    <a
                      href={`tel:${num}`}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs shrink-0 shadow-xs transition-transform active:scale-95"
                    >
                      {num}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Crucial Safety Guidance Card */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Critical Safety Steps While Waiting</span>
              </div>

              <ul className="text-xs text-amber-950 dark:text-amber-300/90 space-y-2 font-medium list-disc pl-4 leading-relaxed">
                <li>Keep your mobile phone battery conserved and turn on location GPS services.</li>
                <li>Stay in an open, elevated area away from power lines, fallen trees, and unverified structural walls.</li>
                <li>If water levels rise, move to the roof with signaling cloth or flashlight; never enter enclosed attics.</li>
                <li>Do not attempt to walk or drive through flowing water depths above ankle height.</li>
              </ul>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Related Disaster Services
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold">
                <Link
                  to="/shelters"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 text-center"
                >
                  Nearby Shelters
                </Link>
                <Link
                  to="/medical"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 text-center"
                >
                  Medical Camps
                </Link>
                <Link
                  to="/alerts"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 text-center"
                >
                  Official Alerts
                </Link>
                <Link
                  to="/safety"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 text-center"
                >
                  AI Safety Assistant
                </Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
