import { useState, useEffect, useRef } from 'react';
import { originalVideos } from '../data/videoData';

export const useVideoCaching = () => {
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cachedVideos, setCachedVideos] = useState({});
  const blobUrlsRef = useRef([]);

  useEffect(() => {
    // Pre-cache all videos on app load
    const cacheAllVideos = async () => {
      const videoUrls = originalVideos.map(video => video.videoSrc);
      let cached = 0;

      for (const url of videoUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const blob = await response.blob();
            // Store blob URL in cache
            const blobUrl = URL.createObjectURL(blob);
            blobUrlsRef.current.push(blobUrl);
            setCachedVideos(prev => ({
              ...prev,
              [url]: blobUrl
            }));
            cached++;
            setCacheProgress(Math.round((cached / videoUrls.length) * 100));
          }
        } catch (error) {
          console.warn(`Failed to cache video: ${url}`, error);
          // Still count as cached to continue progress
          cached++;
          setCacheProgress(Math.round((cached / videoUrls.length) * 100));
        }
      }
    };

    cacheAllVideos();

    // Cleanup blob URLs on unmount
    return () => {
      blobUrlsRef.current.forEach(blobUrl => {
        URL.revokeObjectURL(blobUrl);
      });
      blobUrlsRef.current = [];
    };
  }, []);

  const getCachedVideoUrl = (src) => {
    // Return cached blob URL if available, otherwise return original URL
    return cachedVideos[src] || src;
  };

  return {
    cacheProgress,
    getCachedVideoUrl
  };
};