import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DisasterLogo from '../components/DisasterLogo';
import {
  Zap,
  Home,
  Users,
  Clock,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  Radio,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Activity,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export default function Showcase() {
  const [selectedScreen, setSelectedScreen] = useState(null);

  const screens = [
    {
      id: 'home',
      num: '1',
      title: 'Homepage / Landing Page',
      path: '/',
      tag: 'Public Portal',
      description: 'High-impact disaster relief hero with immediate emergency action cards and live alerts.',
      accent: 'from-blue-600 to-cyan-600',
      componentPreview: (
        <div className="bg-[#062B4C] text-white p-3 rounded-lg text-left text-[11px] space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-bold text-xs">DisasterAssist</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500 font-bold">EMERGENCY</span>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wider text-red-400 font-bold">SMART ASSISTANCE PLATFORM</div>
            <div className="text-sm font-extrabold text-white leading-tight">Get Help. Stay Safe. <span className="text-red-400">Recover Faster.</span></div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className="bg-red-500 text-white rounded p-1.5 font-bold text-center text-[10px]">⚠️ Request Emergency</div>
            <div className="bg-white text-slate-900 rounded p-1.5 font-bold text-center text-[10px]">📍 Nearby Shelters</div>
          </div>
          <div className="grid grid-cols-4 gap-1 pt-1 text-center">
            <div className="bg-white/10 rounded p-1"><div className="w-4 h-4 mx-auto rounded-full bg-red-500 mb-0.5" /><span className="text-[8px] font-bold block">Help</span></div>
            <div className="bg-white/10 rounded p-1"><div className="w-4 h-4 mx-auto rounded-full bg-blue-500 mb-0.5" /><span className="text-[8px] font-bold block">Shelters</span></div>
            <div className="bg-white/10 rounded p-1"><div className="w-4 h-4 mx-auto rounded-full bg-emerald-500 mb-0.5" /><span className="text-[8px] font-bold block">Food/Med</span></div>
            <div className="bg-white/10 rounded p-1"><div className="w-4 h-4 mx-auto rounded-full bg-orange-500 mb-0.5" /><span className="text-[8px] font-bold block">Alerts</span></div>
          </div>
        </div>
      )
    },
    {
      id: 'login',
      num: '2',
      title: 'Login Page',
      path: '/login',
      tag: 'Authentication',
      description: 'Split-screen portal with relief camp hero, 3 trust badges, and 1-click role logins.',
      accent: 'from-slate-800 to-blue-900',
      componentPreview: (
        <div className="grid grid-cols-12 gap-1 bg-white border border-slate-200 rounded-lg p-2 text-left text-[10px]">
          <div className="col-span-5 bg-[#062B4C] text-white p-2 rounded flex flex-col justify-between">
            <div className="font-bold text-[10px]">Welcome Back!</div>
            <div className="space-y-1 my-1 text-[8px] text-slate-300">
              <div>⚡ Fast Response</div>
              <div>🛡️ Trusted Platform</div>
              <div>📞 24/7 Support</div>
            </div>
            <div className="text-[7px] text-slate-400">Secure Gateway</div>
          </div>
          <div className="col-span-7 p-2 flex flex-col justify-between space-y-1">
            <div className="font-bold text-slate-900 text-[11px]">Login</div>
            <div className="bg-slate-100 p-1 rounded text-[8px] text-slate-500">Email or Mobile</div>
            <div className="bg-slate-100 p-1 rounded text-[8px] text-slate-500">Password (••••••)</div>
            <div className="bg-blue-600 text-white text-center py-1 rounded font-bold text-[9px]">Login</div>
            <div className="text-[8px] text-center text-slate-400">Or continue with Google / FB</div>
          </div>
        </div>
      )
    },
    {
      id: 'register',
      num: '3',
      title: 'Registration Page',
      path: '/register',
      tag: 'Role Onboarding',
      description: 'Role-segmented registration for Victims, Volunteers, and Rescue Teams with GPS detection.',
      accent: 'from-blue-700 to-indigo-800',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-left text-[10px] space-y-1.5">
          <div className="font-bold text-slate-900 text-[11px] text-center">Create Your Account</div>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded text-center text-[8px] font-bold">
            <span className="bg-blue-600 text-white rounded py-0.5">Victim</span>
            <span className="text-slate-600 py-0.5">Volunteer</span>
            <span className="text-slate-600 py-0.5">Admin</span>
          </div>
          <div className="space-y-1">
            <div className="bg-slate-50 border border-slate-200 rounded p-1 text-[8px] text-slate-600">Full Name: Ramesh Kumar</div>
            <div className="bg-slate-50 border border-slate-200 rounded p-1 text-[8px] text-slate-600">GPS: 17.3850, 78.4867 (Ward 7)</div>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded p-1 text-[8px]">
              <span>People with You:</span>
              <span className="font-bold text-blue-600">[ - 4 + ]</span>
            </div>
          </div>
          <div className="bg-blue-600 text-white text-center py-1 rounded font-bold text-[9px]">Register</div>
        </div>
      )
    },
    {
      id: 'victim-dashboard',
      num: '4',
      title: 'Victim Dashboard',
      path: '/victim/dashboard',
      tag: 'Live Status Tracker',
      description: 'Active emergency banner, 4-step dispatch status stepper, and nearby shelter previews.',
      accent: 'from-red-600 to-rose-700',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-left text-[10px] space-y-2">
          <div className="bg-red-500 text-white p-2 rounded flex items-center justify-between">
            <div>
              <div className="font-bold text-[10px]">Your request is active!</div>
              <div className="text-[8px] text-white/85">REQ1024 · Medical · Critical</div>
            </div>
            <span className="bg-white text-red-600 px-1.5 py-0.5 rounded font-bold text-[8px]">View Details</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-red-50 rounded p-1 border border-red-100"><span className="text-[8px] text-slate-500 block">Request</span><strong className="text-red-600 text-[10px]">#REQ1024</strong></div>
            <div className="bg-emerald-50 rounded p-1 border border-emerald-100"><span className="text-[8px] text-slate-500 block">Shelter</span><strong className="text-emerald-600 text-[10px]">Safe Haven</strong></div>
            <div className="bg-blue-50 rounded p-1 border border-blue-100"><span className="text-[8px] text-slate-500 block">People</span><strong className="text-blue-600 text-[10px]">4 Persons</strong></div>
          </div>
          <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[8px] space-y-0.5">
            <div className="text-emerald-600 font-bold">✓ 1. Request Received (08:45 AM)</div>
            <div className="text-emerald-600 font-bold">✓ 2. Volunteer Assigned (Team 04)</div>
            <div className="text-blue-600 font-bold animate-pulse">● 3. Assistance Arriving (ETA 15m)</div>
            <div className="text-slate-400">○ 4. Completed</div>
          </div>
        </div>
      )
    },
    {
      id: 'volunteer-dashboard',
      num: '5',
      title: 'Volunteer Dashboard',
      path: '/volunteer/dashboard',
      tag: 'Field Operations',
      description: 'Assigned missions, hours logged, task progress badges, and victim radar map.',
      accent: 'from-amber-600 to-orange-700',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-left text-[10px] space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="font-bold text-slate-800">Hello, Suresh!</span>
            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold text-[8px]">Volunteer</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-slate-50 p-1 rounded border border-slate-200"><span className="text-[8px] text-slate-500 block">Assigned</span><strong className="text-blue-600 text-[11px]">3</strong></div>
            <div className="bg-slate-50 p-1 rounded border border-slate-200"><span className="text-[8px] text-slate-500 block">Done</span><strong className="text-emerald-600 text-[11px]">5</strong></div>
            <div className="bg-slate-50 p-1 rounded border border-slate-200"><span className="text-[8px] text-slate-500 block">Hours</span><strong className="text-purple-600 text-[11px]">48h</strong></div>
          </div>
          <div className="space-y-1 text-[8px]">
            <div className="p-1 rounded bg-blue-50/70 border border-blue-100 flex justify-between">
              <span>REQ1024 · Flood Evac</span>
              <span className="text-blue-600 font-bold">In Progress</span>
            </div>
            <div className="p-1 rounded bg-orange-50/70 border border-orange-100 flex justify-between">
              <span>REQ1007 · Shelter Supply</span>
              <span className="text-orange-600 font-bold">Pending</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'admin-dashboard',
      num: '6',
      title: 'Admin Dashboard',
      path: '/admin/dashboard',
      tag: 'Disaster Command Center',
      description: 'Comprehensive metrics, live Hyderabad disaster pins map, and emergency request dispatch table.',
      accent: 'from-indigo-600 to-blue-800',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-left text-[10px] space-y-2">
          <div className="font-bold text-slate-900 text-[11px]">Admin Command Center</div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="bg-red-50 p-1 rounded border border-red-100"><span className="text-[7px] text-slate-500 block">Victims</span><strong className="text-red-600 text-[9px]">1,248</strong></div>
            <div className="bg-blue-50 p-1 rounded border border-blue-100"><span className="text-[7px] text-slate-500 block">Emergencies</span><strong className="text-blue-600 text-[9px]">42</strong></div>
            <div className="bg-emerald-50 p-1 rounded border border-emerald-100"><span className="text-[7px] text-slate-500 block">Shelters</span><strong className="text-emerald-600 text-[9px]">18</strong></div>
            <div className="bg-purple-50 p-1 rounded border border-purple-100"><span className="text-[7px] text-slate-500 block">Volunteers</span><strong className="text-purple-600 text-[9px]">96</strong></div>
          </div>
          <div className="bg-slate-100 p-2 rounded text-center border border-slate-200 text-[9px] font-bold text-slate-700 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>Interactive Multi-Layer Disaster Map</span>
          </div>
        </div>
      )
    },
    {
      id: 'emergency-request',
      num: '7',
      title: 'Emergency Assistance Form',
      path: '/emergency',
      tag: 'Urgent SOS Dispatch',
      description: 'GPS locator, adults/children/elderly demographic counters, and category checkboxes.',
      accent: 'from-red-600 to-orange-600',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-left text-[10px] space-y-1.5">
          <div className="font-bold text-slate-900 text-[11px]">Emergency Assistance</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-slate-50 p-1 rounded text-[8px]">Type: Flood</div>
            <div className="bg-red-50 text-red-700 p-1 rounded font-bold text-[8px]">Priority: Critical</div>
          </div>
          <div className="bg-slate-50 p-1 rounded text-[8px] text-slate-600">Location: 17.3812, 78.4867 (GPS Verified)</div>
          <div className="grid grid-cols-3 gap-1 text-center text-[8px]">
            <div className="bg-slate-100 p-1 rounded">Adults: 2</div>
            <div className="bg-slate-100 p-1 rounded">Children: 1</div>
            <div className="bg-slate-100 p-1 rounded">Elderly: 0</div>
          </div>
          <div className="bg-[#F52D3D] text-white text-center py-1.5 rounded font-bold text-[9px] shadow-sm">
            🚀 Send Emergency Request
          </div>
        </div>
      )
    },
    {
      id: 'shelters',
      num: '8',
      title: 'Nearby Shelters',
      path: '/shelters',
      tag: 'Resource Allocation',
      description: 'Shelter directory with bed occupancy, live Google ratings, distance indicators, and directions.',
      accent: 'from-emerald-600 to-teal-700',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-left text-[10px] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900">Nearby Shelters</span>
            <span className="text-[8px] text-blue-600 font-bold">Search & Filters</span>
          </div>
          <div className="p-1.5 rounded border border-slate-200 bg-slate-50 space-y-0.5">
            <div className="flex justify-between font-bold text-[9px]">
              <span>Safe Haven Relief Center</span>
              <span className="text-emerald-600">173 Beds</span>
            </div>
            <div className="text-[8px] text-slate-500">1.2 km away · Food, Medical, Beds</div>
          </div>
          <div className="p-1.5 rounded border border-slate-200 bg-slate-50 space-y-0.5">
            <div className="flex justify-between font-bold text-[9px]">
              <span>Green Valley Shelter</span>
              <span className="text-emerald-600">180 Beds</span>
            </div>
            <div className="text-[8px] text-slate-500">2.8 km away · Food, Water, Beds</div>
          </div>
        </div>
      )
    },
    {
      id: 'alerts',
      num: '10',
      title: 'Disaster Alerts & Relief',
      path: '/alerts',
      tag: 'Critical Broadcasts',
      description: 'Verified relief supply distribution points (Food, Medical, Water Tankers) and safety notices.',
      accent: 'from-amber-500 to-red-600',
      componentPreview: (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-left text-[10px] space-y-1.5">
          <div className="font-bold text-slate-900">Active Relief Operations</div>
          <div className="p-1.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 text-[8px] font-bold">
            ✓ All Clear: Sector 4 flood waters receding. Teams stationed.
          </div>
          <div className="space-y-1 text-[8px]">
            <div className="p-1 rounded bg-slate-50 border border-slate-200 flex justify-between">
              <span>🍲 Food Distribution Center</span>
              <span className="text-emerald-600 font-bold">Open</span>
            </div>
            <div className="p-1 rounded bg-slate-50 border border-slate-200 flex justify-between">
              <span>🩺 Mobile Medical Camp</span>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#071626] text-white flex flex-col selection:bg-[#1268E8] selection:text-white">
      <Navbar />

      {/* Top Banner matching reference image exactly */}
      <section className="bg-gradient-to-r from-[#041A2E] via-[#062B4C] to-[#0A3D69] border-b border-cyan-500/20 py-4 px-4 sm:px-8 shadow-md">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-4">
            <DisasterLogo inverted={true} size="default" to="/" />
            <div className="hidden sm:block h-8 w-px bg-white/20" />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                Smart Disaster Victim Assistance Platform
              </h1>
              <p className="text-xs text-cyan-300/80 font-medium">
                Connect &bull; Support &bull; Rebuild
              </p>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-time Emergency Support</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Shelters & Resources</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Community Volunteers</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Faster Response</span>
            </span>
          </div>

          {/* Right Slogan */}
          <div className="hidden xl:block text-right">
            <div className="text-xs font-bold text-white tracking-wider">Stronger Communities.</div>
            <div className="text-[11px] text-cyan-300 font-medium">Safer Tomorrows.</div>
          </div>
        </div>
      </section>

      {/* Main Showcase Poster Canvas */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Complete Architecture & UI/UX Showcase Board</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Unified Platform Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2 font-normal">
            Click any core panel below to inspect the interface layout or navigate directly into the fully interactive live application.
          </p>
        </div>

        {/* The 8 Interactive Presentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="group bg-[#0d1d33] rounded-2xl border border-slate-700/60 hover:border-[#1268E8] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              {/* Header Bar of Card */}
              <div className="p-4 border-b border-slate-800 bg-[#091524] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1268E8] text-white flex items-center justify-center font-bold text-xs">
                    {screen.num}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                      {screen.title}
                    </h3>
                    <span className="text-[10px] text-cyan-300/70 font-semibold uppercase tracking-wider">
                      {screen.tag}
                    </span>
                  </div>
                </div>

                <Link
                  to={screen.path}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                  title="Open live interactive page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Card Thumbnail / Live Interactive UI Preview */}
              <div className="p-4 bg-[#0a1829] flex-1 flex flex-col justify-center">
                <div className="rounded-xl overflow-hidden shadow-inner border border-slate-800">
                  {screen.componentPreview}
                </div>
              </div>

              {/* Card Footer Info & Quick Link */}
              <div className="p-4 border-t border-slate-800/80 bg-[#091524] flex items-center justify-between text-xs">
                <p className="text-[11px] text-slate-300 line-clamp-1 flex-1 pr-3">
                  {screen.description}
                </p>
                <Link
                  to={screen.path}
                  className="shrink-0 inline-flex items-center gap-1 font-bold text-[#60a5fa] hover:text-white transition-colors"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Footer Banner matching reference image exactly */}
      <footer className="bg-gradient-to-r from-[#031525] via-[#062B4C] to-[#041A2E] border-t border-cyan-500/20 py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Left: DisasterAssist Brand */}
          <div className="flex items-center gap-3">
            <DisasterLogo inverted={true} size="default" to="/" />
            <div className="hidden sm:block h-6 w-px bg-white/20" />
            <div className="text-xs text-slate-300">
              Disaster Management &bull; Community Support &bull; A Safer Tomorrow
            </div>
          </div>

          {/* Center: MERN Stack Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-200">
            <span>Built with MERN Stack</span>
            <span>&bull;</span>
            <span className="text-white">React &bull; Node.js &bull; Express &bull; Leaflet</span>
          </div>

          {/* Right: Slogan with Pulse line */}
          <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wider">
            <span className="italic">Hope &bull; Help &bull; Rebuild</span>
            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
