"""
Test de création de simulation avec steps
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep
from courses.serializers import LessonSerializer

def test_simulation_with_steps():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("TEST: Création de leçon avec simulation et steps")
    print("="*60)

    # Obtenir le premier module
    module = Module.objects.first()

    # Données de test
    lesson_data = {
        'module': module.id,
        'title': 'Test Simulation Steps',
        'description': 'Test',
        'order': 999,
        'simulations': [
            {
                'title': 'Ma Simulation',
                'description': 'Test simulation',
                'algorithm_code': 'a ← 10\nb ← 20',
                'order': 1,
                'steps': [
                    {
                        'step_number': 1,
                        'description': 'Étape 1',
                        'state_data': {},
                        'visual_data': {'type': 'variables', 'variables': []}
                    },
                    {
                        'step_number': 2,
                        'description': 'Étape 2',
                        'state_data': {'a': 10},
                        'visual_data': {'type': 'variables', 'variables': [{'name': 'a', 'value': 10}]}
                    }
                ]
            }
        ]
    }

    # Créer la leçon
    serializer = LessonSerializer(data=lesson_data)
    if serializer.is_valid():
        lesson = serializer.save()
        print(f"✅ Leçon créée: {lesson.title}")

        # Vérifier les simulations
        simulations = lesson.simulations.all()
        print(f"   - Simulations: {simulations.count()}")

        for sim in simulations:
            print(f"     * {sim.title}: {sim.steps.count()} steps")
            for step in sim.steps.all().order_by('step_number'):
                print(f"       - Step {step.step_number}: {step.description}")

        # Nettoyer
        lesson.delete()
        print(f"\n✅ Leçon de test supprimée")
    else:
        print(f"❌ Erreur: {serializer.errors}")

if __name__ == "__main__":
    test_simulation_with_steps()
