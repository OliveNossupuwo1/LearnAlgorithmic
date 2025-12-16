"""
Script pour peupler la base de données avec le contenu des cours
Exécuter avec: python manage.py shell < populate_data.py
"""

from courses.models import *
from django.contrib.auth.models import User

# Créer un super utilisateur si nécessaire
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@learnalgorithmic.com', 'admin123')
    print("Super utilisateur créé: admin / admin123")

# Supprimer les données existantes
Module.objects.all().delete()
print("Anciennes données supprimées")

# MODULE 1: Introduction à l'algorithmique
module1 = Module.objects.create(
    title="Introduction à l'algorithmique",
    description="Découvrez les fondamentaux de l'algorithmique et son importance en informatique",
    order=1
)

lesson1_1 = Lesson.objects.create(
    module=module1,
    title="Qu'est-ce qu'un algorithme ?",
    description="Comprendre la notion d'algorithme et son rôle en informatique",
    order=1,
    video_url="https://www.youtube.com/watch?v=6hfOvs8pY1k",
    video_embed_code='<iframe width="560" height="315" src="https://www.youtube.com/embed/6hfOvs8pY1k" frameborder="0" allowfullscreen></iframe>'
)

# Concepts pour Leçon 1.1
Concept.objects.create(
    lesson=lesson1_1,
    title="Algorithme",
    definition="Un algorithme est une suite finie et non ambiguë d'instructions permettant de résoudre un problème ou d'effectuer un calcul.",
    syntax="""Caractéristiques d'un algorithme:
- Séquence d'étapes bien définies
- Données en entrée
- Résultats en sortie
- Finitude (se termine toujours)
- Efficacité""",
    order=1
)

Concept.objects.create(
    lesson=lesson1_1,
    title="Pseudo-code",
    definition="Le pseudo-code est une description informelle d'un algorithme qui utilise les conventions structurelles d'un langage de programmation sans la syntaxe stricte.",
    syntax="""Exemple de structure:
ALGORITHME nom_algorithme
DEBUT
    instruction1
    instruction2
    ...
FIN""",
    order=2
)

# Exemples pour Leçon 1.1
Example.objects.create(
    lesson=lesson1_1,
    title="Algorithme de préparation de café",
    description="Un exemple simple d'algorithme de la vie quotidienne",
    code="""ALGORITHME FaireDuCafe
DEBUT
    1. Prendre une tasse
    2. Mettre du café dans la tasse
    3. Faire bouillir de l'eau
    4. Verser l'eau dans la tasse
    5. Ajouter du sucre (optionnel)
    6. Mélanger
FIN""",
    explanation="Cet algorithme montre comment même des tâches quotidiennes peuvent être décrites comme une séquence d'étapes. Chaque étape est claire, et l'ordre est important.",
    order=1
)

Example.objects.create(
    lesson=lesson1_1,
    title="Algorithme de calcul de moyenne",
    description="Calculer la moyenne de trois nombres",
    code="""ALGORITHME CalculMoyenne
VARIABLES
    note1, note2, note3: REEL
    moyenne: REEL
DEBUT
    LIRE note1
    LIRE note2
    LIRE note3
    moyenne ← (note1 + note2 + note3) / 3
    AFFICHER "La moyenne est:", moyenne
FIN""",
    explanation="Cet algorithme prend trois notes en entrée, calcule leur moyenne et affiche le résultat. L'opérateur ← représente l'affectation.",
    order=2
)

# Simulation pour Leçon 1.1
sim1 = Simulation.objects.create(
    lesson=lesson1_1,
    title="Calcul de la somme de deux nombres",
    description="Visualisation étape par étape du calcul de la somme",
    algorithm_code="""ALGORITHME Somme
VARIABLES
    a, b, resultat: ENTIER
DEBUT
    a ← 5
    b ← 3
    resultat ← a + b
    AFFICHER resultat
FIN""",
    order=1
)

SimulationStep.objects.create(
    simulation=sim1,
    step_number=1,
    description="Déclaration des variables a, b et resultat",
    state_data={"a": None, "b": None, "resultat": None},
    visual_data={"highlight": "VARIABLES", "message": "Les variables sont déclarées en mémoire"}
)

SimulationStep.objects.create(
    simulation=sim1,
    step_number=2,
    description="Affectation de la valeur 5 à la variable a",
    state_data={"a": 5, "b": None, "resultat": None},
    visual_data={"highlight": "a ← 5", "message": "a prend la valeur 5"}
)

SimulationStep.objects.create(
    simulation=sim1,
    step_number=3,
    description="Affectation de la valeur 3 à la variable b",
    state_data={"a": 5, "b": 3, "resultat": None},
    visual_data={"highlight": "b ← 3", "message": "b prend la valeur 3"}
)

SimulationStep.objects.create(
    simulation=sim1,
    step_number=4,
    description="Calcul de la somme: resultat = a + b",
    state_data={"a": 5, "b": 3, "resultat": 8},
    visual_data={"highlight": "resultat ← a + b", "message": "resultat = 5 + 3 = 8"}
)

