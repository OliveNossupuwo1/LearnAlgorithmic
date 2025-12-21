import os
import sys
import django

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Ajouter le répertoire backend au path
sys.path.insert(0, r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Quiz, Exercise, UserProgress, LessonProgress, User
from django.utils import timezone
from courses.views import check_module_completion

print("=== CORRECTION DE LA PROGRESSION ===\n")

# Récupérer l'utilisateur
user = User.objects.filter(username='olivenossupuwo').first()
if not user:
    print("❌ Utilisateur 'olivenossupuwo' non trouvé")
    sys.exit(1)

print(f"✅ Utilisateur: {user.username}\n")

# Récupérer la leçon du Module 1
module1 = Module.objects.get(order=1)
lesson = module1.lessons.first()

print(f"Module 1: {module1.title}")
print(f"Leçon: {lesson.title}\n")

# Créer ou mettre à jour la progression de la leçon avec vos scores
lesson_progress, created = LessonProgress.objects.get_or_create(
    user=user,
    lesson=lesson
)

print(f"LessonProgress {'créé' if created else 'trouvé'}")
print(f"Scores actuels: Quiz={lesson_progress.quiz_score}%, Exercise={lesson_progress.exercise_score}%, Combined={lesson_progress.combined_score}%\n")

# Mettre à jour avec vos scores
lesson_progress.quiz_score = 100
lesson_progress.exercise_score = 77
lesson_progress.calculate_combined_score()  # Calcule (100 + 77) / 2 = 88.5%

print(f"Nouveaux scores: Quiz={lesson_progress.quiz_score}%, Exercise={lesson_progress.exercise_score}%, Combined={lesson_progress.combined_score}%\n")

# Marquer comme complété si score >= 50
if lesson_progress.combined_score >= 50 and not lesson_progress.is_completed:
    lesson_progress.is_completed = True
    lesson_progress.completion_date = timezone.now()
    print(f"✅ Leçon marquée comme complétée!\n")

lesson_progress.save()
print("✅ Progression sauvegardée\n")

# Vérifier la completion du module
print("=== VÉRIFICATION DE LA COMPLETION DU MODULE ===\n")
check_module_completion(user, module1)

# Vérifier le résultat
print("\n=== RÉSULTAT FINAL ===\n")

module1_progress = UserProgress.objects.get(user=user, module=module1)
print(f"Module 1:")
print(f"  - Completed: {module1_progress.is_completed}")
print(f"  - Completion Date: {module1_progress.completion_date}\n")

module2 = Module.objects.filter(order=2).first()
if module2:
    module2_progress = UserProgress.objects.filter(user=user, module=module2).first()
    if module2_progress:
        print(f"Module 2 ({module2.title}):")
        print(f"  - Unlocked: {module2_progress.is_unlocked}")
        print(f"  - Completed: {module2_progress.is_completed}")
    else:
        print("❌ Aucune progression créée pour le Module 2")

print("\n✅ Correction terminée! Actualisez la page dans votre navigateur.")
