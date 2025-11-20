import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TikTokApp from './TikTokApp';
import SplashScreen from './components/SplashScreen';
import StandaloneMenu from './components/StandaloneMenu';
import PasswordScreen from './components/PasswordScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Always require password on page load
    sessionStorage.removeItem('isAuthenticated');
    return false;
  });

  useEffect(() => {
    // Check if app is running in standalone mode on iPad
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIPad = /iPad|Mac/.test(navigator.userAgent) && !window.MSStream;
    setIsStandalone(standalone && isIPad);
  }, []);

  // Force password screen to be shown before any content
  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

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

          {/* All videos route */}
          <Route path="/all" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp isStandalone={isStandalone} /></>} />

          {/* Individual creator routes */}
          <Route path="/cole" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="cole" isStandalone={isStandalone} /></>} />
          <Route path="/sang" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="sang" isStandalone={isStandalone} /></>} />
          <Route path="/mel" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="mel" isStandalone={isStandalone} /></>} />
          <Route path="/flem" element={<>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}<TikTokApp creator="flem" isStandalone={isStandalone} /></>} />
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
          {/* Home/All videos route */}
          <Route path="/" element={<TikTokApp />} />

          {/* Individual creator routes */}
          <Route path="/cole" element={<TikTokApp creator="cole" />} />
          <Route path="/sang" element={<TikTokApp creator="sang" />} />
          <Route path="/mel" element={<TikTokApp creator="mel" />} />
          <Route path="/flem" element={<TikTokApp creator="flem" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
