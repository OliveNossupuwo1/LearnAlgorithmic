"""
Script pour corriger la synchronisation entre la simulation et le code
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep

def fix_sync():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("CORRECTION SYNCHRONISATION CODE")
    print("="*60)

    # Trouver le module 2
    module2 = Module.objects.get(order=2)
    lesson2 = Lesson.objects.get(module=module2, order=2)
    simulation = Simulation.objects.get(lesson=lesson2, title="Constantes vs Variables")

    # Mettre à jour les steps avec les bonnes lignes de code
    steps_updates = [
        (1, None),  # Pas de ligne surlignée
        (2, 1),     # ligne 1: constante PI ← 3.14
        (3, 2),     # ligne 2: entier rayon
        (4, 5),     # ligne 5: rayon ← 5
        (5, 6),     # ligne 6: surface ← PI * rayon * rayon
        (6, 8),     # ligne 8: Ecrire(surface)
        (7, 10),    # ligne 10: PI ← 3 (erreur)
    ]

    for step_num, code_line in steps_updates:
        step = simulation.steps.get(step_number=step_num)

        # Ajouter le champ code_line dans visual_data
        visual_data = step.visual_data or {}
        if code_line:
            visual_data['code_line'] = code_line
        else:
            visual_data['code_line'] = None

        step.visual_data = visual_data
        step.save()

        print(f"Step {step_num}: code_line = {code_line}")

    print(f"\n✅ Synchronisation corrigée!")

if __name__ == "__main__":
    fix_sync()
