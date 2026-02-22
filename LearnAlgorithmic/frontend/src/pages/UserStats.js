import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';

const UserStats = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/users/${userId}/stats/`);
        setStats(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Utilisateur non trouvé'}
          </div>
          <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const { user_info, module_progress, activity_timeline } = stats;

  // Calculer les statistiques globales
  const totalLessons = module_progress.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = module_progress.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => l.is_completed).length, 0
  );
  const avgQuizScore = module_progress.reduce((acc, mod) => {
    const scores = mod.lessons.filter(l => l.quiz_score > 0).map(l => l.quiz_score);
    return acc + scores.reduce((a, b) => a + b, 0);
  }, 0) / module_progress.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => l.quiz_score > 0).length, 0
  ) || 0;

  const avgExerciseScore = module_progress.reduce((acc, mod) => {
    const scores = mod.lessons.filter(l => l.exercise_score > 0).map(l => l.exercise_score);
    return acc + scores.reduce((a, b) => a + b, 0);
  }, 0) / module_progress.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => l.exercise_score > 0).length, 0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header dashboardButtons={
        <>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all duration-300"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            Admin
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-gray-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all duration-300"
          >
            Utilisateurs
          </button>
          <button
            onClick={() => navigate('/interpreter')}
            className="bg-teal-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all duration-300"
          >
            Interpréteur
          </button>
        </>
      } />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Statistiques de {user_info.username}
              </h1>
              <p className="text-gray-600 mt-1">{user_info.email}</p>
            </div>
            {user_info.is_staff && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Administrateur
              </span>
            )}
          </div>
        </div>

        {/* Cartes de statistiques globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Progression globale</div>
            <div className="text-3xl font-bold text-primary-600">
              {Math.round((completedLessons / totalLessons) * 100)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {completedLessons}/{totalLessons} leçons
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Score Quiz Moyen</div>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(avgQuizScore)}%
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Score Exercices Moyen</div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(avgExerciseScore)}%
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Modules Complétés</div>
            <div className="text-3xl font-bold text-purple-600">
              {module_progress.filter(m => m.is_completed).length}/{module_progress.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progression par module */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Progression par Module
              </h2>

              <div className="space-y-6">
                {module_progress.map((module) => (
                  <div key={module.module_id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {module.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {!module.is_unlocked && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            Verrouillé
                          </span>
                        )}
                        {module.is_completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            Complété
                          </span>
                        )}
                      </div>
                    </div>

                    {module.completion_date && (
                      <p className="text-xs text-gray-500 mb-3">
                        Complété le {formatDate(module.completion_date)}
                      </p>
                    )}

                    {/* Leçons du module */}
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.lesson_id}
                          className={`p-3 rounded-lg ${
                            lesson.is_completed ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {lesson.title}
                            </span>
                            {lesson.is_completed && (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
                            {lesson.has_quiz && (
                              <div>
                                <span className="text-gray-600">Quiz: </span>
                                <span className="font-semibold text-green-600">
                                  {lesson.quiz_score}%
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({lesson.quiz_attempts} tentatives)
                                </span>
                              </div>
                            )}
                            {lesson.has_exercise && (
                              <div>
                                <span className="text-gray-600">Exercice: </span>
                                <span className="font-semibold text-blue-600">
                                  {lesson.exercise_score}%
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                  ({lesson.exercise_attempts} tentatives)
                                </span>
                              </div>
                            )}
                          </div>

                          {lesson.completion_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Complété le {formatDate(lesson.completion_date)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline d'activité */}
          <div className="lg:col-span-1">
            <div className="card lg:sticky lg:top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Activité Récente
              </h2>

              <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                {activity_timeline.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucune activité récente
                  </p>
                ) : (
                  activity_timeline.map((activity, index) => (
                    <div key={index} className="border-l-4 border-gray-200 pl-4 pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${
                              activity.type === 'quiz'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {activity.type === 'quiz' ? 'Quiz' : 'Exercice'}
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.lesson_title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.module_title}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          {activity.type === 'quiz' ? (
                            <span className="text-sm font-bold text-green-600">
                              {activity.percentage}%
                            </span>
                          ) : (
                            <span className={`text-sm font-bold ${
                              activity.is_correct ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {activity.score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="card mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Informations Utilisateur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Nom d'utilisateur:</span>
              <span className="ml-2 font-medium">{user_info.username}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{user_info.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Inscrit le:</span>
              <span className="ml-2 font-medium">{formatDate(user_info.date_joined)}</span>
            </div>
            <div>
              <span className="text-gray-600">Dernière connexion:</span>
              <span className="ml-2 font-medium">{formatDate(user_info.last_login)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
