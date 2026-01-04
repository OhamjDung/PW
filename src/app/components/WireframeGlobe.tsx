import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function WireframeGlobe() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Outer circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#00ff41] opacity-70"
        />
        
        {/* Latitude lines */}
        {[30, 50, 70, 90, 110, 130, 150, 170].map((y) => (
          <ellipse
            key={y}
            cx="100"
            cy="100"
            rx="90"
            ry={Math.abs(100 - y) * 0.9}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-[#00ff41] opacity-50"
          />
        ))}
        
        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map((angle) => {
          const x = Math.cos((angle * Math.PI) / 180) * 90;
          return (
            <ellipse
              key={angle}
              cx="100"
              cy="100"
              rx={Math.abs(x)}
              ry="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-[#00ff41] opacity-50"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}
        
        {/* Center vertical line */}
        <line
          x1="100"
          y1="10"
          x2="100"
          y2="190"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-[#00ff41] opacity-70"
        />
        
        {/* Equator */}
        <line
          x1="10"
          y1="100"
          x2="190"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#00ff41]"
        />
        
        {/* Random dots for stars/data points */}
        {[...Array(20)].map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 180 + 10}
            cy={Math.random() * 180 + 10}
            r="1"
            fill="currentColor"
            className="text-[#00ff41]"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[#00ff41] opacity-10 blur-xl rounded-full" />
    </div>
  );
}
