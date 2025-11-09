const VideoOverlay = ({ isPaused, hasStarted, index, currentIndex, onTogglePlay }) => {
  const handleClick = () => {
    if (index === currentIndex) {
      onTogglePlay(index);
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
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