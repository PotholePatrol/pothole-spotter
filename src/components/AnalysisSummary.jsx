import React from 'react';

const COLORS = {
  'Total Images': '#6b7280',    // cool gray
  'Major Potholes': '#ef4444', // red alert
  'Minor Potholes': '#f59e0b', // orange vibe
  'No Potholes': '#10b981',    // chill green
};

const AnalysisSummary = ({ predictions }) => {
  if (!predictions || predictions.length === 0) return null;

  const total = predictions.length;
  const major = predictions.filter(p => p === 'major pothole').length;
  const minor = predictions.filter(p => p === 'minor pothole').length;
  const none = predictions.filter(p => p === 'no pothole').length;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      marginTop: '20px',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Road Stretch Analysis Summary</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
        <SummaryBox label="Total Images" count={total} />
        <SummaryBox label="Major Potholes" count={major} />
        <SummaryBox label="Minor Potholes" count={minor} />
        <SummaryBox label="No Potholes" count={none} />
      </div>
    </div>
  );
};

const SummaryBox = ({ label, count }) => (
  <div style={{
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    padding: '1rem 1.5rem',
    textAlign: 'center',
    width: '140px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  }}>
    <h3 style={{ marginBottom: '0.5rem', color: COLORS[label] }}>{label}</h3>
    <p style={{ fontSize: '1.75rem', fontWeight: '700', color: COLORS[label] }}>{count}</p>
  </div>
);

export default AnalysisSummary;
