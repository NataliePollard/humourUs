import React from 'react';
import { formatLikes } from '../utils/helpers';

const VideoSidebar = ({
  video,
  likedVideos,
  savedVideos,
  onLike,
  onSave,
  onShowComments,
  showCaptions,
  onToggleCaptions
}) => {
  return (
    <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-6">
      {/* Profile picture */}
      <div className="relative">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-xl">{video.profilePic}</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">+</span>
        </div>
      </div>

      {/* Like button */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onLike(video.id)}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            likedVideos[video.id] ? 'animate-pulse' : ''
          }`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={likedVideos[video.id] ? "#FF3B5C" : "none"}
            stroke={likedVideos[video.id] ? "#FF3B5C" : "white"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <span className="text-white text-xs mt-1">
          {formatLikes(video.likes + (likedVideos[video.id] ? 1 : 0))}
        </span>
      </div>

      {/* Comment button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onShowComments}
          className="w-12 h-12 flex items-center justify-center"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </button>
        <span className="text-white text-xs mt-1">{video.comments.length}</span>
      </div>

      {/* Save button */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onSave(video.id)}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            savedVideos[video.id] ? 'animate-pulse' : ''
          }`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={savedVideos[video.id] ? "#FFD700" : "none"}
            stroke={savedVideos[video.id] ? "#FFD700" : "white"}
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
          </svg>
        </button>
        <span className="text-white text-xs mt-1">
          {formatLikes(video.saves + (savedVideos[video.id] ? 1 : 0))}
        </span>
      </div>

      {/* Caption toggle button */}
      <div className="flex flex-col items-center">
        <button
          onClick={onToggleCaptions}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            showCaptions ? 'opacity-100' : 'opacity-60'
          }`}
          title={showCaptions ? 'Hide captions' : 'Show captions'}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={showCaptions ? "#00D9FF" : "white"}
            strokeWidth="2"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="15" x2="17" y2="15"></line>
            <line x1="9" y1="11" x2="15" y2="11"></line>
          </svg>
        </button>
        <span className="text-white text-xs mt-1">CC</span>
      </div>
    </div>
  );
};

export default VideoSidebar;