import React, { useEffect, useState } from 'react';

function MapWithDetections() {
  const [detections, setDetections] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/detections')
      .then((res) => res.json())
      .then((data) => setDetections(data))
      .catch((err) => console.error('Error fetching detections:', err));
  }, []);

  // Function to handle click on a detection dot
  const handleDotClick = (detection) => {
    setSelectedDetection(detection);
  };

  // Function to close the popup/modal
  const closePopup = () => {
    setSelectedDetection(null);
  };

  return (
    <div>
      <h1>Map of Detections</h1>
      <div id="map">
        {/* This is where you plot your map + dots */}
        {detections.map((d) => (
          <div
            key={d.id}
            onClick={() => handleDotClick(d)}
            className="detection-dot"
            style={{
              backgroundColor:
                d.label === 'no pothole' ? 'green' :
                d.label === 'minor pothole' ? 'orange' : 'red',
              left: `${d.lng}px`, // replace with map logic
              top: `${d.lat}px`,  // replace with map logic
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
            src={`http://localhost:5000/${selectedDetection.image_url}`}
            alt={selectedDetection.label}
          />
        )}
      </div>

      )}
    </div>
  );
}

export default MapWithDetections;
