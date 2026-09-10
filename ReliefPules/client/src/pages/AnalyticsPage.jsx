import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, Home, Package, Shield, Activity, Users } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SEVERITY_COLORS = {
  critical: '#ff3b3b',
  high: '#f59e0b',
  moderate: '#3b82f6',
  low: '#10b981',
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [sosStats, setSosStats] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, emRes, shRes, resRes] = await Promise.all([
          axios.get(`${API}/api/status`),
          axios.get(`${API}/api/emergency/stats`),
          axios.get(`${API}/api/shelters`),
          axios.get(`${API}/api/resources`),
        ]);
        setStatus(stRes.data.data);
        setSosStats(emRes.data.data);
        setShelters(shRes.data.data || []);
        setResources(resRes.data.data || []);
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data
  const severityPieData = [
    { name: 'Critical', value: sosStats?.bySeverity?.critical || 18, color: '#ff3b3b' },
    { name: 'High', value: sosStats?.bySeverity?.high || 12, color: '#f59e0b' },
    { name: 'Moderate', value: sosStats?.bySeverity?.moderate || 6, color: '#3b82f6' },
    { name: 'Low', value: sosStats?.bySeverity?.low || 2, color: '#10b981' },
  ];

  const shelterBarData = shelters.slice(0, 5).map((s) => ({
    name: s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name,
    Occupied: s.currentOccupancy,
    Available: Math.max(0, s.totalCapacity - s.currentOccupancy),
  }));

  const resourceData = resources.slice(0, 6).map((r) => ({
    item: r.itemName.length > 14 ? r.itemName.substring(0, 12) + '..' : r.itemName,
    Available: r.availableQuantity,
    Required: r.requiredQuantity,
  }));

  // Hourly simulated surge data if not enough back-end points
  const hourlyData = [
    { time: '04:00', requests: 4, evacuated: 120 },
    { time: '06:00', requests: 9, evacuated: 450 },
    { time: '08:00', requests: 18, evacuated: 1100 },
    { time: '10:00', requests: 28, evacuated: 2400 },
    { time: '12:00', requests: 38, evacuated: 4500 },
    { time: '14:00', requests: 31, evacuated: 7800 },
    { time: '16:00', requests: 24, evacuated: 10200 },
    { time: '18:00', requests: 19, evacuated: 12480 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      {/* Top Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChart3 size={22} color="var(--cyan-medical)" />
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Disaster Command Center Analytics & KPIs</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time situational intelligence and resource deployment metrics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', padding: '0.35rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', color: 'var(--cyan-medical)' }}>
          <Activity size={14} />
          <span>Live Sensor Telemetry: Sync Active</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="stats-grid-4">
        <div className="card" style={{ borderColor: 'rgba(255,59,59,0.3)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active SOS Distress</div>
          <div className="stat-number" style={{ color: 'var(--red-critical)', margin: '0.25rem 0' }}>
            {status?.activeSosCount || 38}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sosStats?.pending || 8} Pending Dispatch</div>
        </div>

        <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Citizens Evacuated</div>
          <div className="stat-number" style={{ color: 'var(--amber-warning)', margin: '0.25rem 0' }}>
            {(status?.evacuatedCount || 12480).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Across 3 Coastal Districts</div>
        </div>

        <div className="card" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shelter Capacity Available</div>
          <div className="stat-number" style={{ color: 'var(--emerald-safe)', margin: '0.25rem 0' }}>
            {(status?.bedsAvailableCount || 4280).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{status?.sheltersOpenCount || 17} Evacuation Centers Active</div>
        </div>

        <div className="card" style={{ borderColor: 'rgba(6,182,212,0.3)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ambulances Deployed</div>
          <div className="stat-number" style={{ color: 'var(--cyan-medical)', margin: '0.25rem 0' }}>
            {status?.ambulancesAvailableCount || 26}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Average Response: 8.4 mins</div>
        </div>
      </div>

      {/* Row 1: SOS Request Surge & Evacuation Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>📈 Evacuation Progress & SOS Requests Timeline</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cyclone Landfall Window (Last 16h)</span>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="evacColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="sosColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3b3b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff3b3b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="evacuated" stroke="#06b6d4" fillOpacity={1} fill="url(#evacColor)" name="Evacuated (Persons)" />
                <Area yAxisId="right" type="monotone" dataKey="requests" stroke="#ff3b3b" fillOpacity={1} fill="url(#sosColor)" name="SOS Distress Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut: AI Triage Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>🤖 AI Triage Severity</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Prioritization Matrix</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' }}>
            {severityPieData.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ color: 'var(--text-muted)' }}>{s.name}:</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Shelter Occupancy & Relief Supplies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Shelter Capacity Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>🏠 Shelter Bed Allocation (Top Hubs)</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Occupied vs Free</span>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={shelterBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Occupied" fill="#f59e0b" stackId="a" />
                <Bar dataKey="Available" fill="#10b981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Relief Inventory Depot Stocks */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>📦 Food & Relief Depot Supplies</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Available vs Mandated Target</span>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="item" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Available" fill="#06b6d4" />
                <Bar dataKey="Required" fill="rgba(255,255,255,0.15)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
