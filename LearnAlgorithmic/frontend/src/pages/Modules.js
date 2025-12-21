import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moduleService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const data = await moduleService.getAll();
      setModules(data);
    } catch (error) {
      console.error('Erreur lors du chargement des modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleStatusBadge = (module) => {
    if (module.is_completed) {
      return <span className="badge badge-success">✓ Terminé</span>;
    } else if (module.is_unlocked) {
      return <span className="badge badge-warning">En cours</span>;
    } else {
      return <span className="badge badge-locked">🔒 Verrouillé</span>;
    }
  };

  const handleModuleClick = (module) => {
    if (module.is_unlocked) {
      navigate(`/modules/${module.id}`);
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons_count, 0);
  const completedLessons = modules.reduce(
    (sum, m) => sum + (m.lessons_progress?.completed || 0),
    0
  );
  const overallProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header>
        <div>
          <h1 className="text-lg font-bold text-primary-700">
            Mes Modules
          </h1>
          <p className="text-gray-600 text-xs">
            Progressez à votre rythme dans l'apprentissage de l'algorithmique
          </p>
        </div>
      </Header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Progression globale */}
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Votre Progression</h2>
              <p className="text-primary-100 mt-1">
                {completedLessons} / {totalLessons} leçons complétées
              </p>
            </div>
            <div className="text-4xl font-bold">
              {overallProgress.toFixed(0)}%
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Liste des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`card module-card ${
                module.is_unlocked
                  ? 'cursor-pointer hover:border-primary-500'
                  : 'opacity-60 cursor-not-allowed'
              } border-2 ${
                module.is_completed
                  ? 'border-green-500'
                  : module.is_unlocked
                  ? 'border-primary-300'
                  : 'border-gray-200'
              }`}
              onClick={() => handleModuleClick(module)}
            >
              {/* En-tête du module */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`text-lg font-bold px-3 py-1 rounded-lg ${
                    module.is_completed
                      ? 'bg-green-100 text-green-800'
                      : module.is_unlocked
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Module {module.order}
                </div>
                {getModuleStatusBadge(module)}
              </div>

              {/* Titre et description */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {module.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {module.description}
              </p>

              {/* Informations sur les leçons */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{module.lessons_count} leçons</span>
                {module.is_unlocked && (
                  <span>
                    {module.lessons_progress?.completed || 0} /{' '}
                    {module.lessons_count} terminées
                  </span>
                )}
              </div>

              {/* Barre de progression */}
              {module.is_unlocked && (
                <>
                  <div className="progress-bar mb-2">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${module.lessons_progress?.percentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {module.lessons_progress?.percentage?.toFixed(0) || 0}%
                  </p>
                </>
              )}

              {/* Message pour modules verrouillés */}
              {!module.is_unlocked && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    Complétez le module précédent pour débloquer
                  </p>
                </div>
              )}

              {/* Bouton d'action */}
              {module.is_unlocked && (
                <button
                  className="mt-4 w-full btn-primary text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/modules/${module.id}`);
                  }}
                >
                  {module.is_completed ? 'Revoir' : 'Commencer'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 card bg-primary-50 border-2 border-primary-200">
          <h3 className="text-xl font-bold text-primary-900 mb-4">
            Comment ça marche ?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Commencez par le Module 1, seul module débloqué au départ
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Complétez toutes les leçons d'un module pour le valider
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Pour valider une leçon, obtenez au moins 50/100 aux quiz et
                exercices
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Débloquez le module suivant en complétant le module actuel
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Vous pouvez toujours revoir les modules déjà terminés
              </span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Modules;
