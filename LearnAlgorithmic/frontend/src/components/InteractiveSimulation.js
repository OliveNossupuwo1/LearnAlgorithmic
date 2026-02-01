import { useState, useEffect, useRef } from 'react';
import './AlgorithmSimulation.css';
import CartoonVisualization from './CartoonVisualization';
import VariablesVisualization from './VariablesVisualization';

// ==================== GÉNÉRATEUR ALÉATOIRE ====================

// Liste de codes conditionnels avec identifiants pour varier les simulations
const CONDITIONAL_CODES = [
  {
    id: 'age_majorite',
    code: `Algorithme VerificationAge
Variables: age : Entier
Debut
    Ecrire("Entrez votre age:")
    Lire(age)
    Si age >= 18 Alors
        Ecrire("Vous etes majeur")
    Sinon
        Ecrire("Vous etes mineur")
    Fin Si
Fin`,
    varName: 'age',
    threshold: 18,
    thenMessage: 'Vous etes majeur',
    elseMessage: 'Vous etes mineur'
  },
  {
    id: 'note_admission',
    code: `Algorithme TestAdmission
Variables: note : Entier
Debut
    Ecrire("Entrez la note:")
    Lire(note)
    Si note >= 10 Alors
        Ecrire("Admis")
    Sinon
        Ecrire("Refuse")
    Fin Si
Fin`,
    varName: 'note',
    threshold: 10,
    thenMessage: 'Admis',
    elseMessage: 'Refuse'
  },
  {
    id: 'temperature_meteo',
    code: `Algorithme Meteo
Variables: temperature : Entier
Debut
    Ecrire("Entrez la temperature:")
    Lire(temperature)
    Si temperature >= 25 Alors
        Ecrire("Il fait chaud")
    Sinon
        Ecrire("Il fait frais")
    Fin Si
Fin`,
    varName: 'temperature',
    threshold: 25,
    thenMessage: 'Il fait chaud',
    elseMessage: 'Il fait frais'
  },
  {
    id: 'solde_banque',
    code: `Algorithme VerificationSolde
Variables: solde : Entier
Debut
    Ecrire("Entrez votre solde:")
    Lire(solde)
    Si solde >= 0 Alors
        Ecrire("Compte positif")
    Sinon
        Ecrire("Compte negatif")
    Fin Si
Fin`,
    varName: 'solde',
    threshold: 0,
    thenMessage: 'Compte positif',
    elseMessage: 'Compte negatif'
  },
  {
    id: 'vitesse_limite',
    code: `Algorithme ControleVitesse
Variables: vitesse : Entier
Debut
    Ecrire("Entrez la vitesse:")
    Lire(vitesse)
    Si vitesse > 50 Alors
        Ecrire("Exces de vitesse")
    Sinon
        Ecrire("Vitesse correcte")
    Fin Si
Fin`,
    varName: 'vitesse',
    threshold: 50,
    thenMessage: 'Exces de vitesse',
    elseMessage: 'Vitesse correcte'
  },
  {
    id: 'stock_produit',
    code: `Algorithme GestionStock
Variables: quantite : Entier
Debut
    Ecrire("Entrez la quantite en stock:")
    Lire(quantite)
    Si quantite > 10 Alors
        Ecrire("Stock suffisant")
    Sinon
        Ecrire("Commander plus")
    Fin Si
Fin`,
    varName: 'quantite',
    threshold: 10,
    thenMessage: 'Stock suffisant',
    elseMessage: 'Commander plus'
  },
  {
    id: 'prix_reduction',
    code: `Algorithme Reduction
Variables: prix : Entier
Debut
    Ecrire("Entrez le prix:")
    Lire(prix)
    Si prix >= 100 Alors
        Ecrire("Reduction appliquee")
    Sinon
        Ecrire("Pas de reduction")
    Fin Si
Fin`,
    varName: 'prix',
    threshold: 100,
    thenMessage: 'Reduction appliquee',
    elseMessage: 'Pas de reduction'
  },
  {
    id: 'heure_salutation',
    code: `Algorithme Salutation
Variables: heure : Entier
Debut
    Ecrire("Entrez l'heure:")
    Lire(heure)
    Si heure < 12 Alors
        Ecrire("Bonjour")
    Sinon
        Ecrire("Bonsoir")
    Fin Si
Fin`,
    varName: 'heure',
    threshold: 12,
    thenMessage: 'Bonjour',
    elseMessage: 'Bonsoir'
  }
];

// Fonction pour obtenir un code conditionnel aléatoire
const getRandomConditionalCode = () => {
  const randomIndex = Math.floor(Math.random() * CONDITIONAL_CODES.length);
  return CONDITIONAL_CODES[randomIndex];
};

// ==================== BOUCLES - MODULE 4 ====================

// Liste de codes pour la boucle POUR
const LOOP_POUR_CODES = [
  {
    id: 'compteur_simple',
    code: `Algorithme CompteurSimple
Variables: i : Entier
Debut
    Pour i De 1 A N Faire
        Ecrire(i)
    Fin Pour
Fin`,
    varName: 'i',
    description: 'Afficher les nombres de 1 à N'
  },
  {
    id: 'somme_entiers',
    code: `Algorithme SommeEntiers
Variables: i, somme, N : Entier
Debut
    somme <- 0
    Pour i De 1 A N Faire
        somme <- somme + i
    Fin Pour
    Ecrire("Somme = ", somme)
Fin`,
    varName: 'somme',
    description: 'Calculer la somme de 1 à N'
  },
  {
    id: 'table_multiplication',
    code: `Algorithme TableMultiplication
Variables: i, N : Entier
Debut
    Pour i De 1 A 10 Faire
        Ecrire(N, " x ", i, " = ", N * i)
    Fin Pour
Fin`,
    varName: 'i',
    description: 'Afficher la table de multiplication de N'
  },
  {
    id: 'compte_rebours',
    code: `Algorithme CompteARebours
Variables: i, N : Entier
Debut
    Pour i De N A 1 Pas -1 Faire
        Ecrire(i)
    Fin Pour
    Ecrire("Decollage!")
Fin`,
    varName: 'i',
    description: 'Compte à rebours de N à 1'
  },
  {
    id: 'puissance',
    code: `Algorithme CalculPuissance
Variables: i, base, exposant, resultat : Entier
Debut
    resultat <- 1
    Pour i De 1 A exposant Faire
        resultat <- resultat * base
    Fin Pour
    Ecrire(base, "^", exposant, " = ", resultat)
Fin`,
    varName: 'resultat',
    description: 'Calculer base^exposant'
  },
  {
    id: 'nombres_pairs',
    code: `Algorithme NombresPairs
Variables: i, N : Entier
Debut
    Pour i De 2 A N Pas 2 Faire
        Ecrire(i)
    Fin Pour
Fin`,
    varName: 'i',
    description: 'Afficher les nombres pairs de 2 à N'
  }
];

// Liste de codes pour la boucle TANT QUE
const LOOP_TANTQUE_CODES = [
  {
    id: 'devinette',
    code: `Algorithme JeuDevinette
Variables: secret, essai : Entier
Debut
    secret <- 7
    Ecrire("Devinez le nombre:")
    Lire(essai)
    Tant Que essai <> secret Faire
        Ecrire("Mauvaise reponse, reessayez:")
        Lire(essai)
    Fin Tant Que
    Ecrire("Bravo! Vous avez trouve!")
Fin`,
    varName: 'essai',
    secretValue: 7,
    description: 'Deviner un nombre secret'
  },
  {
    id: 'division_successive',
    code: `Algorithme DivisionSuccessive
Variables: N : Entier
Debut
    Lire(N)
    Tant Que N > 1 Faire
        Ecrire(N)
        N <- N / 2
    Fin Tant Que
    Ecrire("Fin: N = ", N)
Fin`,
    varName: 'N',
    description: 'Diviser N par 2 jusqu\'à atteindre 1'
  },
  {
    id: 'somme_chiffres',
    code: `Algorithme SommeChiffres
Variables: N, somme : Entier
Debut
    somme <- 0
    Tant Que N > 0 Faire
        somme <- somme + (N Mod 10)
        N <- N / 10
    Fin Tant Que
    Ecrire("Somme des chiffres = ", somme)
Fin`,
    varName: 'somme',
    description: 'Calculer la somme des chiffres de N'
  },
  {
    id: 'factorielle',
    code: `Algorithme Factorielle
Variables: N, fact, i : Entier
Debut
    fact <- 1
    i <- 1
    Tant Que i <= N Faire
        fact <- fact * i
        i <- i + 1
    Fin Tant Que
    Ecrire(N, "! = ", fact)
Fin`,
    varName: 'fact',
    description: 'Calculer N!'
  },
  {
    id: 'pgcd',
    code: `Algorithme CalculPGCD
Variables: a, b, temp : Entier
Debut
    Tant Que b <> 0 Faire
        temp <- b
        b <- a Mod b
        a <- temp
    Fin Tant Que
    Ecrire("PGCD = ", a)
Fin`,
    varName: 'a',
    description: 'Calculer le PGCD de deux nombres'
  }
];

// Liste de codes pour la boucle REPETER...JUSQU'A
const LOOP_REPETER_CODES = [
  {
    id: 'validation_mot_passe',
    code: `Algorithme ValidationMotDePasse
Variables: motDePasse : Chaine
Debut
    Repeter
        Ecrire("Entrez le mot de passe:")
        Lire(motDePasse)
    Jusqu'a motDePasse = "secret"
    Ecrire("Acces autorise!")
Fin`,
    varName: 'motDePasse',
    correctValue: 'secret',
    description: 'Validation de mot de passe'
  },
  {
    id: 'menu_choix',
    code: `Algorithme MenuChoix
Variables: choix : Entier
Debut
    Repeter
        Ecrire("1. Option A")
        Ecrire("2. Option B")
        Ecrire("3. Quitter")
        Lire(choix)
    Jusqu'a choix >= 1 Et choix <= 3
    Ecrire("Choix valide!")
Fin`,
    varName: 'choix',
    validRange: [1, 3],
    description: 'Menu avec validation du choix'
  },
  {
    id: 'saisie_positive',
    code: `Algorithme SaisiePositive
Variables: nombre : Entier
Debut
    Repeter
        Ecrire("Entrez un nombre positif:")
        Lire(nombre)
    Jusqu'a nombre > 0
    Ecrire("Merci! Vous avez entre:", nombre)
Fin`,
    varName: 'nombre',
    condition: '> 0',
    description: 'Saisir un nombre positif'
  },
  {
    id: 'lancer_de',
    code: `Algorithme LancerDe
Variables: de : Entier
Debut
    Repeter
        de <- Aleatoire(1, 6)
        Ecrire("De = ", de)
    Jusqu'a de = 6
    Ecrire("Vous avez obtenu un 6!")
Fin`,
    varName: 'de',
    targetValue: 6,
    description: 'Lancer un dé jusqu\'à obtenir 6'
  },
  {
    id: 'confirmation',
    code: `Algorithme Confirmation
Variables: reponse : Chaine
Debut
    Repeter
        Ecrire("Voulez-vous continuer? (oui/non)")
        Lire(reponse)
    Jusqu'a reponse = "oui" Ou reponse = "non"
    Ecrire("Reponse enregistree:", reponse)
Fin`,
    varName: 'reponse',
    validValues: ['oui', 'non'],
    description: 'Demander confirmation oui/non'
  }
];

// Fonctions pour obtenir un code de boucle aléatoire
const getRandomLoopPourCode = () => {
  const randomIndex = Math.floor(Math.random() * LOOP_POUR_CODES.length);
  return LOOP_POUR_CODES[randomIndex];
};

const getRandomLoopTantQueCode = () => {
  const randomIndex = Math.floor(Math.random() * LOOP_TANTQUE_CODES.length);
  return LOOP_TANTQUE_CODES[randomIndex];
};

const getRandomLoopRepeterCode = () => {
  const randomIndex = Math.floor(Math.random() * LOOP_REPETER_CODES.length);
  return LOOP_REPETER_CODES[randomIndex];
};

// Fonction pour générer une valeur N aléatoire pour les boucles POUR
const getRandomLoopValue = () => {
  const options = [3, 4, 5, 6, 7, 8];
  return options[Math.floor(Math.random() * options.length)];
};

// ==================== FONCTIONS ET PROCÉDURES - MODULE 5 ====================

// Liste de codes pour les FONCTIONS
const FUNCTION_CODES = [
  {
    id: 'carre',
    name: 'Carre',
    description: 'Calcule le carré d\'un nombre',
    paramName: 'n',
    paramType: 'Entier',
    returnType: 'Entier',
    body: 'Retourner n * n',
    calculate: (n) => n * n
  },
  {
    id: 'cube',
    name: 'Cube',
    description: 'Calcule le cube d\'un nombre',
    paramName: 'n',
    paramType: 'Entier',
    returnType: 'Entier',
    body: 'Retourner n * n * n',
    calculate: (n) => n * n * n
  },
  {
    id: 'double',
    name: 'Double',
    description: 'Calcule le double d\'un nombre',
    paramName: 'x',
    paramType: 'Entier',
    returnType: 'Entier',
    body: 'Retourner x * 2',
    calculate: (x) => x * 2
  },
  {
    id: 'estPair',
    name: 'EstPair',
    description: 'Vérifie si un nombre est pair',
    paramName: 'n',
    paramType: 'Entier',
    returnType: 'Booleen',
    body: 'Retourner (n Mod 2) = 0',
    calculate: (n) => n % 2 === 0
  },
  {
    id: 'valeurAbsolue',
    name: 'ValeurAbsolue',
    description: 'Calcule la valeur absolue',
    paramName: 'x',
    paramType: 'Entier',
    returnType: 'Entier',
    body: 'Si x < 0 Alors\n        Retourner -x\n    Sinon\n        Retourner x\n    Fin Si',
    calculate: (x) => Math.abs(x)
  },
  {
    id: 'maximum',
    name: 'Maximum',
    description: 'Retourne le maximum de deux nombres',
    paramName: 'a, b',
    paramType: 'Entier, Entier',
    returnType: 'Entier',
    body: 'Si a > b Alors\n        Retourner a\n    Sinon\n        Retourner b\n    Fin Si',
    calculate: (a, b) => Math.max(a, b),
    twoParams: true
  }
];

// Liste de codes pour les PROCÉDURES
const PROCEDURE_CODES = [
  {
    id: 'afficherMessage',
    name: 'AfficherMessage',
    description: 'Affiche un message de bienvenue',
    paramName: 'nom',
    paramType: 'Chaine',
    body: 'Ecrire("Bonjour ", nom, "!")',
    output: (nom) => `Bonjour ${nom}!`
  },
  {
    id: 'afficherLigne',
    name: 'AfficherLigne',
    description: 'Affiche une ligne de séparation',
    paramName: 'longueur',
    paramType: 'Entier',
    body: 'Pour i De 1 A longueur Faire\n        Ecrire("-")\n    Fin Pour',
    output: (longueur) => '-'.repeat(longueur)
  },
  {
    id: 'afficherEtoiles',
    name: 'AfficherEtoiles',
    description: 'Affiche des étoiles',
    paramName: 'n',
    paramType: 'Entier',
    body: 'Pour i De 1 A n Faire\n        Ecrire("*")\n    Fin Pour',
    output: (n) => '*'.repeat(n)
  },
  {
    id: 'afficherResultat',
    name: 'AfficherResultat',
    description: 'Affiche un résultat formaté',
    paramName: 'valeur',
    paramType: 'Entier',
    body: 'Ecrire("Le resultat est: ", valeur)',
    output: (valeur) => `Le resultat est: ${valeur}`
  }
];

