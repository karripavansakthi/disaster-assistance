import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SosModal from '../components/SosModal';
import {
  AlertTriangle,
  Home as HomeIcon,
  HeartHandshake,
  Radio,
  MapPin,
  Users,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Building2,
  Ambulance,
  LifeBuoy,
  FileText
} from 'lucide-react';
import {
  getShelters,
  getAlerts,
  getRequests,
  getHospitals,
  getVolunteers,
  getResources,
  getSimulationState
} from '../data/mockData';

export default function Home() {
  const [shelters, setShelters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [resources, setResources] = useState([]);
  const [simulation, setSimulation] = useState(getSimulationState());
  const [sosOpen, setSosOpen] = useState(false);

  const loadData = () => {
    setShelters(getShelters().slice(0, 3));
    setAlerts(getAlerts());
    setRequests(getRequests());
    setHospitals(getHospitals());
    setVolunteers(getVolunteers());
    setResources(getResources());
    setSimulation(getSimulationState());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('da_data_updated', loadData);
    return () => window.removeEventListener('da_data_updated', loadData);
  }, []);

  const activeEmergenciesCount = requests.filter((r) => r.status !== 'Completed').length;
  const availableBedsCount = shelters.reduce((acc, s) => acc + (s.available || (s.capacity - s.occupied) || 0), 0);
  const activeVolunteersCount = volunteers.filter((v) => v.status === 'Available' || v.status === 'Assigned').length;
  const latestAlert = alerts[0];

  const serviceCards = [
    {
      title: 'Emergency SOS & Help',
      desc: 'Instant GPS broadcast & priority assistance',
      icon: AlertTriangle,
      color: 'bg-[#F52D3D]',
      tag: 'Immediate Response',
      link: '/emergency'
    },
    {
      title: 'Safe Shelters',
      desc: 'Live capacity & directions to relief hubs',
      icon: HomeIcon,
      color: 'bg-[#1268E8]',
      tag: 'Verified Facilities',
      link: '/shelters'
    },
    {
      title: 'Hospitals & Medical Beds',
      desc: 'Trauma centers, ICU readiness & ambulances',
      icon: Ambulance,
      color: 'bg-[#0E9F6E]',
      tag: 'Trauma & Triage',
      link: '/medical'
    },
    {
      title: 'Relief Food & Kits',
      desc: 'Water, food rations & emergency medical kits',
      icon: HeartHandshake,
      color: 'bg-[#FF8A1F]',
      tag: 'Essential Supplies',
      link: '/resources'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Citizen SOS & Incident Report',
      desc: 'Victims click SOS or submit a request with automated GPS capture, affected headcount, and vulnerable demographics.',
      icon: Zap,
      color: 'text-red-500 bg-red-50'
    },
    {
      step: '02',
      title: 'AI Emergency Triage Analyzer',
      desc: 'The integrated triage algorithm calculates risk severity (Critical / High / Medium), assigning recommended response units in under 1 second.',
      icon: Cpu,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      step: '03',
      title: 'Live Rescue Dispatch & Evacuation',
      desc: 'Nearby rescue squads and field volunteers accept dispatch. Victims track responder ETA and can navigate to safe shelters with available beds.',
      icon: Compass,
      color: 'text-emerald-500 bg-emerald-50'
    }
  ];

  const emergencyContacts = [
    { name: 'National Emergency', number: '112', desc: 'Police, Fire & Medical 24/7' },
    { name: 'State Disaster Ops (SDMA)', number: '1070', desc: 'Toll-free Disaster Control Room' },
    { name: 'Medical Emergency Ambulance', number: '108', desc: 'Critical Trauma & Life Support' },
    { name: 'Fire & Rescue Service', number: '101', desc: 'Urban Fire & Evacuation Team' },
    { name: 'Women & Child Helpline', number: '1091', desc: 'Protection & Special Assistance' }
  ];

  return (
    <div className="min-h-screen bg-[#F3F7FC] text-[#172B4D] flex flex-col font-sans">
      <Navbar />

      {/* Simulation Banner if Active */}
      {simulation.active && (
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-semibold sticky top-[68px] z-40">
          <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>LIVE DISASTER SIMULATION DRILL ACTIVE: <strong>{typeof simulation.disasterType === 'string' ? simulation.disasterType : (simulation.disasterType?.disasterType || 'Cyclone')}</strong> ({typeof simulation.severity === 'string' ? simulation.severity : (simulation.severity?.severity || 'High')} Severity) in {typeof simulation.affectedArea === 'string' ? simulation.affectedArea : 'Coastal Zone'}</span>
            </div>
            <Link
              to="/admin/dashboard"
              className="bg-white text-red-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-slate-100 transition-colors shrink-0"
            >
              Control Center
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative isolate min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center overflow-hidden">
        {/* Background Image: High quality emergency flood and rescue responder */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=2000&q=80')`
          }}
        />

        {/* Dark Navy Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#041A2E]/95 via-[#062B4C]/85 to-[#062B4C]/65" />

        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 py-16 sm:py-24 w-full">
          <div className="max-w-3xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F52D3D] animate-ping"></span>
              <span>SMART DISASTER VICTIM ASSISTANCE & RESPONSE PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Get Help. Stay Safe.{' '}
              <span className="text-[#F52D3D] block sm:inline">Recover Faster.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              AI-powered emergency response coordinating trapped victims, volunteers, verified safe shelters, trauma hospitals, and ration supply chains in real time.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setSosOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white text-base font-bold shadow-xl shadow-red-600/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <AlertTriangle className="w-5 h-5 text-white" />
                <span>Instant SOS Distress Call</span>
              </button>

              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-bold backdrop-blur-md border border-white/30 transition-all hover:scale-[1.02]"
              >
                <span>Report Detailed Request</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shelters"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#062B4C] text-sm sm:text-base font-bold shadow-md transition-all hover:scale-[1.02] border border-slate-200"
              >
                <MapPin className="w-4 h-4 text-[#1268E8]" />
                <span>Find Nearby Shelter</span>
              </Link>
            </div>

            {/* Live Operational Metrics Counter Strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl pt-8 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <div className="text-2xl sm:text-3xl font-extrabold text-red-400">{activeEmergenciesCount}</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  Active Emergencies
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{availableBedsCount}+</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Shelter Beds Open</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{activeVolunteersCount}</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Field Volunteers</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{hospitals.length}</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Medical Centers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Service Cards */}
      <section className="relative -mt-10 sm:-mt-12 z-20 max-w-[1400px] mx-auto px-5 sm:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="bg-white rounded-2xl p-6 border border-[#E4EAF2] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#172B4D] group-hover:text-[#1268E8] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#667085] mt-1.5 font-normal leading-relaxed">
                  {card.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#1268E8] group-hover:translate-x-1 transition-transform">
                  <span>Access Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active Disaster Alert Banner */}
      {latestAlert && (
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 w-full mt-10">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white">
                    Emergency Broadcast
                  </span>
                  <span className="text-xs font-semibold text-slate-500">• {latestAlert.timeAgo}</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">{latestAlert.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{latestAlert.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/alerts"
                className="w-full md:w-auto text-center inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                <span>View Full Alert Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How DisasterAssist Works (3-Step Emergency Flow) */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 w-full py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1268E8] text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            End-to-End Coordination
          </div>
          <h2 className="text-3xl font-extrabold text-[#172B4D]">How DisasterAssist Works</h2>
          <p className="text-sm text-[#667085] mt-2">
            Engineered for low-bandwidth resilience, high triage accuracy, and rapid dispatch across affected zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-7 border border-[#E4EAF2] shadow-sm hover:shadow-md transition-all relative group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} font-extrabold`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#172B4D] mb-2">{step.title}</h3>
                <p className="text-xs text-[#667085] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Emergency Triage Analyzer Feature Spotlight */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 w-full pb-16">
        <div className="bg-gradient-to-br from-[#062B4C] via-[#0A3D69] to-[#041A2E] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Cpu className="w-4 h-4 text-blue-400" />
                Intelligent Decision Support
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                AI Disaster Triage Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed font-normal">
                During large-scale calamities, response switchboards are overwhelmed. DisasterAssist automatically evaluates incident severity, trapped vulnerable persons (children, elderly), injury status, and structural danger to rank dispatches into <strong>Critical, High, Medium, or Low</strong> urgency tiers.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-slate-300 font-semibold">Priority Scoring</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">Demographic Risk-Weighted</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-slate-300 font-semibold">Execution Latency</div>
                  <div className="text-sm font-extrabold text-blue-400 mt-0.5">&lt; 250ms On-Device</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-slate-300 font-semibold">Offline Capable</div>
                  <div className="text-sm font-extrabold text-amber-300 mt-0.5">PWA / Cache Fallback</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/showcase"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#062B4C] text-xs sm:text-sm font-extrabold hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>View Viva Project Poster</span>
                </Link>

                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold transition-colors shadow-sm"
                >
                  <Activity className="w-4 h-4 text-white" />
                  <span>Launch Disaster Simulation</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Triage Telemetry</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/30 text-red-200 border border-red-400/40">
                  HIGH SEVERITY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg">
                  <span className="text-slate-300">Emergency Type:</span>
                  <span className="font-bold text-white">Urban Inundation / Flood</span>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg">
                  <span className="text-slate-300">Vulnerable Individuals:</span>
                  <span className="font-bold text-amber-300">2 Children, 1 Elderly</span>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg">
                  <span className="text-slate-300">Urgent Assistance Needed:</span>
                  <span className="font-bold text-red-300">Boat Evacuation + First Aid</span>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg">
                  <span className="text-slate-300">Calculated Priority:</span>
                  <span className="font-extrabold text-red-400 uppercase tracking-wide">CRITICAL (Score: 90/100)</span>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg">
                  <span className="text-slate-300">Assigned Response:</span>
                  <span className="font-bold text-emerald-300">Rescue Team Alpha (Boat #2)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immediate Relief Shelters Overview */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 w-full pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D]">Verified Safe Shelters</h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Active safe relief centers equipped with beds, clean drinking water, electricity backup and medical triage.
            </p>
          </div>
          <Link
            to="/shelters"
            className="text-xs sm:text-sm font-bold text-[#1268E8] hover:underline inline-flex items-center gap-1.5 shrink-0"
          >
            <span>View All Shelters On Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shelters.map((shelter) => {
            const avail = shelter.available || (shelter.capacity - shelter.occupied);
            return (
              <div
                key={shelter.id}
                className="bg-white rounded-2xl border border-[#E4EAF2] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img
                    src={shelter.image}
                    alt={shelter.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-[#1268E8] shadow-sm">
                    {shelter.distance}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#062B4C]/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Verified Open
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-base text-[#172B4D]">{shelter.name}</h3>
                  <p className="text-xs text-[#667085] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{shelter.address}</span>
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[11px]">Available Beds</span>
                      <span className="font-extrabold text-emerald-600 text-sm">{avail} Beds</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[11px]">Capacity</span>
                      <span className="font-bold text-slate-700 text-sm">{shelter.capacity} Total</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${shelter.phone || '112'}`}
                      className="text-slate-600 font-semibold hover:text-[#062B4C] flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#1268E8]" />
                      <span>{shelter.phone || 'Emergency Desk'}</span>
                    </a>
                    <Link
                      to="/shelters"
                      className="text-[#1268E8] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Emergency Helpline Strip */}
      <section className="bg-white border-y border-[#E4EAF2] py-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 w-full">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl font-extrabold text-[#172B4D]">State & National Disaster Helplines</h3>
            <p className="text-xs text-[#667085] mt-1">24/7 Toll-free rapid emergency lines for immediate voice dispatch</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="bg-[#F8FAFC] hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-xl p-4 text-center transition-all group"
              >
                <div className="text-xl font-black text-red-600 group-hover:scale-105 transition-transform">
                  {contact.number}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{contact.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{contact.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#062B4C] text-white pt-12 pb-8 border-t border-[#0A3D69] mt-auto">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F52D3D] flex items-center justify-center text-white font-extrabold">
                  DA
                </div>
                <span className="font-extrabold text-base tracking-wide text-white">DisasterAssist</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Smart Disaster Victim Assistance & Rapid Emergency Response System. Academic and viva demonstration edition.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] font-bold text-emerald-300">Live Operations Online</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-3">Emergency Navigation</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/emergency" className="hover:text-white transition-colors">Request Emergency Help</Link></li>
                <li><Link to="/shelters" className="hover:text-white transition-colors">Find Safe Shelters</Link></li>
                <li><Link to="/medical" className="hover:text-white transition-colors">Hospital & Trauma Centers</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Ration & Kit Logistics</Link></li>
                <li><Link to="/safety" className="hover:text-white transition-colors">Safety Assistant & Kit</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-3">Operational Portals</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/victim/dashboard" className="hover:text-white transition-colors">Victim Dashboard & Tracker</Link></li>
                <li><Link to="/volunteer/dashboard" className="hover:text-white transition-colors">Volunteer Responder Desk</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Command Center</Link></li>
                <li><Link to="/showcase" className="hover:text-white transition-colors">Viva Presentation Showcase</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-3">Disaster Simulation Mode</h4>
              <p className="text-slate-300 mb-3 leading-relaxed">
                Experience simulated disaster drills (Cyclone, Flood, Earthquake) directly inside the Admin Command Center.
              </p>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-colors"
              >
                <span>Access Command Drill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <div>
              &copy; {new Date().getFullYear()} DisasterAssist. Built for Disaster Preparedness & Academic Viva Evaluation.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-white">Architecture & Technology</Link>
              <span>•</span>
              <Link to="/showcase" className="hover:text-white">Project Showcase Poster</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global SOS Modal triggerable from hero */}
      <SosModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
