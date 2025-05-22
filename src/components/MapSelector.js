// src/components/MapSelector.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PointsSelector = ({ points, setPoints }) => {
  useMapEvents({
    click(e) {
      if (points.length === 2) {
        setPoints([e.latlng]);
      } else {
        setPoints([...points, e.latlng]);
      }
    },
  });

  return (
    <>
      {points.map((pos, idx) => (
        <Marker key={idx} position={pos} />
      ))}
    </>
  );
};

const MapSelector = ({ onPointsChange, detections }) => {
  const [selectionMode, setSelectionMode] = useState('points');
  const [points, setPoints] = useState([]);

  // New states for marker click and data fetch
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectionMode === 'points') {
      onPointsChange(points);
    } else {
      onPointsChange([]);
    }
  }, [points, selectionMode, onPointsChange]);

  // Fetch detection info on marker click
  useEffect(() => {
    if (!selectedId) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/api/detections/${selectedId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch detection');
        return res.json();
      })
      .then(data => {
        setSelectedDetection(data);
      })
      .catch(err => {
        setError(err.message);
        setSelectedDetection(null);
      })
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div>
      {/* Selection Mode Toggle */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Road Area:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="points"
              checked={selectionMode === 'points'}
              onChange={() => {
                setSelectionMode('points');
                setPoints([]);
                setSelectedDetection(null);
                setSelectedId(null);
              }}
              className="mr-2"
            />
            Start & End Points
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="area"
              checked={selectionMode === 'area'}
              onChange={() => {
                setSelectionMode('area');
                setPoints([]);
                setSelectedDetection(null);
                setSelectedId(null);
              }}
              className="mr-2"
            />
            Draw Area on Map (coming soon)
          </label>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[-1.286389, 36.817223]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Points selector mode */}
        {selectionMode === 'points' && (
          <>
            <PointsSelector points={points} setPoints={setPoints} />

            {/* Render pothole markers */}
            {detections &&
              detections.map((det) => (
                <Marker
                  key={det.id}
                  position={[det.lat, det.lng]}
                  eventHandlers={{
                    click: () => setSelectedId(det.id),
                  }}
                />
              ))}
          </>
        )}

        {/* TODO: area drawing */}
      </MapContainer>

      {/* Selected points info */}
      {selectionMode === 'points' && points.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <p>
            Selected Points: {points.length} (
            {points.map((p) => `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`).join(' | ')}
            )
          </p>
          {points.length === 2 && <p>Ready to upload images for this stretch.</p>}
        </div>
      )}

      {/* Modal or sidebar for selected detection */}
      {selectedId && (
        <div
          style={{
            position: 'fixed',
            top: '10%',
            right: '10%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            width: '300px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => {
              setSelectedId(null);
              setSelectedDetection(null);
              setError(null);
            }}
            style={{ float: 'right', cursor: 'pointer' }}
          >
            ✖
          </button>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {selectedDetection && (
            <div>
              <h3 className="font-bold mb-2">Detection Details</h3>
              <p><strong>ID:</strong> {selectedDetection.id}</p>
              <p><strong>Label:</strong> {selectedDetection.label}</p>
              <p><strong>Latitude:</strong> {selectedDetection.lat}</p>
              <p><strong>Longitude:</strong> {selectedDetection.lng}</p>
              {/* Add more fields as needed */}
              {selectedDetection.image_url && (
                <img
                  src={selectedDetection.image_url}
                  alt="Detection"
                  style={{ width: '100%', marginTop: '0.5rem', borderRadius: '4px' }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSelector;
