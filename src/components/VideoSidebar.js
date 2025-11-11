import { useState, useEffect } from 'react';
import { formatLikes } from '../utils/helpers';
import { creators } from '../data/creators';

const VideoSidebar = ({
  video,
  likedVideos,
  savedVideos,
  onLike,
  onSave,
  onShowComments
}) => {
  const [animatingLike, setAnimatingLike] = useState(false);
  const [animatingSave, setAnimatingSave] = useState(false);

  const videoId = video.id;
  const isLiked = likedVideos[videoId];
  const isSaved = savedVideos[videoId];

  // Trigger like animation when likedVideos state changes
  useEffect(() => {
    if (isLiked) {
      setAnimatingLike(true);
      const timer = setTimeout(() => setAnimatingLike(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isLiked]);

  // Trigger save animation when savedVideos state changes
  useEffect(() => {
    if (isSaved) {
      setAnimatingSave(true);
      const timer = setTimeout(() => setAnimatingSave(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);
  return (
    <div className="absolute right-4 bottom-28 flex flex-col items-center space-y-6">
      {/* Profile picture */}
      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
        {creators[video.username]?.profilePic ? (
          <img src={creators[video.username].profilePic} alt={video.username} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">👤</span>
        )}
      </div>

      {/* Like button */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onLike(video.id)}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            animatingLike ? 'animate-pulse-once' : ''
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
            animatingSave ? 'animate-pulse-once' : ''
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
    </div>
  );
};

export default VideoSidebar;