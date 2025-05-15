// backend/index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
console.log("🔥🔥🔥 Backend restarted and running latest code");

const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `pothole-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// POST route to handle upload + location
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);

   if (!imageFile || isNaN(lat) || isNaN(lng)) {
  return res.status(400).json({ error: 'Missing image or location data' });
}


    console.log('✅ Received image:', imageFile.path);
    console.log('📍 Location:', lat, lng);

    const imageBuffer = fs.readFileSync(imageFile.path);

    const response = await axios.post(
      `${process.env.ENDPOINT}/customvision/v3.0/Prediction/${process.env.PROJECT_ID}/classify/iterations/${process.env.ITERATION_NAME}/image`,
      imageBuffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Prediction-Key': process.env.PREDICTION_KEY,
        },
      }
    );

    const topPrediction = response.data.predictions[0];

    const result = {
      label: topPrediction.tagName,
      confidence: topPrediction.probability,
      location: { lat, lng },
    };

    res.json(result);
  } catch (err) {
    console.error('🔥 Error during analysis:', err.message);

    if (err.response) {
      // This is the key — log the whole Azure API error response data
      console.error('Azure API response error:', err.response.data);
    } else if (err.request) {
      // Request was made but no response received
      console.error('No response received:', err.request);
    } else {
      // Other errors (setup, coding, etc)
      console.error('Other error:', err);
    }

    res.status(500).json({ error: 'Server error during analysis' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
