import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function AdminAnalytics() {
  const incidentData = [
    { name: 'Flood', count: 32 },
    { name: 'Medical', count: 18 },
    { name: 'Earthquake', count: 8 },
    { name: 'Fire', count: 4 },
    { name: 'Shelter', count: 14 }
  ];

  const responseTimeData = [
    { time: '06:00', minutes: 28 },
    { time: '08:00', minutes: 24 },
    { time: '10:00', minutes: 19 },
    { time: '12:00', minutes: 15 },
    { time: '14:00', minutes: 18 },
    { time: '16:00', minutes: 14 }
  ];

  const COLORS = ['#F52D3D', '#1268E8', '#FF8A1F', '#ef4444', '#20A464'];

  return (
    <DashboardLayout
      title="Disaster Management Analytics"
      subtitle="Response latency, incident distribution metrics, and live situational charts"
      roleOverride="admin"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E4EAF2] shadow-sm">
            <div className="text-xs text-[#667085] font-bold">Average Response Time</div>
            <div className="text-2xl font-black text-[#1268E8] mt-1">16.4 mins</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">↓ 22% faster than last cycle</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#E4EAF2] shadow-sm">
            <div className="text-xs text-[#667085] font-bold">Total Rescued Victims</div>
            <div className="text-2xl font-black text-[#20A464] mt-1">1,248</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">Across 14 operational sectors</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#E4EAF2] shadow-sm">
            <div className="text-xs text-[#667085] font-bold">Resolution Rate</div>
            <div className="text-2xl font-black text-purple-600 mt-1">89.2%</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">Assistance confirmed</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Type Bar Chart */}
          <div className="bg-white p-5 rounded-xl border border-[#E4EAF2] shadow-sm">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4">Incidents by Disaster Type</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1268E8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response Latency Line Chart */}
          <div className="bg-white p-5 rounded-xl border border-[#E4EAF2] shadow-sm">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4">Response Dispatch Latency (Minutes)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="minutes" stroke="#F52D3D" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
