import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TikTokApp from './TikTokApp';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home/All videos route */}
        <Route path="/" element={<TikTokApp />} />

        {/* Individual creator routes */}
        <Route path="/col" element={<TikTokApp creator="col" />} />
        <Route path="/sang" element={<TikTokApp creator="sang" />} />
        <Route path="/mel" element={<TikTokApp creator="mel" />} />
        <Route path="/flem" element={<TikTokApp creator="flem" />} />
      </Routes>
    </Router>
  );
};

export default App;
