import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService, quizService, exerciseService } from '../services/api';
import AlgorithmSimulation from '../components/AlgorithmSimulation';
import InteractiveSimulation from '../components/InteractiveSimulation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }
  } catch {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) videoId = match[1];
  }
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
};

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [exerciseCodes, setExerciseCodes] = useState({});
  const [exerciseResults, setExerciseResults] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState({});
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const data = await lessonService.getById(lessonId);
      setLesson(data);

      // Charger les tentatives pour chaque exercice
      if (data.exercises && data.exercises.length > 0) {
        const attemptsData = {};
        for (const exercise of data.exercises) {
          try {
            const attempts = await exerciseService.getAttempts(exercise.id);
            attemptsData[exercise.id] = attempts.remaining_attempts;
          } catch (err) {
            attemptsData[exercise.id] = 3; // Par défaut si erreur
          }
        }
        setAttemptsRemaining(attemptsData);
      }
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
      const code = exerciseCodes[exerciseId] || '';
      const results = await exerciseService.submit(exerciseId, code);
      setExerciseResults(prev => ({ ...prev, [exerciseId]: results }));

      // Mettre à jour les essais restants depuis le backend
      const totalFailed = results.total_failed_attempts || 0;
      const remaining = Math.max(0, 3 - totalFailed);
      setAttemptsRemaining(prev => ({ ...prev, [exerciseId]: remaining }));

      if (results.passed) {
        showSuccess('Exercice réussi !', `Score: ${results.score}%`);
      } else {
        if (remaining > 0) {
          showError('Essai échoué', `Score: ${results.score}%. Il vous reste ${remaining} essai(s).`);
        } else {
          showError('Plus d\'essais', `Score: ${results.score}%. Vous avez épuisé vos 3 tentatives.`);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur', 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const resetExercise = async (exerciseId) => {
    try {
      // Réinitialiser les tentatives côté serveur
      await exerciseService.resetAttempts(exerciseId);
      setExerciseCodes(prev => ({ ...prev, [exerciseId]: '' }));
      setExerciseResults(prev => ({ ...prev, [exerciseId]: null }));
      setAttemptsRemaining(prev => ({ ...prev, [exerciseId]: 3 }));
      showSuccess('Réinitialisé', 'Vos tentatives ont été réinitialisées. Vous avez 3 nouveaux essais.');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      showError('Erreur', 'Impossible de réinitialiser les tentatives');
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
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-all duration-300 hover:-translate-x-1"
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
        <div className="flex space-x-4 mb-6 border-b overflow-x-auto">
          {['content', 'quiz', 'exercises'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-all duration-300 flex-shrink-0 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600 scale-105'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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
          <div className="space-y-8 tab-content-enter">
            {/* Vidéo */}
            {lesson?.video_url && getYouTubeEmbedUrl(lesson.video_url) && (
              <div className="card animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-4">🎥 Vidéo explicative</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={getYouTubeEmbedUrl(lesson.video_url)}
                    className="w-full h-56 sm:h-72 md:h-96 rounded-lg"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Vidéo de la leçon"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Concepts */}
            {lesson?.concepts?.length > 0 && (
              <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold mb-4">📖 Concepts clés</h2>
                <div className="space-y-4">
                  {lesson.concepts.map((concept, i) => (
                    <div key={concept.id} className="border-l-4 border-primary-500 pl-4 animate-fade-in-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
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
              <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-2xl font-bold mb-4">💡 Exemples</h2>
                <div className="space-y-6">
                  {lesson.examples.map((example, i) => (
                    <div key={example.id} className="animate-fade-in-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
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
              <div className="mt-8 animate-fade-in-up overflow-hidden" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🎬 Simulations Interactives
                </h2>
                {/* Filtrer pour n'afficher qu'une seule simulation par type */}
                {(() => {
                  let hasShownConditional = false;
                  let hasShownLoopPour = false;
                  let hasShownLoopTantQue = false;
                  let hasShownLoopRepeter = false;
                  let hasShownFunction = false;
                  let hasShownProcedure = false;
                  let hasShownVariable = false;
                  let hasShownConstant = false;

                  return lesson.simulations.filter(simulation => {
                    const code = simulation.algorithm_code || '';
                    const codeUpper = code.toUpperCase();
                    const title = (simulation.title || '').toUpperCase();

                    // Détecter les types de simulation
                    const isFunction = codeUpper.includes('FONCTION') || codeUpper.includes('RETOURNER') || title.includes('FONCTION');
                    const isProcedure = (codeUpper.includes('PROCEDURE') || title.includes('PROCEDURE')) && !isFunction;
                    const isLoopPour = (codeUpper.includes('POUR ') && codeUpper.includes('FIN POUR') || title.includes('POUR')) && !isFunction && !isProcedure;
                    const isLoopTantQue = (codeUpper.includes('TANT QUE') || title.includes('TANT QUE')) && !isFunction && !isProcedure;
                    const isLoopRepeter = (codeUpper.includes('REPETER') || title.includes('REPETER')) && !isFunction && !isProcedure;
                    const isConditional = (codeUpper.includes('SI ') || codeUpper.includes('SINON')) && !isLoopPour && !isLoopTantQue && !isLoopRepeter && !isFunction && !isProcedure;
                    const isConstant = (codeUpper.includes('CONSTANTE') || title.includes('CONSTANTE')) && !isFunction && !isProcedure && !isLoopPour && !isLoopTantQue && !isLoopRepeter && !isConditional;
                    const isVariable = title.includes('VARIABLE') && !isConditional && !isLoopPour && !isLoopTantQue && !isLoopRepeter && !isFunction && !isProcedure && !isConstant;

                    // Filtrer les doublons par type
                    if (isVariable) {
                      if (hasShownVariable) return false;
                      hasShownVariable = true;
                    } else if (isConstant) {
                      if (hasShownConstant) return false;
                      hasShownConstant = true;
                    } else if (isFunction) {
                      if (hasShownFunction) return false;
                      hasShownFunction = true;
                    } else if (isProcedure) {
                      if (hasShownProcedure) return false;
                      hasShownProcedure = true;
                    } else if (isLoopPour) {
                      if (hasShownLoopPour) return false;
                      hasShownLoopPour = true;
                    } else if (isLoopTantQue) {
                      if (hasShownLoopTantQue) return false;
                      hasShownLoopTantQue = true;
                    } else if (isLoopRepeter) {
                      if (hasShownLoopRepeter) return false;
                      hasShownLoopRepeter = true;
                    } else if (isConditional) {
                      if (hasShownConditional) return false;
                      hasShownConditional = true;
                    }
                    return true;
                  }).map((simulation) => {
                    const hasQuestions = simulation.steps?.some(step => step.visual_data?.question);
                    const code = simulation.algorithm_code || '';
                    const codeUpper = code.toUpperCase();
                    const title = (simulation.title || '').toUpperCase();

                    // Détecter si c'est une simulation interactive
                    const isConditional = codeUpper.includes('SI ') || codeUpper.includes('SINON');
                    const isLoop = codeUpper.includes('POUR ') || codeUpper.includes('TANT QUE') || codeUpper.includes('REPETER') ||
                                   title.includes('POUR') || title.includes('TANT QUE') || title.includes('REPETER');
                    const isFunction = codeUpper.includes('FONCTION') || codeUpper.includes('RETOURNER') || title.includes('FONCTION');
                    const isProcedure = codeUpper.includes('PROCEDURE') || title.includes('PROCEDURE');
                    const isVariable = title.includes('VARIABLE');
                    const isConstant = title.includes('CONSTANTE') || codeUpper.includes('CONSTANTE');
                    const needsInteractive = hasQuestions || isConditional || isLoop || isFunction || isProcedure || isVariable || isConstant;

                    return needsInteractive ? (
                      <InteractiveSimulation key={simulation.id} simulation={simulation} />
                    ) : (
                      <AlgorithmSimulation key={simulation.id} simulation={simulation} />
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}

        {/* Quiz */}
        {activeTab === 'quiz' && lesson?.quizzes?.length > 0 && (
          <div className="space-y-6 tab-content-enter">
            {lesson.quizzes.map((quiz) => (
              <div key={quiz.id} className="card animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>
                <div className="space-y-6">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={question.id} className="border-b pb-6 animate-fade-in-up" style={{ animationDelay: `${qIndex * 0.1}s` }}>
                      <p className="font-medium text-lg mb-4">{question.question_text}</p>
                      <div className="space-y-2">
                        {question.choices.map((choice) => (
                          <label
                            key={choice.id}
                            className={`quiz-option block ${
                              quizAnswers[question.id]?.includes(choice.id) ? 'selected' : ''
                            } ${
                              quizResults?.detailed_results?.find((r) => r.question_id === question.id)
                                ? quizResults.detailed_results.find((r) => r.question_id === question.id).is_correct
                                  ? 'correct'
                                  : quizAnswers[question.id]?.includes(choice.id) ? 'incorrect' : ''
                                : ''
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
                        <div className={`mt-3 p-3 rounded animate-slide-in ${
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
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Correction...
                    </span>
                  ) : 'Soumettre le quiz'}
                </button>
                {quizResults && (
                  <div className={`mt-4 p-4 rounded-lg animate-slide-in ${
                    quizResults.passed ? 'bg-green-100 celebrate' : 'bg-red-100'
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
          <div className="space-y-6 tab-content-enter">
            {lesson.exercises.map((exercise, exIndex) => (
              <div key={exercise.id} className="card animate-fade-in-up" style={{ animationDelay: `${exIndex * 0.15}s` }}>
                <h2 className="text-2xl font-bold mb-4">{exercise.title}</h2>
                <p className="text-gray-700 mb-4">{exercise.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <pre className="whitespace-pre-wrap">{exercise.problem_statement}</pre>
                </div>
                {exercise.hints && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-sm font-medium text-yellow-800">💡 Indice:</p>
                    <p className="text-yellow-700">{exercise.hints}</p>
                  </div>
                )}
                {/* Compteur d'essais */}
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    (attemptsRemaining[exercise.id] ?? 3) === 3 ? 'bg-green-100 text-green-800' :
                    (attemptsRemaining[exercise.id] ?? 3) === 2 ? 'bg-yellow-100 text-yellow-800' :
                    (attemptsRemaining[exercise.id] ?? 3) === 1 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(attemptsRemaining[exercise.id] ?? 3) > 0 ? (
                      <>🎯 Essais restants: <span className="font-bold">{attemptsRemaining[exercise.id] ?? 3}/3</span></>
                    ) : (
                      <>❌ Plus d'essais disponibles</>
                    )}
                  </div>
                  {(exerciseResults[exercise.id] || (attemptsRemaining[exercise.id] ?? 3) < 3) && (
                    <button
                      onClick={() => resetExercise(exercise.id)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      🔄 Recommencer
                    </button>
                  )}
                </div>

                <textarea
                  value={exerciseCodes[exercise.id] || ''}
                  onChange={(e) => setExerciseCodes(prev => ({ ...prev, [exercise.id]: e.target.value }))}
                  className="w-full h-48 sm:h-64 p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:shadow-lg focus:shadow-primary-500/10 transition-all duration-300"
                  placeholder="Écrivez votre code ici..."
                  disabled={(attemptsRemaining[exercise.id] ?? 3) <= 0 && !exerciseResults[exercise.id]?.passed}
                ></textarea>
                <button
                  onClick={() => submitExercise(exercise.id)}
                  disabled={submitting || ((attemptsRemaining[exercise.id] ?? 3) <= 0 && !exerciseResults[exercise.id]?.passed)}
                  className="mt-4 btn-primary disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Correction...
                    </span>
                  ) : (attemptsRemaining[exercise.id] ?? 3) <= 0 ? 'Plus d\'essais' : 'Soumettre l\'exercice'}
                </button>
                {exerciseResults[exercise.id] && (
                  <div className={`mt-4 p-4 rounded-lg animate-slide-in ${
                    exerciseResults[exercise.id].passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xl font-bold">Score: {exerciseResults[exercise.id].score}%</p>
                      {!exerciseResults[exercise.id].passed && exerciseResults[exercise.id].show_correction && (
                        <span className="text-sm text-red-600 font-medium">
                          La correction est affichée ci-dessous
                        </span>
                      )}
                    </div>
                    <pre className="whitespace-pre-wrap text-sm">{exerciseResults[exercise.id].feedback}</pre>
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
