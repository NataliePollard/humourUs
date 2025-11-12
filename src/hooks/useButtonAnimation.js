import { useState, useEffect } from 'react';
import { ANIMATION_DURATIONS } from '../constants/appConstants';

/**
 * Custom hook for managing button animation state
 * Automatically triggers animation when isActive changes and clears it after duration
 */
export const useButtonAnimation = (isActive, duration = ANIMATION_DURATIONS.BUTTON_PULSE) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);

  return isAnimating;
};
