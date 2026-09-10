import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getAlerts, saveAlerts } from '../data/mockData';
import { Radio, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState(getAlerts());
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('red');
  const [message, setMessage] = useState('');
  const [authority, setAuthority] = useState('State Emergency Operations Center');
  const [actionRequired, setActionRequired] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    const newAlert = {
      id: `alert-${Date.now()}`,
      severity,
      type: severity === 'red' ? 'critical' : severity === 'orange' ? 'warning' : 'info',
      title,
      message,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString(),
      authority,
      actionRequired
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveAlerts(updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    setTitle('');
    setMessage('');
    setActionRequired('');
  };

  const handleDelete = (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  };

  return (
    <DashboardLayout
      title="Alert Broadcast Control"
      subtitle="Publish instant emergency warnings and public safety bulletins across citizen portals"
      roleOverride="admin"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Create Broadcast Form */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-5 sm:p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#172B4D] mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#F52D3D]" />
            <span>Broadcast New Official Alert</span>
          </h3>

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Alert dispatched to live network!
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alert Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flash Flood Advisory"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                >
                  <option value="red">Red (Critical / Immediate Action)</option>
                  <option value="orange">Orange (Severe Weather / Warning)</option>
                  <option value="blue">Blue (Relief Update / Logistics)</option>
                  <option value="green">Green (All Clear)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alert Message & Instructions</label>
              <textarea
                rows={2}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Details on affected sectors, water levels, evacuation routes..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recommended Action</label>
                <input
                  type="text"
                  value={actionRequired}
                  onChange={(e) => setActionRequired(e.target.value)}
                  placeholder="e.g. Move to higher ground"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#F52D3D] hover:bg-red-700 text-white font-bold transition-colors"
            >
              Publish Urgent Alert
            </button>
          </form>
        </div>

        {/* Existing Alerts List */}
        <div className="bg-white rounded-xl border border-[#E4EAF2] p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#172B4D] mb-4">Active Broadcast Feed</h3>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-lg border border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#172B4D]">{a.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      a.severity === 'red' ? 'bg-red-100 text-red-700' :
                      a.severity === 'orange' ? 'bg-orange-100 text-orange-700' :
                      a.severity === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-slate-400 text-xs">• {a.timeAgo}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{a.message}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Remove alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
