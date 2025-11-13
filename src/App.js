import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TikTokApp from './TikTokApp';
import SplashScreen from './components/SplashScreen';
import StandaloneMenu from './components/StandaloneMenu';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode on iPad
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIPad = /iPad|Mac/.test(navigator.userAgent) && !window.MSStream;
    setIsStandalone(standalone && isIPad);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // If standalone mode and not on a specific creator route, show menu
  if (isStandalone) {
    return (
      <Router>
        <Routes>
          {/* Redirect root to menu in standalone mode */}
          <Route path="/" element={<Navigate to="/menu" replace />} />

          {/* Show menu at /menu */}
          <Route path="/menu" element={<StandaloneMenu />} />

          {/* All videos route with virtual scrolling */}
          <Route path="/all" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp enableVirtualScrolling={true} isStandalone={isStandalone} /></>} />

          {/* Individual creator routes with virtual scrolling */}
          <Route path="/cole" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="cole" enableVirtualScrolling={true} isStandalone={isStandalone} /></>} />
          <Route path="/sang" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="sang" enableVirtualScrolling={true} isStandalone={isStandalone} /></>} />
          <Route path="/mel" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="mel" enableVirtualScrolling={true} isStandalone={isStandalone} /></>} />
          <Route path="/flem" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="flem" enableVirtualScrolling={true} isStandalone={isStandalone} /></>} />
        </Routes>
      </Router>
    );
  }

  // Normal mode - show splash then app
  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Router>
        <Routes>
          {/* Home/All videos route with virtual scrolling */}
          <Route path="/" element={<TikTokApp enableVirtualScrolling={true} />} />

          {/* Individual creator routes with virtual scrolling */}
          <Route path="/cole" element={<TikTokApp creator="cole" enableVirtualScrolling={true} />} />
          <Route path="/sang" element={<TikTokApp creator="sang" enableVirtualScrolling={true} />} />
          <Route path="/mel" element={<TikTokApp creator="mel" enableVirtualScrolling={true} />} />
          <Route path="/flem" element={<TikTokApp creator="flem" enableVirtualScrolling={true} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
