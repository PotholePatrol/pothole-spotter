CREATE DATABASE IF NOT EXISTS smartroads;

USE smartroads;

CREATE TABLE IF NOT EXISTS detections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255),
  image_url VARCHAR(255),
  lat FLOAT,
  lng FLOAT,
  stretch_start_lat FLOAT,
  stretch_start_lng FLOAT,
  stretch_end_lat FLOAT,
  stretch_end_lng FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
