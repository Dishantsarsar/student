import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

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
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none overflow-hidden">
      <motion.div 
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative w-[120vw] h-[120vh] [transform-style:preserve-3d] will-change-transform"
          style={{ rotateX, rotateY }}
        >
          {/* Deepest Layer - Perspective Grid */}
          <motion.div 
            className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] will-change-transform bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
            style={{ x: gridX, y: gridY, z: -200 }}
          />

          {/* Middle Layer - Cyan Orb */}
          <motion.div 
            className="absolute rounded-full blur-[100px] will-change-transform opacity-40 w-[50vw] h-[50vw] top-[10%] left-[10%] bg-[radial-gradient(circle,rgba(0,242,254,0.3)_0%,transparent_60%)]"
            style={{ x: orb1X, y: orb1Y, z: -50 }}
          />

          {/* Front Layer - Magenta Orb */}
          <motion.div 
            className="absolute rounded-full blur-[100px] will-change-transform opacity-40 w-[60vw] h-[60vw] -bottom-[10%] -right-[10%] bg-[radial-gradient(circle,rgba(252,0,255,0.25)_0%,transparent_60%)]"
            style={{ x: orb2X, y: orb2Y, z: 100 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default InteractiveBackground;
