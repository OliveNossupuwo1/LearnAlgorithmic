import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotification } from '../hooks/useNotification';

const QuizEditor = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({
    lesson: '',
    title: '',
    passing_score: 50,
  });
  const [questions, setQuestions] = useState([]);
  const { notification, confirmDialog, showSuccess, showError, hideNotification, confirm } = useNotification();

  useEffect(() => {
    loadLessons();
    if (quizId && quizId !== 'new') {
      loadQuiz();
    }
  }, [quizId]);

  const loadLessons = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/admin/all-lessons/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📚 Leçons chargées:', response.data);
      setLessons(response.data);
      
      if (quizId === 'new' && response.data.length > 0) {
        setFormData((prev) => ({ ...prev, lesson: response.data[0].id }));
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      showError('Erreur de chargement', 'Erreur lors du chargement des leçons');
    }
  };

  const loadQuiz = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/admin/quizzes/${quizId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({
        lesson: response.data.lesson,
        title: response.data.title,
        passing_score: response.data.passing_score,
      });
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur de chargement', 'Erreur lors du chargement du quiz');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question_text: '',
        question_type: 'single',
        points: 20,
        explanation: '',
        choices: [],
        isNew: true,
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const removeQuestion = async (index) => {
    const confirmed = await confirm(
      'Supprimer cette question ?',
      'Cette question et tous ses choix de réponses seront supprimés.',
      { type: 'warning', confirmText: 'Supprimer', cancelText: 'Annuler' }
    );

    if (confirmed) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const addChoice = (questionIndex) => {
    const updated = [...questions];
    if (!updated[questionIndex].choices) {
      updated[questionIndex].choices = [];
    }
    updated[questionIndex].choices.push({
      id: Date.now(),
      choice_text: '',
      is_correct: false,
      isNew: true,
    });
    setQuestions(updated);
  };

  const updateChoice = (questionIndex, choiceIndex, field, value) => {
    const updated = [...questions];
    updated[questionIndex].choices[choiceIndex][field] = value;
    setQuestions(updated);
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const updated = [...questions];
    updated[questionIndex].choices = updated[questionIndex].choices.filter(
      (_, i) => i !== choiceIndex
    );
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      // Sauvegarder le quiz
      const quizData = { ...formData, questions };
      const url =
        quizId === 'new'
          ? 'http://localhost:8000/api/admin/quizzes/'
          : `http://localhost:8000/api/admin/quizzes/${quizId}/`;

      const method = quizId === 'new' ? 'post' : 'put';

      await axios[method](url, quizData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccess(
        quizId === 'new' ? 'Quiz créé !' : 'Quiz modifié !',
        quizId === 'new' ? 'Le quiz a été créé avec succès' : 'Les modifications ont été enregistrées'
      );
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showError(
        'Erreur de sauvegarde',
        `Impossible de sauvegarder le quiz: ${error.response?.data?.detail || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    const confirmed = await confirm(
      'Supprimer ce quiz ?',
      'Cette action est irréversible. Le quiz et toutes ses questions seront supprimés.',
      { type: 'danger', confirmText: 'Supprimer', cancelText: 'Annuler' }
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `http://localhost:8000/api/admin/quizzes/${quizId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccess('Quiz supprimé !', 'Le quiz a été supprimé avec succès');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur de suppression', 'Impossible de supprimer le quiz');
    }
  };

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
            onClick={() => navigate('/interpreter')}
            className="bg-teal-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all duration-300"
          >
            Interpréteur
          </button>
        </>
      } />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit}>
          {/* Informations du quiz */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">📋 Informations du Quiz</h2>

            <div className="mb-4">
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du Quiz *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Ex: Quiz sur les variables"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Score minimum pour réussir (%)
              </label>
              <input
                type="number"
                name="passing_score"
                value={formData.passing_score}
                onChange={handleChange}
                min="0"
                max="100"
                className="input-field"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">❓ Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-primary"
              >
                + Ajouter une question
              </button>
            </div>

            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune question. Cliquez sur "Ajouter une question" pour commencer.
              </p>
            ) : (
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">Question {qIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={question.question_text}
                        onChange={(e) =>
                          updateQuestion(qIndex, 'question_text', e.target.value)
                        }
                        required
                        className="input-field"
                        placeholder="Tapez votre question..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                          value={question.question_type}
                          onChange={(e) =>
                            updateQuestion(qIndex, 'question_type', e.target.value)
                          }
                          className="input-field"
                        >
                          <option value="single">Choix unique</option>
                          <option value="multiple">Choix multiples</option>
                          <option value="true_false">Vrai/Faux</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Points</label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(qIndex, 'points', parseInt(e.target.value))
                          }
                          min="1"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Explication (optionnel)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(qIndex, 'explanation', e.target.value)
                        }
                        rows={2}
                        className="input-field"
                        placeholder="Expliquez la bonne réponse..."
                      ></textarea>
                    </div>

                    {/* Choix de réponses */}
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium text-sm">Choix de réponses</label>
                        <button
                          type="button"
                          onClick={() => addChoice(qIndex)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          + Ajouter un choix
                        </button>
                      </div>

                      {question.choices?.map((choice, cIndex) => (
                        <div key={choice.id} className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={choice.is_correct}
                            onChange={(e) =>
                              updateChoice(qIndex, cIndex, 'is_correct', e.target.checked)
                            }
                            className="w-5 h-5"
                            title="Bonne réponse ?"
                          />
                          <input
                            type="text"
                            value={choice.choice_text}
                            onChange={(e) =>
                              updateChoice(qIndex, cIndex, 'choice_text', e.target.value)
                            }
                            className="flex-1 input-field"
                            placeholder="Texte du choix..."
                          />
                          <button
                            type="button"
                            onClick={() => removeChoice(qIndex, cIndex)}
                            className="text-red-600 hover:text-red-700 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {(!question.choices || question.choices.length === 0) && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          Aucun choix. Cliquez sur "+ Ajouter un choix"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4">
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
              {loading ? 'Enregistrement...' : '💾 Enregistrer le Quiz'}
            </button>
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

export default QuizEditor;