SimulationStep.objects.create(
    simulation=sim1,
    step_number=5,
    description="Affichage du résultat",
    state_data={"a": 5, "b": 3, "resultat": 8},
    visual_data={"highlight": "AFFICHER resultat", "message": "Affichage: 8", "output": "8"}
)

# Quiz pour Leçon 1.1
quiz1_1 = Quiz.objects.create(
    lesson=lesson1_1,
    title="Quiz: Introduction à l'algorithmique",
    order=1
)

q1 = QuizQuestion.objects.create(
    quiz=quiz1_1,
    question_text="Qu'est-ce qu'un algorithme ?",
    question_type='single',
    points=20,
    order=1,
    explanation="Un algorithme est une suite finie et non ambiguë d'instructions pour résoudre un problème."
)

QuizChoice.objects.create(question=q1, choice_text="Un langage de programmation", is_correct=False, order=1)
QuizChoice.objects.create(question=q1, choice_text="Une suite finie d'instructions pour résoudre un problème", is_correct=True, order=2)
QuizChoice.objects.create(question=q1, choice_text="Un logiciel informatique", is_correct=False, order=3)
QuizChoice.objects.create(question=q1, choice_text="Un type de données", is_correct=False, order=4)

q2 = QuizQuestion.objects.create(
    quiz=quiz1_1,
    question_text="Quelles sont les caractéristiques d'un bon algorithme ?",
    question_type='multiple',
    points=30,
    order=2,
    explanation="Un bon algorithme doit être fini (se terminer), correct (résoudre le problème) et efficace (utiliser peu de ressources)."
)

QuizChoice.objects.create(question=q2, choice_text="Finitude", is_correct=True, order=1)
QuizChoice.objects.create(question=q2, choice_text="Correction", is_correct=True, order=2)
QuizChoice.objects.create(question=q2, choice_text="Complexité infinie", is_correct=False, order=3)
QuizChoice.objects.create(question=q2, choice_text="Efficacité", is_correct=True, order=4)

q3 = QuizQuestion.objects.create(
    quiz=quiz1_1,
    question_text="Un algorithme doit toujours se terminer.",
    question_type='true_false',
    points=15,
    order=3,
    explanation="Vrai. La finitude est une caractéristique essentielle d'un algorithme."
)

QuizChoice.objects.create(question=q3, choice_text="Vrai", is_correct=True, order=1)
QuizChoice.objects.create(question=q3, choice_text="Faux", is_correct=False, order=2)

q4 = QuizQuestion.objects.create(
    quiz=quiz1_1,
    question_text="Que signifie l'opérateur ← en pseudo-code ?",
    question_type='single',
    points=20,
    order=4,
    explanation="L'opérateur ← représente l'affectation, c'est-à-dire donner une valeur à une variable."
)

QuizChoice.objects.create(question=q4, choice_text="Égalité", is_correct=False, order=1)
QuizChoice.objects.create(question=q4, choice_text="Affectation", is_correct=True, order=2)
QuizChoice.objects.create(question=q4, choice_text="Comparaison", is_correct=False, order=3)
QuizChoice.objects.create(question=q4, choice_text="Addition", is_correct=False, order=4)

q5 = QuizQuestion.objects.create(
    quiz=quiz1_1,
    question_text="Le pseudo-code est un langage de programmation.",
    question_type='true_false',
    points=15,
    order=5,
    explanation="Faux. Le pseudo-code est une description informelle, pas un vrai langage de programmation."
)

QuizChoice.objects.create(question=q5, choice_text="Vrai", is_correct=False, order=1)
QuizChoice.objects.create(question=q5, choice_text="Faux", is_correct=True, order=2)

# Exercices pour Leçon 1.1
Exercise.objects.create(
    lesson=lesson1_1,
    title="Écrire un algorithme simple",
    description="Écrivez un algorithme qui calcule le périmètre d'un rectangle",
    problem_statement="""Écrivez un algorithme nommé 'PerimetreRectangle' qui:
1. Lit la longueur et la largeur d'un rectangle
2. Calcule le périmètre (périmètre = 2 * (longueur + largeur))
3. Affiche le résultat

Utilisez la structure de base:
ALGORITHME PerimetreRectangle
VARIABLES
    ...
DEBUT
    ...
FIN""",
    expected_output="Le périmètre est: 20 (pour longueur=6 et largeur=4)",
    test_cases={
        "required_keywords": ["ALGORITHME", "VARIABLES", "DEBUT", "FIN", "LIRE", "AFFICHER", "périmètre", "longueur", "largeur"],
        "forbidden_keywords": []
    },
    points=20,
    order=1,
    hints="N'oubliez pas de déclarer vos variables avant de les utiliser. Le périmètre d'un rectangle = 2 × (longueur + largeur)"
)

print("Module 1 créé avec succès!")

# MODULE 2: Variables et constantes
module2 = Module.objects.create(
    title="Variables et constantes",
    description="Comprendre et utiliser les variables et constantes en algorithmique",
    order=2
)

