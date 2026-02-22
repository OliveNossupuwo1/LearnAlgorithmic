import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moduleService } from '../services/api';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { notification, showError, hideNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('access_token');

      console.log('🔄 Début chargement...');

      // 1. Charger les stats ADMIN
      try {
        const statsResponse = await axios.get('http://localhost:8000/api/admin/stats/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Stats chargées:', statsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('❌ Erreur stats:', error);
      }

      // 2. Charger TOUS les modules avec leurs leçons
      const modulesResponse = await axios.get('http://localhost:8000/api/modules/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Pour chaque module, charger ses leçons
      const modulesWithLessons = await Promise.all(
        modulesResponse.data.map(async (module) => {
          try {
            const lessonsResponse = await axios.get(
              `http://localhost:8000/api/modules/${module.id}/lessons/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...module, lessons: lessonsResponse.data };
          } catch (error) {
            return { ...module, lessons: [] };
          }
        })
      );

      // 3. Charger tous les quiz
      try {
        const quizzesResponse = await axios.get('http://localhost:8000/api/admin/quizzes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Quiz chargés:', quizzesResponse.data);
        setQuizzes(quizzesResponse.data);
      } catch (error) {
        console.error('❌ Erreur quiz:', error);
        setQuizzes([]);
      }

      // 4. Charger tous les exercices
      try {
        const exercisesResponse = await axios.get('http://localhost:8000/api/admin/exercises/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Exercices chargés:', exercisesResponse.data);
        setExercises(exercisesResponse.data);
      } catch (error) {
        console.error('❌ Erreur exercices:', error);
        setExercises([]);
      }

      console.log('📚 Modules chargés:', modulesWithLessons);
      setModules(modulesWithLessons);

    } catch (error) {
      console.error('❌ Erreur globale:', error);
      showError('Erreur de chargement', 'Erreur lors du chargement des données: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg font-bold text-xs badge-pulse">
            👑 ADMIN
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-primary-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            Retour au site
          </button>
        </div>
      </Header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { label: 'Total Modules', value: stats?.total_modules || modules.length, bg: 'blue' },
            { label: 'Total Leçons', value: stats?.total_lessons || modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0), bg: 'green' },
            { label: 'Utilisateurs', value: stats?.total_users || 0, bg: 'purple', clickable: true, sub: 'Cliquez pour voir les stats' },
            { label: 'Activités', value: stats?.recent_activities?.length || 0, bg: 'yellow' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`card bg-${stat.bg}-50 border-2 border-${stat.bg}-200 hover-lift animate-fade-in-up ${stat.clickable ? 'cursor-pointer' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={stat.clickable ? () => navigate('/admin/users') : undefined}
            >
              <div className="text-center">
                <p className={`text-${stat.bg}-600 text-sm font-medium`}>{stat.label}</p>
                <p className={`text-3xl sm:text-4xl font-bold text-${stat.bg}-900 mt-2 counter-animate`}>
                  {stat.value}
                </p>
                {stat.sub && <p className={`text-xs text-${stat.bg}-600 mt-2`}>{stat.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Activités récentes détaillées */}
        {stats?.recent_activities && stats.recent_activities.length > 0 && (
          <div className="card mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold mb-4">📊 Activités Récentes</h2>
            <div className="space-y-3">
              {stats.recent_activities.slice(0, 10).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                      activity.type === 'quiz' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'quiz' ? '📝' : '💻'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {activity.user} - {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">{activity.lesson}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${activity.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.score}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Nouveau Module', desc: 'Créer un nouveau module de cours', path: '/admin/modules/new', from: 'blue', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
            { label: 'Nouvelle Leçon', desc: 'Ajouter une leçon à un module', path: '/admin/lessons/new', from: 'green', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { label: 'Nouveau Quiz', desc: 'Créer un quiz pour une leçon', path: '/admin/quizzes/new', from: 'purple', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { label: 'Nouvel Exercice', desc: 'Créer un exercice pratique', path: '/admin/exercises/new', from: 'yellow', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`card hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-${action.from}-500 to-${action.from}-600 text-white animate-fade-in-up`}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={action.icon}
                  />
                </svg>
                <h3 className="text-xl font-bold">{action.label}</h3>
                <p className={`text-${action.from}-100 text-sm mt-1`}>
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Liste des modules */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📚 Tous les Modules
            </h2>
          </div>

          <div className="space-y-4">
            {modules.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun module trouvé. Créez-en un !
              </p>
            ) : (
              modules.map((module, index) => (
                <div
                  key={module.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:space-x-3 mb-2">
                        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-bold">
                          Module {module.order}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm sm:text-base">{module.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:space-x-4 text-sm text-gray-500">
                        <span>📖 {module.lessons?.length || 0} leçons</span>
                        <span>🆔 ID: {module.id}</span>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                      <button
                        onClick={() => navigate(`/admin/modules/${module.id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                      >
                        ✏️ Éditer
                      </button>

                      <button
                        onClick={() => navigate(`/modules/${module.id}`)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                      >
                        👁️ Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Liste des Leçons */}
        <div className="card mt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📖 Toutes les Leçons
            </h2>
            <button
              onClick={() => navigate('/admin/lessons/new')}
              className="btn-primary"
            >
              + Nouvelle Leçon
            </button>
          </div>

          <div className="space-y-3">
            {modules.map((module) => (
              <div key={`lessons-${module.id}`}>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 mt-4">
                  Module {module.order}: {module.title}
                </h3>
                {module.lessons && module.lessons.length > 0 ? (
                  module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-primary-500 hover:shadow-sm transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2"
                    >
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-gray-500">
                          Ordre: {lesson.order}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                      >
                        ✏️ Éditer
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm ml-4">Aucune leçon</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Liste des Quiz */}
        <div className="card mt-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📝 Tous les Quiz
            </h2>
            <button
              onClick={() => navigate('/admin/quizzes/new')}
              className="btn-primary"
            >
              + Nouveau Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Leçon: {quiz.lesson_title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Score minimum: {quiz.passing_score}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Questions: {quiz.questions_count || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    ✏️ Éditer
                  </button>
                </div>
              </div>
            ))}
            {quizzes.length === 0 && (
              <p className="text-gray-500 text-center py-8 col-span-2">
                Aucun quiz créé
              </p>
            )}
          </div>
        </div>

        {/* Liste des Exercices */}
        <div className="card mt-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              💻 Tous les Exercices
            </h2>
            <button
              onClick={() => navigate('/admin/exercises/new')}
              className="btn-primary"
            >
              + Nouvel Exercice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exercise.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Leçon: {exercise.lesson_title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Difficulté: {exercise.difficulty === 'beginner' ? 'Débutant' : exercise.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Points: {exercise.points}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/exercises/${exercise.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    ✏️ Éditer
                  </button>
                </div>
              </div>
            ))}
            {exercises.length === 0 && (
              <p className="text-gray-500 text-center py-8 col-span-2">
                Aucun exercice créé
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
          autoClose={notification.autoClose}
          duration={notification.duration}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
