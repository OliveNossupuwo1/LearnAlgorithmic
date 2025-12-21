const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
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
            <span className="text-xl font-bold">LearnAlgorithmic</span>
          </div>
          <p className="text-gray-400">
            Votre plateforme d'apprentissage de l'algorithmique
          </p>
          <p className="text-gray-500 text-sm mt-4">
            &copy; 2025 LearnAlgorithmic. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
