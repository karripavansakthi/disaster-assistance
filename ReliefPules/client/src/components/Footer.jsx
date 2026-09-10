import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const emergencyNumbers = [
    { label: 'National Emergency', number: '112' },
    { label: 'Disaster Management (NDMA)', number: '1070' },
    { label: 'NDRF Control Room', number: '011-24363260' },
    { label: 'Ambulance & Medical', number: '108' },
    { label: 'Fire Service', number: '101' },
    { label: 'Police Emergency', number: '100' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Urgent Emergency Numbers Row */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Phone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">National Disaster & Emergency Hotlines</h4>
                <p className="text-xs text-slate-400">Toll-free 24x7 emergency contacts across all disaster-affected zones</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
                Services Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {emergencyNumbers.map((item, idx) => (
              <a
                key={idx}
                href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                className="bg-slate-900/70 hover:bg-red-950/40 hover:border-red-500/40 border border-slate-700/60 rounded-xl p-3 text-center transition group"
              >
                <div className="text-[11px] text-slate-400 font-medium truncate group-hover:text-red-300">{item.label}</div>
                <div className="text-base font-extrabold text-white group-hover:text-red-400 mt-0.5">{item.number}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ReliefPulse
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent Disaster Victim Assistance & Shelter Management Platform. Empowered by Groq LLaMA 3.1 AI to connect affected victims with life-saving rescue, shelter occupancy, and relief resources.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified MERN Disaster Protocol</span>
            </div>
          </div>

          {/* Rapid Links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-3">Platform Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition">Platform Home</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-emerald-400 transition flex items-center">
                  <span>ReliefPulse AI Assistant</span>
                  <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-400 rounded">Groq</span>
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-red-400 transition">Emergency SOS Request</Link>
              </li>
              <li>
                <Link to="/shelters" className="hover:text-emerald-400 transition">Safe Shelter Directory</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">Agency Command Center</Link>
              </li>
            </ul>
          </div>

          {/* AI Capabilities */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-3">Intelligent Capabilities</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Real-time Groq LLaMA 3.1 Triage</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Proximity Shelter Recommendations</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Critical Urgency Scoring (1-100)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Live Relief Stock Tracking</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Broadcast Alert Synchronization</span>
              </li>
            </ul>
          </div>

          {/* Agency & Volunteer Network */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-3">Partners & Responders</h5>
            <p className="text-xs text-slate-400 mb-3">
              Coordinating with NDRF, State Disaster Management Authorities (SDMA), Red Cross, and local volunteer networks.
            </p>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs">
              <span className="text-slate-300 font-medium block mb-1">Are you a rescue responder or NGO?</span>
              <Link
                to="/register"
                className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center"
              >
                Register as Volunteer Agency <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ReliefPulse Platform. Built for humanitarian disaster response.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Engineered with care</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for emergency resilience.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