# LEÇON 2.1: Variables
lesson2_1 = Lesson.objects.create(
    module=module2,
    title="Variables",
    description="Découvrir les variables, leur déclaration et leur utilisation",
    order=1,
    video_url="https://www.youtube.com/watch?v=j-d6t0ZqVWM",
    video_embed_code='<iframe width="560" height="315" src="https://www.youtube.com/embed/j-d6t0ZqVWM" frameborder="0" allowfullscreen></iframe>'
)

Concept.objects.create(
    lesson=lesson2_1,
    title="Variable",
    definition="Une variable est un espace mémoire nommé qui peut contenir une valeur susceptible de changer pendant l'exécution du programme.",
    syntax="""Déclaration:
VARIABLES
    nom_variable: TYPE

Types courants:
- ENTIER: nombres entiers
- REEL: nombres décimaux
- CARACTERE: un caractère
- CHAINE: texte
- BOOLEEN: vrai/faux""",
    order=1
)

Concept.objects.create(
    lesson=lesson2_1,
    title="Affectation",
    definition="L'affectation consiste à donner une valeur à une variable.",
    syntax="""nom_variable ← valeur

Exemples:
age ← 25
nom ← "Alice"
prix ← 19.99
estMajeur ← VRAI""",
    order=2
)

Example.objects.create(
    lesson=lesson2_1,
    title="Déclaration et utilisation de variables",
    description="Exemple complet avec différents types de variables",
    code="""ALGORITHME ExempleVariables
VARIABLES
    nom: CHAINE
    age: ENTIER
    taille: REEL
    estEtudiant: BOOLEEN
DEBUT
    nom ← "Marie"
    age ← 20
    taille ← 1.65
    estEtudiant ← VRAI
    
    AFFICHER "Nom:", nom
    AFFICHER "Age:", age
    AFFICHER "Taille:", taille
    AFFICHER "Étudiant:", estEtudiant
FIN""",
    explanation="Cet algorithme démontre l'utilisation de quatre types de variables différents: chaîne, entier, réel et booléen.",
    order=1
)

# Quiz Variables
quiz2_1 = Quiz.objects.create(
    lesson=lesson2_1,
    title="Quiz: Variables",
    order=1
)

q1 = QuizQuestion.objects.create(
    quiz=quiz2_1,
    question_text="Qu'est-ce qu'une variable en algorithmique ?",
    question_type='single',
    points=20,
    order=1,
    explanation="Une variable est un espace mémoire nommé contenant une valeur qui peut changer."
)

QuizChoice.objects.create(question=q1, choice_text="Une valeur fixe", is_correct=False, order=1)
QuizChoice.objects.create(question=q1, choice_text="Un espace mémoire nommé contenant une valeur", is_correct=True, order=2)
QuizChoice.objects.create(question=q1, choice_text="Un algorithme", is_correct=False, order=3)

Exercise.objects.create(
    lesson=lesson2_1,
    title="Calculer l'âge",
    description="Écrivez un algorithme qui calcule l'âge d'une personne",
    problem_statement="""Écrivez un algorithme qui:
1. Lit l'année de naissance
2. Lit l'année actuelle
3. Calcule l'âge (année actuelle - année naissance)
4. Affiche l'âge""",
    expected_output="Votre âge est: 25",
    test_cases={
        "required_keywords": ["VARIABLES", "annee", "age", "LIRE", "AFFICHER"],
        "forbidden_keywords": []
    },
    points=20,
    order=1
)

# LEÇON 2.2: Constantes
lesson2_2 = Lesson.objects.create(
    module=module2,
    title="Constantes",
    description="Comprendre les constantes et leur utilité",
    order=2,
    video_url="https://www.youtube.com/watch?v=Aig1U4kpwFw",
)

Concept.objects.create(
    lesson=lesson2_2,
    title="Constante",
    definition="Une constante est une valeur qui ne change pas pendant l'exécution du programme.",
    syntax="""CONSTANTES
    PI = 3.14159
    TVA = 0.20
    MAX_ETUDIANTS = 30""",
    order=1
)

Example.objects.create(
    lesson=lesson2_2,
    title="Calcul avec constantes",
    description="Utiliser des constantes dans un calcul",
    code="""ALGORITHME AireCircle
CONSTANTES
    PI = 3.14159
VARIABLES
    rayon, aire: REEL
DEBUT
    LIRE rayon
    aire ← PI * rayon * rayon
    AFFICHER "Aire:", aire
FIN""",
    explanation="PI est une constante car sa valeur ne change jamais.",
    order=1
)

quiz2_2 = Quiz.objects.create(
    lesson=lesson2_2,
    title="Quiz: Constantes",
    order=1
)

q1 = QuizQuestion.objects.create(
    quiz=quiz2_2,
    question_text="Une constante peut changer de valeur pendant l'exécution.",
    question_type='true_false',
    points=25,
    order=1,
    explanation="Faux. Une constante garde toujours la même valeur."
)

QuizChoice.objects.create(question=q1, choice_text="Vrai", is_correct=False, order=1)
QuizChoice.objects.create(question=q1, choice_text="Faux", is_correct=True, order=2)

