import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getRequests } from '../data/mockData';
import { Clock, MapPin, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VictimHistory() {
  const requests = getRequests();

  return (
    <DashboardLayout
      title="Request History"
      subtitle="Complete log of your previous emergency and relief requests"
      roleOverride="victim"
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-[#E4EAF2] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172B4D]">Logged Incidents</h3>
            <Link
              to="/victim/emergency-request"
              className="text-xs font-bold text-[#F52D3D] hover:underline"
            >
              + New Emergency Request
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.map((req) => (
              <div key={req.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#172B4D]">{req.id}</span>
                    <span className="text-xs font-medium text-slate-600">• {req.type}</span>
                    <StatusBadge status={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{req.timeAgo}</span>
                </div>

                <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">
                  {req.details || 'Emergency report filed. Responder team dispatch allocated.'}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {req.location}
                  </span>
                  <span>Assigned Team: <strong className="text-slate-700">{req.assignedTeam}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
