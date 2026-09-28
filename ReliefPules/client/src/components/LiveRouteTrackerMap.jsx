import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createSvgIcon = (colorHex, svgContent, isPulsing = false, size = 32) => {
  return L.divIcon({
    className: 'custom-leaflet-live-pin',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        ${
          isPulsing
            ? `<div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                background: ${colorHex};
                opacity: 0.45;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                pointer-events: none;
              "></div>`
            : ''
        }
        <div style="
          position: relative;
          background-color: ${colorHex};
          width: ${size - 4}px;
          height: ${size - 4}px;
          border-radius: 50%;
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 2;
        ">
          ${svgContent}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const victimPin = createSvgIcon(
  '#EF4444',
  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
  </svg>`,
  true,
  34
);

const rescueVehiclePin = createSvgIcon(
  '#2563EB',
  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/>
    <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
  </svg>`,
  true,
  36
);

const shelterPin = createSvgIcon(
  '#10B981',
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>`,
  false,
  28
);

function MapCenterSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveRouteTrackerMap({
  victimPos = [17.385, 78.4867],
  responderPos: initialResponderPos = [17.376, 78.474],
  shelterPos = [17.3885, 78.4812],
  victimName = 'Citizen in Distress',
  responderName = 'Rescue Team Alpha',
  shelterName = 'Safe Haven Relief Center',
  height = '340px',
  isMoving = true,
}) {
  // Safe position defaults
  const validVictim = [
    Number(victimPos[0]) || 17.385,
    Number(victimPos[1]) || 78.4867,
  ];
  const validShelter = [
    Number(shelterPos[0]) || 17.3885,
    Number(shelterPos[1]) || 78.4812,
  ];

  // Moving responder position state
  const [responderPos, setResponderPos] = useState([
    Number(initialResponderPos[0]) || 17.376,
    Number(initialResponderPos[1]) || 78.474,
  ]);

  // Live simulation: slowly nudge responder towards victim over time
  useEffect(() => {
    if (!isMoving) return;
    const interval = setInterval(() => {
      setResponderPos((prev) => {
        const dLat = validVictim[0] - prev[0];
        const dLng = validVictim[1] - prev[1];
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        // If very close, stop moving
        if (dist < 0.0008) return prev;

        // Move 2.5% closer every 2 seconds
        const step = 0.025;
        return [prev[0] + dLat * step, prev[1] + dLng * step];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMoving, validVictim[0], validVictim[1]]);

  // Midpoint for map center
  const centerLat = (validVictim[0] + responderPos[0]) / 2;
  const centerLng = (validVictim[1] + responderPos[1]) / 2;

  // Route path coordinates
  const polylineCoords = [
    responderPos,
    [
      responderPos[0] + (validVictim[0] - responderPos[0]) * 0.5 + 0.0015,
      responderPos[1] + (validVictim[1] - responderPos[1]) * 0.5 - 0.001,
    ],
    validVictim,
  ];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-[#E4EAF2] dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 isolate z-0"
      style={{ height }}
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapCenterSync center={[centerLat, centerLng]} zoom={14} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Live Route Polyline */}
        <Polyline
          positions={polylineCoords}
          pathOptions={{
            color: '#2563EB',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8',
          }}
        />

        {/* Victim Location Pin */}
        <Marker position={validVictim} icon={victimPin}>
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-red-600 block">🚨 Distress Location</strong>
              <span>{victimName}</span>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {validVictim[0].toFixed(4)}, {validVictim[1].toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Responder Location Pin */}
        <Marker position={responderPos} icon={rescueVehiclePin}>
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-blue-600 block">🚑 {responderName}</strong>
              <span>Live GPS: En Route to Target</span>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {responderPos[0].toFixed(4)}, {responderPos[1].toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Shelter Pin */}
        <Marker position={validShelter} icon={shelterPin}>
          <Popup>
            <div className="p-1 text-xs">
              <strong className="text-emerald-600 block">🏠 {shelterName}</strong>
              <span>Designated Evacuation Destination</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Live Telemetry Badge */}
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#0d1726]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md z-[1000] text-xs font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-extrabold text-slate-800 dark:text-slate-100">Live Satellite Telemetry</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            GPS Active
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
          <span>Target: <strong className="text-slate-700 dark:text-slate-200">{validVictim[0].toFixed(3)}, {validVictim[1].toFixed(3)}</strong></span>
          <span>•</span>
          <span>Unit Speed: <strong className="text-blue-600 dark:text-blue-400">42 km/h</strong></span>
        </div>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#0d1726]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm z-[1000] text-[10px] font-semibold flex items-center gap-3 text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Victim
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" /> Responder
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Shelter
        </span>
      </div>
    </div>
  );
}
