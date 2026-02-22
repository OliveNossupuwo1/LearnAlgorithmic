# 🚀 Guide de Déploiement - LearnAlgorithmic

## Vue d'ensemble des données à conserver

Votre application stocke les données dans **2 endroits principaux**:

### 1. Base de données SQLite (CRITIQUE ⚠️)
**Fichier**: `LearnAlgorithmic/backend/db.sqlite3` (324 KB)

**Contenu**:
- ✅ Tous les modules et leçons
- ✅ Tous les concepts, exemples et simulations
- ✅ Tous les quiz et exercices
- ✅ Tous les comptes utilisateurs (5 utilisateurs)
- ✅ Toute la progression des utilisateurs
- ✅ Toutes les tentatives de quiz et soumissions d'exercices

**⚠️ ATTENTION**: Ce fichier contient TOUTES vos données. Ne le perdez JAMAIS!

### 2. Fichiers de configuration
**Fichier**: `LearnAlgorithmic/backend/.env`

**Contient**:
- Email pour la réinitialisation de mot de passe
- Secrets et configurations

---

## 📦 Option 1: Déploiement Simple (avec SQLite)

### Étape 1: Préparer la sauvegarde

```bash
# Sur votre machine actuelle
cd C:\Users\Olive Nossupuwo\Downloads\LearnAlgorithmic

# Créer un dossier de backup
mkdir backup

# Copier la base de données
copy LearnAlgorithmic\backend\db.sqlite3 backup\db.sqlite3.backup

# Exporter TOUTES les données en JSON (sécurité supplémentaire)
cd LearnAlgorithmic\backend
python manage.py dumpdata > ..\..\backup\all_data.json

# Copier la configuration
copy .env ..\..\backup\.env.backup
```

### Étape 2: Sur le serveur de production

```bash
# 1. Cloner le dépôt
git clone https://github.com/OliveNossupuwo1/LearnAlgorithmic.git
cd LearnAlgorithmic/LearnAlgorithmic/backend

# 2. Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# OU
venv\Scripts\activate  # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Copier votre base de données
# Téléchargez db.sqlite3.backup depuis votre backup
# Puis:
cp /chemin/vers/db.sqlite3.backup db.sqlite3

# 5. Configurer .env
cp .env.example .env
nano .env  # Éditer avec vos vraies valeurs

# 6. Appliquer les migrations (au cas où)
python manage.py migrate

# 7. Collecter les fichiers statiques
python manage.py collectstatic --noinput

# 8. Créer un superuser si besoin
python manage.py createsuperuser
```

### Étape 3: Déployer le Frontend

```bash
cd LearnAlgorithmic/frontend
npm install
npm run build

# Le dossier 'build' contient votre application React
```

---

## 🐘 Option 2: Déploiement Production (avec PostgreSQL)

**Recommandé pour la production!** PostgreSQL est beaucoup plus robuste que SQLite.

### Étape 1: Installer PostgreSQL sur le serveur

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Créer une base de données
sudo -u postgres psql
CREATE DATABASE learnalgorithmic;
CREATE USER learnalgo_user WITH PASSWORD 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON DATABASE learnalgorithmic TO learnalgo_user;
\q
```

### Étape 2: Modifier settings.py

```python
# Dans backend/learnalgorithmic/settings.py

