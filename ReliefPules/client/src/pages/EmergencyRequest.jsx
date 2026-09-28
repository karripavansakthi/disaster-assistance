import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { createEmergencyRequest, getRequests } from '../data/mockData';
import EmergencyTrackingView from '../components/EmergencyTrackingView';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  AlertTriangle,
  Compass,
  Check,
  Send,
  CheckCircle2,
  Minus,
  Plus,
  MapPin,
  Radio,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EmergencyRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'track'
  const [type, setType] = useState('Flood');
  const [priority, setPriority] = useState('Critical');
  const [location, setLocation] = useState('17.3812, 78.4867 (Live GPS Coordinates)');
  
  // Breakdown of affected persons
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [elderly, setElderly] = useState(0);

  const [requiredAssistance, setRequiredAssistance] = useState(['Food', 'Rescue']);
  const [details, setDetails] = useState('');
  const [locating, setLocating] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // Tracking tab search
  const [searchTrackId, setSearchTrackId] = useState('');
  const [selectedTrackRequest, setSelectedTrackRequest] = useState(null);

  const totalPeople = adults + children + elderly;

  const emergencyTypes = [
    'Flood',
    'Earthquake',
    'Cyclone',
    'Fire',
    'Medical',
    'Landslide',
    'Other'
  ];

  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  const assistanceOptions = [
    { id: 'Food', label: 'Food' },
    { id: 'Medical', label: 'Medical' },
    { id: 'Shelter', label: 'Shelter' },
    { id: 'Rescue', label: 'Rescue' }
  ];

  const handleToggleAssistance = (id) => {
    if (requiredAssistance.includes(id)) {
      setRequiredAssistance(requiredAssistance.filter((item) => item !== id));
    } else {
      setRequiredAssistance([...requiredAssistance, id]);
    }
  };

  const handleUseMyLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS Verified)`);
          setLocating(false);
        },
        () => {
          setLocation('17.3812, 78.4867 (Ward 7, Hyderabad)');
          setLocating(false);
        }
      );
    } else {
      setLocation('17.3812, 78.4867 (Ward 7, Hyderabad)');
      setLocating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const peopleDescription = `${totalPeople} total (${adults} Adults, ${children} Children, ${elderly} Elderly)`;

    const newReq = createEmergencyRequest({
      type,
      priority,
      location,
      peopleAffected: Math.max(1, totalPeople),
      requiredAssistance,
      details: details ? `${details} [Affected: ${peopleDescription}]` : `[Affected: ${peopleDescription}]`,
      name: user?.name || 'Citizen Requester'
    });

    // Also attempt asynchronous broadcast to backend
    try {
      axios.post(`${API}/api/emergency/public`, {
        victimName: user?.name || 'Citizen Requester',
        phone: user?.phone || '9999999999',
        disasterType: type.toLowerCase(),
        assistanceType: requiredAssistance.join(', ').toLowerCase() || 'rescue',
        location: {
          address: location,
          city: 'Hyderabad',
          coordinates: { lat: 17.3812, lng: 78.4867 },
        },
        peopleCount: Math.max(1, totalPeople),
        description: details || 'Emergency request from citizen portal',
      }).catch(() => {});
    } catch {
      // Offline safe
    }

    setSubmittedRequest(newReq);
    setSelectedTrackRequest(newReq);
    setActiveTab('track');
  };

  const handleSearchTrack = (e) => {
    e.preventDefault();
    if (!searchTrackId.trim()) return;
    const reqs = getRequests();
    const found = reqs.find((r) => r.id.toUpperCase() === searchTrackId.trim().toUpperCase());
    if (found) {
      setSelectedTrackRequest(found);
    } else {
      alert(`Request ID #${searchTrackId} not found in active records.`);
    }
  };

  return (
    <DashboardLayout
      title="Emergency Assistance & Live Tracking"
      subtitle="Dispatch rescue teams or monitor your emergency response in real time"
      roleOverride="victim"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'new'
                  ? 'bg-[#F52D3D] text-white shadow-sm shadow-red-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>🆘 Submit Emergency SOS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('track');
                if (!selectedTrackRequest) {
                  const reqs = getRequests();
                  setSelectedTrackRequest(submittedRequest || reqs[0]);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-[#1268E8] text-white shadow-sm shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>📡 Live SOS Tracker</span>
            </button>
          </div>

          <Link
            to="/tracker"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Full-Screen Tracker</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── TAB 1: SUBMIT NEW REQUEST ── */}
        {activeTab === 'new' && (
          <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-[#E4EAF2] dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type of Emergency & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type of Emergency */}
                <div>
                  <label htmlFor="emergency-type" className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1.5">
                    Type of Emergency
                  </label>
                  <select
                    id="emergency-type"
                    name="emergencyType"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#172B4D] dark:text-white font-medium focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100"
                  >
                    {emergencyTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="emergency-priority" className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1.5">
                    Priority
                  </label>
                  <select
                    id="emergency-priority"
                    name="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100 ${
                      priority === 'Critical' ? 'text-red-600 dark:text-red-400' : priority === 'High' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Location with GPS Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="emergency-location" className="text-xs font-bold text-[#172B4D] dark:text-slate-200">
                    Current Location
                  </label>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-[#1268E8] dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Compass className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                    <span>Use My Location</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="emergency-location"
                    name="location"
                    type="text"
                    autoComplete="street-address"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Coordinates or street location"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#172B4D] dark:text-white focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* People Affected: 3 inline counters */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#172B4D] dark:text-slate-200">
                    People Affected
                  </label>
                  <span className="text-xs font-bold text-[#1268E8]">
                    Total: {totalPeople} {totalPeople === 1 ? 'person' : 'persons'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  {/* Adults */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-500 mb-1">Adults</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(0, adults - 1))}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-sm sm:text-base w-6 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-500 mb-1">Children</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-sm sm:text-base w-6 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Elderly */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-500 mb-1">Elderly (60+)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setElderly(Math.max(0, elderly - 1))}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-sm sm:text-base w-6 text-center">{elderly}</span>
                      <button
                        type="button"
                        onClick={() => setElderly(elderly + 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Assistance Checkboxes */}
              <div>
                <span className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-2">
                  Required Assistance
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {assistanceOptions.map((opt) => {
                    const isChecked = requiredAssistance.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleAssistance(opt.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isChecked
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-[#1268E8] text-[#1268E8] dark:text-blue-400 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-[#E4EAF2] dark:border-slate-700 text-[#667085] dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#1268E8] border-[#1268E8] text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Information Textarea */}
              <div>
                <label htmlFor="emergency-details" className="block text-xs font-bold text-[#172B4D] dark:text-slate-200 mb-1.5">
                  Additional Information & Critical Landmarks
                </label>
                <textarea
                  id="emergency-details"
                  name="details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Water level, trapped victims, landmark near your house..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#172B4D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Large Red Button: Send Emergency Request */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white text-sm sm:text-base font-extrabold shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Send Emergency SOS Signal</span>
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 2: LIVE SOS TRACKER ── */}
        {activeTab === 'track' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Quick Search Header */}
            <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <form onSubmit={handleSearchTrack} className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value)}
                  placeholder="Enter SOS ID (e.g. REQ1024)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold uppercase focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                >
                  Track ID
                </button>
              </form>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  + New SOS
                </button>
                <Link
                  to={`/tracker?id=${selectedTrackRequest?.id || ''}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                >
                  <span>Full Screen</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Tracking View Card */}
            {selectedTrackRequest ? (
              <EmergencyTrackingView
                request={selectedTrackRequest}
                onStatusChange={(status) => {
                  setSelectedTrackRequest((prev) => ({
                    ...prev,
                    status,
                  }));
                }}
              />
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <p className="text-sm font-semibold">No active SOS selected. Submit an SOS or enter a Request ID above.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
