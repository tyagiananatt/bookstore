import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseEnter = (e) => {
      const element = e.target;
      if (
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.closest('button') ||
        element.closest('a') ||
        element.closest('.cursor-pointer')
      ) {
        setCursorVariant('hover');
        const text = element.getAttribute('data-cursor-text') || 
                    element.textContent?.trim().substring(0, 20) || '';
        setCursorText(text);
      } else if (element.closest('.cursor-magnetic')) {
        setCursorVariant('magnetic');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseover', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const variants = {
    default: {
      width: 20,
      height: 20,
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      backgroundColor: '#facc15',
      mixBlendMode: 'difference',
    },
    hover: {
      width: 80,
      height: 80,
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      backgroundColor: '#facc15',
      mixBlendMode: 'normal',
    },
    magnetic: {
      width: 40,
      height: 40,
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      backgroundColor: '#facc15',
      mixBlendMode: 'difference',
    },
  };

  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />
      {cursorText && cursorVariant === 'hover' && (
        <motion.div
          className="cursor-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: mousePosition.x + 50,
            y: mousePosition.y + 50,
          }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;

