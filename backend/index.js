// backend/index.js
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mysql = require('mysql2/promise');  // changed to promise version

console.log("🔥🔥🔥 Backend restarted and running latest code");

console.log('📦 PREDICTION_KEY:', process.env.PREDICTION_KEY);
console.log('🌍 ENDPOINT:', process.env.ENDPOINT);
console.log('🆔 PROJECT_ID:', process.env.PROJECT_ID);
console.log('📸 ITERATION_NAME:', process.env.ITERATION_NAME);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL DB connection (promise style)
let db;
async function initDb() {
  try {
    db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'smartroads',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('✅ Connected to MySQL database');
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
  }
}
initDb();

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
    const {
      lat, lng,
      stretchStartLat, stretchStartLng,
      stretchEndLat, stretchEndLng
    } = req.body;

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (!imageFile || isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({ error: 'Missing image or location data' });
    }

    console.log('✅ Received image:', imageFile.path);
    console.log('📍 Location:', parsedLat, parsedLng);

    const imageBuffer = fs.readFileSync(imageFile.path);

    const endpoint = process.env.ENDPOINT.replace(/\/$/, '');
    const url = `${endpoint}/customvision/v3.0/Prediction/${process.env.PROJECT_ID}/classify/iterations/${process.env.ITERATION_NAME}/image`;

    // Azure request debug
    console.log('➡️ Sending to Azure:', url);
    console.log('➡️ Headers:', {
      'Content-Type': 'application/octet-stream',
      'Prediction-Key': process.env.PREDICTION_KEY,
    });
    console.log('➡️ Image Buffer length:', imageBuffer.length);

    const response = await axios.post(
      url,
      imageBuffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Prediction-Key': process.env.PREDICTION_KEY,
        },
      }
    );

    const topPrediction = response.data.predictions[0];
    const label = topPrediction.tagName;
    const confidence = topPrediction.probability;
    const imagePath = imageFile.path;

    // Insert into database
    const sql = `INSERT INTO detections 
      (label, image_url, lat, lng, stretch_start_lat, stretch_start_lng, stretch_end_lat, stretch_end_lng) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(
      sql,
      [
        label,
        imagePath,
        parsedLat,
        parsedLng,
        parseFloat(stretchStartLat) || null,
        parseFloat(stretchStartLng) || null,
        parseFloat(stretchEndLat) || null,
        parseFloat(stretchEndLng) || null,
      ]
    );

    console.log('✅ Detection saved to DB');

    // Clean up
    fs.unlinkSync(imagePath);

    res.json({
      label,
      confidence,
      location: { lat: parsedLat, lng: parsedLng },
    });
  } catch (err) {
    console.error('🔥 Error during analysis:', err.message);

    if (err.response) {
      console.error('Azure API response error:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Other error:', err);
    }

    res.status(500).json({ error: 'Server error during analysis' });
  }
});

// NEW ROUTE: Get detection info by ID
app.get('/detections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM detections WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Detection not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('🔥 DB error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// backend/index.js

// Add this GET endpoint for fetching all detections
app.get('/detections', (req, res) => {
  const sql = 'SELECT * FROM detections ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch detections:', err.message);
      return res.status(500).json({ error: 'Database error fetching detections' });
    }
    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
