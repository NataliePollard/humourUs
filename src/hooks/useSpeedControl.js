import { useState, useEffect } from 'react';

export const useSpeedControl = (videoRef) => {
  const [isSpeedUp, setIsSpeedUp] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Set playback rate based on speed state
    videoRef.current.playbackRate = isSpeedUp ? 2.0 : 1.0;
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
