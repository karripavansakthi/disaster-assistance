import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Ambulance, Users, BedDouble, Droplets, Phone, MapPin } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MedicalPage() {
  const [hospitals, setHospitals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/medical/hospitals`),
      axios.get(`${API}/api/medical/summary`),
    ]).then(([hRes, sRes]) => {
      setHospitals(hRes.data.data || []);
      setSummary(sRes.data.data || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = { Available: 'var(--emerald-safe)', Limited: 'var(--amber-warning)', Critical: 'var(--red-critical)' };
  const medColor = { Available: 'open', Limited: 'limited', Critical: 'full' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Heart size={18} color="var(--red-critical)" />
        <h2 style={{ fontWeight: 700 }}>Medical Support — Hospitals & Emergency Services</h2>
      </div>

      {summary && (
        <div className="stats-grid-4">
          {[
            { label: 'Total Doctors', value: summary.totalDoctors, color: 'var(--cyan-medical)' },
            { label: 'Total Nurses', value: summary.totalNurses, color: '#a855f7' },
            { label: 'Ambulances', value: summary.totalAmbulances, color: 'var(--amber-warning)' },
            { label: 'Available Beds', value: summary.totalAvailableBeds, color: 'var(--emerald-safe)' },
            { label: 'ICU Beds', value: summary.totalIcuBeds, color: 'var(--red-critical)' },
            { label: 'Blood Units', value: summary.totalBloodUnits, color: '#f87171' },
            { label: 'Hospitals', value: summary.totalHospitals, color: 'var(--blue-info)' },
            { label: 'Critical Hospitals', value: summary.criticalHospitals, color: 'var(--red-critical)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card">
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
              <div className="stat-number" style={{ fontSize: '1.5rem', color }}>{value?.toLocaleString() || 0}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hospitals.map((h) => (
            <div key={h._id} className="card" style={{ borderColor: `${statusColor[h.status]}30` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>🏥 {h.name}</h3>
                    <span className={`badge badge-${medColor[h.status] || 'moderate'}`}>{h.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {h.address}
                  </div>
                </div>
                <a href={`tel:${h.contactPhone}`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', flexShrink: 0 }}>
                  <Phone size={12} /> Call
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { icon: Users, label: 'Doctors', value: h.doctorsCount, color: 'var(--cyan-medical)' },
                  { icon: Users, label: 'Nurses', value: h.nursesCount, color: '#a855f7' },
                  { icon: Ambulance, label: 'Ambulances', value: h.ambulances, color: 'var(--amber-warning)' },
                  { icon: BedDouble, label: 'Avail Beds', value: h.availableBeds, color: 'var(--emerald-safe)' },
                  { icon: BedDouble, label: 'ICU Beds', value: h.icuBeds, color: 'var(--red-critical)' },
                  { icon: BedDouble, label: 'Total Beds', value: h.totalBeds, color: 'var(--text-secondary)' },
                  { icon: Droplets, label: 'Blood Units', value: h.bloodUnits, color: '#f87171' },
                  { icon: Heart, label: 'Medicines', value: h.essentialMedicineStatus, color: statusColor[h.essentialMedicineStatus] || 'var(--text-primary)' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.6rem 0.75rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                    <Icon size={14} color={color} style={{ marginBottom: 4 }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
