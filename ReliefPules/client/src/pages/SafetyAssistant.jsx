import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SosModal from '../components/SosModal';
import {
  ShieldCheck,
  AlertTriangle,
  Wind,
  Droplets,
  Flame,
  Activity,
  Sun,
  Mountain,
  CheckSquare,
  Square,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Briefcase,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

const HAZARDS = [
  {
    id: 'cyclone',
    name: 'Cyclone & Gale Winds',
    icon: Wind,
    color: 'text-blue-500 bg-blue-50',
    severity: 'High Storm Surge Risk',
    before: [
      'Inspect roof tiles, window shutters, and clear overhanging tree branches near powerlines.',
      'Charge cellphones, emergency lanterns, and external battery power banks fully.',
      'Keep your Emergency Go-Bag and waterproof document pouch within immediate arm reach.',
      'Store at least 15 liters of drinking water in clean sealed containers per person.'
    ],
    during: [
      'Stay strictly indoors away from glass windows, skylights, and exterior doors.',
      'Switch off the main electrical breaker switch and close LPG cylinder valves.',
      'Beware the calm "eye of the cyclone" — winds will violently reverse direction shortly.',
      'Listen to battery-powered radio for official NDMA / IMD emergency instructions.'
    ],
    after: [
      'Watch out for broken electrical cables hanging in standing rainwater.',
      'Do not consume open tap water until boiled thoroughly or treated with halogen tablets.',
      'Inspect exterior walls for structural fractures before re-entering evacuated homes.',
      'Keep clear of fallen trees, unstable masonry, and damaged road culverts.'
    ]
  },
  {
    id: 'flood',
    name: 'Flash Flood & Inundation',
    icon: Droplets,
    color: 'text-cyan-600 bg-cyan-50',
    severity: 'Rapid Water Rise',
    before: [
      'Elevate electronic appliances, food sacks, and critical medicines above maximum flood line.',
      'Identify the nearest high-elevation municipal shelter and verified escape routes.',
      'Install non-return valves in sewage pipes to stop contaminated backflow.'
    ],
    during: [
      'Never walk, swim, or drive through moving floodwaters. Just 15 cm of rapid water can sweep adults.',
      'Move immediately to the highest floor or reinforced rooftop if ground level breaches.',
      'Signal rescue boats with a bright orange cloth, flashlight, or loud emergency whistle.',
      'Avoid touching electrical equipment if your hands are wet or standing in water.'
    ],
    after: [
      'Disinfect all items and surfaces contacted by contaminated floodwaters.',
      'Be alert for venomous snakes and rodents seeking dry shelter inside dwellings.',
      'Discard all perishable food that has been immersed in flood water.'
    ]
  },
  {
    id: 'earthquake',
    name: 'Earthquake & Tremors',
    icon: Activity,
    color: 'text-amber-600 bg-amber-50',
    severity: 'Structural Hazard',
    before: [
      'Anchor heavy bookcases, water heaters, and mirrors securely to wall studs.',
      'Identify safe interior spots: under sturdy tables or against interior load-bearing walls.',
      'Practice "Drop, Cover, and Hold On" with family members.'
    ],
    during: [
      'DROP to your hands and knees. COVER your head and neck under a sturdy table or desk.',
      'HOLD ON to your shelter until violent shaking completely ceases.',
      'Do NOT use elevators. If outdoors, move to an open area away from buildings and utility poles.',
      'If in bed, stay there and protect your head with a firm pillow.'
    ],
    after: [
      'Expect aftershocks. Be prepared to Drop, Cover, and Hold On again.',
      'Smell for gas leaks. If detected, open windows and evacuate immediately without flipping electrical switches.',
      'Check yourself and neighbors for injuries and apply first aid immediately.'
    ]
  },
  {
    id: 'fire',
    name: 'Urban & Building Fire',
    icon: Flame,
    color: 'text-red-500 bg-red-50',
    severity: 'Rapid Combustion',
    before: [
      'Install smoke detectors on every level and test batteries quarterly.',
      'Keep ABC-type dry powder fire extinguishers accessible in kitchens and hallways.',
      'Establish two clear escape routes from every room.'
    ],
    during: [
      'CRAWL LOW under smoke where air is cleaner and cooler.',
      'Feel closed doors with the back of your hand before turning handles; if hot, do not open.',
      'STOP, DROP, and ROLL immediately if your clothing catches fire.',
      'Never use elevators during a fire evacuation; use marked fire stairwells.'
    ],
    after: [
      'Never re-enter a burning or extinguished building until the Fire Marshal declares it safe.',
      'Seek professional medical evaluation for smoke inhalation even if uninjured.'
    ]
  },
  {
    id: 'landslide',
    name: 'Landslide & Mudflow',
    icon: Mountain,
    color: 'text-emerald-600 bg-emerald-50',
    severity: 'Slope Instability',
    before: [
      'Inspect slopes and retaining walls for widening cracks, tilting trees, or new springs of water.',
      'Evacuate hillside dwellings during continuous heavy torrential downpours.'
    ],
    during: [
      'Listen for unusual sounds such as cracking trees, rumbling boulders, or sudden water surges.',
      'If caught in a mudflow, curl into a tight ball and protect your head with arms.'
    ],
    after: [
      'Stay away from the slide area. Secondary slides frequently occur following the initial movement.'
    ]
  },
  {
    id: 'heatwave',
    name: 'Severe Heatwave',
    icon: Sun,
    color: 'text-orange-500 bg-orange-50',
    severity: 'Hyperthermia Risk',
    before: [
      'Stock ORS (Oral Rehydration Salts), electrolyte packets, and clean potable water.',
      'Hang dark curtains or reflective sunscreens on sun-facing windows.'
    ],
    during: [
      'Drink water frequently even if not thirsty. Avoid alcohol, caffeine, and heavy sugary drinks.',
      'Stay indoors between 11:00 AM and 4:00 PM during peak solar radiation.',
      'If someone displays heatstroke symptoms (confusion, cessation of sweating, high fever), cool them with wet towels and call 108 immediately.'
    ],
    after: [
      'Continue slow hydration and replenish lost body salts with light soups and coconut water.'
    ]
  }
];

const DEFAULT_KIT_ITEMS = [
  { id: 'kit-1', label: '3-Day Water Supply (3 Liters per person per day)', checked: true },
  { id: 'kit-2', label: 'Non-perishable ready-to-eat dry rations & energy bars', checked: true },
  { id: 'kit-3', label: 'First Aid Kit (sterile gauze, antiseptic, bandages, scissors)', checked: true },
  { id: 'kit-4', label: 'Waterproof Pouch with Aadhaar, ID, Property Deeds, and Cash', checked: false },
  { id: 'kit-5', label: 'LED Flashlight & Rechargeable Headlamp with spare batteries', checked: true },
  { id: 'kit-6', label: 'Emergency Whistle for acoustic acoustic search signaling', checked: false },
  { id: 'kit-7', label: 'Hand-crank or Battery Radio for official IMD alerts', checked: false },
  { id: 'kit-8', label: 'Personal Prescription Medications (at least 7 days supply)', checked: true },
  { id: 'kit-9', label: 'High-capacity Portable Power Bank & Charging Cables', checked: true },
  { id: 'kit-10', label: 'Multi-tool knife, duct tape, and heavy-duty work gloves', checked: false }
];

export default function SafetyAssistant() {
  const [selectedHazardId, setSelectedHazardId] = useState('cyclone');
  const [activeTab, setActiveTab] = useState('during'); // 'before' | 'during' | 'after'
  const [kitItems, setKitItems] = useState(() => {
    try {
      const saved = localStorage.getItem('da_emergency_kit');
      return saved ? JSON.parse(saved) : DEFAULT_KIT_ITEMS;
    } catch {
      return DEFAULT_KIT_ITEMS;
    }
  });
  const [sosOpen, setSosOpen] = useState(false);

  const toggleKitItem = (id) => {
    const updated = kitItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
    setKitItems(updated);
    try {
      localStorage.setItem('da_emergency_kit', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const selectedHazard = HAZARDS.find((h) => h.id === selectedHazardId) || HAZARDS[0];
  const checkedCount = kitItems.filter((i) => i.checked).length;
  const readinessPct = Math.round((checkedCount / kitItems.length) * 100);

  return (
    <div className="min-h-screen bg-[#F3F7FC] text-[#172B4D] flex flex-col font-sans">
      <Navbar />

      {/* Header */}
      <div className="bg-[#062B4C] text-white py-12 px-5 sm:px-8 border-b border-[#0A3D69]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Civil Defense & Citizen Preparedness
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Interactive Safety Assistant & Emergency Kit
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
                Standardized NDMA safety protocols for 6 critical disaster hazards, paired with your personalized offline survival checklist.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSosOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F52D3D] hover:bg-[#dc2030] text-white text-sm sm:text-base font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 shrink-0"
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <span>In Immediate Danger? Trigger SOS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 Columns: Disaster Protocols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hazard Selector Pills */}
            <div className="bg-white p-4 rounded-2xl border border-[#E4EAF2] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                Select Disaster Scenario
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {HAZARDS.map((h) => {
                  const Icon = h.icon;
                  const isSelected = h.id === selectedHazardId;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setSelectedHazardId(h.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-[#1268E8] bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${h.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-[#1268E8]' : 'text-slate-800'}`}>
                          {h.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Protocol Display Card */}
            <div className="bg-white rounded-2xl border border-[#E4EAF2] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-[#172B4D]">{selectedHazard.name}</h2>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                      {selectedHazard.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Verified standard operating procedure for civil safety</p>
                </div>

                {/* Tab Controls: Before, During, After */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('before')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'before' ? 'bg-white text-[#1268E8] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('during')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'during' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    During (Crisis)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('after')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'after' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Aftermath
                  </button>
                </div>
              </div>

              {/* Protocol Instructions List */}
              <div className="p-6">
                <div className="space-y-3.5">
                  {selectedHazard[activeTab].map((instruction, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-slate-100 bg-[#F9FBFE] flex items-start gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#1268E8]/10 text-[#1268E8] flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span>Follow local emergency services siren announcements strictly.</span>
                  </div>
                  <Link to="/emergency" className="font-bold text-[#1268E8] hover:underline flex items-center gap-1">
                    <span>File Incident</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: My Emergency Kit Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#172B4D]">My Emergency Survival Kit</h3>
                    <p className="text-xs text-slate-500">72-Hour Preparedness Checklist</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-600">{readinessPct}% Ready</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
                <div
                  className={`h-full transition-all duration-500 ${
                    readinessPct >= 80 ? 'bg-emerald-500' : readinessPct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${readinessPct}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {kitItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleKitItem(item.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      item.checked
                        ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.checked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className={`text-xs leading-relaxed font-medium ${item.checked ? 'text-slate-800' : 'text-slate-600'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {checkedCount} of {kitItems.length} items packed
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allDone = kitItems.map((i) => ({ ...i, checked: true }));
                    setKitItems(allDone);
                    localStorage.setItem('da_emergency_kit', JSON.stringify(allDone));
                  }}
                  className="font-bold text-[#1268E8] hover:underline"
                >
                  Mark All Complete
                </button>
              </div>
            </div>

            {/* Quick Emergency Broadcast Card */}
            <div className="bg-gradient-to-br from-[#062B4C] to-[#0A3D69] text-white p-6 rounded-2xl shadow-md border border-white/10">
              <h4 className="font-extrabold text-sm text-white mb-2">Emergency Voice Contacts</h4>
              <p className="text-xs text-slate-300 mb-4">Keep these official disaster helpline numbers saved in your speed dial:</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
                  <span className="text-slate-200">NDRF Rescue Operations:</span>
                  <a href="tel:01124363260" className="font-bold text-red-300 hover:underline">011-24363260</a>
                </div>
                <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
                  <span className="text-slate-200">State Disaster Management:</span>
                  <a href="tel:1070" className="font-bold text-emerald-300 hover:underline">1070 (Toll Free)</a>
                </div>
                <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
                  <span className="text-slate-200">Medical Trauma Dispatch:</span>
                  <a href="tel:108" className="font-bold text-amber-300 hover:underline">108 (24/7)</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SosModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
