import React from 'react';
import Navbar from '../components/Navbar';
import DisasterLogo from '../components/DisasterLogo';
import { Shield, HeartHandshake, PhoneCall, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#F3F7FC] text-[#172B4D] flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-5 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-3">
            <DisasterLogo size="large" to="/" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172B4D]">
            About DisasterAssist
          </h1>
          <p className="text-sm text-[#667085] max-w-xl mx-auto leading-relaxed">
            Smart Disaster Victim Assistance & Relief Operations Platform engineered to bridge victims, field rescue squads, safe shelter centers, and vital aid in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl border border-[#E4EAF2] shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#F52D3D] flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#172B4D]">Rapid SOS Broadcast</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Enables citizens in distress to submit precise coordinates, family headcounts, and specialized medical/rescue requirements in under 30 seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E4EAF2] shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1268E8] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#172B4D]">Volunteer Coordination</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Equips frontline volunteers with geo-located task queues, survivor triage info, turn-by-turn navigation, and direct radio communications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E4EAF2] shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#20A464] flex items-center justify-center mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#172B4D]">Live Capacity Tracking</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Monitors shelter beds, food banks, portable water tankers, and essential medical supplies to avoid overcrowding and bottlenecks.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4EAF2] p-8 shadow-sm text-center space-y-4">
          <h2 className="text-xl font-bold text-[#172B4D]">Join the Response Network</h2>
          <p className="text-xs sm:text-sm text-[#667085] max-w-lg mx-auto leading-relaxed">
            Whether you need emergency shelter or want to volunteer your boat, medical, or logistics skills during an active crisis, DisasterAssist is always live.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/emergency"
              className="px-5 py-2.5 bg-[#F52D3D] text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700"
            >
              Get Emergency Help
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-[#1268E8] text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-700"
            >
              Sign Up as Volunteer
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
