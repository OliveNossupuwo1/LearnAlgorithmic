"""
Script pour créer les simulations du Module 4 (Boucles et itérations)
"""
import os
import sys
import django

# Configuration Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Lesson, Simulation

def create_module4_simulations():
    # Leçon 7: Structure POUR
    lesson_pour = Lesson.objects.filter(title__icontains='POUR').first()
    if lesson_pour:
        sim, created = Simulation.objects.get_or_create(
            lesson=lesson_pour,
            title="Simulation Boucle POUR",
            defaults={
                'description': "Visualisez l'exécution pas à pas d'une boucle POUR avec calcul de somme",
                'algorithm_code': """Algorithme SommeEntiers
Variables: i, somme, N : Entier
Debut
    N <- 5
    somme <- 0
    Pour i De 1 A N Faire
        somme <- somme + i
    Fin Pour
    Ecrire("Somme = ", somme)
Fin""",
                'order': 1
            }
        )
        if created:
            print(f"[OK] Simulation creee pour: {lesson_pour.title}")
        else:
            print(f"[INFO] Simulation existe deja pour: {lesson_pour.title}")
    else:
        print("[ERREUR] Lecon POUR non trouvee")

    # Leçon 8: Structure TANT QUE
    lesson_tantque = Lesson.objects.filter(title__icontains='TANT QUE').first()
    if lesson_tantque:
        sim, created = Simulation.objects.get_or_create(
            lesson=lesson_tantque,
            title="Simulation Boucle TANT QUE",
            defaults={
                'description': "Visualisez l'exécution pas à pas d'une boucle TANT QUE avec calcul de factorielle",
                'algorithm_code': """Algorithme Factorielle
Variables: N, fact, i : Entier
Debut
    N <- 5
    fact <- 1
    i <- 1
    Tant Que i <= N Faire
        fact <- fact * i
        i <- i + 1
    Fin Tant Que
    Ecrire(N, "! = ", fact)
Fin""",
                'order': 1
            }
        )
        if created:
            print(f"[OK] Simulation creee pour: {lesson_tantque.title}")
        else:
            print(f"[INFO] Simulation existe deja pour: {lesson_tantque.title}")
    else:
        print("[ERREUR] Lecon TANT QUE non trouvee")

    # Leçon 9: Structure REPETER...JUSQU'A
    lesson_repeter = Lesson.objects.filter(title__icontains='REPETER').first()
    if lesson_repeter:
        sim, created = Simulation.objects.get_or_create(
            lesson=lesson_repeter,
            title="Simulation Boucle REPETER...JUSQU'A",
            defaults={
                'description': "Visualisez l'exécution pas à pas d'une boucle REPETER...JUSQU'A avec validation",
                'algorithm_code': """Algorithme ValidationMotDePasse
Variables: motDePasse : Chaine
Debut
    Repeter
        Ecrire("Entrez le mot de passe:")
        Lire(motDePasse)
    Jusqu'a motDePasse = "secret"
    Ecrire("Acces autorise!")
Fin""",
                'order': 1
            }
        )
        if created:
            print(f"[OK] Simulation creee pour: {lesson_repeter.title}")
        else:
            print(f"[INFO] Simulation existe deja pour: {lesson_repeter.title}")
    else:
        print("[ERREUR] Lecon REPETER non trouvee")

    print("\nResume des simulations Module 4:")
    for lesson in Lesson.objects.filter(module__order=4):
        count = Simulation.objects.filter(lesson=lesson).count()
        print(f"  - {lesson.title}: {count} simulation(s)")

if __name__ == '__main__':
    print("Creation des simulations du Module 4...\n")
    create_module4_simulations()
    print("\nTermine!")
