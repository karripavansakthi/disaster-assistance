import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import { MapPin, Layers, Filter } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Layer color definitions
const LAYER_COLORS = {
  sos: '#ff3b3b',
  shelters: '#10b981',
  hospitals: '#06b6d4',
  rescueTeams: '#f59e0b',
  resources: '#a855f7',
  incidents: '#6b7280',
};

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makeCircleIcon = (color, size = 14) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 8px ${color}80;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const makePulseIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="position:relative;width:18px;height:18px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.3;animation:ripple 2s infinite;"></div>
      <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:2px solid white;"></div>
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const LAYERS = [
  { key: 'sos', label: 'Active SOS', color: LAYER_COLORS.sos, shape: 'pulse' },
  { key: 'shelters', label: 'Safe Shelters', color: LAYER_COLORS.shelters, shape: 'circle' },
  { key: 'hospitals', label: 'Hospitals', color: LAYER_COLORS.hospitals, shape: 'circle' },
  { key: 'rescueTeams', label: 'Rescue Teams', color: LAYER_COLORS.rescueTeams, shape: 'circle' },
  { key: 'resources', label: 'Warehouses', color: LAYER_COLORS.resources, shape: 'circle' },
  { key: 'incidents', label: 'Incidents', color: LAYER_COLORS.incidents, shape: 'circle' },
];

