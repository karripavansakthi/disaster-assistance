import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  Send,
  X,
  Minus,
  Maximize2,
  Phone,
  Shield,
  LifeBuoy,
  MapPin,
  HeartPulse,
  Droplets,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createEmergencyRequest } from '../data/mockData';

const PRESET_QUICK_ACTIONS = [
  { id: 'sos', label: '🚨 Immediate SOS Evacuation', query: 'I need immediate SOS rescue for my family!' },
  { id: 'flood', label: '🌊 Flood Survival Protocol', query: 'Water level is rising around my house, what should I do?' },
  { id: 'firstaid', label: '🏥 First Aid Emergency', query: 'How to treat severe bleeding and injury right now?' },
  { id: 'shelter', label: '🏠 Nearest Available Shelter', query: 'Where is the nearest safe shelter with available beds?' },
  { id: 'hotline', label: '📞 National Helplines', query: 'Give me emergency disaster contact numbers.' }
];

const INITIAL_MESSAGES = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    text: `🚨 **DisasterAssist Emergency SOS Chat**\n\nI am your live disaster triage assistant. If you or your family are in danger, I can assist you with immediate survival steps or log an urgent SOS dispatch.\n\nSelect a quick action below or describe your emergency:`,
    time: 'Now',
    isWelcome: true
  }
];

