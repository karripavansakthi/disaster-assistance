import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getRequests } from '../data/mockData';
import { MapPin, Phone, CheckCircle, Navigation } from 'lucide-react';

export default function VolunteerAssigned() {
  const requests = getRequests().slice(0, 4);

  return (
    <DashboardLayout
      title="Assigned Requests"
      subtitle="Rescue missions and support tasks allocated to you"
      roleOverride="volunteer"
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#172B4D] mb-4">Active Field Assignments</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-[#E4EAF2] hover:border-blue-200 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-[#172B4D]">{r.id}</span>
                    <span className="text-xs font-semibold text-slate-600">• {r.type}</span>
                    <StatusBadge status={r.priority} />
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-[#667085] mt-1.5">{r.details}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {r.location} ({r.distance})</span>
                    <span>• Affected: <strong>{r.peopleAffected} persons</strong></span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={`tel:${r.phone || '112'}`}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3 h-3" /> Navigate
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
