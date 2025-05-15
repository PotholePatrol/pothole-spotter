// src/App.js
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map clicks
function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
    },
  });
  return null;
}

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [allData, setAllData] = useState([]);

  const handleUpload = async () => {
  if (!imageFile || !location) {
    alert('Please upload an image and click on the map to select location');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);
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
      return;
    }

    setResult(data);
    setAllData(prev => [...prev, data]);
  } catch (err) {
    console.error('❌ Upload failed:', err);
    alert('Upload failed. Check your server or internet.');
  }
  };


  

  const getColor = (label) => {
    if (label === 'major') return 'red';
    if (label === 'minor') return 'orange';
    return 'green';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pothole Detection System 🚧</h1>

      <ImageUpload onImageSelect={setImageFile} />

      <p><strong>Click on the map</strong> to choose location of the pothole 📍</p>

      <button onClick={handleUpload} style={{ marginBottom: '1rem' }}>
        Analyze Image
      </button>

      {result && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>Latest Detection:</h3>
          <p>Label: {result.label}</p>
          {result.location ? (
            <p>Location: {result.location.lat}, {result.location.lng}</p>
          ) : (
            <p style={{ color: 'red' }}>Location data missing</p>
          )}
        </div>
      )}


      <MapContainer center={[-1.286389, 36.817223]} zoom={12} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationSelector onSelect={setLocation} />

        {location && (
          <Marker position={[location.lat, location.lng]}>
            <Popup>Selected Location</Popup>
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
  );
}

export default App;
