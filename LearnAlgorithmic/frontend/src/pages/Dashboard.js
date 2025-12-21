import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
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
      <Header showUserGreeting={true} dashboardButtons={
        <>
          <button
            onClick={() => navigate('/admin')}
            className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin
          </button>
          <button
            onClick={() => navigate('/modules')}
            className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors duration-200"
          >
            Mes Modules
          </button>
        </>
      } />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">
                  Modules complétés
                </p>
                <p className="text-4xl font-bold mt-2">
                  {stats?.completed_modules || 0} / {stats?.total_modules || 6}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <svg
                  className="w-8 h-8"
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
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Modules débloqués
                </p>
                <p className="text-4xl font-bold mt-2">
                  {stats?.unlocked_modules || 1}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">
                  Progression globale
                </p>
                <p className="text-4xl font-bold mt-2">
                  {stats?.overall_progress?.toFixed(0) || 0}%
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Module actuel */}
        {stats?.current_module && (
          <div className="card mb-8 border-2 border-primary-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Module en cours
            </h2>
            <div className="bg-primary-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary-900">
                    Module {stats.current_module.order}:{' '}
                    {stats.current_module.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {stats.current_module.completed_lessons} /{' '}
                    {stats.current_module.total_lessons} leçons complétées
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/modules/${stats.current_module.id}`)
                  }
                  className="btn-primary"
                >
                  Continuer
                </button>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${stats.current_module.progress_percentage}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {stats.current_module.progress_percentage.toFixed(0)}% complété
              </p>
            </div>
          </div>
        )}

        {/* Activités récentes */}
        {stats?.recent_activities && stats.recent_activities.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Activités récentes
            </h2>
            <div className="space-y-4">
              {stats.recent_activities.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-full ${
                        activity.type === 'quiz'
                          ? 'bg-blue-100'
                          : 'bg-purple-100'
                      }`}
                    >
                      {activity.type === 'quiz' ? (
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-purple-600"
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
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.lesson}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        activity.score >= 50
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
