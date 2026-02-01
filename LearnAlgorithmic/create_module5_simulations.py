"""
Script pour creer les simulations du Module 5 (Fonctions et Procedures)
"""
import os
import sys
import django

# Configuration Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnalgorithmic.settings')
django.setup()

from courses.models import Lesson, Simulation

def create_module5_simulations():
    # Lecon 10: Fonctions
    lesson_fonction = Lesson.objects.filter(title__icontains='Fonction').first()
    if lesson_fonction:
        sim, created = Simulation.objects.get_or_create(
            lesson=lesson_fonction,
            title="Simulation Fonction",
            defaults={
                'description': "Visualisez l'execution pas a pas d'une fonction avec retour de valeur",
                'algorithm_code': """Algorithme TestCarre
Variables: resultat : Entier
Debut
    resultat <- Carre(5)
    Ecrire("Resultat = ", resultat)
Fin

Fonction Carre(n : Entier) : Entier
Debut
    Retourner n * n
Fin Fonction""",
                'order': 1
            }
        )
        if created:
            print(f"[OK] Simulation creee pour: {lesson_fonction.title}")
        else:
            print(f"[INFO] Simulation existe deja pour: {lesson_fonction.title}")
    else:
        print("[ERREUR] Lecon Fonction non trouvee")

    # Lecon 11: Procedures
    lesson_procedure = Lesson.objects.filter(title__icontains='Procedure').first()
    if not lesson_procedure:
        lesson_procedure = Lesson.objects.filter(title__icontains='Proc').first()

    if lesson_procedure:
        sim, created = Simulation.objects.get_or_create(
            lesson=lesson_procedure,
            title="Simulation Procedure",
            defaults={
                'description': "Visualisez l'execution pas a pas d'une procedure sans retour de valeur",
                'algorithm_code': """Algorithme TestAfficherMessage
Debut
    AfficherMessage("Alice")
    Ecrire("Procedure terminee")
Fin

Procedure AfficherMessage(nom : Chaine)
Debut
    Ecrire("Bonjour ", nom, "!")
Fin Procedure""",
                'order': 1
            }
        )
        if created:
            print(f"[OK] Simulation creee pour: {lesson_procedure.title}")
        else:
            print(f"[INFO] Simulation existe deja pour: {lesson_procedure.title}")
    else:
        print("[ERREUR] Lecon Procedure non trouvee")

    print("\nResume des simulations Module 5:")
    for lesson in Lesson.objects.filter(module__order=5):
        count = Simulation.objects.filter(lesson=lesson).count()
        print(f"  - {lesson.title}: {count} simulation(s)")

if __name__ == '__main__':
    print("Creation des simulations du Module 5 (Fonctions et Procedures)...\n")
    create_module5_simulations()
    print("\nTermine!")
