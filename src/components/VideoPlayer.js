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
  // Detect if device is iPad
  const isIPad = /iPad|Mac/.test(navigator.userAgent) && !window.MSStream;

  // Determine object-fit based on device and maintainAspectRatio flag
  const objectFit = video.maintainAspectRatio && isIPad ? 'contain' : 'cover';

  return (
    <>
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-${objectFit}`}
        style={{
          objectPosition: 'center'
        }}
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