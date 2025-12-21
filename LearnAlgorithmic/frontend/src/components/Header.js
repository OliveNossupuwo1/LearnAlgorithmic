import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ children, dashboardButtons, showUserGreeting = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et message bienvenue */}
          <div>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate(user ? '/dashboard' : '/')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center p-1">
                <svg
                  className="w-full h-full text-white"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <rect x="35" y="8" width="30" height="12" rx="2" fill="currentColor"/>
                  <path d="M50 20 L50 28" stroke="currentColor" strokeWidth="3"/>
                  <polygon points="50,28 47,24 53,24" fill="currentColor"/>
                  <path d="M50 28 L30 45 M50 28 L70 45" stroke="currentColor" strokeWidth="3"/>
                  <rect x="15" y="45" width="30" height="12" rx="2" fill="currentColor"/>
                  <rect x="55" y="45" width="30" height="12" rx="2" fill="currentColor"/>
                  <path d="M30 57 L30 68 M70 57 L70 68" stroke="currentColor" strokeWidth="3"/>
                  <rect x="15" y="68" width="30" height="8" rx="2" fill="currentColor"/>
                  <rect x="55" y="68" width="30" height="8" rx="2" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                LearnAlgorithmic
              </span>
            </div>
            {showUserGreeting && user && (
              <p className="text-gray-600 text-xs mt-1 ml-10">
                Bonjour, {user.first_name || user.username}
              </p>
            )}
            {!showUserGreeting && children && (
              <div className="ml-10 mt-1">
                {children}
              </div>
            )}
          </div>

          {/* Contenu personnalisé au centre - seulement si showUserGreeting est true */}
          {showUserGreeting && children && (
            <div className="flex-1 mx-6">
              {children}
            </div>
          )}

          {/* Navigation utilisateur */}
          {user ? (
            <div className="flex items-center space-x-3">
              {dashboardButtons}
              <button
                onClick={handleLogout}
                className="bg-white text-primary-600 border-2 border-primary-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-primary-600 border-2 border-primary-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors duration-200"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
