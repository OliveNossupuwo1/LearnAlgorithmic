"""
Script de test pour vérifier la création et modification de leçons et quiz
"""

import os
import sys
import django
import json

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Concept, Example, Simulation, Quiz, QuizQuestion, QuizChoice
from courses.serializers import LessonSerializer

def test_lesson_serializer():
    """Teste la création et mise à jour d'une leçon via le serializer"""

    print("\n" + "="*60)
    print("TEST 1: Création d'une leçon avec nested objects")
    print("="*60)

    # Obtenir le premier module
    module = Module.objects.first()
    if not module:
        print("❌ Aucun module trouvé dans la base de données")
        return

    # Données de test pour créer une leçon
    lesson_data = {
        'module': module.id,
        'title': 'Test Lesson CRUD',
        'description': 'Test de création et modification',
        'order': 999,
        'video_url': '',
        'video_embed_code': '',
        'concepts': [
            {
                'title': 'Concept 1',
                'definition': 'Définition du concept 1',
                'syntax': 'syntax1',
                'order': 1
            },
            {
                'title': 'Concept 2',
                'definition': 'Définition du concept 2',
                'syntax': 'syntax2',
                'order': 2
            }
        ],
        'examples': [
            {
                'title': 'Example 1',
                'description': 'Description example 1',
                'code': 'code1',
                'explanation': 'explication1',
                'order': 1
            }
        ],
        'simulations': []
    }

    # Créer la leçon
    serializer = LessonSerializer(data=lesson_data)
    if serializer.is_valid():
        lesson = serializer.save()
        print(f"✅ Leçon créée avec succès: {lesson.title} (ID: {lesson.id})")
        print(f"   - Concepts: {lesson.concepts.count()}")
        print(f"   - Examples: {lesson.examples.count()}")
        print(f"   - Simulations: {lesson.simulations.count()}")
    else:
        print(f"❌ Erreur de création: {serializer.errors}")
        return None

    print("\n" + "="*60)
    print("TEST 2: Modification de la leçon")
    print("="*60)

    # Modifier la leçon
    update_data = {
        'title': 'Test Lesson CRUD - MODIFIÉ',
        'description': 'Description modifiée',
        'concepts': [
            {
                'title': 'Concept Modifié',
                'definition': 'Définition modifiée',
                'syntax': 'syntax_modified',
                'order': 1
            }
        ],
        'examples': [
            {
                'title': 'Example Modifié',
                'description': 'Description modifiée',
                'code': 'code_modified',
                'explanation': 'explication modifiée',
                'order': 1
            },
            {
                'title': 'Example 2 - Nouveau',
                'description': 'Nouvel exemple ajouté',
                'code': 'code2',
                'explanation': 'explication2',
                'order': 2
            }
        ]
    }

    serializer = LessonSerializer(lesson, data=update_data, partial=True)
    if serializer.is_valid():
        lesson = serializer.save()
        print(f"✅ Leçon modifiée avec succès: {lesson.title}")
        print(f"   - Concepts: {lesson.concepts.count()}")
        print(f"   - Examples: {lesson.examples.count()}")

        # Afficher les détails
        for concept in lesson.concepts.all():
            print(f"     * Concept: {concept.title}")
        for example in lesson.examples.all():
            print(f"     * Example: {example.title}")
    else:
        print(f"❌ Erreur de modification: {serializer.errors}")
        return None

    print("\n" + "="*60)
    print("TEST 3: Suppression de la leçon de test")
    print("="*60)

    lesson.delete()
    print(f"✅ Leçon supprimée avec succès")

    return True

def test_quiz_crud():
    """Teste la création et modification d'un quiz"""

    print("\n" + "="*60)
    print("TEST 4: Création d'un quiz")
    print("="*60)

    # Obtenir la première leçon
    lesson = Lesson.objects.first()
    if not lesson:
        print("❌ Aucune leçon trouvée dans la base de données")
        return

    # Créer un quiz
    quiz = Quiz.objects.create(
        lesson=lesson,
        title='Test Quiz CRUD',
        passing_score=60,
        order=999
    )

    # Créer une question
    question = QuizQuestion.objects.create(
        quiz=quiz,
        question_text='Question de test?',
        question_type='single',
        points=20,
        order=1,
        explanation='Explication de test'
    )

    # Créer des choix
    QuizChoice.objects.create(
        question=question,
        choice_text='Choix A',
        is_correct=True,
        order=1
    )
    QuizChoice.objects.create(
        question=question,
        choice_text='Choix B',
        is_correct=False,
        order=2
    )

    print(f"✅ Quiz créé avec succès: {quiz.title} (ID: {quiz.id})")
    print(f"   - Questions: {quiz.questions.count()}")
    print(f"   - Choix total: {sum(q.choices.count() for q in quiz.questions.all())}")

    print("\n" + "="*60)
    print("TEST 5: Modification du quiz")
    print("="*60)

    # Modifier le quiz
    quiz.title = 'Test Quiz CRUD - MODIFIÉ'
    quiz.passing_score = 70
    quiz.save()

    # Supprimer les anciennes questions
    quiz.questions.all().delete()

    # Créer de nouvelles questions
    question1 = QuizQuestion.objects.create(
        quiz=quiz,
        question_text='Question modifiée 1?',
        question_type='single',
        points=25,
        order=1,
        explanation='Explication modifiée 1'
    )

    QuizChoice.objects.create(
        question=question1,
        choice_text='Nouveau choix A',
        is_correct=False,
        order=1
    )
    QuizChoice.objects.create(
        question=question1,
        choice_text='Nouveau choix B',
        is_correct=True,
        order=2
    )

    # Créer une 2ème question
    question2 = QuizQuestion.objects.create(
        quiz=quiz,
        question_text='Question ajoutée 2?',
        question_type='multiple',
        points=30,
        order=2,
        explanation='Explication 2'
    )

    QuizChoice.objects.create(
        question=question2,
        choice_text='Option 1',
        is_correct=True,
        order=1
    )
    QuizChoice.objects.create(
        question=question2,
        choice_text='Option 2',
        is_correct=True,
        order=2
    )

    print(f"✅ Quiz modifié avec succès: {quiz.title}")
    print(f"   - Questions: {quiz.questions.count()}")
    print(f"   - Choix total: {sum(q.choices.count() for q in quiz.questions.all())}")

    # Afficher les détails
    for question in quiz.questions.all():
        print(f"     * Question: {question.question_text} ({question.choices.count()} choix)")

    print("\n" + "="*60)
    print("TEST 6: Suppression du quiz de test")
    print("="*60)

    quiz.delete()
    print(f"✅ Quiz supprimé avec succès")

    return True

if __name__ == "__main__":
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n🧪 TESTS DE CRÉATION ET MODIFICATION DE LEÇONS ET QUIZ")
    print("="*60)

    # Tester les leçons
    result1 = test_lesson_serializer()

    # Tester les quiz
    result2 = test_quiz_crud()

    print("\n" + "="*60)
    print("RÉSUMÉ DES TESTS")
    print("="*60)

    if result1 and result2:
        print("✅ Tous les tests ont réussi!")
        print("\n👉 La création et modification de leçons et quiz fonctionnent correctement.")
    else:
        print("❌ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")
