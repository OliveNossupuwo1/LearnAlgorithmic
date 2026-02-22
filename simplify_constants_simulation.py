"""
Script pour simplifier la simulation des constantes (3 variables seulement)
"""

import os
import sys
import django

# Setup Django
sys.path.append(r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep

def simplify_simulation():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("SIMPLIFICATION SIMULATION CONSTANTES")
    print("="*60)

    # Trouver le module 2
    module2 = Module.objects.get(order=2)
    lesson2 = Lesson.objects.get(module=module2, order=2)

    # Supprimer l'ancienne simulation
    Simulation.objects.filter(lesson=lesson2).delete()
    print("\n🗑️ Ancienne simulation supprimée")

    # Nouveau code très simple avec 3 variables
    new_code = """constante PI ← 3.14
entier rayon
reel surface

rayon ← 5
surface ← PI * rayon * rayon

Ecrire(surface)

PI ← 3"""

    # Créer la nouvelle simulation
    simulation = Simulation.objects.create(
        lesson=lesson2,
        title="Constantes vs Variables",
        description="Comprendre la différence entre constantes et variables",
        algorithm_code=new_code,
        order=1
    )

    print(f"\n✅ Simulation créée: {simulation.title}")

    # Steps simplifiés (7 steps au total)
    steps_data = [
        # Step 1: Début
        {
            "step_number": 1,
            "description": "Début du programme",
            "state_data": {},
            "visual_data": {
                "variables": [],
                "constants": [],
                "message": "Initialisation..."
            }
        },

        # Step 2: Constante PI
        {
            "step_number": 2,
            "description": "Déclaration de la constante PI",
            "state_data": {"PI": 3.14},
            "visual_data": {
                "variables": [],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isNew": True
                    }
                ],
                "message": "La constante PI est créée (ne peut pas être modifiée)"
            }
        },

        # Step 3: Variables rayon et surface
        {
            "step_number": 3,
            "description": "Déclaration des variables",
            "state_data": {"PI": 3.14},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "",
                        "type": "entier",
                        "boxColor": "green",
                        "isNew": True
                    },
                    {
                        "name": "surface",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green",
                        "isNew": True
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Les variables sont créées (peuvent être modifiées)"
            }
        },

        # Step 4: rayon ← 5
        {
            "step_number": 4,
            "description": "Affectation: rayon ← 5",
            "state_data": {"PI": 3.14, "rayon": 5},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "5",
                        "type": "entier",
                        "boxColor": "green",
                        "isModified": True
                    },
                    {
                        "name": "surface",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "La variable rayon reçoit la valeur 5"
            }
        },

        # Step 5: Calcul surface
        {
            "step_number": 5,
            "description": "Calcul: surface ← PI × rayon × rayon",
            "state_data": {"PI": 3.14, "rayon": 5, "surface": 78.5},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "5",
                        "type": "entier",
                        "boxColor": "green"
                    },
                    {
                        "name": "surface",
                        "value": "78.5",
                        "type": "reel",
                        "boxColor": "green",
                        "isModified": True
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isUsed": True
                    }
                ],
                "message": "Calcul: 3.14 × 5 × 5 = 78.5",
                "operation": "3.14 × 5 × 5 = 78.5"
            }
        },

        # Step 6: Affichage
        {
            "step_number": 6,
            "description": "Affichage du résultat",
            "state_data": {"PI": 3.14, "rayon": 5, "surface": 78.5},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "5",
                        "type": "entier",
                        "boxColor": "green"
                    },
                    {
                        "name": "surface",
                        "value": "78.5",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Affichage: La surface est 78.5",
                "operation": "Ecrire: 78.5"
            }
        },

        # Step 7: Tentative modification PI (ERREUR)
        {
            "step_number": 7,
            "description": "Erreur: tentative de modifier PI",
            "state_data": {"PI": 3.14, "rayon": 5, "surface": 78.5},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "5",
                        "type": "entier",
                        "boxColor": "green"
                    },
                    {
                        "name": "surface",
                        "value": "78.5",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isError": True
                    }
                ],
                "message": "❌ ERREUR: Une constante ne peut pas être modifiée!",
                "error": "Les constantes sont verrouillées après leur création"
            }
        }
    ]

    # Créer tous les steps
    for step_data in steps_data:
        SimulationStep.objects.create(
            simulation=simulation,
            **step_data
        )

    print(f"✅ {len(steps_data)} steps créés avec succès!")
    print(f"\nNouveau code:")
    print("-" * 60)
    print(new_code)
    print("-" * 60)

if __name__ == "__main__":
    simplify_simulation()
