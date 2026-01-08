from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Module, Lesson, Quiz, QuizQuestion, QuizChoice, Exercise, QuizAttempt, ExerciseSubmission
from .serializers import ModuleSerializer, LessonSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def module_list_create(request):
    """Liste tous les modules ou crée un nouveau module (admin seulement)"""
    if request.method == 'GET':
        modules = Module.objects.all()
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ModuleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def module_detail(request, pk):
    """Récupère, modifie ou supprime un module (admin seulement)"""
    try:
        module = Module.objects.get(pk=pk)
    except Module.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ModuleSerializer(module)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ModuleSerializer(module, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        module.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def lesson_list_create(request):
    """Liste toutes les leçons ou crée une nouvelle leçon (admin seulement)"""
    if request.method == 'GET':
        lessons = Lesson.objects.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def lesson_detail(request, pk):
    """Récupère, modifie ou supprime une leçon (admin seulement)"""
    try:
        lesson = Lesson.objects.get(pk=pk)
    except Lesson.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)

    elif request.method == 'PUT':
        print("=== DEBUG: Lesson Update ===")
        print(f"Lesson ID: {pk}")
        print(f"Request data: {request.data}")
        serializer = LessonSerializer(lesson, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        lesson.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def quiz_list_create(request):
    """Liste tous les quiz ou crée un nouveau quiz (admin seulement)"""
    if request.method == 'GET':
        quizzes = Quiz.objects.all().select_related('lesson')
        quizzes_data = []
        
        for quiz in quizzes:
            quizzes_data.append({
                'id': quiz.id,
                'title': quiz.title,
                'lesson': quiz.lesson.id,
                'lesson_title': quiz.lesson.title,
                'passing_score': quiz.passing_score,
                'questions_count': quiz.questions.count()
            })
        
        return Response(quizzes_data)
    
    elif request.method == 'POST':
        # Créer le quiz avec ses questions et choix
        data = request.data
        
        # Déterminer l'ordre du quiz
        existing_quizzes = Quiz.objects.filter(lesson_id=data['lesson'])
        next_order = existing_quizzes.count() + 1
        
        quiz = Quiz.objects.create(
            lesson_id=data['lesson'],
            title=data['title'],
            passing_score=data.get('passing_score', 50),
            order=next_order
        )
        
        # Créer les questions
        for q_data in data.get('questions', []):
            question = QuizQuestion.objects.create(
                quiz=quiz,
                question_text=q_data['question_text'],
                question_type=q_data['question_type'],
                points=q_data.get('points', 20),
                order=q_data.get('order', 1),
                explanation=q_data.get('explanation', '')
            )
            
            # Créer les choix
            for c_index, c_data in enumerate(q_data.get('choices', [])):
                QuizChoice.objects.create(
                    question=question,
                    choice_text=c_data['choice_text'],
                    is_correct=c_data.get('is_correct', False),
                    order=c_index + 1
                )
        
        return Response({'id': quiz.id, 'message': 'Quiz créé avec succès'}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def quiz_detail(request, pk):
    """Récupère, modifie ou supprime un quiz (admin seulement)"""
    try:
        quiz = Quiz.objects.get(pk=pk)
    except Quiz.DoesNotExist:
        return Response({'error': 'Quiz non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        questions = []
        for q in quiz.questions.all():
            choices = [
                {'id': c.id, 'choice_text': c.choice_text, 'is_correct': c.is_correct}
                for c in q.choices.all()
            ]
            questions.append({
                'id': q.id,
                'question_text': q.question_text,
                'question_type': q.question_type,
                'points': q.points,
                'explanation': q.explanation,
                'choices': choices
            })
        
        return Response({
            'id': quiz.id,
            'lesson': quiz.lesson.id,
            'title': quiz.title,
            'passing_score': quiz.passing_score,
            'questions': questions
        })
    
    elif request.method == 'PUT':
        data = request.data

        # Mettre à jour le quiz
        quiz.title = data.get('title', quiz.title)
        quiz.passing_score = data.get('passing_score', quiz.passing_score)
        quiz.lesson_id = data.get('lesson', quiz.lesson_id)
        quiz.save()

        # Supprimer les anciennes questions
        quiz.questions.all().delete()

        # Créer les nouvelles questions
        for q_data in data.get('questions', []):
            question = QuizQuestion.objects.create(
                quiz=quiz,
                question_text=q_data['question_text'],
                question_type=q_data['question_type'],
                points=q_data.get('points', 20),
                order=q_data.get('order', 1),
                explanation=q_data.get('explanation', '')
            )

            # Créer les choix
            for c_index, c_data in enumerate(q_data.get('choices', [])):
                QuizChoice.objects.create(
                    question=question,
                    choice_text=c_data['choice_text'],
                    is_correct=c_data.get('is_correct', False),
                    order=c_index + 1
                )

        return Response({'message': 'Quiz mis à jour avec succès'})
    
    elif request.method == 'DELETE':
        quiz.delete()
        return Response({'message': 'Quiz supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
 


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def exercise_list_create(request):
    """Liste tous les exercices ou crée un nouvel exercice (admin seulement)"""
    if request.method == 'GET':
        exercises = Exercise.objects.all().select_related('lesson')
        exercises_data = []
        
        for exercise in exercises:
            exercises_data.append({
                'id': exercise.id,
                'title': exercise.title,
                'lesson': exercise.lesson.id,
                'lesson_title': exercise.lesson.title,
                'difficulty': exercise.difficulty,
                'points': exercise.points
            })
        
        return Response(exercises_data)
    
    elif request.method == 'POST':
        data = request.data
        
        # Déterminer l'ordre de l'exercice
        existing_exercises = Exercise.objects.filter(lesson_id=data['lesson'])
        next_order = existing_exercises.count() + 1
        
        exercise = Exercise.objects.create(
            lesson_id=data['lesson'],
            title=data['title'],
            description=data['description'],
            problem_statement=data['problem_statement'],
            expected_output=data.get('expected_output', ''),
            hints=data.get('hints', ''),
            difficulty=data.get('difficulty', 'beginner'),
            points=data.get('points', 100),
            order=next_order,
            test_cases={
                'required_keywords': data.get('required_keywords', []),
                'forbidden_keywords': data.get('forbidden_keywords', [])
            }
        )
        
        return Response({'id': exercise.id, 'message': 'Exercice créé avec succès'}, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def exercise_detail(request, pk):
    """Récupère, modifie ou supprime un exercice (admin seulement)"""
    try:
        exercise = Exercise.objects.get(pk=pk)
    except Exercise.DoesNotExist:
        return Response({'error': 'Exercice non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response({
            'id': exercise.id,
            'lesson': exercise.lesson.id,
            'title': exercise.title,
            'description': exercise.description,
            'problem_statement': exercise.problem_statement,
            'hints': exercise.hints,
            'difficulty': exercise.difficulty,
            'points': exercise.points,
            'required_keywords': exercise.test_cases.get('required_keywords', []),
            'forbidden_keywords': exercise.test_cases.get('forbidden_keywords', [])
        })
    
    elif request.method == 'PUT':
        data = request.data
        exercise.title = data.get('title', exercise.title)
        exercise.description = data.get('description', exercise.description)
        exercise.problem_statement = data.get('problem_statement', exercise.problem_statement)
        exercise.hints = data.get('hints', exercise.hints)
        exercise.difficulty = data.get('difficulty', exercise.difficulty)
        exercise.points = data.get('points', exercise.points)
        exercise.test_cases = {
            'required_keywords': data.get('required_keywords', []),
            'forbidden_keywords': data.get('forbidden_keywords', [])
        }
        exercise.save()
        
        return Response({'message': 'Exercice mis à jour avec succès'})
    
    elif request.method == 'DELETE':
        exercise.delete()
        return Response({'message': 'Exercice supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)


    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_lessons_list(request):
    """Liste toutes les leçons (admin seulement)"""
    lessons = Lesson.objects.all().select_related('module').order_by('module__order', 'order')
    
    lessons_data = []
    for lesson in lessons:
        lessons_data.append({
            'id': lesson.id,
            'title': lesson.title,
            'module_id': lesson.module.id,
            'module_title': lesson.module.title,
            'module_order': lesson.module.order,
            'order': lesson.order
        })
    
    return Response(lessons_data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    """Statistiques globales pour l'admin"""
    from django.contrib.auth.models import User
    
    # Nombre total d'utilisateurs
    total_users = User.objects.count()
    
    # Nombre de modules
    total_modules = Module.objects.count()
    
    # Nombre de leçons
    total_lessons = Lesson.objects.count()
    
    # Nombre de quiz
    total_quizzes = Quiz.objects.count()
    
    # Nombre d'exercices
    total_exercises = Exercise.objects.count()
    
    # Activité récente (tous les utilisateurs)
    recent_quiz_attempts = QuizAttempt.objects.all().order_by('-completed_at')[:10]
    recent_exercise_submissions = ExerciseSubmission.objects.all().order_by('-submitted_at')[:10]
    
    recent_activities = []
    
    for attempt in recent_quiz_attempts:
        recent_activities.append({
            'type': 'quiz',
            'user': attempt.user.username,
            'title': attempt.quiz.title,
            'lesson': attempt.quiz.lesson.title,
            'score': attempt.percentage,
            'date': attempt.completed_at.isoformat()
        })
    
    for submission in recent_exercise_submissions:
        recent_activities.append({
            'type': 'exercise',
            'user': submission.user.username,
            'title': submission.exercise.title,
            'lesson': submission.exercise.lesson.title,
            'score': submission.score,
            'date': submission.submitted_at.isoformat()
        })
    
    # Trier par date
    recent_activities.sort(key=lambda x: x['date'], reverse=True)
    recent_activities = recent_activities[:20]
    
    return Response({
        'total_users': total_users,
        'total_modules': total_modules,
        'total_lessons': total_lessons,
        'total_quizzes': total_quizzes,
        'total_exercises': total_exercises,
        'recent_activities': recent_activities
    })
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    """Statistiques globales pour l'admin"""
    from django.contrib.auth.models import User
    
    # Nombre total d'utilisateurs
    total_users = User.objects.count()
    
    # Nombre de modules
    total_modules = Module.objects.count()
    
    # Nombre de leçons
    total_lessons = Lesson.objects.count()
    
    # Nombre de quiz
    total_quizzes = Quiz.objects.count()
    
    # Nombre d'exercices
    total_exercises = Exercise.objects.count()
    
    # Activité récente (tous les utilisateurs)
    recent_quiz_attempts = QuizAttempt.objects.all().order_by('-completed_at')[:10]
    recent_exercise_submissions = ExerciseSubmission.objects.all().order_by('-submitted_at')[:10]
    
    recent_activities = []
    
    for attempt in recent_quiz_attempts:
        recent_activities.append({
            'type': 'quiz',
            'user': attempt.user.username,
            'title': attempt.quiz.title,
            'lesson': attempt.quiz.lesson.title,
            'score': attempt.percentage,
            'date': attempt.completed_at.isoformat()
        })
    
    for submission in recent_exercise_submissions:
        recent_activities.append({
            'type': 'exercise',
            'user': submission.user.username,
            'title': submission.exercise.title,
            'lesson': submission.exercise.lesson.title,
            'score': submission.score,
            'date': submission.submitted_at.isoformat()
        })
    
    # Trier par date
    recent_activities.sort(key=lambda x: x['date'], reverse=True)
    recent_activities = recent_activities[:20]
    
    return Response({
        'total_users': total_users,
        'total_modules': total_modules,
        'total_lessons': total_lessons,
        'total_quizzes': total_quizzes,
        'total_exercises': total_exercises,
        'recent_activities': recent_activities
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def users_stats_list(request):
    """Liste tous les utilisateurs avec leurs statistiques globales"""
    from django.contrib.auth.models import User
    from django.db.models import Avg, Max
    from .models import UserProgress, LessonProgress, QuizAttempt, ExerciseSubmission

    users = User.objects.all().order_by('username')
    users_stats = []

    for user in users:
        # Progression des modules
        total_modules = Module.objects.count()
        user_progress = UserProgress.objects.filter(user=user)
        modules_unlocked = user_progress.filter(is_unlocked=True).count()
        modules_completed = user_progress.filter(is_completed=True).count()

        # Progression des leçons
        total_lessons = Lesson.objects.count()
        lesson_progress = LessonProgress.objects.filter(user=user)
        lessons_completed = lesson_progress.filter(is_completed=True).count()

        # Scores moyens
        avg_quiz = lesson_progress.aggregate(Avg('quiz_score'))['quiz_score__avg'] or 0
        avg_exercise = lesson_progress.aggregate(Avg('exercise_score'))['exercise_score__avg'] or 0
        avg_combined = lesson_progress.aggregate(Avg('combined_score'))['combined_score__avg'] or 0

        # Nombre de tentatives
        quiz_attempts = QuizAttempt.objects.filter(user=user).count()
        exercise_submissions = ExerciseSubmission.objects.filter(user=user).count()

        # Dernière activité
        last_quiz = QuizAttempt.objects.filter(user=user).aggregate(Max('completed_at'))['completed_at__max']
        last_exercise = ExerciseSubmission.objects.filter(user=user).aggregate(Max('submitted_at'))['submitted_at__max']

        last_activity = None
        if last_quiz and last_exercise:
            last_activity = max(last_quiz, last_exercise)
        elif last_quiz:
            last_activity = last_quiz
        elif last_exercise:
            last_activity = last_exercise

        # Calculer le pourcentage de progression global
        total_progress = 0
        if total_lessons > 0:
            total_progress = (lessons_completed / total_lessons) * 100

        users_stats.append({
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'date_joined': user.date_joined.isoformat(),
            'total_progress': round(total_progress, 1),
            'modules_unlocked': modules_unlocked,
            'modules_completed': modules_completed,
            'modules_total': total_modules,
            'lessons_completed': lessons_completed,
            'lessons_total': total_lessons,
            'average_quiz_score': round(avg_quiz, 1),
            'average_exercise_score': round(avg_exercise, 1),
            'average_combined_score': round(avg_combined, 1),
            'quiz_attempts': quiz_attempts,
            'exercise_submissions': exercise_submissions,
            'last_activity': last_activity.isoformat() if last_activity else None
        })

    return Response(users_stats)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_detailed_stats(request, user_id):
    """Statistiques détaillées d'un utilisateur spécifique"""
    from django.contrib.auth.models import User
    from .models import UserProgress, LessonProgress, QuizAttempt, ExerciseSubmission

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'error': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)

    # Informations utilisateur
    user_info = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'date_joined': user.date_joined.isoformat(),
        'last_login': user.last_login.isoformat() if user.last_login else None
    }

    # Progression par module
    modules = Module.objects.all().order_by('order')
    module_progress = []

    for module in modules:
        user_mod_progress = UserProgress.objects.filter(user=user, module=module).first()

        # Leçons du module
        lessons = Lesson.objects.filter(module=module).order_by('order')
        lessons_data = []

        for lesson in lessons:
            lesson_prog = LessonProgress.objects.filter(user=user, lesson=lesson).first()

            # Nombre de tentatives
            quiz_attempts_count = 0
            exercise_attempts_count = 0

            lesson_quiz = lesson.quizzes.first()
            lesson_exercise = lesson.exercises.first()

            if lesson_quiz:
                quiz_attempts_count = QuizAttempt.objects.filter(user=user, quiz=lesson_quiz).count()

            if lesson_exercise:
                exercise_attempts_count = ExerciseSubmission.objects.filter(user=user, exercise=lesson_exercise).count()

            lessons_data.append({
                'lesson_id': lesson.id,
                'title': lesson.title,
                'order': lesson.order,
                'quiz_score': lesson_prog.quiz_score if lesson_prog else 0,
                'exercise_score': lesson_prog.exercise_score if lesson_prog else 0,
                'combined_score': lesson_prog.combined_score if lesson_prog else 0,
                'is_completed': lesson_prog.is_completed if lesson_prog else False,
                'completion_date': lesson_prog.completion_date.isoformat() if lesson_prog and lesson_prog.completion_date else None,
                'quiz_attempts': quiz_attempts_count,
                'exercise_attempts': exercise_attempts_count,
                'has_quiz': lesson_quiz is not None,
                'has_exercise': lesson_exercise is not None
            })

        module_progress.append({
            'module_id': module.id,
            'title': module.title,
            'order': module.order,
            'is_unlocked': user_mod_progress.is_unlocked if user_mod_progress else False,
            'is_completed': user_mod_progress.is_completed if user_mod_progress else False,
            'completion_date': user_mod_progress.completion_date.isoformat() if user_mod_progress and user_mod_progress.completion_date else None,
            'lessons': lessons_data
        })

    # Timeline d'activité (dernières 50 activités)
    activity_timeline = []

    # Quiz attempts
    quiz_attempts = QuizAttempt.objects.filter(user=user).select_related('quiz', 'quiz__lesson').order_by('-completed_at')[:25]
    for attempt in quiz_attempts:
        activity_timeline.append({
            'type': 'quiz',
            'lesson_title': attempt.quiz.lesson.title if attempt.quiz.lesson else 'Quiz sans leçon',
            'module_title': attempt.quiz.lesson.module.title if attempt.quiz.lesson else 'Module inconnu',
            'score': attempt.score,
            'total_points': attempt.total_points,
            'percentage': attempt.percentage,
            'date': attempt.completed_at.isoformat()
        })

    # Exercise submissions
    exercise_subs = ExerciseSubmission.objects.filter(user=user).select_related('exercise', 'exercise__lesson').order_by('-submitted_at')[:25]
    for submission in exercise_subs:
        activity_timeline.append({
            'type': 'exercise',
            'lesson_title': submission.exercise.lesson.title if submission.exercise.lesson else 'Exercice sans leçon',
            'module_title': submission.exercise.lesson.module.title if submission.exercise.lesson else 'Module inconnu',
            'is_correct': submission.is_correct,
            'score': submission.score,
            'date': submission.submitted_at.isoformat()
        })

    # Trier par date
    activity_timeline.sort(key=lambda x: x['date'], reverse=True)
    activity_timeline = activity_timeline[:50]

    return Response({
        'user_info': user_info,
        'module_progress': module_progress,
        'activity_timeline': activity_timeline
    })

