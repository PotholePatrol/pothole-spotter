import React, { useState } from 'react';

const ImageUpload = ({ onImagesSelect }) => {
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    onImagesSelect(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
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
          <img
            key={i}
            src={src}
            alt={`Preview ${i}`}
            className="preview-image"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