# Remplacer la configuration DATABASES par:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'learnalgorithmic'),
        'USER': os.environ.get('DB_USER', 'learnalgo_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

### Étape 3: Migrer les données de SQLite vers PostgreSQL

```bash
# 1. Installer psycopg2
pip install psycopg2-binary

# 2. Mettre à jour .env avec les infos PostgreSQL
echo "DB_NAME=learnalgorithmic" >> .env
echo "DB_USER=learnalgo_user" >> .env
echo "DB_PASSWORD=votre_mot_de_passe_fort" >> .env
echo "DB_HOST=localhost" >> .env
echo "DB_PORT=5432" >> .env

# 3. Créer la structure dans PostgreSQL
python manage.py migrate

# 4. Charger les données depuis le backup JSON
python manage.py loaddata /chemin/vers/backup/all_data.json

# 5. Vérifier que tout est là
python manage.py dbshell
SELECT COUNT(*) FROM courses_module;
SELECT COUNT(*) FROM auth_user;
\q
```

---

## 🌐 Hébergement Recommandé

### Option A: Heroku (Facile)

**Avantages**: Gratuit pour commencer, facile à déployer
**Base de données**: PostgreSQL gratuit (jusqu'à 10K lignes)

```bash
# 1. Installer Heroku CLI
# 2. Se connecter
heroku login

# 3. Créer l'application
heroku create learnalgorithmic-app

# 4. Ajouter PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Configurer les variables
heroku config:set SECRET_KEY="votre-secret-key"
heroku config:set DEBUG=False
heroku config:set EMAIL_HOST_USER="votre-email@gmail.com"
heroku config:set EMAIL_HOST_PASSWORD="votre-password"

# 6. Déployer
git push heroku main

# 7. Migrer la base de données
heroku run python manage.py migrate

# 8. Charger vos données
heroku run python manage.py loaddata backup/all_data.json
```

### Option B: Railway (Moderne)

**Avantages**: Interface moderne, PostgreSQL inclus
**Site**: https://railway.app

1. Connecter votre repo GitHub
2. Railway détecte automatiquement Django
3. Ajouter PostgreSQL depuis le dashboard
4. Configurer les variables d'environnement
5. Déployer automatiquement

### Option C: VPS (DigitalOcean, Linode, etc.)

**Avantages**: Contrôle total, pas de limites

**Configuration complète avec nginx + gunicorn**:

```bash
# 1. Sur le VPS, installer les dépendances
sudo apt update
sudo apt install python3-pip python3-venv nginx postgresql

# 2. Configurer PostgreSQL (voir Option 2 ci-dessus)

# 3. Installer l'application
git clone https://github.com/OliveNossupuwo1/LearnAlgorithmic.git
cd LearnAlgorithmic/LearnAlgorithmic/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# 4. Configurer .env
nano .env

# 5. Migrer et charger les données
python manage.py migrate
python manage.py loaddata /path/to/backup/all_data.json
python manage.py collectstatic

# 6. Configurer Gunicorn
sudo nano /etc/systemd/system/gunicorn.service
```

**Fichier gunicorn.service**:
```ini
[Unit]
Description=gunicorn daemon for LearnAlgorithmic
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/LearnAlgorithmic/backend
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind unix:/path/to/learnalgorithmic.sock learnalgorithmic.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# 7. Démarrer Gunicorn
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# 8. Configurer nginx
sudo nano /etc/nginx/sites-available/learnalgorithmic
```

**Fichier nginx**:
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        root /path/to/LearnAlgorithmic/backend;
    }

    location /media/ {
        root /path/to/LearnAlgorithmic/backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/path/to/learnalgorithmic.sock;
    }
}
```

```bash
# 9. Activer le site
sudo ln -s /etc/nginx/sites-available/learnalgorithmic /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Sécurité en Production

### À FAIRE ABSOLUMENT:

1. **Générer une nouvelle SECRET_KEY**:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

2. **Modifier settings.py pour la production**:
```python
DEBUG = False
ALLOWED_HOSTS = ['votre-domaine.com', 'www.votre-domaine.com']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

3. **Ne JAMAIS commiter .env dans Git** (déjà dans .gitignore ✅)

4. **Mettre en place HTTPS** (Let's Encrypt gratuit):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

---

## 📊 Vérification après déploiement

```bash
# Vérifier les utilisateurs
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.count()
5  # Devrait afficher 5

# Vérifier les modules
>>> from courses.models import Module
>>> Module.objects.count()
2  # Vos 2 modules

# Vérifier les leçons
>>> from courses.models import Lesson
>>> Lesson.objects.count()
# Devrait afficher le bon nombre
```

---

## 💾 Sauvegardes Automatiques

### Script de backup quotidien:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"

# Backup PostgreSQL
pg_dump -U learnalgo_user learnalgorithmic > $BACKUP_DIR/db_$DATE.sql

# Backup Django data (JSON)
cd /path/to/backend
python manage.py dumpdata > $BACKUP_DIR/data_$DATE.json

# Backup media files
tar -czf $BACKUP_DIR/media_$DATE.tar.gz media/

# Garder seulement les 30 derniers jours
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Configurer cron**:
```bash
crontab -e
# Ajouter:
0 2 * * * /path/to/backup.sh
```

---

## 🎯 Checklist Finale

- [ ] Base de données sauvegardée (`db.sqlite3` ou dump SQL)
- [ ] Fichier `.env` sauvegardé
- [ ] Code sur GitHub à jour
- [ ] PostgreSQL configuré (si production)
- [ ] Données migrées et vérifiées
- [ ] `DEBUG = False` en production
- [ ] `ALLOWED_HOSTS` configuré
- [ ] SECRET_KEY changé pour production
- [ ] HTTPS configuré (Let's Encrypt)
- [ ] Sauvegardes automatiques configurées
- [ ] Frontend build et déployé
- [ ] Tests de connexion et fonctionnalités

---

## 🆘 Restauration d'urgence

Si quelque chose se passe mal:

```bash
# Restaurer depuis le backup JSON
python manage.py flush  # Vider la base
python manage.py migrate  # Recréer la structure
python manage.py loaddata backup/all_data.json  # Restaurer les données

# OU restaurer le fichier SQLite directement
cp backup/db.sqlite3.backup db.sqlite3
```

---

## 📞 Support

Si vous avez des questions pendant le déploiement:
1. Vérifiez les logs: `python manage.py runserver` en mode DEBUG
2. Consultez les logs du serveur web (nginx, gunicorn)
3. Testez localement d'abord avant de déployer

**Bonne chance avec votre déploiement! 🚀**
