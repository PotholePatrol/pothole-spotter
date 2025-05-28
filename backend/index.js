require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mysql = require('mysql2/promise');

console.log("🔥🔥🔥 Backend restarted and running latest code");

console.log('📦 PREDICTION_KEY:', process.env.PREDICTION_KEY);
console.log('🌍 ENDPOINT:', process.env.ENDPOINT);
console.log('🆔 PROJECT_ID:', process.env.PROJECT_ID);
console.log('📸 ITERATION_NAME:', process.env.ITERATION_NAME);

const app = express();
const PORT = 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://pothole-spotter-git-main-stevens-projects-8a9fb357.vercel.app',
  'https://pothole-spotter.vercel.app', // future production domain if needed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Serve uploads folder statically so frontend can access images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    console.log('Image buffer size:', imageBuffer.length);   
    if(imageBuffer.length === 0) throw new Error('Image buffer is empty');


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

    // Build public image URL for frontend
    const imageUrl = `http://localhost:${PORT}/uploads/${path.basename(imagePath)}`;

    // DON’T delete the file immediately — let frontend fetch it
    // Optionally: delete after some delay or cleanup script later

    res.json({
      label,
      confidence,
      location: { lat: parsedLat, lng: parsedLng },
      imageUrl,
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

// Get detection by ID
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

// Get all detections (fixed to async/await)
app.get('/detections', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM detections ORDER BY created_at DESC');
    res.json(results);
  } catch (err) {
    console.error('❌ Failed to fetch detections:', err.message);
    res.status(500).json({ error: 'Database error fetching detections' });
  }
});

// Get detection by lat & lng for map marker click
app.get('/api/spot', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM detections 
       WHERE lat = ? AND lng = ? 
       ORDER BY created_at DESC`,
      [parseFloat(lat), parseFloat(lng)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data available yet.' });
    }

    res.json(rows);  // send all detections, not just one
  } catch (err) {
    console.error('🔥 Error fetching spot info:', err.message);
    res.status(500).json({ error: 'Server error fetching spot info' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
