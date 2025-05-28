import React, { useEffect, useState } from 'react';

function MapWithDetections() {
  const [detections, setDetections] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${BACKEND_URL}/detections`)
      .then((res) => res.json())
      .then((data) => setDetections(data))
      .catch((err) => console.error('Error fetching detections:', err));
  }, [BACKEND_URL]);

  const handleDotClick = (detection) => {
    setSelectedDetection(detection);
  };

  const closePopup = () => {
    setSelectedDetection(null);
  };

  return (
    <div>
      <h1>Map of Detections</h1>
      <div id="map">
        {detections.map((d) => (
          <div
            key={d.id}
            onClick={() => handleDotClick(d)}
            className="detection-dot"
            style={{
              backgroundColor:
                d.label === 'no pothole' ? 'green' :
                d.label === 'minor pothole' ? 'orange' : 'red',
              left: `${d.lng}px`, // replace with actual map positioning logic
              top: `${d.lat}px`,
            }}
            title={`Click for details: ${d.label}`}
          />
        ))}
      </div>

      {selectedDetection && (
        <div className="popup-box">
          <button className="close-btn" onClick={closePopup}>✖</button>
          <h2>Detection Info</h2>
          <p><strong>Label:</strong> {selectedDetection.label}</p>
          <p><strong>Confidence:</strong> {(selectedDetection.confidence * 100).toFixed(2)}%</p>
          <p><strong>Location:</strong> {selectedDetection.lat.toFixed(5)}, {selectedDetection.lng.toFixed(5)}</p>
          {selectedDetection.image_url && (
            <img
              src={`${BACKEND_URL}${selectedDetection.image_url.startsWith('/') ? '' : '/'}${selectedDetection.image_url}`}
              alt={selectedDetection.label}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MapWithDetections;
