import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getResources, saveResources } from '../data/mockData';
import { Plus, Layers, Package, X } from 'lucide-react';

export default function AdminResources() {
  const [resources, setResources] = useState(getResources());
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food');
  const [items, setItems] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const newRes = {
      id: `res-${Date.now()}`,
      name,
      category,
      items,
      distance: '1.5 km',
      status: 'Available',
      timings: '24 Hours',
      provider: 'Disaster Relief Mission',
      lat: 17.3850,
      lng: 78.4867,
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80'
    };
    const updated = [...resources, newRes];
    setResources(updated);
    saveResources(updated);
    setShowAddModal(false);
    setName('');
    setItems('');
  };

  return (
    <DashboardLayout
      title="Resource Inventory Management"
      subtitle="Track medical stockpile, food supply centers, water tankers, and aid logistics"
      roleOverride="admin"
    >
      <div className="space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-[#667085]">
            Registered Relief Points: <strong>{resources.length}</strong>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Resource Center
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#E4EAF2] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4EAF2] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Center Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stocked Items</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#172B4D]">{r.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{r.category}</td>
                  <td className="py-3.5 px-4 text-slate-600">{r.items}</td>
                  <td className="py-3.5 px-4 text-slate-500">{r.provider}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#172B4D]">Add Resource Depot</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Center Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ward 4 Emergency Food Bank"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                >
                  <option value="Food">Food</option>
                  <option value="Medical">Medical</option>
                  <option value="Water">Water</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Supplies</label>
                <input
                  type="text"
                  required
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="e.g. Rice, clean water containers, baby food"
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
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
