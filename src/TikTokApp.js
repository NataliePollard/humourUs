import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useGestureHandling } from './hooks/useGestureHandling';
import { useVideoCaching } from './hooks/useVideoCaching';
import { useSpeedControl } from './hooks/useSpeedControl';
import VideoPlayer from './components/VideoPlayer';
import VideoOverlay from './components/VideoOverlay';
import VideoInfo from './components/VideoInfo';
import ProgressBar from './components/ProgressBar';
import { originalVideos } from './data/videoData';
import { setViewportHeight, vibrate } from './utils/helpers';
import { CACHE_CONFIG, ANIMATION_DURATIONS } from './constants/appConstants';

// Lazy load heavy components
const VideoSidebar = lazy(() => import('./components/VideoSidebar'));
const CommentsModal = lazy(() => import('./components/CommentsModal'));

const TikTokApp = ({ creator = null, isStandalone = false }) => {
  const [showComments, setShowComments] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});
  const [isMuted, setIsMuted] = useState(true);

  // Filter videos by creator if specified
  let filteredVideos = creator
    ? originalVideos.filter(video => video.username === creator.toLowerCase())
    : originalVideos;

  // Filter out hideFromMobile videos if not in standalone mode
  if (!isStandalone) {
    filteredVideos = filteredVideos.filter(video => !video.hideFromMobile);
  }

  const videos = filteredVideos;

  // Custom hooks
  const {
    currentIndex,
    isPaused,
    hasStarted,
    videoProgress,
    videoRefs,
    togglePlayPause,
    handleVideoProgress,
    navigateToVideo
  } = useVideoPlayer(videos);

  const { cacheProgress, getCachedVideoUrl } = useVideoCaching(creator);


  const handleNavigation = (direction) => {
    let newIndex = currentIndex + direction;

    // Wrap around: loop back to first video or to last video
    if (newIndex >= filteredVideos.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = filteredVideos.length - 1;
    }

    navigateToVideo(newIndex);

    // Reset interactions when swiping away
    setLikedVideos({});
    setSavedVideos({});
  };

  const { isDragging, containerRef, handleStart, handleMove, handleEnd } = useGestureHandling(handleNavigation, currentIndex);

  // Speed control for current video
  const { handleSpeedStart, handleSpeedEnd } = useSpeedControl(
    { current: videoRefs.current[currentIndex] }
  );

  // Add viewport height fix for mobile
  useEffect(() => {
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  // Update container position when currentIndex changes
  useEffect(() => {
    const container = containerRef.current;
    if (container && !isDragging) {
      container.style.transition = `transform ${ANIMATION_DURATIONS.SCROLL_TRANSITION}ms ease-out`;
      const offset = -currentIndex * 100;
      container.style.transform = `translate3d(0, ${offset}vh, 0)`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, currentIndex, isDragging]);

  // Pause off-screen videos to reduce CPU usage
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      if (video) {
        const videoIndex = parseInt(index, 10);
        // Pause videos that are not the current or adjacent videos
        if (Math.abs(videoIndex - currentIndex) > 1) {
          if (!video.paused) {
            video.pause();
          }
        }
      }
    });
  }, [currentIndex, videoRefs]);


  // Handle like button
  const handleLike = (videoId) => {
    vibrate();
    setLikedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Handle save button
  const handleSave = (videoId) => {
    vibrate();
    setSavedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    // Apply mute state to all videos immediately
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = newMutedState;
      }
    });
  };

  return (
    <div className="w-full overflow-hidden bg-black relative" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Small cache progress indicator */}
      {cacheProgress < CACHE_CONFIG.DISPLAY_THRESHOLD_MAX && cacheProgress > CACHE_CONFIG.DISPLAY_THRESHOLD_MIN && (
        <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 rounded-full p-2 text-white text-xs">
          Caching {cacheProgress}%
        </div>
      )}

      {/* Video Container */}
      <div
        ref={containerRef}
        className="transition-transform duration-300 ease-out"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
          height: '100%'
        }}
      >
        {videos.map((video, renderIndex) => {
          return (
            <div
              key={`${video.id}-${renderIndex}`}
              className="h-screen w-full relative bg-black"
              style={{ height: '100vh' }}
            >
              <VideoPlayer
                video={video}
                index={renderIndex}
                currentIndex={currentIndex}
                videoRef={(el) => videoRefs.current[renderIndex] = el}
                onTimeUpdate={(videoId, time, duration) => {
                  handleVideoProgress(videoId, time, duration);
                }}
                getCachedVideoUrl={getCachedVideoUrl}
                onSpeedStart={renderIndex === currentIndex ? handleSpeedStart : undefined}
                onSpeedEnd={renderIndex === currentIndex ? handleSpeedEnd : undefined}
                isMuted={isMuted}
              />

              <VideoOverlay
                isPaused={isPaused[renderIndex]}
                hasStarted={hasStarted}
                index={renderIndex}
                currentIndex={currentIndex}
                onTogglePlay={togglePlayPause}
                isMuted={isMuted}
                onToggleMute={renderIndex === currentIndex ? handleToggleMute : undefined}
              />

              <ProgressBar progress={videoProgress[video.id] || 0} />

              <VideoInfo video={video} />

              <Suspense fallback={null}>
                <VideoSidebar
                  video={video}
                  likedVideos={likedVideos}
                  savedVideos={savedVideos}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShowComments={() => setShowComments(true)}
                />
              </Suspense>
            </div>
          );
        })}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <Suspense fallback={null}>
          <CommentsModal
            video={videos[currentIndex]}
            onClose={() => setShowComments(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default TikTokApp;