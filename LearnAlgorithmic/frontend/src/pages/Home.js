import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

// Hook pour détecter la visibilité d'un élément (scroll reveal)
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};

// Compteur animé
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }

    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuresRef, featuresInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-animated">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navbar */}
        <nav className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 animate-fade-in-up">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center p-1.5 hover:scale-110 transition-transform duration-300">
                  <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none">
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
                <span className="text-2xl font-bold gradient-text-animated">
                  LearnAlgorithmic
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={() => navigate('/login')} className="btn-secondary text-sm sm:text-base">
                  Se connecter
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm sm:text-base">
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
              <div className="animate-fade-in-up">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Maîtrisez l'
                  <span className="gradient-text-animated">
                    Algorithmique
                  </span>
                  <br />
                  à votre rythme
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed" style={{ animationDelay: '0.2s' }}>
                  Une plateforme interactive pour apprendre les fondamentaux de l'algorithmique
                  avec des vidéos, des quiz et des exercices pratiques.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all animate-pulse-glow"
                >
                  Commencer gratuitement
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg"
                >
                  J'ai déjà un compte
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8">
                {[
                  { value: '6', label: 'Modules' },
                  { value: '17', label: 'Leçons' },
                  { value: '100', label: 'Gratuit', suffix: '%' },
                ].map((stat, i) => (
                  <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
                    <div className="text-2xl sm:text-3xl font-bold text-primary-600 counter-animate">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix || ''} />
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 shadow-2xl hover-lift">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  {[
                    { num: '✓', name: 'Module 1', desc: 'Introduction', color: 'green', done: true },
                    { num: '2', name: 'Module 2', desc: 'Variables', color: 'blue', done: false },
                    { num: '🔒', name: 'Module 3', desc: 'Verrouillé', color: 'gray', done: false },
                  ].map((mod, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${
                        mod.color === 'green' ? 'from-green-50 to-green-100 border-green-500' :
                        mod.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-500' :
                        'from-gray-50 to-gray-100 border-gray-300'
                      } rounded-lg border-l-4 transition-all duration-300 hover:shadow-md hover:translate-x-1`}
                      style={{ animationDelay: `${0.5 + i * 0.2}s` }}
                    >
                      <div className={`w-12 h-12 ${
                        mod.color === 'green' ? 'bg-green-500' :
                        mod.color === 'blue' ? 'bg-blue-500' : 'bg-gray-300'
                      } rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {mod.num}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${mod.color === 'gray' ? 'text-gray-500' : 'text-gray-900'}`}>{mod.name}</div>
                        <div className={`text-sm ${mod.color === 'gray' ? 'text-gray-400' : 'text-gray-600'}`}>{mod.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-float-slow"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-400 rounded-full opacity-20 animate-float-medium"></div>
              <div className="absolute top-1/2 -right-3 w-16 h-16 bg-purple-400 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-700 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir LearnAlgorithmic ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Une approche progressive et interactive pour maîtriser l'algorithmique
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Vidéos explicatives', desc: 'Des vidéos claires et concises pour comprendre chaque concept étape par étape', gradient: 'from-primary-500 to-primary-700' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: 'Quiz interactifs', desc: 'Testez vos connaissances avec des quiz adaptés après chaque leçon', gradient: 'from-green-500 to-green-700' },
              { icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', title: 'Exercices pratiques', desc: 'Mettez en pratique vos connaissances avec des exercices de pseudo-code', gradient: 'from-purple-500 to-purple-700' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Progression guidée', desc: 'Débloquez les modules progressivement en validant vos acquis', gradient: 'from-blue-500 to-blue-700' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Feedback instantané', desc: 'Recevez des corrections immédiates sur vos quiz et exercices', gradient: 'from-yellow-500 to-yellow-700' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'À votre rythme', desc: 'Apprenez quand vous voulez, où vous voulez, sans contrainte de temps', gradient: 'from-red-500 to-red-700' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`card-animated card-glow hover-lift cursor-default transition-all duration-700 text-center flex flex-col items-center ${
                  featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 0.12}s`, animationDelay: `${i * 0.12}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden" ref={ctaRef}>
        {/* Decorative bg elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 animate-float-medium"></div>

        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-700 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-lg sm:text-xl text-primary-100 mb-8">
            Rejoignez des centaines d'étudiants qui maîtrisent l'algorithmique
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
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
                <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none">
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
