import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
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
  Phone
} from 'lucide-react';

export default function Shelters() {
  const allShelters = getShelters();
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [selectedShelter, setSelectedShelter] = useState(null);

  const filteredShelters = allShelters.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacility = facilityFilter === 'All' || s.facilities.includes(facilityFilter);
    return matchesSearch && matchesFacility;
  });

  return (
    <DashboardLayout
      title="Nearby Shelters"
      subtitle="Find safe places near your location"
      roleOverride="victim"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Search & Filter Bar matching reference */}
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4EAF2] bg-white text-xs sm:text-sm text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1268E8] shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              id="shelter-facility-filter"
              name="facilityFilter"
              aria-label="Filter by facility"
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] bg-white text-xs font-bold text-[#172B4D] shadow-xs focus:outline-none focus:border-[#1268E8]"
            >
              <option value="All">All Facilities</option>
              <option value="Medical">Medical Care</option>
              <option value="Food">Food Provided</option>
              <option value="Water">Drinking Water</option>
              <option value="Beds">Bedding Available</option>
            </select>

            <button
              type="button"
              onClick={() => { setSearchTerm(''); setFacilityFilter('All'); }}
              className="px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] bg-white hover:bg-slate-50 text-xs font-bold text-[#667085] shadow-xs flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Shelter Cards List matching reference image */}
        <div className="space-y-4">
          {filteredShelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.occupied / shelter.capacity) * 100);

            return (
              <div
                key={shelter.id}
                className="bg-white rounded-xl border border-[#E4EAF2] shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-5"
              >
                {/* Thumbnail Image */}
                <div className="w-full sm:w-44 h-36 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={shelter.image}
                    alt={shelter.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="sm:hidden absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-full text-xs font-bold text-[#1268E8] shadow-xs">
                    {shelter.distance}
                  </span>
                </div>

                {/* Shelter Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#172B4D]">
                          {shelter.name}
                        </h3>
                        <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {shelter.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-[#20A464] border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          Open
                        </span>
                        <span className="hidden sm:inline-block bg-blue-50 dark:bg-blue-950/40 text-[#1268E8] dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-900">
                          {shelter.distance}
                        </span>
                      </div>
                    </div>

                    {/* Subline with Google Rating and capacity info */}
                    <div className="flex items-center gap-3 text-xs text-[#667085] dark:text-slate-400 mt-1">
                      <span>Capacity: <strong className="text-slate-800 dark:text-slate-200">{shelter.capacity}</strong></span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">Google: {shelter.id === 'shelter-1' ? '4.7' : shelter.id === 'shelter-2' ? '4.5' : '4.2'} ★</span>
                      <span>•</span>
                      <span>Available: <strong className="text-[#20A464]">{shelter.available}</strong></span>
                    </div>

                    {/* Capacity / Occupied / Available Metrics */}
                    <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-center">
                      <div>
                        <div className="text-[11px] text-[#667085]">Capacity</div>
                        <div className="text-xs sm:text-sm font-bold text-[#172B4D]">{shelter.capacity}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#667085]">Occupied</div>
                        <div className="text-xs sm:text-sm font-bold text-amber-600">{shelter.occupied}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#667085]">Available</div>
                        <div className="text-xs sm:text-sm font-bold text-[#20A464]">{shelter.available}</div>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${occupancyPct > 80 ? 'bg-red-500' : 'bg-[#20A464]'}`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>

                    {/* Facilities Tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-[#667085] font-semibold">Facilities:</span>
                      {shelter.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          <Check className="w-2.5 h-2.5 text-[#20A464]" /> {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons matching reference */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedShelter(shelter)}
                      className="px-4 py-2 rounded-lg border border-[#E4EAF2] hover:bg-slate-50 text-xs font-bold text-[#172B4D] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shelter Modal */}
      {selectedShelter && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#172B4D]">{selectedShelter.name}</h3>
              <button onClick={() => setSelectedShelter(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-44 rounded-xl overflow-hidden bg-slate-100">
              <img src={selectedShelter.image} alt={selectedShelter.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs">
              <div><strong>Address:</strong> {selectedShelter.address}</div>
              <div><strong>Contact Desk:</strong> {selectedShelter.contactPhone}</div>
              <div><strong>Available Beds:</strong> <span className="text-[#20A464] font-bold">{selectedShelter.available} free</span> (Total {selectedShelter.capacity})</div>
              <div><strong>Verified Amenities:</strong> {selectedShelter.facilities.join(', ')}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedShelter(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
              >
                Close
              </button>
              <a
                href={`tel:${selectedShelter.contactPhone}`}
                className="px-4 py-2 rounded-lg bg-[#20A464] text-white text-xs font-bold inline-flex items-center gap-1.5"
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
