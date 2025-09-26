import React from 'react';

const VideoInfo = ({ video }) => {
  return (
    <div className="absolute bottom-24 left-4 right-16 text-white">
      <div className="flex items-center mb-3">
        <span className="text-lg font-semibold">@{video.username}</span>
      </div>
      <p className="text-sm leading-relaxed">{video.description}</p>
    </div>
  );
};

export default VideoInfo;