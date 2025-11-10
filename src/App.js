import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TikTokApp from './TikTokApp';
import SplashScreen from './components/SplashScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

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
