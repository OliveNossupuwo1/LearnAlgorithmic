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
      <Header dashboardButtons={
        <>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all duration-300"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all duration-300"
          >
            Retour
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
              {tab === 'content' && <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>Contenu</span>}
              {tab === 'quiz' && <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Quiz</span>}
              {tab === 'exercises' && <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>Exercices</span>}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {activeTab === 'content' && (
          <div className="space-y-8 tab-content-enter">
            {/* Vidéo */}
            {lesson?.video_url && getYouTubeEmbedUrl(lesson.video_url) && (
              <div className="card animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-4 flex items-center"><svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Video explicative</h2>
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
                <h2 className="text-2xl font-bold mb-4 flex items-center"><svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>Concepts cles</h2>
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
                <h2 className="text-2xl font-bold mb-4 flex items-center"><svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Exemples</h2>
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
                  <svg className="w-6 h-6 mr-2 inline text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Simulations Interactives
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
                              ? <span className="flex items-center"><svg className="w-5 h-5 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Correct !</span>
                              : <span className="flex items-center"><svg className="w-5 h-5 mr-1.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Incorrect</span>}
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
                    <p className="text-sm font-medium text-yellow-800 flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Indice:</p>
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
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Tentative <span className="font-bold ml-1">{3 - (attemptsRemaining[exercise.id] ?? 3)}/{3}</span><span className="mx-1">—</span>Il vous reste <span className="font-bold mx-1">{attemptsRemaining[exercise.id] ?? 3}</span> essai{(attemptsRemaining[exercise.id] ?? 3) > 1 ? 's' : ''}</span>
                    ) : (
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Plus d'essais disponibles (3/3 utilises)</span>
                    )}
                  </div>
                  {(exerciseResults[exercise.id] || (attemptsRemaining[exercise.id] ?? 3) < 3) && (
                    <button
                      onClick={() => resetExercise(exercise.id)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Recommencer
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
