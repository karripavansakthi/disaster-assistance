import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSocket } from '../services/socket';
import {
  getRequests,
  saveRequests,
  getAlerts,
  saveAlerts,
  addNotification
} from '../data/mockData';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RealtimeEmergencyContext = createContext(null);

// Audio Alert Generator using Web Audio API (cross-browser, zero dependencies)
const playAlertTone = (type = 'sos') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'sos') {
      // 2-tone emergency siren
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Warning chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {
    // User hasn't interacted or audio not allowed
  }
};

export function RealtimeEmergencyProvider({ children }) {
  const [activeOfficialAlert, setActiveOfficialAlert] = useState(null);
  const [liveToast, setLiveToast] = useState(null);

  const showToast = useCallback((toast) => {
    setLiveToast(toast);
    setTimeout(() => {
      setLiveToast((prev) => (prev?.id === toast.id ? null : prev));
    }, 6000);
  }, []);

  useEffect(() => {
    let socket;
    try {
      socket = getSocket();
    } catch {
      // Socket offline fallback
    }

    if (!socket) return;

    // 1. Listen for new SOS created anywhere on the network
    const handleSosCreated = (sos) => {
      playAlertTone('sos');

      const reqId = sos.sosId || sos.id || `REQ${Math.floor(1000 + Math.random() * 9000)}`;
      const currentReqs = getRequests();

      // Check if already in list
      const exists = currentReqs.some((r) => r.id === reqId || r.sosId === reqId);
      if (!exists) {
        const newFormatted = {
          id: reqId,
          sosId: reqId,
          type: sos.disasterType || sos.assistanceType || 'Flood',
          priority: sos.severity ? sos.severity.charAt(0).toUpperCase() + sos.severity.slice(1) : 'Critical',
          status: 'Pending',
          assignedTeam: '-',
          assignedVolunteer: '-',
          victimName: sos.victimName || 'Citizen in Distress',
          peopleAffected: sos.peopleCount || sos.peopleAffected || 1,
          details: sos.description || sos.details || 'Emergency assistance requested via live dispatch',
          location: sos.location?.address || 'GPS Coordinates',
          lat: sos.location?.coordinates?.lat || sos.lat || 17.385,
          lng: sos.location?.coordinates?.lng || sos.lng || 78.4867,
          distance: '0.8 km',
          timeAgo: 'Just now',
          requiredAssistance: sos.assistanceRequired || ['Rescue', 'Medical'],
          timeline: [
            { title: 'Request Received', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
            { title: 'Volunteer Assigned', time: 'Pending', done: false },
            { title: 'Volunteer On The Way', time: 'Pending', done: false },
            { title: 'Assistance Arrived', time: 'Pending', done: false },
            { title: 'Completed', time: 'Pending', done: false }
          ]
        };

        saveRequests([newFormatted, ...currentReqs]);
      }

      addNotification({
        type: 'sos',
        title: `🚨 Emergency SOS Broadcasted!`,
        message: `${sos.disasterType || 'Disaster'} reported: ${sos.location?.address || 'Current sector'}. ${sos.peopleCount || 1} people affected.`,
        link: `/tracker?id=${reqId}`,
      });

      showToast({
        id: `toast-${Date.now()}`,
        type: 'sos',
        title: `🚨 NEW EMERGENCY SOS`,
        message: `${sos.disasterType || 'Disaster'} in ${sos.location?.address || 'your sector'}. ${sos.peopleCount || 1} persons need help.`,
        link: `/tracker?id=${reqId}`,
      });

      window.dispatchEvent(new CustomEvent('da_data_updated'));
    };

    // 2. Listen for SOS status updates (e.g. Volunteer Accepted -> On the way -> Arrived -> Completed)
    const handleSosUpdated = (data) => {
      playAlertTone('update');
      const reqId = data.sosId || data.id;

      const currentReqs = getRequests();
      const updatedList = currentReqs.map((r) => {
        if (r.id === reqId || r.sosId === reqId) {
          const nextStatus = data.status === 'resolved' || data.status === 'completed'
            ? 'Completed'
            : data.status === 'en_route'
            ? 'In Progress'
            : data.status === 'assigned'
            ? 'Assigned'
            : r.status;

          return {
            ...r,
            status: nextStatus,
            assignedVolunteer: data.assignedVolunteer || r.assignedVolunteer,
            assignedTeam: data.assignedTeam?.leader || data.assignedVolunteer || r.assignedTeam,
            phone: data.phone || r.phone,
            timeline: r.timeline ? r.timeline.map((st) => {
              if (data.status === 'assigned' && st.title.includes('Assigned')) return { ...st, done: true, time: 'Just now' };
              if (data.status === 'en_route' && st.title.includes('Way')) return { ...st, done: true, current: true, time: 'In Progress' };
              if (data.status === 'on_scene' && st.title.includes('Arrived')) return { ...st, done: true, time: 'Arrived' };
              if ((data.status === 'resolved' || data.status === 'completed') && st.title.includes('Completed')) return { ...st, done: true, time: 'Completed' };
              return st;
            }) : []
          };
        }
        return r;
      });

      saveRequests(updatedList);

      showToast({
        id: `toast-${Date.now()}`,
        type: 'update',
        title: `📢 SOS Status Updated`,
        message: `Request #${reqId}: ${data.notes || `Status is now ${data.status}`}`,
        link: `/tracker?id=${reqId}`,
      });

      window.dispatchEvent(new CustomEvent('da_data_updated'));
    };

    // 3. Listen for official disaster alerts broadcasted by Admin
    const handleAlertPublished = (alert) => {
      playAlertTone('alert');

      setActiveOfficialAlert(alert);

      // Save into mock store too
      const currentAlerts = getAlerts();
      const newAlert = {
        id: `alert-${Date.now()}`,
        title: alert.title,
        message: alert.message,
        severity: alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'orange' : 'blue',
        authority: alert.issuedBy || 'National Disaster Management Authority (NDMA)',
        timeAgo: 'Just now',
        actionRequired: alert.actionRequired || 'Follow official guidance, move to safe shelter immediately if instructed.',
      };
      saveAlerts([newAlert, ...currentAlerts]);

      window.dispatchEvent(new CustomEvent('da_data_updated'));
    };

    socket.on('sos.created', handleSosCreated);
    socket.on('sos.updated', handleSosUpdated);
    socket.on('alert.published', handleAlertPublished);

    return () => {
      socket.off('sos.created', handleSosCreated);
      socket.off('sos.updated', handleSosUpdated);
      socket.off('alert.published', handleAlertPublished);
    };
  }, [showToast]);

  // Method to accept SOS (called by volunteer)
  const acceptSos = async (id, volunteerInfo = {}) => {
    // 1. Update local storage immediately for zero-lag response
    const currentReqs = getRequests();
    const updated = currentReqs.map((r) => {
      if (r.id === id || r.sosId === id) {
        return {
          ...r,
          status: 'Assigned',
          assignedVolunteer: volunteerInfo.name || 'Suresh (Field Volunteer)',
          assignedTeam: volunteerInfo.name || 'Rapid Volunteer Unit',
          timeline: (r.timeline || []).map((t) =>
            t.title.includes('Assigned') ? { ...t, done: true, time: 'Just now' } : t
          )
        };
      }
      return r;
    });
    saveRequests(updated);
    window.dispatchEvent(new CustomEvent('da_data_updated'));

    // 2. Broadcast via socket so citizen and admin update live
    try {
      const socket = getSocket();
      socket?.emit('sos:update', {
        sosId: id,
        status: 'assigned',
        assignedVolunteer: volunteerInfo.name || 'Suresh (Field Volunteer)',
        phone: volunteerInfo.phone || '+91 98490 12345',
        notes: `${volunteerInfo.name || 'Volunteer'} accepted the mission and is preparing dispatch.`
      });
    } catch {}

    // 3. Post to backend
    try {
      await axios.post(`${API}/api/emergency/${id}/accept`, {
        volunteerName: volunteerInfo.name || 'Suresh (Field Volunteer)',
        volunteerPhone: volunteerInfo.phone || '+91 98490 12345',
        volunteerId: volunteerInfo.id || null
      });
    } catch {}
  };

  // Method to update SOS progress (Accepted -> On the way -> Arrived -> Completed)
  const updateSosStatus = async (id, newStatus, notes = '') => {
    // 1. Update local storage
    const currentReqs = getRequests();
    const updated = currentReqs.map((r) => {
      if (r.id === id || r.sosId === id) {
        return {
          ...r,
          status: newStatus === 'resolved' || newStatus === 'Completed' ? 'Completed' : 'In Progress',
          timeline: (r.timeline || []).map((t) => {
            if (newStatus === 'en_route' && t.title.includes('Way')) return { ...t, done: true, current: true, time: 'In Progress' };
            if (newStatus === 'on_scene' && t.title.includes('Arrived')) return { ...t, done: true, time: 'Arrived' };
            if ((newStatus === 'resolved' || newStatus === 'Completed') && t.title.includes('Completed')) return { ...t, done: true, time: 'Completed' };
            return t;
          })
        };
      }
      return r;
    });
    saveRequests(updated);
    window.dispatchEvent(new CustomEvent('da_data_updated'));

    // 2. Emit socket event
    try {
      const socket = getSocket();
      socket?.emit('sos:update', {
        sosId: id,
        status: newStatus,
        notes: notes || `Mission status updated to ${newStatus}`
      });
    } catch {}

    // 3. Patch to backend
    try {
      await axios.patch(`${API}/api/emergency/${id}/status`, {
        status: newStatus,
        notes
      });
    } catch {}
  };

  // Method to broadcast official disaster alert (called by Admin)
  const broadcastOfficialAlert = async (alertData) => {
    // 1. Save locally
    const currentAlerts = getAlerts();
    const formatted = {
      id: `alert-${Date.now()}`,
      title: alertData.title,
      message: alertData.message,
      severity: alertData.severity === 'critical' ? 'red' : 'orange',
      authority: alertData.issuedBy || 'National Disaster Management Authority (NDMA)',
      timeAgo: 'Just now',
      actionRequired: alertData.actionRequired || 'Evacuate or seek designated shelter.',
    };
    saveAlerts([formatted, ...currentAlerts]);
    window.dispatchEvent(new CustomEvent('da_data_updated'));

    // 2. Emit via socket
    try {
      const socket = getSocket();
      socket?.emit('alert:publish', alertData);
    } catch {}

    // 3. Post to backend
    try {
      await axios.post(`${API}/api/alerts`, alertData);
    } catch {}
  };

  return (
    <RealtimeEmergencyContext.Provider
      value={{
        activeOfficialAlert,
        clearOfficialAlert: () => setActiveOfficialAlert(null),
        acceptSos,
        updateSosStatus,
        broadcastOfficialAlert,
      }}
    >
      {children}

      {/* Floating Real-Time Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-slate-900/95 dark:bg-slate-900/95 text-white p-4 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-md animate-slideUp font-sans">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              liveToast.type === 'sos' ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
            }`}>
              <span className="text-sm font-bold">{liveToast.type === 'sos' ? '🚨' : '📢'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                {liveToast.title}
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug line-clamp-2">
                {liveToast.message}
              </p>
              {liveToast.link && (
                <a
                  href={liveToast.link}
                  className="inline-block mt-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
                >
                  View Details & Live Route ➔
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => setLiveToast(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </RealtimeEmergencyContext.Provider>
  );
}

export const useRealtimeEmergency = () => {
  const context = useContext(RealtimeEmergencyContext);
  if (!context) {
    throw new Error('useRealtimeEmergency must be used within RealtimeEmergencyProvider');
  }
  return context;
};

export default RealtimeEmergencyContext;
