// Format like count for display
export const formatLikes = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Vibrate device if supported
export const vibrate = (duration = 50) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

// Set viewport height for mobile browsers
export const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Create infinite video array
export const createInfiniteVideoArray = (originalVideos) => {
  return [...originalVideos, ...originalVideos, ...originalVideos];
};

// Get middle index for infinite loop
export const getMiddleIndex = (totalLength) => {
  return Math.floor(totalLength / 3);
};