export default function SOSChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // AI Knowledge Engine response generator
  const generateEmergencyResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('sos') || text.includes('rescue') || text.includes('trapped') || text.includes('immediate')) {
      return {
        reply: `⚠️ **URGENT SOS PROTOCOL ACTIVATED**\n\n1. **Move to highest floor or roof**: Avoid attics without roof exits.\n2. **Signal Responders**: Display a bright cloth, white sheet, or use phone flashlight.\n3. **Do not walk through moving floodwater** (6 inches of moving water can sweep an adult).\n4. **Stay Off Power Lines**: Disconnect main circuit breaker if safely accessible.\n\nWould you like me to automatically dispatch a rescue team to your GPS location?`,
        hasDispatchButton: true
      };
    }

    if (text.includes('flood') || text.includes('water') || text.includes('rain') || text.includes('drown')) {
      return {
        reply: `🌊 **Flood Survival & Evacuation Guidelines**:\n\n• **Immediate Actions**: Disconnect gas and power immediately before water enters.\n• **Vertical Movement**: Evacuate to higher floors. Keep emergency grab-bag with ID, medicines, and drinking water.\n• **Safe Shelter**: **Safe Haven Relief Center** (1.2 km away) has **173 beds** and hot meals ready.\n• **Evacuation Hotline**: Call **112** or **1070** for municipal boat rescue.`
      };
    }

    if (text.includes('bleed') || text.includes('medical') || text.includes('first aid') || text.includes('injury') || text.includes('fracture') || text.includes('heart')) {
      return {
        reply: `🏥 **Immediate Medical First Aid Advice**:\n\n• **Severe Bleeding**: Apply firm, continuous direct pressure using clean cloth or sterile gauze. Keep elevated above heart level if possible.\n• **Fractures / Trauma**: Keep the limb completely immobilized with a splint or rolled towel. Do not attempt to reset bones.\n• **Hypothermia / Wet Clothes**: Remove saturated garments and wrap in dry blankets/foil sheets.\n• **Medical Camp**: The nearest **Medical Camp** is active at 3.1 km with doctors on duty.`
      };
    }

    if (text.includes('shelter') || text.includes('bed') || text.includes('stay') || text.includes('camp') || text.includes('evacuate')) {
      return {
        reply: `🏠 **Verified Relief Centers Near You**:\n\n1. **Safe Haven Relief Center** — 1.2 km away\n   • Available: **173 beds**\n   • Facilities: Food, Water, Medical, Beds\n   • Phone: +91 40 2345 6781\n\n2. **Green Valley Shelter** — 2.8 km away\n   • Available: **180 beds**\n   • Facilities: Food, Water, Bedding\n\nYou can click below to view complete directions and availability.`
      };
    }

    if (text.includes('helpline') || text.includes('phone') || text.includes('number') || text.includes('contact') || text.includes('police')) {
      return {
        reply: `📞 **National Disaster Emergency Helplines (24/7 Free)**:\n\n• **All Emergencies / Police / Ambulance**: **112**\n• **NDRF Disaster Response**: **1078**\n• **State Disaster Management Office**: **1070**\n• **Medical Ambulance Dispatch**: **108**\n• **Fire & Rescue**: **101**`
      };
    }

    return {
      reply: `ℹ️ **DisasterAssist Response**:\n\nWe have logged your request. Our emergency network coordinates rescue teams, medical volunteers, and safe shelters.\n\n• For immediate life danger: Dial **112**.\n• To submit a geo-tagged incident report, use the **Emergency Request** form or click the quick action chips.`
    };
  };

  const handleSend = (textToSend = input) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateEmergencyResponse(cleanText);
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        hasDispatchButton: response.hasDispatchButton,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleTriggerInstantSOS = () => {
    const newReq = createEmergencyRequest({
      type: 'Flood',
      priority: 'Critical',
      location: '17.3850, 78.4867 (Live GPS SOS Triage)',
      peopleAffected: 4,
      requiredAssistance: ['Rescue', 'Medical', 'Shelter'],
      details: 'Instant emergency SOS signal generated via DisasterAssist AI Chatbox.'
    });

    setSosSent(true);

    setMessages((prev) => [
      ...prev,
      {
        id: `sos-${Date.now()}`,
        sender: 'assistant',
        text: `✅ **EMERGENCY SOS LOGGED: #${newReq.id}**\n\nYour emergency signal has been broadcast to Sector Command and nearest Rescue Units.\n• Priority: **CRITICAL**\n• Status: **DISPATCHING**\n• Coordinates: Verified GPS\n\nResponders have been notified. Stay in a safe, elevated location.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Launcher Button */}
      {!isOpen && (
        <div 
          className="fixed bottom-5 right-5 z-[99999] sos-chatbox-container flex items-center gap-2 select-none animate-bounce-subtle"
          style={{ zIndex: 99999 }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#F52D3D] hover:bg-[#dc2030] text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-500/35 border-2 border-white ring-2 ring-red-500/50 transition-all hover:scale-105"
            aria-label="Open SOS Emergency Chat"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            <span className="tracking-wide">SOS Emergency Chat</span>
          </button>
        </div>
      )}

      {/* Floating Chatbox Container */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] sos-chatbox-container w-[94vw] sm:w-[420px] bg-white dark:bg-[#0d1726] rounded-2xl border border-[#E4EAF2] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'h-14' : 'h-[560px] max-h-[88vh]'
          }`}
          style={{ zIndex: 99999 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#062B4C] via-[#08345A] to-[#062B4C] text-white px-4 py-3 flex items-center justify-between border-b border-[#0A3D69] select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F52D3D] flex items-center justify-center text-white shadow-xs">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold tracking-tight flex items-center gap-1.5">
                  DisasterAssist SOS AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  Live Response & Survival Guidance
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content (if not minimized) */}
          {!isMinimized && (
            <>
              {/* Quick Action Chips Horizontal Bar */}
              <div className="p-2.5 bg-slate-50 dark:bg-[#070d18] border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
                {PRESET_QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleSend(action.query)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-[#0d1726] hover:bg-red-50 dark:hover:bg-slate-800 border border-[#E4EAF2] dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-[#F52D3D] whitespace-nowrap transition-all shadow-xs"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F3F7FC]/50 dark:bg-[#070d18]/40">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-400 font-semibold mb-0.5 px-1">
                        {isUser ? 'You' : 'SOS Assistant'} • {msg.time}
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#1268E8] text-white rounded-br-none shadow-sm'
                            : 'bg-white dark:bg-[#0d1726] text-[#172B4D] dark:text-slate-100 border border-[#E4EAF2] dark:border-slate-800 rounded-bl-none shadow-sm whitespace-pre-wrap'
                        }`}
                      >
                        {msg.text}

                        {/* Interactive SOS Dispatch Button inside AI Response */}
                        {msg.hasDispatchButton && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={handleTriggerInstantSOS}
                              className="w-full py-2 px-3 rounded-lg bg-[#F52D3D] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Dispatch Rescue Squad Now</span>
                            </button>
                            <Link
                              to="/victim/emergency-request"
                              onClick={() => setIsOpen(false)}
                              className="text-center text-[11px] font-bold text-[#1268E8] hover:underline"
                            >
                              Open Full Emergency Assistance Form →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] font-medium ml-1">Analyzing incident...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Instant Emergency SOS 1-Click Action Strip */}
              <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/40 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#F52D3D] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Life Danger?
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:112"
                    className="font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call 112
                  </a>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleTriggerInstantSOS}
                    className="font-bold text-[#F52D3D] hover:underline"
                  >
                    1-Click SOS
                  </button>
                </div>
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-white dark:bg-[#0d1726] border-t border-[#E4EAF2] dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your emergency or location..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#E4EAF2] dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#172B4D] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#1268E8]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-[#1268E8] hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shrink-0 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
