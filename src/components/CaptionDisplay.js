import React, { useMemo } from 'react';
import { captionData } from '../data/captionData';

const CaptionDisplay = ({ currentTime, videoId }) => {
  // Find captions for this video
  const videoCaption = useMemo(() => {
    const captionObj = captionData.find(c => c.videoId === videoId);
    if (!captionObj) return null;

    // Find the caption that matches the current time
    const currentCaption = captionObj.captions.find(
      caption => currentTime >= caption.startTime && currentTime <= caption.endTime
    );

    return currentCaption;
  }, [videoId, currentTime]);

  if (!videoCaption) return null;

  return (
    <div className="absolute bottom-24 left-0 right-0 px-4 pb-4 text-center pointer-events-none z-30">
      <div className="bg-black bg-opacity-70 inline-block px-4 py-2 rounded max-w-full">
        <p className="text-white text-base sm:text-lg font-medium leading-snug">
          {videoCaption.text}
        </p>
      </div>
    </div>
  );
};

export default CaptionDisplay;
