import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Settings, Save, Check } from 'lucide-react';

export default function AdminSettings() {
  const [helpline, setHelpline] = useState('112 / 1070');
  const [smsGateway, setSmsGateway] = useState('Govt-NDMA-AlertGateway');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="System Configuration"
      subtitle="Configure emergency gateways, dispatch rules, and situational protocols"
      roleOverride="admin"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#E4EAF2] p-6 shadow-sm">
        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            System parameters updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">State Emergency Helpline Toll-Free</label>
            <input
              type="text"
              value={helpline}
              onChange={(e) => setHelpline(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">SMS Emergency Broadcast Sender ID</label>
            <input
              type="text"
              value={smsGateway}
              onChange={(e) => setSmsGateway(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="w-4 h-4 rounded text-[#1268E8]"
              />
              <div>
                <div className="font-bold text-slate-800">Automated Triage Routing</div>
                <div className="text-[11px] text-slate-500">Automatically notify nearest certified volunteer squad for critical incidents within 3 km</div>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1268E8] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
