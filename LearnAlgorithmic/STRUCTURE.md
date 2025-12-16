# 📂 STRUCTURE COMPLÈTE DU PROJET LearnAlgorithmic

## Vue d'ensemble

```
LearnAlgorithmic/
│
├── 📄 README.md                    ← Documentation complète
├── 📄 INSTALLATION.md              ← Guide d'installation simplifié
│
├── 📁 backend/                     ← APPLICATION DJANGO (API + Base de données)
│   │
│   ├── 📁 learnalgorithmic/       ← Configuration du projet Django
│   │   ├── __init__.py
│   │   ├── settings.py            ← ⚙️ Configuration principale
│   │   ├── urls.py                ← 🔗 Routes principales
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── 📁 courses/                ← Application principale (cours)
│   │   ├── __init__.py
│   │   ├── models.py              ← 📊 Modèles de données (tables)
│   │   ├── views.py               ← 🎯 Logique métier (API)
│   │   ├── serializers.py         ← 🔄 Conversion données ↔ JSON
│   │   ├── urls.py                ← 🔗 Routes API (/api/...)
│   │   ├── admin.py               ← 👑 Interface admin
│   │   └── apps.py
│   │
│   ├── manage.py                  ← 🛠️ Commandes Django
│   ├── requirements.txt           ← 📦 Dépendances Python
│   ├── populate_data.py           ← 📚 Script de données initiales
│   ├── .gitignore
│   │
│   ├── 📁 venv/                   ← Environnement virtuel (créé après installation)
│   └── 📄 db.sqlite3              ← Base de données (créée après migration)
│
└── 📁 frontend/                   ← APPLICATION REACT (Interface utilisateur)
    │
    ├── 📁 public/
    │   └── index.html             ← Page HTML principale
    │
    ├── 📁 src/
    │   │
    │   ├── 📁 components/         ← Composants réutilisables
    │   │   ├── Navbar.js
    │   │   ├── Simulation.js
    │   │   ├── Quiz.js
    │   │   └── ... (à créer selon besoins)
    │   │
    │   ├── 📁 pages/              ← Pages de l'application
    │   │   ├── Login.js           ← 🔐 Page de connexion
    │   │   ├── Register.js        ← 📝 Page d'inscription
    │   │   ├── Dashboard.js       ← 📊 Tableau de bord
    │   │   ├── Modules.js         ← 📚 Liste des modules
    │   │   ├── ModuleDetail.js    ← 📖 Détail d'un module
    │   │   └── LessonDetail.js    ← 📄 Contenu d'une leçon
    │   │
    │   ├── 📁 context/            ← Gestion d'état global
    │   │   └── AuthContext.js     ← 👤 Authentification
    │   │
    │   ├── 📁 services/           ← Communication avec l'API
    │   │   └── api.js             ← 🌐 Requêtes HTTP
    │   │
    │   ├── App.js                 ← 🎯 Composant principal + Routes
    │   ├── index.js               ← ⚡ Point d'entrée React
    │   └── index.css              ← 🎨 Styles Tailwind CSS
    │
    ├── package.json               ← 📦 Dépendances npm
    ├── tailwind.config.js         ← ⚙️ Configuration Tailwind
    ├── postcss.config.js          ← ⚙️ Configuration PostCSS
    ├── .gitignore
    │
    └── 📁 node_modules/           ← Dépendances (créé après npm install)
```

## 🗂️ Détail des Fichiers par Catégorie

### 🔧 FICHIERS DE CONFIGURATION

| Fichier | Emplacement | Fonction |
|---------|-------------|----------|
| `settings.py` | backend/learnalgorithmic/ | Configuration Django (BD, apps, middleware, etc.) |
| `package.json` | frontend/ | Dépendances et scripts npm |
| `tailwind.config.js` | frontend/ | Personnalisation de Tailwind CSS |
| `requirements.txt` | backend/ | Dépendances Python |

### 📊 FICHIERS DE DONNÉES

| Fichier | Emplacement | Fonction |
|---------|-------------|----------|
| `models.py` | backend/courses/ | Structure de la base de données |
| `populate_data.py` | backend/ | Données initiales (modules, leçons, quiz, etc.) |
| `db.sqlite3` | backend/ | Base de données SQLite (créé automatiquement) |

### 🎯 LOGIQUE MÉTIER (Backend)

| Fichier | Emplacement | Fonction |
|---------|-------------|----------|
| `views.py` | backend/courses/ | Endpoints API et logique métier |
| `serializers.py` | backend/courses/ | Transformation données ↔ JSON |
| `urls.py` | backend/courses/ | Routes API |
| `admin.py` | backend/courses/ | Configuration interface admin |

### 🎨 INTERFACE UTILISATEUR (Frontend)

| Fichier | Emplacement | Fonction |
|---------|-------------|----------|
| `App.js` | frontend/src/ | Routes et structure de l'app |
| `index.js` | frontend/src/ | Point d'entrée React |
| `index.css` | frontend/src/ | Styles globaux |
| `Login.js` | frontend/src/pages/ | Page de connexion |
| `Register.js` | frontend/src/pages/ | Page d'inscription |
| `Dashboard.js` | frontend/src/pages/ | Tableau de bord utilisateur |
| `Modules.js` | frontend/src/pages/ | Liste des modules |
| `ModuleDetail.js` | frontend/src/pages/ | Détail d'un module (leçons) |
| `LessonDetail.js` | frontend/src/pages/ | Contenu complet d'une leçon |

