import os
import sys
import django

# Ajouter le répertoire backend au path
sys.path.insert(0, r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Quiz, Exercise, UserProgress, LessonProgress, User

print("=== VERIFICATION DU SYSTEME DE DEBLOCAGE ===\n")

# Récupérer le premier utilisateur
user = User.objects.first()
print(f"Utilisateur: {user.username}\n")

# Vérifier le Module 1
module1 = Module.objects.get(order=1)
print(f"Module 1: {module1.title}")
print(f"Ordre: {module1.order}")
lessons = module1.lessons.all()
print(f"Nombre de lecons: {lessons.count()}\n")

for lesson in lessons:
    print(f"  Lecon {lesson.order}: {lesson.title}")
    quiz = Quiz.objects.filter(lesson=lesson).first()
    exercise = Exercise.objects.filter(lesson=lesson).first()
    print(f"    - Quiz: {'Oui' if quiz else 'Non'}")
    print(f"    - Exercise: {'Oui' if exercise else 'Non'}")

    # Vérifier la progression
    lesson_progress = LessonProgress.objects.filter(user=user, lesson=lesson).first()
    if lesson_progress:
        print(f"    - Progression:")
        print(f"      Quiz Score: {lesson_progress.quiz_score}")
        print(f"      Exercise Score: {lesson_progress.exercise_score}")
        print(f"      Combined Score: {lesson_progress.combined_score}")
        print(f"      Completed: {lesson_progress.is_completed}")
    else:
        print(f"    - Aucune progression enregistree")
    print()

# Vérifier la progression du module
print("\n=== PROGRESSION DES MODULES ===")
all_progress = UserProgress.objects.filter(user=user).order_by('module__order')
for progress in all_progress:
    print(f"Module {progress.module.order} ({progress.module.title}):")
    print(f"  - Unlocked: {progress.is_unlocked}")
    print(f"  - Completed: {progress.is_completed}")
    print()

# Tester la fonction check_module_completion
print("\n=== TEST DE LA FONCTION check_module_completion ===")
from courses.views import check_module_completion

completed_lessons = LessonProgress.objects.filter(
    user=user,
    lesson__in=lessons,
    is_completed=True
).count()

print(f"Lecons completees dans Module 1: {completed_lessons}/{lessons.count()}")

if completed_lessons == lessons.count():
    print("Toutes les lecons sont completees. Appel de check_module_completion...")
    check_module_completion(user, module1)
    print("Fonction executee. Verification du resultat...")

    # Recharger la progression
    module1_progress = UserProgress.objects.get(user=user, module=module1)
    print(f"Module 1 - Completed: {module1_progress.is_completed}")

    module2 = Module.objects.filter(order=2).first()
    if module2:
        module2_progress = UserProgress.objects.filter(user=user, module=module2).first()
        if module2_progress:
            print(f"Module 2 - Unlocked: {module2_progress.is_unlocked}")
        else:
            print("Module 2 - Aucune progression creee")
else:
    print(f"Il reste {lessons.count() - completed_lessons} lecon(s) a completer")