Exercise.objects.create(
    lesson=lesson2_2,
    title="Calcul TTC",
    description="Calculer le prix TTC avec une constante TVA",
    problem_statement="""Créez un algorithme qui:
1. Définit une constante TVA = 0.20
2. Lit le prix HT
3. Calcule le prix TTC (HT + HT * TVA)
4. Affiche le prix TTC""",
    expected_output="Prix TTC: 120",
    test_cases={
        "required_keywords": ["CONSTANTES", "TVA", "VARIABLES", "priceTTC", "priceHT"],
        "forbidden_keywords": []
    },
    points=20,
    order=1
)

print("Module 2 créé avec succès!")

# MODULE 3: Structures conditionnelles
module3 = Module.objects.create(
    title="Structures conditionnelles",
    description="Maîtriser les structures de décision en algorithmique",
    order=3
)

# LEÇON 3.1: Structures conditionnelles simples
lesson3_1 = Lesson.objects.create(
    module=module3,
    title="Structures conditionnelles simples",
    description="Utiliser la structure SI...ALORS",
    order=1
)

Concept.objects.create(
    lesson=lesson3_1,
    title="Structure SI...ALORS",
    definition="Permet d'exécuter un bloc d'instructions seulement si une condition est vraie.",
    syntax="""SI condition ALORS
    instruction1
    instruction2
FIN SI""",
    order=1
)

Example.objects.create(
    lesson=lesson3_1,
    title="Vérifier si majeur",
    code="""ALGORITHME VerifierMajeur
VARIABLES
    age: ENTIER
DEBUT
    LIRE age
    SI age >= 18 ALORS
        AFFICHER "Vous êtes majeur"
    FIN SI
FIN""",
    explanation="Le message s'affiche uniquement si l'âge est >= 18.",
    order=1,
    description="Exemple de condition simple"
)

quiz3_1 = Quiz.objects.create(lesson=lesson3_1, title="Quiz: Conditions simples", order=1)

Exercise.objects.create(
    lesson=lesson3_1,
    title="Nombre positif",
    description="Vérifier si un nombre est positif",
    problem_statement="Créez un algorithme qui lit un nombre et affiche 'Positif' s'il est > 0",
    expected_output="Positif",
    test_cases={"required_keywords": ["SI", "ALORS", "FIN SI", ">"], "forbidden_keywords": []},
    points=20,
    order=1
)

# LEÇON 3.2: Structures alternatives
lesson3_2 = Lesson.objects.create(
    module=module3,
    title="Structures alternatives",
    description="Utiliser SI...ALORS...SINON",
    order=2
)

Concept.objects.create(
    lesson=lesson3_2,
    title="Structure SI...ALORS...SINON",
    definition="Permet d'exécuter un bloc si la condition est vraie, un autre bloc sinon.",
    syntax="""SI condition ALORS
    instructions_si_vrai
SINON
    instructions_si_faux
FIN SI""",
    order=1
)

Example.objects.create(
    lesson=lesson3_2,
    title="Pair ou impair",
    code="""ALGORITHME PairOuImpair
VARIABLES
    nombre: ENTIER
DEBUT
    LIRE nombre
    SI nombre MOD 2 = 0 ALORS
        AFFICHER "Pair"
    SINON
        AFFICHER "Impair"
    FIN SI
FIN""",
    explanation="MOD donne le reste de la division. Si reste = 0, le nombre est pair.",
    order=1,
    description="Vérifier parité"
)

quiz3_2 = Quiz.objects.create(lesson=lesson3_2, title="Quiz: Alternatives", order=1)

Exercise.objects.create(
    lesson=lesson3_2,
    title="Comparer deux nombres",
    description="Comparer deux nombres",
    problem_statement="Créez un algorithme qui lit deux nombres et affiche lequel est le plus grand",
    expected_output="Le plus grand est: 15",
    test_cases={"required_keywords": ["SI", "ALORS", "SINON", ">"], "forbidden_keywords": []},
    points=20,
    order=1
)

# LEÇON 3.3: Structures complètes
lesson3_3 = Lesson.objects.create(
    module=module3,
    title="Structures conditionnelles complètes",
    description="Utiliser SI...ALORS...SINON SI...SINON",
    order=3
)

Concept.objects.create(
    lesson=lesson3_3,
    title="Structure SI...SINON SI",
    definition="Permet de tester plusieurs conditions successivement.",
    syntax="""SI condition1 ALORS
    instructions1
SINON SI condition2 ALORS
    instructions2
SINON
    instructions3
FIN SI""",
    order=1
)

Example.objects.create(
    lesson=lesson3_3,
    title="Mention d'un étudiant",
    code="""ALGORITHME Mention
VARIABLES
    moyenne: REEL
DEBUT
    LIRE moyenne
    SI moyenne >= 16 ALORS
        AFFICHER "Très bien"
    SINON SI moyenne >= 14 ALORS
        AFFICHER "Bien"
    SINON SI moyenne >= 12 ALORS
        AFFICHER "Assez bien"
    SINON SI moyenne >= 10 ALORS
        AFFICHER "Passable"
    SINON
        AFFICHER "Insuffisant"
    FIN SI
FIN""",
    explanation="Les conditions sont testées dans l'ordre jusqu'à en trouver une vraie.",
    order=1,
    description="Plusieurs conditions"
)

