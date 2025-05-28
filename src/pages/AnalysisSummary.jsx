import React from 'react';

const COLORS = {
  'Total Images': '#1f2937',    // slate gray
  'Major Potholes': '#dc2626',  // deep red
  'Minor Potholes': '#f59e0b',  // orange
  'No Potholes': '#16a34a',     // green
};

const AnalysisSummary = ({ predictions }) => {
  if (!predictions || predictions.length === 0) return null;

  const total = predictions.length;
  const major = predictions.filter(p => p === 'major pothole').length;
  const minor = predictions.filter(p => p === 'minor pothole').length;
  const none = predictions.filter(p => p === 'no pothole').length;

  return (
    <div
      style={{
        background: '#fefefe',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        marginTop: '2rem',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: '1px solid #DAA52044'
      }}
    >
      <h2
        style={{
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#333',
          fontSize: '1.5rem',
        }}
      >
        🛣️ Road Stretch Analysis Summary
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <SummaryBox label="Total Images" count={total} />
        <SummaryBox label="Major Potholes" count={major} />
        <SummaryBox label="Minor Potholes" count={minor} />
        <SummaryBox label="No Potholes" count={none} />
      </div>
    </div>
  );
};

const SummaryBox = ({ label, count }) => (
  <div
    style={{
      backgroundColor: '#fffaf0',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      textAlign: 'center',
      width: '160px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      transition: 'transform 0.3s ease',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <h3
      style={{
        marginBottom: '0.5rem',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: COLORS[label],
      }}
    >
      {label}
    </h3>
    <p
      style={{
        fontSize: '1.9rem',
        fontWeight: '800',
        color: COLORS[label],
      }}
    >
      {count}
    </p>
  </div>
);

export default AnalysisSummary;
