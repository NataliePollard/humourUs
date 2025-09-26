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
  getCachedVideoUrl
}) => {
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      src={getCachedVideoUrl(video.videoSrc)}
      loop
      playsInline
      preload="auto"
      onTimeUpdate={(e) => onTimeUpdate(video.id, e.target.currentTime, e.target.duration)}
      onLoadStart={() => onLoadStart(index)}
      onCanPlayThrough={() => onCanPlayThrough(index)}
      onError={onError}
    />
  );
};

export default VideoPlayer;