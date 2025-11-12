import { useState, useEffect } from 'react';
import { VIDEO_CONFIG } from '../constants/appConstants';

export const useSpeedControl = (videoRef) => {
  const [isSpeedUp, setIsSpeedUp] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Set playback rate based on speed state
    videoRef.current.playbackRate = isSpeedUp ? VIDEO_CONFIG.FAST_SPEED : VIDEO_CONFIG.NORMAL_SPEED;
  }, [isSpeedUp, videoRef]);

  const handleSpeedStart = () => {
    setIsSpeedUp(true);
  };

  const handleSpeedEnd = () => {
    setIsSpeedUp(false);
  };

  return {
    handleSpeedStart,
    handleSpeedEnd
  };
};
