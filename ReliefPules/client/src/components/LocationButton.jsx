import React from 'react';
import { useLocationContext } from '../context/LocationContext';
import { MapPin, ChevronDown } from 'lucide-react';

export default function LocationButton({ compact = false }) {
  const { currentLocation, setModalOpen } = useLocationContext();

  return (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      title="Click to change your disaster monitoring location"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200/80 transition-all shadow-2xs hover:border-slate-300 dark:bg-white/5 dark:text-neutral-200 dark:border-white/15 dark:hover:bg-white/10 dark:hover:border-white/25"
    >
      <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
      <span className="truncate max-w-[140px] sm:max-w-[200px]">
        {currentLocation
          ? compact
            ? currentLocation.name
            : `${currentLocation.name}${currentLocation.state ? `, ${currentLocation.state}` : ''}`
          : 'Set location'}
      </span>
      <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
    </button>
  );
}
