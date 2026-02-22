import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moduleService } from '../services/api';
import Notification from '../components/Notification';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadModuleAndLessons();
  }, [moduleId]);

  const loadModuleAndLessons = async () => {
    try {
      const moduleData = await moduleService.getById(moduleId);
      const lessonsData = await moduleService.getLessons(moduleId);

      setModule(moduleData);
      setLessons(lessonsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getLessonStatusBadge = (lesson) => {
    const progress = lesson.progress;
    if (progress && progress.is_completed) {
      return <span className="badge badge-success animate-pop">✓ Complété</span>;
    }
    if (progress && (progress.quiz_score > 0 || progress.exercise_score > 0)) {
      return <span className="badge badge-warning badge-pulse">En cours</span>;
    }
    return <span className="badge bg-gray-200 text-gray-700">Non commencé</span>;
  };

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      const result = await moduleService.markComplete(moduleId);

      if (result.success) {
        setNotification({
          type: 'success',
          title: 'Félicitations ! 🎉',
          message: result.message,
          onClose: () => {
            setNotification(null);
            navigate('/modules');
          },
        });
      }
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData && errorData.incomplete_lessons) {
        const details = errorData.incomplete_lessons.map((lesson) => ({
          title: lesson.lesson_title,
          scores: {
            quiz: lesson.quiz_score,
            exercise: lesson.exercise_score,
            combined: lesson.combined_score,
          },
        }));

        setNotification({
          type: 'error',
          title: 'Module incomplet',
          message: `${errorData.completed_lessons}/${errorData.total_lessons} leçons complétées. Vous devez terminer toutes les leçons avec un score minimum de 50/100.`,
          details: details,
          onClose: () => setNotification(null),
        });
      } else {
        setNotification({
          type: 'error',
          title: 'Erreur',
          message: errorData?.error || 'Erreur lors du marquage du module',
          onClose: () => setNotification(null),
        });
      }
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md animate-fade-in-scale">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-bold text-gray-900">{error}</h3>
            <button onClick={() => navigate('/modules')} className="mt-4 btn-primary">
              Retour aux modules
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          details={notification.details}
          onClose={notification.onClose}
        />
      )}

      <Header dashboardButtons={
        <>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all duration-300"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/modules')}
            className="bg-gray-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all duration-300"
          >
            Modules
          </button>
          <button
            onClick={() => navigate('/interpreter')}
            className="bg-teal-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all duration-300"
          >
            Interpréteur
          </button>
        </>
      } />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête du module */}
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-lg font-bold bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                  Module {module?.order}
                </span>
                {module?.is_completed && (
                  <span className="badge bg-green-100 text-green-800 celebrate">
                    ✓ Module Terminé
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3">{module?.title}</h1>
              <p className="text-primary-100 text-lg">{module?.description}</p>
            </div>
          </div>

          {/* Progression du module */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression des leçons</span>
              <span>
                {lessons.filter((l) => l.progress?.is_completed).length} /{' '}
                {lessons.length} leçons complétées
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${
                    (lessons.filter((l) => l.progress?.is_completed).length /
                      lessons.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Liste des leçons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Leçons du Module
          </h2>

          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="card card-glow cursor-pointer border-2 border-gray-200 hover:border-primary-500 animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              onClick={() => navigate(`/lessons/${lesson.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-semibold text-primary-600">
                      Leçon {lesson.order}
                    </span>
                    {getLessonStatusBadge(lesson)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{lesson.description}</p>

                  {/* Scores si leçon commencée */}
                  {lesson.progress &&
                    (lesson.progress.quiz_score > 0 ||
                      lesson.progress.exercise_score > 0) && (
                      <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Quiz: </span>
                          <span
                            className={`font-semibold ${
                              lesson.progress.quiz_score >= 50
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }`}
                          >
                            {lesson.progress.quiz_score}/100
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Exercices: </span>
                          <span
                            className={`font-semibold ${
                              lesson.progress.exercise_score >= 50
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }`}
                          >
                            {lesson.progress.exercise_score}/100
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Score final: </span>
                          <span
                            className={`font-bold ${
                              lesson.progress.combined_score >= 50
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {lesson.progress.combined_score}/100
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                {/* Icône de navigation */}
                <div className="ml-4 transition-transform duration-300 group-hover:translate-x-1">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton Marquer comme terminé */}
        {!module?.is_completed && (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: `${0.3 + lessons.length * 0.1 + 0.1}s` }}>
            <button
              onClick={handleMarkComplete}
              disabled={marking}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {marking ? 'Vérification en cours...' : '✓ Marquer ce module comme terminé'}
            </button>
            <p className="text-sm text-gray-600 text-center mt-2">
              Cliquez ici une fois toutes les leçons complétées pour débloquer le module suivant
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 card bg-blue-50 border-2 border-blue-200 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            💡 Comment progresser ?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Cliquez sur une leçon pour accéder au contenu complet</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>
                Regardez la vidéo et étudiez les concepts avant de faire le quiz
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>
                Obtenez minimum 50/100 aux quiz et exercices pour valider la leçon
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>
                Validez toutes les leçons puis cliquez sur "Marquer comme terminé"
              </span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ModuleDetail;