quiz3_3 = Quiz.objects.create(lesson=lesson3_3, title="Quiz: Structures complètes", order=1)

Exercise.objects.create(
    lesson=lesson3_3,
    title="Catégorie d'âge",
    description="Déterminer la catégorie d'âge",
    problem_statement="Créez un algorithme qui affiche: Enfant (<12), Ado (12-17), Adulte (18-64), Senior (65+)",
    expected_output="Adulte",
    test_cases={"required_keywords": ["SI", "SINON SI", "ALORS"], "forbidden_keywords": []},
    points=20,
    order=1
)

print("Module 3 créé avec succès!")

# MODULE 4: Boucles et itérations
module4 = Module.objects.create(
    title="Boucles et itérations",
    description="Maîtriser les structures répétitives",
    order=4
)

# LEÇON 4.1: Structure POUR
lesson4_1 = Lesson.objects.create(
    module=module4,
    title="Structure POUR",
    description="Utiliser la boucle POUR",
    order=1
)

Concept.objects.create(
    lesson=lesson4_1,
    title="Boucle POUR",
    definition="Permet de répéter un bloc d'instructions un nombre déterminé de fois.",
    syntax="""POUR variable DE debut A fin FAIRE
    instructions
FIN POUR

Ou avec un pas:
POUR variable DE debut A fin PAR PAS increment FAIRE
    instructions
FIN POUR""",
    order=1
)

Example.objects.create(
    lesson=lesson4_1,
    title="Afficher les nombres de 1 à 10",
    code="""ALGORITHME AfficherNombres
VARIABLES
    i: ENTIER
DEBUT
    POUR i DE 1 A 10 FAIRE
        AFFICHER i
    FIN POUR
FIN""",
    explanation="La variable i prend successivement les valeurs de 1 à 10.",
    order=1,
    description="Boucle simple"
)

quiz4_1 = Quiz.objects.create(lesson=lesson4_1, title="Quiz: Boucle POUR", order=1)

Exercise.objects.create(
    lesson=lesson4_1,
    title="Somme des N premiers nombres",
    description="Calculer la somme 1+2+3+...+N",
    problem_statement="Créez un algorithme qui calcule la somme des N premiers entiers naturels",
    expected_output="La somme est: 55 (pour N=10)",
    test_cases={"required_keywords": ["POUR", "DE", "A", "FAIRE", "somme"], "forbidden_keywords": []},
    points=20,
    order=1
)

# LEÇON 4.2: Structure TANT QUE
lesson4_2 = Lesson.objects.create(
    module=module4,
    title="Structure TANT QUE",
    description="Utiliser la boucle TANT QUE",
    order=2
)

Concept.objects.create(
    lesson=lesson4_2,
    title="Boucle TANT QUE",
    definition="Répète un bloc tant qu'une condition est vraie. Le test se fait avant l'exécution.",
    syntax="""TANT QUE condition FAIRE
    instructions
FIN TANT QUE""",
    order=1
)

Example.objects.create(
    lesson=lesson4_2,
    title="Deviner un nombre",
    code="""ALGORITHME DevinerNombre
CONSTANTES
    NOMBRE_SECRET = 42
VARIABLES
    nombre: ENTIER
DEBUT
    nombre ← 0
    TANT QUE nombre ≠ NOMBRE_SECRET FAIRE
        LIRE nombre
        SI nombre < NOMBRE_SECRET ALORS
            AFFICHER "Trop petit"
        SINON SI nombre > NOMBRE_SECRET ALORS
            AFFICHER "Trop grand"
        FIN SI
    FIN TANT QUE
    AFFICHER "Bravo!"
FIN""",
    explanation="La boucle continue tant que le nombre n'est pas trouvé.",
    order=1,
    description="Jeu de devinette"
)

quiz4_2 = Quiz.objects.create(lesson=lesson4_2, title="Quiz: TANT QUE", order=1)

Exercise.objects.create(
    lesson=lesson4_2,
    title="Factorielle",
    description="Calculer la factorielle d'un nombre",
    problem_statement="Créez un algorithme qui calcule N! avec une boucle TANT QUE",
    expected_output="5! = 120",
    test_cases={"required_keywords": ["TANT QUE", "FAIRE", "factorielle"], "forbidden_keywords": []},
    points=20,
    order=1
)

# LEÇON 4.3: Structure REPETER...JUSQU'A
lesson4_3 = Lesson.objects.create(
    module=module4,
    title="Structure REPETER...JUSQU'A",
    description="Utiliser la boucle REPETER...JUSQU'A",
    order=3
)

Concept.objects.create(
    lesson=lesson4_3,
    title="Boucle REPETER...JUSQU'A",
    definition="Répète un bloc jusqu'à ce qu'une condition devienne vraie. Le test se fait après l'exécution (au moins 1 itération).",
    syntax="""REPETER
    instructions
JUSQU'A condition""",
    order=1
)

