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
        autoPlay
        playsInline
        preload="none"
        muted={isMuted}
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
          className="absolute top-4 left-4 z-50 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full p-2.5 text-white transition-all duration-200 backdrop-blur-sm"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0110 2.414v19.172a1 1 0 01-1.707.707L5.586 17z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0110 2.414v19.172a1 1 0 01-1.707.707L5.586 17z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
};

export default VideoPlayer;