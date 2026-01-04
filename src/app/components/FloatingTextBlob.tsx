import { motion } from 'motion/react';

interface FloatingTextBlobProps {
  text: string;
  initialX?: number;
  initialY?: number;
  initialZ?: number;
  rotationY?: number;
  rotationZ?: number;
  animationDelay?: number;
  duration?: number;
  zIndex?: number;
}

export function FloatingTextBlob({
  text,
  initialX = 0,
  initialY = 0,
  initialZ = 0,
  rotationY = 0,
  rotationZ = 0,
  animationDelay = 0,
  duration = 8,
  zIndex = 1,
}: FloatingTextBlobProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        zIndex: zIndex,
      }}
      initial={{
        x: initialX,
        y: initialY,
        z: initialZ,
        rotateY: rotationY,
        rotateZ: rotationZ,
        opacity: 0,
      }}
      animate={{
        y: [initialY, initialY - 20, initialY],
        rotateY: [rotationY, rotationY + 5, rotationY],
        rotateZ: [rotationZ, rotationZ + 2, rotationZ],
        opacity: [0.7, 0.9, 0.7],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: animationDelay,
      }}
    >
      <div
        className="px-4 py-3 bg-black/80 border border-[#00ff41]/40 backdrop-blur-sm"
        style={{
          transform: 'translateZ(0)',
          maxWidth: '450px', // Change this to adjust blob width (currently 450px)
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}
      >
        <p className="text-lg text-[#00ff41]/90 font-['Space_Mono'] leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
