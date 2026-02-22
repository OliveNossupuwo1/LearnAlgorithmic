import os
import sys
import django
import json

# Setup Django
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(script_dir, 'backend')
sys.path.insert(0, backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.chdir(backend_dir)
django.setup()

from courses.models import Lesson, Simulation, SimulationStep

# Lecon 6: Structures conditionnelles completes (SI...SINON SI...SINON)
lesson = Lesson.objects.get(id=6)
print(f"Lecon: {lesson.title}")

# Supprimer les anciennes simulations
Simulation.objects.filter(lesson=lesson).delete()
print("Anciennes simulations supprimees")

# ==================== SIMULATION 1: MODE OBSERVATEUR ====================
algorithm_code = """Algorithme AttributionMention
Variables: note : Entier
Debut
    Ecrire("Entrez la note:")
    Lire(note)
    Si note >= 16 Alors
        Ecrire("Mention Tres Bien")
    Sinon Si note >= 14 Alors
        Ecrire("Mention Bien")
    Sinon Si note >= 12 Alors
        Ecrire("Mention Assez Bien")
    Sinon Si note >= 10 Alors
        Ecrire("Admis sans mention")
    Sinon
        Ecrire("Non admis")
    Fin Si
    Ecrire("Fin du programme")
Fin"""

sim_observer = Simulation.objects.create(
    lesson=lesson,
    title="Attribution de mention (Mode Observateur)",
    description="Observez comment SI...SINON SI...SINON permet de tester plusieurs conditions en cascade.",
    simulation_type="visualization",
    algorithm_code=algorithm_code
)
print(f"Simulation Observateur creee: ID={sim_observer.id}")

# Steps pour le mode observateur
observer_steps = [
    {
        "step_number": 1,
        "description": "Introduction a la structure SI...SINON SI...SINON",
        "state_data": {},
        "visual_data": {
            "title": "Structure conditionnelle complete",
            "explanation": "La structure SI...SINON SI...SINON permet de tester PLUSIEURS conditions en cascade. Des que l'une est vraie, son bloc s'execute et on sort de la structure.",
            "syntax": "Si condition1 Alors\n    instructions1\nSinon Si condition2 Alors\n    instructions2\nSinon Si condition3 Alors\n    instructions3\nSinon\n    instructions_defaut\nFin Si",
            "key_points": [
                "On peut avoir autant de SINON SI que necessaire",
                "Les conditions sont testees dans l'ORDRE",
                "Des qu'une condition est VRAIE, on execute son bloc et on SORT",
                "Le bloc SINON s'execute si AUCUNE condition n'est vraie"
            ]
        }
    },
    {
        "step_number": 2,
        "description": "Declaration et saisie de la note",
        "state_data": {"note": None},
        "visual_data": {
            "title": "Lecture de la note",
            "highlight": "Variables: note : Entier\nLire(note)",
            "input_prompt": "Entrez la note:",
            "user_input": "17",
            "variables_after": {"note": 17},
            "explanation": "L'utilisateur entre la note 17. Cette valeur va etre testee par plusieurs conditions."
        }
    },
    {
        "step_number": 3,
        "description": "Test de la premiere condition (note >= 16)",
        "state_data": {"note": 17},
        "visual_data": {
            "title": "Scenario 1: note = 17 - Test condition 1",
            "highlight": "Si note >= 16 Alors",
            "condition": "note >= 16",
            "evaluation": "17 >= 16",
            "result": True,
            "explanation": "La premiere condition est VRAIE (17 >= 16). On execute le bloc correspondant et on SORT de la structure."
        }
    },
    {
        "step_number": 4,
        "description": "Execution du bloc SI (note >= 16)",
        "state_data": {"note": 17},
        "visual_data": {
            "title": "Execution: Mention Tres Bien",
            "highlight": "Ecrire(\"Mention Tres Bien\")",
            "output": "Mention Tres Bien",
            "arrow": "On SORT immediatement de toute la structure SI",
            "skipped_code": "Sinon Si note >= 14 Alors... (ignore car premiere condition vraie)",
            "explanation": "Puisque 17 >= 16, on affiche 'Mention Tres Bien'. Les autres conditions NE SONT PAS testees."
        }
    },
    {
        "step_number": 5,
        "description": "Nouveau scenario avec note = 13",
        "state_data": {"note": 13},
        "visual_data": {
            "title": "Scenario 2: note = 13 - Test condition 1",
            "highlight": "Si note >= 16 Alors",
            "variables_after": {"note": 13},
            "condition": "note >= 16",
            "evaluation": "13 >= 16",
            "result": False,
            "explanation": "Avec note = 13, la premiere condition est FAUSSE. On passe a la condition suivante (SINON SI)."
        }
    },
    {
        "step_number": 6,
        "description": "Test de la deuxieme condition (note >= 14)",
        "state_data": {"note": 13},
        "visual_data": {
            "title": "Scenario 2: note = 13 - Test condition 2",
            "highlight": "Sinon Si note >= 14 Alors",
            "condition": "note >= 14",
            "evaluation": "13 >= 14",
            "result": False,
            "explanation": "La deuxieme condition est aussi FAUSSE (13 < 14). On continue vers le SINON SI suivant."
        }
    },
    {
        "step_number": 7,
        "description": "Test de la troisieme condition (note >= 12)",
        "state_data": {"note": 13},
        "visual_data": {
            "title": "Scenario 2: note = 13 - Test condition 3",
            "highlight": "Sinon Si note >= 12 Alors",
            "condition": "note >= 12",
            "evaluation": "13 >= 12",
            "result": True,
            "explanation": "La troisieme condition est VRAIE (13 >= 12). On execute ce bloc et on sort."
        }
    },
    {
        "step_number": 8,
        "description": "Execution du bloc SINON SI (note >= 12)",
        "state_data": {"note": 13},
        "visual_data": {
            "title": "Execution: Mention Assez Bien",
            "highlight": "Ecrire(\"Mention Assez Bien\")",
            "output": "Mention Assez Bien",
            "skipped_code": "Sinon Si note >= 10... et Sinon... (ignores)",
            "explanation": "Avec note = 13, on obtient 'Mention Assez Bien'. Les conditions suivantes ne sont PAS testees."
        }
    },
    {
        "step_number": 9,
        "description": "Nouveau scenario avec note = 8",
        "state_data": {"note": 8},
        "visual_data": {
            "title": "Scenario 3: note = 8 - Toutes les conditions",
            "variables_after": {"note": 8},
            "explanation": "Avec note = 8, testons toutes les conditions...",
            "key_points": [
                "8 >= 16 ? NON (FAUX)",
                "8 >= 14 ? NON (FAUX)",
                "8 >= 12 ? NON (FAUX)",
                "8 >= 10 ? NON (FAUX)",
                "=> On va dans le bloc SINON"
            ]
        }
    },
    {
        "step_number": 10,
        "description": "Execution du bloc SINON (aucune condition vraie)",
        "state_data": {"note": 8},
        "visual_data": {
            "title": "Execution: Bloc SINON",
            "highlight": "Sinon\n    Ecrire(\"Non admis\")",
            "output": "Non admis",
            "explanation": "Quand AUCUNE condition n'est vraie, le bloc SINON s'execute. C'est le cas par defaut."
        }
    },
    {
        "step_number": 11,
        "description": "Importance de l'ordre des conditions",
        "state_data": {},
        "visual_data": {
            "title": "ATTENTION: L'ordre des conditions est CRUCIAL!",
            "explanation": "Dans SI...SINON SI, les conditions sont testees dans l'ordre. Si on avait mis 'note >= 10' en premier, une note de 17 irait dans ce bloc!",
            "key_points": [
                "Toujours mettre les conditions les plus RESTRICTIVES en premier",
                "Les conditions inclusives (>=) doivent aller du plus grand au plus petit",
                "L'ordre: 16, 14, 12, 10 est correct",
                "L'ordre: 10, 12, 14, 16 serait INCORRECT"
            ],
            "syntax_reminder": "Si note >= 16 Alors  (teste d'abord le plus restrictif)\nSinon Si note >= 14 Alors\nSinon Si note >= 12 Alors\nSinon Si note >= 10 Alors\nSinon\nFin Si"
        }
    },
    {
        "step_number": 12,
        "description": "Resume de la structure complete",
        "state_data": {},
        "visual_data": {
            "title": "Resume: SI...SINON SI...SINON",
            "key_points": [
                "Permet de tester PLUSIEURS conditions alternatives",
                "Les conditions sont evaluees de HAUT en BAS",
                "Des qu'une condition est VRAIE, son bloc s'execute et on SORT",
                "Le bloc SINON s'execute si AUCUNE condition n'est vraie",
                "L'ORDRE des conditions est important!",
                "On peut avoir 0, 1 ou plusieurs SINON SI",
                "Le SINON final est optionnel"
            ],
            "syntax_reminder": "Si condition1 Alors\n    bloc1\nSinon Si condition2 Alors\n    bloc2\nSinon\n    bloc_defaut\nFin Si"
        }
    }
]

for step_data in observer_steps:
    SimulationStep.objects.create(
        simulation=sim_observer,
        step_number=step_data["step_number"],
        description=step_data["description"],
        state_data=step_data["state_data"],
        visual_data=step_data["visual_data"]
    )
print(f"  -> {len(observer_steps)} etapes creees pour le mode observateur")

# ==================== SIMULATION 2: MODE INTERACTIF ====================
interactive_code = """Algorithme ClassificationAge
Variables: age : Entier
Debut
    Ecrire("Entrez l'age:")
    Lire(age)
    Si age >= 65 Alors
        Ecrire("Senior")
    Sinon Si age >= 18 Alors
        Ecrire("Adulte")
    Sinon Si age >= 12 Alors
        Ecrire("Adolescent")
    Sinon
        Ecrire("Enfant")
    Fin Si
Fin"""

sim_interactive = Simulation.objects.create(
    lesson=lesson,
    title="Structure SI...SINON SI...SINON (Mode Interactif)",
    description="Testez vos connaissances sur les structures conditionnelles completes avec des questions.",
    simulation_type="interactive",
    algorithm_code=interactive_code
)
print(f"Simulation Interactive creee: ID={sim_interactive.id}")

# Steps pour le mode interactif (questions)
interactive_steps = [
    {
        "step_number": 1,
        "description": "Comprendre le flux d'execution",
        "state_data": {},
        "visual_data": {
            "question": "Dans une structure SI...SINON SI...SINON, que se passe-t-il quand la premiere condition est VRAIE?",
            "options": [
                "On teste quand meme toutes les autres conditions",
                "On execute le premier bloc ET on sort de la structure",
                "On execute tous les blocs",
                "On passe directement au SINON"
            ],
            "correct_answer": 1,
            "explanation": "Des qu'une condition est VRAIE, son bloc s'execute et on SORT immediatement de toute la structure SI...SINON SI...SINON."
        }
    },
    {
        "step_number": 2,
        "description": "Evaluation avec age = 70",
        "state_data": {"age": 70},
        "visual_data": {
            "variables_after": {"age": 70},
            "question": "Avec age = 70, qu'affiche le programme?",
            "options": [
                "Adulte",
                "Senior",
                "Adolescent",
                "Enfant"
            ],
            "correct_answer": 1,
            "explanation": "70 >= 65 est VRAI, donc on affiche 'Senior' et on sort. Les autres conditions ne sont pas testees."
        }
    },
    {
        "step_number": 3,
        "description": "Evaluation avec age = 25",
        "state_data": {"age": 25},
        "visual_data": {
            "variables_after": {"age": 25},
            "question": "Avec age = 25, qu'affiche le programme?",
            "options": [
                "Senior",
                "Adulte",
                "Adolescent",
                "Enfant"
            ],
            "correct_answer": 1,
            "explanation": "25 >= 65? NON. 25 >= 18? OUI. Donc on affiche 'Adulte' et on sort."
        }
    },
    {
        "step_number": 4,
        "description": "Evaluation avec age = 15",
        "state_data": {"age": 15},
        "visual_data": {
            "variables_after": {"age": 15},
            "question": "Avec age = 15, qu'affiche le programme?",
            "options": [
                "Adulte",
                "Adolescent",
                "Enfant",
                "Rien"
            ],
            "correct_answer": 1,
            "explanation": "15 >= 65? NON. 15 >= 18? NON. 15 >= 12? OUI. Donc on affiche 'Adolescent'."
        }
    },
    {
        "step_number": 5,
        "description": "Evaluation avec age = 8",
        "state_data": {"age": 8},
        "visual_data": {
            "variables_after": {"age": 8},
            "question": "Avec age = 8, qu'affiche le programme?",
            "options": [
                "Adolescent",
                "Adulte",
                "Enfant",
                "Erreur"
            ],
            "correct_answer": 2,
            "explanation": "8 >= 65? NON. 8 >= 18? NON. 8 >= 12? NON. Aucune condition n'est vraie, donc on va dans le SINON et on affiche 'Enfant'."
        }
    },
    {
        "step_number": 6,
        "description": "Cas limite: age = 18",
        "state_data": {"age": 18},
        "visual_data": {
            "variables_after": {"age": 18},
            "question": "Avec age = 18 exactement, qu'affiche le programme?",
            "options": [
                "Adolescent (car 18 n'est pas > 18)",
                "Adulte (car 18 >= 18 est VRAI)",
                "Senior",
                "Enfant"
            ],
            "correct_answer": 1,
            "explanation": "18 >= 65? NON. 18 >= 18? OUI (car >= signifie superieur OU egal). Donc 'Adulte' s'affiche."
        }
    },
    {
        "step_number": 7,
        "description": "Importance de l'ordre",
        "state_data": {},
        "visual_data": {
            "question": "Si on inversait l'ordre des conditions (12, 18, 65), que se passerait-il pour age = 70?",
            "options": [
                "Toujours 'Senior' car 70 >= 65",
                "'Adolescent' car 70 >= 12 serait teste en premier",
                "Erreur de syntaxe",
                "Rien ne s'afficherait"
            ],
            "correct_answer": 1,
            "explanation": "ATTENTION! Si 'age >= 12' etait teste en premier, 70 >= 12 serait VRAI et on afficherait 'Adolescent' au lieu de 'Senior'. L'ordre des conditions est CRUCIAL!"
        }
    },
    {
        "step_number": 8,
        "description": "Bloc SINON optionnel",
        "state_data": {},
        "visual_data": {
            "question": "Le bloc SINON final est-il obligatoire dans une structure SI...SINON SI?",
            "options": [
                "Oui, sinon erreur de syntaxe",
                "Non, il est optionnel",
                "Oui, mais seulement s'il y a plus de 2 SINON SI",
                "Non, mais il faut au moins un SINON SI"
            ],
            "correct_answer": 1,
            "explanation": "Le SINON final est optionnel. Sans lui, si aucune condition n'est vraie, aucun bloc n'est execute et le programme continue apres FIN SI."
        }
    },
    {
        "step_number": 9,
        "description": "Nombre de SINON SI",
        "state_data": {},
        "visual_data": {
            "question": "Combien de SINON SI peut-on avoir dans une structure conditionnelle complete?",
            "options": [
                "Maximum 3",
                "Maximum 5",
                "Exactement 1",
                "Autant qu'on veut"
            ],
            "correct_answer": 3,
            "explanation": "On peut avoir autant de SINON SI que necessaire. La structure s'adapte au nombre de cas a traiter."
        }
    },
    {
        "step_number": 10,
        "description": "Difference avec plusieurs SI independants",
        "state_data": {},
        "visual_data": {
            "question": "Quelle est la difference entre 'SI...SINON SI' et plusieurs 'SI' independants?",
            "options": [
                "Aucune difference, c'est pareil",
                "SINON SI: des qu'une condition est vraie, on sort. Plusieurs SI: toutes les conditions sont testees",
                "Plusieurs SI est plus rapide",
                "SINON SI ne peut pas avoir de SINON"
            ],
            "correct_answer": 1,
            "explanation": "Avec SI...SINON SI, des qu'une condition est vraie, les autres ne sont PAS testees. Avec plusieurs SI independants, TOUTES les conditions sont testees meme si plusieurs sont vraies."
        }
    }
]

for step_data in interactive_steps:
    SimulationStep.objects.create(
        simulation=sim_interactive,
        step_number=step_data["step_number"],
        description=step_data["description"],
        state_data=step_data["state_data"],
        visual_data=step_data["visual_data"]
    )
print(f"  -> {len(interactive_steps)} questions creees pour le mode interactif")

print("\n=== Simulations pour la lecon 6 creees avec succes! ===")
print(f"  - Mode Observateur: ID={sim_observer.id}")
print(f"  - Mode Interactif: ID={sim_interactive.id}")
