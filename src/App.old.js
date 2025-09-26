import React, { useState, useRef, useEffect } from 'react';
import videoCache from './utils/videoCache';
import LoadingScreen from './components/LoadingScreen';

const TikTokApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [savedVideos, setSavedVideos] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [isPaused, setIsPaused] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cachedVideoCount, setCachedVideoCount] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef({});

  // Placeholder data - replace with your videos later
  const originalVideos = [
    {
      id: 1,
      videoSrc: "/videos/video1.mp4",
      username: "abstractartist",
      description: "exploring digital textures and movement ✨ #digitalart #experimental",
      profilePic: "🎨",
      likes: 847,
      saves: 234,
      comments: [
        { user: "artlover23", text: "This is absolutely mesmerizing! 😍" },
        { user: "digitalfan", text: "The way the colors blend is incredible" },
        { user: "creativeworld", text: "So innovative! More please 🙌" }
      ]
    },
    {
      id: 2,
      videoSrc: "/videos/video2.mp4",
      username: "visualpoetry",
      description: "when colors collide with emotion 🌊 #contemporary #artinstallation",
      profilePic: "🌊",
      likes: 623,
      saves: 189,
      comments: [
        { user: "oceandreams", text: "The fluidity is so calming 💙" },
        { user: "artcritic_", text: "Breathtaking composition!" },
        { user: "bluevibes", text: "I could watch this for hours" },
        { user: "contemporary_art", text: "This belongs in a gallery 🖼️" },
        { user: "emotional_art", text: "Feeling all the emotions rn 😭✨" },
        { user: "deepblue", text: "Water vibes are everything 🌊" }
      ]
    },
    {
      id: 3,
      videoSrc: "/videos/video3.mp4",
      username: "motionmaker",
      description: "nature meets technology in this piece 🌿 #bioart #newmedia",
      profilePic: "🌱",
      likes: 392,
      saves: 156,
      comments: [
        { user: "naturelover", text: "The organic movement is perfect 🌿" }
      ]
    },
    {
      id: 4,
      videoSrc: "/videos/video4.mp4",
      username: "urbancanvas",
      description: "street art reimagined for the digital age 🎨 #streetart #digital",
      profilePic: "🏙️",
      likes: 756,
      saves: 298,
      comments: [
        { user: "streetart_fan", text: "Bringing the streets to digital! 🔥" },
        { user: "urbanvibes", text: "This hits different 💯" },
        { user: "graffiti_king", text: "Respect for the digital evolution" },
        { user: "cityart", text: "Love the urban energy ⚡" },
        { user: "wallart_", text: "Traditional meets future perfectly" },
        { user: "streetculture", text: "This is the evolution we needed" },
        { user: "digitalstreet", text: "Pure fire content 🔥🔥" }
      ]
    },
    {
      id: 5,
      videoSrc: "/videos/video5.mp4",
      username: "synthwavelab",
      description: "nostalgic futures and neon dreams 💜 #synthwave #retroart",
      profilePic: "🌆",
      likes: 934,
      saves: 412,
      comments: [
        { user: "neonlights", text: "80s vibes but make it futuristic ✨" },
        { user: "synthwave_", text: "This is my aesthetic 💜" },
        { user: "retro_future", text: "Nostalgic and innovative at once" },
        { user: "neon_dreams", text: "Living for these colors!" }
      ]
    }
  ];

  // Add viewport height fix for mobile
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);

    // Start in middle set to create infinite loop illusion
    setCurrentIndex(originalVideos.length);

    return () => window.removeEventListener('resize', setVH);
  }, [originalVideos.length]);

  // Initialize video caching on component mount
  useEffect(() => {
    const initializeCache = async () => {
      await videoCache.init();

      // Set up progress callback
      videoCache.setProgressCallback(({ overallProgress, completedVideos, totalVideos }) => {
        setCacheProgress(overallProgress);
        setCachedVideoCount(completedVideos);
      });

      // Start preloading all videos in background
      const videoSources = originalVideos.map(video => video.videoSrc);
      try {
        // Don't await - let it run in background
        videoCache.preloadAllVideos(videoSources);
      } catch (error) {
        console.warn('Some videos failed to preload, but continuing anyway');
      }
    };

    initializeCache();

    // Cleanup on unmount
    return () => {
      videoCache.cleanup();
    };
  }, [originalVideos]);

  // Create infinite loop by tripling the videos
  const videos = [...originalVideos, ...originalVideos, ...originalVideos];

  const handleStart = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setIsDragging(true);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const diffY = startY - clientY;
    
    // Add some visual feedback during drag
    if (containerRef.current) {
      const offset = -currentIndex * 100 - (diffY / window.innerHeight) * 100;
      containerRef.current.style.transform = `translateY(${offset}vh)`;
    }
  };

  const handleEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const diffY = startY - clientY;
    const threshold = 50; // minimum swipe distance
    
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        // Swipe up - next video
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        
        // Loop back to middle set if at end
        if (nextIndex >= videos.length - 1) {
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.transition = 'none';
              setCurrentIndex(originalVideos.length);
              setTimeout(() => {
                if (containerRef.current) {
                  containerRef.current.style.transition = 'transform 0.3s ease-out';
                }
              }, 50);
            }
          }, 300);
        }
      } else {
        // Swipe down - previous video
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        
        // Loop back to middle set if at beginning
        if (prevIndex <= 0) {
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.transition = 'none';
              setCurrentIndex(originalVideos.length * 2 - 1);
              setTimeout(() => {
                if (containerRef.current) {
                  containerRef.current.style.transition = 'transform 0.3s ease-out';
                }
              }, 50);
            }
          }, 300);
        }
      }
      
      // Reset interactions when swiping away
      setLikedVideos({});
      setSavedVideos({});
    }
  };

  // Handle like button
  const handleLike = (videoId) => {
    // Vibrate phone if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setLikedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Handle save button
  const handleSave = (videoId) => {
    // Vibrate phone if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setSavedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Format like count
  const formatLikes = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Update container position when currentIndex changes
  useEffect(() => {
    if (containerRef.current && !isDragging) {
      const offset = -currentIndex * 100;
      containerRef.current.style.transform = `translateY(${offset}vh)`;
    }

    // Play current video and pause others, reset video time
    Object.keys(videoRefs.current).forEach(async (key) => {
      const video = videoRefs.current[key];
      if (video) {
        if (parseInt(key) === currentIndex) {
          // Pause first to avoid interruption errors
          video.pause();
          video.currentTime = 0; // Reset to beginning

          if (!isPaused[currentIndex] && hasStarted) {
            try {
              // Wait a small moment before playing
              await new Promise(resolve => setTimeout(resolve, 100));
              if (parseInt(key) === currentIndex) { // Check if still current
                await video.play();
              }
            } catch (error) {
              console.warn('Play failed:', error);
              // If autoplay fails, user will need to tap
            }
          }
        } else {
          video.pause();
          video.currentTime = 0; // Reset when leaving
        }
      }
    });
  }, [currentIndex, isDragging, isPaused, hasStarted]);

  // Handle video progress
  const handleVideoProgress = (videoId, currentTime, duration) => {
    const progress = (currentTime / duration) * 100;
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: progress
    }));
  };

  // Toggle play/pause
  const togglePlayPause = async (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (!hasStarted) {
        setHasStarted(true);
        try {
          await video.play();
        } catch (error) {
          console.warn('Play failed on start:', error);
        }
      } else if (isPaused[index]) {
        try {
          await video.play();
          setIsPaused(prev => ({ ...prev, [index]: false }));
        } catch (error) {
          console.warn('Resume play failed:', error);
        }
      } else {
        video.pause();
        setIsPaused(prev => ({ ...prev, [index]: true }));
      }
    }
  };

  // Skip cache loading and start using the app
  const handleSkipCaching = () => {
    setCacheLoading(false);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-black relative">
      {/* Small cache progress indicator */}
      {cacheProgress < 100 && cacheProgress > 0 && (
        <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 rounded-full p-2 text-white text-xs">
          Caching {cacheProgress}%
        </div>
      )}

      {/* Video Container */}
      <div 
        ref={containerRef}
        className="transition-transform duration-300 ease-out"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {videos.map((video, index) => (
          <div 
            key={video.id}
            className="h-screen w-full relative bg-black"
            style={{ height: '100vh' }}
          >
            {/* Video element */}
            <video
              ref={(el) => videoRefs.current[index] = el}
              className="absolute inset-0 w-full h-full object-cover"
              src={videoCache.getCachedVideoUrl(video.videoSrc)}
              loop
              playsInline
              preload="auto"
              muted={true}
              onTimeUpdate={(e) => handleVideoProgress(video.id, e.target.currentTime, e.target.duration)}
              onLoadStart={() => {
                // Ensure video is paused when loading starts
                const videoEl = videoRefs.current[index];
                if (videoEl) {
                  videoEl.pause();
                }
              }}
              onCanPlayThrough={() => {
                // Video is ready to play
                if (index === currentIndex && !isPaused[currentIndex] && hasStarted) {
                  const videoEl = videoRefs.current[index];
                  if (videoEl) {
                    videoEl.play().catch(err => console.warn('Auto-play failed:', err));
                  }
                }
              }}
              onError={(e) => {
                console.warn('Video load error:', e);
              }}
            />

            {/* Tap to pause/play overlay */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => togglePlayPause(index)}
            >
              {(isPaused[index] || (!hasStarted && index === currentIndex)) && (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" opacity="0.9">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-gray-600 bg-opacity-50">
              <div 
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${videoProgress[video.id] || 0}%` }}
              />
            </div>

            {/* Black bar below progress */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-black"></div>
            
            {/* TikTok-style bottom text overlay */}
            <div className="absolute bottom-24 left-4 right-16 text-white">
              <div className="flex items-center mb-3">
                <span className="text-lg font-semibold">@{video.username}</span>
              </div>
              <p className="text-sm leading-relaxed">{video.description}</p>
            </div>
            
            {/* TikTok-style right sidebar */}
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
                  onClick={() => handleLike(video.id)}
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
                  onClick={() => setShowComments(true)}
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
                  onClick={() => handleSave(video.id)}
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
            </div>

            {/* Progress indicator */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1" style={{ display: 'none' }}>
              {videos.map((_, i) => (
                <div 
                  key={i}
                  className={`w-1 h-8 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Status bar overlay - for testing */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded" style={{ display: 'none' }}>
        Video {currentIndex + 1}/{videos.length}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full h-2/3 rounded-t-3xl overflow-hidden">
            {/* Comments header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-semibold">
                {videos[currentIndex].comments.length} comments
              </span>
              <button 
                onClick={() => setShowComments(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>
            
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4">
              {videos[currentIndex].comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">{comment.user}</span>
                      <span className="text-xs text-gray-500">2h</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{comment.text}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Reply</span>
                      <span className="text-xs text-gray-500">❤️ 12</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Comment input */}
            <div className="border-t border-gray-200 p-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs">👤</span>
              </div>
              <input 
                type="text" 
                placeholder="Add comment..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
              />
              <button className="text-pink-500 font-semibold text-sm">Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokApp;