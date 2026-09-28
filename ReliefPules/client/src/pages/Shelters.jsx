import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import InteractiveMapCard from '../components/InteractiveMapCard';
import { getShelters } from '../data/mockData';
import {
  Search,
  Filter,
  MapPin,
  Utensils,
  Droplet,
  HeartPulse,
  Bed,
  Navigation,
  Eye,
  Check,
  X,
  Phone,
  Compass,
  Home
} from 'lucide-react';

// Real Haversine Distance Calculator (km)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Shelters() {
  const [allShelters, setAllShelters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const list = getShelters();
    setAllShelters(list);
  }, []);

  const handleDetectLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const uLat = pos.coords.latitude;
          const uLng = pos.coords.longitude;
          setUserLocation({ lat: uLat, lng: uLng });

          // Recalculate distances and sort
          const updated = allShelters.map((s) => {
            const dist = haversineDistance(uLat, uLng, s.lat || 17.3885, s.lng || 78.4812);
            return {
              ...s,
              distance: `${dist.toFixed(1)} km`,
              distanceNum: dist,
            };
          }).sort((a, b) => (a.distanceNum || 0) - (b.distanceNum || 0));

          setAllShelters(updated);
          setLocating(false);
          setShowMap(true);
        },
        () => {
          setLocating(false);
          alert('GPS location permission was denied. Using sector default.');
        }
      );
    } else {
      setLocating(false);
    }
  };

  const filteredShelters = allShelters.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacility =
      facilityFilter === 'All' || s.facilities.includes(facilityFilter);
    return matchesSearch && matchesFacility;
  });

  const shelterMapItems = allShelters.map((s) => ({
    id: s.id,
    type: 'shelter',
    name: `${s.name} (${s.available} beds free)`,
    lat: s.lat || 17.3885,
    lng: s.lng || 78.4812,
    desc: `${s.address} · Available: ${s.available}/${s.capacity} beds`,
  }));

  if (userLocation) {
    shelterMapItems.push({
      id: 'user-pin',
      type: 'victim',
      name: 'Your Current Location',
      lat: userLocation.lat,
      lng: userLocation.lng,
      desc: 'GPS Pin · Finding nearest designated shelter',
    });
  }

  return (
    <DashboardLayout
      title="Nearby Shelters & Relief Centers"
      subtitle="Find safe, verified evacuation hubs near your location with live bed capacity"
      roleOverride="victim"
    >
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        
        {/* GPS Quick Action Card matching Step 8 */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-200">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span>Real-Time Evacuation Hubs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Find Safe Shelter Near Your Location
            </h2>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Verify available beds, meal rations, and emergency medical facilities in official shelters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={locating}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Scanning GPS...' : 'Find Near My GPS'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{showMap ? 'Hide Map' : 'View Map'}</span>
            </button>
          </div>
        </div>

        {/* Optional Interactive Map */}
        {showMap && (
          <div className="bg-white dark:bg-[#0d1726] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Shelters & Relief Centers Map</span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                {shelterMapItems.length} locations plotted
              </span>
            </div>
            <InteractiveMapCard
              height="300px"
              center={userLocation ? [userLocation.lat, userLocation.lng] : [17.3885, 78.4812]}
              items={shelterMapItems}
              showLegend={true}
              zoom={13}
            />
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="shelter-search"
              name="shelterSearch"
              aria-label="Search shelters"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shelters by name, area, or road..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-[#172B4D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1268E8] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              id="shelter-facility-filter"
              name="facilityFilter"
              aria-label="Filter by facility"
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#172B4D] dark:text-white shadow-xs focus:outline-none focus:border-[#1268E8]"
            >
              <option value="All">All Facilities</option>
              <option value="Medical">Medical Care</option>
              <option value="Food">Food Provided</option>
              <option value="Water">Drinking Water</option>
              <option value="Beds">Bedding Available</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFacilityFilter('All');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-[#667085] dark:text-slate-300 shadow-xs flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Shelter Cards List */}
        <div className="space-y-4">
          {filteredShelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.occupied / shelter.capacity) * 100);

            return (
              <div
                key={shelter.id}
                className="bg-white dark:bg-[#0d1726] rounded-2xl border border-[#E4EAF2] dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-5"
              >
                {/* Thumbnail Image */}
                <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                  <img
                    src={shelter.image}
                    alt={shelter.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="sm:hidden absolute top-2 right-2 bg-white/95 dark:bg-slate-900/95 px-2.5 py-0.5 rounded-full text-xs font-bold text-[#1268E8] shadow-xs">
                    {shelter.distance}
                  </span>
                </div>

                {/* Shelter Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-[#172B4D] dark:text-white flex items-center gap-2">
                          <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{shelter.name}</span>
                        </h3>
                        <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {shelter.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-[#20A464] border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          Open
                        </span>
                        <span className="hidden sm:inline-block bg-blue-50 dark:bg-blue-950/40 text-[#1268E8] dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-extrabold border border-blue-100 dark:border-blue-900">
                          {shelter.distance} away
                        </span>
                      </div>
                    </div>

                    {/* Capacity / Occupied / Available Metrics */}
                    <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50/80 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <div className="text-[11px] text-[#667085] dark:text-slate-400 font-semibold">Capacity</div>
                        <div className="text-xs sm:text-sm font-bold text-[#172B4D] dark:text-white">{shelter.capacity}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#667085] dark:text-slate-400 font-semibold">Occupied</div>
                        <div className="text-xs sm:text-sm font-bold text-amber-600">{shelter.occupied}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#667085] dark:text-slate-400 font-semibold">Available Beds</div>
                        <div className="text-xs sm:text-sm font-black text-[#20A464]">{shelter.available} free</div>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${occupancyPct > 80 ? 'bg-red-500' : 'bg-[#20A464]'}`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>

                    {/* Facilities Tags matching Step 8 */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {shelter.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold"
                        >
                          <Check className="w-3 h-3 text-[#20A464]" /> {fac}: Available
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons matching Step 8: [GET DIRECTIONS] */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedShelter(shelter)}
                      className="px-4 py-2 rounded-xl border border-[#E4EAF2] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-[#172B4D] dark:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GET DIRECTIONS</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Shelter Details Modal */}
      {selectedShelter && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0d1726] rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base">{selectedShelter.name}</h3>
              <button
                onClick={() => setSelectedShelter(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={selectedShelter.image}
                alt={selectedShelter.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <strong>Address:</strong> {selectedShelter.address}
              </div>
              <div>
                <strong>Contact Desk:</strong> {selectedShelter.contactPhone}
              </div>
              <div>
                <strong>Available Beds:</strong>{' '}
                <span className="text-[#20A464] font-bold">
                  {selectedShelter.available} free
                </span>{' '}
                (Total {selectedShelter.capacity})
              </div>
              <div>
                <strong>Verified Amenities:</strong>{' '}
                {selectedShelter.facilities.join(', ')}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedShelter(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <a
                href={`tel:${selectedShelter.contactPhone}`}
                className="px-4 py-2 rounded-xl bg-[#20A464] hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Shelter Office
              </a>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
