import { useState, useEffect, useRef } from 'react';
import noEyesImg from '../../asset/no eyes.png';
import noEyesOverlayImg from '../../asset/no eyes overlay.png';

interface EyePosition {
  x: number; // relative to image (0-1)
  y: number; // relative to image (0-1)
  radius: number; // iris radius in pixels
  maxOffset: number; // maximum offset from center in pixels
}

export function EyeTrackingPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [eyeOffsets, setEyeOffsets] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

  // Eye positions (relative to image, will need adjustment based on actual image)
  // These are estimates - adjust based on the actual image dimensions
  const eyePositions: { left: EyePosition; right: EyePosition } = {
    left: {
      x: 0.45 + 0.025 - 0.008, // 40% from left
      y: 0.45 + 0.025 + 0.008, // 45% from top
      radius: 7, // iris radius
      maxOffset: 6, // max movement in pixels
    },
    right: {
      x: 0.6 - 0.02, // 60% from left
      y: 0.45 + 0.025 + 0.005, // 45% from top
      radius: 7,
      maxOffset: 6,
    },
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const img = containerRef.current.querySelector('img');
      if (!img) return;

      // Get image dimensions
      const imgRect = img.getBoundingClientRect();
      const imgCenterX = imgRect.left + imgRect.width / 2;
      const imgCenterY = imgRect.top + imgRect.height / 2;

      // Calculate relative mouse position
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Check if cursor is within the avatar's Y-axis bounds (vertical range)
      const isWithinYBounds = mouseY >= imgRect.top && mouseY <= imgRect.bottom;

      // If cursor is not within Y bounds, keep eyes in original position
      if (!isWithinYBounds) {
        setEyeOffsets({
          left: { x: 0, y: 0 },
          right: { x: 0, y: 0 },
        });
        return;
      }

      // Calculate offsets for each eye
      const calculateEyeOffset = (eyePos: EyePosition) => {
        // Eye center in image coordinates
        const eyeCenterX = imgRect.left + eyePos.x * imgRect.width;
        const eyeCenterY = imgRect.top + eyePos.y * imgRect.height;

        // Vector from eye center to mouse
        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize and constrain
        const maxDistance = eyePos.maxOffset;
        const normalizedDistance = Math.min(distance, maxDistance);
        const scale = distance > 0 ? normalizedDistance / distance : 0;

        return {
          x: dx * scale,
          y: dy * scale,
        };
      };

      setEyeOffsets({
        left: calculateEyeOffset(eyePositions.left),
        right: calculateEyeOffset(eyePositions.right),
      });

      setMousePos({ x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 md:w-80 md:h-80 mx-auto"
      style={{ width: '700px', height: '700px' }}
    >
      {/* Layer 1: Base image without eyes */}
      <img
        src={noEyesImg}
        alt="Portrait base"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ imageRendering: 'pixelated', zIndex: 1 }}
      />

      {/* Layer 2: Dynamic iris that moves with cursor */}
      {/* Left eye iris */}
      <div
        className="absolute rounded-none bg-[#153915] transition-all duration-150 ease-out"
        style={{
          left: `calc(${eyePositions.left.x * 100}% - ${eyePositions.left.radius}px)`,
          top: `calc(${eyePositions.left.y * 100}% - ${eyePositions.left.radius}px)`,
          width: `${eyePositions.left.radius * 2}px`,
          height: `${eyePositions.left.radius * 2}px`,
          transform: `translate(${eyeOffsets.left.x}px, ${eyeOffsets.left.y}px)`,
          boxShadow: `0 0 ${eyePositions.left.radius}px rgba(0, 255, 65, 0.5)`,
          zIndex: 2,
        }}
      />

      {/* Right eye iris */}
      <div
        className="absolute rounded-none bg-[#153915] transition-all duration-150 ease-out"
        style={{
          left: `calc(${eyePositions.right.x * 100}% - ${eyePositions.right.radius}px)`,
          top: `calc(${eyePositions.right.y * 100}% - ${eyePositions.right.radius}px)`,
          width: `${eyePositions.right.radius * 2}px`,
          height: `${eyePositions.right.radius * 2}px`,
          transform: `translate(${eyeOffsets.right.x}px, ${eyeOffsets.right.y}px)`,
          boxShadow: `0 0 ${eyePositions.right.radius}px rgba(0, 255, 65, 0.5)`,
          zIndex: 2,
        }}
      />

      {/* Layer 3: Overlay image on top */}
      <img
        src={noEyesOverlayImg}
        alt="Portrait overlay"
        className="absolute inset-0 w-full h-full object-contain opacity-100"
        style={{ imageRendering: 'pixelated', zIndex: 3 }}
      />

      {/* Bottom feather/fade effect */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30%', // Adjust this to change feather height (30% = 30% from bottom)
          background: 'linear-gradient(to top, #000000 75%, rgba(0, 0, 0, 0.95) 60%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 5,
          opacity: 1,
        }}
      />
    </div>
  );
}
