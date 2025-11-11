const VideoPlayer = ({
  video,
  index,
  currentIndex,
  videoRef,
  onTimeUpdate,
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
        className={`absolute inset-0 w-full h-full ${video.maintainAspectRatio ? 'object-contain' : 'object-cover'}`}
        src={getCachedVideoUrl(video.videoSrc)}
        playsInline
        preload="none"
        muted={isMuted}
        loop
        onTimeUpdate={(e) => onTimeUpdate(video.id, e.target.currentTime, e.target.duration)}
      />
      {/* 2x Speed Control Area - Right side upper portion */}
      {onSpeedStart && onSpeedEnd && (
        <div
          className="absolute right-0 top-0 h-1/2 w-20 z-40 cursor-pointer"
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