import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import './InteractiveBackground.css';

function InteractiveBackground() {
  // Use springs directly for normalized coordinates (-1 to 1)
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    // Disable on mobile completely for performance
    if (window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      // Normalize between -1 and 1
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, [-1, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [-1, 1], [-15, 15]);

  const gridX = useTransform(mouseX, [-1, 1], [-40, 40]);
  const gridY = useTransform(mouseY, [-1, 1], [-40, 40]);

  const orb1X = useTransform(mouseX, [-1, 1], [-80, 80]);
  const orb1Y = useTransform(mouseY, [-1, 1], [-80, 80]);

  const orb2X = useTransform(mouseX, [-1, 1], [100, -100]);
  const orb2Y = useTransform(mouseY, [-1, 1], [100, -100]);

  return (
    <div className="interactive-bg-wrapper">
      <motion.div 
        className="interactive-bg-container"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="interactive-bg-scene"
          style={{ rotateX, rotateY }}
        >
          {/* Deepest Layer - Perspective Grid */}
          <motion.div 
            className="interactive-bg-grid"
            style={{ x: gridX, y: gridY, z: -200 }}
          />

          {/* Middle Layer - Cyan Orb */}
          <motion.div 
            className="interactive-bg-orb orb-cyan"
            style={{ x: orb1X, y: orb1Y, z: -50 }}
          />

          {/* Front Layer - Magenta Orb */}
          <motion.div 
            className="interactive-bg-orb orb-magenta"
            style={{ x: orb2X, y: orb2Y, z: 100 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default InteractiveBackground;
