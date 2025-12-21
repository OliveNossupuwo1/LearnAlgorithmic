import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService, quizService, exerciseService } from '../services/api';
import AlgorithmSimulation from '../components/AlgorithmSimulation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseResults, setExerciseResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const data = await lessonService.getById(lessonId);
      setLesson(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionId, choiceId, isMultiple) => {
    if (isMultiple) {
      const current = quizAnswers[questionId] || [];
      const newAnswers = current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId];
      setQuizAnswers({ ...quizAnswers, [questionId]: newAnswers });
    } else {
      setQuizAnswers({ ...quizAnswers, [questionId]: [choiceId] });
    }
  };

  const submitQuiz = async (quizId) => {
    setSubmitting(true);
    try {
      const results = await quizService.submit(quizId, quizAnswers);
      setQuizResults(results);

      if (results.passed) {
        showSuccess('Quiz réussi !', `Score: ${results.percentage}%`);
      } else {
        showError('Score insuffisant', `Votre score: ${results.percentage}%. Minimum requis: 50%`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur', 'Erreur lors de la soumission du quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const submitExercise = async (exerciseId) => {
    setSubmitting(true);
    try {
      const results = await exerciseService.submit(exerciseId, exerciseCode);
      setExerciseResults(results);

      if (results.passed) {
        showSuccess('Exercice réussi !', `Score: ${results.score}%`);
      } else {
        showError('Score insuffisant', `Votre score: ${results.score}%. Minimum requis: 50%`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur', 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <div className="border-l border-gray-300 h-4"></div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">{lesson?.title}</h1>
            <p className="text-xs text-gray-600">{lesson?.description}</p>
          </div>
        </div>
      </Header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Onglets */}
        <div className="flex space-x-4 mb-6 border-b">
          {['content', 'quiz', 'exercises'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'content' && '📚 Contenu'}
              {tab === 'quiz' && '📝 Quiz'}
              {tab === 'exercises' && '💻 Exercices'}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Vidéo */}
            {lesson?.video_url && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">🎥 Vidéo explicative</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={lesson.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-96 rounded-lg"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Concepts */}
            {lesson?.concepts?.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">📖 Concepts clés</h2>
                <div className="space-y-4">
                  {lesson.concepts.map((concept) => (
                    <div key={concept.id} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {concept.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{concept.definition}</p>
                      <pre className="code-block">{concept.syntax}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exemples */}
            {lesson?.examples?.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">💡 Exemples</h2>
                <div className="space-y-6">
                  {lesson.examples.map((example) => (
                    <div key={example.id}>
                      <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                      <p className="text-gray-700 mb-3">{example.description}</p>
                      <pre className="code-block mb-3">{example.code}</pre>
                      <p className="text-gray-600 italic">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulations */}
            {lesson?.simulations && lesson.simulations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🎬 Simulations Interactives
                </h2>
                {lesson.simulations.map((simulation) => (
                  <AlgorithmSimulation key={simulation.id} simulation={simulation} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz */}
        {activeTab === 'quiz' && lesson?.quizzes?.length > 0 && (
          <div className="space-y-6">
            {lesson.quizzes.map((quiz) => (
              <div key={quiz.id} className="card">
                <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>
                <div className="space-y-6">
                  {quiz.questions.map((question) => (
                    <div key={question.id} className="border-b pb-6">
                      <p className="font-medium text-lg mb-4">{question.question_text}</p>
                      <div className="space-y-2">
                        {question.choices.map((choice) => (
                          <label
                            key={choice.id}
                            className={`quiz-option block ${
                              quizAnswers[question.id]?.includes(choice.id) ? 'selected' : ''
                            }`}
                          >
                            <input
                              type={question.question_type === 'multiple' ? 'checkbox' : 'radio'}
                              name={`question-${question.id}`}
                              checked={quizAnswers[question.id]?.includes(choice.id) || false}
                              onChange={() =>
                                handleQuizAnswer(
                                  question.id,
                                  choice.id,
                                  question.question_type === 'multiple'
                                )
                              }
                              className="mr-3"
                            />
                            {choice.choice_text}
                          </label>
                        ))}
                      </div>
                      {quizResults?.detailed_results?.find((r) => r.question_id === question.id) && (
                        <div className={`mt-3 p-3 rounded ${
                          quizResults.detailed_results.find((r) => r.question_id === question.id).is_correct
                            ? 'bg-green-50 text-green-800'
                            : 'bg-red-50 text-red-800'
                        }`}>
                          <p className="font-medium">
                            {quizResults.detailed_results.find((r) => r.question_id === question.id).is_correct
                              ? '✅ Correct !'
                              : '❌ Incorrect'}
                          </p>
                          <p className="text-sm mt-1">
                            {quizResults.detailed_results.find((r) => r.question_id === question.id).explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => submitQuiz(quiz.id)}
                  disabled={submitting}
                  className="mt-6 btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Correction...' : 'Soumettre le quiz'}
                </button>
                {quizResults && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    quizResults.passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <p className="text-xl font-bold">
                      Score: {quizResults.percentage}% ({quizResults.score}/{quizResults.total_points})
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Exercices */}
        {activeTab === 'exercises' && lesson?.exercises?.length > 0 && (
          <div className="space-y-6">
            {lesson.exercises.map((exercise) => (
              <div key={exercise.id} className="card">
                <h2 className="text-2xl font-bold mb-4">{exercise.title}</h2>
                <p className="text-gray-700 mb-4">{exercise.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <pre className="whitespace-pre-wrap">{exercise.problem_statement}</pre>
                </div>
                {exercise.hints && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-yellow-800">💡 Indice:</p>
                    <p className="text-yellow-700">{exercise.hints}</p>
                  </div>
                )}
                <textarea
                  value={exerciseCode}
                  onChange={(e) => setExerciseCode(e.target.value)}
                  className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
                  placeholder="Écrivez votre code ici..."
                ></textarea>
                <button
                  onClick={() => submitExercise(exercise.id)}
                  disabled={submitting}
                  className="mt-4 btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Correction...' : 'Soumettre l\'exercice'}
                </button>
                {exerciseResults && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    exerciseResults.passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <p className="text-xl font-bold mb-2">Score: {exerciseResults.score}%</p>
                    <pre className="whitespace-pre-wrap text-sm">{exerciseResults.feedback}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

export default LessonDetail;