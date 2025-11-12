const VideoOverlay = ({ isPaused, hasStarted, index, currentIndex, onTogglePlay, videoRef }) => {
  const handleClick = () => {
    if (index === currentIndex) {
      // Unmute on first play
      if (!hasStarted && videoRef?.current) {
        videoRef.current.muted = false;
      }
      onTogglePlay(index);
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 'max(0px, env(safe-area-inset-top))',
        paddingLeft: 'max(0px, env(safe-area-inset-left))',
        paddingRight: 'max(0px, env(safe-area-inset-right))',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))'
      }}
      onClick={handleClick}
    >
      {(isPaused || (!hasStarted && index === currentIndex)) && (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" opacity="0.9">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </div>
  );
};

export default VideoOverlay;