// Fonctions pour obtenir des codes aléatoires
const getRandomFunctionCode = () => {
  const randomIndex = Math.floor(Math.random() * FUNCTION_CODES.length);
  return FUNCTION_CODES[randomIndex];
};

const getRandomProcedureCode = () => {
  const randomIndex = Math.floor(Math.random() * PROCEDURE_CODES.length);
  return PROCEDURE_CODES[randomIndex];
};

// Valeurs de test pour fonctions
const getRandomFunctionTestValue = () => {
  const options = [2, 3, 4, 5, 6, 7, 8, -3, -5];
  return options[Math.floor(Math.random() * options.length)];
};

// ==================== VARIABLES ET CONSTANTES - MODULE 2 ====================

// Liste de scénarios pour les VARIABLES
const VARIABLE_SCENARIOS = [
  {
    id: 'calcul_age',
    variables: [
      { name: 'anneeNaissance', type: 'Entier', value: 2000 },
      { name: 'anneeCourante', type: 'Entier', value: 2024 },
      { name: 'age', type: 'Entier', value: null, formula: 'anneeCourante - anneeNaissance' }
    ],
    description: 'Calcul de l\'age'
  },
  {
    id: 'calcul_prix',
    variables: [
      { name: 'prixUnitaire', type: 'Reel', value: 15.50 },
      { name: 'quantite', type: 'Entier', value: 3 },
      { name: 'total', type: 'Reel', value: null, formula: 'prixUnitaire * quantite' }
    ],
    description: 'Calcul du prix total'
  },
  {
    id: 'conversion_temperature',
    variables: [
      { name: 'celsius', type: 'Reel', value: 25 },
      { name: 'fahrenheit', type: 'Reel', value: null, formula: '(celsius * 9/5) + 32' }
    ],
    description: 'Conversion Celsius vers Fahrenheit'
  },
  {
    id: 'calcul_moyenne',
    variables: [
      { name: 'note1', type: 'Entier', value: 15 },
      { name: 'note2', type: 'Entier', value: 12 },
      { name: 'note3', type: 'Entier', value: 18 },
      { name: 'moyenne', type: 'Reel', value: null, formula: '(note1 + note2 + note3) / 3' }
    ],
    description: 'Calcul de la moyenne'
  },
  {
    id: 'echange_valeurs',
    variables: [
      { name: 'a', type: 'Entier', value: 5 },
      { name: 'b', type: 'Entier', value: 10 },
      { name: 'temp', type: 'Entier', value: null }
    ],
    description: 'Echange de deux valeurs',
    isSwap: true
  }
];

// Liste de scénarios pour les CONSTANTES
const CONSTANT_SCENARIOS = [
  {
    id: 'calcul_cercle',
    constants: [
      { name: 'PI', type: 'Reel', value: 3.14159 }
    ],
    variables: [
      { name: 'rayon', type: 'Reel', value: 5 },
      { name: 'perimetre', type: 'Reel', value: null, formula: '2 * PI * rayon' },
      { name: 'aire', type: 'Reel', value: null, formula: 'PI * rayon * rayon' }
    ],
    description: 'Calcul du perimetre et aire d\'un cercle'
  },
  {
    id: 'conversion_km_miles',
    constants: [
      { name: 'FACTEUR_CONVERSION', type: 'Reel', value: 1.60934 }
    ],
    variables: [
      { name: 'miles', type: 'Reel', value: 10 },
      { name: 'kilometres', type: 'Reel', value: null, formula: 'miles * FACTEUR_CONVERSION' }
    ],
    description: 'Conversion miles vers kilometres'
  },
  {
    id: 'calcul_tva',
    constants: [
      { name: 'TAUX_TVA', type: 'Reel', value: 0.20 }
    ],
    variables: [
      { name: 'prixHT', type: 'Reel', value: 100 },
      { name: 'montantTVA', type: 'Reel', value: null, formula: 'prixHT * TAUX_TVA' },
      { name: 'prixTTC', type: 'Reel', value: null, formula: 'prixHT + montantTVA' }
    ],
    description: 'Calcul de la TVA'
  },
  {
    id: 'vitesse_lumiere',
    constants: [
      { name: 'VITESSE_LUMIERE', type: 'Entier', value: 299792 }
    ],
    variables: [
      { name: 'temps', type: 'Reel', value: 8.3 },
      { name: 'distance', type: 'Reel', value: null, formula: 'VITESSE_LUMIERE * temps' }
    ],
    description: 'Distance parcourue par la lumiere'
  }
];

// Fonction pour obtenir un scénario de variables aléatoire
const getRandomVariableScenario = () => {
  const randomIndex = Math.floor(Math.random() * VARIABLE_SCENARIOS.length);
  return VARIABLE_SCENARIOS[randomIndex];
};

// Fonction pour obtenir un scénario de constantes aléatoire
const getRandomConstantScenario = () => {
  const randomIndex = Math.floor(Math.random() * CONSTANT_SCENARIOS.length);
  return CONSTANT_SCENARIOS[randomIndex];
};

// Fonction pour générer une valeur de test aléatoire autour du seuil
const getRandomTestValue = (threshold) => {
  const options = [
    threshold - 5,
    threshold - 2,
    threshold,
    threshold + 2,
    threshold + 5
  ];
  return options[Math.floor(Math.random() * options.length)];
};

// Pools de données pour génération aléatoire
const VAR_NAMES = {
  nom: { type: "chaine", values: ["Alice", "Bob", "Charlie", "Diana", "Emma", "Frank", "Grace", "Hugo"] },
  prenom: { type: "chaine", values: ["Marie", "Jean", "Pierre", "Sophie", "Lucas", "Léa", "Antoine", "Clara"] },
  ville: { type: "chaine", values: ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Nantes", "Nice", "Toulouse"] },
  age: { type: "entier", values: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 35] },
  note: { type: "entier", values: [8, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  score: { type: "entier", values: [50, 60, 70, 75, 80, 85, 90, 95, 100] },
  taille: { type: "reel", values: [1.55, 1.60, 1.65, 1.70, 1.75, 1.80, 1.85, 1.90] },
  prix: { type: "reel", values: [9.99, 12.50, 15.00, 19.99, 24.50, 29.99, 35.00, 49.99] },
  temperature: { type: "reel", values: [15.5, 18.0, 20.5, 22.0, 25.5, 28.0, 30.5, 32.0] },
  estAdulte: { type: "booleen", values: [true, false] },
  estEtudiant: { type: "booleen", values: [true, false] },
  aPermis: { type: "booleen", values: [true, false] }
};

const QUESTION_TYPES = {
  declaration: [
    {
      type: "what_happens",
      template: "Que fait cette ligne de code ?\n{code}",
      choices: ["Déclare une variable de type {type}", "Affecte une valeur", "Affiche un résultat", "Supprime une variable"],
      correct_index: 0
    },
    {
      type: "predict",
      template: "Après l'exécution de '{code}', quelle est la valeur de {var} ?",
      choices: ["Aucune valeur (non initialisée)", "0", "null", "undefined"],
      correct_index: 0
    }
  ],
  affectation: [
    {
      type: "predict_value",
      template: "Quelle sera la valeur de '{var}' après cette instruction ?\n{code}",
      correctIsValue: true
    },
    {
      type: "memory_state",
      template: "Que se passe-t-il en mémoire quand on exécute '{code}' ?",
      choices: [
        "La valeur {value} est stockée dans la variable {var}",
        "Une nouvelle variable est créée",
        "La variable {var} est supprimée",
        "Rien ne se passe"
      ],
      correct_index: 0
    }
  ],
  operation: [
    {
      type: "compute",
      template: "Quelle sera la nouvelle valeur de '{var}' après cette opération ?\n{code}",
      correctIsResult: true
    },
    {
      type: "operation_type",
      template: "Quel type d'opération est effectué dans '{code}' ?",
      correctIsOperation: true
    }
  ]
};

// Fonction pour mélanger un tableau
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Fonction pour formater une valeur selon son type
const formatValue = (value, type) => {
  if (type === "chaine") return `"${value}"`;
  if (type === "booleen") return value ? "vrai" : "faux";
  return String(value);
};

// Génère un scénario aléatoire
const generateRandomScenario = () => {
  const varNames = Object.keys(VAR_NAMES);
  const selectedVars = shuffleArray(varNames).slice(0, 4);

  const scenario = {};
  selectedVars.forEach(varName => {
    const varInfo = VAR_NAMES[varName];
    const randomValue = varInfo.values[Math.floor(Math.random() * varInfo.values.length)];
    scenario[varName] = {
      type: varInfo.type,
      value: randomValue
    };
  });

  return scenario;
};

// Génère le code de l'algorithme à partir du scénario ET de l'opération finale
const generateAlgorithmCode = (scenario, finalOperation) => {
  let code = "// Programme de gestion de données\n";

  Object.entries(scenario).forEach(([varName, varData]) => {
    code += `${varData.type} ${varName}\n`;
    code += `${varName} ← ${formatValue(varData.value, varData.type)}\n\n`;
  });

  // Ajouter l'opération finale si elle existe
  if (finalOperation) {
    code += `${finalOperation.varName} ← ${finalOperation.varName} ${finalOperation.symbol} ${finalOperation.operand}\n`;
  }

  return code;
};

// Génère les étapes de simulation avec questions
// Retourne { steps, finalOperation } pour synchroniser avec le code
const generateSimulationSteps = (scenario) => {
  const steps = [];
  let stepNum = 1;
  let codeLineNum = 2;
  const state = {};
  const variablesCreated = [];
  let varIndex = 0;
  let finalOperation = null;

  // Étape 1: Début
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme. La mémoire est vide.",
    state_data: {},
    visual_data: {
      type: "variables",
      variables: [],
      operation: null,
      code_line: null
    }
  });

  // Pour chaque variable
  Object.entries(scenario).forEach(([varName, varData]) => {
    const { type: varType, value } = varData;
    const address = `0x${(1000 + variablesCreated.length * 100).toString(16)}`;

    // Étape: Déclaration
    const codeDecl = `${varType} ${varName}`;
    state[varName] = null;

    const varViz = {
      name: varName,
      type: varType,
      value: null,
      address: address,
      status: "new"
    };
    variablesCreated.push({ ...varViz });

    // Question pour la déclaration (seulement 2 premières variables)
    let question = null;
    if (varIndex < 2) {
      const questionTemplate = QUESTION_TYPES.declaration[Math.floor(Math.random() * QUESTION_TYPES.declaration.length)];
      question = {
        question: questionTemplate.template.replace("{code}", codeDecl).replace("{var}", varName).replace("{type}", varType),
        choices: questionTemplate.choices.map(c => c.replace("{type}", varType)),
        correct_index: questionTemplate.correct_index,
        explanation: `La ligne '${codeDecl}' déclare une variable nommée '${varName}' de type ${varType}. La variable est créée en mémoire mais n'a pas encore de valeur.`
      };
    }

    steps.push({
      step_number: stepNum++,
      description: `📦 Déclaration de la variable '${varName}' de type ${varType}.`,
      state_data: { ...state },
      visual_data: {
        type: "variables",
        variables: variablesCreated.map(v => ({ ...v })),
        operation: `Déclaration: ${codeDecl}`,
        highlight: varName,
        code_line: codeLineNum++,
        question
      }
    });

    // Étape: Affectation
    const codeAffect = `${varName} ← ${formatValue(value, varType)}`;
    state[varName] = value;

    // Mettre à jour la visualisation
    variablesCreated.forEach(v => {
      if (v.name === varName) {
        v.value = value;
        v.status = "modified";
      } else {
        v.status = null;
      }
    });

    // Question pour l'affectation (seulement 2 premières variables)
    question = null;
    if (varIndex < 2) {
      const questionTemplate = QUESTION_TYPES.affectation[Math.floor(Math.random() * QUESTION_TYPES.affectation.length)];

      if (questionTemplate.correctIsValue) {
        // Générer des mauvaises réponses
        let wrongValues;
        if (varType === "entier") {
          wrongValues = [value + 5, value - 3, value * 2];
        } else if (varType === "reel") {
          wrongValues = [value + 0.5, value - 0.25, value * 1.5];
        } else if (varType === "chaine") {
          wrongValues = VAR_NAMES[varName]?.values.filter(v => v !== value).slice(0, 3) || ["Erreur", "Inconnu", "Vide"];
        } else {
          wrongValues = [!value, "null", "undefined"];
        }

        const choices = shuffleArray([
          formatValue(value, varType),
          formatValue(wrongValues[0], varType),
          formatValue(wrongValues[1], varType),
          formatValue(wrongValues[2], varType)
        ]);

        question = {
          question: questionTemplate.template.replace("{var}", varName).replace("{code}", codeAffect),
          choices,
          correct_index: choices.indexOf(formatValue(value, varType)),
          explanation: `La variable '${varName}' reçoit la valeur ${formatValue(value, varType)}.`
        };
      } else {
        question = {
          question: questionTemplate.template.replace("{var}", varName).replace("{code}", codeAffect).replace("{value}", formatValue(value, varType)),
          choices: questionTemplate.choices.map(c =>
            c.replace("{var}", varName).replace("{value}", formatValue(value, varType))
          ),
          correct_index: questionTemplate.correct_index,
          explanation: `La variable '${varName}' reçoit la valeur ${formatValue(value, varType)} de type ${varType}.`
        };
      }
    }

    steps.push({
      step_number: stepNum++,
      description: `✏️ Affectation: '${varName}' = ${formatValue(value, varType)}`,
      state_data: { ...state },
      visual_data: {
        type: "variables",
        variables: variablesCreated.map(v => ({ ...v })),
        operation: `Affectation: ${codeAffect}`,
        highlight: varName,
        code_line: codeLineNum,
        question
      }
    });

    codeLineNum += 2;
    varIndex++;
  });

  // Opération finale sur variable numérique
  const numericVars = Object.entries(scenario).filter(([_, data]) =>
    data.type === "entier" || data.type === "reel"
  );

  if (numericVars.length > 0) {
    const [varName, varData] = numericVars[Math.floor(Math.random() * numericVars.length)];
    const oldValue = varData.value;
    const operations = [
      { symbol: "+", name: "addition" },
      { symbol: "-", name: "soustraction" },
      { symbol: "*", name: "multiplication" }
    ];
    const op = operations[Math.floor(Math.random() * operations.length)];
    const operands = varData.type === "entier" ? [1, 2, 5, 10] : [0.5, 1.0, 2.0];
    const operand = operands[Math.floor(Math.random() * operands.length)];

    let newValue;
    if (op.symbol === "+") newValue = oldValue + operand;
    else if (op.symbol === "-") newValue = oldValue - operand;
    else newValue = oldValue * operand;

    // Stocker l'opération finale pour la synchronisation avec le code
    finalOperation = {
      varName,
      symbol: op.symbol,
      operand,
      oldValue,
      newValue,
      opName: op.name
    };

    const codeOp = `${varName} ← ${varName} ${op.symbol} ${operand}`;
    state[varName] = newValue;

    variablesCreated.forEach(v => {
      if (v.name === varName) {
        v.value = newValue;
        v.status = "modified";
      } else {
        v.status = null;
      }
    });

    // Question pour l'opération
    const wrongResults = [
      oldValue + operand !== newValue ? oldValue + operand : oldValue - operand,
      oldValue * 2,
      oldValue
    ];
    const choices = shuffleArray([newValue, ...wrongResults]);

    const question = {
      question: `Quelle sera la nouvelle valeur de '${varName}' après cette opération ?\n${codeOp}`,
      choices: choices.map(v => String(Math.round(v * 100) / 100)),
      correct_index: choices.indexOf(newValue),
      explanation: `L'opération ${codeOp} effectue une ${op.name}. ${oldValue} ${op.symbol} ${operand} = ${newValue}`
    };

    steps.push({
      step_number: stepNum++,
      description: `🔢 Opération: ${codeOp}`,
      state_data: { ...state },
      visual_data: {
        type: "variables",
        variables: variablesCreated.map(v => ({ ...v })),
        operation: `Opération: ${codeOp}`,
        highlight: varName,
        code_line: codeLineNum++,
        question
      }
    });
  }

  // Étape finale
  variablesCreated.forEach(v => { v.status = null; });

  steps.push({
    step_number: stepNum,
    description: "✅ Fin du programme. État final de la mémoire.",
    state_data: { ...state },
    visual_data: {
      type: "variables",
      variables: variablesCreated.map(v => ({ ...v })),
      operation: "Programme terminé",
      highlight: null,
      code_line: null
    }
  });

  return { steps, finalOperation };
};

