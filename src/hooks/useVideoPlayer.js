import { useState, useRef, useEffect } from 'react';

export const useVideoPlayer = (videos) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const videoRefs = useRef({});

  // Initialize to first video
  useEffect(() => {
    if (videos.length > 0) {
      setCurrentIndex(0);
    }
  }, [videos.length]);

  // Handle video playback when currentIndex changes (scrolling)
  useEffect(() => {
    // Pause all non-current videos
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      if (video && parseInt(index) !== currentIndex) {
        video.pause();
      }
    });

    // Play or pause the current video
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // Reset current video to beginning
      currentVideo.currentTime = 0;

      // Only play if user has started interacting and video is not manually paused
      if (hasStarted && !isPaused[currentIndex]) {
        currentVideo.play().catch(error => {
          console.warn('Play failed:', error);
        });
      } else {
        currentVideo.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, videos.length]);

  // Handle pause/resume without resetting position
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video && hasStarted) {
      if (isPaused[currentIndex]) {
        video.pause();
      } else {
        // Resume playing without resetting position
        video.play().catch(error => {
          console.warn('Auto-resume failed:', error);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, hasStarted]);

  const togglePlayPause = async (index) => {
    const video = videoRefs.current[index];
    if (video) {
      // Check if video is currently paused or not playing
      const isCurrentlyPaused = video.paused || isPaused[index];

      if (isCurrentlyPaused) {
        // Resume/start playing (keep current position)
        try {
          await video.play();
          setIsPaused(prev => ({ ...prev, [index]: false }));
          setHasStarted(true);
        } catch (error) {
          console.warn('Play failed:', error);
        }
      } else {
        // Pause the video (maintain current position)
        video.pause();
        setIsPaused(prev => ({ ...prev, [index]: true }));
      }
    }
  };

  const handleVideoProgress = (videoId, currentTime, duration) => {
    const progress = (currentTime / duration) * 100;
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: progress
    }));
  };

  const navigateToVideo = (newIndex) => {
    // Reset pause state for the new video (TikTok auto-play behavior)
    setIsPaused(prev => ({ ...prev, [newIndex]: false }));

    setCurrentIndex(newIndex);
  };

  return {
    currentIndex,
    isPaused,
    hasStarted,
    videoProgress,
    videoRefs,
    togglePlayPause,
    handleVideoProgress,
    navigateToVideo
  };
};