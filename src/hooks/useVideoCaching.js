import { useState, useEffect } from 'react';
import videoCache from '../utils/videoCache';

export const useVideoCaching = (videos, creator = null) => {
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cachedVideoCount, setCachedVideoCount] = useState(0);

  useEffect(() => {
    const initializeCache = async () => {
      await videoCache.init(creator);

      videoCache.setProgressCallback(({ overallProgress, completedVideos }) => {
        setCacheProgress(overallProgress);
        setCachedVideoCount(completedVideos);
      });

      const videoSources = videos.map(video => video.videoSrc);
      try {
        videoCache.preloadAllVideos(videoSources);
      } catch (error) {
        console.warn('Some videos failed to preload, but continuing anyway');
      }
    };

    if (videos.length > 0) {
      initializeCache();
    }

    return () => {
      videoCache.cleanup();
    };
  }, [videos, creator]);

  return {
    cacheProgress,
    cachedVideoCount,
    getCachedVideoUrl: (src) => videoCache.getCachedVideoUrl(src)
  };
};