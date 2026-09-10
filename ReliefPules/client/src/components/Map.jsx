import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Professional SVG Vector Pin Creator with People & Entity Badges
const createSvgPin = ({
  svgIcon,
  bgColor = '#F52D3D',
  glowColor = 'rgba(245, 45, 61, 0.45)',
  peopleCount,
  hasPulse = false,
  badgeText
}) => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
        ${hasPulse ? `
          <div style="
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: ${glowColor};
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            pointer-events: none;
          "></div>
        ` : ''}
        
        <!-- Main Marker Pin -->
        <div style="
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${bgColor};
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 14px ${glowColor}, 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          z-index: 2;
          transition: transform 0.2s ease;
        ">
          ${svgIcon}
          
          <!-- People Count / Metric Badge -->
          ${peopleCount !== undefined ? `
            <span style="
              position: absolute;
              top: -6px;
              right: -6px;
              background: #ffffff;
              color: ${bgColor};
              font-weight: 800;
              font-size: 10px;
              line-height: 1;
              padding: 2px 5px;
              border-radius: 9999px;
              border: 1.5px solid ${bgColor};
              box-shadow: 0 1px 4px rgba(0,0,0,0.25);
            ">${peopleCount}</span>
          ` : badgeText ? `
            <span style="
              position: absolute;
              top: -6px;
              right: -6px;
              background: #ffffff;
              color: ${bgColor};
              font-weight: 800;
              font-size: 9px;
              line-height: 1;
              padding: 2px 4px;
              border-radius: 9999px;
              border: 1.5px solid ${bgColor};
              box-shadow: 0 1px 4px rgba(0,0,0,0.25);
            ">${badgeText}</span>
          ` : ''}
        </div>
      </div>
    `,
    className: 'custom-professional-pin',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
  });
};

// SVG Icon Templates
const SVGS = {
  // People in Distress Icon (Users Silhouette)
  people: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `,
  // Verified Shelter Icon
  shelter: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  `,
  // Rescue & Medical Ambulance Icon
  rescue: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="16" height="16" x="4" y="4" rx="3"/>
      <path d="M12 8v8"/>
      <path d="M8 12h8"/>
    </svg>
  `,
  // Volunteer Helping Hand Icon
  volunteer: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  `,
  // GPS Target / Live Location Icon
  userLocation: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,
};

// Factory functions for specialized icons
const createPeopleMarker = (peopleCount) =>
  createSvgPin({
    svgIcon: SVGS.people,
    bgColor: '#F52D3D',
    glowColor: 'rgba(245, 45, 61, 0.45)',
    peopleCount: peopleCount || 1,
    hasPulse: true
  });

const shelterIcon = createSvgPin({
  svgIcon: SVGS.shelter,
  bgColor: '#20A464',
  glowColor: 'rgba(32, 164, 100, 0.4)',
  hasPulse: false
});

const rescueIcon = createSvgPin({
  svgIcon: SVGS.rescue,
  bgColor: '#1268E8',
  glowColor: 'rgba(18, 104, 232, 0.4)',
  hasPulse: true
});

const volunteerIcon = createSvgPin({
  svgIcon: SVGS.volunteer,
  bgColor: '#FF8A1F',
  glowColor: 'rgba(255, 138, 31, 0.4)',
  hasPulse: false
});

const userLocationIcon = createSvgPin({
  svgIcon: SVGS.userLocation,
  bgColor: '#8b5cf6',
  glowColor: 'rgba(139, 92, 246, 0.45)',
  hasPulse: true
});

function CenterView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
    // Ensures Leaflet recalculates dimensions properly inside cards/tabs
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

export default function Map({
  emergencies = [],
  shelters = [],
  rescueTeams = [],
  volunteers = [],
  userLocation,
  center = [17.3850, 78.4867],
  zoom = 13,
  height = '480px',
  onSelectMarker,
}) {
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : center;

  return (
    <div
      style={{ height, width: '100%' }}
      className="relative rounded-2xl overflow-hidden border border-[#E4EAF2] dark:border-slate-800 shadow-md z-0 isolate"
    >
      {/* Professional Legend Badge with Vector SVGs */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 dark:bg-[#0d1726]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-800 shadow-lg text-xs flex flex-wrap items-center gap-3.5 select-none">
        <span className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="w-3.5 h-3.5 inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </span>
          <span>People in Distress</span>
        </span>

        <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span className="w-3.5 h-3.5 inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </span>
          <span>Verified Shelters</span>
        </span>

        <span className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span className="w-3.5 h-3.5 inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><rect width="16" height="16" x="4" y="4" rx="3"/><path d="M12 8v8M8 12h8"/></svg>
          </span>
          <span>Rescue Teams</span>
        </span>

        <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          <span className="w-3.5 h-3.5 inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </span>
          <span>Volunteers</span>
        </span>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <CenterView center={mapCenter} zoom={zoom} />
        
        {/* OpenStreetMap CartoDB Voyager Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* User Location Marker with Range Circle */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
              <Popup>
                <div className="p-2 text-xs font-sans">
                  <div className="flex items-center gap-1.5 text-purple-600 font-extrabold mb-1">
                    <span>🎯 Your Current Location</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={2000}
              pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.1 }}
            />
          </>
        )}

        {/* Emergencies / People in Distress (🔴) */}
        {emergencies.map((em, idx) => {
          const lat = em.lat || em.location?.coordinates?.lat || em.location?.lat;
          const lng = em.lng || em.location?.coordinates?.lng || em.location?.lng;
          if (!lat || !lng) return null;

          const peopleCount = em.peopleCount || em.peopleAffected || 1;
          const markerIcon = createPeopleMarker(peopleCount);

          return (
            <Marker
              key={em._id || em.sosId || em.id || idx}
              position={[lat, lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelectMarker?.({ type: 'emergency', data: em }),
              }}
            >
              <Popup>
                <div className="p-2.5 text-xs font-sans min-w-[220px]">
                  {/* Emergency Header */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-red-600 text-sm">
                      {em.sosId || em.id || '#REQ-EMERGENCY'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold uppercase text-[10px]">
                      {em.severity || em.priority || 'Critical'}
                    </span>
                  </div>

                  {/* People In Need Highlight */}
                  <div className="bg-red-50/80 border border-red-200/60 rounded-lg p-1.5 mb-2 flex items-center justify-between text-red-900 font-bold">
                    <span>👥 People in Distress:</span>
                    <span className="text-red-700 bg-white px-2 py-0.5 rounded-md border border-red-200">
                      {peopleCount} {peopleCount === 1 ? 'Person' : 'Persons'}
                    </span>
                  </div>

                  <div className="font-bold text-slate-800 mb-0.5">
                    Type: <span className="font-semibold text-slate-700">{em.disasterType || em.type || 'Flood'}</span>
                  </div>

                  <p className="text-slate-600 text-[11px] mb-2 line-clamp-2">
                    {em.description || em.details || em.location?.address || em.location || 'Immediate rescue needed'}
                  </p>

                  <div className="text-[10px] text-slate-500 font-medium mb-2.5 flex items-center justify-between">
                    <span>Status: <strong className="text-slate-800 font-bold">{em.status || 'Pending'}</strong></span>
                    {em.timeAgo && <span>{em.timeAgo}</span>}
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-2 px-3 rounded-lg bg-[#F52D3D] hover:bg-[#dc2030] text-white font-bold text-xs no-underline shadow-sm transition-colors"
                  >
                    Dispatch / Navigate to Victim 🚑
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelters (🏠) */}
        {shelters.map((sh, idx) => {
          const lat = sh.lat || sh.location?.lat || sh.location?.coordinates?.lat;
          const lng = sh.lng || sh.location?.lng || sh.location?.coordinates?.lng;
          if (!lat || !lng) return null;

          const totalCap = sh.capacity || sh.totalCapacity || 500;
          const available = sh.available !== undefined ? sh.available : Math.max(0, totalCap - (sh.occupied || sh.currentOccupancy || 0));

          return (
            <Marker
              key={sh._id || sh.id || idx}
              position={[lat, lng]}
              icon={shelterIcon}
              eventHandlers={{
                click: () => onSelectMarker?.({ type: 'shelter', data: sh }),
              }}
            >
              <Popup>
                <div className="p-2.5 text-xs font-sans min-w-[220px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {sh.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Open
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] mb-2">{sh.address}</p>

                  <div className="grid grid-cols-2 gap-1.5 bg-emerald-50/70 border border-emerald-100 p-2 rounded-lg mb-2.5 text-[11px]">
                    <div>Capacity: <strong className="text-slate-800">{totalCap}</strong></div>
                    <div>Available: <strong className="text-emerald-600">{available} Beds</strong></div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-2 px-3 rounded-lg bg-[#20A464] hover:bg-emerald-700 text-white font-bold text-xs no-underline shadow-sm transition-colors"
                  >
                    Get Directions to Shelter 📍
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Rescue Teams (🚑) */}
        {rescueTeams.map((team, idx) => {
          const lat = team.lat || team.currentLocation?.lat || team.location?.lat;
          const lng = team.lng || team.currentLocation?.lng || team.location?.lng;
          if (!lat || !lng) return null;

          return (
            <Marker key={team._id || team.teamId || team.id || idx} position={[lat, lng]} icon={rescueIcon}>
              <Popup>
                <div className="p-2 text-xs font-sans min-w-[190px]">
                  <div className="font-extrabold text-blue-700 text-xs mb-1">
                    {team.teamId || team.name || 'Rescue Unit'}
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">
                    Leader: <strong>{team.leaderName || team.leader || 'Commander'}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-1.5">
                    Status: <span className="font-bold text-blue-600">{team.status || 'Active'}</span>
                  </div>
                  {team.contactPhone && (
                    <a
                      href={`tel:${team.contactPhone}`}
                      className="text-[11px] text-[#1268E8] font-bold hover:underline block"
                    >
                      📞 Call: {team.contactPhone}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Volunteers (📍) */}
        {volunteers.map((vol, idx) => {
          const lat = vol.lat || vol.location?.coordinates?.lat || vol.location?.lat;
          const lng = vol.lng || vol.location?.coordinates?.lng || vol.location?.lng;
          if (!lat || !lng) return null;

          return (
            <Marker key={vol._id || vol.id || idx} position={[lat, lng]} icon={volunteerIcon}>
              <Popup>
                <div className="p-2 text-xs font-sans min-w-[170px]">
                  <div className="font-extrabold text-amber-700 text-xs mb-1">
                    Volunteer: {vol.name}
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">
                    {vol.phone || 'Ready for dispatch'}
                  </div>
                  <div className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Community Responder
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
