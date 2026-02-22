"""
Script pour créer la simulation sur les constantes pour Module 2, Leçon 2
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

def create_constants_simulation():
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("\n" + "="*60)
    print("CRÉATION SIMULATION CONSTANTES - MODULE 2, LEÇON 2")
    print("="*60)

    # Trouver le module 2
    module2 = Module.objects.get(order=2)
    print(f"\n✅ Module trouvé: {module2.title}")

    # Trouver ou créer la leçon 2
    lesson2, created = Lesson.objects.get_or_create(
        module=module2,
        order=2,
        defaults={
            'title': 'Constantes',
            'description': 'Comprendre les constantes et leurs différences avec les variables'
        }
    )

    if created:
        print(f"✅ Leçon créée: {lesson2.title}")
    else:
        print(f"✅ Leçon trouvée: {lesson2.title}")

    # Supprimer l'ancienne simulation si elle existe
    Simulation.objects.filter(lesson=lesson2).delete()
    print("\n🗑️ Anciennes simulations supprimées")

    # Créer la nouvelle simulation
    simulation = Simulation.objects.create(
        lesson=lesson2,
        title="Constantes vs Variables",
        description="Démonstration de l'utilisation des constantes et leur différence avec les variables",
        algorithm_code="""constante PI ← 3.14159
constante TVA ← 0.20
entier rayon
reel surface
reel prixHT
reel prixTTC

rayon ← 5
surface ← PI * rayon * rayon

prixHT ← 100
prixTTC ← prixHT * (1 + TVA)

Ecrire(surface)
Ecrire(prixTTC)

rayon ← 10
surface ← PI * rayon * rayon
Ecrire(surface)

