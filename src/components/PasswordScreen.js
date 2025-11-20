import React, { useState, useRef } from 'react';
import { CORRECT_PASSWORD, PASSWORD_HINT } from '../constants/authConstants';

const PasswordScreen = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      // Store authentication in session storage
      sessionStorage.setItem('isAuthenticated', 'true');
      onAuthenticated();
    } else {
      // Show error and shake animation
      setError('incorrect password');
      setShake(true);
      setPassword('');

      // Remove shake animation after 500ms
      setTimeout(() => {
        setShake(false);
      }, 500);

      // Clear error after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <form onSubmit={handleSubmit}>
          <h1 className="text-white text-2xl font-bold text-center mb-8">
            Enter Password
          </h1>

          <div className={`mb-4 ${shake ? 'animate-pulse' : ''}`}>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              inputMode="text"
              className={`w-full px-4 py-3 bg-gray-900 text-white border-2 rounded focus:outline-none transition-colors ${
                error ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
              } ${shake ? 'animate-bounce' : ''}`}
              autoFocus
            />
          </div>

          <p className="text-gray-400 text-sm text-center mb-6">
            {PASSWORD_HINT}
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordScreen;