import React from 'react';
import { MapPin, Navigation, Eye, CheckCircle2, XCircle, Shield } from 'lucide-react';

export default function ShelterCard({ shelter, onSelect, onViewDetails, distanceKm }) {
  if (!shelter) return null;

  const capacity = shelter.totalCapacity || 500;
  const occupied = shelter.currentOccupancy || 0;
  const available = Math.max(0, capacity - occupied);
  const resolvedDist = distanceKm ?? shelter.distanceKm;
  const distance = resolvedDist !== undefined && resolvedDist !== null ? `${resolvedDist} km away` : (shelter.distance || null);
  const occupancyPct = Math.min(100, Math.round((occupied / capacity) * 100));

  // Amenities checklist
  const hasFood = shelter.amenities?.hasFood ?? (shelter.foodAvailable ?? true);
  const hasWater = shelter.amenities?.hasCleanWater ?? (shelter.waterAvailable ?? true);
  const hasMedical = shelter.medicalStaffAvailable ?? (shelter.amenities?.hasMedical ?? true);
  const hasBeds = available > 0;

  const statusColor =
    shelter.status === 'open'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : shelter.status === 'limited'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-red-50 text-red-700 border-red-200';

  const handleDirections = (e) => {
    e.stopPropagation();
    const lat = shelter.location?.lat || 17.6868;
    const lng = shelter.location?.lng || 83.2185;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between shadow-xs">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0">
              🏠
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {shelter.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {distance ? <span>{distance}</span> : <span className="text-slate-400">{shelter.address?.split(',')[0]}</span>}
                {shelter.city && <span className="text-slate-400">· {shelter.city}</span>}
              </div>
            </div>
          </div>
          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${statusColor}`}>
            {shelter.status || 'open'}
          </span>
        </div>

        {/* Address */}
        <p className="text-xs text-slate-500 line-clamp-1 mb-4">
          {shelter.address || 'Central Evacuation & Relief Hub'}
        </p>

        {/* Capacity Metrics */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity</div>
              <div className="text-base font-black text-slate-800">{capacity}</div>
            </div>
            <div className="border-x border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occupied</div>
              <div className="text-base font-black text-amber-600">{occupied}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</div>
              <div className="text-base font-black text-emerald-600">{available}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                occupancyPct > 90 ? 'bg-red-500' : occupancyPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* Verified Amenities Checklist */}
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Food:</span>
            {hasFood ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">✓ Available</span>
            ) : (
              <span className="text-red-600 font-bold flex items-center gap-0.5">✗ Low</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Water:</span>
            {hasWater ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">✓ Available</span>
            ) : (
              <span className="text-red-600 font-bold flex items-center gap-0.5">✗ Low</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Medical:</span>
            {hasMedical ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">✓ Available</span>
            ) : (
              <span className="text-slate-500 flex items-center gap-0.5">✗ Limited</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Beds:</span>
            {hasBeds ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">✓ Available</span>
            ) : (
              <span className="text-red-600 font-bold flex items-center gap-0.5">✗ Full</span>
            )}
          </div>
        </div>

        {/* AI Score Badge if present */}
        {shelter.score && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs mb-4">
            <span className="text-blue-700 font-bold">🤖 AI Match Score</span>
            <span className="font-black text-blue-700">{shelter.score}%</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewDetails ? onViewDetails(shelter) : onSelect?.(shelter)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
        <button
          type="button"
          onClick={handleDirections}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Directions</span>
        </button>
      </div>
    </div>
  );
}
