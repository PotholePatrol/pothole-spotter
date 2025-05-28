import React, { useEffect, useState } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function MapWithDetections() {
  const [detections, setDetections] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/detections`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch detections');
        return res.json();
      })
      .then(data => setDetections(data))
      .catch(err => console.error('Error fetching detections:', err));
  }, []);

  const handleDotClick = (detection) => setSelectedDetection(detection);
  const closePopup = () => setSelectedDetection(null);

  // TODO: Replace dummy pixel positioning with real map coordinates and mapping library (Leaflet, Google Maps, etc.)
  return (
    <div>
      <h1>Map of Detections</h1>
      <div id="map" style={{ position: 'relative', height: '400px', border: '1px solid #ccc' }}>
        {detections.map(d => (
          <div
            key={d.id}
            onClick={() => handleDotClick(d)}
            className="detection-dot"
            style={{
              position: 'absolute',
              cursor: 'pointer',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor:
                d.label === 'no pothole' ? 'green' :
                d.label === 'minor pothole' ? 'orange' : 'red',
              left: `${d.lng}px`, // placeholder, change to real map projection coords
              top: `${d.lat}px`,
            }}
            title={`Click for details: ${d.label}`}
          />
        ))}
      </div>

      {selectedDetection && (
        <div
          className="popup-box"
          style={{
            position: 'fixed',
            top: '10%',
            right: '10%',
            width: 300,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={closePopup}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              border: 'none',
              background: 'transparent',
              fontSize: 18,
              cursor: 'pointer',
              color: '#888',
            }}
          >
            ✖
          </button>
          <h2>Detection Info</h2>
          <p><strong>Label:</strong> {selectedDetection.label}</p>
          <p><strong>Confidence:</strong> {(selectedDetection.confidence * 100).toFixed(2)}%</p>
          <p><strong>Location:</strong> {selectedDetection.lat.toFixed(5)}, {selectedDetection.lng.toFixed(5)}</p>
          {selectedDetection.image_url && (
            <img
              src={`${BACKEND_URL}${selectedDetection.image_url.startsWith('/') ? '' : '/'}${selectedDetection.image_url}`}
              alt={selectedDetection.label}
              style={{ maxWidth: '100%', marginTop: 12, borderRadius: 6 }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MapWithDetections;
