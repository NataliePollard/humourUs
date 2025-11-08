import { useEffect, useRef } from 'react';

export const useVideoCaching = (videos, currentIndex = 0) => {
  const preloadedIndexes = useRef(new Set());
  const preloadTimeouts = useRef({});

  // Smart preloading: only cache 3 videos at a time (current + next + prev)
  useEffect(() => {
    const indicesToPreload = new Set();

    // Add current video and neighbors
    if (currentIndex >= 0) {
      indicesToPreload.add(currentIndex); // Current
      if (currentIndex > 0) indicesToPreload.add(currentIndex - 1); // Previous
      if (currentIndex < videos.length - 1) indicesToPreload.add(currentIndex + 1); // Next
    }

    // Clear old timeouts for videos no longer needed
    Object.keys(preloadTimeouts.current).forEach(index => {
      if (!indicesToPreload.has(parseInt(index))) {
        clearTimeout(preloadTimeouts.current[index]);
        delete preloadTimeouts.current[index];
      }
    });

    // Preload new videos
    indicesToPreload.forEach(index => {
      if (!preloadedIndexes.current.has(index) && videos[index]) {
        // Stagger preloads to avoid bandwidth spike
        const delay = index === currentIndex ? 0 : (index < currentIndex ? 200 : 400);

        preloadTimeouts.current[index] = setTimeout(() => {
          const video = videos[index];
          if (video && video.videoSrc) {
            // Trigger preload by creating an image request to the video URL
            // This leverages HTTP caching without loading the entire video into memory
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = video.videoSrc;
            document.head.appendChild(link);

            preloadedIndexes.current.add(index);
          }
        }, delay);
      }
    });

    return () => {
      // Cleanup timeouts on unmount
      Object.values(preloadTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [currentIndex, videos]);

  return {
    cacheProgress: 100,
    cachedVideoCount: preloadedIndexes.current.size,
    getCachedVideoUrl: (src) => src // Return original URL, browser HTTP caching handles it
  };
};