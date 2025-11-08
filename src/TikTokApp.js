import React, { useState, useEffect } from 'react';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useGestureHandling } from './hooks/useGestureHandling';
import { useVideoCaching } from './hooks/useVideoCaching';
import { useSpeedControl } from './hooks/useSpeedControl';
import VideoPlayer from './components/VideoPlayer';
import VideoOverlay from './components/VideoOverlay';
import VideoInfo from './components/VideoInfo';
import VideoSidebar from './components/VideoSidebar';
import ProgressBar from './components/ProgressBar';
import CommentsModal from './components/CommentsModal';
import CaptionDisplay from './components/CaptionDisplay';
import { originalVideos } from './data/videoData';
import { createInfiniteVideoArray, setViewportHeight, vibrate } from './utils/helpers';

const TikTokApp = ({ creator = null }) => {
  const [showComments, setShowComments] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});
  const [currentTime, setCurrentTime] = useState(0);

  // Filter videos by creator if specified
  const filteredVideos = creator
    ? originalVideos.filter(video => video.username === creator.toLowerCase())
    : originalVideos;

  // Create infinite loop by tripling the videos
  const videos = createInfiniteVideoArray(filteredVideos);

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

  const { cacheProgress, getCachedVideoUrl } = useVideoCaching(originalVideos);

  const handleNavigation = (direction) => {
    const newIndex = currentIndex + direction;
    navigateToVideo(newIndex, filteredVideos.length);

    // Reset interactions when swiping away
    setLikedVideos({});
    setSavedVideos({});
  };

  const { isDragging, containerRef, handleStart, handleMove, handleEnd } = useGestureHandling(handleNavigation);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = containerRef.current;
    if (container && !isDragging) {
      const filteredVideosLength = filteredVideos.length;

      // Check if we need to wrap (disable transition for wrapping)
      const previousIndex = parseInt(container.dataset.previousIndex) || currentIndex;
      const shouldDisableTransition =
        (currentIndex === videos.length - 1) ||
        (currentIndex === 0) ||
        (currentIndex === filteredVideosLength && previousIndex === videos.length - 1) ||
        (currentIndex === filteredVideosLength * 2 - 1 && previousIndex === 0);

      if (shouldDisableTransition) {
        container.style.transition = 'none';
      } else {
        container.style.transition = 'transform 0.3s ease-out';
      }

      const offset = -currentIndex * 100;
      container.style.transform = `translateY(${offset}vh)`;
      container.dataset.currentIndex = currentIndex;
      container.dataset.previousIndex = currentIndex;

      // Re-enable transition after a brief delay for wrapping
      if (shouldDisableTransition) {
        setTimeout(() => {
          if (container) {
            container.style.transition = 'transform 0.3s ease-out';
          }
        }, 50);
      }
    }
  }, [currentIndex, isDragging, videos.length, originalVideos.length]);

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

  const handleVideoLoadStart = (index) => {
    const videoEl = videoRefs.current[index];
    if (videoEl) {
      videoEl.pause();
    }
  };

  const handleVideoCanPlayThrough = (index) => {
    if (index === currentIndex && !isPaused[currentIndex] && hasStarted) {
      const videoEl = videoRefs.current[index];
      if (videoEl) {
        videoEl.play().catch(err => console.warn('Auto-play failed:', err));
      }
    }
  };

  const handleVideoError = (e) => {
    console.warn('Video load error:', e);
  };

  return (
    <div className="w-full overflow-hidden bg-black relative" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Small cache progress indicator */}
      {cacheProgress < 100 && cacheProgress > 0 && (
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
        style={{ transform: `translateY(-${currentIndex * 100}vh)`, height: '100%' }}
      >
        {videos.map((video, index) => (
          <div
            key={`${video.id}-${Math.floor(index / originalVideos.length)}`}
            className="h-screen w-full relative bg-black"
            style={{ height: '100vh' }}
          >
            <VideoPlayer
              video={video}
              index={index}
              currentIndex={currentIndex}
              videoRef={(el) => videoRefs.current[index] = el}
              onTimeUpdate={(videoId, time, duration) => {
                handleVideoProgress(videoId, time, duration);
                if (index === currentIndex) {
                  setCurrentTime(time);
                }
              }}
              onLoadStart={handleVideoLoadStart}
              onCanPlayThrough={handleVideoCanPlayThrough}
              onError={handleVideoError}
              getCachedVideoUrl={getCachedVideoUrl}
              onSpeedStart={index === currentIndex ? handleSpeedStart : undefined}
              onSpeedEnd={index === currentIndex ? handleSpeedEnd : undefined}
            />

            <VideoOverlay
              isPaused={isPaused[index]}
              hasStarted={hasStarted}
              index={index}
              currentIndex={currentIndex}
              onTogglePlay={togglePlayPause}
            />

            {index === currentIndex && (
              <CaptionDisplay
                currentTime={currentTime}
                videoId={video.id}
              />
            )}

            <ProgressBar progress={videoProgress[video.id] || 0} />

            <VideoInfo video={video} />

            <VideoSidebar
              video={video}
              likedVideos={likedVideos}
              savedVideos={savedVideos}
              onLike={handleLike}
              onSave={handleSave}
              onShowComments={() => setShowComments(true)}
            />
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          video={videos[currentIndex]}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default TikTokApp;