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
import random
from .models import PasswordResetCode

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Demande de réinitialisation de mot de passe - envoie un code par email"""
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
            'message': 'Si cet email existe, un code de vérification a été envoyé.'
        })

    # Invalider les anciens codes non utilisés
    PasswordResetCode.objects.filter(user=user, is_used=False).update(is_used=True)

    # Générer un code à 6 chiffres
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    # Créer l'enregistrement avec expiration dans 15 minutes
    reset_code = PasswordResetCode.objects.create(
        user=user,
        code=code,
        expires_at=timezone.now() + timedelta(minutes=15)
    )

    # Envoyer l'email avec le code
    try:
        send_mail(
            subject='Code de vérification - LearnAlgorithmic',
            message=f"""
Bonjour {user.username},

Vous avez demandé la réinitialisation de votre mot de passe.

Votre code de vérification est : {code}

Ce code est valide pendant 15 minutes.

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
        'message': 'Si cet email existe, un code de vérification a été envoyé.',
        'email': email  # Renvoyer l'email pour l'utiliser dans l'étape suivante
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_code(request):
    """Vérifie le code de réinitialisation"""
    email = request.data.get('email')
    code = request.data.get('code')

    if not all([email, code]):
        return Response({
            'error': 'Email et code requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Chercher l'utilisateur
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({
            'error': 'Code invalide ou expiré'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Chercher le code
    reset_code = PasswordResetCode.objects.filter(
        user=user,
        code=code,
        is_used=False
    ).first()

    if not reset_code or not reset_code.is_valid():
        return Response({
            'error': 'Code invalide ou expiré'
        }, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'message': 'Code vérifié avec succès',
        'valid': True
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """Réinitialise le mot de passe avec le code vérifié"""
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')

    if not all([email, code, new_password]):
        return Response({
            'error': 'Tous les champs sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Valider le mot de passe
    if len(new_password) < 8:
        return Response({
            'error': 'Le mot de passe doit contenir au moins 8 caractères'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Chercher l'utilisateur
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({
            'error': 'Code invalide ou expiré'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Chercher et valider le code
    reset_code = PasswordResetCode.objects.filter(
        user=user,
        code=code,
        is_used=False
    ).first()

    if not reset_code or not reset_code.is_valid():
        return Response({
            'error': 'Code invalide ou expiré'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Marquer le code comme utilisé
    reset_code.is_used = True
    reset_code.save()

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

    # Compter les tentatives échouées précédentes pour cet exercice
    failed_attempts = ExerciseSubmission.objects.filter(
        user=request.user,
        exercise=exercise,
        is_correct=False
    ).count()

    logger.info(f"[EXERCISE SUBMIT] Failed attempts so far: {failed_attempts}")

    # Validation du code avec indication du nombre de tentatives
    is_correct, feedback, score = validate_exercise_code(code_submitted, exercise, failed_attempts)

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

    # Calculer le nombre de tentatives après cette soumission
    current_attempt = failed_attempts + (0 if is_correct else 1)

    return Response({
        'is_correct': is_correct,
        'score': score,
        'feedback': feedback,
        'passed': score >= 50,
        'attempt_number': failed_attempts + 1,
        'total_failed_attempts': current_attempt,
        'show_correction': current_attempt >= 3
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_exercise_attempts(request):
    """Réinitialiser les tentatives d'un exercice pour l'utilisateur"""
    exercise_id = request.data.get('exercise_id')

    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return Response({'error': 'Exercice non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    # Supprimer toutes les soumissions échouées de cet utilisateur pour cet exercice
    deleted_count, _ = ExerciseSubmission.objects.filter(
        user=request.user,
        exercise=exercise,
        is_correct=False
    ).delete()

    logger.info(f"[EXERCISE RESET] User {request.user.username} reset {deleted_count} failed attempts for exercise {exercise_id}")

    return Response({
        'success': True,
        'deleted_count': deleted_count,
        'message': f'{deleted_count} tentative(s) réinitialisée(s)'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercise_attempts(request, exercise_id):
    """Récupérer le nombre de tentatives échouées pour un exercice"""
    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return Response({'error': 'Exercice non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    failed_attempts = ExerciseSubmission.objects.filter(
        user=request.user,
        exercise=exercise,
        is_correct=False
    ).count()

    return Response({
        'exercise_id': exercise_id,
        'failed_attempts': failed_attempts,
        'remaining_attempts': max(0, 3 - failed_attempts)
    })


def compare_outputs(actual_output, expected_output):
    """
    Compare la sortie du programme avec la sortie attendue de maniere flexible.
    Extrait les valeurs significatives (nombres et textes cles) et les compare.

    Returns: (match: bool, detail: str)
    """
    import re

    if not actual_output or not expected_output:
        return False, "Pas de sortie a comparer"

    actual = actual_output.strip()
    expected = expected_output.strip()

    # 1. Comparaison exacte (apres nettoyage espaces)
    if actual.lower() == expected.lower():
        return True, "Sortie correcte"

    # 2. Extraire tous les nombres des deux sorties
    actual_numbers = re.findall(r'-?\d+\.?\d*', actual)
    expected_numbers = re.findall(r'-?\d+\.?\d*', expected)

    if expected_numbers:
        if actual_numbers:
            # Comparer tous les nombres attendus avec les nombres produits
            # Chercher si tous les nombres attendus apparaissent dans la sortie
            matched_count = 0
            for exp_num in expected_numbers:
                # Normaliser: "24.0" == "24"
                exp_val = float(exp_num)
                for act_num in actual_numbers:
                    act_val = float(act_num)
                    if abs(exp_val - act_val) < 0.001:
                        matched_count += 1
                        break

            if matched_count == len(expected_numbers):
                return True, "Valeurs numeriques correctes"

            # Au moins le dernier nombre correspond
            if len(expected_numbers) >= 1 and len(actual_numbers) >= 1:
                exp_last = float(expected_numbers[-1])
                act_last = float(actual_numbers[-1])
                if abs(exp_last - act_last) < 0.001:
                    return True, "Resultat final correct"

            return False, f"Resultat incorrect: obtenu {actual_numbers[-1] if actual_numbers else 'rien'}, attendu {expected_numbers[-1]}"
        else:
            return False, f"Aucun resultat numerique produit. Attendu: {expected}"

    # 3. Comparaison textuelle flexible (pour les sorties texte)
    actual_clean = ' '.join(actual.lower().split())
    expected_clean = ' '.join(expected.lower().split())

    if expected_clean in actual_clean or actual_clean in expected_clean:
        return True, "Sortie textuelle correcte"

    return False, f"Sortie incorrecte. Attendu: {expected}"


def validate_exercise_code(code, exercise, failed_attempts=0):
    """
    Valide le code soumis pour un exercice.
    Scoring: Structure/mots-cles (25%) + Execution (75%)

    Args:
        code: Le code soumis par l'utilisateur
        exercise: L'exercice a valider
        failed_attempts: Nombre de tentatives echouees precedentes

    Comportement:
    - Score < 50%: Proposer de reessayer (jusqu'a 3 tentatives)
    - Score >= 50% OU 3 tentatives: Afficher la correction
    """
    from .pseudo_interpreter import validate_pseudo_code, PseudoInterpreter
    import re

    score = 0
    execution_errors = []

    # Verifier que le code n'est pas vide
    if not code or len(code.strip()) == 0:
        return False, "Le code soumis est vide.", 0

    # Verifier que le code est du pseudo-code (pas juste une reponse directe)
    code_lines = [line.strip() for line in code.split('\n') if line.strip()]
    code_upper = code.upper()

    # Si le code fait moins de 3 lignes et ne contient pas de mots-cles algorithmiques,
    # c'est probablement une reponse directe, pas du pseudo-code
    structure_keywords = ['ALGORITHME', 'DEBUT', 'FIN', 'VARIABLES', 'ENTIER', 'REEL', 'CHAINE',
                         'ECRIRE', 'LIRE', 'SI', 'POUR', 'TANT QUE', 'REPETER', 'BOOLEEN']
    structure_count = 0
    for kw in structure_keywords:
        if re.search(r'\b' + kw + r'\b', code_upper):
            structure_count += 1

    if len(code_lines) < 3 and structure_count < 2:
        return False, "Vous devez soumettre un algorithme en pseudo-code, pas une reponse directe.\n\nVotre code doit contenir au minimum: ALGORITHME, DEBUT, FIN, des declarations de variables, etc.", 0

    test_cases = exercise.test_cases or {}

    # ===== PARTIE 1: Validation de la structure (25% du score max) =====
    required_keywords = test_cases.get('required_keywords', [])
    forbidden_keywords = test_cases.get('forbidden_keywords', [])

    keyword_score = 0
    keyword_max = 25
    keyword_errors = []

    if required_keywords or forbidden_keywords:
        total_keywords = len(required_keywords) + len(forbidden_keywords)
        points_per_keyword = keyword_max / max(total_keywords, 1)

        for keyword in required_keywords:
            if keyword.lower() in code.lower():
                keyword_score += points_per_keyword
            else:
                keyword_errors.append(f"Mot-cle requis manquant: {keyword}")

        for keyword in forbidden_keywords:
            if keyword.lower() not in code.lower():
                keyword_score += points_per_keyword
            else:
                keyword_errors.append(f"Mot-cle interdit utilise: {keyword}")

        keyword_score = min(int(keyword_score), keyword_max)
    else:
        # Pas de mots-cles definis - verifier la structure de base
        has_minimum_length = len(code_lines) >= 3

        if structure_count >= 4 and has_minimum_length:
            keyword_score = keyword_max
        elif structure_count >= 3 and has_minimum_length:
            keyword_score = int(keyword_max * 0.75)
        elif structure_count >= 2 and has_minimum_length:
            keyword_score = int(keyword_max * 0.5)
        else:
            keyword_score = 0
            if not has_minimum_length:
                keyword_errors.append("Le code est trop court (minimum 3 lignes)")
            if structure_count < 2:
                keyword_errors.append("Structure algorithmique insuffisante (utilisez ALGORITHME, DEBUT, FIN, declarations, etc.)")

    score += keyword_score

    # ===== PARTIE 2: Execution du pseudo-code (75% du score max) =====
    execution_tests = test_cases.get('execution_tests', [])
    execution_max = 75

    if execution_tests:
        # --- Cas 1: Tests d'execution definis dans test_cases ---
        try:
            _, exec_score_percent, exec_feedback = validate_pseudo_code(code, execution_tests)
            execution_score = int((exec_score_percent / 100) * execution_max)
            score += execution_score

            for f in exec_feedback:
                if "ECHEC" in f.upper() or "attendu" in f.lower() or "incorrecte" in f.lower():
                    execution_errors.append(f)
        except Exception as e:
            execution_errors.append(f"Erreur lors de l'execution: {str(e)}")

    elif keyword_score > 0:
        # --- Cas 2: Pas de tests definis - execution generique ---
        try:
            interpreter = PseudoInterpreter()
            uses_lire = 'LIRE' in code_upper

            # Determiner les entrees de test
            if uses_lire:
                lire_count = len(re.findall(r'LIRE\s*\(', code_upper))
                test_inputs = ["10"] * lire_count
                success, output, error = interpreter.execute(code, test_inputs)
            else:
                success, output, error = interpreter.execute(code)

            if success:
                expected_output = exercise.expected_output
                has_output = output and output.strip()
                has_ecrire = 'ECRIRE' in code_upper

                if expected_output and expected_output.strip():
                    match, detail = compare_outputs(output, expected_output)

                    if match:
                        # Sortie correspond a l'attendu
                        score += execution_max
                    elif uses_lire and has_output and has_ecrire:
                        # Le code utilise LIRE: les entrees generiques ("10") ne correspondent
                        # probablement pas aux valeurs attendues. On donne credit pour:
                        # - Code qui s'execute sans erreur
                        # - Code qui produit une sortie avec ECRIRE
                        # - Code qui lit des entrees (logique interactive)
                        score += int(execution_max * 0.55)  # ~41 pts -> total ~66 avec structure
                    elif has_output:
                        # Pas de LIRE mais sortie incorrecte
                        score += int(execution_max * 0.15)
                        execution_errors.append(detail)
                    else:
                        execution_errors.append(detail)
                else:
                    # Pas de sortie attendue definie
                    if has_output and has_ecrire:
                        score += int(execution_max * 0.5)  # Credit partiel
                    elif not has_output:
                        execution_errors.append("Le code s'execute mais ne produit aucune sortie (utilisez ECRIRE)")
                    else:
                        score += int(execution_max * 0.15)
            else:
                if error:
                    execution_errors.append(f"Erreur d'execution: {error}")
                else:
                    execution_errors.append("Le code ne s'execute pas correctement")
        except Exception as e:
            execution_errors.append(f"Erreur: {str(e)}")
    else:
        # Structure insuffisante - pas d'execution
        execution_errors.extend(keyword_errors)

    score = min(score, 100)
    is_correct = score >= 50

    # ===== Construction du feedback =====
    feedback_text = ""

    if is_correct:
        feedback_text = f"{'='*40}\nEXERCICE REUSSI ! Score: {score}/100\n{'='*40}"

        solution_code = getattr(exercise, 'solution_code', None)
        if solution_code:
            feedback_text += f"\n\nCORRECTION - PSEUDO-CODE ATTENDU:\n\n{solution_code}"

        if exercise.expected_output:
            feedback_text += f"\n\nSORTIE ATTENDUE:\n{exercise.expected_output}"
    else:
        feedback_text = f"{'='*40}\nEXERCICE NON REUSSI - Score: {score}/100\n(Minimum requis: 50/100)\n{'='*40}"

        # Erreurs detectees
        all_errors = keyword_errors + execution_errors
        if all_errors:
            feedback_text += "\n\nERREURS DETECTEES:"
            for i, err in enumerate(all_errors, 1):
                clean_err = err.replace("ECHEC", "").strip()
                if clean_err:
                    feedback_text += f"\n  {i}. {clean_err}"

        if failed_attempts >= 2:
            # 3eme tentative: correction complete
            feedback_text += f"\n\n{'='*40}\nCORRECTION COMPLETE\n{'='*40}"

            solution_code = getattr(exercise, 'solution_code', None)
            if solution_code:
                feedback_text += f"\n\nPSEUDO-CODE DE LA SOLUTION:\n\n{solution_code}"

            if exercise.expected_output:
                feedback_text += f"\n\nSORTIE ATTENDUE:\n{exercise.expected_output}"

            if exercise.hints:
                feedback_text += f"\n\nINDICES:\n{exercise.hints}"
        else:
            remaining = 2 - failed_attempts
            feedback_text += f"\n\n>>> REESSAYEZ ! (Tentative {failed_attempts + 1}/3) <<<"
            feedback_text += f"\n\nEncore {remaining} tentative(s) avant d'obtenir la correction."

            if failed_attempts == 0:
                feedback_text += "\n\nConseils:"
                feedback_text += "\n- Relisez attentivement l'enonce de l'exercice"
                feedback_text += "\n- Verifiez la syntaxe de votre pseudo-code"
                if exercise.hints:
                    feedback_text += f"\n- Indice: {exercise.hints}"
            else:
                feedback_text += "\n\nConseils supplementaires:"
                feedback_text += "\n- Verifiez que vous utilisez les bonnes variables"
                feedback_text += "\n- Assurez-vous d'afficher le bon resultat avec ECRIRE"
                if exercise.hints:
                    feedback_text += f"\n- Indice: {exercise.hints}"

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_interpreter(request):
    """Exécuter du pseudo-code via l'interpréteur"""
    from .pseudo_interpreter import PseudoInterpreter

    code = request.data.get('code', '')
    inputs = request.data.get('inputs', [])

    if not code or not code.strip():
        return Response({
            'success': False,
            'output': '',
            'error': 'Le code est vide.',
            'variables': {}
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        interpreter = PseudoInterpreter()
        success, output, error = interpreter.execute(code, inputs)

        # Récupérer les variables après exécution
        variables = {}
        for name, value in interpreter.variables.items():
            var_type = interpreter.variable_types.get(name, 'inconnu')
            variables[name] = {
                'value': str(value),
                'type': var_type
            }

        return Response({
            'success': success,
            'output': output or '',
            'error': error or '',
            'variables': variables
        })
    except Exception as e:
        return Response({
            'success': False,
            'output': '',
            'error': f'Erreur interne: {str(e)}',
            'variables': {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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