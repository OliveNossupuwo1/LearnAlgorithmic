"""
Script pour supprimer l'ancienne simulation de la leçon 1 du module 2
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation

def delete_old_simulation():
    # Trouver la leçon 1 du module 2
    try:
        module2 = Module.objects.get(order=2)
        lesson1 = Lesson.objects.get(module=module2, order=1)
        print(f"Lecon trouvee: {lesson1.title}")
    except (Module.DoesNotExist, Lesson.DoesNotExist) as e:
        print(f"Erreur: Module 2 ou Lecon 1 non trouve - {e}")
        return

    # Trouver et supprimer la simulation "Découverte des Variables"
    try:
        old_simulation = Simulation.objects.get(
            lesson=lesson1,
            title="Découverte des Variables"
        )
        print(f"\nSimulation trouvee: {old_simulation.title}")
        print(f"Nombre d'etapes: {old_simulation.steps.count()}")

        # Supprimer (les étapes seront supprimées automatiquement grâce à CASCADE)
        old_simulation.delete()
        print("\n✅ Simulation 'Decouverte des Variables' supprimee avec succes!")

    except Simulation.DoesNotExist:
        print("\n⚠️ Simulation 'Decouverte des Variables' non trouvee.")

    # Afficher les simulations restantes
    remaining = Simulation.objects.filter(lesson=lesson1)
    print(f"\nSimulations restantes pour cette lecon: {remaining.count()}")
    for sim in remaining:
        print(f"  - {sim.title} (order: {sim.order})")

if __name__ == "__main__":
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    delete_old_simulation()
