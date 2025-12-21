"""
Script pour restaurer la simulation de la leçon 1 du module 1
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep

def restore_simulation():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("RESTAURATION DE LA SIMULATION - MODULE 1, LEÇON 1")
    print("="*60)

    # Trouver la leçon
    module1 = Module.objects.get(order=1)
    lesson1 = Lesson.objects.get(module=module1, order=1)

    print(f"\nLeçon trouvée: {lesson1.title}")

    # Trouver la simulation sans steps
    simulation = Simulation.objects.get(lesson=lesson1, title="Calcul de la somme de deux nombres")
    print(f"Simulation trouvée: {simulation.title}")
    print(f"Steps actuels: {simulation.steps.count()}")

    # Supprimer les anciens steps s'il y en a
    simulation.steps.all().delete()

    # Créer les steps pour la simulation "Calcul de la somme de deux nombres"
    steps_data = [
        {
            'step_number': 1,
            'description': 'Initialisation des variables',
            'state_data': {},
            'visual_data': {
                'type': 'variables',
                'variables': []
            }
        },
        {
            'step_number': 2,
            'description': 'Déclaration: entier a',
            'state_data': {'a': None},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': None, 'status': 'new'}
                ]
            }
        },
        {
            'step_number': 3,
            'description': 'Déclaration: entier b',
            'state_data': {'a': None, 'b': None},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': None},
                    {'name': 'b', 'type': 'entier', 'value': None, 'status': 'new'}
                ]
            }
        },
        {
            'step_number': 4,
            'description': 'Déclaration: entier somme',
            'state_data': {'a': None, 'b': None, 'somme': None},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': None},
                    {'name': 'b', 'type': 'entier', 'value': None},
                    {'name': 'somme', 'type': 'entier', 'value': None, 'status': 'new'}
                ]
            }
        },
        {
            'step_number': 5,
            'description': 'Affectation: a ← 5',
            'state_data': {'a': 5, 'b': None, 'somme': None},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': 5, 'status': 'modified'},
                    {'name': 'b', 'type': 'entier', 'value': None},
                    {'name': 'somme', 'type': 'entier', 'value': None}
                ]
            }
        },
        {
            'step_number': 6,
            'description': 'Affectation: b ← 3',
            'state_data': {'a': 5, 'b': 3, 'somme': None},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': 5},
                    {'name': 'b', 'type': 'entier', 'value': 3, 'status': 'modified'},
                    {'name': 'somme', 'type': 'entier', 'value': None}
                ]
            }
        },
        {
            'step_number': 7,
            'description': 'Calcul: somme ← a + b',
            'state_data': {'a': 5, 'b': 3, 'somme': 8},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': 5},
                    {'name': 'b', 'type': 'entier', 'value': 3},
                    {'name': 'somme', 'type': 'entier', 'value': 8, 'status': 'modified'}
                ],
                'operation': '5 + 3 = 8'
            }
        },
        {
            'step_number': 8,
            'description': 'Affichage du résultat',
            'state_data': {'a': 5, 'b': 3, 'somme': 8},
            'visual_data': {
                'type': 'variables',
                'variables': [
                    {'name': 'a', 'type': 'entier', 'value': 5},
                    {'name': 'b', 'type': 'entier', 'value': 3},
                    {'name': 'somme', 'type': 'entier', 'value': 8, 'status': 'highlighted'}
                ],
                'operation': 'Afficher: La somme est 8'
            }
        }
    ]

    # Créer les steps
    for step_data in steps_data:
        SimulationStep.objects.create(simulation=simulation, **step_data)

    print(f"\n✅ {len(steps_data)} steps créés avec succès!")
    print(f"Simulation '{simulation.title}' restaurée")

    # Vérifier
    print(f"\nVérification:")
    print(f"   - Steps dans la simulation: {simulation.steps.count()}")

if __name__ == "__main__":
    restore_simulation()