PI ← 3.14""",
        order=1
    )

    print(f"\n✅ Simulation créée: {simulation.title}")

    # Définir les steps
    steps_data = [
        # Step 1: Début
        {
            "step_number": 1,
            "description": "Déclaration des constantes et variables",
            "state_data": {},
            "visual_data": {
                "variables": [],
                "constants": [],
                "message": "Début du programme"
            }
        },

        # Step 2: Constante PI
        {
            "step_number": 2,
            "description": "Déclaration de la constante PI",
            "state_data": {"PI": 3.14159},
            "visual_data": {
                "variables": [],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "La constante PI est créée avec la valeur 3.14159"
            }
        },

        # Step 3: Constante TVA
        {
            "step_number": 3,
            "description": "Déclaration de la constante TVA",
            "state_data": {"PI": 3.14159, "TVA": 0.20},
            "visual_data": {
                "variables": [],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isNew": True
                    }
                ],
                "message": "La constante TVA (20%) est créée"
            }
        },

        # Step 4: Variables rayon, surface, prixHT, prixTTC
        {
            "step_number": 4,
            "description": "Déclaration des variables",
            "state_data": {"PI": 3.14159, "TVA": 0.20},
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
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Variables déclarées (peuvent être modifiées)"
            }
        },

        # Step 5: rayon ← 5
        {
            "step_number": 5,
            "description": "Affectation: rayon ← 5",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 5},
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
                    },
                    {
                        "name": "prixHT",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "La variable rayon reçoit la valeur 5"
            }
        },

        # Step 6: surface ← PI * rayon * rayon
        {
            "step_number": 6,
            "description": "Calcul de la surface avec PI",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 5, "surface": 78.53975},
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
                        "value": "78.54",
                        "type": "reel",
                        "boxColor": "green",
                        "isModified": True
                    },
                    {
                        "name": "prixHT",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isUsed": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Surface = PI × 5 × 5 = 78.54",
                "operation": "3.14159 × 5 × 5 = 78.54"
            }
        },

        # Step 7: prixHT ← 100
        {
            "step_number": 7,
            "description": "Affectation: prixHT ← 100",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 5, "surface": 78.53975, "prixHT": 100},
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
                        "value": "78.54",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green",
                        "isModified": True
                    },
                    {
                        "name": "prixTTC",
                        "value": "",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Prix HT défini à 100"
            }
        },

        # Step 8: prixTTC ← prixHT * (1 + TVA)
        {
            "step_number": 8,
            "description": "Calcul du prix TTC avec TVA",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 5, "surface": 78.53975, "prixHT": 100, "prixTTC": 120},
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
                        "value": "78.54",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green",
                        "isModified": True
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isUsed": True
                    }
                ],
                "message": "Prix TTC = 100 × (1 + 0.20) = 120",
                "operation": "100 × 1.20 = 120"
            }
        },

        # Step 9: Affichage surface
        {
            "step_number": 9,
            "description": "Affichage de la surface",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 5, "surface": 78.53975, "prixHT": 100, "prixTTC": 120},
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
                        "value": "78.54",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Affichage: Surface = 78.54",
                "operation": "Ecrire: Surface = 78.54"
            }
        },

        # Step 10: Affichage prixTTC
        {
            "step_number": 10,
            "description": "Affichage du prix TTC",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 5, "surface": 78.53975, "prixHT": 100, "prixTTC": 120},
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
                        "value": "78.54",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Affichage: Prix TTC = 120",
                "operation": "Ecrire: Prix TTC = 120"
            }
        },

        # Step 11: rayon ← 10 (modification possible)
        {
            "step_number": 11,
            "description": "Modification de rayon (variable)",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 10, "surface": 78.53975, "prixHT": 100, "prixTTC": 120},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "10",
                        "type": "entier",
                        "boxColor": "green",
                        "isModified": True
                    },
                    {
                        "name": "surface",
                        "value": "78.54",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "✅ La variable rayon peut être modifiée (10)",
                "success": True
            }
        },

        # Step 12: surface recalculée
        {
            "step_number": 12,
            "description": "Recalcul de la surface avec nouveau rayon",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 10, "surface": 314.159, "prixHT": 100, "prixTTC": 120},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "10",
                        "type": "entier",
                        "boxColor": "green"
                    },
                    {
                        "name": "surface",
                        "value": "314.16",
                        "type": "reel",
                        "boxColor": "green",
                        "isModified": True
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isUsed": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Nouvelle surface = PI × 10 × 10 = 314.16",
                "operation": "3.14159 × 10 × 10 = 314.16"
            }
        },

        # Step 13: Affichage nouvelle surface
        {
            "step_number": 13,
            "description": "Affichage de la nouvelle surface",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 10, "surface": 314.159, "prixHT": 100, "prixTTC": 120},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "10",
                        "type": "entier",
                        "boxColor": "green"
                    },
                    {
                        "name": "surface",
                        "value": "314.16",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "Affichage: Nouvelle surface = 314.16",
                "operation": "Ecrire: Surface = 314.16"
            }
        },

        # Step 14: Tentative de modification de PI (ERREUR)
        {
            "step_number": 14,
            "description": "Tentative de modifier PI (ERREUR)",
            "state_data": {"PI": 3.14159, "TVA": 0.20, "rayon": 10, "surface": 314.159, "prixHT": 100, "prixTTC": 120},
            "visual_data": {
                "variables": [
                    {
                        "name": "rayon",
                        "value": "10",
                        "type": "entier",
                        "boxColor": "green"
                    },
                    {
                        "name": "surface",
                        "value": "314.16",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixHT",
                        "value": "100",
                        "type": "reel",
                        "boxColor": "green"
                    },
                    {
                        "name": "prixTTC",
                        "value": "120",
                        "type": "reel",
                        "boxColor": "green"
                    }
                ],
                "constants": [
                    {
                        "name": "PI",
                        "value": "3.14159",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True,
                        "isError": True
                    },
                    {
                        "name": "TVA",
                        "value": "0.20",
                        "type": "constante",
                        "boxColor": "blue",
                        "isLocked": True
                    }
                ],
                "message": "❌ ERREUR: Impossible de modifier une constante!",
                "error": "Les constantes ne peuvent pas être modifiées après leur déclaration"
            }
        }
    ]

    # Créer tous les steps
    for step_data in steps_data:
        SimulationStep.objects.create(
            simulation=simulation,
            **step_data
        )

    print(f"\n✅ {len(steps_data)} steps créés avec succès!")
    print(f"\nSimulation '{simulation.title}' créée pour la leçon '{lesson2.title}'")

    # Vérification
    print("\nVérification:")
    print(f"   - Steps dans la simulation: {simulation.steps.count()}")

if __name__ == "__main__":
    create_constants_simulation()
