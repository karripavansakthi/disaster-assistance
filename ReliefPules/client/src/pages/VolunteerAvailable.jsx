import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InteractiveMapCard from '../components/InteractiveMapCard';
import StatusBadge from '../components/StatusBadge';
import { getRequests } from '../data/mockData';
import { MapPin, Check, Plus } from 'lucide-react';

export default function VolunteerAvailable() {
  const [requests, setRequests] = useState(getRequests());

  const handleClaim = (id) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: 'Assigned', assignedVolunteer: 'You (Suresh)' } : r
      )
    );
    alert(`Request ${id} accepted! Added to your assigned tasks.`);
  };

  return (
    <DashboardLayout
      title="Available Requests"
      subtitle="Pending SOS calls awaiting responder pickup in your vicinity"
      roleOverride="volunteer"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#172B4D] mb-3">Live Radius Incidents Map</h3>
          <InteractiveMapCard height="260px" showLegend={true} zoom={13} />
        </div>

        <div className="bg-white rounded-xl border border-[#E4EAF2] p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#172B4D] mb-4">Open Incidents</h3>
          <div className="divide-y divide-slate-100">
            {requests.map((r) => (
              <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#172B4D]">{r.id}</span>
                    <span className="text-xs font-semibold text-slate-600">• {r.type}</span>
                    <StatusBadge status={r.priority} />
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-[#667085] mt-1">{r.details}</p>
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {r.location} ({r.distance})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleClaim(r.id)}
                  disabled={r.status === 'Assigned'}
                  className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    r.status === 'Assigned'
                      ? 'bg-slate-100 text-slate-400'
                      : 'bg-[#1268E8] hover:bg-blue-700 text-white'
                  }`}
                >
                  {r.status === 'Assigned' ? 'Already Claimed' : 'Accept Assignment'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
