import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getVolunteers } from '../data/mockData';
import { ShieldCheck, Phone, Mail, Award, Clock } from 'lucide-react';

export default function AdminVolunteers() {
  const volunteers = getVolunteers();

  return (
    <DashboardLayout
      title="Manage Volunteers"
      subtitle="Deployment roster of field rescue teams, medical staff, and logistics responders"
      roleOverride="admin"
    >
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white rounded-xl border border-[#E4EAF2] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1268E8] flex items-center justify-center font-bold text-sm border border-blue-100">
                      {vol.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#172B4D]">{vol.name}</h4>
                      <p className="text-xs text-[#1268E8] font-semibold">{vol.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={vol.status} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg text-center text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Active Tasks</div>
                    <div className="font-bold text-[#172B4D]">{vol.assignedCount}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Completed</div>
                    <div className="font-bold text-[#20A464]">{vol.completedCount}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Total Hours</div>
                    <div className="font-bold text-purple-600">{vol.totalHours} hrs</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-[#667085] space-y-1">
                  <div><strong>Phone:</strong> {vol.phone}</div>
                  <div><strong>Deployed Base:</strong> {vol.currentLocation}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vol.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                <a
                  href={`tel:${vol.phone}`}
                  className="px-3 py-1.5 rounded-lg border border-[#E4EAF2] hover:bg-slate-50 text-xs font-bold text-[#172B4D]"
                >
                  Call
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Reassigned mission dispatch notice sent to ${vol.name}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Dispatch Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
