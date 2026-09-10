import React, { useState } from 'react';
import { useLocationContext, SUPPORTED_LOCATIONS } from '../context/LocationContext';
import {
  MapPin,
  Navigation,
  Search,
  X,
  Check,
  AlertCircle,
  Shield,
  Radio,
  Clock,
} from 'lucide-react';

export default function LocationModal() {
  const {
    currentLocation,
    setLocation,
    detectCurrentLocation,
    isDetecting,
    detectError,
    modalOpen,
    setModalOpen,
    searchLocations,
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!modalOpen) return null;

  const filteredLocations = searchLocations(searchQuery);

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setFeedbackMsg(`Location updated to ${loc.name}`);
    setTimeout(() => {
      setModalOpen(false);
      setFeedbackMsg('');
    }, 250);
  };

  const handleUseCurrentLocation = async () => {
    const res = await detectCurrentLocation();
    if (res.success) {
      setFeedbackMsg(`Detected location: ${res.location.name}`);
      setTimeout(() => {
        setModalOpen(false);
        setFeedbackMsg('');
      }, 350);
    }
  };

  const QUICK_CITIES = [];

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 leading-tight">
                Set Your Location
              </h3>
              <p className="text-xs text-slate-500">
                Explore disaster status, alerts & shelters near you
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Location Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs text-slate-600">Active Location:</span>
            <strong className="text-xs text-slate-900">{currentLocation?.name || 'No location selected'}</strong>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            Selected
          </span>
        </div>

        {/* Option A: Use Current Location Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="w-full py-3 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting your GPS location...' : '📍 Use My Current Location (GPS)'}</span>
          </button>

          {detectError && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{detectError}</span>
            </div>
          )}

          {feedbackMsg && (
            <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{feedbackMsg}</span>
            </div>
          )}
        </div>

        {/* Option B: Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search city, district, or state..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Quick Location Chips */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Saved locations:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CITIES.map((cityName) => {
              const matched = SUPPORTED_LOCATIONS.find((l) => l.name === cityName);
              const isSelected = currentLocation.name.toLowerCase() === cityName.toLowerCase();
              return (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => matched && handleSelectLocation(matched)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cityName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-60 border-t border-slate-100 pt-2">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No saved locations. Use GPS to set a real location.
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isCurrent =
                currentLocation.name.toLowerCase() === loc.name.toLowerCase() ||
                currentLocation.id === loc.id;
              const riskColor =
                loc.floodRisk === 'Critical' || loc.floodRisk === 'High'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : loc.floodRisk === 'Moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{loc.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({loc.state})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Rain: {loc.rainfall} · Wind: {loc.windSpeed} · {loc.activeEmergencies} active SOS
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${riskColor}`}>
                      {loc.floodRisk} Risk
                    </span>
                    {isCurrent && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
