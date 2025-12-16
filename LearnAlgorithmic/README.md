# LearnAlgorithmic - Application d'Apprentissage de l'Algorithmique

Une plateforme interactive pour apprendre l'algorithmique avec des modules progressifs, des quiz, des exercices et des simulations animées.

## 📋 Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Structure du Projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Utilisation](#utilisation)
- [Modules Disponibles](#modules-disponibles)

## ✨ Fonctionnalités

### Système d'Authentification
- Inscription et connexion sécurisées
- Gestion de session avec JWT
- Profil utilisateur personnalisé

### Apprentissage Progressif
- **6 modules** couvrant les fondamentaux de l'algorithmique
- **17 leçons** au total avec contenu riche
- Déblocage progressif des modules (min 50/100 pour valider)
- Possibilité de revoir les modules terminés

### Contenu Interactif par Leçon
- 🎥 **Vidéos explicatives** - Concepts visuels
- 📖 **Définitions et syntaxes** - Concepts clés
- 💡 **Exemples illustratifs** - Code commenté
- 🎬 **Simulations animées** - Exécution étape par étape
- 📝 **Quiz corrigés automatiquement** - Évaluation immédiate
- 💻 **Exercices de code** - Pratique avec feedback

### Suivi de Progression
- Dashboard avec statistiques détaillées
- Progression par module et leçon
- Historique des tentatives
- Activités récentes

## 🛠️ Technologies Utilisées

### Backend
- **Django 4.2.7** - Framework web Python
- **Django REST Framework** - API RESTful
- **SQLite** - Base de données (peut être changé en PostgreSQL)
- **JWT** - Authentification par token

### Frontend
- **React 18.2** - Bibliothèque JavaScript
- **React Router v6** - Routing
- **Axios** - Requêtes HTTP
- **Tailwind CSS** - Stylisation
- **Heroicons** - Icônes

## 📁 Structure du Projet

```
LearnAlgorithmic/
│
├── backend/                    # Application Django
│   ├── learnalgorithmic/      # Configuration du projet
│   │   ├── __init__.py
│   │   ├── settings.py        # Configuration Django
│   │   ├── urls.py            # URLs principales
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── courses/               # Application principale
│   │   ├── __init__.py
│   │   ├── models.py          # Modèles de données
│   │   ├── views.py           # Logique métier
│   │   ├── serializers.py     # Sérialisation API
│   │   ├── urls.py            # Routes API
│   │   ├── admin.py           # Interface admin
│   │   └── apps.py
│   │
│   ├── manage.py              # Script de gestion Django
│   ├── requirements.txt       # Dépendances Python
│   └── populate_data.py       # Script de données initiales
│
└── frontend/                  # Application React
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── components/        # Composants réutilisables
    │   ├── pages/            # Pages de l'application
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Modules.js
    │   │   ├── ModuleDetail.js
    │   │   └── LessonDetail.js
    │   │
    │   ├── context/          # Contextes React
    │   │   └── AuthContext.js
    │   │
    │   ├── services/         # Services API
    │   │   └── api.js
    │   │
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    │
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Installation

### Prérequis

- **Python 3.8+** installé
- **Node.js 16+** et npm installés
- **Git** (optionnel)

### Étape 1: Cloner ou Télécharger le Projet

```bash
# Si vous avez git
git clone <url-du-repo>
cd LearnAlgorithmic

# Sinon, décompressez le fichier zip téléchargé
```

### Étape 2: Installation du Backend (Django)

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel Python
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows:
venv\Scripts\activate

# Sur Mac/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données
python manage.py makemigrations
python manage.py migrate

# Créer un super utilisateur (admin)
python manage.py createsuperuser
# Suivez les instructions (username: admin, email: admin@example.com, password: admin123)

# Peupler la base de données avec le contenu des cours
python manage.py shell < populate_data.py

# OU exécutez ligne par ligne dans le shell Django:
python manage.py shell
# Puis copiez-collez le contenu de populate_data.py
```

### Étape 3: Installation du Frontend (React)

```bash
# Ouvrez un NOUVEAU terminal
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances npm
npm install

# Si vous avez des erreurs, essayez:
npm install --legacy-peer-deps
```

## ⚙️ Configuration

### Configuration Backend (optionnel)

Modifiez `backend/learnalgorithmic/settings.py` si nécessaire:

```python
# Pour changer la clé secrète (IMPORTANT en production!)
SECRET_KEY = 'votre-nouvelle-cle-secrete-tres-securisee'

# Pour activer PostgreSQL au lieu de SQLite:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'learnalgorithmic_db',
        'USER': 'votre_user',
        'PASSWORD': 'votre_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Configuration Frontend

Modifiez `frontend/src/services/api.js` si votre backend n'est pas sur localhost:8000:

```javascript
const API_BASE_URL = 'http://votre-serveur:8000/api';
```

## 🎯 Démarrage

### Démarrer le Backend

```bash
# Dans le terminal backend (avec venv activé)
cd backend
python manage.py runserver

# Le serveur démarre sur http://localhost:8000
# L'admin Django est accessible sur http://localhost:8000/admin
```

### Démarrer le Frontend

```bash
# Dans un NOUVEAU terminal
cd frontend
npm start

# L'application s'ouvre automatiquement sur http://localhost:3000
```

## 📚 Utilisation

### Première Connexion

1. **Créer un compte** sur http://localhost:3000/register
   - Remplissez le formulaire d'inscription
   - Vous serez automatiquement connecté

2. **Ou connectez-vous** avec un compte existant sur http://localhost:3000/login

### Parcours d'Apprentissage

1. **Dashboard** - Visualisez vos statistiques et progression globale

2. **Page Modules** - Accédez à la liste de tous les modules
   - Seul le Module 1 est débloqué au départ
   - Cliquez sur un module débloqué pour voir ses leçons

3. **Page Leçon** - Contenu complet d'une leçon:
   - Regardez la vidéo explicative
   - Lisez les définitions et syntaxes
   - Étudiez les exemples
   - Lancez les simulations interactives
   - Passez le quiz (questions à choix multiples)
   - Faites les exercices de code

4. **Validation**:
   - Score minimum: 50/100 sur quiz + exercices
   - Si réussi: leçon validée ✓
   - Toutes les leçons validées → module complété → module suivant débloqué

5. **Révision**:
   - Vous pouvez toujours revoir les modules complétés
   - Refaire les quiz et exercices pour améliorer votre score

## 📖 Modules Disponibles

### Module 1: Introduction à l'algorithmique
- 1 leçon: Qu'est-ce qu'un algorithme ?

### Module 2: Variables et constantes
- Leçon 1: Variables
- Leçon 2: Constantes

### Module 3: Structures conditionnelles
- Leçon 1: Structures conditionnelles simples
- Leçon 2: Structures alternatives
- Leçon 3: Structures conditionnelles complètes

### Module 4: Boucles et itérations
- Leçon 1: Structure POUR
- Leçon 2: Structure TANT QUE
- Leçon 3: Structure REPETER...JUSQU'A

### Module 5: Fonctions et procédures
- Leçon 1: Fonctions
- Leçon 2: Procédures

### Module 6: Tableaux et listes
- Leçon 1: Opérations de manipulation d'un tableau

## 🔧 Administration

### Interface d'Administration Django

Accédez à http://localhost:8000/admin avec vos identifiants superutilisateur pour:

- Gérer les utilisateurs
- Ajouter/modifier des modules et leçons
- Créer des quiz et exercices
- Voir les progressions des utilisateurs
- Consulter les tentatives et soumissions

## 🎨 Personnalisation

### Couleurs

Les couleurs principales (vert) peuvent être modifiées dans:
- `frontend/tailwind.config.js` - Configuration Tailwind
- `frontend/src/index.css` - Styles personnalisés

### Contenu des Cours

Pour modifier ou ajouter du contenu:

1. **Via l'interface Admin Django** (recommandé)
   - Facile et visuel
   - http://localhost:8000/admin

2. **Via le script populate_data.py**
   - Modifiez le fichier
   - Supprimez les anciennes données
   - Relancez le script

## 🐛 Dépannage

### Problème: "Module not found" lors du démarrage de React
**Solution**: Supprimez node_modules et réinstallez
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problème: Erreur CORS dans la console du navigateur
**Solution**: Vérifiez que dans `backend/learnalgorithmic/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Problème: "Access denied" sur les routes API
**Solution**: Vérifiez que le token est bien envoyé et valide
- Essayez de vous déconnecter et reconnecter
- Videz le localStorage du navigateur (F12 → Application → Storage)

### Problème: La base de données est vide
**Solution**: Relancez le script de population
```bash
cd backend
python manage.py shell < populate_data.py
```

## 📝 Notes Importantes

1. **Développement uniquement**: Cette configuration est pour le développement
2. **Production**: Pour déployer en production:
   - Changez SECRET_KEY
   - Mettez DEBUG = False
   - Configurez une vraie base de données
   - Utilisez un serveur de production (Gunicorn, nginx)
   - Servez les fichiers statiques via un CDN

3. **Données de test**: Le script populate_data.py contient des données d'exemple
4. **Validation de code**: Les exercices utilisent une validation basique
   - Pour une vraie validation, intégrez un sandbox sécurisé

## 📧 Support

Pour toute question ou problème:
- Consultez la documentation Django: https://docs.djangoproject.com
- Documentation React: https://react.dev
- Documentation Tailwind CSS: https://tailwindcss.com

## 🎓 Bonne Apprentissage!

Profitez de votre parcours d'apprentissage de l'algorithmique avec LearnAlgorithmic!
