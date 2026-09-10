import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, UserX, UserCheck, AlertCircle, Lock } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_FORM = { name: '', age: '', gender: 'Male', lastKnownLocation: '', district: 'Visakhapatnam', clothingDescription: '', identifyingMarks: '', contactPersonName: '', contactPhone: '' };

export default function ReunificationPage() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('search');
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = () => {
    axios.get(`${API}/api/reunification${search ? `?name=${encodeURIComponent(search)}` : ''}`).then((r) => {
      setPersons(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); setLoading(true); load(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/reunification`, { ...form, age: Number(form.age) });
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch { alert('Submission failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const statusColor = { Missing: 'var(--red-critical)', 'Possible Match': 'var(--amber-warning)', Reunited: 'var(--emerald-safe)' };
  const statusBadge = { Missing: 'critical', 'Possible Match': 'high', Reunited: 'open' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Search size={18} color="var(--cyan-medical)" />
          <h2 style={{ fontWeight: 700 }}>Family Reunification Portal</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[{ key: 'search', label: '🔍 Search Missing Persons' }, { key: 'report', label: '📢 Report Missing Person' }].map(({ key, label }) => (
            <button key={key} onClick={() => { setTab(key); setSubmitted(false); }} className={`btn ${tab === key ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, padding: '0.6rem 0.85rem', fontSize: '0.75rem', color: '#93c5fd' }}>
        <Lock size={12} />
        Contact details are only shown to verified rescue coordinators. Personal data is protected under the Disaster Management Act.
      </div>

      {/* Search Tab */}
      {tab === 'search' && (
        <div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input className="form-input" placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {persons.map((p) => (
                <div key={p._id} className="card" style={{ borderColor: `${statusColor[p.status]}30` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${statusColor[p.status]}20`, border: `2px solid ${statusColor[p.status]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        {p.status === 'Reunited' ? <UserCheck size={20} color="var(--emerald-safe)" /> : <UserX size={20} color={statusColor[p.status]} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Age: {p.age} · {p.gender}</div>
                      </div>
                    </div>
                    <span className={`badge badge-${statusBadge[p.status]}`}>{p.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Last Known Location: </span>{p.lastKnownLocation}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>District: </span>{p.district}</div>
                    {p.clothingDescription && <div><span style={{ color: 'var(--text-muted)' }}>Clothing: </span>{p.clothingDescription}</div>}
                    {p.lastSeenShelter && <div><span style={{ color: 'var(--text-muted)' }}>Last Seen Shelter: </span><strong style={{ color: 'var(--emerald-safe)' }}>{p.lastSeenShelter}</strong></div>}
                  </div>

                  {p.matchConfidence > 0 && (
                    <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: 'var(--amber-warning)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <AlertCircle size={13} />
                      <strong>Possible Match — {p.matchConfidence}% confidence</strong>. Coordinators have been notified.
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={10} /> Contact info protected — Report to shelter staff or call 112
                  </div>
                </div>
              ))}
              {persons.length === 0 && !loading && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No records found. Try searching with a different name, or report a new missing person.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Report Tab */}
      {tab === 'report' && (
        submitted ? (
          <div className="card animate-fadeIn" style={{ textAlign: 'center', padding: '2rem', borderColor: 'rgba(16,185,129,0.35)' }}>
            <UserCheck size={48} color="var(--emerald-safe)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--emerald-safe)' }}>Missing Person Report Submitted</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Your report has been registered in the ReliefPulse system. Rescue coordinators and shelter staff will cross-reference this with all persons found in evacuation centers.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">Submit Another Report</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            {[
              { label: 'Missing Person\'s Name *', key: 'name', required: true },
              { label: 'Age *', key: 'age', type: 'number', required: true },
              { label: 'Last Known Location *', key: 'lastKnownLocation', required: true },
              { label: 'Clothing Description', key: 'clothingDescription' },
              { label: 'Identifying Marks', key: 'identifyingMarks' },
              { label: 'Your Name (Reporter) *', key: 'contactPersonName', required: true },
              { label: 'Your Phone Number *', key: 'contactPhone', required: true },
            ].map(({ label, key, type = 'text', required }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                <option>Visakhapatnam</option><option>Kakinada</option><option>East Godavari</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem' }}>
                {submitting ? <><div className="spinner" /> Submitting…</> : '📢 Submit Missing Person Report'}
              </button>
            </div>
          </form>
        )
      )}
    </div>
  );
}
