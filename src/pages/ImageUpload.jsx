import React, { useState } from 'react';
import * as exifr from 'exifr';

const ImageUpload = ({ onImagesSelect }) => {
  const [previews, setPreviews] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [rejectedImages, setRejectedImages] = useState([]);

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadStatus([]);
    setPreviews([]);
    setRejectedImages([]);

    try {
      const deviceLoc = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject('Geolocation not supported.');
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject('Failed to get location: ' + err.message),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      setLocation(deviceLoc);
      setLocationError(null);

      const allowedFiles = [];
      const previewData = [];
      const statusAllowed = [];
      const rejected = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const previewUrl = URL.createObjectURL(file);
        let gps = null;

        try {
          gps = await exifr.gps(file);
        } catch (err) {
          console.error('EXIF read error:', err);
        }

        if (!gps || !deviceLoc) {
          allowedFiles.push(file);
          previewData.push({ src: previewUrl, allowed: true });
          statusAllowed.push({ progress: 0, status: 'pending' });
        } else {
          const dist = getDistanceMeters(deviceLoc, { lat: gps.latitude, lng: gps.longitude });

          if (dist <= 50) {
            allowedFiles.push(file);
            previewData.push({ src: previewUrl, allowed: true });
            statusAllowed.push({ progress: 0, status: 'pending' });
          } else {
            previewData.push({ src: previewUrl, allowed: false });
            rejected.push(`❌ Image ${i + 1} is too far (${Math.round(dist)}m) from your location.`);
          }
        }
      }

      setPreviews(previewData);
      setUploadStatus(statusAllowed);
      setRejectedImages(rejected);

      if (allowedFiles.length > 0) {
        onImagesSelect(allowedFiles);
        uploadImages(allowedFiles, deviceLoc);
      }
    } catch (err) {
      console.error(err);
      setLocation(null);
      setLocationError(err.toString());
    }
  };

  const uploadImages = (files, location) => {
    files.forEach((file, index) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('image', file);

      if (location) {
        formData.append('lat', location.lat);
        formData.append('lng', location.lng);
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadStatus((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], progress: percent };
            return updated;
          });
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          setUploadStatus((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              status: xhr.status === 200 ? 'success' : 'fail',
            };
            return updated;
          });
        }
      };

      xhr.open('POST', 'https://pothole-spotter.onrender.com/upload');
      xhr.send(formData);
    });
  };

  return (
    <div className="upload-box">
      <label htmlFor="imageUpload" className="upload-label">📷 Upload Road Images:</label>
      <input
        type="file"
        id="imageUpload"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="upload-input"
      />

      {location && (
        <p className="text-sm text-green-700">
          📍 Location locked: Lat {location.lat.toFixed(5)}, Lng {location.lng.toFixed(5)}
        </p>
      )}
      {locationError && (
        <p className="text-sm text-red-600">{locationError}</p>
      )}

      <div className="preview-container grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {previews.map((img, i) => (
          <div key={i} className="preview-item mb-4 relative">
            <img
              src={img.src}
              alt={`Preview ${i}`}
              className={`preview-image mb-2 ${img.allowed ? '' : 'grayscale opacity-60'}`}
            />
            <div className="text-sm text-gray-700">
              Progress: {uploadStatus[i]?.progress || 0}%
            </div>
            <div className={`text-sm font-bold ${
              uploadStatus[i]?.status === 'success' ? 'text-green-600' :
              uploadStatus[i]?.status === 'fail' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {uploadStatus[i]?.status || 'pending'}
            </div>
            {!img.allowed && (
              <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                Not allowed
              </div>
            )}
          </div>
        ))}
      </div>

      {rejectedImages.length > 0 && (
        <div className="mt-4 text-sm text-red-600">
          <p>🚫 Some images were rejected:</p>
          <ul className="list-disc ml-4">
            {rejectedImages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function getDistanceMeters(loc1, loc2) {
  const R = 6371000;
  const toRad = (deg) => deg * (Math.PI / 180);
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default ImageUpload;
