import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      document.body.style.cursor = 'auto';
      // Dynamically remove the cursor-none class to restore the default cursor on mobile/touch
      const cursorNoneEl = document.querySelector('.cursor-none');
      if (cursorNoneEl) {
        cursorNoneEl.classList.remove('cursor-none');
      }
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.closest('a') || 
          target.closest('button') || 
          target.closest('input') || 
          target.closest('textarea') || 
          target.closest('canvas')
        ) {
            setIsHovering(true);
        } else {
            setIsHovering(false);
        }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none z-[100] mix-blend-screen"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0 : 1
        }}
        transition={{
            type: "tween",
            ease: "backOut",
            duration: 0.1
        }}
      />
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/50 rounded-full pointer-events-none z-[100] mix-blend-screen"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "rgba(34, 211, 238, 0.1)" : "transparent",
          borderColor: isHovering ? "rgba(34, 211, 238, 0.8)" : "rgba(34, 211, 238, 0.5)"
        }}
        transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 0.5
        }}
      />
    </>
  );
};

export default CustomCursor;