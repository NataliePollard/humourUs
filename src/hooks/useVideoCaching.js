export const useVideoCaching = () => {
  // Use browser's default HTTP caching behavior
  // With virtual scrolling, only rendered videos load, and HTTP caching handles the rest

  return {
    cacheProgress: 100,
    getCachedVideoUrl: (src) => src // Return original URL as-is
  };
};