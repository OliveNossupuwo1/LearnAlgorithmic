"""
Script pour mettre à jour la simulation des types et erreurs
"""

import os
import sys
import django
import json
import io

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep

def update_types_simulation():
    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    # Charger les données de simulation
    with open('types_simulation.json', 'r', encoding='utf-8') as f:
        sim_data = json.load(f)

    # Trouver la leçon 1 du module 2
    try:
        module2 = Module.objects.get(order=2)
        lesson1 = Lesson.objects.get(module=module2, order=1)
        print(f"Leçon trouvée: {lesson1.title}")
    except (Module.DoesNotExist, Lesson.DoesNotExist) as e:
        print(f"Erreur: Module 2 ou Leçon 1 non trouvé - {e}")
        return

    # Trouver la simulation existante
    try:
        simulation = Simulation.objects.get(
            lesson=lesson1,
            title="Types de Variables et Erreurs"
        )
        print(f"Simulation trouvée: {simulation.title}")

        # Supprimer les anciennes étapes
        old_steps = simulation.steps.all()
        print(f"Suppression de {old_steps.count()} anciennes étapes...")
        old_steps.delete()

        # Mettre à jour le code de l'algorithme
        simulation.algorithm_code = sim_data['algorithm_code']
        simulation.save()

        # Créer les nouvelles étapes
        steps_created = 0
        for step_data in sim_data['steps']:
            SimulationStep.objects.create(
                simulation=simulation,
                step_number=step_data['step_number'],
                description=step_data['description'],
                state_data=step_data['state_data'],
                visual_data=step_data['visual_data']
            )
            steps_created += 1

        print(f"\n✅ {steps_created} nouvelles étapes créées!")
        print("✅ Simulation mise à jour avec succès!")

    except Simulation.DoesNotExist:
        print("⚠️ Simulation 'Types de Variables et Erreurs' non trouvée.")
        print("Utilisez add_types_simulation.py pour la créer.")

if __name__ == "__main__":
    update_types_simulation()
