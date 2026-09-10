import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { createEmergencyRequest } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Compass,
  Check,
  Send,
  CheckCircle2,
  Minus,
  Plus,
  MapPin
} from 'lucide-react';

export default function EmergencyRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('Flood');
  const [priority, setPriority] = useState('Critical');
  const [location, setLocation] = useState('17.3812, 78.4867 (Live GPS Coordinates)');
  
  // Breakdown of affected persons matching Screen 7 in reference
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [elderly, setElderly] = useState(0);

  const [requiredAssistance, setRequiredAssistance] = useState(['Food', 'Rescue']);
  const [details, setDetails] = useState('');
  const [locating, setLocating] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

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

    setSubmittedRequest(newReq);
  };

  return (
    <DashboardLayout
      title="Emergency Assistance"
      subtitle="Provide details about your emergency situation"
      roleOverride="victim"
    >
      <div className="max-w-2xl mx-auto">
        {/* Success Modal / Toast Banner */}
        {submittedRequest && (
          <div className="mb-6 p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-4 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-[#20A464] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Emergency Signal Broadcasted Successfully!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                Your emergency request <strong>#{submittedRequest.id}</strong> has been logged into the central disaster dispatch. Responders in your sector have been alerted.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/victim/dashboard')}
                  className="px-3.5 py-1.5 bg-[#20A464] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Go to Live Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedRequest(null)}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Assistance Form Card matching reference image 7 */}
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

            {/* People Affected: 3 inline counters matching reference Screen 7 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#172B4D] dark:text-slate-200">
                  People Affected
                </span>
                <span className="text-xs font-semibold text-[#1268E8] dark:text-blue-400">
                  Total: {totalPeople} persons
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Adults Counter */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-[#E4EAF2] dark:border-slate-800 text-center">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">Adults</div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm text-[#172B4D] dark:text-white w-5 text-center">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-[#E4EAF2] dark:border-slate-800 text-center">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">Children</div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm text-[#172B4D] dark:text-white w-5 text-center">
                      {children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Elderly Counter */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-[#E4EAF2] dark:border-slate-800 text-center">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">Elderly</div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setElderly(Math.max(0, elderly - 1))}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm text-[#172B4D] dark:text-white w-5 text-center">
                      {elderly}
                    </span>
                    <button
                      type="button"
                      onClick={() => setElderly(elderly + 1)}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
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
                Additional Information
              </label>
              <textarea
                id="emergency-details"
                name="details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Any additional details (e.g. injured people, road blocked...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#172B4D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1268E8] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Large Red Button: Send Emergency Request */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white text-sm sm:text-base font-bold shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Send Emergency Request</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
