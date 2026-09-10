import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getRequests, saveRequests } from '../data/mockData';
import { AlertTriangle, Filter, Search, CheckCircle, Shield } from 'lucide-react';

export default function AdminRequests() {
  const [requests, setRequests] = useState(getRequests());
  const [priorityFilter, setPriorityFilter] = useState('All');

  const handleStatusChange = (id, newStatus) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setRequests(updated);
    saveRequests(updated);
  };

  const handleAssignTeam = (id, teamName) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, assignedTeam: teamName, status: 'Assigned' } : r
    );
    setRequests(updated);
    saveRequests(updated);
  };

  const filtered = requests.filter(
    (r) => priorityFilter === 'All' || r.priority.toLowerCase() === priorityFilter.toLowerCase()
  );

  return (
    <DashboardLayout
      title="Emergency Requests Management"
      subtitle="Triage, assign rescue squads, and resolve citizen SOS calls in real-time"
      roleOverride="admin"
    >
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-[#667085]">
            Total Emergency Requests: <strong>{requests.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Filter Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E4EAF2] bg-white text-xs font-bold text-[#172B4D]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4EAF2] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Incident</th>
                  <th className="py-3 px-4">Victim</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172B4D]">{req.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{req.type}</div>
                      <div className="text-[11px] text-slate-400">{req.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{req.victimName}</div>
                      <div className="text-[11px] text-slate-400">{req.peopleAffected} persons</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.assignedTeam}
                        onChange={(e) => handleAssignTeam(req.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1"
                      >
                        <option value="-">Select Squad...</option>
                        <option value="Rescue Team A">Rescue Team A</option>
                        <option value="Rescue Team B">Rescue Team B</option>
                        <option value="Team C (Civil Def)">Team C (Civil Def)</option>
                        <option value="Medical Taskforce">Medical Taskforce</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(req.id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-50 text-[#20A464] border border-emerald-200 rounded font-bold hover:bg-emerald-100 transition-colors"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
