import { useState, useRef } from 'react';

export const useGestureHandling = (onNavigate) => {
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleStart = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setIsDragging(true);
  };

  const handleMove = (e) => {
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const diffY = startY - clientY;

    if (containerRef.current) {
      const currentIndex = parseInt(containerRef.current.dataset.currentIndex) || 0;
      const offset = -currentIndex * 100 - (diffY / window.innerHeight) * 100;
      containerRef.current.style.transform = `translateY(${offset}vh)`;
    }
  };

  const handleEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const diffY = startY - clientY;
    const threshold = 50;

    if (Math.abs(diffY) > threshold) {
      const direction = diffY > 0 ? 1 : -1;
      onNavigate(direction);
    }
  };

  return {
    isDragging,
    containerRef,
    handleStart,
    handleMove,
    handleEnd
  };
};