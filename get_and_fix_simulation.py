"""
Script pour récupérer et afficher la simulation de la leçon 1 du module 1
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

def get_and_fix_simulation():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("RÉCUPÉRATION DE LA SIMULATION - MODULE 1, LEÇON 1")
    print("="*60)

    # Trouver la leçon
    module1 = Module.objects.get(order=1)
    lesson1 = Lesson.objects.get(module=module1, order=1)

    print(f"\nLeçon trouvée: {lesson1.title}")

    # Trouver la simulation
    simulation = Simulation.objects.get(lesson=lesson1, title="Calcul de la somme de deux nombres")
    print(f"Simulation trouvée: {simulation.title}")
    print(f"Steps actuels: {simulation.steps.count()}")

    # Afficher le code actuel
    print(f"\n📋 Code algorithme actuel:")
    print("-" * 60)
    print(simulation.algorithm_code)
    print("-" * 60)

    # Afficher tous les steps
    print(f"\n📊 Steps de la simulation:")
    for step in simulation.steps.all().order_by('step_number'):
        print(f"\nStep {step.step_number}: {step.description}")
        if step.visual_data and 'operation' in step.visual_data:
            operation = step.visual_data.get('operation')
            if operation:
                print(f"   Operation: {operation}")

    # Modifier le code pour remplacer "Afficher" par "Ecrire()"
    new_code = simulation.algorithm_code.replace("AFFICHER", "Ecrire")
    new_code = new_code.replace("Afficher", "Ecrire")

    print(f"\n✏️ Nouveau code algorithme:")
    print("-" * 60)
    print(new_code)
    print("-" * 60)

    # Mettre à jour le code
    simulation.algorithm_code = new_code
    simulation.save()

    # Mettre à jour le step 8 qui contient "Afficher"
    step8 = simulation.steps.get(step_number=8)
    if step8.visual_data and 'operation' in step8.visual_data:
        operation = step8.visual_data.get('operation', '')
        if 'Afficher' in operation:
            step8.visual_data['operation'] = operation.replace('Afficher', 'Ecrire')
            step8.save()
            print(f"\n✅ Step 8 mis à jour: {step8.visual_data['operation']}")

    print(f"\n✅ Simulation mise à jour avec succès!")

if __name__ == "__main__":
    get_and_fix_simulation()
