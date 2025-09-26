import React from 'react';

const LoadingScreen = ({
  isLoading,
  progress,
  completedVideos,
  totalVideos,
  onSkip
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center px-8 max-w-sm">
        {/* App logo/title */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">🎨 Art Reel</h1>
          <p className="text-gray-400 text-sm">Caching videos for smooth playback...</p>
        </div>

        {/* Progress circle */}
        <div className="relative mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#FF3B5C"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{progress}%</span>
          </div>
        </div>

        {/* Progress details */}
        <div className="text-white mb-6">
          <p className="text-lg font-semibold mb-1">
            {completedVideos} of {totalVideos} videos cached
          </p>
          <p className="text-gray-400 text-sm">
            This will make videos load instantly!
          </p>
        </div>

        {/* Loading animation */}
        <div className="flex justify-center space-x-2 mb-8">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Skip button (appears after a few seconds) */}
        {progress > 20 && (
          <button
            onClick={onSkip}
            className="text-gray-400 text-sm underline hover:text-white transition-colors"
          >
            Skip and start watching
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;