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
        className="absolute inset-0 w-full h-full object-cover"
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

      {/* Mute/Unmute Button - Top left */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="absolute top-4 left-4 z-50 transition-all duration-200"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <img src="/icons/mute.png" alt="Mute" className="w-16 h-16" />
          ) : (
            <img src="/icons/sound.png" alt="Sound" className="w-16 h-16" />
          )}
        </button>
      )}
    </>
  );
};

export default VideoPlayer;