"""
Script pour mettre à jour le code de la simulation des constantes
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation

def update_constants_code():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("MISE À JOUR DU CODE - SIMULATION CONSTANTES")
    print("="*60)

    # Trouver le module 2
    module2 = Module.objects.get(order=2)
    lesson2 = Lesson.objects.get(module=module2, order=2)
    simulation = Simulation.objects.get(lesson=lesson2, title="Constantes vs Variables")

    # Nouveau code plus court
    new_code = """constante PI ← 3.14
constante TVA ← 0.20
entier rayon
reel surface, prixHT, prixTTC

rayon ← 5
surface ← PI * rayon * rayon
prixHT ← 100
prixTTC ← prixHT * (1 + TVA)

Ecrire(surface)
Ecrire(prixTTC)

rayon ← 10
surface ← PI * rayon * rayon
Ecrire(surface)

PI ← 3"""

    simulation.algorithm_code = new_code
    simulation.save()

    print(f"\n✅ Code mis à jour!")
    print(f"\nNouveau code:")
    print("-" * 60)
    print(new_code)
    print("-" * 60)

if __name__ == "__main__":
    update_constants_code()
