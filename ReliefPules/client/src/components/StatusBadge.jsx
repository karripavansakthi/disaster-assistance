import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  const s = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (s === 'critical' || s === 'severe' || s === 'unavailable') {
    styles = 'bg-red-50 text-red-600 border-red-200 font-semibold';
  } else if (s === 'high' || s === 'warning' || s === 'limited') {
    styles = 'bg-orange-50 text-orange-600 border-orange-200 font-semibold';
  } else if (s === 'medium' || s === 'pending') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
  } else if (s === 'low' || s === 'available' || s === 'completed' || s === 'active') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (s === 'assigned' || s === 'in progress') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${styles} ${className}`}>
      {status}
    </span>
  );
}
