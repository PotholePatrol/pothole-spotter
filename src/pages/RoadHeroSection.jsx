import React, { useState } from 'react';

const RoadHeroSection = () => {
  const [transformStyle, setTransformStyle] = useState({});

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y / height) - 0.5) * 20; // tilt range X
    const rotateY = ((x / width) - 0.5) * 20; // tilt range Y

    setTransformStyle({
      transform: `translateZ(60px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
      boxShadow:
        '0 30px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 215, 0, 1)'
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'translateZ(40px) rotateX(8deg) rotateY(-4deg)',
      transition: 'transform 0.3s ease',
      boxShadow:
        '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.8)'
    });
  };

  return (
    <section
      className="background-image"
      style={{ backgroundImage: `url('/images/sunset-road.jpg')` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="background-text" style={transformStyle}>
        <h3>Drive Toward Safer Roads</h3>
        <p>Upload road images and detect potholes with AI-powered analysis.</p>
      </div>
    </section>
  );
};

export default RoadHeroSection;
