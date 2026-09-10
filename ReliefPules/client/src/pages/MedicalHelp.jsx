import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SosModal from '../components/SosModal';
import {
  Ambulance,
  PhoneCall,
  MapPin,
  Activity,
  HeartPulse,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Navigation,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { getHospitals } from '../data/mockData';

export default function MedicalHelp() {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sosOpen, setSosOpen] = useState(false);

  const loadHospitals = () => {
    setHospitals(getHospitals());
  };

  useEffect(() => {
    loadHospitals();
    window.addEventListener('da_data_updated', loadHospitals);
    return () => window.removeEventListener('da_data_updated', loadHospitals);
  }, []);

  const filterOptions = ['All', 'Trauma Center', 'Field Triage', 'Government Hospital'];

  const filteredHospitals = hospitals.filter((hosp) => {
    const matchesSearch =
      hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hosp.specialties && hosp.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Trauma Center') return hosp.type.toLowerCase().includes('trauma');
    if (selectedFilter === 'Field Triage') return hosp.type.toLowerCase().includes('field') || hosp.type.toLowerCase().includes('triage');
    if (selectedFilter === 'Government Hospital') return hosp.type.toLowerCase().includes('government');
    return true;
  });

  const totalEmergencyBeds = hospitals.reduce((acc, h) => acc + (h.availableBeds || 0), 0);
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + (h.icuBeds || 0), 0);
  const totalAmbulances = hospitals.reduce((acc, h) => acc + (h.ambulancesActive || 0), 0);

  return (
    <div className="min-h-screen bg-[#F3F7FC] text-[#172B4D] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-[#062B4C] text-white py-12 px-5 sm:px-8 border-b border-[#0A3D69]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
                <HeartPulse className="w-4 h-4 text-red-400" />
                Emergency Medical Network
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Hospital & Trauma Response Network
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
                Real-time verified capacity for emergency beds, ICU ventilators, and active disaster triage field units.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSosOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
              >
                <Ambulance className="w-4 h-4" />
                <span>Request Critical Ambulance</span>
              </button>

              <a
                href="tel:108"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#062B4C] text-sm font-extrabold hover:bg-slate-100 transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span>Call 108 Emergency</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalEmergencyBeds}</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Available Emergency Beds</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-red-400">{totalIcuBeds}</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">ICU / Ventilator Units</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{totalAmbulances}</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Active Ambulances On-Duty</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{hospitals.length}</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Verified Facilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 w-full flex-1">
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-[#E4EAF2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="hospital-search"
              name="hospitalSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hospital by name, area, or specialty..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#1268E8] focus:ring-1 focus:ring-[#1268E8]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-[#1268E8] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => {
            const occupancyPct = Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100);
            return (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image & Status Badge */}
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-[#1268E8] shadow-sm">
                    {hospital.distance}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#062B4C]/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {hospital.status || 'Active Triage Center'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {hospital.type}
                      </span>
                      <h3 className="text-base font-extrabold text-[#172B4D] mt-1.5">{hospital.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-[#667085] mt-1.5 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{hospital.address}</span>
                  </p>

                  {/* Bed Stats Grid */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-500">Available Beds</div>
                      <div className="text-base font-extrabold text-emerald-600">{hospital.availableBeds}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-500">ICU / Trauma</div>
                      <div className="text-base font-extrabold text-red-600">{hospital.icuBeds}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-500">Ambulances</div>
                      <div className="text-base font-extrabold text-blue-600">{hospital.ambulancesActive}</div>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  {hospital.specialties && hospital.specialties.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {hospital.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <a
                      href={`tel:${hospital.contactPhone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{hospital.contactPhone}</span>
                    </a>

                    <Link
                      to="/shelters"
                      className="inline-flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl bg-[#062B4C] hover:bg-[#0A3D69] text-white text-xs font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Map Route</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No medical facilities found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or filter options.</p>
          </div>
        )}
      </div>

      <SosModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
