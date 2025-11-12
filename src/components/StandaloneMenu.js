import { useNavigate } from 'react-router-dom';

const StandaloneMenu = () => {
  const navigate = useNavigate();

  const creators = [
    { name: 'Cole', path: '/cole', color: 'from-yellow-500 to-yellow-700' },
    { name: 'Flem', path: '/flem', color: 'from-green-500 to-green-700' },
    { name: 'Mel', path: '/mel', color: 'from-purple-500 to-purple-700' },
    { name: 'Sang', path: '/sang', color: 'from-red-500 to-red-700' }
  ];

  const handleCreatorSelect = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-white text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">HumourTok</h1>
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
    </div>
  );
};

export default StandaloneMenu;
