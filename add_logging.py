import os
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

views_path = r'c:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic\LearnAlgorithmic\backend\courses\views.py'

print("=== AJOUT DE LOGS POUR DEBUGGER ===\n")

# Lire le fichier
with open(views_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Vérifier si les logs sont déjà présents
if 'import logging' in content and 'logger = logging.getLogger(__name__)' in content:
    print("✅ Les logs sont déjà configurés dans views.py")
    print("\nPour voir les logs en temps réel:")
    print("1. Ouvrez un terminal")
    print("2. cd LearnAlgorithmic\\backend")
    print("3. python manage.py runserver")
    print("4. Dans un autre terminal, surveillez le fichier de log ou la console")
else:
    print("❌ Les imports de logging ne sont pas présents")
    print("\nPour ajouter les logs, je devrais modifier le fichier views.py")
    print("Voulez-vous que je le fasse automatiquement ?")

print("\n=== VÉRIFICATION DES LOGS EXISTANTS ===")

# Chercher les print statements ou logs existants
if 'print(' in content:
    print("✅ Le code contient des print() statements")
else:
    print("❌ Aucun print() statement trouvé")

if 'logger.' in content:
    print("✅ Le code utilise un logger")
else:
    print("❌ Aucun logger utilisé")

print("\n=== INSTRUCTIONS POUR DEBUGGER ===")
print("\n1. Ouvrez un terminal et démarrez le serveur backend:")
print("   cd c:\\Users\\Olive Nossupuwo\\Downloads\\LearnAlgorithmic\\LearnAlgorithmic\\backend")
print("   python manage.py runserver")

print("\n2. Ouvrez l'application frontend dans le navigateur:")
print("   http://localhost:3000")

print("\n3. Ouvrez la console du navigateur (F12)")

print("\n4. Connectez-vous avec votre compte 'olivenossupuwo'")

print("\n5. Allez dans la leçon 'Qu'est-ce qu'un algorithme ?'")

print("\n6. Faites le quiz avec les BONNES réponses:")
print("   Q1: 'Une suite finie d'instructions pour résoudre un problème'")
print("   Q2: Cochez 'Finitude', 'Correction', et 'Efficacité'")
print("   Q3: 'Vrai'")
print("   Q4: 'Affectation'")
print("   Q5: 'Faux'")

print("\n7. Soumettez le quiz et vérifiez:")
print("   - La console du navigateur pour voir la réponse de l'API")
print("   - Le terminal du serveur pour voir les logs")

print("\n8. Faites l'exercice avec un code valide:")
print("   ALGORITHME CalculPerimetre")
print("   VARIABLES")
print("       longueur, largeur, périmètre : REEL")
print("   DEBUT")
print("       AFFICHER \"Entrez la longueur:\"")
print("       LIRE longueur")
print("       AFFICHER \"Entrez la largeur:\"")
print("       LIRE largeur")
print("       périmètre <- 2 * (longueur + largeur)")
print("       AFFICHER \"Le périmètre est:\", périmètre")
print("   FIN")

print("\n9. Soumettez l'exercice et vérifiez les logs")

print("\n10. Après les deux soumissions, vérifiez si le Module 2 est débloqué:")
print("    - Retournez à la page Modules")
print("    - Vérifiez si Module 2 affiche 'Commencer' au lieu de 'Verrouillé'")

print("\n=== SCRIPT DE VÉRIFICATION MANUELLE ===")
print("\nSi vous voulez vérifier manuellement la base de données après avoir soumis:")
print("python debug_modules.py")
