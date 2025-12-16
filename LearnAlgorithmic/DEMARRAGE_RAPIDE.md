# 🎓 LearnAlgorithmic - GUIDE DE DÉMARRAGE RAPIDE

## 📦 Ce que vous avez

Une application web complète d'apprentissage de l'algorithmique avec :

✅ **Backend Django** (API + Base de données)
✅ **Frontend React** (Interface utilisateur moderne)  
✅ **6 modules** d'apprentissage (17 leçons au total)
✅ **Contenu riche** : vidéos, quiz, exercices, simulations
✅ **Système de progression** : déblocage progressif des modules
✅ **Authentification JWT** : inscription et connexion sécurisées

## 🚀 INSTALLATION EN 3 MINUTES

### 1️⃣ Prérequis (téléchargez si vous n'avez pas)

- **Python 3.8+** : https://www.python.org/downloads/
- **Node.js 16+** : https://nodejs.org/ (version LTS)

### 2️⃣ Installation Backend

```bash
cd LearnAlgorithmic/backend

# Créer environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Mac/Linux)
source venv/bin/activate

# Installer dépendances
pip install -r requirements.txt

# Créer base de données
python manage.py migrate

# Créer admin (user: admin, pass: admin123)
python manage.py createsuperuser

# Peupler avec le contenu des cours
python manage.py shell < populate_data.py
```

### 3️⃣ Installation Frontend

**NOUVEAU TERMINAL** (gardez le premier ouvert)

```bash
cd LearnAlgorithmic/frontend

# Installer dépendances
npm install
```

## ▶️ DÉMARRAGE

### Terminal 1 - Backend
```bash
cd backend
python manage.py runserver
```
→ Backend sur http://localhost:8000

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
→ Frontend sur http://localhost:3000 (s'ouvre automatiquement)

## 🎯 UTILISATION

1. **Inscription** : http://localhost:3000/register
2. **Connexion** : http://localhost:3000/login  
3. **Dashboard** : Voir vos statistiques
4. **Modules** : Commencer le Module 1 (seul débloqué au départ)
5. **Leçons** : Contenu complet (vidéo, quiz, exercices, simulations)
6. **Progression** : Score min 50/100 pour valider une leçon

## 📚 CONTENU DES MODULES

1. **Introduction à l'algorithmique** (1 leçon)
2. **Variables et constantes** (2 leçons)
3. **Structures conditionnelles** (3 leçons)
4. **Boucles et itérations** (3 leçons)
5. **Fonctions et procédures** (2 leçons)
6. **Tableaux et listes** (1 leçon)

## 🔑 ACCÈS ADMIN

Interface d'administration Django :
- URL : http://localhost:8000/admin
- User : admin
- Pass : admin123

## 📁 STRUCTURE DU PROJET

```
LearnAlgorithmic/
├── backend/                 # Django (API)
│   ├── courses/            # App principale
│   ├── learnalgorithmic/   # Configuration
│   ├── manage.py
│   └── populate_data.py    # Données des cours
│
├── frontend/               # React (UI)
│   ├── src/
│   │   ├── pages/         # Pages de l'app
│   │   ├── services/      # API calls
│   │   └── context/       # Auth
│   └── package.json
│
├── README.md              # Documentation complète
├── INSTALLATION.md        # Guide détaillé
└── STRUCTURE.md          # Architecture du projet
```

## ❓ PROBLÈMES COURANTS

### "python n'est pas reconnu"
→ Vérifiez l'installation de Python : `python --version`

### "npm n'est pas reconnu"
→ Installez Node.js depuis https://nodejs.org/

### La page ne charge pas
→ Vérifiez que les 2 serveurs sont démarrés (backend + frontend)

### Base de données vide
```bash
cd backend
python manage.py shell < populate_data.py
```

### Erreurs npm
```bash
cd frontend
rm -rf node_modules
npm install --legacy-peer-deps
```

## 📖 DOCUMENTATION

- **README.md** : Documentation technique complète
- **INSTALLATION.md** : Guide d'installation détaillé étape par étape
- **STRUCTURE.md** : Architecture et organisation des fichiers

## 🎨 PERSONNALISATION

### Changer les couleurs
→ `frontend/tailwind.config.js` et `frontend/src/index.css`

### Ajouter du contenu
→ Interface admin Django ou modifiez `populate_data.py`

### Modifier l'API
→ `backend/courses/views.py` et `serializers.py`

## 🔒 SÉCURITÉ

⚠️ **IMPORTANT pour la production** :
- Changez `SECRET_KEY` dans `settings.py`
- Mettez `DEBUG = False`
- Utilisez PostgreSQL au lieu de SQLite
- Configurez HTTPS
- Activez la protection CSRF

## 🆘 BESOIN D'AIDE ?

1. Lisez `INSTALLATION.md` pour un guide détaillé
2. Consultez `STRUCTURE.md` pour comprendre l'architecture
3. Vérifiez `README.md` pour la documentation technique
4. Testez avec l'interface admin pour voir si le backend fonctionne

## ✅ CHECKLIST DE VÉRIFICATION

Avant de dire que ça ne marche pas :

- [ ] Python 3.8+ installé
- [ ] Node.js 16+ installé
- [ ] Environnement virtuel Python activé
- [ ] `pip install -r requirements.txt` exécuté
- [ ] `python manage.py migrate` exécuté
- [ ] `npm install` exécuté
- [ ] Les 2 serveurs sont démarrés
- [ ] Vous allez sur http://localhost:3000

## 🎓 BON APPRENTISSAGE !

Profitez de votre plateforme d'apprentissage de l'algorithmique !

---

**Technologies** : Django 4.2 • React 18 • Tailwind CSS • SQLite/PostgreSQL • JWT

**Licence** : Projet éducatif • Modifiez et utilisez librement
