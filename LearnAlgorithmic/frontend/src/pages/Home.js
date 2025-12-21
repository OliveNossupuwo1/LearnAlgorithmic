import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navbar */}
        <nav className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center p-1.5">
                  <svg
                    className="w-full h-full text-white"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    {/* Flowchart: Start box */}
                    <rect x="35" y="8" width="30" height="12" rx="2" fill="currentColor"/>
                    {/* Arrow down */}
                    <path d="M50 20 L50 28" stroke="currentColor" strokeWidth="3"/>
                    <polygon points="50,28 47,24 53,24" fill="currentColor"/>
                    {/* Decision diamond - branches */}
                    <path d="M50 28 L30 45 M50 28 L70 45" stroke="currentColor" strokeWidth="3"/>
                    {/* Process boxes */}
                    <rect x="15" y="45" width="30" height="12" rx="2" fill="currentColor"/>
                    <rect x="55" y="45" width="30" height="12" rx="2" fill="currentColor"/>
                    {/* Arrows down */}
                    <path d="M30 57 L30 68 M70 57 L70 68" stroke="currentColor" strokeWidth="3"/>
                    {/* End boxes */}
                    <rect x="15" y="68" width="30" height="8" rx="2" fill="currentColor"/>
                    <rect x="55" y="68" width="30" height="8" rx="2" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  LearnAlgorithmic
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Maîtrisez l'
                  <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Algorithmique
                  </span>
                  <br />
                  à votre rythme
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Une plateforme interactive pour apprendre les fondamentaux de l'algorithmique
                  avec des vidéos, des quiz et des exercices pratiques.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Commencer gratuitement
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  J'ai déjà un compte
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-primary-600">6</div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">17</div>
                  <div className="text-sm text-gray-600">Leçons</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">100%</div>
                  <div className="text-sm text-gray-600">Gratuit</div>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  {/* Simulated Module Cards */}
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Module 1</div>
                      <div className="text-sm text-gray-600">Introduction</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Module 2</div>
                      <div className="text-sm text-gray-600">Variables</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg border-l-4 border-gray-300">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">
                      🔒
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-500">Module 3</div>
                      <div className="text-sm text-gray-400">Verrouillé</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-400 rounded-full opacity-20 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir LearnAlgorithmic ?
            </h2>
            <p className="text-xl text-gray-600">
              Une approche progressive et interactive pour maîtriser l'algorithmique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vidéos explicatives</h3>
              <p className="text-gray-600">
                Des vidéos claires et concises pour comprendre chaque concept étape par étape
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quiz interactifs</h3>
              <p className="text-gray-600">
                Testez vos connaissances avec des quiz adaptés après chaque leçon
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exercices pratiques</h3>
              <p className="text-gray-600">
                Mettez en pratique vos connaissances avec des exercices de pseudo-code
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progression guidée</h3>
              <p className="text-gray-600">
                Débloquez les modules progressivement en validant vos acquis
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Feedback instantané</h3>
              <p className="text-gray-600">
                Recevez des corrections immédiates sur vos quiz et exercices
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">À votre rythme</h3>
              <p className="text-gray-600">
                Apprenez quand vous voulez, où vous voulez, sans contrainte de temps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des centaines d'étudiants qui maîtrisent l'algorithmique
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Commencer maintenant - C'est gratuit !
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
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
              © 2025 LearnAlgorithmic. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
