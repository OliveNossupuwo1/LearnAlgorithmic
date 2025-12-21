"""
Script pour créer la simulation sur les types de variables avec erreurs
Module 2 - Leçon 1: Les Variables - Types et Erreurs
"""

import json

def create_types_simulation():
    simulation = {
        "title": "Types de Variables et Erreurs",
        "description": "Comprendre les types de variables et les erreurs de type",
        "algorithm_code": """entier a
entier b
chaine texte

a ← 10
b ← 5

texte ← 100

texte ← "Bonjour"

resultat ← a + texte

resultat ← a + b""",
        "steps": [
            {
                "step_number": 1,
                "description": "Début du programme",
                "state_data": {},
                "visual_data": {
                    "type": "variables",
                    "variables": [],
                    "operation": None
                }
            },
            {
                "step_number": 2,
                "description": "Déclaration: entier a",
                "state_data": {
                    "a": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": None,
                            "status": "new",
                            "boxColor": "green"
                        }
                    ],
                    "operation": None,
                    "highlight": "a"
                }
            },
            {
                "step_number": 3,
                "description": "Déclaration: entier b",
                "state_data": {
                    "a": None,
                    "b": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": None,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": None,
                            "status": "new",
                            "boxColor": "green"
                        }
                    ],
                    "operation": None,
                    "highlight": "b"
                }
            },
            {
                "step_number": 4,
                "description": "Déclaration: chaine texte",
                "state_data": {
                    "a": None,
                    "b": None,
                    "texte": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": None,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": None,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": None,
                            "status": "new",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "texte"
                }
            },
            {
                "step_number": 5,
                "description": "Affectation: a ← 10",
                "state_data": {
                    "a": 10,
                    "b": None,
                    "texte": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "status": "modified",
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": None,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": None,
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "a"
                }
            },
            {
                "step_number": 6,
                "description": "Affectation: b ← 5",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "status": "modified",
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": None,
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "b"
                }
            },
            {
                "step_number": 7,
                "description": "Tentative: texte ← 100",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": None,
                            "status": "highlighted",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "texte"
                }
            },
            {
                "step_number": 8,
                "description": "ERREUR! Impossible d'affecter un entier à une variable de type chaîne",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": None
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": "ERREUR!",
                            "status": "error",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "texte"
                }
            },
            {
                "step_number": 9,
                "description": "Affectation correcte: texte ← \"Bonjour\"",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": "Bonjour"
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": "Bonjour",
                            "status": "modified",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "texte"
                }
            },
            {
                "step_number": 10,
                "description": "Tentative: resultat ← a + texte",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": "Bonjour"
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "status": "highlighted",
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": "Bonjour",
                            "status": "highlighted",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "a"
                }
            },
            {
                "step_number": 11,
                "description": "ERREUR! Impossible d'additionner un entier (a) avec une chaîne (texte)",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": "Bonjour"
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "status": "error",
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": "ERREUR!",
                            "status": "error",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": None
                }
            },
            {
                "step_number": 12,
                "description": "Opération correcte: resultat ← a + b (même type)",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": "Bonjour"
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "status": "highlighted",
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "status": "highlighted",
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": "Bonjour",
                            "boxColor": "red"
                        }
                    ],
                    "operation": None,
                    "highlight": "a"
                }
            },
            {
                "step_number": 13,
                "description": "Résultat: 10 + 5 = 15 (opération réussie entre types identiques)",
                "state_data": {
                    "a": 10,
                    "b": 5,
                    "texte": "Bonjour",
                    "resultat": 15
                },
                "visual_data": {
                    "type": "variables",
                    "variables": [
                        {
                            "name": "a",
                            "type": "entier",
                            "value": 10,
                            "boxColor": "green"
                        },
                        {
                            "name": "b",
                            "type": "entier",
                            "value": 5,
                            "boxColor": "green"
                        },
                        {
                            "name": "texte",
                            "type": "chaine",
                            "value": "Bonjour",
                            "boxColor": "red"
                        },
                        {
                            "name": "resultat",
                            "type": "entier",
                            "value": 15,
                            "status": "new",
                            "boxColor": "green"
                        }
                    ],
                    "operation": None,
                    "highlight": "resultat"
                }
            }
        ]
    }

    return simulation

if __name__ == "__main__":
    import sys
    import io

    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    simulation = create_types_simulation()

    with open('types_simulation.json', 'w', encoding='utf-8') as f:
        json.dump(simulation, f, ensure_ascii=False, indent=2)

    print("Simulation creee avec succes!")
    print(f"Nombre d'etapes: {len(simulation['steps'])}")
    print(f"Titre: {simulation['title']}")
