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
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Selection Mode Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-800 mb-3">
          Select Road Area:
        </label>
        <div className="flex gap-6">
          <label className="inline-flex items-center text-sm text-gray-700">
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
              className="text-black focus:ring-2 focus:ring-yellow-500"
            />
            <span className="ml-2">Start & End Points</span>
          </label>
          <label className="inline-flex items-center text-sm text-gray-500 cursor-not-allowed">
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
              className="text-black mr-2"
              disabled
            />
            Draw Area on Map (coming soon)
          </label>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-300 shadow">
        <MapContainer
          center={[-1.286389, 36.817223]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {selectionMode === 'points' && (
            <>
              <PointsSelector points={points} setPoints={setPoints} />

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
        </MapContainer>
      </div>

      {/* Selected points info */}
      {selectionMode === 'points' && points.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p>
            <strong>Selected Points:</strong> {points.length} (
            {points.map((p) => `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`).join(' | ')})
          </p>
          {points.length === 2 && (
            <p className="text-green-600 mt-1">Ready to upload images for this stretch.</p>
          )}
        </div>
      )}

      {/* Modal for selected detection */}
      {selectedId && (
        <div className="fixed top-12 right-10 bg-white border border-gray-300 rounded-xl shadow-lg p-6 w-80 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Detection Details</h3>
            <button
              onClick={() => {
                setSelectedId(null);
                setSelectedDetection(null);
                setError(null);
              }}
              className="text-gray-500 hover:text-red-600 font-bold text-lg"
            >
              ✖
            </button>
          </div>
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          {selectedDetection && (
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">ID:</span> {selectedDetection.id}</p>
              <p><span className="font-medium">Label:</span> {selectedDetection.label}</p>
              <p><span className="font-medium">Latitude:</span> {selectedDetection.lat}</p>
              <p><span className="font-medium">Longitude:</span> {selectedDetection.lng}</p>
              {selectedDetection.image_url && (
                <img
                  src={selectedDetection.image_url}
                  alt="Detection"
                  className="mt-3 w-full rounded-md border border-gray-200"
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