export default function LiveMapPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroups = useRef({});
  const [activeLayers, setActiveLayers] = useState({ sos: true, shelters: true, hospitals: true, rescueTeams: true, resources: false, incidents: false });
  const [loading, setLoading] = useState(true);
  const [markerCounts, setMarkerCounts] = useState({});

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [17.7231, 83.3012],
      zoom: 10,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstance.current = map;

    // Create layer groups
    LAYERS.forEach(({ key }) => {
      layerGroups.current[key] = L.layerGroup().addTo(map);
    });

    loadAllData(map);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const loadAllData = async (map) => {
    try {
      const [sosRes, sheltersRes, hospitalsRes, teamsRes, resourcesRes, incidentsRes] = await Promise.all([
        axios.get(`${API}/api/emergency?limit=100`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/shelters`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/medical/hospitals`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/rescue-teams`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/resources`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/incidents`).catch(() => ({ data: { data: [] } })),
      ]);

      const counts = {};

      // SOS markers
      const sosList = sosRes.data?.data || [];
      counts.sos = sosList.length;
      sosList.forEach((s) => {
        const lat = s.location?.coordinates?.lat;
        const lng = s.location?.coordinates?.lng;
        if (!lat || !lng) return;
        const marker = L.marker([lat, lng], { icon: makePulseIcon(LAYER_COLORS.sos) });
        marker.bindPopup(`
          <div style="min-width:200px;">
            <strong style="color:#ff3b3b;font-size:0.85rem;">${s.sosId || 'SOS'}</strong>
            <div style="margin:6px 0;font-size:0.8rem;">${s.location?.address || 'Unknown'}</div>
            <div style="display:flex;gap:6px;align-items:center;font-size:0.75rem;">
              <span style="background:rgba(255,59,59,0.15);color:#ff6b6b;padding:2px 6px;border-radius:4px;text-transform:uppercase;font-weight:700;">${s.severity}</span>
              <span>Score: <strong>${s.priorityScore}/100</strong></span>
            </div>
            <div style="font-size:0.75rem;margin-top:4px;">👥 ${s.peopleCount} people · ${s.status}</div>
          </div>
        `);
        marker.addTo(layerGroups.current.sos);
      });

      // Shelter markers
      const shelterList = sheltersRes.data?.data || [];
      counts.shelters = shelterList.length;
      shelterList.forEach((sh) => {
        const lat = sh.location?.lat;
        const lng = sh.location?.lng;
        if (!lat || !lng) return;
        const icon = makeCircleIcon(sh.status === 'full' ? LAYER_COLORS.sos : LAYER_COLORS.shelters);
        const marker = L.marker([lat, lng], { icon });
        marker.bindPopup(`
          <div style="min-width:200px;">
            <strong style="color:#10b981;font-size:0.85rem;">🏠 ${sh.name}</strong>
            <div style="font-size:0.75rem;margin:4px 0;color:#94a3b8;">${sh.address}</div>
            <div style="font-size:0.78rem;margin-top:6px;">
              <div>🛏 Available Beds: <strong>${(sh.totalCapacity - sh.currentOccupancy).toLocaleString()}</strong></div>
              <div>🍚 Meals: <strong>${sh.mealsAvailable?.toLocaleString() || 'N/A'}</strong></div>
              <div>💧 Water Bottles: <strong>${sh.waterBottles?.toLocaleString() || 'N/A'}</strong></div>
              <div>🚑 Ambulances: <strong>${sh.ambulancesCount || 0}</strong></div>
              <div style="margin-top:4px;">Status: <span style="font-weight:700;color:${sh.status === 'open' ? '#10b981' : sh.status === 'limited' ? '#f59e0b' : '#ff3b3b'}">${sh.status?.toUpperCase()}</span></div>
            </div>
          </div>
        `);
        marker.addTo(layerGroups.current.shelters);
      });

      // Hospital markers
      const hospitalList = hospitalsRes.data?.data || [];
      counts.hospitals = hospitalList.length;
      hospitalList.forEach((h) => {
        const lat = h.location?.lat;
        const lng = h.location?.lng;
        if (!lat || !lng) return;
        const icon = makeCircleIcon(h.status === 'Critical' ? LAYER_COLORS.sos : LAYER_COLORS.hospitals);
        const marker = L.marker([lat, lng], { icon });
        marker.bindPopup(`
          <div style="min-width:200px;">
            <strong style="color:#06b6d4;font-size:0.85rem;">🏥 ${h.name}</strong>
            <div style="font-size:0.75rem;color:#94a3b8;margin:4px 0;">${h.address}</div>
            <div style="font-size:0.78rem;margin-top:6px;">
              <div>👨‍⚕️ Doctors: <strong>${h.doctorsCount}</strong> · Nurses: <strong>${h.nursesCount}</strong></div>
              <div>🛏 Available Beds: <strong>${h.availableBeds}</strong> / ICU: <strong>${h.icuBeds}</strong></div>
              <div>🚑 Ambulances: <strong>${h.ambulances}</strong></div>
              <div style="margin-top:4px;">Status: <span style="font-weight:700;color:${h.status === 'Available' ? '#10b981' : h.status === 'Limited' ? '#f59e0b' : '#ff3b3b'}">${h.status}</span></div>
            </div>
          </div>
        `);
        marker.addTo(layerGroups.current.hospitals);
      });

      // Rescue team markers
      const teamList = teamsRes.data?.data || [];
      counts.rescueTeams = teamList.length;
      teamList.forEach((t) => {
        const lat = t.currentLocation?.lat;
        const lng = t.currentLocation?.lng;
        if (!lat || !lng) return;
        const icon = makeCircleIcon(t.status === 'Available' ? LAYER_COLORS.rescueTeams : t.status === 'En Route' ? LAYER_COLORS.sos : LAYER_COLORS.resources);
        const marker = L.marker([lat, lng], { icon });
        marker.bindPopup(`
          <div style="min-width:200px;">
            <strong style="color:#f59e0b;font-size:0.85rem;">🚑 ${t.teamId}</strong>
            <div style="font-size:0.78rem;margin-top:6px;">
              <div>👤 Leader: <strong>${t.leaderName}</strong></div>
              <div>👥 Rescuers: <strong>${t.rescuersCount}</strong></div>
              <div>📋 ${t.specialization}</div>
              <div>📍 ${t.currentLocation?.name || 'Unknown'}</div>
              <div style="margin-top:4px;">Status: <span style="font-weight:700;color:${t.status === 'Available' ? '#10b981' : '#f59e0b'}">${t.status}</span></div>
              ${t.etaMinutes > 0 ? `<div>⏱ ETA: <strong>${t.etaMinutes} min</strong></div>` : ''}
            </div>
          </div>
        `);
        marker.addTo(layerGroups.current.rescueTeams);
      });

      // Warehouse markers
      const resourceList = resourcesRes.data?.data || [];
      const warehouses = {};
      resourceList.forEach((r) => {
        const key = r.warehouseName;
        if (!warehouses[key]) {
          warehouses[key] = { name: key, lat: r.warehouseLocation?.lat, lng: r.warehouseLocation?.lng, items: [] };
        }
        warehouses[key].items.push(`${r.itemName}: ${r.availableQuantity.toLocaleString()} ${r.unit}`);
      });
      counts.resources = Object.keys(warehouses).length;
      Object.values(warehouses).forEach((w) => {
        if (!w.lat || !w.lng) return;
        const icon = makeCircleIcon(LAYER_COLORS.resources);
        const marker = L.marker([w.lat, w.lng], { icon });
        marker.bindPopup(`
          <div style="min-width:200px;">
            <strong style="color:#a855f7;font-size:0.85rem;">📦 ${w.name}</strong>
            <div style="font-size:0.78rem;margin-top:6px;">
              ${w.items.map((i) => `<div>• ${i}</div>`).join('')}
            </div>
          </div>
        `);
        marker.addTo(layerGroups.current.resources);
      });

      // Incident markers
      const incidentList = incidentsRes.data?.data || [];
      counts.incidents = incidentList.length;
      incidentList.forEach((inc) => {
        const lat = inc.location?.lat;
        const lng = inc.location?.lng;
        if (!lat || !lng) return;
        const icon = makeCircleIcon(LAYER_COLORS.incidents, 12);
        const marker = L.marker([lat, lng], { icon });
        marker.bindPopup(`
          <div style="min-width:180px;">
            <strong style="color:#94a3b8;font-size:0.85rem;">⚠️ ${inc.category}</strong>
            <div style="font-size:0.78rem;margin-top:6px;">
              <div>${inc.description}</div>
              <div style="margin-top:4px;">📍 ${inc.location?.address || ''}</div>
              <div>Severity: <strong style="color:${inc.severity === 'Critical' ? '#ff3b3b' : '#f59e0b'}">${inc.severity}</strong></div>
              <div>Status: ${inc.status}</div>
            </div>
          </div>
        `);
        marker.addTo(layerGroups.current.incidents);
      });

      setMarkerCounts(counts);
    } catch (err) {
      console.error('Map data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLayer = (key) => {
    setActiveLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const group = layerGroups.current[key];
      const map = mapInstance.current;
      if (group && map) {
        if (next[key]) map.addLayer(group);
        else map.removeLayer(group);
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 100px)' }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MapPin size={18} color="var(--cyan-medical)" />
          <h2 style={{ fontWeight: 700 }}>Live Disaster Map — Visakhapatnam / Kakinada / East Godavari</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <Layers size={13} /> OpenStreetMap · No API key required
        </div>
      </div>

      {/* Layer Toggles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
        {LAYERS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: activeLayers[key] ? `${color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeLayers[key] ? color : 'var(--border-subtle)'}`,
              borderRadius: 8, padding: '0.4rem 0.75rem',
              color: activeLayers[key] ? color : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: activeLayers[key] ? color : 'var(--border-subtle)' }} />
            {label}
            {markerCounts[key] !== undefined && (
              <span style={{ fontWeight: 400, opacity: 0.7 }}>({markerCounts[key]})</span>
            )}
          </button>
        ))}
        {loading && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Loading markers…</span>}
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ flex: 1, borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', minHeight: 400 }} />

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flexShrink: 0 }}>
        {[
          { color: LAYER_COLORS.sos, label: '🔴 Active SOS (pulsing)' },
          { color: LAYER_COLORS.shelters, label: '🟢 Safe Shelters' },
          { color: LAYER_COLORS.hospitals, label: '🔵 Hospitals' },
          { color: LAYER_COLORS.rescueTeams, label: '🟠 Rescue Teams' },
          { color: LAYER_COLORS.resources, label: '🟣 Relief Warehouses' },
          { color: LAYER_COLORS.incidents, label: '⚫ Incidents/Blocked Roads' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
