from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.db.models import Avg, Count, Q
from django.utils import timezone
from datetime import timedelta
import logging
from .models import *
from .serializers import *

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    """Vue pour l'enregistrement des nouveaux utilisateurs"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Créer la progression pour le premier module
        first_module = Module.objects.filter(order=1).first()
        if first_module:
            UserProgress.objects.create(
                user=user,
                module=first_module,
                is_unlocked=True
            )
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Vue pour la connexion"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    else:
        return Response({
            'error': 'Identifiants invalides'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Récupère les informations de l'utilisateur connecté"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Password Reset Views
token_generator = PasswordResetTokenGenerator()

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Demande de réinitialisation de mot de passe - envoie un email avec le lien"""
    email = request.data.get('email')

    if not email:
        return Response({
            'error': 'Email requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Chercher l'utilisateur par email (prendre le premier si plusieurs)
    user = User.objects.filter(email=email).first()

    if not user:
        # Pour des raisons de sécurité, on retourne toujours le même message
        return Response({
            'message': 'Si cet email existe, un lien de réinitialisation a été envoyé.'
        })

    # Générer le token et l'UID
    token = token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    # Créer le lien de réinitialisation
    reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"

    # Envoyer l'email
    try:
        send_mail(
            subject='Réinitialisation de votre mot de passe - LearnAlgorithmic',
            message=f"""
Bonjour {user.username},

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
{reset_link}

Ce lien est valide pendant 24 heures.

Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.

Cordialement,
L'équipe LearnAlgorithmic
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email: {e}")
        return Response({
            'error': 'Erreur lors de l\'envoi de l\'email'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        'message': 'Si cet email existe, un lien de réinitialisation a été envoyé.'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """Confirme la réinitialisation du mot de passe avec le nouveau mot de passe"""
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not all([uid, token, new_password]):
        return Response({
            'error': 'Tous les champs sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Valider le mot de passe
    if len(new_password) < 8:
        return Response({
            'error': 'Le mot de passe doit contenir au moins 8 caractères'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Décoder l'UID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({
            'error': 'Lien invalide'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier le token
    if not token_generator.check_token(user, token):
        return Response({
            'error': 'Lien invalide ou expiré'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Changer le mot de passe
    user.set_password(new_password)
    user.save()

    return Response({
        'message': 'Mot de passe réinitialisé avec succès'
    })


class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les modules"""
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        """Liste les modules avec l'état de progression de l'utilisateur"""
        modules = self.get_queryset().order_by('order')
        
        # Récupérer ou créer la progression utilisateur
        user_progress_qs = UserProgress.objects.filter(user=request.user)
        
        # Si aucune progression, créer pour le premier module
        if not user_progress_qs.exists():
            first_module = Module.objects.filter(order=1).first()
            if first_module:
                UserProgress.objects.create(
                    user=request.user,
                    module=first_module,
                    is_unlocked=True
                )
                user_progress_qs = UserProgress.objects.filter(user=request.user)
        
        modules_data = []
        for module in modules:
            module_serializer = self.get_serializer(module)
            module_dict = module_serializer.data
            
            # Si l'utilisateur est admin/staff, tout est débloqué
            if request.user.is_staff or request.user.is_superuser:
                is_unlocked = True
                is_completed = False
                completion_date = None
            else:
                # Utilisateur normal
                progress = user_progress_qs.filter(module=module).first()
                if progress:
                    is_unlocked = progress.is_unlocked
                    is_completed = progress.is_completed
                    completion_date = progress.completion_date
                else:
                    is_unlocked = False
                    is_completed = False
                    completion_date = None
            
            module_dict['is_unlocked'] = is_unlocked
            module_dict['is_completed'] = is_completed
            module_dict['completion_date'] = completion_date
            
            # Calculer la progression des leçons
            lessons = module.lessons.all()
            total_lessons = lessons.count()
            completed_lessons = 0
            
            for lesson in lessons:
                lesson_progress = LessonProgress.objects.filter(
                    user=request.user,
                    lesson=lesson,
                    is_completed=True
                ).first()
                if lesson_progress:
                    completed_lessons += 1
            
            module_dict['lessons_count'] = total_lessons  # Ajouté pour AdminDashboard
            module_dict['lessons_progress'] = {
                'total': total_lessons,
                'completed': completed_lessons,
                'percentage': (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
            }
            
            modules_data.append(module_dict)
        
        return Response(modules_data)
    
    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        """Récupère les leçons d'un module"""
        module = self.get_object()
        
        # Si admin, accès total
        if not (request.user.is_staff or request.user.is_superuser):
            # Vérifier si le module est débloqué pour utilisateur normal
            progress = UserProgress.objects.filter(
                user=request.user,
                module=module
            ).first()
            
            if not progress or not progress.is_unlocked:
                return Response({
                    'error': 'Ce module n\'est pas encore débloqué'
                }, status=status.HTTP_403_FORBIDDEN)
        
        lessons = module.lessons.all().order_by('order')
        lessons_data = []
        
        for lesson in lessons:
            lesson_dict = LessonSerializer(lesson).data
            
            # Ajouter la progression de la leçon
            lesson_progress = LessonProgress.objects.filter(
                user=request.user,
                lesson=lesson
            ).first()
            
            if lesson_progress:
                lesson_dict['progress'] = LessonProgressSerializer(lesson_progress).data
            else:
                lesson_dict['progress'] = None
            
            lessons_data.append(lesson_dict)
        
        return Response(lessons_data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les leçons"""
    queryset = Lesson.objects.all()
    serializer_class = LessonDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        """Récupère le détail d'une leçon"""
        lesson = self.get_object()
        
        # Si admin, accès total
        if not (request.user.is_staff or request.user.is_superuser):
            # Vérifier si le module parent est débloqué pour utilisateur normal
            progress = UserProgress.objects.filter(
                user=request.user,
                module=lesson.module
            ).first()
            
            if not progress or not progress.is_unlocked:
                return Response({
                    'error': 'Ce module n\'est pas encore débloqué'
                }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(lesson)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request):
    """Soumettre les réponses d'un quiz"""
    quiz_id = request.data.get('quiz_id')
    answers = request.data.get('answers')  # {question_id: [choice_ids]}

    logger.info(f"[QUIZ SUBMIT] User: {request.user.username}, Quiz ID: {quiz_id}, Answers: {answers}")

    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        logger.error(f"[QUIZ SUBMIT] Quiz {quiz_id} non trouvé")
        return Response({'error': 'Quiz non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculer le score
    total_points = 0
    earned_points = 0
    detailed_results = []
    
    for question in quiz.questions.all():
        total_points += question.points
        user_answer = answers.get(str(question.id), [])
        
        if question.question_type == 'single':
            # Choix unique
            correct_choices = question.choices.filter(is_correct=True)
            is_correct = len(user_answer) == 1 and int(user_answer[0]) in [c.id for c in correct_choices]
            
            if is_correct:
                earned_points += question.points
            
            detailed_results.append({
                'question_id': question.id,
                'question_text': question.question_text,
                'is_correct': is_correct,
                'user_answer': user_answer,
                'correct_answer': [c.id for c in correct_choices],
                'explanation': question.explanation
            })
        
        elif question.question_type == 'multiple':
            # Choix multiples
            correct_choices = set(question.choices.filter(is_correct=True).values_list('id', flat=True))
            user_choices = set([int(id) for id in user_answer])
            is_correct = correct_choices == user_choices
            
            if is_correct:
                earned_points += question.points
            
            detailed_results.append({
                'question_id': question.id,
                'question_text': question.question_text,
                'is_correct': is_correct,
                'user_answer': list(user_choices),
                'correct_answer': list(correct_choices),
                'explanation': question.explanation
            })
        
        elif question.question_type == 'true_false':
            # Vrai/Faux
            correct_choice = question.choices.filter(is_correct=True).first()
            is_correct = len(user_answer) == 1 and int(user_answer[0]) == correct_choice.id
            
            if is_correct:
                earned_points += question.points
            
            detailed_results.append({
                'question_id': question.id,
                'question_text': question.question_text,
                'is_correct': is_correct,
                'user_answer': user_answer,
                'correct_answer': [correct_choice.id],
                'explanation': question.explanation
            })
    
    percentage = int((earned_points / total_points * 100)) if total_points > 0 else 0
    
    # Enregistrer la tentative
    attempt = QuizAttempt.objects.create(
        user=request.user,
        quiz=quiz,
        score=earned_points,
        total_points=total_points,
        percentage=percentage,
        answers=answers
    )
    
    # Mettre à jour la progression de la leçon
    lesson_progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=quiz.lesson
    )

    logger.info(f"[QUIZ SUBMIT] LessonProgress {'created' if created else 'found'}: Quiz={lesson_progress.quiz_score}%, Exercise={lesson_progress.exercise_score}%, Combined={lesson_progress.combined_score}%")

    # Prendre le meilleur score
    if percentage > lesson_progress.quiz_score:
        lesson_progress.quiz_score = percentage
        lesson_progress.calculate_combined_score()

        logger.info(f"[QUIZ SUBMIT] New score: Quiz={lesson_progress.quiz_score}%, Combined={lesson_progress.combined_score}%")

        # Vérifier si la leçon est complétée (score >= 50)
        if lesson_progress.combined_score >= 50 and not lesson_progress.is_completed:
            lesson_progress.is_completed = True
            lesson_progress.completion_date = timezone.now()

            logger.info(f"[QUIZ SUBMIT] Lesson completed! Checking module completion for Module {quiz.lesson.module.order}")

            # Vérifier si toutes les leçons du module sont complétées
            check_module_completion(request.user, quiz.lesson.module)

        lesson_progress.save()
        logger.info(f"[QUIZ SUBMIT] LessonProgress saved")
    
    return Response({
        'score': earned_points,
        'total_points': total_points,
        'percentage': percentage,
        'passed': percentage >= 50,
        'detailed_results': detailed_results
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exercise(request):
    """Soumettre la solution d'un exercice"""
    logger.info(f"[EXERCISE SUBMIT] User: {request.user.username}")
    exercise_id = request.data.get('exercise_id')
    code_submitted = request.data.get('code')
    
    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return Response({'error': 'Exercice non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    # Validation basique du code (peut être améliorée avec une vraie exécution)
    is_correct, feedback, score = validate_exercise_code(code_submitted, exercise)
    
    # Enregistrer la soumission
    submission = ExerciseSubmission.objects.create(
        user=request.user,
        exercise=exercise,
        code_submitted=code_submitted,
        is_correct=is_correct,
        score=score,
        feedback=feedback
    )
    
    # Mettre à jour la progression de la leçon
    lesson_progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=exercise.lesson
    )

    logger.info(f"[EXERCISE SUBMIT] LessonProgress {'created' if created else 'found'}: Quiz={lesson_progress.quiz_score}%, Exercise={lesson_progress.exercise_score}%, Combined={lesson_progress.combined_score}%")
    logger.info(f"[EXERCISE SUBMIT] Exercise score: {score}%")

    # Prendre le meilleur score
    if score > lesson_progress.exercise_score:
        lesson_progress.exercise_score = score
        lesson_progress.calculate_combined_score()

        logger.info(f"[EXERCISE SUBMIT] New score: Exercise={lesson_progress.exercise_score}%, Combined={lesson_progress.combined_score}%")

        # Vérifier si la leçon est complétée
        if lesson_progress.combined_score >= 50 and not lesson_progress.is_completed:
            lesson_progress.is_completed = True
            lesson_progress.completion_date = timezone.now()

            logger.info(f"[EXERCISE SUBMIT] Lesson completed! Checking module completion for Module {exercise.lesson.module.order}")

            # Vérifier si toutes les leçons du module sont complétées
            check_module_completion(request.user, exercise.lesson.module)

        lesson_progress.save()
        logger.info(f"[EXERCISE SUBMIT] LessonProgress saved")
    
    return Response({
        'is_correct': is_correct,
        'score': score,
        'feedback': feedback,
        'passed': score >= 50
    })


def validate_exercise_code(code, exercise):
    """
    Valide le code soumis pour un exercice
    Cette fonction peut être améliorée pour exécuter réellement le code
    Pour l'instant, elle fait une validation basique
    """
    feedback = []
    score = 0
    
    # Vérifier que le code n'est pas vide
    if not code or len(code.strip()) == 0:
        return False, "Le code soumis est vide", 0
    
    # Vérifications basiques (peuvent être personnalisées par exercice)
    test_cases = exercise.test_cases
    
    # Simulation de validation (à remplacer par une vraie exécution sécurisée)
    # Pour une vraie application, utilisez Docker ou un environnement sandboxé
    
    # Exemple de validation simple basée sur des mots-clés
    required_keywords = test_cases.get('required_keywords', [])
    forbidden_keywords = test_cases.get('forbidden_keywords', [])
    
    points_per_test = 100 // max(len(required_keywords) + len(forbidden_keywords), 1)
    
    for keyword in required_keywords:
        if keyword.lower() in code.lower():
            score += points_per_test
            feedback.append(f"✓ Utilise correctement '{keyword}'")
        else:
            feedback.append(f"✗ Devrait utiliser '{keyword}'")
    
    for keyword in forbidden_keywords:
        if keyword.lower() not in code.lower():
            score += points_per_test
            feedback.append(f"✓ N'utilise pas '{keyword}' (correct)")
        else:
            feedback.append(f"✗ Ne devrait pas utiliser '{keyword}'")
    
    score = min(score, 100)
    is_correct = score >= 50
    
    feedback_text = "\n".join(feedback)
    if is_correct:
        feedback_text += "\n\n✅ Exercice réussi !"
    else:
        feedback_text += "\n\n❌ Exercice non réussi. Score minimum : 50/100"
    
    return is_correct, feedback_text, score


def check_module_completion(user, module):
    """Vérifie si toutes les leçons d'un module sont complétées"""
    lessons = module.lessons.all()
    total_lessons = lessons.count()

    completed_lessons = LessonProgress.objects.filter(
        user=user,
        lesson__in=lessons,
        is_completed=True
    ).count()

    logger.info(f"[MODULE COMPLETION] Module {module.order} ({module.title}): {completed_lessons}/{total_lessons} lessons completed")

    if completed_lessons == total_lessons:
        logger.info(f"[MODULE COMPLETION] All lessons completed! Marking Module {module.order} as completed")

        # Marquer le module comme complété
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            module=module
        )

        if not progress.is_completed:
            progress.is_completed = True
            progress.completion_date = timezone.now()
            progress.save()

            logger.info(f"[MODULE COMPLETION] Module {module.order} marked as completed")

            # Débloquer le module suivant
            next_module = Module.objects.filter(order=module.order + 1).first()
            if next_module:
                logger.info(f"[MODULE COMPLETION] Unlocking next module: Module {next_module.order} ({next_module.title})")

                next_progress, created = UserProgress.objects.get_or_create(
                    user=user,
                    module=next_module
                )
                next_progress.is_unlocked = True
                next_progress.save()

                logger.info(f"[MODULE COMPLETION] Module {next_module.order} unlocked successfully!")
            else:
                logger.info(f"[MODULE COMPLETION] No next module found (this was the last module)")
        else:
            logger.info(f"[MODULE COMPLETION] Module {module.order} was already completed")

    return completed_lessons == total_lessons


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_module_complete(request, module_id):
    """Marquer un module comme terminé si toutes les leçons sont complétées"""
    try:
        module = Module.objects.get(id=module_id)
    except Module.DoesNotExist:
        return Response({'error': 'Module non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    # Vérifier si le module est débloqué
    user_progress = UserProgress.objects.filter(user=user, module=module).first()
    if not user_progress or not user_progress.is_unlocked:
        return Response(
            {'error': 'Ce module n\'est pas encore débloqué'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Récupérer toutes les leçons du module
    lessons = module.lessons.all()
    total_lessons = lessons.count()

    if total_lessons == 0:
        return Response(
            {'error': 'Ce module ne contient aucune leçon'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Vérifier la progression de chaque leçon
    lesson_progress_list = []
    incomplete_lessons = []

    for lesson in lessons:
        lesson_progress = LessonProgress.objects.filter(user=user, lesson=lesson).first()

        if not lesson_progress or not lesson_progress.is_completed:
            # Leçon non complétée
            quiz_score = lesson_progress.quiz_score if lesson_progress else 0
            exercise_score = lesson_progress.exercise_score if lesson_progress else 0
            combined_score = lesson_progress.combined_score if lesson_progress else 0

            incomplete_lessons.append({
                'lesson_id': lesson.id,
                'lesson_title': lesson.title,
                'quiz_score': quiz_score,
                'exercise_score': exercise_score,
                'combined_score': combined_score,
                'required_score': 50
            })
        else:
            lesson_progress_list.append(lesson_progress)

    completed_lessons = len(lesson_progress_list)

    # Si toutes les leçons sont complétées
    if completed_lessons == total_lessons:
        # Marquer le module comme complété
        user_progress.is_completed = True
        user_progress.completion_date = timezone.now()
        user_progress.save()

        logger.info(f"[MARK COMPLETE] Module {module.order} marked as completed by user {user.username}")

        # Débloquer le module suivant
        next_module = Module.objects.filter(order=module.order + 1).first()
        if next_module:
            next_progress, _ = UserProgress.objects.get_or_create(
                user=user,
                module=next_module
            )
            next_progress.is_unlocked = True
            next_progress.save()

            logger.info(f"[MARK COMPLETE] Module {next_module.order} unlocked")

            return Response({
                'success': True,
                'message': f'Félicitations ! Module "{module.title}" terminé !',
                'module_completed': True,
                'next_module': {
                    'id': next_module.id,
                    'title': next_module.title,
                    'order': next_module.order
                }
            })
        else:
            return Response({
                'success': True,
                'message': f'Félicitations ! Module "{module.title}" terminé ! Vous avez complété tous les modules !',
                'module_completed': True,
                'next_module': None
            })

    # Si des leçons ne sont pas complétées
    else:
        return Response({
            'success': False,
            'message': f'Vous devez terminer toutes les leçons avant de marquer ce module comme terminé.',
            'module_completed': False,
            'completed_lessons': completed_lessons,
            'total_lessons': total_lessons,
            'incomplete_lessons': incomplete_lessons
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Statistiques pour le tableau de bord"""
    user = request.user
    
    # Modules
    total_modules = Module.objects.count()
    user_progress = UserProgress.objects.filter(user=user)
    completed_modules = user_progress.filter(is_completed=True).count()
    unlocked_modules = user_progress.filter(is_unlocked=True).count()
    
    # Progression globale
    overall_progress = (completed_modules / total_modules * 100) if total_modules > 0 else 0
    
    # Module actuel (premier module débloqué non complété)
    current_module_progress = user_progress.filter(
        is_unlocked=True,
        is_completed=False
    ).order_by('module__order').first()
    
    current_module = None
    if current_module_progress:
        module = current_module_progress.module
        lessons = module.lessons.all()
        total_lessons = lessons.count()
        completed_lessons = LessonProgress.objects.filter(
            user=user,
            lesson__in=lessons,
            is_completed=True
        ).count()
        
        current_module = {
            'id': module.id,
            'title': module.title,
            'order': module.order,
            'total_lessons': total_lessons,
            'completed_lessons': completed_lessons,
            'progress_percentage': (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        }
    
    # Activités récentes
    recent_quiz_attempts = QuizAttempt.objects.filter(user=user).order_by('-completed_at')[:5]
    recent_exercise_submissions = ExerciseSubmission.objects.filter(user=user).order_by('-submitted_at')[:5]
    
    recent_activities = []
    
    for attempt in recent_quiz_attempts:
        recent_activities.append({
            'type': 'quiz',
            'title': attempt.quiz.title,
            'lesson': attempt.quiz.lesson.title,
            'score': attempt.percentage,
            'date': attempt.completed_at
        })
    
    for submission in recent_exercise_submissions:
        recent_activities.append({
            'type': 'exercise',
            'title': submission.exercise.title,
            'lesson': submission.exercise.lesson.title,
            'score': submission.score,
            'date': submission.submitted_at
        })
    
    # Trier par date
    recent_activities.sort(key=lambda x: x['date'], reverse=True)
    recent_activities = recent_activities[:10]
    
    return Response({
        'total_modules': total_modules,
        'completed_modules': completed_modules,
        'unlocked_modules': unlocked_modules,
        'overall_progress': round(overall_progress, 1),
        'current_module': current_module,
        'recent_activities': recent_activities
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_progress_view(request):
    """Vue détaillée de la progression utilisateur"""
    user = request.user
    
    modules_progress = []
    all_modules = Module.objects.all()
    
    for module in all_modules:
        progress = UserProgress.objects.filter(user=user, module=module).first()
        lessons = module.lessons.all()
        
        lessons_data = []
        for lesson in lessons:
            lesson_progress = LessonProgress.objects.filter(user=user, lesson=lesson).first()
            lessons_data.append({
                'id': lesson.id,
                'title': lesson.title,
                'is_completed': lesson_progress.is_completed if lesson_progress else False,
                'quiz_score': lesson_progress.quiz_score if lesson_progress else 0,
                'exercise_score': lesson_progress.exercise_score if lesson_progress else 0,
                'combined_score': lesson_progress.combined_score if lesson_progress else 0,
            })
        
        modules_progress.append({
            'module': ModuleSerializer(module).data,
            'is_unlocked': progress.is_unlocked if progress else False,
            'is_completed': progress.is_completed if progress else False,
            'completion_date': progress.completion_date if progress else None,
            'lessons': lessons_data
        })
    
    return Response(modules_progress)