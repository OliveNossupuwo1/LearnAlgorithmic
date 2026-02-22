import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotification } from '../hooks/useNotification';

const ExerciseEditor = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const { notification, confirmDialog, showSuccess, showError, hideNotification, confirm } = useNotification();
  const [formData, setFormData] = useState({
    lesson: '',
    title: '',
    description: '',
    problem_statement: '',
    expected_output: '',
    solution_code: '',
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
      showError('Erreur de chargement', 'Erreur lors du chargement des leçons');
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
      showError('Erreur de chargement', 'Erreur lors du chargement de l\'exercice');
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

      showSuccess(
        exerciseId === 'new' ? 'Exercice créé !' : 'Exercice modifié !',
        exerciseId === 'new' ? 'L\'exercice a été créé avec succès' : 'Les modifications ont été enregistrées'
      );
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showError(
        'Erreur de sauvegarde',
        `Impossible de sauvegarder l'exercice: ${error.response?.data?.detail || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm(
      'Supprimer cet exercice ?',
      'Cette action est irréversible. L\'exercice sera supprimé définitivement.',
      { type: 'danger', confirmText: 'Supprimer', cancelText: 'Annuler' }
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `http://localhost:8000/api/admin/exercises/${exerciseId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccess('Exercice supprimé !', 'L\'exercice a été supprimé avec succès');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur de suppression', 'Impossible de supprimer l\'exercice');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </button>
          <div className="border-l border-gray-300 h-4"></div>
          <h1 className="text-sm font-bold text-gray-900">
            {exerciseId === 'new' ? '➕ Nouvel Exercice' : '✏️ Modifier l\'Exercice'}
          </h1>
        </div>
      </Header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
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

          {/* Sortie attendue */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sortie Attendue
            </label>
            <textarea
              name="expected_output"
              value={formData.expected_output}
              onChange={handleChange}
              rows={2}
              className="input-field font-mono text-sm"
              placeholder="Ex: 24 (pour un calcul d'âge avec 2024-2000)"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Le résultat que le programme doit afficher
            </p>
          </div>

          {/* Pseudo-code de la solution (CORRECTION) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Pseudo-code de la Solution (Correction)
            </label>
            <textarea
              name="solution_code"
              value={formData.solution_code}
              onChange={handleChange}
              rows={12}
              className="input-field font-mono text-sm bg-green-50 border-green-300"
              placeholder={`Algorithme CalculAge
Variables: annee_naissance, annee_actuelle, age : Entier
Debut
    Ecrire("Entrer l'année de naissance")
    Lire(annee_naissance)
    Ecrire("Entrer l'année actuelle")
    Lire(annee_actuelle)
    age ← annee_actuelle - annee_naissance
    Ecrire("Votre âge est ", age)
Fin`}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Ce pseudo-code sera affiché à l'étudiant après 3 tentatives échouées comme correction complète
            </p>
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

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
};

export default ExerciseEditor;