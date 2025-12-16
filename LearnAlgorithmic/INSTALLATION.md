# 🚀 GUIDE D'INSTALLATION RAPIDE - LearnAlgorithmic

## 📦 Ce que vous avez téléchargé

Vous disposez d'une application complète avec :
- **Backend Django** : API et gestion des données
- **Frontend React** : Interface utilisateur
- **Base de données complète** : 6 modules, 17 leçons, quiz, exercices, simulations

## ⚡ Installation en 5 Étapes

### ÉTAPE 1 : Prérequis à Installer

Téléchargez et installez (si ce n'est pas déjà fait) :

1. **Python 3.8 ou supérieur**
   - Windows : https://www.python.org/downloads/
   - Mac : `brew install python3`
   - Linux : `sudo apt install python3 python3-pip`

2. **Node.js 16 ou supérieur** (inclut npm)
   - https://nodejs.org/ (téléchargez la version LTS)

3. **Un éditeur de code** (optionnel mais recommandé)
   - VS Code : https://code.visualstudio.com/

### ÉTAPE 2 : Préparer le Backend Django

Ouvrez un terminal (ou invite de commande) et naviguez vers le dossier du projet :

```bash
# Aller dans le dossier backend
cd chemin/vers/LearnAlgorithmic/backend

# Créer un environnement virtuel Python
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate

# Sur Mac/Linux :
source venv/bin/activate

# Vous devriez voir (venv) au début de votre ligne de commande
```

Installer les dépendances Django :

```bash
pip install -r requirements.txt
```

⏳ Cela prend 2-3 minutes. Attendez que l'installation se termine.

### ÉTAPE 3 : Créer la Base de Données

Toujours dans le même terminal (backend) :

```bash
# Créer les tables de la base de données
python manage.py makemigrations
python manage.py migrate

# Créer un compte administrateur
python manage.py createsuperuser
```

Quand il vous demande :
- **Username** : tapez `admin` et appuyez sur Entrée
- **Email** : tapez `admin@exemple.com` et appuyez sur Entrée  
- **Password** : tapez `admin123` et appuyez sur Entrée (le texte ne s'affiche pas, c'est normal)
- **Password (again)** : retapez `admin123` et appuyez sur Entrée

Maintenant, peuplez la base avec le contenu des cours :

```bash
python manage.py shell < populate_data.py
```

⏳ Attendez que le message "TOUS LES MODULES ONT ÉTÉ CRÉÉS AVEC SUCCÈS!" s'affiche.

Si cette commande ne fonctionne pas, essayez plutôt :

```bash
python manage.py shell
```

Puis copiez-collez tout le contenu du fichier `populate_data.py` et appuyez sur Entrée. Tapez `exit()` pour quitter le shell.

### ÉTAPE 4 : Préparer le Frontend React

Ouvrez un NOUVEAU terminal (gardez l'ancien ouvert) et naviguez vers le dossier frontend :

```bash
# Aller dans le dossier frontend
cd chemin/vers/LearnAlgorithmic/frontend

# Installer les dépendances npm
npm install
```

⏳ Cela prend 3-5 minutes. Soyez patient.

Si vous avez des erreurs, essayez :

```bash
npm install --legacy-peer-deps
```

### ÉTAPE 5 : Démarrer l'Application

#### Terminal 1 - Backend Django :

```bash
# Assurez-vous d'être dans le dossier backend avec (venv) activé
cd backend
python manage.py runserver
```

✅ Vous devriez voir : `Starting development server at http://127.0.0.1:8000/`

**NE FERMEZ PAS CE TERMINAL !**

#### Terminal 2 - Frontend React :

```bash
# Dans le second terminal, dans le dossier frontend
cd frontend
npm start
```

✅ Un navigateur s'ouvre automatiquement sur http://localhost:3000

**NE FERMEZ PAS CE TERMINAL !**

## 🎉 C'est Prêt !

L'application LearnAlgorithmic est maintenant lancée !

### Accès :

1. **Application utilisateur** : http://localhost:3000
   - Créez un compte ou connectez-vous

2. **Interface Admin Django** : http://localhost:8000/admin
   - Username : `admin`
   - Password : `admin123`

## 📱 Première Utilisation

1. Allez sur http://localhost:3000
2. Cliquez sur "Créer un nouveau compte"
3. Remplissez le formulaire d'inscription
4. Vous serez automatiquement connecté
5. Explorez le Dashboard et commencez le Module 1 !

## 🛑 Arrêter l'Application

Pour arrêter l'application :

1. Dans chaque terminal, appuyez sur `Ctrl + C`
2. Sur Mac : `Cmd + C`

## 🔄 Redémarrer l'Application (les jours suivants)

### Terminal 1 - Backend :
```bash
cd backend
# Activer l'environnement virtuel
# Windows : venv\Scripts\activate
# Mac/Linux : source venv/bin/activate
python manage.py runserver
```

### Terminal 2 - Frontend :
```bash
cd frontend
npm start
```

## ❓ Problèmes Courants

### "python n'est pas reconnu..."
- Vérifiez que Python est bien installé : `python --version`
- Sur certains systèmes, utilisez `python3` au lieu de `python`

### "npm n'est pas reconnu..."
- Vérifiez que Node.js est installé : `node --version`
- Relancez le terminal après l'installation de Node.js

### La page ne charge pas
- Vérifiez que les deux serveurs sont bien démarrés
- Backend : http://localhost:8000
- Frontend : http://localhost:3000

### Erreurs au démarrage de npm
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### La base de données est vide
```bash
cd backend
python manage.py shell < populate_data.py
```

## 📂 Structure des Dossiers

```
LearnAlgorithmic/
├── backend/          ← Dossier Django (API)
│   ├── manage.py
│   ├── venv/        ← Environnement virtuel Python
│   └── ...
│
└── frontend/        ← Dossier React (Interface)
    ├── src/
    ├── public/
    └── ...
```

## 🎓 Utilisation de l'Application

### Système de Progression

1. **Module 1 débloqué** par défaut
2. **Complétez toutes les leçons** d'un module (score min : 50/100)
3. **Module suivant débloqué** automatiquement
4. **Revoyez les modules** terminés quand vous voulez

### Contenu de Chaque Leçon

- 🎥 Vidéo explicative
- 📖 Définitions et syntaxes
- 💡 Exemples de code
- 🎬 Simulations animées
- 📝 Quiz interactif
- 💻 Exercices pratiques

## 💾 Fichiers Importants

| Fichier | Fonction |
|---------|----------|
| `backend/manage.py` | Gestion Django |
| `backend/populate_data.py` | Contenu des cours |
| `backend/db.sqlite3` | Base de données |
| `frontend/package.json` | Dépendances React |
| `README.md` | Documentation complète |

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que vous avez suivi toutes les étapes
2. Assurez-vous que Python et Node.js sont installés
3. Relisez la section "Problèmes Courants"
4. Consultez le README.md pour plus de détails

## ✅ Checklist de Vérification

Avant de dire que ça ne fonctionne pas, vérifiez :

- [ ] Python 3.8+ est installé : `python --version`
- [ ] Node.js 16+ est installé : `node --version`
- [ ] L'environnement virtuel est activé (vous voyez `(venv)`)
- [ ] Les dépendances backend sont installées
- [ ] Les dépendances frontend sont installées
- [ ] La base de données est créée et peuplée
- [ ] Les deux serveurs (backend + frontend) sont démarrés
- [ ] Vous accédez à http://localhost:3000 dans le navigateur

## 🎯 Bon Apprentissage !

Votre plateforme LearnAlgorithmic est prête. Profitez de votre voyage dans le monde de l'algorithmique !

---

**Support** : Pour toute question, consultez le README.md ou la documentation des frameworks utilisés.