### 🔌 SERVICES ET CONTEXTES (Frontend)

| Fichier | Emplacement | Fonction |
|---------|-------------|----------|
| `api.js` | frontend/src/services/ | Communication avec le backend |
| `AuthContext.js` | frontend/src/context/ | Gestion de l'authentification |

## 🚀 Flux de l'Application

### 1. Démarrage

```
Terminal 1 (Backend)
└── python manage.py runserver
    └── Démarre API sur http://localhost:8000

Terminal 2 (Frontend)
└── npm start
    └── Démarre React sur http://localhost:3000
```

### 2. Authentification

```
User ouvre http://localhost:3000
└── Redirigé vers /login (Login.js)
    └── Remplit formulaire
        └── Envoi vers backend (api.js → authService.login)
            └── Backend valide (views.py → login_view)
                └── Retourne token JWT
                    └── Stocké dans localStorage
                        └── User redirigé vers /dashboard
```

### 3. Accès aux Modules

```
User clique "Mes Modules"
└── Affiche Modules.js
    └── Appel API (moduleService.getAll)
        └── Backend retourne liste modules + progression
            └── Affichage avec statuts (débloqué/verrouillé/complété)
                └── User clique module débloqué
                    └── Redirigé vers ModuleDetail.js
                        └── Affiche liste des leçons
```

### 4. Apprentissage d'une Leçon

```
User clique sur une leçon
└── Affiche LessonDetail.js
    └── Charge contenu complet :
        ├── Vidéo
        ├── Concepts
        ├── Exemples
        ├── Simulations
        ├── Quiz
        └── Exercices
            └── User répond au quiz
                └── Soumission (quizService.submit)
                    └── Backend calcule score
                        └── Mise à jour progression
                            └── Si toutes leçons validées :
                                └── Module complété
                                    └── Module suivant débloqué
```

## 📦 Où installer quoi ?

### Backend (Django)

```bash
cd backend/
python -m venv venv              # Créer environnement virtuel
source venv/bin/activate         # L'activer
pip install -r requirements.txt  # Installer dépendances
python manage.py migrate         # Créer base de données
python manage.py createsuperuser # Créer admin
python manage.py shell < populate_data.py  # Peupler données
```

### Frontend (React)

```bash
cd frontend/
npm install                      # Installer dépendances
```

## 🔐 Variables d'Environnement (Optionnel)

Pour la production, créez un fichier `.env` :

### Backend: `backend/.env`
```
SECRET_KEY=votre-cle-secrete
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com
DATABASE_URL=postgres://user:pass@localhost/db
```

### Frontend: `frontend/.env`
```
REACT_APP_API_URL=https://votre-api.com/api
```

## 🎓 Modules de Contenu

Les 6 modules sont définis dans `populate_data.py` :

1. **Introduction à l'algorithmique** (1 leçon)
2. **Variables et constantes** (2 leçons)
3. **Structures conditionnelles** (3 leçons)
4. **Boucles et itérations** (3 leçons)
5. **Fonctions et procédures** (2 leçons)
6. **Tableaux et listes** (1 leçon)

**Total : 17 leçons** avec quiz et exercices

## 📝 Fichiers à Créer/Modifier pour Personnalisation

### Ajouter du Contenu
→ Modifiez `backend/populate_data.py` ou utilisez l'interface admin

### Changer les Couleurs
→ Modifiez `frontend/tailwind.config.js` et `frontend/src/index.css`

### Ajouter des Pages
→ Créez dans `frontend/src/pages/` et ajoutez route dans `App.js`

### Modifier l'API
→ Éditez `backend/courses/views.py` et `serializers.py`

## ✅ Checklist Fichiers Essentiels

**Backend :**
- [x] `manage.py`
- [x] `settings.py`
- [x] `models.py`
- [x] `views.py`
- [x] `serializers.py`
- [x] `urls.py`
- [x] `populate_data.py`
- [x] `requirements.txt`

**Frontend :**
- [x] `package.json`
- [x] `App.js`
- [x] `index.js`
- [x] `index.css`
- [x] `api.js`
- [x] `AuthContext.js`
- [x] Pages principales (Login, Register, Dashboard, Modules)

## 🆘 Fichiers Manquants ?

Si un fichier est manquant, voici où le trouver :

1. **Backend** : Tous les fichiers sont dans le dossier `backend/`
2. **Frontend** : Tous les fichiers sont dans le dossier `frontend/`
3. **Documentation** : `README.md` et `INSTALLATION.md` à la racine

## 🎯 Prochaines Étapes

1. ✅ Vérifiez que tous les fichiers sont présents
2. ✅ Suivez `INSTALLATION.md` pour installer
3. ✅ Consultez `README.md` pour la documentation complète
4. ✅ Lancez l'application et testez !

Bonne chance avec votre projet LearnAlgorithmic ! 🚀
