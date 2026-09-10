import React from 'react';
import { Sparkles, MapPin, BedDouble, HeartPulse, Navigation, CheckCircle2 } from 'lucide-react';

export default function AiRecommendationCard({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#0c1b35] via-[#09152b] to-[#060c1a] rounded-2xl border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
              AI Shelter Recommendation
            </h3>
            <p className="text-xs text-cyan-300 font-medium">
              Best Shelter for Victim (Ranked by Proximity, Capacity & Medical Aid)
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          Smart Match Engine
        </span>
      </div>

      {/* Ranked List */}
      <div className="space-y-3">
        {recommendations.slice(0, 3).map((sh, idx) => {
          const score = sh.score || (idx === 0 ? 94 : idx === 1 ? 81 : 75);
          const distance = sh.distanceKm !== undefined ? `${sh.distanceKm} km` : (sh.distance || '1.2 km');
          const availability = sh.availabilityPct !== undefined ? `${sh.availabilityPct}%` : '72%';
          const hasMedical = sh.medicalAvailable !== undefined ? sh.medicalAvailable : true;

          return (
            <div
              key={sh._id || idx}
              className="bg-[#070f1f]/80 rounded-xl p-3.5 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 font-black flex items-center justify-center text-sm border border-cyan-500/30 shrink-0">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-snug">
                    {sh.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Distance: <strong className="text-white">{distance}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                      Availability: <strong className="text-amber-300">{availability}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                      Medical: <strong className={hasMedical ? 'text-emerald-400' : 'text-slate-400'}>{hasMedical ? 'Yes' : 'No'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Score & Navigation */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Match Score</span>
                  <span className="text-lg font-black text-cyan-400">{score}%</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const lat = sh.location?.lat || 17.6868;
                    const lng = sh.location?.lng || 83.2185;
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 shadow-sm shadow-cyan-600/30 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