// ==================== GÉNÉRATION SIMULATIONS BOUCLES ====================

// Générer une simulation pour la boucle POUR
const generateLoopPourSimulation = (N) => {
  const steps = [];
  let stepNum = 1;
  const variables = { i: 0, somme: 0 };

  // Calculer la somme attendue
  let expectedSum = 0;
  for (let k = 1; k <= N; k++) expectedSum += k;

  const code = `Algorithme SommeEntiers
Variables: i, somme, N : Entier
Debut
    N <- ${N}
    somme <- 0
    Pour i De 1 A N Faire
        somme <- somme + i
    Fin Pour
    Ecrire("Somme = ", somme)
Fin`;

  // Étape 1: Début
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme",
    state_data: { variables: {}, current_line: 2, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: `Calcul de la somme des entiers de 1 à ${N}`
    }
  });

  // Étape 2: Initialisation de N
  variables.N = N;
  steps.push({
    step_number: stepNum++,
    description: `📦 Initialisation: N ← ${N}`,
    state_data: { variables: { ...variables, i: undefined, somme: undefined }, current_line: 3, phase: 'init' },
    visual_data: {
      title: "Initialisation de N",
      explanation: `La variable N reçoit la valeur ${N}`
    }
  });

  // Étape 3: Initialisation de somme
  variables.somme = 0;
  steps.push({
    step_number: stepNum++,
    description: "📦 Initialisation: somme ← 0",
    state_data: { variables: { N: N, somme: 0 }, current_line: 4, phase: 'init' },
    visual_data: {
      title: "Initialisation de somme",
      explanation: "La variable somme est initialisée à 0"
    }
  });

  // Étape 4: Début de la boucle
  steps.push({
    step_number: stepNum++,
    description: `🔄 Début de la boucle POUR i De 1 A ${N}`,
    state_data: { variables: { N: N, somme: 0, i: 1 }, current_line: 5, phase: 'loop_start' },
    visual_data: {
      title: "Entrée dans la boucle POUR",
      explanation: `La boucle va s'exécuter ${N} fois, avec i allant de 1 à ${N}`,
      question: `Combien de fois la boucle va-t-elle s'exécuter si N = ${N} ?`,
      options: [`${N} fois`, `${N-1} fois`, `${N+1} fois`, 'Infini'],
      correct_answer: 0,
      explanation_answer: `La boucle POUR i De 1 A ${N} s'exécute exactement ${N} fois`
    }
  });

  // Itérations de la boucle (montrer les premières et la dernière)
  let currentSum = 0;
  const iterationsToShow = N <= 5 ? N : 3; // Montrer toutes si N petit, sinon 3 premières

  for (let i = 1; i <= N; i++) {
    const oldSum = currentSum;
    currentSum += i;

    if (i <= iterationsToShow || i === N) {
      const isLastIteration = i === N;
      const showQuestion = i === 2 || isLastIteration; // Question à l'itération 2 et dernière

      steps.push({
        step_number: stepNum++,
        description: `🔁 Itération ${i}: i = ${i}, somme = ${oldSum} + ${i} = ${currentSum}`,
        state_data: {
          variables: { N: N, somme: currentSum, i: i },
          current_line: 6,
          phase: 'loop_body',
          iteration: i
        },
        visual_data: {
          title: `Itération ${i}/${N}`,
          explanation: `i = ${i}: somme ← ${oldSum} + ${i} = ${currentSum}`,
          loop_progress: { current: i, total: N },
          ...(showQuestion && {
            question: isLastIteration
              ? `Quelle est la valeur finale de somme après ${N} itérations ?`
              : `Après l'itération ${i}, quelle est la valeur de somme ?`,
            options: [
              `${currentSum}`,
              `${currentSum + 1}`,
              `${currentSum - 1}`,
              `${i}`
            ],
            correct_answer: 0,
            explanation_answer: `somme = ${oldSum} + ${i} = ${currentSum}`
          })
        }
      });
    } else if (i === iterationsToShow + 1) {
      // Indicateur de saut
      steps.push({
        step_number: stepNum++,
        description: `⏩ ... (itérations ${iterationsToShow + 1} à ${N - 1})`,
        state_data: {
          variables: { N: N, somme: '...', i: '...' },
          current_line: 6,
          phase: 'loop_skip'
        },
        visual_data: {
          title: "Itérations intermédiaires",
          explanation: `Les itérations ${iterationsToShow + 1} à ${N - 1} suivent le même principe`
        }
      });
      // Calculer la somme jusqu'à N-1 pour l'étape suivante
      for (let j = iterationsToShow + 1; j < N; j++) {
        currentSum += j;
      }
    }
  }

  // Étape: Fin de la boucle
  steps.push({
    step_number: stepNum++,
    description: "🔄 Fin de la boucle POUR",
    state_data: {
      variables: { N: N, somme: expectedSum, i: N },
      current_line: 7,
      phase: 'loop_end'
    },
    visual_data: {
      title: "Sortie de la boucle",
      explanation: `i a atteint ${N}, la boucle se termine`
    }
  });

  // Étape finale: Affichage
  steps.push({
    step_number: stepNum++,
    description: `📤 Affichage: "Somme = ${expectedSum}"`,
    state_data: {
      variables: { N: N, somme: expectedSum, i: N },
      current_line: 8,
      phase: 'output',
      output: `Somme = ${expectedSum}`
    },
    visual_data: {
      title: "Résultat final",
      output: `Somme = ${expectedSum}`,
      explanation: `La somme des entiers de 1 à ${N} est ${expectedSum}`,
      key_points: [
        `N = ${N}`,
        `Nombre d'itérations: ${N}`,
        `Résultat: 1+2+...+${N} = ${expectedSum}`
      ]
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;

  return {
    steps,
    code,
    questionsCount,
    inputValue: N.toString(),
    outputMessage: `Somme = ${expectedSum}`,
    loopType: 'POUR'
  };
};

// Générer une simulation pour la boucle TANT QUE
const generateLoopTantQueSimulation = (N) => {
  const steps = [];
  let stepNum = 1;

  // Calculer la factorielle
  let factorial = 1;
  for (let k = 1; k <= N; k++) factorial *= k;

  const code = `Algorithme Factorielle
Variables: N, fact, i : Entier
Debut
    N <- ${N}
    fact <- 1
    i <- 1
    Tant Que i <= N Faire
        fact <- fact * i
        i <- i + 1
    Fin Tant Que
    Ecrire(N, "! = ", fact)
Fin`;

  // Étape 1: Début
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme",
    state_data: { variables: {}, current_line: 2, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: `Calcul de ${N}! (factorielle de ${N})`
    }
  });

  // Initialisations
  steps.push({
    step_number: stepNum++,
    description: `📦 Initialisations: N ← ${N}, fact ← 1, i ← 1`,
    state_data: { variables: { N: N, fact: 1, i: 1 }, current_line: 5, phase: 'init' },
    visual_data: {
      title: "Initialisation des variables",
      explanation: `N = ${N}, fact = 1, i = 1`
    }
  });

  // Début de la boucle TANT QUE
  steps.push({
    step_number: stepNum++,
    description: `🔄 Évaluation: i <= N ? (1 <= ${N}) → VRAI`,
    state_data: {
      variables: { N: N, fact: 1, i: 1 },
      current_line: 6,
      phase: 'loop_condition',
      condition_eval: { condition: `i <= N`, evaluation: `1 <= ${N}`, result: true }
    },
    visual_data: {
      title: "Test de la condition",
      condition: "i <= N",
      evaluation: `1 <= ${N}`,
      result: true,
      result_text: 'VRAI',
      explanation: "La condition est vraie, on entre dans la boucle",
      question: "Quelle est la particularité de la boucle TANT QUE ?",
      options: [
        'Le test est fait AVANT chaque itération',
        'Le test est fait APRÈS chaque itération',
        'Elle s\'exécute toujours au moins une fois',
        'Elle compte automatiquement'
      ],
      correct_answer: 0,
      explanation_answer: "TANT QUE teste la condition AVANT d'exécuter le bloc"
    }
  });

  // Itérations
  let currentFact = 1;
  const iterationsToShow = N <= 5 ? N : 3;

  for (let i = 1; i <= N; i++) {
    const oldFact = currentFact;
    currentFact *= i;

    if (i <= iterationsToShow || i === N) {
      const showQuestion = i === N;

      steps.push({
        step_number: stepNum++,
        description: `🔁 Itération ${i}: fact = ${oldFact} × ${i} = ${currentFact}, puis i ← ${i + 1}`,
        state_data: {
          variables: { N: N, fact: currentFact, i: i + 1 },
          current_line: 7,
          phase: 'loop_body',
          iteration: i
        },
        visual_data: {
          title: `Itération ${i}`,
          explanation: `fact ← ${oldFact} × ${i} = ${currentFact}, puis i ← ${i + 1}`,
          loop_progress: { current: i, total: N },
          ...(showQuestion && {
            question: `Quelle est la valeur de ${N}! ?`,
            options: [
              `${factorial}`,
              `${factorial + N}`,
              `${N * N}`,
              `${factorial * 2}`
            ],
            correct_answer: 0,
            explanation_answer: `${N}! = 1×2×...×${N} = ${factorial}`
          })
        }
      });

      // Test de condition après chaque itération (sauf la dernière)
      if (i < N) {
        steps.push({
          step_number: stepNum++,
          description: `🔍 Test: ${i + 1} <= ${N} ? → VRAI, on continue`,
          state_data: {
            variables: { N: N, fact: currentFact, i: i + 1 },
            current_line: 6,
            phase: 'loop_condition',
            condition_eval: { condition: `i <= N`, evaluation: `${i + 1} <= ${N}`, result: true }
          },
          visual_data: {
            title: "Test de continuation",
            condition: "i <= N",
            evaluation: `${i + 1} <= ${N}`,
            result: true,
            result_text: 'VRAI'
          }
        });
      }
    } else if (i === iterationsToShow + 1) {
      steps.push({
        step_number: stepNum++,
        description: `⏩ ... (itérations ${iterationsToShow + 1} à ${N - 1})`,
        state_data: { variables: { N: N, fact: '...', i: '...' }, current_line: 7, phase: 'loop_skip' },
        visual_data: {
          title: "Itérations intermédiaires",
          explanation: `Les calculs continuent jusqu'à i = ${N}`
        }
      });
      for (let j = iterationsToShow + 1; j < N; j++) {
        currentFact *= j;
      }
    }
  }

  // Condition fausse - sortie
  steps.push({
    step_number: stepNum++,
    description: `🔍 Test: ${N + 1} <= ${N} ? → FAUX, sortie de boucle`,
    state_data: {
      variables: { N: N, fact: factorial, i: N + 1 },
      current_line: 6,
      phase: 'loop_exit',
      condition_eval: { condition: `i <= N`, evaluation: `${N + 1} <= ${N}`, result: false }
    },
    visual_data: {
      title: "Sortie de la boucle",
      condition: "i <= N",
      evaluation: `${N + 1} <= ${N}`,
      result: false,
      result_text: 'FAUX',
      explanation: "La condition est fausse, on sort de la boucle"
    }
  });

  // Affichage final
  steps.push({
    step_number: stepNum,
    description: `📤 Affichage: "${N}! = ${factorial}"`,
    state_data: {
      variables: { N: N, fact: factorial, i: N + 1 },
      current_line: 10,
      phase: 'output',
      output: `${N}! = ${factorial}`
    },
    visual_data: {
      title: "Résultat final",
      output: `${N}! = ${factorial}`,
      key_points: [
        `N = ${N}`,
        `Nombre d'itérations: ${N}`,
        `${N}! = ${factorial}`
      ]
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;

  return {
    steps,
    code,
    questionsCount,
    inputValue: N.toString(),
    outputMessage: `${N}! = ${factorial}`,
    loopType: 'TANT_QUE'
  };
};

// Générer une simulation pour la boucle REPETER...JUSQU'A
const generateLoopRepeterSimulation = (attempts) => {
  const steps = [];
  let stepNum = 1;
  const correctPassword = "secret";

  // Générer des tentatives aléatoires
  const wrongPasswords = ["123456", "password", "admin", "test"];
  const userAttempts = [];
  for (let i = 0; i < attempts - 1; i++) {
    userAttempts.push(wrongPasswords[i % wrongPasswords.length]);
  }
  userAttempts.push(correctPassword); // Dernière tentative correcte

  const code = `Algorithme ValidationMotDePasse
Variables: motDePasse : Chaine
Debut
    Repeter
        Ecrire("Entrez le mot de passe:")
        Lire(motDePasse)
    Jusqu'a motDePasse = "secret"
    Ecrire("Acces autorise!")
Fin`;

  // Étape 1: Début
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme",
    state_data: { variables: {}, current_line: 2, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: "Programme de validation de mot de passe"
    }
  });

  // Étape: Entrée dans REPETER
  steps.push({
    step_number: stepNum++,
    description: "🔄 Entrée dans la boucle REPETER",
    state_data: { variables: { motDePasse: null }, current_line: 3, phase: 'loop_start' },
    visual_data: {
      title: "Boucle REPETER...JUSQU'A",
      explanation: "On entre TOUJOURS dans la boucle au moins une fois",
      question: "Quelle est la particularité de REPETER...JUSQU'A ?",
      options: [
        "S'exécute au moins une fois (test APRÈS)",
        "Peut ne jamais s'exécuter (test AVANT)",
        "S'exécute un nombre fixe de fois",
        "Ne teste jamais de condition"
      ],
      correct_answer: 0,
      explanation_answer: "REPETER...JUSQU'A exécute le bloc PUIS teste la condition"
    }
  });

  // Itérations (tentatives de mot de passe)
  for (let i = 0; i < userAttempts.length; i++) {
    const attempt = userAttempts[i];
    const isCorrect = attempt === correctPassword;
    const attemptNum = i + 1;

    // Saisie
    steps.push({
      step_number: stepNum++,
      description: `📥 Tentative ${attemptNum}: Saisie de "${attempt}"`,
      state_data: {
        variables: { motDePasse: attempt },
        current_line: 5,
        phase: 'input',
        iteration: attemptNum
      },
      visual_data: {
        title: `Tentative ${attemptNum}`,
        explanation: `L'utilisateur entre: "${attempt}"`,
        user_input: attempt
      }
    });

    // Test de condition
    steps.push({
      step_number: stepNum++,
      description: `🔍 Test: "${attempt}" = "secret" ? → ${isCorrect ? 'VRAI' : 'FAUX'}`,
      state_data: {
        variables: { motDePasse: attempt },
        current_line: 6,
        phase: 'loop_condition',
        condition_eval: {
          condition: 'motDePasse = "secret"',
          evaluation: `"${attempt}" = "secret"`,
          result: isCorrect
        }
      },
      visual_data: {
        title: "Test de la condition",
        condition: 'motDePasse = "secret"',
        evaluation: `"${attempt}" = "secret"`,
        result: isCorrect,
        result_text: isCorrect ? 'VRAI → Sortie' : 'FAUX → Répéter',
        explanation: isCorrect
          ? "Condition vraie! On sort de la boucle"
          : "Condition fausse, on répète le bloc",
        ...(attemptNum === attempts && {
          question: `Après ${attempts} tentative(s), le programme sort de la boucle. Pourquoi ?`,
          options: [
            'La condition est devenue VRAIE',
            'Le nombre maximum d\'itérations est atteint',
            'Une erreur s\'est produite',
            'L\'utilisateur a abandonné'
          ],
          correct_answer: 0,
          explanation_answer: "REPETER...JUSQU'A sort quand la condition devient VRAIE"
        })
      }
    });
  }

  // Affichage final
  steps.push({
    step_number: stepNum,
    description: '📤 Affichage: "Acces autorise!"',
    state_data: {
      variables: { motDePasse: correctPassword },
      current_line: 7,
      phase: 'output',
      output: 'Acces autorise!'
    },
    visual_data: {
      title: "Accès autorisé",
      output: 'Acces autorise!',
      key_points: [
        `Nombre de tentatives: ${attempts}`,
        `Mot de passe correct: "${correctPassword}"`,
        'La boucle garantit au moins 1 exécution'
      ]
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;

  return {
    steps,
    code,
    questionsCount,
    inputValue: `${attempts} tentative(s)`,
    outputMessage: 'Acces autorise!',
    loopType: 'REPETER'
  };
};

// ==================== GÉNÉRATION SIMULATIONS FONCTIONS/PROCÉDURES ====================

// Générer une simulation pour les FONCTIONS
const generateFunctionSimulation = (testValue) => {
  const func = getRandomFunctionCode();
  const steps = [];
  let stepNum = 1;

  // Gérer les fonctions à deux paramètres
  let param1 = testValue;
  let param2 = Math.abs(testValue) + 2;
  let result;

  if (func.twoParams) {
    result = func.calculate(param1, param2);
  } else {
    result = func.calculate(param1);
  }

  const paramList = func.twoParams ? `${func.paramName}` : func.paramName;
  const paramTypeList = func.twoParams ? func.paramType : func.paramType;
  const argList = func.twoParams ? `${param1}, ${param2}` : `${param1}`;

  const code = `Algorithme Test${func.name}
Variables: resultat : ${func.returnType}
Debut
    resultat <- ${func.name}(${argList})
    Ecrire("Resultat = ", resultat)
Fin

Fonction ${func.name}(${paramList} : ${paramTypeList}) : ${func.returnType}
Debut
    ${func.body}
Fin Fonction`;

  // Étape 1: Début du programme principal
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme principal",
    state_data: { variables: {}, current_line: 2, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: `Programme qui utilise la fonction ${func.name}()`
    }
  });

  // Étape 2: Appel de la fonction
  steps.push({
    step_number: stepNum++,
    description: `📞 Appel: ${func.name}(${argList})`,
    state_data: {
      variables: { resultat: null },
      current_line: 3,
      phase: 'function_call',
      function_name: func.name,
      arguments: argList
    },
    visual_data: {
      title: "Appel de fonction",
      explanation: `Le programme appelle la fonction ${func.name} avec ${func.twoParams ? 'les arguments' : 'l\'argument'} ${argList}`,
      question: "Que se passe-t-il lors d'un appel de fonction ?",
      options: [
        "L'exécution saute vers la fonction",
        "Le programme s'arrête",
        "Une erreur se produit",
        "Rien ne se passe"
      ],
      correct_answer: 0,
      explanation_answer: "Lors d'un appel, l'exécution passe au corps de la fonction"
    }
  });

  // Étape 3: Entrée dans la fonction
  steps.push({
    step_number: stepNum++,
    description: `📥 Entrée dans ${func.name}(${argList})`,
    state_data: {
      variables: { [func.paramName.split(',')[0].trim()]: param1 },
      current_line: 7,
      phase: 'function_entry',
      scope: 'function'
    },
    visual_data: {
      title: `Fonction ${func.name}`,
      explanation: `Paramètre ${func.paramName.split(',')[0].trim()} reçoit la valeur ${param1}`,
      highlight_function: true
    }
  });

  // Étape 4: Exécution du corps de la fonction
  steps.push({
    step_number: stepNum++,
    description: `⚙️ Calcul: ${func.description}`,
    state_data: {
      variables: { [func.paramName.split(',')[0].trim()]: param1, _result: result },
      current_line: 8,
      phase: 'function_body'
    },
    visual_data: {
      title: "Exécution du corps",
      explanation: `Calcul en cours: ${func.body.split('\n')[0]}`,
      question: `Quel est le résultat de ${func.name}(${argList}) ?`,
      options: [
        `${result}`,
        `${result + 1}`,
        `${result - 1}`,
        `${param1}`
      ],
      correct_answer: 0,
      explanation_answer: `${func.name}(${argList}) = ${result}`
    }
  });

  // Étape 5: Retour de la fonction
  steps.push({
    step_number: stepNum++,
    description: `↩️ Retour: ${result}`,
    state_data: {
      variables: { _return: result },
      current_line: 8,
      phase: 'function_return'
    },
    visual_data: {
      title: "Retour de la fonction",
      explanation: `La fonction retourne la valeur ${result}`,
      return_value: result
    }
  });

  // Étape 6: Retour au programme principal
  steps.push({
    step_number: stepNum++,
    description: `📤 resultat <- ${result}`,
    state_data: {
      variables: { resultat: result },
      current_line: 3,
      phase: 'assignment',
      scope: 'main'
    },
    visual_data: {
      title: "Retour au programme principal",
      explanation: `La variable 'resultat' reçoit la valeur retournée: ${result}`
    }
  });

  // Étape 7: Affichage
  steps.push({
    step_number: stepNum,
    description: `📤 Affichage: "Resultat = ${result}"`,
    state_data: {
      variables: { resultat: result },
      current_line: 4,
      phase: 'output',
      output: `Resultat = ${result}`
    },
    visual_data: {
      title: "Résultat final",
      output: `Resultat = ${result}`,
      key_points: [
        `Fonction: ${func.name}()`,
        `Argument: ${argList}`,
        `Valeur retournée: ${result}`
      ]
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;

  return {
    steps,
    code,
    questionsCount,
    inputValue: argList,
    outputMessage: `Resultat = ${result}`,
    simType: 'FONCTION'
  };
};

// Générer une simulation pour les PROCÉDURES
const generateProcedureSimulation = (testValue) => {
  const proc = getRandomProcedureCode();
  const steps = [];
  let stepNum = 1;

  // Valeur de test adaptée au type
  let argValue = proc.paramType === 'Chaine' ? 'Alice' : Math.abs(testValue);
  const outputResult = proc.output(argValue);

  const code = `Algorithme Test${proc.name}
Debut
    ${proc.name}(${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue})
    Ecrire("Procedure terminee")
Fin

Procedure ${proc.name}(${proc.paramName} : ${proc.paramType})
Debut
    ${proc.body}
Fin Procedure`;

  // Étape 1: Début du programme principal
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme principal",
    state_data: { variables: {}, current_line: 1, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: `Programme qui utilise la procédure ${proc.name}()`
    }
  });

  // Étape 2: Appel de la procédure
  steps.push({
    step_number: stepNum++,
    description: `📞 Appel: ${proc.name}(${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue})`,
    state_data: {
      variables: {},
      current_line: 2,
      phase: 'procedure_call',
      procedure_name: proc.name,
      arguments: argValue
    },
    visual_data: {
      title: "Appel de procédure",
      explanation: `Le programme appelle la procédure ${proc.name}`,
      question: "Quelle est la différence entre une fonction et une procédure ?",
      options: [
        "Une procédure ne retourne pas de valeur",
        "Une procédure est plus rapide",
        "Une fonction ne peut pas avoir de paramètres",
        "Il n'y a aucune différence"
      ],
      correct_answer: 0,
      explanation_answer: "Une procédure effectue une action mais ne retourne pas de valeur, contrairement à une fonction"
    }
  });

  // Étape 3: Entrée dans la procédure
  steps.push({
    step_number: stepNum++,
    description: `📥 Entrée dans ${proc.name}(${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue})`,
    state_data: {
      variables: { [proc.paramName]: argValue },
      current_line: 6,
      phase: 'procedure_entry',
      scope: 'procedure'
    },
    visual_data: {
      title: `Procédure ${proc.name}`,
      explanation: `Paramètre ${proc.paramName} reçoit la valeur ${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue}`,
      highlight_procedure: true
    }
  });

  // Étape 4: Exécution du corps
  steps.push({
    step_number: stepNum++,
    description: `⚙️ Exécution: ${proc.description}`,
    state_data: {
      variables: { [proc.paramName]: argValue },
      current_line: 7,
      phase: 'procedure_body',
      output: outputResult
    },
    visual_data: {
      title: "Exécution du corps",
      explanation: `La procédure exécute: ${proc.body.split('\n')[0]}`,
      output: outputResult,
      question: `Que va afficher ${proc.name}(${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue}) ?`,
      options: [
        `"${outputResult}"`,
        `"${argValue}"`,
        `"Erreur"`,
        `"${proc.name}"`
      ],
      correct_answer: 0,
      explanation_answer: `La procédure affiche: "${outputResult}"`
    }
  });

  // Étape 5: Fin de la procédure
  steps.push({
    step_number: stepNum++,
    description: `↩️ Fin de la procédure (pas de valeur retournée)`,
    state_data: {
      variables: {},
      current_line: 8,
      phase: 'procedure_end'
    },
    visual_data: {
      title: "Fin de la procédure",
      explanation: "La procédure se termine et retourne au programme principal (sans valeur de retour)"
    }
  });

  // Étape 6: Retour au programme principal
  steps.push({
    step_number: stepNum,
    description: `📤 Suite du programme principal`,
    state_data: {
      variables: {},
      current_line: 3,
      phase: 'output',
      output: 'Procedure terminee'
    },
    visual_data: {
      title: "Retour au programme",
      output: 'Procedure terminee',
      key_points: [
        `Procédure: ${proc.name}()`,
        `Paramètre: ${proc.paramName} = ${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue}`,
        `Sortie: "${outputResult}"`,
        'Pas de valeur retournée'
      ]
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;

  return {
    steps,
    code,
    questionsCount,
    inputValue: `${proc.paramType === 'Chaine' ? `"${argValue}"` : argValue}`,
    outputMessage: outputResult,
    simType: 'PROCEDURE'
  };
};

// ==================== GÉNÉRATION SIMULATIONS VARIABLES/CONSTANTES ====================

// Générer une simulation pour les VARIABLES
const generateVariablesSimulation = () => {
  const scenario = getRandomVariableScenario();
  const steps = [];
  let stepNum = 1;
  const currentVars = {};

  // Générer le code
  let codeLines = [`Algorithme ${scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1).replace(/_/g, '')}`, 'Variables:'];
  scenario.variables.forEach(v => {
    codeLines.push(`    ${v.name} : ${v.type}`);
  });
  codeLines.push('Debut');

  // Calculer les valeurs
  const calculatedVars = {};
  scenario.variables.forEach(v => {
    if (v.value !== null) {
      calculatedVars[v.name] = v.value;
    }
  });

  // Traitement spécial pour l'échange
  if (scenario.isSwap) {
    codeLines.push(`    ${scenario.variables[0].name} <- ${scenario.variables[0].value}`);
    codeLines.push(`    ${scenario.variables[1].name} <- ${scenario.variables[1].value}`);
    codeLines.push(`    // Echange des valeurs`);
    codeLines.push(`    temp <- ${scenario.variables[0].name}`);
    codeLines.push(`    ${scenario.variables[0].name} <- ${scenario.variables[1].name}`);
    codeLines.push(`    ${scenario.variables[1].name} <- temp`);
    codeLines.push(`    Ecrire("a = ", ${scenario.variables[0].name}, ", b = ", ${scenario.variables[1].name})`);
  } else {
    scenario.variables.forEach(v => {
      if (v.value !== null) {
        codeLines.push(`    ${v.name} <- ${v.value}`);
      } else if (v.formula) {
        codeLines.push(`    ${v.name} <- ${v.formula}`);
      }
    });
    const lastVar = scenario.variables[scenario.variables.length - 1];
    codeLines.push(`    Ecrire("${lastVar.name} = ", ${lastVar.name})`);
  }
  codeLines.push('Fin');
  const code = codeLines.join('\n');

  // Étape 1: Début
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme",
    state_data: { variables: {}, current_line: 0, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: scenario.description
    }
  });

  // Étapes de déclaration
  let lineNum = 4;
  scenario.variables.forEach((v, idx) => {
    currentVars[v.name] = null;
    steps.push({
      step_number: stepNum++,
      description: `📦 Déclaration: ${v.name} (${v.type})`,
      state_data: {
        variables: { ...currentVars },
        current_line: lineNum++,
        phase: 'declaration'
      },
      visual_data: {
        title: "Déclaration de variable",
        explanation: `La variable '${v.name}' de type ${v.type} est créée en mémoire`,
        ...(idx === 0 && {
          question: "Que signifie déclarer une variable ?",
          options: [
            "Réserver un espace mémoire pour stocker une valeur",
            "Afficher la variable à l'écran",
            "Supprimer la variable",
            "Modifier la valeur de la variable"
          ],
          correct_answer: 0,
          explanation_answer: "Déclarer une variable réserve un espace en mémoire pour y stocker une valeur"
        })
      }
    });
  });

  // Traitement spécial pour l'échange
  if (scenario.isSwap) {
    const a = scenario.variables[0];
    const b = scenario.variables[1];

    // Affectations initiales
    currentVars[a.name] = a.value;
    steps.push({
      step_number: stepNum++,
      description: `✏️ Affectation: ${a.name} <- ${a.value}`,
      state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'assignment' },
      visual_data: { title: "Affectation", explanation: `${a.name} reçoit la valeur ${a.value}` }
    });

    currentVars[b.name] = b.value;
    steps.push({
      step_number: stepNum++,
      description: `✏️ Affectation: ${b.name} <- ${b.value}`,
      state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'assignment' },
      visual_data: { title: "Affectation", explanation: `${b.name} reçoit la valeur ${b.value}` }
    });

    lineNum++; // Commentaire

    // Échange
    currentVars.temp = a.value;
    steps.push({
      step_number: stepNum++,
      description: `🔄 temp <- ${a.name} (sauvegarde de ${a.value})`,
      state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'swap' },
      visual_data: {
        title: "Sauvegarde temporaire",
        explanation: `On sauvegarde la valeur de ${a.name} (${a.value}) dans temp`,
        question: "Pourquoi utilise-t-on une variable temporaire pour échanger deux valeurs ?",
        options: [
          "Pour ne pas perdre une des valeurs lors de l'échange",
          "Pour accélérer le programme",
          "C'est obligatoire en algorithmique",
          "Pour économiser de la mémoire"
        ],
        correct_answer: 0,
        explanation_answer: "Sans variable temporaire, on perdrait une valeur lors de l'écrasement"
      }
    });

    currentVars[a.name] = b.value;
    steps.push({
      step_number: stepNum++,
      description: `🔄 ${a.name} <- ${b.name} (${a.name} = ${b.value})`,
      state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'swap' },
      visual_data: { title: "Échange (1/2)", explanation: `${a.name} reçoit la valeur de ${b.name}` }
    });

    currentVars[b.name] = a.value;
    steps.push({
      step_number: stepNum++,
      description: `🔄 ${b.name} <- temp (${b.name} = ${a.value})`,
      state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'swap' },
      visual_data: { title: "Échange (2/2)", explanation: `${b.name} reçoit la valeur sauvegardée (${a.value})` }
    });

    const outputMsg = `a = ${b.value}, b = ${a.value}`;
    steps.push({
      step_number: stepNum,
      description: `📤 Affichage: "${outputMsg}"`,
      state_data: { variables: { ...currentVars }, current_line: lineNum, phase: 'output', output: outputMsg },
      visual_data: {
        title: "Résultat",
        output: outputMsg,
        key_points: [`Avant: a = ${a.value}, b = ${b.value}`, `Après: a = ${b.value}, b = ${a.value}`, 'Les valeurs ont été échangées']
      }
    });

    return { steps, code, questionsCount: 2, inputValue: `a=${a.value}, b=${b.value}`, outputMessage: outputMsg, simType: 'VARIABLE' };
  }

  // Affectations normales
  scenario.variables.forEach((v, idx) => {
    if (v.value !== null) {
      currentVars[v.name] = v.value;
      steps.push({
        step_number: stepNum++,
        description: `✏️ Affectation: ${v.name} <- ${v.value}`,
        state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'assignment' },
        visual_data: {
          title: "Affectation",
          explanation: `${v.name} reçoit la valeur ${v.value}`,
          ...(idx === 0 && {
            question: `Quelle est la valeur de ${v.name} après cette affectation ?`,
            options: [`${v.value}`, `${v.value + 1}`, '0', 'null'],
            correct_answer: 0,
            explanation_answer: `${v.name} <- ${v.value} affecte la valeur ${v.value} à ${v.name}`
          })
        }
      });
    } else if (v.formula) {
      // Calculer le résultat
      let result;
      try {
        const formulaWithValues = v.formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, match => {
          return currentVars[match] !== undefined ? currentVars[match] : match;
        });
        result = eval(formulaWithValues);
        if (typeof result === 'number') result = Math.round(result * 100) / 100;
      } catch (e) {
        result = '?';
      }
      currentVars[v.name] = result;
      steps.push({
        step_number: stepNum++,
        description: `🔢 Calcul: ${v.name} <- ${v.formula} = ${result}`,
        state_data: { variables: { ...currentVars }, current_line: lineNum++, phase: 'calculation' },
        visual_data: {
          title: "Calcul",
          explanation: `${v.name} = ${v.formula} = ${result}`,
          question: `Quel est le résultat de ${v.formula} ?`,
          options: [`${result}`, `${result + 1}`, `${result - 1}`, '0'],
          correct_answer: 0,
          explanation_answer: `${v.formula} = ${result}`
        }
      });
    }
  });

  // Affichage final
  const lastVar = scenario.variables[scenario.variables.length - 1];
  const outputMsg = `${lastVar.name} = ${currentVars[lastVar.name]}`;
  steps.push({
    step_number: stepNum,
    description: `📤 Affichage: "${outputMsg}"`,
    state_data: { variables: { ...currentVars }, current_line: lineNum, phase: 'output', output: outputMsg },
    visual_data: {
      title: "Résultat final",
      output: outputMsg,
      key_points: scenario.variables.map(v => `${v.name} = ${currentVars[v.name]}`)
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;
  return { steps, code, questionsCount, inputValue: scenario.description, outputMessage: outputMsg, simType: 'VARIABLE' };
};

// Générer une simulation pour les CONSTANTES
const generateConstantesSimulation = () => {
  const scenario = getRandomConstantScenario();
  const steps = [];
  let stepNum = 1;
  const currentVars = {};
  const constants = {};

  // Générer le code
  let codeLines = [`Algorithme ${scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1).replace(/_/g, '')}`, 'Constantes:'];
  scenario.constants.forEach(c => {
    codeLines.push(`    ${c.name} = ${c.value}`);
    constants[c.name] = c.value;
  });
  codeLines.push('Variables:');
  scenario.variables.forEach(v => {
    codeLines.push(`    ${v.name} : ${v.type}`);
  });
  codeLines.push('Debut');
  scenario.variables.forEach(v => {
    if (v.value !== null) {
      codeLines.push(`    ${v.name} <- ${v.value}`);
    } else if (v.formula) {
      codeLines.push(`    ${v.name} <- ${v.formula}`);
    }
  });
  const lastVar = scenario.variables[scenario.variables.length - 1];
  codeLines.push(`    Ecrire("${lastVar.name} = ", ${lastVar.name})`);
  codeLines.push('Fin');
  const code = codeLines.join('\n');

  // Étape 1: Début
  steps.push({
    step_number: stepNum++,
    description: "🎬 Début du programme",
    state_data: { variables: {}, constants: { ...constants }, current_line: 0, phase: 'init' },
    visual_data: {
      title: "Début de l'exécution",
      explanation: scenario.description
    }
  });

  // Déclaration des constantes
  let lineNum = 2;
  scenario.constants.forEach((c, idx) => {
    steps.push({
      step_number: stepNum++,
      description: `🔒 Constante: ${c.name} = ${c.value}`,
      state_data: { variables: {}, constants: { ...constants }, current_line: lineNum++, phase: 'constant' },
      visual_data: {
        title: "Déclaration de constante",
        explanation: `La constante ${c.name} est définie avec la valeur ${c.value}`,
        question: "Quelle est la différence entre une constante et une variable ?",
        options: [
          "Une constante ne peut pas être modifiée après sa déclaration",
          "Une constante est plus rapide qu'une variable",
          "Une constante peut contenir plusieurs valeurs",
          "Il n'y a aucune différence"
        ],
        correct_answer: 0,
        explanation_answer: "Une constante garde sa valeur initiale tout au long du programme, contrairement à une variable"
      }
    });
  });

  // Déclaration des variables
  lineNum++; // "Variables:"
  scenario.variables.forEach(v => {
    currentVars[v.name] = null;
    steps.push({
      step_number: stepNum++,
      description: `📦 Déclaration: ${v.name} (${v.type})`,
      state_data: { variables: { ...currentVars }, constants: { ...constants }, current_line: lineNum++, phase: 'declaration' },
      visual_data: { title: "Déclaration de variable", explanation: `Variable '${v.name}' de type ${v.type}` }
    });
  });

  lineNum++; // "Debut"

  // Affectations et calculs
  scenario.variables.forEach((v, idx) => {
    if (v.value !== null) {
      currentVars[v.name] = v.value;
      steps.push({
        step_number: stepNum++,
        description: `✏️ Affectation: ${v.name} <- ${v.value}`,
        state_data: { variables: { ...currentVars }, constants: { ...constants }, current_line: lineNum++, phase: 'assignment' },
        visual_data: { title: "Affectation", explanation: `${v.name} reçoit la valeur ${v.value}` }
      });
    } else if (v.formula) {
      let result;
      try {
        const allVars = { ...constants, ...currentVars };
        const formulaWithValues = v.formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, match => {
          return allVars[match] !== undefined ? allVars[match] : match;
        });
        result = eval(formulaWithValues);
        if (typeof result === 'number') result = Math.round(result * 100) / 100;
      } catch (e) {
        result = '?';
      }
      currentVars[v.name] = result;

      const constUsed = scenario.constants.find(c => v.formula.includes(c.name));
      steps.push({
        step_number: stepNum++,
        description: `🔢 Calcul: ${v.name} <- ${v.formula} = ${result}`,
        state_data: { variables: { ...currentVars }, constants: { ...constants }, current_line: lineNum++, phase: 'calculation' },
        visual_data: {
          title: "Calcul avec constante",
          explanation: `${v.name} = ${v.formula} = ${result}`,
          ...(constUsed && {
            question: `La formule utilise ${constUsed.name} = ${constUsed.value}. Peut-on modifier cette valeur ?`,
            options: [
              "Non, c'est une constante",
              "Oui, à tout moment",
              "Seulement à la fin du programme",
              "Seulement dans une fonction"
            ],
            correct_answer: 0,
            explanation_answer: `${constUsed.name} est une constante, sa valeur (${constUsed.value}) ne peut pas être modifiée`
          })
        }
      });
    }
  });

  // Affichage final
  const outputMsg = `${lastVar.name} = ${currentVars[lastVar.name]}`;
  steps.push({
    step_number: stepNum,
    description: `📤 Affichage: "${outputMsg}"`,
    state_data: { variables: { ...currentVars }, constants: { ...constants }, current_line: lineNum, phase: 'output', output: outputMsg },
    visual_data: {
      title: "Résultat final",
      output: outputMsg,
      key_points: [
        ...scenario.constants.map(c => `🔒 ${c.name} = ${c.value} (constante)`),
        ...scenario.variables.map(v => `📦 ${v.name} = ${currentVars[v.name]}`)
      ]
    }
  });

  const questionsCount = steps.filter(step => step.visual_data?.question).length;
  return { steps, code, questionsCount, inputValue: scenario.description, outputMessage: outputMsg, simType: 'CONSTANTE' };
};

// ==================== COMPOSANT PRINCIPAL ====================

/**
 * Composant de simulation interactive avec deux modes:
 * - Mode Observateur: l'utilisateur regarde la simulation (comme AlgorithmSimulation)
 * - Mode Interactif: l'utilisateur répond à des questions dans des boîtes de dialogue
 *
 * NOUVEAU: L'utilisateur peut entrer une valeur de test et voir l'exécution du code
 * avec cette valeur, avec des questions basées sur cette exécution.
 */
const InteractiveSimulation = ({ simulation }) => {
  const [mode, setMode] = useState('observer'); // 'observer' par défaut, 'interactive'
  const [userTestValue, setUserTestValue] = useState(''); // Valeur de test utilisée
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000); // 0.5x par défaut
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [generatedData, setGeneratedData] = useState(null);
  const [useDbData, setUseDbData] = useState(false);
  const [simulationWithUserValue, setSimulationWithUserValue] = useState(null); // Simulation avec valeur utilisateur
  const intervalRef = useRef(null);
  const hasInitialized = useRef(false); // Pour éviter la double initialisation

  // Initialiser automatiquement avec un code aléatoire et une valeur aléatoire
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Vérifier le type de simulation
    const code = simulation.algorithm_code || '';
    const codeUpper = code.toUpperCase();
    const title = (simulation.title || '').toUpperCase();

    // Détecter le type de simulation
    const isFunction = codeUpper.includes('FONCTION') || codeUpper.includes('RETOURNER') || title.includes('FONCTION');
    const isProcedure = (codeUpper.includes('PROCEDURE') || title.includes('PROCEDURE')) && !isFunction;
    const isLoopPour = (codeUpper.includes('POUR ') && codeUpper.includes('FIN POUR') || title.includes('POUR')) && !isFunction && !isProcedure;
    const isLoopTantQue = (codeUpper.includes('TANT QUE') && codeUpper.includes('FIN TANT QUE') || title.includes('TANT QUE')) && !isFunction && !isProcedure;
    const isLoopRepeter = (codeUpper.includes('REPETER') && codeUpper.includes('JUSQU') || title.includes('REPETER')) && !isFunction && !isProcedure;
    const isConditional = (codeUpper.includes('SI ') || codeUpper.includes('SINON')) && !isLoopPour && !isLoopTantQue && !isLoopRepeter && !isFunction && !isProcedure;
    const isConstant = (codeUpper.includes('CONSTANTE') || title.includes('CONSTANTE')) && !isFunction && !isProcedure && !isLoopPour && !isLoopTantQue && !isLoopRepeter && !isConditional;
    const isVariable = (title.includes('VARIABLE') || (codeUpper.includes('VARIABLES:') && !isConditional && !isLoopPour && !isLoopTantQue && !isLoopRepeter && !isFunction && !isProcedure && !isConstant));

    if (isVariable) {
      // Simulation VARIABLES
      const simData = generateVariablesSimulation();
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(simData.inputValue);
    } else if (isConstant) {
      // Simulation CONSTANTES
      const simData = generateConstantesSimulation();
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(simData.inputValue);
    } else if (isFunction) {
      // Simulation FONCTION
      const randomValue = getRandomFunctionTestValue();
      const simData = generateFunctionSimulation(randomValue);
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(randomValue.toString());
    } else if (isProcedure) {
      // Simulation PROCÉDURE
      const randomValue = getRandomFunctionTestValue();
      const simData = generateProcedureSimulation(randomValue);
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(randomValue.toString());
    } else if (isLoopPour) {
      // Simulation boucle POUR
      const randomN = getRandomLoopValue();
      const simData = generateLoopPourSimulation(randomN);
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(randomN.toString());
    } else if (isLoopTantQue) {
      // Simulation boucle TANT QUE
      const randomN = getRandomLoopValue();
      const simData = generateLoopTantQueSimulation(randomN);
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(randomN.toString());
    } else if (isLoopRepeter) {
      // Simulation boucle REPETER...JUSQU'A
      const randomAttempts = Math.floor(Math.random() * 3) + 2; // 2 à 4 tentatives
      const simData = generateLoopRepeterSimulation(randomAttempts);
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(randomAttempts.toString());
    } else if (isConditional) {
      // Simulation conditionnelle SI/SINON
      const randomCode = getRandomConditionalCode();
      const randomValue = getRandomTestValue(randomCode.threshold);
      const simData = generateConditionalSimulationFromTemplate(randomCode, randomValue);
      setSimulationWithUserValue(simData);
      setGeneratedData({
        steps: simData.steps,
        code: simData.code,
        scenario: null
      });
      setTotalQuestions(simData.questionsCount);
      setUserTestValue(randomValue.toString());
    } else if (simulation?.steps && simulation.steps.length > 0) {
      // Utiliser les données de la BD
      setUseDbData(true);
      loadDbSimulation();
    } else {
      setUseDbData(false);
      regenerateSimulation();
    }
  }, [simulation]);

  // Charger les données depuis la BD
  const loadDbSimulation = () => {
    if (!simulation?.steps || simulation.steps.length === 0) return;

    const steps = simulation.steps.map(step => ({
      step_number: step.step_number,
      description: step.description,
      state_data: step.state_data || {},
      visual_data: step.visual_data || {}
    }));

    const code = simulation.algorithm_code || '';
    const questionsCount = steps.filter(step => step.visual_data?.question).length;

    setGeneratedData({ steps, code, scenario: null });
    setTotalQuestions(questionsCount);
    setCurrentStep(0);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  // Générer une simulation à partir d'un template de code aléatoire
  const generateConditionalSimulationFromTemplate = (template, testValue) => {
    const { code, varName, threshold, thenMessage, elseMessage } = template;
    const numericValue = parseFloat(testValue);
    const steps = [];
    let stepNum = 1;
    const variables = {};

    // Trouver la condition dans le code
    const conditionMatch = code.match(/Si\s+(.+?)\s+Alors/i);
    const condition = conditionMatch ? conditionMatch[1].trim() : `${varName} >= ${threshold}`;

    // Déterminer l'opérateur utilisé dans la condition
    const opMatch = condition.match(/(>=|<=|>|<|=)/);
    const operator = opMatch ? opMatch[1] : '>=';

    // Évaluer la condition correctement selon l'opérateur
    let conditionResult;
    switch (operator) {
      case '>=': conditionResult = numericValue >= threshold; break;
      case '<=': conditionResult = numericValue <= threshold; break;
      case '>': conditionResult = numericValue > threshold; break;
      case '<': conditionResult = numericValue < threshold; break;
      case '=': conditionResult = numericValue === threshold; break;
      default: conditionResult = numericValue >= threshold;
    }

    const evaluationText = `${numericValue} ${operator} ${threshold}`;
    const outputMessage = conditionResult ? thenMessage : elseMessage;

    // Calculer les numéros de ligne du code
    // Structure typique:
    // 0: Algorithme NomAlgo
    // 1: Variables: varName : Entier
    // 2: Debut
    // 3:     Ecrire("...")
    // 4:     Lire(varName)
    // 5:     Si condition Alors
    // 6:         Ecrire("thenMessage")
    // 7:     Sinon
    // 8:         Ecrire("elseMessage")
    // 9:     Fin Si
    // 10: Fin

    // Étape 1: Début
    steps.push({
      step_number: stepNum++,
      description: "🎬 Début du programme",
      state_data: {
        variables: {},
        input_value: testValue,
        current_line: 2, // Ligne "Debut"
        phase: 'init'
      },
      visual_data: {
        title: "Début de l'exécution",
        explanation: `Le programme démarre avec la valeur d'entrée: ${testValue}`
      }
    });

    // Étape 2: Déclaration de variable
    steps.push({
      step_number: stepNum++,
      description: `📦 Déclaration de la variable '${varName}'`,
      state_data: {
        variables: { [varName]: null },
        input_value: testValue,
        current_line: 1, // Ligne "Variables: ..."
        phase: 'declaration'
      },
      visual_data: {
        title: "Déclaration de variable",
        explanation: `La variable '${varName}' est créée en mémoire (sans valeur pour l'instant)`
      }
    });

    // Étape 3: Affichage du message d'invite
    steps.push({
      step_number: stepNum++,
      description: `💬 Affichage: "Entrez votre ${varName}:"`,
      state_data: {
        variables: { [varName]: null },
        input_value: testValue,
        current_line: 3, // Ligne Ecrire("...")
        phase: 'input'
      },
      visual_data: {
        title: "Affichage d'invite",
        explanation: `Le programme demande à l'utilisateur d'entrer une valeur`
      }
    });

    // Étape 4: Lecture de la valeur
    variables[varName] = numericValue;
    steps.push({
      step_number: stepNum++,
      description: `📥 Lecture: ${varName} ← ${testValue}`,
      state_data: {
        variables: { ...variables },
        input_value: testValue,
        current_line: 4, // Ligne Lire(varName)
        phase: 'input'
      },
      visual_data: {
        title: "Lecture de la valeur",
        explanation: `L'utilisateur entre ${testValue}, stocké dans '${varName}'`,
        user_input: testValue,
        variables_after: { ...variables }
      }
    });

    // Étape 5: Évaluation de la condition (avec question)
    steps.push({
      step_number: stepNum++,
      description: `🔍 Évaluation: ${condition}`,
      state_data: {
        variables: { ...variables },
        input_value: testValue,
        current_line: 5, // Ligne Si...Alors
        phase: 'condition',
        condition_eval: {
          condition: condition,
          evaluation: evaluationText,
          result: conditionResult
        }
      },
      visual_data: {
        title: "Évaluation de la condition",
        condition: condition,
        evaluation: evaluationText,
        result: conditionResult,
        result_text: conditionResult ? 'VRAI' : 'FAUX',
        explanation: `Avec ${varName} = ${numericValue}, la condition "${condition}" devient "${evaluationText}" → ${conditionResult ? 'VRAI' : 'FAUX'}`,
        question: `Avec ${varName} = ${numericValue}, que vaut la condition "${condition}" ?`,
        options: ['VRAI', 'FAUX'],
        correct_answer: conditionResult ? 0 : 1,
        explanation_answer: `${evaluationText} est ${conditionResult ? 'VRAI' : 'FAUX'}`
      }
    });

    // Étape 6: Exécution du bloc approprié
    steps.push({
      step_number: stepNum++,
      description: conditionResult
        ? `✅ Condition VRAIE → Bloc ALORS`
        : `❌ Condition FAUSSE → Bloc SINON`,
      state_data: {
        variables: { ...variables },
        input_value: testValue,
        current_line: conditionResult ? 6 : 8, // Ligne du Ecrire dans ALORS ou SINON
        phase: 'execution',
        output: outputMessage
      },
      visual_data: {
        title: conditionResult ? "Bloc ALORS exécuté" : "Bloc SINON exécuté",
        highlight: `Ecrire("${outputMessage}")`,
        skipped_code: conditionResult ? `Ecrire("${elseMessage}")` : `Ecrire("${thenMessage}")`,
        output: outputMessage,
        explanation: conditionResult
          ? `La condition est VRAIE → on exécute le bloc ALORS`
          : `La condition est FAUSSE → on exécute le bloc SINON`,
        question: `Quel bloc de code est exécuté quand ${varName} = ${numericValue} ?`,
        options: [
          'Le bloc ALORS',
          'Le bloc SINON',
          'Les deux blocs',
          'Aucun bloc'
        ],
        correct_answer: conditionResult ? 0 : 1,
        explanation_answer: `La condition est ${conditionResult ? 'VRAIE' : 'FAUSSE'}, donc on exécute le bloc ${conditionResult ? 'ALORS' : 'SINON'}`
      }
    });

    // Étape 7: Affichage du résultat
    steps.push({
      step_number: stepNum++,
      description: `📤 Sortie: "${outputMessage}"`,
      state_data: {
        variables: { ...variables },
        input_value: testValue,
        current_line: 9, // Ligne Fin Si
        phase: 'output',
        output: outputMessage
      },
      visual_data: {
        title: "Sortie du programme",
        output: outputMessage,
        explanation: `Le programme affiche: "${outputMessage}"`
      }
    });

    // Étape finale
    steps.push({
      step_number: stepNum,
      description: "✅ Fin du programme",
      state_data: {
        variables: { ...variables },
        input_value: testValue,
        current_line: 10, // Ligne Fin
        phase: 'end',
        output: outputMessage
      },
      visual_data: {
        title: "Fin de l'exécution",
        summary: `Entrée: ${testValue} → Sortie: "${outputMessage}"`,
        key_points: [
          `Entrée: ${varName} = ${testValue}`,
          `Condition "${condition}" = ${conditionResult ? 'VRAI' : 'FAUX'}`,
          `Bloc exécuté: ${conditionResult ? 'ALORS' : 'SINON'}`,
          `Sortie: "${outputMessage}"`
        ]
      }
    });

    const questionsCount = steps.filter(step => step.visual_data?.question).length;

    return {
      steps,
      code,
      questionsCount,
      inputValue: testValue.toString(),
      outputMessage
    };
  };

  // Générer une nouvelle simulation aléatoire
  const regenerateRandomSimulation = () => {
    // Détecter le type de simulation actuel
    const currentSimType = simulationWithUserValue?.simType;
    const currentLoopType = simulationWithUserValue?.loopType;
    const code = simulation.algorithm_code || '';
    const codeUpper = code.toUpperCase();
    const title = (simulation.title || '').toUpperCase();

    // Détecter le type de simulation
    const isVariable = currentSimType === 'VARIABLE' || title.includes('VARIABLE');
    const isConstant = currentSimType === 'CONSTANTE' || title.includes('CONSTANTE');
    const isFunction = currentSimType === 'FONCTION' || codeUpper.includes('FONCTION') || title.includes('FONCTION');
    const isProcedure = currentSimType === 'PROCEDURE' || codeUpper.includes('PROCEDURE') || title.includes('PROCEDURE');
    const isLoopPour = currentLoopType === 'POUR' || (codeUpper.includes('POUR ') && !isFunction && !isProcedure) || (title.includes('POUR') && !isFunction && !isProcedure);
    const isLoopTantQue = currentLoopType === 'TANT_QUE' || codeUpper.includes('TANT QUE') || title.includes('TANT QUE');
    const isLoopRepeter = currentLoopType === 'REPETER' || codeUpper.includes('REPETER') || title.includes('REPETER');

    let simData;
    let newValue;

    if (isVariable) {
      simData = generateVariablesSimulation();
      newValue = simData.inputValue;
    } else if (isConstant) {
      simData = generateConstantesSimulation();
      newValue = simData.inputValue;
    } else if (isFunction) {
      newValue = getRandomFunctionTestValue();
      simData = generateFunctionSimulation(newValue);
    } else if (isProcedure) {
      newValue = getRandomFunctionTestValue();
      simData = generateProcedureSimulation(newValue);
    } else if (isLoopPour) {
      newValue = getRandomLoopValue();
      simData = generateLoopPourSimulation(newValue);
    } else if (isLoopTantQue) {
      newValue = getRandomLoopValue();
      simData = generateLoopTantQueSimulation(newValue);
    } else if (isLoopRepeter) {
      newValue = Math.floor(Math.random() * 3) + 2; // 2 à 4 tentatives
      simData = generateLoopRepeterSimulation(newValue);
    } else {
      // Par défaut: simulation conditionnelle
      const randomCode = getRandomConditionalCode();
      newValue = getRandomTestValue(randomCode.threshold);
      simData = generateConditionalSimulationFromTemplate(randomCode, newValue);
    }

    setSimulationWithUserValue(simData);
    setGeneratedData({
      steps: simData.steps,
      code: simData.code,
      scenario: null
    });
    setTotalQuestions(simData.questionsCount);
    setUserTestValue(typeof newValue === 'string' ? newValue : newValue.toString());
    setCurrentStep(0);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  // Générer une simulation basée sur la valeur entrée par l'utilisateur
  const generateSimulationWithUserValue = (inputValue) => {
    const code = simulation.algorithm_code || '';
    const parsedValue = parseFloat(inputValue);

    // Détecter le type de simulation (conditionnelle, variables, etc.)
    // Support des deux formats: SI/ALORS et Si/Alors
    const codeUpper = code.toUpperCase();
    const isConditional = codeUpper.includes('SI ') || codeUpper.includes('SINON') || codeUpper.includes('FIN SI');

    if (isConditional) {
      return generateConditionalSimulation(code, parsedValue, inputValue);
    } else {
      return generateVariableSimulation(code, parsedValue, inputValue);
    }
  };

  // Générer une simulation pour les structures conditionnelles
  const generateConditionalSimulation = (code, numericValue, rawInput) => {
    const steps = [];
    let stepNum = 1;
    const variables = {};

    // Trouver le nom de la variable d'entrée (support Lire et LIRE)
    let inputVarName = 'valeur';
    const lireMatch = code.match(/Lire\s*\(\s*(\w+)\s*\)/i);
    if (lireMatch) {
      inputVarName = lireMatch[1];
    }

    // Trouver la condition (support Si/Alors et SI/ALORS)
    let conditionMatch = code.match(/Si\s+(.+?)\s+Alors/i);
    let condition = conditionMatch ? conditionMatch[1].trim() : '';

    // Étape 1: Début
    steps.push({
      step_number: stepNum++,
      description: "🎬 Début du programme",
      state_data: {
        variables: {},
        input_value: rawInput,
        current_line: 0,
        phase: 'init'
      },
      visual_data: {
        title: "Début de l'exécution",
        explanation: `Le programme démarre avec la valeur d'entrée: ${rawInput}`
      }
    });

    // Étape 2: Déclaration de variable
    steps.push({
      step_number: stepNum++,
      description: `📦 Déclaration de la variable '${inputVarName}'`,
      state_data: {
        variables: { [inputVarName]: null },
        input_value: rawInput,
        current_line: 1,
        phase: 'declaration'
      },
      visual_data: {
        title: "Déclaration de variable",
        explanation: `La variable '${inputVarName}' est créée en mémoire (sans valeur pour l'instant)`
      }
    });

    // Étape 3: Lecture de la valeur
    variables[inputVarName] = numericValue;
    steps.push({
      step_number: stepNum++,
      description: `📥 Lecture: ${inputVarName} reçoit la valeur ${rawInput}`,
      state_data: {
        variables: { ...variables },
        input_value: rawInput,
        current_line: 2,
        phase: 'input'
      },
      visual_data: {
        title: "Lecture de la valeur",
        explanation: `L'utilisateur entre la valeur ${rawInput}, qui est stockée dans '${inputVarName}'`,
        user_input: rawInput,
        variables_after: { ...variables }
      }
    });

    // Évaluer la condition
    let conditionResult = false;
    let evaluationText = '';

    // Parser et évaluer la condition
    if (condition) {
      const condWithValue = condition.replace(new RegExp(inputVarName, 'g'), numericValue);
      evaluationText = condWithValue;

      // Évaluer les comparaisons simples
      const compMatch = condition.match(/(\w+)\s*(>=|<=|>|<|=|!=)\s*(\d+)/);
      if (compMatch) {
        const varName = compMatch[1];
        const operator = compMatch[2];
        const compareValue = parseFloat(compMatch[3]);
        const varValue = variables[varName] !== undefined ? variables[varName] : numericValue;

        switch(operator) {
          case '>=': conditionResult = varValue >= compareValue; break;
          case '<=': conditionResult = varValue <= compareValue; break;
          case '>': conditionResult = varValue > compareValue; break;
          case '<': conditionResult = varValue < compareValue; break;
          case '=': conditionResult = varValue === compareValue; break;
          case '!=': conditionResult = varValue !== compareValue; break;
          default: conditionResult = false;
        }
        evaluationText = `${varValue} ${operator} ${compareValue}`;
      }
    }

    // Étape 4: Évaluation de la condition (avec question)
    steps.push({
      step_number: stepNum++,
      description: `🔍 Évaluation de la condition: ${condition}`,
      state_data: {
        variables: { ...variables },
        input_value: rawInput,
        current_line: 3,
        phase: 'condition',
        condition_eval: {
          condition: condition,
          evaluation: evaluationText,
          result: conditionResult
        }
      },
      visual_data: {
        title: "Évaluation de la condition",
        condition: condition,
        evaluation: evaluationText,
        result: conditionResult,
        result_text: conditionResult ? 'VRAI' : 'FAUX',
        explanation: `Avec ${inputVarName} = ${numericValue}, la condition "${condition}" devient "${evaluationText}" qui est ${conditionResult ? 'VRAIE' : 'FAUSSE'}`,
        question: `Avec ${inputVarName} = ${numericValue}, que vaut la condition "${condition}" ?`,
        options: ['VRAI', 'FAUX'],
        correct_answer: conditionResult ? 0 : 1,
        explanation_answer: `${evaluationText} est ${conditionResult ? 'VRAI' : 'FAUX'}`
      }
    });

    // Trouver le bloc ALORS et SINON (support Si/Alors et SI/ALORS)
    let thenAction = '';
    let elseAction = '';
    // Regex pour capturer le bloc ALORS (jusqu'à SINON ou FIN SI)
    const thenMatch = code.match(/Alors\s*\n?\s*(.+?)(?:Sinon|Fin\s*Si)/is);
    // Regex pour capturer le bloc SINON (jusqu'à FIN SI)
    const elseMatch = code.match(/Sinon\s*\n?\s*(.+?)(?:Fin\s*Si)/is);

    if (thenMatch) {
      thenAction = thenMatch[1].trim();
    }
    if (elseMatch) {
      elseAction = elseMatch[1].trim();
    }

    // Étape 5: Exécution du bloc approprié
    const executedAction = conditionResult ? thenAction : elseAction;
    const skippedAction = conditionResult ? elseAction : thenAction;

    // Extraire le message d'affichage (support Ecrire et ECRIRE)
    let outputMessage = '';
    const ecrireMatch = executedAction.match(/Ecrire\s*\(\s*"([^"]+)"\s*\)/i);
    if (ecrireMatch) {
      outputMessage = ecrireMatch[1];
    } else {
      // Essayer sans guillemets
      const ecrireMatch2 = executedAction.match(/Ecrire\s*\(\s*([^)]+)\s*\)/i);
      if (ecrireMatch2) {
        outputMessage = ecrireMatch2[1].trim();
      }
    }

    steps.push({
      step_number: stepNum++,
      description: conditionResult
        ? `✅ Condition VRAIE → Exécution du bloc ALORS`
        : `❌ Condition FAUSSE → Exécution du bloc SINON`,
      state_data: {
        variables: { ...variables },
        input_value: rawInput,
        current_line: conditionResult ? 4 : 6,
        phase: 'execution',
        output: outputMessage
      },
      visual_data: {
        title: conditionResult ? "Bloc ALORS exécuté" : "Bloc SINON exécuté",
        highlight: executedAction,
        skipped_code: skippedAction || null,
        output: outputMessage,
        explanation: conditionResult
          ? `La condition est VRAIE, donc le bloc ALORS est exécuté: ${executedAction}`
          : `La condition est FAUSSE, donc le bloc SINON est exécuté: ${executedAction}`,
        question: `Quel bloc de code est exécuté quand ${inputVarName} = ${numericValue} ?`,
        options: [
          'Le bloc ALORS',
          'Le bloc SINON',
          'Les deux blocs',
          'Aucun bloc'
        ],
        correct_answer: conditionResult ? 0 : 1,
        explanation_answer: `La condition est ${conditionResult ? 'VRAIE' : 'FAUSSE'}, donc on exécute le bloc ${conditionResult ? 'ALORS' : 'SINON'}`
      }
    });

    // Étape 6: Affichage du résultat
    if (outputMessage) {
      steps.push({
        step_number: stepNum++,
        description: `📤 Affichage: "${outputMessage}"`,
        state_data: {
          variables: { ...variables },
          input_value: rawInput,
          current_line: conditionResult ? 5 : 7,
          phase: 'output',
          output: outputMessage
        },
        visual_data: {
          title: "Sortie du programme",
          output: outputMessage,
          explanation: `Le programme affiche: "${outputMessage}"`
        }
      });
    }

    // Étape finale
    steps.push({
      step_number: stepNum,
      description: "✅ Fin du programme",
      state_data: {
        variables: { ...variables },
        input_value: rawInput,
        phase: 'end',
        output: outputMessage
      },
      visual_data: {
        title: "Fin de l'exécution",
        summary: `Avec l'entrée ${rawInput}: condition ${conditionResult ? 'VRAIE' : 'FAUSSE'} → "${outputMessage}"`,
        key_points: [
          `Entrée: ${inputVarName} = ${rawInput}`,
          `Condition "${condition}" = ${conditionResult ? 'VRAI' : 'FAUX'}`,
          `Bloc exécuté: ${conditionResult ? 'ALORS' : 'SINON'}`,
          `Sortie: "${outputMessage}"`
        ]
      }
    });

    const questionsCount = steps.filter(step => step.visual_data?.question).length;

    return {
      steps,
      code,
      questionsCount,
      inputValue: rawInput
    };
  };

  // Générer une simulation pour les variables simples
  const generateVariableSimulation = (code, numericValue, rawInput) => {
    // Utiliser la logique existante avec la valeur de l'utilisateur
    const scenario = generateRandomScenario();
    const { steps, finalOperation } = generateSimulationSteps(scenario);
    const generatedCode = generateAlgorithmCode(scenario, finalOperation);
    const questionsCount = steps.filter(step => step.visual_data?.question).length;

    return {
      steps,
      code: generatedCode,
      questionsCount,
      inputValue: rawInput
    };
  };

  // Fonction pour régénérer la simulation (seulement pour les données aléatoires)
  const regenerateSimulation = () => {
    // Si on utilise les données BD, recharger depuis la BD
    if (useDbData) {
      loadDbSimulation();
      return;
    }

    const scenario = generateRandomScenario();
    const { steps, finalOperation } = generateSimulationSteps(scenario);
    const code = generateAlgorithmCode(scenario, finalOperation);
    const questionsCount = steps.filter(step => step.visual_data?.question).length;

    setGeneratedData({ steps, code, scenario });
    setTotalQuestions(questionsCount);
    setCurrentStep(0);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const steps = generatedData?.steps || [];
  const algorithmCode = generatedData?.code || '';

  // Gestion de la lecture automatique en mode observateur
  useEffect(() => {
    if (mode === 'observer' && isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mode, isPlaying, currentStep, speed, steps.length]);

  // Gestion de la lecture automatique en mode interactif
  useEffect(() => {
    if (mode === 'interactive' && currentStep < steps.length - 1 && !showQuestionDialog && !showFeedbackDialog) {
      const currentStepData = steps[currentStep];
      const question = currentStepData?.visual_data?.question;

      // Si pas de question sur cette étape, ou question déjà répondue, avancer automatiquement
      if (!question || answeredQuestions.has(currentStep)) {
        const timer = setTimeout(() => {
          setCurrentStep((prev) => {
            if (prev >= steps.length - 1) {
              return prev;
            }
            return prev + 1;
          });
        }, 2000); // 2 secondes pour voir l'étape avant de passer à la suivante

        return () => clearTimeout(timer);
      } else {
        // Il y a une question non répondue, afficher après un délai
        const timer = setTimeout(() => {
          setShowQuestionDialog(true);
        }, 2500);

        return () => clearTimeout(timer);
      }
    }
  }, [mode, currentStep, steps, answeredQuestions, showQuestionDialog, showFeedbackDialog]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (mode === 'interactive') {
      setScore(0);
      setAnsweredQuestions(new Set());
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // En mode interactif, vérifier si la question a été répondue
      if (mode === 'interactive') {
        const currentQuestion = steps[currentStep]?.visual_data?.question;
        if (currentQuestion && !answeredQuestions.has(currentStep)) {
          setShowQuestionDialog(true);
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = steps[currentStep]?.visual_data?.question;
    if (!currentQuestion || selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correct_index;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    // Marquer la question comme répondue
    setAnsweredQuestions(new Set([...answeredQuestions, currentStep]));

    // Fermer la question et afficher le feedback
    setShowQuestionDialog(false);
    setShowFeedbackDialog(true);
  };

  const handleSkipQuestion = () => {
    // Marquer la question comme répondue (passée)
    setAnsweredQuestions(new Set([...answeredQuestions, currentStep]));

    // Fermer la question
    setShowQuestionDialog(false);
    setSelectedAnswer(null);
    // L'avancement se fait automatiquement via le useEffect
  };

  const handleCloseFeedback = () => {
    setShowFeedbackDialog(false);
    setSelectedAnswer(null);
    // L'avancement se fait automatiquement via le useEffect
  };

  // Basculer entre les modes
  const handleToggleMode = () => {
    const newMode = mode === 'observer' ? 'interactive' : 'observer';
    setMode(newMode);
    setIsPlaying(false);
    setCurrentStep(0);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  // Affichage de la simulation (commun aux deux modes)
  if (!steps.length) {
    return (
      <div className="simulation-container">
        <p className="text-gray-500 text-center py-8">
          Aucune étape de simulation disponible.
        </p>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const visualData = currentStepData?.visual_data || {};

  // Normaliser le format de la question (BD vs généré)
  // Format BD: { question: "texte", options: [...], correct_answer: 1, explanation: "..." }
  // Format généré: { question: "texte", choices: [...], correct_index: 1, explanation: "..." }
  const rawQuestion = visualData?.question;
  let currentQuestion = null;
  if (rawQuestion) {
    if (typeof rawQuestion === 'object') {
      // Format généré - déjà un objet
      currentQuestion = rawQuestion;
    } else if (typeof rawQuestion === 'string' && visualData?.options) {
      // Format BD - convertir en format unifié
      currentQuestion = {
        question: rawQuestion,
        choices: visualData.options,
        correct_index: visualData.correct_answer,
        explanation: visualData.explanation || ''
      };
    }
  }

  return (
    <div className="simulation-container">
      {/* Header */}
      <div className="simulation-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="simulation-title">
              🎬 {simulation.title}
            </h3>
            <p className="simulation-description">{simulation.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Bouton "Nouvelle simulation" pour générer un nouveau code aléatoire */}
            {simulationWithUserValue && (
              <button
                onClick={regenerateRandomSimulation}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                }}
              >
                🔀 Nouvelle simulation
              </button>
            )}
            {/* Bouton "Nouvelle simulation" uniquement pour les données générées (sans entrée utilisateur) */}
            {!useDbData && !simulationWithUserValue && (
              <button
                onClick={() => { regenerateSimulation(); }}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }}
              >
                🔄 Nouvelle simulation
              </button>
            )}
            {/* Bouton "Recommencer" pour relancer avec la même valeur */}
            {(useDbData || simulationWithUserValue) && (
              <button
                onClick={() => { setCurrentStep(0); setScore(0); setAnsweredQuestions(new Set()); }}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                🔄 Recommencer
              </button>
            )}
            {/* Bouton de basculement de mode */}
            <button
              onClick={handleToggleMode}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'observer'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: mode === 'observer'
                  ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                  : '0 4px 15px rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = mode === 'observer'
                  ? '0 6px 20px rgba(245, 158, 11, 0.4)'
                  : '0 6px 20px rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = mode === 'observer'
                  ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                  : '0 4px 15px rgba(6, 182, 212, 0.3)';
              }}
            >
              {mode === 'observer' ? '✋ Mode Interactif' : '👀 Mode Observateur'}
            </button>
          </div>
        </div>

        {/* Affichage de la valeur de test et du message de sortie - Un seul cadre */}
        {simulationWithUserValue && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Valeur d'entrée */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📥</span>
              <span style={{ fontWeight: '500', color: '#64748b' }}>Entrée:</span>
              <span style={{
                backgroundColor: '#dbeafe',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontWeight: '700',
                color: '#1d4ed8'
              }}>
                {simulationWithUserValue.inputValue}
              </span>
            </div>

            {/* Flèche */}
            <span style={{ color: '#94a3b8', fontSize: '1.25rem' }}>→</span>

            {/* Message de sortie */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📤</span>
              <span style={{ fontWeight: '500', color: '#64748b' }}>Sortie:</span>
              <span style={{
                backgroundColor: '#dcfce7',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontWeight: '700',
                color: '#16a34a'
              }}>
                "{simulationWithUserValue.outputMessage || '...'}"
              </span>
            </div>
          </div>
        )}

        {/* Score en mode interactif */}
        {mode === 'interactive' && totalQuestions > 0 && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '600', color: '#065f46' }}>
              Score: {score} / {totalQuestions}
            </span>
            <span style={{ color: '#047857', fontSize: '0.875rem' }}>
              {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
            </span>
          </div>
        )}
      </div>

      {/* Main Content: Visualization + Code */}
      <div className="simulation-main">
        {/* LEFT: Visualization */}
        <div className="visualization-panel">
          <div className="cartoon-stage">
            {visualData.type === 'cartoon' && (
              <CartoonVisualization data={visualData} />
            )}
            {visualData.type === 'variables' && (
              <VariablesVisualization data={visualData} />
            )}
            {visualData.type === 'array' && (
              <ArrayVisualization data={visualData} />
            )}
            {visualData.type === 'sorting' && (
              <SortingVisualization data={visualData} />
            )}
            {visualData.type === 'search' && (
              <SearchVisualization data={visualData} />
            )}
            {!visualData.type && (visualData.variables || visualData.constants) && (
              <VariablesVisualization data={visualData} />
            )}
            {/* Visualisation pour les simulations conditionnelles (SI...ALORS) */}
            {!visualData.type && (visualData.condition || visualData.title || visualData.key_points) && (
              <ConditionalVisualization data={visualData} />
            )}
            {/* Visualisation pour les questions de quiz - exécution pas à pas */}
            {!visualData.type && visualData.question && visualData.options && (
              <QuizVisualization data={visualData} stateData={currentStepData?.state_data} algorithmCode={algorithmCode} />
            )}
            {!visualData.type && !visualData.variables && !visualData.constants && !visualData.condition && !visualData.title && !visualData.key_points && !visualData.question && (
              <div className="placeholder-visual">
                <div className="cartoon-character">🤖</div>
                <p>Visualisation en cours...</p>
              </div>
            )}
          </div>

          {/* Current Step Description */}
          <div className="step-description">
            <div className="step-badge">
              Étape {currentStep + 1} / {steps.length}
            </div>
            <p className="step-text">{currentStepData?.description}</p>
          </div>
        </div>

        {/* RIGHT: Code & Variables */}
        <div className="code-panel">
          {/* Algorithm Code */}
          <div className="code-section">
            <h4 className="code-title">📝 Code de l'algorithme</h4>
            <pre className="code-block">
              <code>
                {algorithmCode.split('\n').map((line, idx) => {
                  // Utiliser current_line du state_data ou code_line du visual_data
                  const currentLine = currentStepData?.state_data?.current_line;
                  const visualLine = visualData?.code_line;
                  const isHighlighted = currentLine === idx || visualLine === idx + 1;

                  return (
                    <div
                      key={idx}
                      className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                      style={isHighlighted ? {
                        backgroundColor: '#fef3c7',
                        borderLeft: '4px solid #f59e0b',
                        marginLeft: '-4px',
                        paddingLeft: '4px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      } : {
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span className="line-number" style={{
                        color: isHighlighted ? '#d97706' : '#6b7280',
                        fontWeight: isHighlighted ? '700' : '400'
                      }}>{idx + 1}</span>
                      <span className="line-content" style={{
                        color: isHighlighted ? '#92400e' : 'inherit'
                      }}>
                        {isHighlighted && <span style={{ marginRight: '0.5rem' }}>▶</span>}
                        {line}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Variables State */}
          <div className="variables-section">
            <h4 className="variables-title">📊 État de l'exécution</h4>
            <div className="variables-list">
              {(() => {
                const stateData = currentStepData?.state_data || {};
                const translations = {
                  'variables': '📦 Variables',
                  'input_value': '📥 Valeur entrée',
                  'phase': '🔄 Phase',
                  'current_line': '📍 Ligne courante',
                  'output': '📤 Sortie',
                  'condition_eval': '🔍 Évaluation condition'
                };

                return Object.entries(stateData).map(([key, value]) => {
                  // Ignorer condition_eval car c'est affiché ailleurs
                  if (key === 'condition_eval') return null;

                  const label = translations[key] || key;
                  let displayValue = value;

                  // Formater les valeurs spéciales
                  if (key === 'variables' && typeof value === 'object') {
                    displayValue = Object.keys(value).length > 0
                      ? Object.entries(value).map(([k, v]) => `${k} = ${v === null ? '?' : v}`).join(', ')
                      : '(aucune)';
                  } else if (key === 'phase') {
                    const phases = {
                      'init': 'Initialisation',
                      'declaration': 'Déclaration',
                      'input': 'Lecture',
                      'condition': 'Évaluation',
                      'execution': 'Exécution',
                      'output': 'Affichage',
                      'end': 'Fin'
                    };
                    displayValue = phases[value] || value;
                  } else if (typeof value === 'object') {
                    displayValue = JSON.stringify(value);
                  }

                  return (
                    <div key={key} className="variable-item">
                      <span className="variable-name">{label}:</span>
                      <span className="variable-value">{displayValue}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="simulation-controls">
        <button onClick={handleReset} className="control-btn reset-btn" title="Reset">
          ⏮️
        </button>
        <button
          onClick={handlePrevious}
          className="control-btn"
          disabled={currentStep === 0}
          title="Previous"
        >
          ◀️
        </button>
        {mode === 'observer' && (
          <>
            {isPlaying ? (
              <button onClick={handlePause} className="control-btn play-btn" title="Pause">
                ⏸️
              </button>
            ) : (
              <button onClick={handlePlay} className="control-btn play-btn" title="Play">
                ▶️
              </button>
            )}
          </>
        )}
        <button
          onClick={handleNext}
          className="control-btn"
          disabled={currentStep >= steps.length - 1}
          title="Next"
        >
          ▶️
        </button>

        {/* Speed Control (mode observateur uniquement) */}
        {mode === 'observer' && (
          <div className="speed-control">
            <label>⚡ Vitesse:</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="speed-select"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
        )}
      </div>

      {/* Boîte de dialogue - Question */}
      {showQuestionDialog && currentQuestion && (
        <DialogOverlay onClick={() => {}}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <DialogHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                ❓ Question
              </h3>
              <button
                onClick={handleSkipQuestion}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '0.25rem',
                  lineHeight: 1,
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Fermer"
              >
                ×
              </button>
            </DialogHeader>

            <DialogContent>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                color: '#1f2937'
              }}>
                {currentQuestion.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${selectedAnswer === index ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      backgroundColor: selectedAnswer === index ? '#eff6ff' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      fontWeight: selectedAnswer === index ? '500' : 'normal'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAnswer !== index) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAnswer !== index) {
                        e.currentTarget.style.backgroundColor = '#fff';
                      }
                    }}
                  >
                    <span style={{ marginRight: '0.5rem', fontWeight: '600' }}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {choice}
                  </button>
                ))}
              </div>
            </DialogContent>

            <DialogFooter>
              <button
                onClick={handleSkipQuestion}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#fff',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                Passer
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: selectedAnswer === null ? '#d1d5db' : '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswer !== null) {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer !== null) {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }
                }}
              >
                Valider
              </button>
            </DialogFooter>
          </DialogBox>
        </DialogOverlay>
      )}

      {/* Boîte de dialogue - Feedback */}
      {showFeedbackDialog && currentQuestion && (
        <DialogOverlay onClick={handleCloseFeedback}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <DialogHeader style={{
              backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2',
              borderBottom: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '600',
                color: isCorrect ? '#065f46' : '#991b1b'
              }}>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </h3>
            </DialogHeader>

            <DialogContent>
              <p style={{
                fontSize: '1.05rem',
                lineHeight: '1.6',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                {currentQuestion.explanation}
              </p>

              {!isCorrect && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fef3c7',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '4px',
                  marginTop: '1rem'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#92400e' }}>
                    <strong>Bonne réponse:</strong> {currentQuestion.choices[currentQuestion.correct_index]}
                  </p>
                </div>
              )}
            </DialogContent>

            <DialogFooter>
              <button
                onClick={handleCloseFeedback}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: isCorrect ? '#10b981' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isCorrect ? '#059669' : '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isCorrect ? '#10b981' : '#ef4444';
                }}
              >
                Continuer
              </button>
            </DialogFooter>
          </DialogBox>
        </DialogOverlay>
      )}
    </div>
  );
};

// Composants de visualisation spécifiques
const ArrayVisualization = ({ data }) => {
  const array = data.array || [];
  const labels = data.labels || [];
  const highlightIndex = data.highlightIndex;

  return (
    <div className="array-viz">
      {array.map((value, index) => (
        <div key={index} className="array-item">
          {labels[index] && (
            <div className="array-label">{labels[index]}</div>
          )}
          <div
            className={`array-box ${index === highlightIndex ? 'highlighted' : ''}`}
          >
            <div className="array-value">{value !== null ? value : '?'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SortingVisualization = ({ data }) => {
  const array = data.array || [];
  const comparing = data.comparing || [];
  const sorted = data.sorted || [];

  return (
    <div className="sorting-viz">
      {array.map((value, index) => (
        <div key={index} className="bar-container">
          <div
            className={`bar ${
              comparing.includes(index)
                ? 'comparing'
                : sorted.includes(index)
                ? 'sorted'
                : ''
            }`}
            style={{ height: `${value * 3}px` }}
          >
            <span className="bar-value">{value}</span>
          </div>
          <div className="bar-index">{index}</div>
        </div>
      ))}
    </div>
  );
};

const SearchVisualization = ({ data }) => {
  const array = data.array || [];
  const currentIndex = data.currentIndex;
  const found = data.found;
  const target = data.target;

  return (
    <div className="search-viz">
      <div className="search-target">
        🎯 Recherche de : <strong>{target}</strong>
      </div>
      <div className="search-array">
        {array.map((value, index) => (
          <div
            key={index}
            className={`search-box ${
              index === currentIndex
                ? found
                  ? 'found'
                  : 'checking'
                : index < currentIndex
                ? 'checked'
                : ''
            }`}
          >
            <div className="search-value">{value}</div>
            <div className="search-index">{index}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant de visualisation pour l'exécution pas à pas du code
const QuizVisualization = ({ data, stateData, algorithmCode }) => {
  // Extraire les informations d'exécution depuis stateData
  const currentLine = stateData?.current_line;
  const variables = stateData?.variables || {};
  const inputValue = stateData?.input_value;
  const outputValue = stateData?.output;
  const conditionEval = stateData?.condition_eval;
  const executionPhase = stateData?.phase || 'execution';

  // Parser le code pour l'affichage avec surbrillance
  const codeLines = algorithmCode ? algorithmCode.split('\n') : [];

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      overflowY: 'auto'
    }}>
      {/* Valeur d'entrée utilisée */}
      {inputValue !== undefined && (
        <div style={{
          backgroundColor: '#dbeafe',
          border: '2px solid #3b82f6',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>📥</span>
          <span style={{ fontWeight: '600', color: '#1e40af' }}>Entrée:</span>
          <span style={{
            backgroundColor: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#1d4ed8'
          }}>
            {inputValue}
          </span>
        </div>
      )}

      {/* État de la mémoire (Variables) */}
      <div style={{
        backgroundColor: '#1e293b',
        padding: '0.75rem 1rem',
        borderRadius: '8px'
      }}>
        <div style={{
          color: '#94a3b8',
          fontSize: '0.8rem',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>💾</span> MÉMOIRE (Variables)
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {Object.keys(variables).length > 0 ? (
            Object.entries(variables).map(([name, value]) => (
              <div key={name} style={{
                backgroundColor: '#334155',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  color: '#fbbf24',
                  fontFamily: 'monospace',
                  fontWeight: '600'
                }}>
                  {name}
                </span>
                <span style={{ color: '#64748b' }}>=</span>
                <span style={{
                  color: value === null || value === '?' ? '#ef4444' : '#4ade80',
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  fontSize: '1.1rem'
                }}>
                  {value === null || value === undefined ? '?' : JSON.stringify(value)}
                </span>
              </div>
            ))
          ) : (
            <span style={{ color: '#64748b', fontStyle: 'italic' }}>
              Aucune variable déclarée
            </span>
          )}
        </div>
      </div>

      {/* Évaluation de condition si présente */}
      {conditionEval && (
        <div style={{
          backgroundColor: conditionEval.result ? '#ecfdf5' : '#fef2f2',
          border: `2px solid ${conditionEval.result ? '#10b981' : '#ef4444'}`,
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Évaluation de la condition:
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {conditionEval.condition}
          </div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '1rem',
            fontFamily: 'monospace',
            color: '#6b7280'
          }}>
            → {conditionEval.evaluation}
          </div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: conditionEval.result ? '#059669' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span>{conditionEval.result ? '✅' : '❌'}</span>
            {conditionEval.result ? 'VRAI' : 'FAUX'}
          </div>
        </div>
      )}

      {/* Sortie si présente */}
      {outputValue && (
        <div style={{
          backgroundColor: '#1e293b',
          padding: '0.75rem 1rem',
          borderRadius: '8px'
        }}>
          <div style={{
            color: '#94a3b8',
            fontSize: '0.8rem',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📤</span> SORTIE
          </div>
          <div style={{
            color: '#4ade80',
            fontFamily: 'monospace',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {outputValue}
          </div>
        </div>
      )}

      {/* Ligne de code en cours d'exécution */}
      {currentLine !== undefined && codeLines[currentLine] && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          padding: '0.75rem 1rem',
          borderRadius: '8px'
        }}>
          <div style={{
            color: '#92400e',
            fontSize: '0.8rem',
            marginBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>▶️</span> Ligne {currentLine + 1} en cours d'exécution:
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#78350f',
            backgroundColor: '#fff',
            padding: '0.5rem',
            borderRadius: '4px'
          }}>
            {codeLines[currentLine].trim()}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant de visualisation pour les structures conditionnelles (SI...ALORS...FIN SI)
const ConditionalVisualization = ({ data }) => {
  const {
    title,
    explanation,
    condition,
    evaluation,
    result,
    result_text,
    syntax,
    highlight,
    output,
    skipped_code,
    key_points,
    syntax_reminder,
    variables_after,
    input_prompt,
    user_input,
    arrow,
    summary
  } = data;

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Titre de l'étape */}
      {title && (
        <h4 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1e40af',
          textAlign: 'center'
        }}>
          {title}
        </h4>
      )}

      {/* Syntaxe de la structure */}
      {syntax && (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          whiteSpace: 'pre-wrap'
        }}>
          {syntax}
        </div>
      )}

      {/* Code mis en surbrillance */}
      {highlight && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          whiteSpace: 'pre-wrap'
        }}>
          <span style={{ color: '#92400e', fontWeight: '600' }}>Code: </span>
          {highlight}
        </div>
      )}

      {/* Entrée utilisateur */}
      {input_prompt && (
        <div style={{
          backgroundColor: '#dbeafe',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ color: '#1e40af' }}>{input_prompt}</span>
          {user_input && (
            <div style={{
              backgroundColor: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: '600',
              color: '#059669'
            }}>
              Saisie: {user_input}
            </div>
          )}
        </div>
      )}

      {/* Variables après exécution */}
      {variables_after && (
        <div style={{
          backgroundColor: '#ecfdf5',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <span style={{ fontWeight: '600', color: '#065f46' }}>Variables: </span>
          {Object.entries(variables_after).map(([name, value]) => (
            <span key={name} style={{
              marginLeft: '0.5rem',
              backgroundColor: '#d1fae5',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              {name} = {JSON.stringify(value)}
            </span>
          ))}
        </div>
      )}

      {/* Évaluation de la condition */}
      {condition && (
        <div style={{
          backgroundColor: '#fff',
          border: '2px solid #6366f1',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '0.5rem', color: '#4f46e5', fontWeight: '600' }}>
            Condition à évaluer:
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontFamily: 'monospace',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {condition}
          </div>
          {evaluation && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '1.1rem',
              fontFamily: 'monospace',
              color: '#6b7280'
            }}>
              → {evaluation}
            </div>
          )}
          {result !== undefined && (
            <div style={{
              marginTop: '0.75rem',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: result ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{result ? '✅' : '❌'}</span>
              {result_text || (result ? 'VRAI' : 'FAUX')}
            </div>
          )}
        </div>
      )}

      {/* Flèche/indication de flux */}
      {arrow && (
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
          color: '#92400e'
        }}>
          → {arrow}
        </div>
      )}

      {/* Code sauté (condition fausse) */}
      {skipped_code && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '2px dashed #ef4444',
          padding: '1rem',
          borderRadius: '8px',
          opacity: 0.7
        }}>
          <span style={{ color: '#991b1b', fontWeight: '600' }}>Code ignoré: </span>
          <span style={{ fontFamily: 'monospace', textDecoration: 'line-through' }}>
            {skipped_code}
          </span>
        </div>
      )}

      {/* Sortie du programme */}
      {output && (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#4ade80',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <span style={{ color: '#9ca3af' }}>Sortie: </span>
          {output}
        </div>
      )}

      {/* Explication */}
      {explanation && (
        <div style={{
          backgroundColor: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: '1rem',
          borderRadius: '0 8px 8px 0',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: '#1e40af'
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Résumé */}
      {summary && (
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1rem',
          borderRadius: '8px',
          fontWeight: '500',
          color: '#166534'
        }}>
          📋 {summary}
        </div>
      )}

      {/* Points clés (résumé final) */}
      {key_points && key_points.length > 0 && (
        <div style={{
          backgroundColor: '#faf5ff',
          border: '2px solid #a855f7',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <div style={{ fontWeight: '600', color: '#7c3aed', marginBottom: '0.75rem' }}>
            Points clés à retenir:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#581c87' }}>
            {key_points.map((point, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rappel de syntaxe */}
      {syntax_reminder && (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          textAlign: 'center'
        }}>
          {syntax_reminder}
        </div>
      )}
    </div>
  );
};

// Composants pour les boîtes de dialogue
const DialogOverlay = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}
  >
    {children}
  </div>
);

const DialogBox = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      maxWidth: '450px',
      width: '90%',
      maxHeight: '60vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}
  >
    {children}
  </div>
);

const DialogHeader = ({ children, style = {} }) => (
  <div
    style={{
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
      ...style
    }}
  >
    {children}
  </div>
);

const DialogContent = ({ children }) => (
  <div style={{ padding: '1.5rem' }}>
    {children}
  </div>
);

const DialogFooter = ({ children }) => (
  <div
    style={{
      padding: '1.5rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem'
    }}
  >
    {children}
  </div>
);

export default InteractiveSimulation;
