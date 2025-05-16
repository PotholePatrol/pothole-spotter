import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const getMarkerColor = (label) => {
  switch (label?.toLowerCase()) {
    case 'minor':
      return 'yellow';
    case 'major':
      return 'red';
    default:
      return 'green';
  }
};

const MapView = ({ locations }) => {
  const polylinePositions = locations.map((loc) => loc.coords);

  return (
    <div className="map-section">
      <h3 className="map-title">🗺️ Pothole Detection Map</h3>

      <MapContainer
        center={locations[0]?.coords || [0.0236, 37.9062]}
        zoom={6}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {locations.map((location, index) => {
          const color = getMarkerColor(location.result?.label);

          return (
            <Marker
              key={index}
              position={location.coords}
              pathOptions={{ color }}
            >
              <Popup>
                <div className={`popup-${color}`}>
                  <p><strong>Label:</strong> {location.result?.label || 'Unknown'}</p>
                  <p><strong>Confidence:</strong> {location.result?.confidence?.toFixed(2) || 'N/A'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} pathOptions={{ color: '#007bff' }} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
