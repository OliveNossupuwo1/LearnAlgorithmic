"""
Script pour mettre à jour l'ordre de la simulation
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation

def update_simulation_order():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    # Trouver la leçon 1 du module 2
    try:
        module2 = Module.objects.get(order=2)
        lesson1 = Lesson.objects.get(module=module2, order=1)
        print(f"Leçon trouvée: {lesson1.title}\n")
    except (Module.DoesNotExist, Lesson.DoesNotExist) as e:
        print(f"Erreur: Module 2 ou Leçon 1 non trouvé - {e}")
        return

    # Afficher toutes les simulations
    simulations = Simulation.objects.filter(lesson=lesson1).order_by('order')
    print(f"Simulations actuelles ({simulations.count()}):")
    for sim in simulations:
        print(f"  - Order {sim.order}: {sim.title}")

    # Mettre à jour l'ordre de la simulation "Types de Variables et Erreurs" à 1
    types_sim = Simulation.objects.filter(
        lesson=lesson1,
        title="Types de Variables et Erreurs"
    ).first()

    if types_sim:
        types_sim.order = 1
        types_sim.save()
        print(f"\n✅ Simulation '{types_sim.title}' mise à jour avec order=1")
    else:
        print("\n⚠️ Simulation 'Types de Variables et Erreurs' non trouvée")

    # Afficher les simulations après mise à jour
    simulations = Simulation.objects.filter(lesson=lesson1).order_by('order')
    print(f"\nSimulations après mise à jour ({simulations.count()}):")
    for sim in simulations:
        print(f"  - Order {sim.order}: {sim.title}")

if __name__ == "__main__":
    update_simulation_order()
