"""
Script pour créer une simulation interactive des variables avec deux modes:
- Mode observateur: l'utilisateur regarde la simulation
- Mode interactif: l'utilisateur répond à des questions pour continuer

Le code et les données changent à chaque session.
"""

import os
import sys
import django
import random
import json

# Configuration Django
sys.path.append('LearnAlgorithmic/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Module, Lesson, Simulation, SimulationStep

# Pool de noms, valeurs et opérations pour générer du contenu aléatoire
NAMES_POOL = ["Alice", "Bob", "Charlie", "Diana", "Emma", "Frank", "Grace", "Hugo"]
CITIES_POOL = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux"]
AGES_POOL = list(range(18, 35))
HEIGHTS_POOL = [round(x, 2) for x in [1.60, 1.65, 1.70, 1.75, 1.80, 1.85, 1.90]]
VAR_NAMES = {
    "age": {"type": "entier", "values": AGES_POOL},
    "taille": {"type": "reel", "values": HEIGHTS_POOL},
    "nom": {"type": "chaine", "values": NAMES_POOL},
    "ville": {"type": "chaine", "values": CITIES_POOL},
    "estEtudiant": {"type": "booleen", "values": [True, False]},
    "estAdulte": {"type": "booleen", "values": [True, False]},
}

# Types de questions pour le mode interactif
QUESTION_TYPES = {
    "declaration": [
        {
            "type": "what_happens",
            "template": "Que fait cette ligne de code?\n{code}",
            "choices_template": [
                "Déclare une variable de type {type}",
                "Affecte une valeur à la variable",
                "Affiche la variable",
                "Supprime la variable"
            ],
            "correct_index": 0
        },
        {
            "type": "memory_state",
            "template": "Après cette déclaration, quelle est la valeur de '{var}'?",
            "choices_template": [
                "None (non initialisée)",
                "0",
                "null",
                "undefined"
            ],
            "correct_index": 0
        }
    ],
    "affectation": [
        {
            "type": "predict_value",
            "template": "Quelle sera la valeur de '{var}' après cette affectation?\n{code}",
            "choices_template": [
                "{value}",
                "{wrong_value1}",
                "{wrong_value2}",
                "Erreur"
            ],
            "correct_index": 0
        },
        {
            "type": "type_check",
            "template": "Quel est le type de la valeur '{value}'?",
            "choices_template": [
                "{correct_type}",
                "{wrong_type1}",
                "{wrong_type2}",
                "{wrong_type3}"
            ],
            "correct_index": 0
        }
    ],
    "operation": [
        {
            "type": "compute",
            "template": "Quelle sera la valeur de '{var}' après cette opération?\n{code}",
            "choices_template": [
                "{result}",
                "{wrong_result1}",
                "{wrong_result2}",
                "{wrong_result3}"
            ],
            "correct_index": 0
        },
        {
            "type": "operation_type",
            "template": "Quel type d'opération est effectuée ici?\n{code}",
            "choices_template": [
                "{correct_operation}",
                "{wrong_operation1}",
                "{wrong_operation2}",
                "{wrong_operation3}"
            ],
            "correct_index": 0
        }
    ]
}

def generate_random_scenario():
    """Génère un scénario aléatoire avec des variables"""
    # Choisir aléatoirement 4 variables
    selected_vars = random.sample(list(VAR_NAMES.keys()), 4)

    scenario = {}
    for var_name in selected_vars:
        var_info = VAR_NAMES[var_name]
        value = random.choice(var_info["values"])
        scenario[var_name] = {
            "type": var_info["type"],
            "value": value
        }

    return scenario

def format_value_for_algo(value, var_type):
    """Formate une valeur pour l'affichage en pseudo-code"""
    if var_type == "chaine":
        return f'"{value}"'
    elif var_type == "booleen":
        return "vrai" if value else "faux"
    else:
        return str(value)

def generate_simulation_steps(scenario):
    """Génère les étapes de simulation avec questions interactives"""
    steps = []
    step_num = 1
    state = {}
    code_line_num = 1  # Suivi du numéro de ligne dans le code

    # Étape 1: Début
    steps.append({
        "step_number": step_num,
        "description": "🎬 Début du programme. La mémoire est vide.",
        "state_data": {},
        "visual_data": {
            "type": "variables",
            "variables": [],
            "operation": None,
            "code_line": None
        },
        "question": None  # Pas de question pour le début
    })
    step_num += 1

    variables_created = []
    code_line_num = 2  # Ligne 1 est le commentaire
    var_index = 0

    for var_name, var_data in scenario.items():
        var_type = var_data["type"]
        value = var_data["value"]
        address = f"0x{1000 + len(variables_created) * 100:04x}"

        # Étape: Déclaration
        code_decl = f"{var_type} {var_name}"
        state[var_name] = None

        # Question pour la déclaration (seulement pour les 2 premières variables)
        question = None
        if var_index < 2:
            question_template = random.choice(QUESTION_TYPES["declaration"])
            question = {
            "type": question_template["type"],
            "question": question_template["template"].format(
                code=code_decl,
                var=var_name,
                type=var_type
            ),
            "choices": [
                choice.format(type=var_type)
                for choice in question_template["choices_template"]
            ],
                "correct_index": question_template["correct_index"],
                "explanation": f"La ligne '{code_decl}' déclare une variable nommée '{var_name}' de type {var_type}. La variable est créée en mémoire mais n'a pas encore de valeur."
            }

        var_viz = {
            "name": var_name,
            "type": var_type,
            "value": None,
            "address": address,
            "status": "new"
        }
        variables_created.append(var_viz.copy())

        steps.append({
            "step_number": step_num,
            "description": f"📦 Déclaration de la variable '{var_name}' de type {var_type}.",
            "state_data": state.copy(),
            "visual_data": {
                "type": "variables",
                "variables": [v.copy() for v in variables_created],
                "operation": f"Déclaration: {code_decl}",
                "highlight": var_name,
                "code_line": code_line_num
            },
            "question": question
        })
        step_num += 1
        code_line_num += 1

        # Étape: Affectation
        code_affect = f"{var_name} ← {format_value_for_algo(value, var_type)}"
        state[var_name] = value

        # Question pour l'affectation (seulement pour les 2 premières variables)
        question = None
        if var_index < 2:
            question_template = random.choice(QUESTION_TYPES["affectation"])

            # Générer des valeurs incorrectes
            if var_type == "entier":
                wrong_values = [value + 5, value - 3, value * 2]
            elif var_type == "reel":
                wrong_values = [value + 0.5, value - 0.25, value * 1.5]
            elif var_type == "chaine":
                all_values = NAMES_POOL + CITIES_POOL
                wrong_values = [v for v in all_values if v != value][:3]
            else:  # booleen
                wrong_values = [not value, "0", "null"]

            # Types incorrects
            all_types = ["entier", "reel", "chaine", "booleen"]
            wrong_types = [t for t in all_types if t != var_type]

            question = {
                "type": question_template["type"],
                "question": question_template["template"].format(
                    var=var_name,
                    code=code_affect,
                    value=format_value_for_algo(value, var_type)
                ),
                "choices": [
                    choice.format(
                        value=format_value_for_algo(value, var_type),
                        wrong_value1=format_value_for_algo(wrong_values[0], var_type),
                        wrong_value2=format_value_for_algo(wrong_values[1], var_type),
                        correct_type=var_type,
                        wrong_type1=wrong_types[0],
                        wrong_type2=wrong_types[1],
                        wrong_type3=wrong_types[2]
                    )
                    for choice in question_template["choices_template"]
                ],
                "correct_index": question_template["correct_index"],
                "explanation": f"La variable '{var_name}' reçoit la valeur {format_value_for_algo(value, var_type)} de type {var_type}."
            }

        # Mettre à jour la visualisation
        for v in variables_created:
            if v["name"] == var_name:
                v["value"] = value
                v["status"] = "modified"
            else:
                v["status"] = None

        steps.append({
            "step_number": step_num,
            "description": f"✏️ Affectation: '{var_name}' = {format_value_for_algo(value, var_type)}",
            "state_data": state.copy(),
            "visual_data": {
                "type": "variables",
                "variables": [v.copy() for v in variables_created],
                "operation": f"Affectation: {code_affect}",
                "highlight": var_name,
                "code_line": code_line_num
            },
            "question": question
        })
        step_num += 1
        code_line_num += 2  # +1 pour l'affectation, +1 pour la ligne vide
        var_index += 1

    # Ajouter une opération finale si possible
    numeric_vars = [(name, data) for name, data in scenario.items()
                    if data["type"] in ["entier", "reel"]]

    if numeric_vars:
        var_name, var_data = random.choice(numeric_vars)
        old_value = var_data["value"]
        operation = random.choice(["+", "-", "*"])
        operand = random.choice([1, 2, 5, 10] if var_data["type"] == "entier" else [0.5, 1.0, 2.0])

        if operation == "+":
            new_value = old_value + operand
            op_name = "addition"
        elif operation == "-":
            new_value = old_value - operand
            op_name = "soustraction"
        else:  # *
            new_value = old_value * operand
            op_name = "multiplication"

        code_op = f"{var_name} ← {var_name} {operation} {operand}"
        state[var_name] = new_value

        # Question pour l'opération
        question_template = random.choice(QUESTION_TYPES["operation"])

        wrong_results = [
            old_value + operand if operation != "+" else old_value - operand,
            old_value * operand if operation != "*" else old_value + operand,
            old_value
        ]

        operations = ["addition", "soustraction", "multiplication", "division"]
        wrong_operations = [op for op in operations if op != op_name]

        question = {
            "type": question_template["type"],
            "question": question_template["template"].format(
                var=var_name,
                code=code_op
            ),
            "choices": [
                choice.format(
                    result=new_value,
                    wrong_result1=wrong_results[0],
                    wrong_result2=wrong_results[1],
                    wrong_result3=wrong_results[2],
                    correct_operation=op_name,
                    wrong_operation1=wrong_operations[0],
                    wrong_operation2=wrong_operations[1],
                    wrong_operation3=wrong_operations[2]
                )
                for choice in question_template["choices_template"]
            ],
            "correct_index": question_template["correct_index"],
            "explanation": f"L'opération {code_op} effectue une {op_name}. La nouvelle valeur de '{var_name}' est {new_value}."
        }

        # Mettre à jour la visualisation
        for v in variables_created:
            if v["name"] == var_name:
                v["value"] = new_value
                v["status"] = "modified"
            else:
                v["status"] = None

        steps.append({
            "step_number": step_num,
            "description": f"🔢 Opération: {code_op}",
            "state_data": state.copy(),
            "visual_data": {
                "type": "variables",
                "variables": [v.copy() for v in variables_created],
                "operation": f"Opération: {code_op}",
                "highlight": var_name,
                "code_line": code_line_num
            },
            "question": question
        })
        step_num += 1
        code_line_num += 1

    # Étape finale
    for v in variables_created:
        v["status"] = None

    steps.append({
        "step_number": step_num,
        "description": "✅ Fin du programme. État final de la mémoire.",
        "state_data": state.copy(),
        "visual_data": {
            "type": "variables",
            "variables": [v.copy() for v in variables_created],
            "operation": "Programme terminé",
            "highlight": None,
            "code_line": None
        },
        "question": None
    })

    return steps

def generate_algorithm_code(scenario):
    """Génère le code de l'algorithme"""
    lines = ["// Déclaration et initialisation"]

    for var_name, var_data in scenario.items():
        var_type = var_data["type"]
        value = var_data["value"]

        lines.append(f"{var_type} {var_name}")
        lines.append(f"{var_name} ← {format_value_for_algo(value, var_type)}")
        lines.append("")

    # Ajouter une opération si possible
    numeric_vars = [(name, data) for name, data in scenario.items()
                    if data["type"] in ["entier", "reel"]]
    if numeric_vars:
        lines.append("// Opération")
        var_name, var_data = random.choice(numeric_vars)
        operation = random.choice(["+", "-", "*"])
        operand = random.choice([1, 2, 5, 10] if var_data["type"] == "entier" else [0.5, 1.0, 2.0])
        lines.append(f"{var_name} ← {var_name} {operation} {operand}")

    return "\n".join(lines)

def create_interactive_simulation():
    """Crée la simulation interactive avec modes"""
    print("Creation de la simulation interactive des variables...")

    # Trouver ou créer le module et la leçon
    module = Module.objects.filter(order=2).first()
    if not module:
        print("ERREUR: Module 2 introuvable")
        return

    lesson = Lesson.objects.filter(module=module, order=1).first()
    if not lesson:
        print("ERREUR: Lecon 1 du Module 2 introuvable")
        return

    print(f"Module: {module.title}")
    print(f"Lecon: {lesson.title}")

    # Supprimer l'ancienne simulation si elle existe
    old_sim = Simulation.objects.filter(lesson=lesson, title="Variables Interactives").first()
    if old_sim:
        old_sim.delete()
        print("Ancienne simulation supprimee")

    # Générer un scénario aléatoire
    scenario = generate_random_scenario()
    print(f"\nScenario genere: {list(scenario.keys())}")

    # Générer le code
    algorithm_code = generate_algorithm_code(scenario)

    # Générer les étapes avec questions
    steps = generate_simulation_steps(scenario)
    print(f"OK: {len(steps)} etapes generees")

    # Créer la simulation
    simulation = Simulation.objects.create(
        lesson=lesson,
        title="Variables Interactives",
        description="Simulation interactive sur les variables avec deux modes: observateur et interactif. Le code change à chaque session!",
        algorithm_code=algorithm_code,
        order=2
    )

    # Créer les étapes
    for step_data in steps:
        SimulationStep.objects.create(
            simulation=simulation,
            step_number=step_data["step_number"],
            description=step_data["description"],
            state_data=step_data["state_data"],
            visual_data={
                **step_data["visual_data"],
                "question": step_data.get("question")  # Ajouter la question dans visual_data
            }
        )

    print(f"\nOK: Simulation creee avec succes!")
    print(f"   ID: {simulation.id}")
    print(f"   Etapes: {len(steps)}")
    print(f"   Questions interactives: {sum(1 for s in steps if s.get('question'))}")

if __name__ == "__main__":
    create_interactive_simulation()
    print("\nTermine!")
