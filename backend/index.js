require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');


console.log("🔥🔥🔥 Backend restarted and running latest code");

console.log('📦 PREDICTION_KEY:', process.env.PREDICTION_KEY);
console.log('🌍 ENDPOINT:', process.env.ENDPOINT);
console.log('🆔 PROJECT_ID:', process.env.PROJECT_ID);
console.log('📸 ITERATION_NAME:', process.env.ITERATION_NAME);

const app = express();
const PORT = 5000;

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://pothole-spotter-git-main-stevens-projects-8a9fb357.vercel.app',
  'https://pothole-spotter.vercel.app',
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL connection
let db;
async function initDb() {
  try {
    db = await mysql.createPool({
      host: 'localhost',
      user: 'root',
<<<<<<< Updated upstream
      password: 'wmL0/m3wXDc/UcIn',
=======
<<<<<<< HEAD
      password: '75223031',
=======
      password: 'wmL0/m3wXDc/UcIn',
>>>>>>> 90b212fd3d75da3211eeb9e4107f5af18eb11799
>>>>>>> Stashed changes
      database: 'smartroads',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // ✅ ACTUAL connection check
    const [rows] = await db.query('SELECT 1');
    console.log('✅ MySQL connection and query successful');
  } catch (err) {
    console.error('❌ MySQL connection/query error:', err.message);
  }
}
initDb();

// Multer config
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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
app.post('/upload', upload.single('image'), async (req, res) => {
  const imageFile = req.file;
  const { lat, lng } = req.body;

  console.log(req.files);
  res.send('Files uploaded');
  if (!imageFile ) {
    return res.status(400).json({ error: 'Invalid file or coordinates' });
  }

  console.log('✅ Received image:', imageFile.path);
  return res.json({ message: 'Upload successful', filename: imageFile.filename });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
=======
>>>>>>> 90b212fd3d75da3211eeb9e4107f5af18eb11799
>>>>>>> Stashed changes
// POST /analyze
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

    console.log('➡️ Sending to Azure:', url);
    console.log('➡️ Headers:', {
      'Content-Type': 'application/octet-stream',
      'Prediction-Key': process.env.PREDICTION_KEY,
    });
    console.log('➡️ Image Buffer length:', imageBuffer.length);

    if (imageBuffer.length === 0) throw new Error('Image buffer is empty');

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

<<<<<<< Updated upstream
    // Generate a new session_id for this analyze request
    const sessionId = uuidv4();

    await db.query(
      `INSERT INTO detections 
       (label, image_url, lat, lng, stretch_start_lat, stretch_start_lng, stretch_end_lat, stretch_end_lng, session_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
=======
<<<<<<< HEAD
    await db.query(
      `INSERT INTO detections
       (label, image_url, lat, lng, stretch_start_lat, stretch_start_lng, stretch_end_lat, stretch_end_lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
=======
    // Generate a new session_id for this analyze request
    const sessionId = uuidv4();

    await db.query(
      `INSERT INTO detections 
       (label, image_url, lat, lng, stretch_start_lat, stretch_start_lng, stretch_end_lat, stretch_end_lng, session_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
>>>>>>> 90b212fd3d75da3211eeb9e4107f5af18eb11799
>>>>>>> Stashed changes
      [
        label,
        imagePath,
        parsedLat,
        parsedLng,
        parseFloat(stretchStartLat) || null,
        parseFloat(stretchStartLng) || null,
        parseFloat(stretchEndLat) || null,
        parseFloat(stretchEndLng) || null,
        sessionId,
      ]
    );

<<<<<<< Updated upstream
    console.log('✅ Detection saved to DB with session_id:', sessionId);
    const imageUrl = `http://localhost:${PORT}/uploads/${path.basename(imagePath)}`;

    // Return session_id in response
=======
<<<<<<< HEAD
    console.log('✅ Detection saved to DB');
    const imageUrl = `http://localhost:${PORT}/uploads/${path.basename(imagePath)}`;

=======
    console.log('✅ Detection saved to DB with session_id:', sessionId);
    const imageUrl = `http://localhost:${PORT}/uploads/${path.basename(imagePath)}`;

    // Return session_id in response
>>>>>>> 90b212fd3d75da3211eeb9e4107f5af18eb11799
>>>>>>> Stashed changes
    res.json({
      label,
      confidence,
      location: { lat: parsedLat, lng: parsedLng },
      imageUrl,
      session_id: sessionId,
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
//  GET endpoint to fetch by session_id
app.get('/detections/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM detections WHERE session_id = ? ORDER BY created_at DESC',
      [sessionId]
    );
<<<<<<< Updated upstream

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No detections found for this session' });
    }

    res.json(rows);
  } catch (err) {
    console.error('🔥 Error fetching detections by session:', err.message);
    res.status(500).json({ error: 'Server error fetching session detections' });
  }
});

=======
>>>>>>> Stashed changes

<<<<<<< HEAD
=======
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No detections found for this session' });
    }

    res.json(rows);
  } catch (err) {
    console.error('🔥 Error fetching detections by session:', err.message);
    res.status(500).json({ error: 'Server error fetching session detections' });
  }
});


>>>>>>> 90b212fd3d75da3211eeb9e4107f5af18eb11799
// GET /detections/:id
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

// GET /detections
app.get('/detections', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM detections ORDER BY created_at DESC');
    res.json(results);
  } catch (err) {
    console.error('❌ Failed to fetch detections:', err.message);
    res.status(500).json({ error: 'Database error fetching detections' });
  }
});

// GET /api/spot
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

    res.json(rows);
  } catch (err) {
    console.error('🔥 Error fetching spot info:', err.message);
    res.status(500).json({ error: 'Server error fetching spot info' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
