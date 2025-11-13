import { useState, useRef } from 'react';
import { GESTURE_CONFIG, VIEWPORT } from '../constants/appConstants';

export const useGestureHandling = (onNavigate, currentIndex, enableVirtualScrolling = false, visibleIndices = []) => {
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
      let offset;
      if (enableVirtualScrolling) {
        const baseOffset = (currentIndex - visibleIndices[0]) * VIEWPORT.UNIT;
        const dragOffset = (diffY / window.innerHeight) * VIEWPORT.UNIT;
        offset = -baseOffset - dragOffset;
      } else {
        offset = -currentIndex * VIEWPORT.UNIT - (diffY / window.innerHeight) * VIEWPORT.UNIT;
      }
      containerRef.current.style.transform = `translateY(${offset}vh)`;
    }
  };

  const handleEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const diffY = startY - clientY;

    if (Math.abs(diffY) > GESTURE_CONFIG.SWIPE_THRESHOLD) {
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