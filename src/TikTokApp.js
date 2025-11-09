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
import { originalVideos } from './data/videoData';
import { setViewportHeight, vibrate } from './utils/helpers';

const TikTokApp = ({ creator = null }) => {
  const [showComments, setShowComments] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});
  const [isMuted, setIsMuted] = useState(true);

  // Filter videos by creator if specified
  const filteredVideos = creator
    ? originalVideos.filter(video => video.username === creator.toLowerCase())
    : originalVideos;

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

  const { cacheProgress, getCachedVideoUrl } = useVideoCaching();

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
      container.style.transition = 'transform 0.3s ease-out';
      const offset = -currentIndex * 100;
      container.style.transform = `translateY(${offset}vh)`;
    }
  }, [containerRef, currentIndex, isDragging]);

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
              }}
              getCachedVideoUrl={getCachedVideoUrl}
              onSpeedStart={index === currentIndex ? handleSpeedStart : undefined}
              onSpeedEnd={index === currentIndex ? handleSpeedEnd : undefined}
              isMuted={isMuted}
              onToggleMute={index === currentIndex ? handleToggleMute : undefined}
            />

            <VideoOverlay
              isPaused={isPaused[index]}
              hasStarted={hasStarted}
              index={index}
              currentIndex={currentIndex}
              onTogglePlay={togglePlayPause}
            />

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