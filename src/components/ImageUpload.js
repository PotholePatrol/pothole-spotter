import React, { useState } from 'react';

const ImageUpload = ({ onImagesSelect }) => {
  const [previews, setPreviews] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]); // 🆕 Add this line

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    onImagesSelect(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);


    // ⬇️ Init uploadStatus for each selected image
    const initialStatus = files.map(() => ({ progress: 0, status: 'pending' }));
    setUploadStatus(initialStatus);

    uploadImages(files);

  };

  const uploadImages = (files) => {
  files.forEach((file, index) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('image', file);

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

    xhr.open('POST', 'http://localhost:5000/api/upload'); // Update this URL if needed
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

      <div className="preview-container">
        {previews.map((src, i) => (
          <div key={i} className="preview-item mb-4">
            <img
              src={src}
              alt={`Preview ${i}`}
              className="preview-image mb-2"
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
          </div>
        ))}

      </div>
    </div>
  );
};

export default ImageUpload;