Example.objects.create(
    lesson=lesson4_3,
    title="Menu avec validation",
    code="""ALGORITHME Menu
VARIABLES
    choix: ENTIER
DEBUT
    REPETER
        AFFICHER "1. Option 1"
        AFFICHER "2. Option 2"
        AFFICHER "3. Quitter"
        LIRE choix
    JUSQU'A choix >= 1 ET choix <= 3
    AFFICHER "Choix valide:", choix
FIN""",
    explanation="Le menu s'affiche au moins une fois et se répète tant que le choix est invalide.",
    order=1,
    description="Validation d'entrée"
)

quiz4_3 = Quiz.objects.create(lesson=lesson4_3, title="Quiz: REPETER", order=1)

Exercise.objects.create(
    lesson=lesson4_3,
    title="Validation de mot de passe",
    description="Demander un mot de passe jusqu'à ce qu'il soit correct",
    problem_statement="Créez un algorithme qui demande un mot de passe jusqu'à obtenir 'secret123'",
    expected_output="Accès autorisé",
    test_cases={"required_keywords": ["REPETER", "JUSQU'A", "motdepasse"], "forbidden_keywords": []},
    points=20,
    order=1
)

print("Module 4 créé avec succès!")

# MODULE 5: Fonctions et procédures
module5 = Module.objects.create(
    title="Fonctions et procédures",
    description="Découvrir la modularité avec les fonctions et procédures",
    order=5
)

# LEÇON 5.1: Fonctions
lesson5_1 = Lesson.objects.create(
    module=module5,
    title="Fonctions",
    description="Créer et utiliser des fonctions",
    order=1
)

Concept.objects.create(
    lesson=lesson5_1,
    title="Fonction",
    definition="Une fonction est un sous-programme qui retourne une valeur. Elle prend des paramètres en entrée.",
    syntax="""FONCTION nom_fonction(param1: TYPE1, param2: TYPE2): TYPE_RETOUR
VARIABLES
    variables locales
DEBUT
    instructions
    RETOURNER valeur
FIN

Appel:
resultat ← nom_fonction(arg1, arg2)""",
    order=1
)

Example.objects.create(
    lesson=lesson5_1,
    title="Fonction carré",
    code="""FONCTION Carre(nombre: REEL): REEL
DEBUT
    RETOURNER nombre * nombre
FIN

ALGORITHME Principal
VARIABLES
    x, resultat: REEL
DEBUT
    x ← 5
    resultat ← Carre(x)
    AFFICHER "Le carré de", x, "est", resultat
FIN""",
    explanation="La fonction Carre prend un nombre et retourne son carré.",
    order=1,
    description="Fonction simple"
)

quiz5_1 = Quiz.objects.create(lesson=lesson5_1, title="Quiz: Fonctions", order=1)

Exercise.objects.create(
    lesson=lesson5_1,
    title="Fonction maximum",
    description="Créer une fonction qui retourne le plus grand de deux nombres",
    problem_statement="Créez une fonction Maximum(a, b) qui retourne le plus grand des deux nombres",
    expected_output="Le maximum est: 15",
    test_cases={"required_keywords": ["FONCTION", "Maximum", "RETOURNER"], "forbidden_keywords": []},
    points=20,
    order=1
)

# LEÇON 5.2: Procédures
lesson5_2 = Lesson.objects.create(
    module=module5,
    title="Procédures",
    description="Créer et utiliser des procédures",
    order=2
)

Concept.objects.create(
    lesson=lesson5_2,
    title="Procédure",
    definition="Une procédure est un sous-programme qui ne retourne pas de valeur. Elle effectue une action.",
    syntax="""PROCEDURE nom_procedure(param1: TYPE1, param2: TYPE2)
VARIABLES
    variables locales
DEBUT
    instructions
FIN

Appel:
nom_procedure(arg1, arg2)""",
    order=1
)

Example.objects.create(
    lesson=lesson5_2,
    title="Procédure d'affichage",
    code="""PROCEDURE AfficherInfo(nom: CHAINE, age: ENTIER)
DEBUT
    AFFICHER "Nom:", nom
    AFFICHER "Age:", age
    AFFICHER "---"
FIN

ALGORITHME Principal
DEBUT
    AfficherInfo("Alice", 25)
    AfficherInfo("Bob", 30)
FIN""",
    explanation="La procédure AfficherInfo affiche les informations sans retourner de valeur.",
    order=1,
    description="Procédure simple"
)

quiz5_2 = Quiz.objects.create(lesson=lesson5_2, title="Quiz: Procédures", order=1)

Exercise.objects.create(
    lesson=lesson5_2,
    title="Procédure table de multiplication",
    description="Créer une procédure qui affiche la table de multiplication d'un nombre",
    problem_statement="Créez une procédure TableMultiplication(n) qui affiche la table de n de 1 à 10",
    expected_output="Table de 5: 5, 10, 15, ..., 50",
    test_cases={"required_keywords": ["PROCEDURE", "TableMultiplication", "POUR"], "forbidden_keywords": []},
    points=20,
    order=1
)

