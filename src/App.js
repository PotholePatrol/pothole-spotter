import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AnalysisSummary from './components/AnalysisSummary';
import './App.css'; // ⬅️ make sure this is imported



delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
    },
  });
  return null;
}

function RoadStretchSelector({ start, end, setStart, setEnd }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!start) setStart({ lat, lng });
      else if (!end) setEnd({ lat, lng });
      else {
        setStart({ lat, lng });
        setEnd(null);
      }
    },
  });
  return null;
}

function App() {
  const [imageFiles, setImageFiles] = useState([]);
  const [location, setLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [allData, setAllData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const handleUpload = async () => {
    if (!imageFiles.length || !location) {
      alert('Please upload images and select location');
      return;
    }

    const results = [];

    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('lat', location.lat);
      formData.append('lng', location.lng);

      try {
        const res = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('❌ Backend error:', data.error);
          alert(`Analysis failed: ${data.error}`);
          continue;
        }

        results.push(data);
      } catch (err) {
        console.error('❌ Upload failed:', err);
        alert('Upload failed. Check your server or internet.');
      }
    }

    if (results.length > 0) {
      setResult(results[0]);
      setAllData(prev => [...prev, ...results]);
      setPredictions(prev => [...prev, ...results.map(r => r.label)]);
    }
  };

  const getColor = (label) => {
     const normalized = label.toLowerCase();
        if (normalized.includes('major')) return 'red';
        if (normalized.includes('minor')) return 'orange';
        return 'green';
      };

  return (
    <div className="app-container">
      <h1 className="app-title">🛠️ Pothole Detection System</h1>

      <ImageUpload onImagesSelect={setImageFiles} />

      <p className="map-instruction">Click on the map to select pothole location 📍</p>

      <button className="upload-btn" onClick={handleUpload}>
        Analyze Images
      </button>

      {result && (
        <div className="result-box">
          <h3>Latest Detection</h3>
          <p><strong>Label:</strong> {result.label}</p>
          {result.location ? (
            <p><strong>Location:</strong> {result.location.lat}, {result.location.lng}</p>
          ) : (
            <p className="error-text">⚠️ Location data missing</p>
          )}
        </div>
      )}

      <AnalysisSummary predictions={predictions} />

      <div className="map-wrapper">
        <MapContainer center={[-1.286389, 36.817223]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector onSelect={setLocation} />
          <RoadStretchSelector start={startPoint} end={endPoint} setStart={setStartPoint} setEnd={setEndPoint} />

          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}

          {startPoint && (
            <Marker position={[startPoint.lat, startPoint.lng]} icon={L.divIcon({
              className: 'custom-icon',
              html: `<div class="start-marker"></div>`
            })}>
              <Popup>Start Point</Popup>
            </Marker>
          )}

          {endPoint && (
            <Marker position={[endPoint.lat, endPoint.lng]} icon={L.divIcon({
              className: 'custom-icon',
              html: `<div class="end-marker"></div>`
            })}>
              <Popup>End Point</Popup>
            </Marker>
          )}

          {allData.map((entry, i) => {
            console.log('🧪 Label:', entry.label); // Add this line for debugging

            return (
              <Marker
                key={i}
                position={[entry.location.lat, entry.location.lng]}
                icon={L.divIcon({
                  className: 'custom-icon',
                  html: `<div style="background:${getColor(entry.label)};width:20px;height:20px;border-radius:50%"></div>`
                })}
              >
                <Popup>
                  <strong>{entry.label.toUpperCase()}</strong><br />
                  Lat: {entry.location.lat}<br />
                  Lng: {entry.location.lng}
                </Popup>
              </Marker>
            );
          })}

        </MapContainer>
      </div>
    </div>
  );
}

export default App;
