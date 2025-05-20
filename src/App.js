import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AnalysisSummary from './components/AnalysisSummary';
import './App.css';

// Fix leaflet icon loading for webpack
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
  const [selectionMode, setSelectionMode] = useState("points");

  const toggleSelectionMode = () => {
    if (selectionMode === "points") {
      setLocation(null);
    } else {
      setStartPoint(null);
      setEndPoint(null);
    }
    setSelectionMode(selectionMode === "points" ? "roadStretch" : "points");
  };

  const handleUpload = async () => {
    if (selectionMode === "points" && (!imageFiles.length || !location)) {
      alert('Please upload images and select location');
      return;
    }
    if (selectionMode === "roadStretch" && (!imageFiles.length || !startPoint || !endPoint)) {
      alert('Please upload images and select start and end points');
      return;
    }

    const coords = selectionMode === "points" ? location : startPoint;

    if (!coords || !coords.lat || !coords.lng) {
      alert("Coordinates missing. Please reselect location.");
      return;
    }

    const results = [];

    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('lat', coords.lat);
      formData.append('lng', coords.lng);

      // Debug log before sending
      console.log("📤 Sending file:", file.name);
      console.log("📍 Location:", coords.lat, coords.lng);

      try {
        const res = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          body: formData,
        });

        let data;
        try {
          data = await res.json();
        } catch (jsonErr) {
          const rawText = await res.text();
          console.error("❌ Failed to parse JSON:", jsonErr);
          console.error("🪵 Raw response text:", rawText);
          alert('Server sent an invalid response. Check backend logs.');
          continue;
        }

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
      <h1 className="app-title">🛠️ SmartRoads System</h1>

      <button className="toggle-btn" onClick={toggleSelectionMode}>
        Switch to {selectionMode === "points" ? "Road Stretch Selection" : "Single Point Selection"}
      </button>

      <ImageUpload onImagesSelect={setImageFiles} />

      <p className="map-instruction">
        {selectionMode === "points"
          ? "Click on the map to select pothole location 📍"
          : "Click twice on the map to select Start and End points for road stretch 📍📍"}
      </p>

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

      <div className="map-wrapper" style={{ height: '500px', width: '100%' }}>
        <MapContainer center={[-1.286389, 36.817223]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {selectionMode === "points" ? (
            <LocationSelector onSelect={setLocation} />
          ) : (
            <RoadStretchSelector start={startPoint} end={endPoint} setStart={setStartPoint} setEnd={setEndPoint} />
          )}

          {selectionMode === "points" && location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}

          {selectionMode === "roadStretch" && startPoint && (
            <Marker
              position={[startPoint.lat, startPoint.lng]}
              icon={L.divIcon({
                className: 'custom-icon',
                html: `<div class="start-marker"></div>`,
              })}
            >
              <Popup>Start Point</Popup>
            </Marker>
          )}

          {selectionMode === "roadStretch" && endPoint && (
            <Marker
              position={[endPoint.lat, endPoint.lng]}
              icon={L.divIcon({
                className: 'custom-icon',
                html: `<div class="end-marker"></div>`,
              })}
            >
              <Popup>End Point</Popup>
            </Marker>
          )}

          {allData.map((entry, i) => (
            <Marker
              key={i}
              position={[entry.location.lat, entry.location.lng]}
              icon={L.divIcon({
                className: 'custom-icon',
                html: `<div style="background:${getColor(entry.label)};width:20px;height:20px;border-radius:50%"></div>`,
              })}
            >
              <Popup>
                <strong>{entry.label.toUpperCase()}</strong><br />
                Lat: {entry.location.lat}<br />
                Lng: {entry.location.lng}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
