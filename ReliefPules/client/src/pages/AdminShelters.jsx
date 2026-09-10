import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getShelters, saveShelters } from '../data/mockData';
import { Plus, Home, MapPin, X, Check } from 'lucide-react';

export default function AdminShelters() {
  const [shelters, setShelters] = useState(getShelters());
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(300);
  const [address, setAddress] = useState('');

  const handleAddShelter = (e) => {
    e.preventDefault();
    const newShelter = {
      id: `shelter-${Date.now()}`,
      name,
      capacity: Number(capacity),
      occupied: 0,
      available: Number(capacity),
      address,
      distance: '3.0 km',
      lat: 17.3850 + (Math.random() - 0.5) * 0.02,
      lng: 78.4867 + (Math.random() - 0.5) * 0.02,
      facilities: ['Food', 'Water', 'Medical', 'Beds'],
      contactPhone: '+91 40 2345 9999',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80',
      type: 'Municipal Shelter'
    };

    const updated = [...shelters, newShelter];
    setShelters(updated);
    saveShelters(updated);
    setShowAddModal(false);
    setName('');
    setAddress('');
  };

  return (
    <DashboardLayout
      title="Shelter Management"
      subtitle="Monitor shelter occupancy, capacity distribution, and add new emergency facilities"
      roleOverride="admin"
    >
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-[#667085]">
            Total Active Centers: <strong>{shelters.length}</strong>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Shelter
          </button>
        </div>

        {/* Shelters Table */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4EAF2] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4">Shelter Facility</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Occupied</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Occupancy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {shelters.map((s) => {
                  const pct = Math.round((s.occupied / s.capacity) * 100);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#172B4D]">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {s.address}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {s.capacity}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-amber-600">
                        {s.occupied}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#20A464]">
                        {s.available}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${pct > 80 ? 'bg-red-500' : 'bg-[#20A464]'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Shelter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#172B4D]">Add Emergency Shelter</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddShelter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shelter Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. East District High School"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Bed Capacity</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address / Sector</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street and Ward details"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1268E8] text-white font-bold rounded-lg"
                >
                  Save Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
