import { useState, useRef, useEffect } from 'react';

export const useSpeedControl = (videoRef) => {
  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const speedTimeoutRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Set playback rate based on speed state
    videoRef.current.playbackRate = isSpeedUp ? 2.0 : 1.0;
  }, [isSpeedUp, videoRef]);

  const handleSpeedStart = () => {
    // Clear any pending timeout
    if (speedTimeoutRef.current) {
      clearTimeout(speedTimeoutRef.current);
    }
    setIsSpeedUp(true);
  };

  const handleSpeedEnd = () => {
    setIsSpeedUp(false);
  };

  const handleSpeedCancel = () => {
    setIsSpeedUp(false);
  };

  return {
    isSpeedUp,
    handleSpeedStart,
    handleSpeedEnd,
    handleSpeedCancel
  };
};
