import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Send, User, Shield } from 'lucide-react';

export default function VolunteerMessages() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dispatch Commander', time: '10:15 AM', text: 'Team Bravo, proceed to Ward 7 River View. Water level cresting.' },
    { id: 2, sender: 'You', time: '10:18 AM', text: 'Received. Inflatable boat deployed, 2 crew members with life jackets on board.' },
    { id: 3, sender: 'Dispatch Commander', time: '10:22 AM', text: 'Copy that. Contact Ramesh Kumar at +91 98451 23456 upon arrival.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: 'You', time: 'Just now', text: input }
    ]);
    setInput('');
  };

  return (
    <DashboardLayout
      title="Field Communications"
      subtitle="Encrypted dispatch channel with emergency control room"
      roleOverride="volunteer"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E4EAF2] shadow-sm flex flex-col h-[520px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-[#172B4D]">Operations Radio Net #3 (Rescue Ops)</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Live Link
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-slate-400 mb-0.5 font-semibold">
                {m.sender} • {m.time}
              </div>
              <div
                className={`max-w-md p-3 rounded-xl text-xs ${
                  m.sender === 'You'
                    ? 'bg-[#1268E8] text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type field status report..."
            className="flex-1 px-3.5 py-2 rounded-lg border border-[#E4EAF2] text-xs text-[#172B4D] focus:outline-none focus:border-[#1268E8]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1268E8] text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
