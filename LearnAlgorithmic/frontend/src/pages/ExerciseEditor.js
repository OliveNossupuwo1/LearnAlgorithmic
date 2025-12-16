import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExerciseEditor = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    lesson: '',
    title: '',
    description: '',
    problem_statement: '',
    hints: '',
    difficulty: 'beginner',
    points: 100,
  });
  const [requiredKeywords, setRequiredKeywords] = useState('');
  const [forbiddenKeywords, setForbiddenKeywords] = useState('');

  useEffect(() => {
    loadLessons();
    if (exerciseId && exerciseId !== 'new') {
      loadExercise();
    }
  }, [exerciseId]);

  const loadLessons = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/admin/all-lessons/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📚 Leçons chargées:', response.data);
      setLessons(response.data);
      
      if (exerciseId === 'new' && response.data.length > 0) {
        setFormData((prev) => ({ ...prev, lesson: response.data[0].id }));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  const loadExercise = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/admin/exercises/${exerciseId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(response.data);
      setRequiredKeywords(response.data.required_keywords?.join(', ') || '');
      setForbiddenKeywords(response.data.forbidden_keywords?.join(', ') || '');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      const exerciseData = {
        ...formData,
        required_keywords: requiredKeywords.split(',').map(k => k.trim()).filter(k => k),
        forbidden_keywords: forbiddenKeywords.split(',').map(k => k.trim()).filter(k => k),
      };

      const url =
        exerciseId === 'new'
          ? 'http://localhost:8000/api/admin/exercises/'
          : `http://localhost:8000/api/admin/exercises/${exerciseId}/`;

      const method = exerciseId === 'new' ? 'post' : 'put';

      await axios[method](url, exerciseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        exerciseId === 'new'
          ? 'Exercice créé avec succès !'
          : 'Exercice modifié avec succès !'
      );
      navigate('/admin');
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `http://localhost:8000/api/admin/exercises/${exerciseId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Exercice supprimé avec succès !');
      navigate('/admin');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'admin
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {exerciseId === 'new' ? '➕ Nouvel Exercice' : '✏️ Modifier l\'Exercice'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="card">
          {/* Leçon */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leçon *
            </label>
            <select
              name="lesson"
              value={formData.lesson}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Sélectionnez une leçon</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  Module {lesson.module_order}: {lesson.module_title} → {lesson.title}
                </option>
              ))}
            </select>
          </div>

          {/* Titre */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'Exercice *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Ex: Calculer la somme de deux nombres"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className="input-field"
              placeholder="Brève description de l'exercice..."
            ></textarea>
          </div>

          {/* Énoncé */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Énoncé du Problème *
            </label>
            <textarea
              name="problem_statement"
              value={formData.problem_statement}
              onChange={handleChange}
              required
              rows={5}
              className="input-field font-mono text-sm"
              placeholder="Décrivez le problème en détail avec des exemples..."
            ></textarea>
          </div>

          {/* Indices */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indices (optionnel)
            </label>
            <textarea
              name="hints"
              value={formData.hints}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Donnez des indices pour aider les étudiants..."
            ></textarea>
          </div>

          {/* Difficulté et Points */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="input-field"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min="1"
                className="input-field"
              />
            </div>
          </div>

          {/* Mots-clés requis */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mots-clés requis (séparés par des virgules)
            </label>
            <input
              type="text"
              value={requiredKeywords}
              onChange={(e) => setRequiredKeywords(e.target.value)}
              className="input-field"
              placeholder="Ex: POUR, FAIRE, FIN"
            />
            <p className="text-xs text-gray-500 mt-1">
              Le code doit contenir ces mots-clés pour être validé
            </p>
          </div>

          {/* Mots-clés interdits */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mots-clés interdits (séparés par des virgules)
            </label>
            <input
              type="text"
              value={forbiddenKeywords}
              onChange={(e) => setForbiddenKeywords(e.target.value)}
              className="input-field"
              placeholder="Ex: TANT QUE, REPETER"
            />
            <p className="text-xs text-gray-500 mt-1">
              Le code ne doit PAS contenir ces mots-clés
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {exerciseId !== 'new' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : '💾 Enregistrer l\'Exercice'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ExerciseEditor;