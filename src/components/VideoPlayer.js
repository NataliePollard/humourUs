import React from 'react';

const VideoPlayer = ({
  video,
  index,
  currentIndex,
  videoRef,
  onTimeUpdate,
  onLoadStart,
  onCanPlayThrough,
  onError,
  getCachedVideoUrl,
  onSpeedStart,
  onSpeedEnd,
  isMuted,
  onToggleMute
}) => {
  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={getCachedVideoUrl(video.videoSrc)}
        playsInline
        preload="none"
        muted={isMuted}
        loop
        onTimeUpdate={(e) => onTimeUpdate(video.id, e.target.currentTime, e.target.duration)}
        onLoadStart={() => onLoadStart(index)}
        onCanPlayThrough={() => onCanPlayThrough(index)}
        onError={onError}
      />
      {/* 2x Speed Control Area - Right side above heart */}
      {onSpeedStart && onSpeedEnd && (
        <div
          className="absolute right-0 top-0 bottom-1/3 w-20 z-40 cursor-pointer"
          onTouchStart={onSpeedStart}
          onTouchEnd={onSpeedEnd}
          onTouchCancel={onSpeedEnd}
          onMouseDown={onSpeedStart}
          onMouseUp={onSpeedEnd}
          onMouseLeave={onSpeedEnd}
        />
      )}

      {/* Mute/Unmute Button - Top left */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="absolute top-4 left-4 z-50 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <img src="/icons/mute.png" alt="Mute" className="w-6 h-6" />
          ) : (
            <img src="/icons/sound.png" alt="Sound" className="w-6 h-6" />
          )}
        </button>
      )}
    </>
  );
};

export default VideoPlayer;