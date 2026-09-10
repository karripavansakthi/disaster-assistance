import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getUsers } from '../data/mockData';
import { Search, Filter, UserCheck, Shield, User } from 'lucide-react';

export default function AdminUsers() {
  const users = getUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout
      title="Manage Users"
      subtitle="Registry of citizens, registered victims, and platform accounts"
      roleOverride="admin"
    >
      <div className="space-y-5 max-w-5xl mx-auto">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E4EAF2] bg-white text-xs text-[#172B4D] focus:outline-none focus:border-[#1268E8]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#E4EAF2] bg-white text-xs font-bold text-[#172B4D]"
            >
              <option value="All">All Roles</option>
              <option value="victim">Victim / Citizen</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4EAF2] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#172B4D]">
                      <div>{u.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                      {u.role}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {u.phone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.location}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {u.registeredDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.status} />
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
