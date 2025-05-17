// src/components/MapSelector.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Basic icon fix for Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to select either start and end points
const PointsSelector = ({ points, setPoints }) => {
  useMapEvents({
    click(e) {
      if (points.length === 2) {
        // Reset points if already have 2
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

const MapSelector = ({ onPointsChange }) => {
  const [selectionMode, setSelectionMode] = useState('points'); // 'points' or 'area'
  const [points, setPoints] = useState([]);

  // Update parent when points change
  React.useEffect(() => {
    if (selectionMode === 'points') {
      onPointsChange(points);
    } else {
      onPointsChange([]); // clear when not in points mode
    }
  }, [points, selectionMode, onPointsChange]);

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
                setPoints([]); // reset points when switching mode
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
                setPoints([]); // clear points when switching
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

        {selectionMode === 'points' && (
          <PointsSelector points={points} setPoints={setPoints} />
        )}

        {/* TODO: Area drawing logic for 'area' mode */}
      </MapContainer>

      {/* Show current points for debugging */}
      {selectionMode === 'points' && points.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <p>
            Selected Points: {points.length} ({points.map(p => `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`).join(' | ')})
          </p>
          {points.length === 2 && <p>Ready to upload images for this stretch.</p>}
        </div>
      )}
    </div>
  );
};

export default MapSelector;
