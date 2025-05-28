// src/views/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ImageUpload from "./ImageUpload";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AnalysisSummary from './AnalysisSummary';
import BackgroundSection from './BackgroundSection';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet icon loading for webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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

export default function Dashboard() {
  const [imageFiles, setImageFiles] = useState([]);
  const [location, setLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [allData, setAllData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [selectionMode, setSelectionMode] = useState("points");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setModalData(null);
    }
    if (modalData) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [modalData]);

  const toggleSelectionMode = () => {
    if (selectionMode === "points") setLocation(null);
    else {
      setStartPoint(null);
      setEndPoint(null);
    }
    setSelectionMode(selectionMode === "points" ? "roadStretch" : "points");
  };

  const handleUpload = async () => {
    const coords = selectionMode === "points" ? location : startPoint;

    if (
      !imageFiles.length ||
      !coords?.lat ||
      !coords?.lng ||
      (selectionMode === "roadStretch" && !endPoint)
    ) {
      alert("Please complete all required selections.");
      return;
    }

    const results = [];

    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('lat', coords.lat);
      formData.append('lng', coords.lng);

      try {
        const res = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          alert(`Analysis failed: ${data.error}`);
          continue;
        }

        results.push(data);
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed.");
      }
    }

    if (results.length > 0) {
      setResult(results[0]);
      setAllData(prev => [...prev, ...results]);
      setPredictions(prev => [...prev, ...results.map(r => r.label)]);
    }
  };

  const getColor = (label) => {
    const l = label.toLowerCase();
    return l.includes("major") ? "red" : l.includes("minor") ? "orange" : "green";
  };

  const handleModalBackgroundClick = (e) => {
    if (e.target.classList.contains('detection-modal-overlay')) {
      setModalData(null);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🛠️ SmartRoads System</h1>
      <BackgroundSection />
      <ImageUpload onImagesSelect={setImageFiles} />

      <p className="map-instruction">
        {selectionMode === "points"
          ? "Click on the map to select pothole location 📍"
          : "Click twice on the map to select Start and End points 📍📍"}
      </p>

      <div className='button-container'>
        <button className="toggle-btn" onClick={toggleSelectionMode}>
          Switch to {selectionMode === "points" ? "Road Stretch Selection" : "Single Point Selection"}
        </button>
        <br />
        <button className="upload-btn" onClick={handleUpload}>
          Analyze Images
        </button>
      </div>

      {result && (
        <div className="result-box">
          <h3>Latest Detection</h3>
          <p><strong>Label:</strong> {result.label}</p>
          {result.location
            ? <p><strong>Location:</strong> {result.location.lat}, {result.location.lng}</p>
            : <p className="error-text">⚠️ Location data missing</p>}
        </div>
      )}

      <AnalysisSummary predictions={predictions} />

      <div className="map-wrapper" style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={[-1.286389, 36.817223]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={map => map.on('click', () => setModalData(null))}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {selectionMode === "points"
            ? <LocationSelector onSelect={setLocation} />
            : <RoadStretchSelector start={startPoint} end={endPoint} setStart={setStartPoint} setEnd={setEndPoint} />
          }

          {selectionMode === "points" && location && (
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

          {allData.map((entry, i) => (
            <Marker
              key={i}
              position={[entry.location.lat, entry.location.lng]}
              icon={L.divIcon({
                className: 'custom-icon',
                html: `<div style="background:${getColor(entry.label)};width:20px;height:20px;border-radius:50%"></div>`
              })}
              eventHandlers={{ click: () => setModalData(entry) }}
            />
          ))}
        </MapContainer>
      </div>

      {modalData && (
        <div className="detection-modal-overlay" onClick={handleModalBackgroundClick}>
          <div className="detection-modal">
            <h2>Detection Details</h2>
            <p><strong>Label:</strong> {modalData.label}</p>
            <p><strong>Coordinates:</strong> {modalData.location.lat}, {modalData.location.lng}</p>
            <button onClick={() => setModalData(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
