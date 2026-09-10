import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Star, AlertTriangle, CheckCircle, MessageSquare, Send, ThumbsUp } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Flooded Road',
  'Blocked Road',
  'Damaged Building',
  'Missing Person',
  'Medical Emergency',
  'Unsafe Shelter',
  'Resource Shortage',
  'Other Emergency',
];

const SEVERITIES = ['Critical', 'High', 'Moderate', 'Low'];

export default function ReportsPage() {
  const [tab, setTab] = useState('incidents'); // incidents | feedback
  const [incidents, setIncidents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [incidentForm, setIncidentForm] = useState({
    category: 'Flooded Road',
    description: '',
    address: '',
    district: 'Visakhapatnam',
    severity: 'High',
    reporterName: '',
    phone: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({
    shelterName: '',
    survivorName: '',
    cleanlinessRating: 4,
    foodRating: 4,
    medicalRating: 4,
    staffResponseRating: 5,
    comments: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState('');

  const loadData = async () => {
    try {
      const [incRes, fbRes, shRes] = await Promise.all([
        axios.get(`${API}/api/incidents`),
        axios.get(`${API}/api/feedback`),
        axios.get(`${API}/api/shelters`),
      ]);
      setIncidents(incRes.data.data || []);
      setFeedbacks(fbRes.data.data || []);
      const shList = shRes.data.data || [];
      setShelters(shList);
      if (shList.length > 0 && !feedbackForm.shelterName) {
        setFeedbackForm((prev) => ({ ...prev, shelterName: shList[0].name }));
      }
    } catch {
      // Fallback gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/incidents`, {
        category: incidentForm.category,
        description: incidentForm.description,
        location: {
          address: incidentForm.address,
          district: incidentForm.district,
          lat: 17.72 + (Math.random() * 0.05 - 0.025),
          lng: 83.30 + (Math.random() * 0.05 - 0.025),
        },
        severity: incidentForm.severity,
        reportedBy: {
          name: incidentForm.reporterName || 'Citizen',
          phone: incidentForm.phone,
        },
      });
      setSubmittedMsg('Incident report dispatched to NDRF & Disaster Command Center.');
      setIncidentForm({
        category: 'Flooded Road',
        description: '',
        address: '',
        district: 'Visakhapatnam',
        severity: 'High',
        reporterName: '',
        phone: '',
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit incident');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/feedback`, feedbackForm);
      setSubmittedMsg('Survivor feedback recorded. Shelter Admin notified.');
      setFeedbackForm((prev) => ({
        ...prev,
        comments: '',
      }));
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const sevBadge = {
    Critical: 'badge-critical',
    High: 'badge-high',
    Moderate: 'badge-moderate',
    Low: 'badge-low',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={20} color="var(--amber-warning)" />
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Citizen Incident Reports & Survivor Feedback</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time ground intelligence and evacuation shelter ratings
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => { setTab('incidents'); setSubmittedMsg(''); }}
            className={`btn ${tab === 'incidents' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
          >
            ⚠️ Ground Incidents ({incidents.length})
          </button>
          <button
            onClick={() => { setTab('feedback'); setSubmittedMsg(''); }}
            className={`btn ${tab === 'feedback' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
          >
            ⭐ Shelter Evaluations ({feedbacks.length})
          </button>
        </div>
      </div>

      {submittedMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: 'var(--emerald-safe)', fontSize: '0.85rem' }}>
          <CheckCircle size={16} />
          <span>{submittedMsg}</span>
        </div>
      )}

      {/* ── INCIDENTS TAB ────────────────────────────────────────── */}
      {tab === 'incidents' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.25rem', alignItems: 'start' }}>
          {/* Incident List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recent Field Incident Reports</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live Geo-Tagged Reports</span>
            </div>

            {loading ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : incidents.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No incidents reported.</div>
            ) : (
              incidents.map((inc) => (
                <div key={inc._id} className="card" style={{ borderLeft: `4px solid ${inc.severity === 'Critical' ? 'var(--red-critical)' : inc.severity === 'High' ? 'var(--amber-warning)' : 'var(--blue-info)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{inc.category}</span>
                      <span className={`badge ${sevBadge[inc.severity] || 'badge-moderate'}`}>{inc.severity}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(inc.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                    {inc.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                    <span>📍 {inc.location?.address} ({inc.location?.district})</span>
                    <span>Status: <strong style={{ color: inc.status === 'Resolved' ? 'var(--emerald-safe)' : 'var(--amber-warning)' }}>{inc.status}</strong></span>
                  </div>

                  {inc.roadStatusNote && (
                    <div style={{ marginTop: '0.4rem', background: 'rgba(245,158,11,0.08)', borderRadius: 6, padding: '0.35rem 0.6rem', fontSize: '0.73rem', color: 'var(--amber-warning)' }}>
                      ⚠️ Route Advisory: {inc.roadStatusNote}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Report New Incident Form */}
          <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--amber-warning)' }}>📢 Report Field Incident</h3>
            </div>
            <form onSubmit={handleIncidentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Incident Category *</label>
                <select
                  className="form-input"
                  value={incidentForm.category}
                  onChange={(e) => setIncidentForm({ ...incidentForm, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <select
                  className="form-input"
                  value={incidentForm.severity}
                  onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Landmark *</label>
                <input
                  className="form-input"
                  required
                  placeholder="Street, bridge name, or village..."
                  value={incidentForm.address}
                  onChange={(e) => setIncidentForm({ ...incidentForm, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <select
                  className="form-input"
                  value={incidentForm.district}
                  onChange={(e) => setIncidentForm({ ...incidentForm, district: e.target.value })}
                >
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Kakinada">Kakinada</option>
                  <option value="East Godavari">East Godavari</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Incident Description *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="Water depth, blocked lanes, structural hazards..."
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    className="form-input"
                    placeholder="Optional"
                    value={incidentForm.reporterName}
                    onChange={(e) => setIncidentForm({ ...incidentForm, reporterName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    placeholder="Optional"
                    value={incidentForm.phone}
                    onChange={(e) => setIncidentForm({ ...incidentForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700 }}
              >
                {submitting ? 'Submitting...' : 'Dispatch Incident Alert'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── FEEDBACK TAB ─────────────────────────────────────────── */}
      {tab === 'feedback' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.25rem', alignItems: 'start' }}>
          {/* Feedback Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Verified Survivor Feedback</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Continuous Shelter Quality Monitoring</span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No feedback recorded yet.</div>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb._id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyan-medical)' }}>
                      🏠 {fb.shelterName}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      By {fb.survivorName || 'Anonymous'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    "{fb.comments || 'No written commentary provided.'}"
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: 8, textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cleanliness</div>
                      <div style={{ fontWeight: 800, color: 'var(--amber-warning)', fontSize: '0.85rem' }}>⭐ {fb.cleanlinessRating}/5</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Food</div>
                      <div style={{ fontWeight: 800, color: 'var(--amber-warning)', fontSize: '0.85rem' }}>⭐ {fb.foodRating}/5</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Medical</div>
                      <div style={{ fontWeight: 800, color: 'var(--amber-warning)', fontSize: '0.85rem' }}>⭐ {fb.medicalRating}/5</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Staff</div>
                      <div style={{ fontWeight: 800, color: 'var(--amber-warning)', fontSize: '0.85rem' }}>⭐ {fb.staffResponseRating}/5</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Feedback Submission Form */}
          <div className="card" style={{ borderColor: 'rgba(6,182,212,0.3)' }}>
            <div className="card-header">
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--cyan-medical)' }}>⭐ Rate Evacuation Shelter</h3>
            </div>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Select Evacuation Shelter *</label>
                <select
                  className="form-input"
                  value={feedbackForm.shelterName}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, shelterName: e.target.value })}
                >
                  {shelters.map((s) => (
                    <option key={s._id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Survivor / Resident Name</label>
                <input
                  className="form-input"
                  placeholder="Optional (or Anonymous)"
                  value={feedbackForm.survivorName}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, survivorName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Cleanliness (1-5)</label>
                  <select
                    className="form-input"
                    value={feedbackForm.cleanlinessRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, cleanlinessRating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Food Supply (1-5)</label>
                  <select
                    className="form-input"
                    value={feedbackForm.foodRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, foodRating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Medical Care (1-5)</label>
                  <select
                    className="form-input"
                    value={feedbackForm.medicalRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, medicalRating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Staff Response (1-5)</label>
                  <select
                    className="form-input"
                    value={feedbackForm.staffResponseRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, staffResponseRating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Comments / Urgent Shelter Needs</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Need blankets, drinking water running low, sanitation issues..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700 }}
              >
                {submitting ? 'Submitting...' : 'Submit Shelter Feedback'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
