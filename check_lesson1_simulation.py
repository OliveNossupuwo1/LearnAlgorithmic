"""
Script pour vérifier les simulations de la leçon 1 du module 1
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation

def check_simulations():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("VÉRIFICATION DES SIMULATIONS - MODULE 1, LEÇON 1")
    print("="*60)

    # Trouver le module 1
    try:
        module1 = Module.objects.get(order=1)
        print(f"\n✅ Module 1 trouvé: {module1.title}")
    except Module.DoesNotExist:
        print("\n❌ Module 1 non trouvé")
        return

    # Trouver la leçon 1 du module 1
    try:
        lesson1 = Lesson.objects.get(module=module1, order=1)
        print(f"✅ Leçon 1 trouvée: {lesson1.title}")
    except Lesson.DoesNotExist:
        print("\n❌ Leçon 1 du module 1 non trouvée")
        return

    # Afficher toutes les informations de la leçon
    print(f"\n📋 Informations de la leçon:")
    print(f"   - ID: {lesson1.id}")
    print(f"   - Titre: {lesson1.title}")
    print(f"   - Description: {lesson1.description}")
    print(f"   - Order: {lesson1.order}")

    # Compter les éléments
    print(f"\n📊 Contenu de la leçon:")
    print(f"   - Concepts: {lesson1.concepts.count()}")
    print(f"   - Examples: {lesson1.examples.count()}")
    print(f"   - Simulations: {lesson1.simulations.count()}")
    print(f"   - Quizzes: {lesson1.quizzes.count()}")
    print(f"   - Exercises: {lesson1.exercises.count()}")

    # Lister les simulations
    simulations = lesson1.simulations.all().order_by('order')
    print(f"\n🎮 Simulations de la leçon ({simulations.count()}):")
    if simulations.count() == 0:
        print("   ⚠️ AUCUNE SIMULATION TROUVÉE!")
    else:
        for sim in simulations:
            print(f"   - Order {sim.order}: {sim.title}")
            print(f"     ID: {sim.id}")
            print(f"     Steps: {sim.steps.count()}")

    # Chercher toutes les simulations orphelines
    print(f"\n🔍 Recherche de simulations orphelines ou mal liées:")
    all_simulations = Simulation.objects.all()
    print(f"   Total de simulations dans la base: {all_simulations.count()}")

    for sim in all_simulations:
        print(f"\n   Simulation: {sim.title}")
        print(f"      ID: {sim.id}")
        print(f"      Leçon: {sim.lesson.title} (Module {sim.lesson.module.order}, Leçon {sim.lesson.order})")
        print(f"      Order: {sim.order}")
        print(f"      Steps: {sim.steps.count()}")

if __name__ == "__main__":
    check_simulations()
