import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORY_ICONS = {
  'Meals': '🍚',
  'Drinking Water': '💧',
  'Ready-to-Eat Food': '🥫',
  'Baby Food': '🍼',
  'Blankets': '🛌',
  'Clothing': '👕',
  'First-Aid Kits': '🩺',
  'Medicines': '💊',
  'Hygiene Kits': '🧼',
};

function ResourceBar({ item }) {
  const pct = Math.min(100, Math.round((item.availableQuantity / item.requiredQuantity) * 100));
  const cls = item.status === 'Critical' ? 'critical' : item.status === 'Low' ? 'low' : 'normal';
  const statusColor = { Normal: 'var(--emerald-safe)', Low: 'var(--amber-warning)', Critical: 'var(--red-critical)' };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{CATEGORY_ICONS[item.category] || '📦'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.itemName}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.warehouseName}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: statusColor[item.status] }}>{item.availableQuantity.toLocaleString()}</div>
          <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)' }}>of {item.requiredQuantity.toLocaleString()} {item.unit}</div>
        </div>
      </div>

      <div style={{ marginBottom: '0.45rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>Available {pct}%</span>
          <span style={{ color: statusColor[item.status], fontWeight: 700 }}>{item.status}</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill progress-${cls}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {item.status === 'Critical' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--red-critical)', marginTop: '0.35rem' }}>
          <AlertTriangle size={11} /> Critical shortage — Immediate resupply needed
        </div>
      )}
      {item.status === 'Low' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--amber-warning)', marginTop: '0.35rem' }}>
          <TrendingDown size={11} /> Low stock — Resupply requested
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    axios.get(`${API}/api/resources`).then((r) => {
      setResources(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(resources.map((r) => r.category))];
  const filtered = activeCategory === 'All' ? resources : resources.filter((r) => r.category === activeCategory);

  const critical = resources.filter((r) => r.status === 'Critical').length;
  const low = resources.filter((r) => r.status === 'Low').length;
  const normal = resources.filter((r) => r.status === 'Normal').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Package size={18} color="var(--purple-resource)" />
        <h2 style={{ fontWeight: 700 }}>Food & Relief Inventory</h2>
      </div>

      {/* Summary */}
      <div className="stats-grid-3">
        <div className="card" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} color="var(--emerald-safe)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--emerald-safe)' }}>{normal}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Items Well-Stocked</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown size={20} color="var(--amber-warning)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--amber-warning)' }}>{low}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Items Running Low</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderColor: 'rgba(255,59,59,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="var(--red-critical)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--red-critical)' }}>{critical}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Critical Shortages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`btn ${activeCategory === c ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            {CATEGORY_ICONS[c] || '📦'} {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
          {filtered.map((r) => <ResourceBar key={r._id} item={r} />)}
        </div>
      )}
    </div>
  );
}
