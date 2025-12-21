import os
import sys
import django
import requests
import json

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Ajouter le répertoire backend au path
sys.path.insert(0, r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Quiz, Exercise, QuizQuestion, QuizChoice, User
from django.contrib.auth import get_user_model

print("=== TEST DE SOUMISSION DE QUIZ ET EXERCICE ===\n")

# Récupérer l'utilisateur
user = User.objects.filter(username='olivenossupuwo').first()
if not user:
    print("❌ Utilisateur 'olivenossupuwo' non trouvé")
    sys.exit(1)

print(f"✅ Utilisateur trouvé: {user.username}\n")

# Récupérer la leçon du Module 1
module1 = Module.objects.get(order=1)
lesson = module1.lessons.first()

print(f"Module 1: {module1.title}")
print(f"Leçon: {lesson.title}\n")

# Vérifier le quiz
quiz = Quiz.objects.filter(lesson=lesson).first()
if quiz:
    print(f"✅ Quiz trouvé: {quiz.title}")
    print(f"   ID: {quiz.id}")
    print(f"   Passing Score: {quiz.passing_score}%\n")

    # Afficher les questions
    questions = quiz.questions.all()
    print(f"   Questions ({questions.count()}):")
    for q in questions:
        print(f"   - Q{q.order}: {q.question_text} (Type: {q.question_type}, Points: {q.points})")
        choices = q.choices.all()
        for c in choices:
            is_correct = "✓" if c.is_correct else " "
            print(f"     [{is_correct}] {c.choice_text}")
        print()
else:
    print("❌ Aucun quiz trouvé pour cette leçon\n")

# Vérifier l'exercice
exercise = Exercise.objects.filter(lesson=lesson).first()
if exercise:
    print(f"✅ Exercice trouvé: {exercise.title}")
    print(f"   ID: {exercise.id}")
    print(f"   Points: {exercise.points}")
    print(f"   Difficulté: {exercise.difficulty}\n")
else:
    print("❌ Aucun exercice trouvé pour cette leçon\n")

# Créer des réponses de test pour le quiz (toutes correctes)
if quiz:
    print("\n=== PRÉPARATION DE RÉPONSES DE TEST ===")
    test_answers = {}
    for question in quiz.questions.all():
        correct_choices = question.choices.filter(is_correct=True)
        if correct_choices.exists():
            if question.question_type == 'multiple':
                test_answers[question.id] = [c.id for c in correct_choices]
            else:
                test_answers[question.id] = [correct_choices.first().id]

    print(f"Réponses de test (toutes correctes): {test_answers}")

    # Instructions pour tester via l'API
    print("\n=== INSTRUCTIONS POUR TESTER L'API ===")
    print("1. Le backend doit être démarré (python manage.py runserver)")
    print("2. Vous devez être connecté et avoir un token JWT")
    print(f"3. Endpoint: POST http://localhost:8000/api/quiz/submit/")
    print(f"4. Body JSON:")
    print(json.dumps({
        "quiz_id": quiz.id,
        "answers": test_answers
    }, indent=2))
    print()

if exercise:
    print("\n=== CODE DE TEST POUR L'EXERCICE ===")
    print(f"1. Endpoint: POST http://localhost:8000/api/exercise/submit/")
    print(f"2. Body JSON:")
    test_code = """DEBUT
    AFFICHER "Bonjour le monde"
FIN"""
    print(json.dumps({
        "exercise_id": exercise.id,
        "code": test_code
    }, indent=2))
    print()

print("\n=== VÉRIFICATION DES ENDPOINTS BACKEND ===")
print("Vérifiez que le serveur Django est démarré:")
print("  cd LearnAlgorithmic/backend")
print("  python manage.py runserver")
print("\nConsultez les logs du serveur pour voir si les requêtes arrivent.")
