"""
Script pour ajouter la simulation des variables à la leçon 1 du module 2
"""

import os
import sys
import django
import json

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep

def add_variables_simulation():
    # Charger les données de simulation
    with open('variables_simulation.json', 'r', encoding='utf-8') as f:
        sim_data = json.load(f)

    # Trouver la leçon 1 du module 2
    try:
        module2 = Module.objects.get(order=2)
        lesson1 = Lesson.objects.get(module=module2, order=1)
        print(f"Lecon trouvee: {lesson1.title}")
    except (Module.DoesNotExist, Lesson.DoesNotExist) as e:
        print(f"Erreur: Module 2 ou Lecon 1 non trouve - {e}")
        return

    # Supprimer les simulations existantes pour cette leçon (pour éviter les doublons)
    existing_sims = Simulation.objects.filter(lesson=lesson1)
    if existing_sims.exists():
        print(f"Suppression de {existing_sims.count()} simulation(s) existante(s)")
        existing_sims.delete()

    # Créer la nouvelle simulation
    simulation = Simulation.objects.create(
        lesson=lesson1,
        title=sim_data['title'],
        description=sim_data['description'],
        algorithm_code=sim_data['algorithm_code'],
        order=1
    )
    print(f"Simulation creee: {simulation.title}")

    # Créer les étapes
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

    print(f"{steps_created} etapes creees avec succes!")
    print("\nSimulation ajoutee a la lecon 1 du module 2!")
    print("Vous pouvez maintenant visualiser la simulation dans l'interface.")

if __name__ == "__main__":
    add_variables_simulation()
