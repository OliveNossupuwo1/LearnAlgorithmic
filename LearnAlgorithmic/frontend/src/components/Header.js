import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ children, dashboardButtons, showUserGreeting = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et message bienvenue */}
          <div className="flex-shrink-0">
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
              <p className="text-gray-600 text-xs mt-1 hidden sm:block ml-10">
                Bonjour, {user.first_name || user.username}
              </p>
            )}
            {!showUserGreeting && children && (
              <div className="hidden sm:block ml-10 mt-1">
                {children}
              </div>
            )}
          </div>

          {/* Contenu personnalisé au centre - seulement si showUserGreeting est true */}
          {showUserGreeting && children && (
            <div className="flex-1 mx-6 hidden md:block">
              {children}
            </div>
          )}

          {/* Bouton hamburger mobile */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Navigation desktop */}
          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              {dashboardButtons}
              <button
                onClick={handleLogout}
                className="bg-white text-primary-600 border-2 border-primary-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
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

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2 bg-white shadow-lg">
          {showUserGreeting && user && (
            <p className="text-gray-600 text-sm py-1">
              Bonjour, {user.first_name || user.username}
            </p>
          )}
          {!showUserGreeting && children && (
            <div className="py-1">
              {children}
            </div>
          )}
          {showUserGreeting && children && (
            <div className="py-1">
              {children}
            </div>
          )}
          {user ? (
            <div className="flex flex-col space-y-2 pt-1">
              {dashboardButtons && (
                <div className="flex flex-wrap gap-2">
                  {dashboardButtons}
                </div>
              )}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full bg-white text-primary-600 border-2 border-primary-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-1">
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full bg-white text-primary-600 border-2 border-primary-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Se connecter
              </button>
              <button
                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors duration-200"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
