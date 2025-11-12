import { useNavigate } from 'react-router-dom';

const StandaloneMenu = () => {
  const navigate = useNavigate();

  const creators = [
    { name: 'Cole', path: '/cole', color: 'from-blue-600 to-blue-800' },
    { name: 'Flem', path: '/flem', color: 'from-purple-600 to-purple-800' },
    { name: 'Mel', path: '/mel', color: 'from-pink-600 to-pink-800' },
    { name: 'Sang', path: '/sang', color: 'from-green-600 to-green-800' }
  ];

  const handleCreatorSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-white text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">HumourUs</h1>
        <p className="text-gray-400 text-lg">Select a Creator</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {creators.map((creator) => (
          <button
            key={creator.name}
            onClick={() => handleCreatorSelect(creator.path)}
            className={`bg-gradient-to-br ${creator.color} rounded-lg p-8 transform transition-transform duration-200 hover:scale-105 active:scale-95`}
          >
            <span className="text-white text-3xl font-bold block">{creator.name}</span>
          </button>
        ))}
      </div>

      <div className="text-gray-500 text-sm mt-12">
        Tap a creator to view their videos
      </div>
    </div>
  );
};

export default StandaloneMenu;
