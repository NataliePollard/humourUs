import { useState, useRef, useEffect } from 'react';

export const useVideoPlayer = (videos) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const videoRefs = useRef({});

  // Initialize to middle of array for infinite loop
  useEffect(() => {
    if (videos.length > 0) {
      setCurrentIndex(Math.floor(videos.length / 3)); // Middle set
    }
  }, [videos.length]);

  // Handle video playback when currentIndex changes (scrolling)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video) {
        if (parseInt(key) === currentIndex) {
          // Always reset to beginning when scrolling to a video
          video.currentTime = 0;

          // Only auto-play if not the first video (first video requires user interaction)
          const isFirstVideo = currentIndex === Math.floor(videos.length / 3); // Middle set start
          if (!isFirstVideo && hasStarted && !isPaused[currentIndex]) {
            // Try to play immediately without await/timeout to keep the gesture chain
            video.play().catch(error => {
              console.warn('Auto-play failed:', error);
            });
          } else {
            // For first video or when not started, pause it
            video.pause();
          }
        } else {
          video.pause();
          // Reset non-current videos to beginning
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, hasStarted, isPaused, videos.length]);

  // Handle pause/resume for current video when pause state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video && hasStarted && currentIndex !== Math.floor(videos.length / 3)) {
      // Only handle pause/resume for non-first videos
      if (isPaused[currentIndex]) {
        video.pause();
      } else {
        // Resume playing without resetting position
        video.play().catch(error => {
          console.warn('Auto-resume failed:', error);
        });
      }
    }
  }, [isPaused[currentIndex], hasStarted, currentIndex, videos.length]);

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

  const navigateToVideo = (newIndex, originalVideosLength) => {
    // Reset pause state for the new video (TikTok auto-play behavior)
    setIsPaused(prev => ({ ...prev, [newIndex]: false }));

    setCurrentIndex(newIndex);
  };

  // Handle infinite loop wrapping after transitions
  useEffect(() => {
    const originalVideosLength = Math.floor(videos.length / 3);

    // Only wrap at the very edges, not at index 0 or videos.length-1
    if (currentIndex === videos.length - 1) {
      // At the very end, wrap to the beginning of the middle set
      const timer = setTimeout(() => {
        const wrappedIndex = originalVideosLength;
        setCurrentIndex(wrappedIndex);
        setIsPaused(prev => ({ ...prev, [wrappedIndex]: false }));
      }, 300);
      return () => clearTimeout(timer);
    } else if (currentIndex === 0) {
      // At the very beginning, wrap to the end of the middle set
      const timer = setTimeout(() => {
        const wrappedIndex = originalVideosLength * 2 - 1;
        setCurrentIndex(wrappedIndex);
        setIsPaused(prev => ({ ...prev, [wrappedIndex]: false }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, videos.length]);

  return {
    currentIndex,
    setCurrentIndex,
    isPaused,
    setIsPaused,
    hasStarted,
    videoProgress,
    videoRefs,
    togglePlayPause,
    handleVideoProgress,
    navigateToVideo
  };
};