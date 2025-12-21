import requests
import json
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("=== TEST DE CONNEXION API ===\n")

API_BASE_URL = "http://localhost:8000/api"

# Test 1: Vérifier si le serveur est accessible
print("1. Test de connexion au serveur...")
try:
    response = requests.get(f"{API_BASE_URL}/modules/", timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 401:
        print("   ✅ Serveur accessible (401 = authentification requise, c'est normal)")
    elif response.status_code == 200:
        print("   ✅ Serveur accessible")
    else:
        print(f"   ⚠️ Status inattendu: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("   ❌ ERREUR: Impossible de se connecter au serveur")
    print("   Assurez-vous que le serveur Django est démarré:")
    print("   cd LearnAlgorithmic\\backend && python manage.py runserver")
    sys.exit(1)
except Exception as e:
    print(f"   ❌ ERREUR: {e}")
    sys.exit(1)

print()

# Test 2: Login pour obtenir un token
print("2. Test de connexion utilisateur...")
login_data = {
    "username": "olivenossupuwo",
    "password": "votre_mot_de_passe"  # Vous devrez entrer le bon mot de passe
}

print("   ⚠️ ATTENTION: Ce script nécessite votre mot de passe.")
print("   Pour tester avec le vrai mot de passe, modifiez le fichier test_api_connection.py")
print()

# Pour le moment, on simule juste la structure
print("3. Structure de test pour soumettre un quiz:")
quiz_submit_data = {
    "quiz_id": 1,
    "answers": {
        "1": [2],      # Q1: Une suite finie d'instructions
        "2": [5, 6, 8], # Q2: Finitude, Correction, Efficacité
        "3": [9],       # Q3: Vrai
        "4": [12],      # Q4: Affectation
        "5": [16]       # Q5: Faux
    }
}
print(json.dumps(quiz_submit_data, indent=2))

print()
print("4. Structure de test pour soumettre un exercice:")
exercise_submit_data = {
    "exercise_id": 1,
    "code": """ALGORITHME CalculPerimetre
VARIABLES
    longueur, largeur, périmètre : REEL
DEBUT
    AFFICHER "Entrez la longueur:"
    LIRE longueur
    AFFICHER "Entrez la largeur:"
    LIRE largeur
    périmètre <- 2 * (longueur + largeur)
    AFFICHER "Le périmètre est:", périmètre
FIN"""
}
print(json.dumps(exercise_submit_data, indent=2))

print()
print("=== INSTRUCTIONS ===")
print()
print("Pour tester complètement l'API:")
print("1. Démarrez le serveur backend:")
print("   cd LearnAlgorithmic\\backend")
print("   python manage.py runserver")
print()
print("2. Ouvrez la console du navigateur (F12) sur http://localhost:3000")
print("3. Connectez-vous avec votre compte")
print("4. Dans l'onglet Network, filtrez par 'XHR'")
print("5. Soumettez un quiz ou exercice")
print("6. Vérifiez:")
print("   - Si la requête apparaît dans Network")
print("   - Le status code (devrait être 200)")
print("   - La réponse JSON")
print("   - Les logs du serveur backend dans le terminal")
print()
print("Si vous voyez des erreurs CORS ou 401, le problème vient de l'authentification.")
print("Si vous ne voyez aucune requête, le problème vient du frontend.")
