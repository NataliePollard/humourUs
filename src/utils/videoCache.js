// Video caching utility for pre-loading and managing video content
class VideoCache {
  constructor() {
    this.cache = null;
    this.cachedVideos = new Map();
    this.loadingPromises = new Map();
    this.loadingProgress = {};
    this.onProgressUpdate = null;
  }

  async init() {
    try {
      this.cache = await caches.open('tiktok-art-videos-v1');
      return true;
    } catch (error) {
      console.warn('Cache API not supported, falling back to memory cache:', error);
      return false;
    }
  }

  setProgressCallback(callback) {
    this.onProgressUpdate = callback;
  }

  updateProgress(videoSrc, loaded, total) {
    const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
    this.loadingProgress[videoSrc] = { loaded, total, progress };

    if (this.onProgressUpdate) {
      const totalVideos = Object.keys(this.loadingProgress).length;
      const completedVideos = Object.values(this.loadingProgress).filter(p => p.progress === 100).length;
      const overallProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

      this.onProgressUpdate({
        videoProgress: this.loadingProgress,
        overallProgress,
        completedVideos,
        totalVideos
      });
    }
  }

  async preloadVideo(videoSrc) {
    if (this.loadingPromises.has(videoSrc)) {
      return this.loadingPromises.get(videoSrc);
    }

    const promise = this._loadVideo(videoSrc);
    this.loadingPromises.set(videoSrc, promise);

    try {
      const result = await promise;
      this.loadingPromises.delete(videoSrc);
      return result;
    } catch (error) {
      this.loadingPromises.delete(videoSrc);
      throw error;
    }
  }

  async _loadVideo(videoSrc) {
    try {
      // Check if video is already cached
      if (this.cache) {
        const cachedResponse = await this.cache.match(videoSrc);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          this.cachedVideos.set(videoSrc, blobUrl);
          this.updateProgress(videoSrc, blob.size, blob.size);
          return blobUrl;
        }
      }

      // If not cached, fetch and cache it
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', videoSrc, true);
        xhr.responseType = 'blob';

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            this.updateProgress(videoSrc, event.loaded, event.total);
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            const blobUrl = URL.createObjectURL(blob);

            // Store in browser cache if available
            if (this.cache) {
              try {
                const response = new Response(blob, {
                  headers: {
                    'Content-Type': blob.type || 'video/mp4',
                    'Content-Length': blob.size,
                  }
                });
                await this.cache.put(videoSrc, response);
              } catch (cacheError) {
                console.warn('Failed to cache video:', videoSrc, cacheError);
              }
            }

            this.cachedVideos.set(videoSrc, blobUrl);
            this.updateProgress(videoSrc, blob.size, blob.size);
            resolve(blobUrl);
          } else {
            reject(new Error(`Failed to load video: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error(`Network error loading video: ${videoSrc}`));
        };

        xhr.send();
      });
    } catch (error) {
      console.error('Error loading video:', videoSrc, error);
      throw error;
    }
  }

  async preloadAllVideos(videoSources) {
    const promises = videoSources.map(src => this.preloadVideo(src));

    try {
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error preloading videos:', error);
      // Continue even if some videos fail to load
      return false;
    }
  }

  getCachedVideoUrl(videoSrc) {
    return this.cachedVideos.get(videoSrc) || videoSrc;
  }

  isVideoCached(videoSrc) {
    return this.cachedVideos.has(videoSrc);
  }

  getLoadingProgress(videoSrc) {
    return this.loadingProgress[videoSrc] || { progress: 0, loaded: 0, total: 0 };
  }

  getAllProgress() {
    return {
      videoProgress: this.loadingProgress,
      cachedCount: this.cachedVideos.size
    };
  }

  // Clean up blob URLs to prevent memory leaks
  cleanup() {
    this.cachedVideos.forEach(blobUrl => {
      if (blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    });
    this.cachedVideos.clear();
    this.loadingProgress = {};
  }
}

// Create singleton instance
const videoCache = new VideoCache();

export default videoCache;