import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <img
        src="/images/logo.png"
        alt="HumourUs Logo"
        className="animate-fade-in"
        style={{ maxWidth: '500px', maxHeight: '500px' }}
      />
    </div>
  );
};

export default SplashScreen;