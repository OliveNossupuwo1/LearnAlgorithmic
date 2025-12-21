"""
Script pour créer la simulation interactive de la leçon sur les variables
Module 2 - Leçon 1: Les Variables
"""

import json

def create_variables_simulation():
    simulation = {
        "title": "Découverte des Variables",
        "description": "Apprenez comment déclarer, typer et manipuler des variables",
        "algorithm_code": """// Déclaration et initialisation
entier age
age ← 25

reel taille
taille ← 1.75

chaine nom
nom ← "Alice"

booleen estEtudiant
estEtudiant ← vrai

// Opérations
age ← age + 1
taille ← taille * 100""",
        "steps": [
            {
                "step_number": 1,
                "description": "🎬 Début du programme. La mémoire est vide, prête à accueillir nos variables.",
                "state_data": {},
                "visual_data": {
                    "type": "variables",
                    "variables": [],
                    "operation": None
                }
            },
            {
                "step_number": 2,
                "description": "📦 Déclaration de la variable 'age' de type entier. Un espace mémoire est réservé.",
                "state_data": {
                    "age": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": None,
                            "address": "0x1000",
                            "status": "new"
                        }
                    ],
                    "operation": "Déclaration: entier age",
                    "highlight": "age"
                }
            },
            {
                "step_number": 3,
                "description": "✏️ Affectation: la variable 'age' reçoit la valeur 25.",
                "state_data": {
                    "age": 25
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000",
                            "status": "modified"
                        }
                    ],
                    "operation": "Affectation: age ← 25",
                    "highlight": "age"
                }
            },
            {
                "step_number": 4,
                "description": "📦 Déclaration de la variable 'taille' de type réel (nombre décimal).",
                "state_data": {
                    "age": 25,
                    "taille": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": None,
                            "address": "0x1004",
                            "status": "new"
                        }
                    ],
                    "operation": "Déclaration: reel taille",
                    "highlight": "taille"
                }
            },
            {
                "step_number": 5,
                "description": "✏️ La variable 'taille' reçoit la valeur 1.75 (un nombre décimal).",
                "state_data": {
                    "age": 25,
                    "taille": 1.75
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004",
                            "status": "modified"
                        }
                    ],
                    "operation": "Affectation: taille ← 1.75",
                    "highlight": "taille"
                }
            },
            {
                "step_number": 6,
                "description": "📦 Déclaration de la variable 'nom' de type chaîne de caractères.",
                "state_data": {
                    "age": 25,
                    "taille": 1.75,
                    "nom": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": None,
                            "address": "0x1008",
                            "status": "new"
                        }
                    ],
                    "operation": "Déclaration: chaine nom",
                    "highlight": "nom"
                }
            },
            {
                "step_number": 7,
                "description": "✏️ La variable 'nom' reçoit la valeur \"Alice\" (du texte entre guillemets).",
                "state_data": {
                    "age": 25,
                    "taille": 1.75,
                    "nom": "Alice"
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008",
                            "status": "modified"
                        }
                    ],
                    "operation": "Affectation: nom ← \"Alice\"",
                    "highlight": "nom"
                }
            },
            {
                "step_number": 8,
                "description": "📦 Déclaration de la variable 'estEtudiant' de type booléen (vrai ou faux).",
                "state_data": {
                    "age": 25,
                    "taille": 1.75,
                    "nom": "Alice",
                    "estEtudiant": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008"
                        },
                        {
                            "name": "estEtudiant",
                            "type": "booleen",
                            "value": None,
                            "address": "0x100C",
                            "status": "new"
                        }
                    ],
                    "operation": "Déclaration: booleen estEtudiant",
                    "highlight": "estEtudiant"
                }
            },
            {
                "step_number": 9,
                "description": "✏️ La variable 'estEtudiant' reçoit la valeur vrai (true en anglais).",
                "state_data": {
                    "age": 25,
                    "taille": 1.75,
                    "nom": "Alice",
                    "estEtudiant": True
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008"
                        },
                        {
                            "name": "estEtudiant",
                            "type": "booleen",
                            "value": True,
                            "address": "0x100C",
                            "status": "modified"
                        }
                    ],
                    "operation": "Affectation: estEtudiant ← vrai",
                    "highlight": "estEtudiant"
                }
            },
            {
                "step_number": 11,
                "description": "➕ Opération arithmétique: on ajoute 1 à l'âge. Ancienne valeur: 25.",
                "state_data": {
                    "age": 25,
                    "taille": 1.75,
                    "nom": "Alice",
                    "estEtudiant": True
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 25,
                            "address": "0x1000",
                            "status": "highlighted"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008"
                        },
                        {
                            "name": "estEtudiant",
                            "type": "booleen",
                            "value": True,
                            "address": "0x100C"
                        }
                    ],
                    "operation": "Calcul: age + 1 = 25 + 1 = 26",
                    "highlight": "age"
                }
            },
            {
                "step_number": 12,
                "description": "✅ Nouvelle valeur affectée: age vaut maintenant 26.",
                "state_data": {
                    "age": 26,
                    "taille": 1.75,
                    "nom": "Alice",
                    "estEtudiant": True
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 26,
                            "address": "0x1000",
                            "status": "modified"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008"
                        },
                        {
                            "name": "estEtudiant",
                            "type": "booleen",
                            "value": True,
                            "address": "0x100C"
                        }
                    ],
                    "operation": "Affectation: age ← 26",
                    "highlight": "age"
                }
            },
            {
                "step_number": 13,
                "description": "✖️ Opération: on multiplie la taille par 100 pour la convertir en cm.",
                "state_data": {
                    "age": 26,
                    "taille": 1.75,
                    "nom": "Alice",
                    "estEtudiant": True
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 26,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 1.75,
                            "address": "0x1004",
                            "status": "highlighted"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008"
                        },
                        {
                            "name": "estEtudiant",
                            "type": "booleen",
                            "value": True,
                            "address": "0x100C"
                        }
                    ],
                    "operation": "Calcul: taille × 100 = 1.75 × 100 = 175",
                    "highlight": "taille"
                }
            },
            {
                "step_number": 14,
                "description": "✅ Taille convertie en centimètres: 175 cm. Fin du programme!",
                "state_data": {
                    "age": 26,
                    "taille": 175.0,
                    "nom": "Alice",
                    "estEtudiant": True
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "age",
                            "type": "entier",
                            "value": 26,
                            "address": "0x1000"
                        },
                        {
                            "name": "taille",
                            "type": "reel",
                            "value": 175.0,
                            "address": "0x1004",
                            "status": "modified"
                        },
                        {
                            "name": "nom",
                            "type": "chaine",
                            "value": "Alice",
                            "address": "0x1008"
                        },
                        {
                            "name": "estEtudiant",
                            "type": "booleen",
                            "value": True,
                            "address": "0x100C"
                        }
                    ],
                    "operation": "Affectation: taille ← 175.0",
                    "highlight": "taille"
                }
            }
        ]
    }

    return simulation

if __name__ == "__main__":
    import sys
    import io

    # Fix encoding on Windows
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    simulation = create_variables_simulation()

    # Sauvegarder dans un fichier JSON
    with open('variables_simulation.json', 'w', encoding='utf-8') as f:
        json.dump(simulation, f, ensure_ascii=False, indent=2)

    print("Simulation creee avec succes!")
    print(f"Nombre d'etapes: {len(simulation['steps'])}")
    print(f"Titre: {simulation['title']}")
    print("\nLe fichier 'variables_simulation.json' a ete cree.")
    print("\nPour l'utiliser:")
    print("1. Copiez le contenu du fichier JSON")
    print("2. Dans l'admin Django, editez la lecon 1 du module 2")
    print("3. Collez le contenu dans le champ 'simulation_data'")