print("Module 5 créé avec succès!")

# MODULE 6: Tableaux et listes
module6 = Module.objects.create(
    title="Tableaux et listes",
    description="Manipuler des collections de données",
    order=6
)

# LEÇON 6.1: Opérations sur tableaux
lesson6_1 = Lesson.objects.create(
    module=module6,
    title="Opérations de manipulation d'un tableau",
    description="Créer, parcourir et modifier des tableaux",
    order=1
)

Concept.objects.create(
    lesson=lesson6_1,
    title="Tableau",
    definition="Un tableau est une structure de données qui stocke plusieurs valeurs du même type, accessibles par un indice.",
    syntax="""Déclaration:
VARIABLES
    notes: TABLEAU[1..10] DE REEL

Accès:
notes[1] ← 15.5
x ← notes[3]

Parcours:
POUR i DE 1 A 10 FAIRE
    AFFICHER notes[i]
FIN POUR""",
    order=1
)

Example.objects.create(
    lesson=lesson6_1,
    title="Moyenne d'un tableau",
    code="""ALGORITHME MoyenneNotes
VARIABLES
    notes: TABLEAU[1..5] DE REEL
    i: ENTIER
    somme, moyenne: REEL
DEBUT
    // Saisie
    POUR i DE 1 A 5 FAIRE
        LIRE notes[i]
    FIN POUR
    
    // Calcul
    somme ← 0
    POUR i DE 1 A 5 FAIRE
        somme ← somme + notes[i]
    FIN POUR
    
    moyenne ← somme / 5
    AFFICHER "Moyenne:", moyenne
FIN""",
    explanation="On parcourt le tableau deux fois: une pour la saisie, une pour le calcul.",
    order=1,
    description="Calcul de moyenne"
)

Example.objects.create(
    lesson=lesson6_1,
    title="Recherche dans un tableau",
    code="""ALGORITHME RechercherElement
VARIABLES
    tab: TABLEAU[1..10] DE ENTIER
    recherche, i: ENTIER
    trouve: BOOLEEN
DEBUT
    // Remplir le tableau
    POUR i DE 1 A 10 FAIRE
        LIRE tab[i]
    FIN POUR
    
    LIRE recherche
    
    trouve ← FAUX
    i ← 1
    TANT QUE (i <= 10) ET (NON trouve) FAIRE
        SI tab[i] = recherche ALORS
            trouve ← VRAI
        SINON
            i ← i + 1
        FIN SI
    FIN TANT QUE
    
    SI trouve ALORS
        AFFICHER "Trouvé à la position", i
    SINON
        AFFICHER "Non trouvé"
    FIN SI
FIN""",
    explanation="On parcourt le tableau jusqu'à trouver l'élément ou atteindre la fin.",
    order=2,
    description="Recherche linéaire"
)

sim6 = Simulation.objects.create(
    lesson=lesson6_1,
    title="Tri à bulles",
    description="Visualisation du tri à bulles",
    algorithm_code="""ALGORITHME TriBulles
VARIABLES
    tab: TABLEAU[1..5] DE ENTIER
    i, j, temp: ENTIER
DEBUT
    tab[1] ← 64
    tab[2] ← 34
    tab[3] ← 25
    tab[4] ← 12
    tab[5] ← 22
    
    POUR i DE 1 A 4 FAIRE
        POUR j DE 1 A 5-i FAIRE
            SI tab[j] > tab[j+1] ALORS
                temp ← tab[j]
                tab[j] ← tab[j+1]
                tab[j+1] ← temp
            FIN SI
        FIN POUR
    FIN POUR
FIN""",
    order=1
)

SimulationStep.objects.create(
    simulation=sim6,
    step_number=1,
    description="État initial du tableau",
    state_data={"tab": [64, 34, 25, 12, 22], "i": 0, "j": 0},
    visual_data={"highlight": "initial", "message": "Tableau non trié", "array": [64, 34, 25, 12, 22]}
)

SimulationStep.objects.create(
    simulation=sim6,
    step_number=2,
    description="Première comparaison: 64 > 34, on échange",
    state_data={"tab": [34, 64, 25, 12, 22], "i": 1, "j": 1},
    visual_data={"highlight": "compare", "message": "Échange de 64 et 34", "array": [34, 64, 25, 12, 22], "swapped": [0, 1]}
)

SimulationStep.objects.create(
    simulation=sim6,
    step_number=3,
    description="64 > 25, on échange",
    state_data={"tab": [34, 25, 64, 12, 22], "i": 1, "j": 2},
    visual_data={"highlight": "compare", "message": "Échange de 64 et 25", "array": [34, 25, 64, 12, 22], "swapped": [1, 2]}
)

SimulationStep.objects.create(
    simulation=sim6,
    step_number=4,
    description="64 > 12, on échange",
    state_data={"tab": [34, 25, 12, 64, 22], "i": 1, "j": 3},
    visual_data={"highlight": "compare", "message": "Échange de 64 et 12", "array": [34, 25, 12, 64, 22], "swapped": [2, 3]}
)

