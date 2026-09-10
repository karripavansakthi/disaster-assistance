import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Professional vector SVG Pin Creator for mini map cards
const createCardPin = (colorHex, svgPath, hasPulse = false) => {
  return L.divIcon({
    className: 'custom-leaflet-svg-pin',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        ${hasPulse ? `
          <div style="
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            background: ${colorHex};
            opacity: 0.5;
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            pointer-events: none;
          "></div>
        ` : ''}
        <div style="
          position: relative;
          background-color: ${colorHex};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 3px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 2;
        ">
          ${svgPath}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
};

// People in distress SVG (Vector Users silhouette)
const victimIcon = createCardPin(
  '#F52D3D',
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>`,
  true
);

// Safe shelter SVG
const shelterIcon = createCardPin(
  '#20A464',
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>`
);

// Medical facility SVG
const medicalIcon = createCardPin(
  '#1268E8',
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="3"/><path d="M12 8v8M8 12h8"/>
  </svg>`
);

// Rescue unit SVG
const rescueIcon = createCardPin(
  '#0891b2',
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>`,
  true
);

function MapCenterSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMapCard({
  height = '320px',
  center = [17.3850, 78.4867],
  zoom = 13,
  showLegend = true,
  interactive = true,
  items = []
}) {
  // Default sample pins if none provided
  const markers = items.length > 0 ? items : [
    { id: 1, type: 'victim', name: 'REQ1024 - Flood Victims (4 Persons)', lat: 17.3850, lng: 78.4867, desc: 'Critical evacuation required · 4 People' },
    { id: 2, type: 'victim', name: 'REQ1023 - Medical Alert (2 Persons)', lat: 17.3912, lng: 78.4912, desc: 'Diabetic medication required' },
    { id: 3, type: 'shelter', name: 'Safe Haven Relief Center', lat: 17.3885, lng: 78.4812, desc: '173 beds available · Meals provided' },
    { id: 4, type: 'shelter', name: 'Green Valley Shelter', lat: 17.3992, lng: 78.4735, desc: '180 beds available · Full power backup' },
    { id: 5, type: 'medical', name: 'District Medical Camp', lat: 17.3942, lng: 78.4891, desc: 'Doctors, Triage & First Aid active' },
    { id: 6, type: 'rescue', name: 'Rescue Team Bravo Unit', lat: 17.3789, lng: 78.4721, desc: 'En route to Ward 7 sector' },
  ];

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#E4EAF2] dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 isolate z-0" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <MapCenterSync center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m) => {
          let icon = victimIcon;
          if (m.type === 'shelter') icon = shelterIcon;
          else if (m.type === 'medical') icon = medicalIcon;
          else if (m.type === 'rescue') icon = rescueIcon;

          const lat = m.lat || m.location?.lat;
          const lng = m.lng || m.location?.lng;
          if (!lat || !lng) return null;

          return (
            <Marker key={m.id || `${lat}-${lng}`} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="p-1.5 text-xs font-sans min-w-[170px]">
                  <div className="font-extrabold text-[#172B4D] mb-0.5">{m.name}</div>
                  <div className="text-slate-500 text-[11px]">{m.desc || m.address || 'Active coordinate'}</div>
                  {m.type === 'victim' && (
                    <div className="mt-1.5 inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[9px]">
                      🚨 People in Distress
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay matching reference image */}
      {showLegend && (
        <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-[#0d1726]/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#E4EAF2] dark:border-slate-800 shadow-md z-[1000] text-[10px] font-semibold space-y-1.5 text-slate-700 dark:text-slate-300 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F52D3D] ring-2 ring-red-200 animate-pulse"></span>
            <span>People in Distress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20A464] ring-2 ring-emerald-200"></span>
            <span>Shelters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1268E8] ring-2 ring-blue-200"></span>
            <span>Medical Camp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0891b2] ring-2 ring-cyan-200"></span>
            <span>Rescue Units</span>
          </div>
        </div>
      )}
    </div>
  );
}
