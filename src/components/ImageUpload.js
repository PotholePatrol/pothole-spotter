// src/components/ImageUpload.js
import React, { useState } from 'react';

const ImageUpload = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <label>
        Upload Road Image:
        <input type="file" accept="image/*" onChange={handleChange} />
      </label>
      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <img src={preview} alt="preview" width="300px" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
