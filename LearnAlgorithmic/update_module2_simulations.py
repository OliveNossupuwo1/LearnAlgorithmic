"""
Script pour mettre a jour les simulations du Module 2 (Variables et Constantes)
"""
import os
import sys
import django

# Configuration Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Lesson, Simulation, Module

def update_module2_simulations():
    print("=== Verification du Module 2 ===\n")

    # Trouver le module 2
    module2 = Module.objects.filter(order=2).first()
    if not module2:
        print("[ERREUR] Module 2 non trouve!")
        return

    print(f"Module 2: {module2.title}")
    print(f"Lecons dans ce module:")

    for lesson in Lesson.objects.filter(module=module2):
        print(f"\n  Lecon: {lesson.title}")
        sims = Simulation.objects.filter(lesson=lesson)
        if sims.exists():
            for sim in sims:
                print(f"    - Simulation: {sim.title}")
        else:
            print(f"    (Pas de simulation)")

    print("\n=== Mise a jour des simulations ===\n")

    # Chercher la lecon sur les Variables
    lesson_variables = Lesson.objects.filter(
        module=module2,
        title__icontains='variable'
    ).first()

    if lesson_variables:
        print(f"Lecon Variables trouvee: {lesson_variables.title}")

        # Supprimer les anciennes simulations
        old_sims = Simulation.objects.filter(lesson=lesson_variables)
        if old_sims.exists():
            print(f"  Suppression de {old_sims.count()} ancienne(s) simulation(s)")
            old_sims.delete()

        # Creer une nouvelle simulation avec un titre clair
        sim = Simulation.objects.create(
            lesson=lesson_variables,
            title="Simulation VARIABLE",
            description="Visualisez l'execution pas a pas d'algorithmes avec variables",
            algorithm_code="""Algorithme TestVariables
Variables: x, y, somme : Entier
Debut
    x <- 5
    y <- 3
    somme <- x + y
    Ecrire("La somme est: ", somme)
Fin""",
            order=1
        )
        print(f"  [OK] Nouvelle simulation creee: {sim.title}")
    else:
        print("[ATTENTION] Lecon Variables non trouvee")
        # Essayer de trouver une lecon avec 'type' dans le titre
        lesson_types = Lesson.objects.filter(
            module=module2,
            title__icontains='type'
        ).first()
        if lesson_types:
            print(f"  Lecon Types trouvee: {lesson_types.title}")
            # Supprimer les anciennes simulations
            old_sims = Simulation.objects.filter(lesson=lesson_types)
            if old_sims.exists():
                print(f"  Suppression de {old_sims.count()} ancienne(s) simulation(s)")
                old_sims.delete()

            sim = Simulation.objects.create(
                lesson=lesson_types,
                title="Simulation VARIABLE - Types de donnees",
                description="Visualisez l'execution pas a pas d'algorithmes avec variables",
                algorithm_code="""Algorithme TestVariables
Variables: x, y, somme : Entier
Debut
    x <- 5
    y <- 3
    somme <- x + y
    Ecrire("La somme est: ", somme)
Fin""",
                order=1
            )
            print(f"  [OK] Nouvelle simulation creee: {sim.title}")

    # Chercher la lecon sur les Constantes
    lesson_constantes = Lesson.objects.filter(
        module=module2,
        title__icontains='constante'
    ).first()

    if lesson_constantes:
        print(f"\nLecon Constantes trouvee: {lesson_constantes.title}")

        # Supprimer les anciennes simulations
        old_sims = Simulation.objects.filter(lesson=lesson_constantes)
        if old_sims.exists():
            print(f"  Suppression de {old_sims.count()} ancienne(s) simulation(s)")
            old_sims.delete()

        # Creer une nouvelle simulation avec un titre clair
        sim = Simulation.objects.create(
            lesson=lesson_constantes,
            title="Simulation CONSTANTE",
            description="Visualisez la difference entre variables et constantes",
            algorithm_code="""Algorithme TestConstante
Constante PI = 3.14
Variables: rayon, perimetre : Reel
Debut
    rayon <- 5
    perimetre <- 2 * PI * rayon
    Ecrire("Perimetre: ", perimetre)
Fin""",
            order=1
        )
        print(f"  [OK] Nouvelle simulation creee: {sim.title}")
    else:
        print("\n[ATTENTION] Lecon Constantes non trouvee")

    print("\n=== Resume final ===\n")
    for lesson in Lesson.objects.filter(module=module2):
        print(f"Lecon: {lesson.title}")
        for sim in Simulation.objects.filter(lesson=lesson):
            print(f"  - {sim.title}")

if __name__ == '__main__':
    update_module2_simulations()
    print("\nTermine!")
