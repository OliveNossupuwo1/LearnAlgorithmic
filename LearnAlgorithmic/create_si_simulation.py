import os
import sys
import django

# Setup Django
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(script_dir, 'backend')
sys.path.insert(0, backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.chdir(backend_dir)
django.setup()

from courses.models import Lesson, Simulation

lesson = Lesson.objects.get(id=4)
print(f"Lesson: {lesson.title}")

# Supprimer les anciennes simulations si elles existent
Simulation.objects.filter(lesson=lesson).delete()
print("Anciennes simulations supprimees")

# Simulation 1: Mode Observateur - Verification de l'age pour voter
simulation_observer = Simulation.objects.create(
    lesson=lesson,
    title="Verification de l'age pour voter (Mode Observateur)",
    description="Observez comment la structure SI...ALORS...FIN SI permet de verifier si une personne peut voter selon son age.",
    simulation_type="visualization",
    code="""Algorithme VerificationAge
Variables: age : Entier
Debut
    Ecrire("Entrez votre age:")
    Lire(age)
    Si age >= 18 Alors
        Ecrire("Vous pouvez voter!")
    Fin Si
    Ecrire("Fin du programme")
Fin""",
    steps=[
        {
            "step": 1,
            "title": "Declaration et lecture",
            "description": "On declare la variable 'age' et on demande a l'utilisateur de saisir son age.",
            "code_highlight": "Variables: age : Entier\nLire(age)",
            "visual_data": {
                "variables": {"age": "?"},
                "input_prompt": "Entrez votre age:",
                "user_input": "20",
                "explanation": "L'utilisateur entre la valeur 20 qui est stockee dans la variable 'age'."
            }
        },
        {
            "step": 2,
            "title": "Evaluation de la condition",
            "description": "On evalue si l'age est superieur ou egal a 18.",
            "code_highlight": "Si age >= 18 Alors",
            "visual_data": {
                "variables": {"age": 20},
                "condition": "age >= 18",
                "evaluation": "20 >= 18",
                "result": True,
                "explanation": "La condition 'age >= 18' est evaluee. Avec age = 20, on a 20 >= 18 qui est VRAI."
            }
        },
        {
            "step": 3,
            "title": "Execution du bloc SI (condition vraie)",
            "description": "Comme la condition est VRAIE, on execute les instructions a l'interieur du bloc SI.",
            "code_highlight": "Ecrire(\"Vous pouvez voter!\")",
            "visual_data": {
                "variables": {"age": 20},
                "output": "Vous pouvez voter!",
                "explanation": "La condition etant vraie, le message 'Vous pouvez voter!' est affiche."
            }
        },
        {
            "step": 4,
            "title": "Fin du SI et suite du programme",
            "description": "Apres le FIN SI, le programme continue normalement.",
            "code_highlight": "Fin Si\nEcrire(\"Fin du programme\")",
            "visual_data": {
                "variables": {"age": 20},
                "output": "Fin du programme",
                "explanation": "Le programme affiche 'Fin du programme' et se termine."
            }
        },
        {
            "step": 5,
            "title": "Cas ou la condition est FAUSSE",
            "description": "Voyons maintenant ce qui se passe si l'age est inferieur a 18.",
            "code_highlight": "Si age >= 18 Alors",
            "visual_data": {
                "variables": {"age": 15},
                "condition": "age >= 18",
                "evaluation": "15 >= 18",
                "result": False,
                "explanation": "Avec age = 15, la condition 15 >= 18 est FAUSSE. Le bloc SI est ignore."
            }
        },
        {
            "step": 6,
            "title": "Le bloc SI est ignore",
            "description": "Quand la condition est fausse, le programme saute directement apres FIN SI.",
            "code_highlight": "Fin Si\nEcrire(\"Fin du programme\")",
            "visual_data": {
                "variables": {"age": 15},
                "skipped": "Ecrire(\"Vous pouvez voter!\")",
                "output": "Fin du programme",
                "explanation": "Le message 'Vous pouvez voter!' n'est PAS affiche car la condition etait fausse. Seul 'Fin du programme' est affiche."
            }
        }
    ]
)

print(f"Simulation observateur creee: ID={simulation_observer.id}")

# Simulation 2: Mode Interactif - Questions sur SI...ALORS...FIN SI
simulation_interactive = Simulation.objects.create(
    lesson=lesson,
    title="Structure SI...ALORS...FIN SI (Mode Interactif)",
    description="Testez vos connaissances sur la structure conditionnelle simple avec des questions interactives.",
    simulation_type="interactive",
    code="""Algorithme TestNote
Variables: note : Entier
Debut
    Ecrire("Entrez la note:")
    Lire(note)
    Si note >= 10 Alors
        Ecrire("Admis")
    Fin Si
Fin""",
    steps=[
        {
            "step": 1,
            "title": "Comprendre la condition",
            "description": "Analysez le code ci-dessus et repondez aux questions.",
            "code_highlight": "Si note >= 10 Alors",
            "visual_data": {
                "question": "Quelle est la condition evaluee dans ce SI ?",
                "options": [
                    "note = 10",
                    "note >= 10",
                    "note > 10",
                    "note <= 10"
                ],
                "correct_answer": 1,
                "explanation": "La condition est 'note >= 10', c'est-a-dire 'note superieur ou egal a 10'."
            }
        },
        {
            "step": 2,
            "title": "Evaluation avec note = 15",
            "description": "Si l'utilisateur entre note = 15, que se passe-t-il ?",
            "code_highlight": "Si note >= 10 Alors\n    Ecrire(\"Admis\")\nFin Si",
            "visual_data": {
                "variables": {"note": 15},
                "question": "Si note = 15, qu'affiche le programme ?",
                "options": [
                    "Rien",
                    "Admis",
                    "Refuse",
                    "15"
                ],
                "correct_answer": 1,
                "explanation": "Avec note = 15, la condition 15 >= 10 est VRAIE, donc 'Admis' est affiche."
            }
        },
        {
            "step": 3,
            "title": "Evaluation avec note = 8",
            "description": "Si l'utilisateur entre note = 8, que se passe-t-il ?",
            "code_highlight": "Si note >= 10 Alors\n    Ecrire(\"Admis\")\nFin Si",
            "visual_data": {
                "variables": {"note": 8},
                "question": "Si note = 8, qu'affiche le programme ?",
                "options": [
                    "Admis",
                    "Refuse",
                    "Rien (le bloc SI est ignore)",
                    "8"
                ],
                "correct_answer": 2,
                "explanation": "Avec note = 8, la condition 8 >= 10 est FAUSSE. Le bloc SI est ignore et rien n'est affiche pour cette partie."
            }
        },
        {
            "step": 4,
            "title": "Cas limite",
            "description": "Testons avec la valeur exacte de la condition.",
            "code_highlight": "Si note >= 10 Alors",
            "visual_data": {
                "variables": {"note": 10},
                "question": "Si note = 10, la condition 'note >= 10' est-elle vraie ou fausse ?",
                "options": [
                    "Fausse (10 n'est pas > 10)",
                    "Vraie (10 est >= 10)",
                    "Erreur",
                    "Indetermine"
                ],
                "correct_answer": 1,
                "explanation": "La condition est 'superieur OU EGAL'. Donc 10 >= 10 est VRAI car 10 est egal a 10."
            }
        },
        {
            "step": 5,
            "title": "Structure syntaxique",
            "description": "Identifiez les elements de la structure conditionnelle.",
            "code_highlight": "Si note >= 10 Alors\n    Ecrire(\"Admis\")\nFin Si",
            "visual_data": {
                "question": "Quel mot-cle termine obligatoirement un bloc SI simple ?",
                "options": [
                    "Sinon",
                    "Fin",
                    "Fin Si",
                    "Alors"
                ],
                "correct_answer": 2,
                "explanation": "Un bloc SI simple se termine toujours par 'Fin Si'. 'Sinon' est utilise pour les structures alternatives."
            }
        },
        {
            "step": 6,
            "title": "Application pratique",
            "description": "Completez la condition pour verifier si un nombre est positif.",
            "code_highlight": "Si ??? Alors\n    Ecrire(\"Positif\")\nFin Si",
            "visual_data": {
                "variables": {"nombre": "?"},
                "question": "Pour afficher 'Positif' uniquement si nombre > 0, quelle condition faut-il ecrire ?",
                "options": [
                    "nombre = 0",
                    "nombre >= 0",
                    "nombre > 0",
                    "nombre < 0"
                ],
                "correct_answer": 2,
                "explanation": "Pour qu'un nombre soit strictement positif, il doit etre > 0 (superieur a zero, pas egal)."
            }
        }
    ]
)

print(f"Simulation interactive creee: ID={simulation_interactive.id}")
print("Simulations creees avec succes!")
