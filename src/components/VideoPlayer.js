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
  onSpeedEnd
}) => {
  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={getCachedVideoUrl(video.videoSrc)}
        loop
        playsInline
        preload="auto"
        muted
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
    </>
  );
};

export default VideoPlayer;