SimulationStep.objects.create(
    simulation=sim6,
    step_number=5,
    description="64 > 22, on échange. Première passe terminée.",
    state_data={"tab": [34, 25, 12, 22, 64], "i": 1, "j": 4},
    visual_data={"highlight": "compare", "message": "64 est à sa place finale", "array": [34, 25, 12, 22, 64], "swapped": [3, 4], "sorted": [4]}
)

SimulationStep.objects.create(
    simulation=sim6,
    step_number=6,
    description="Tableau trié après plusieurs passes",
    state_data={"tab": [12, 22, 25, 34, 64], "i": 4, "j": 1},
    visual_data={"highlight": "final", "message": "Tableau trié!", "array": [12, 22, 25, 34, 64], "sorted": [0, 1, 2, 3, 4]}
)

quiz6_1 = Quiz.objects.create(lesson=lesson6_1, title="Quiz: Tableaux", order=1)

q1 = QuizQuestion.objects.create(
    quiz=quiz6_1,
    question_text="Un tableau peut contenir des éléments de types différents.",
    question_type='true_false',
    points=20,
    order=1,
    explanation="Faux. Un tableau contient des éléments du même type."
)

QuizChoice.objects.create(question=q1, choice_text="Vrai", is_correct=False, order=1)
QuizChoice.objects.create(question=q1, choice_text="Faux", is_correct=True, order=2)

q2 = QuizQuestion.objects.create(
    quiz=quiz6_1,
    question_text="Quel est l'indice du premier élément d'un tableau en algorithmique ?",
    question_type='single',
    points=25,
    order=2,
    explanation="Par convention, les tableaux commencent à l'indice 1 (ou parfois 0 selon le langage)."
)

QuizChoice.objects.create(question=q2, choice_text="0", is_correct=False, order=1)
QuizChoice.objects.create(question=q2, choice_text="1", is_correct=True, order=2)
QuizChoice.objects.create(question=q2, choice_text="-1", is_correct=False, order=3)

q3 = QuizQuestion.objects.create(
    quiz=quiz6_1,
    question_text="Quelles opérations sont courantes sur un tableau ?",
    question_type='multiple',
    points=30,
    order=3,
    explanation="On peut parcourir, rechercher, trier et modifier les éléments d'un tableau."
)

QuizChoice.objects.create(question=q3, choice_text="Parcours", is_correct=True, order=1)
QuizChoice.objects.create(question=q3, choice_text="Recherche", is_correct=True, order=2)
QuizChoice.objects.create(question=q3, choice_text="Tri", is_correct=True, order=3)
QuizChoice.objects.create(question=q3, choice_text="Compilation", is_correct=False, order=4)

q4 = QuizQuestion.objects.create(
    quiz=quiz6_1,
    question_text="Pour parcourir un tableau, quelle structure de boucle est la plus adaptée ?",
    question_type='single',
    points=25,
    order=4,
    explanation="La boucle POUR est idéale car on connaît la taille du tableau."
)

QuizChoice.objects.create(question=q4, choice_text="POUR", is_correct=True, order=1)
QuizChoice.objects.create(question=q4, choice_text="SI", is_correct=False, order=2)
QuizChoice.objects.create(question=q4, choice_text="REPETER", is_correct=False, order=3)

Exercise.objects.create(
    lesson=lesson6_1,
    title="Trouver le maximum",
    description="Trouver le plus grand élément d'un tableau",
    problem_statement="""Créez un algorithme qui:
1. Remplit un tableau de 10 entiers
2. Trouve et affiche le plus grand élément""",
    expected_output="Le maximum est: 95",
    test_cases={"required_keywords": ["TABLEAU", "POUR", "maximum", "SI"], "forbidden_keywords": []},
    points=20,
    order=1,
    hints="Initialisez le maximum avec le premier élément, puis parcourez le tableau en comparant."
)

Exercise.objects.create(
    lesson=lesson6_1,
    title="Inverser un tableau",
    description="Inverser l'ordre des éléments d'un tableau",
    problem_statement="""Créez un algorithme qui inverse un tableau:
Exemple: [1, 2, 3, 4, 5] devient [5, 4, 3, 2, 1]""",
    expected_output="Tableau inversé",
    test_cases={"required_keywords": ["TABLEAU", "POUR", "temp"], "forbidden_keywords": []},
    points=20,
    order=2,
    hints="Échangez les éléments symétriques: premier avec dernier, deuxième avec avant-dernier, etc."
)

print("Module 6 créé avec succès!")

print("\n=== TOUS LES MODULES ONT ÉTÉ CRÉÉS AVEC SUCCÈS! ===")
print(f"Total modules: {Module.objects.count()}")
print(f"Total leçons: {Lesson.objects.count()}")
print(f"Total concepts: {Concept.objects.count()}")
print(f"Total exemples: {Example.objects.count()}")
print(f"Total simulations: {Simulation.objects.count()}")
print(f"Total quiz: {Quiz.objects.count()}")
print(f"Total exercices: {Exercise.objects.count()}")
