#!/usr/bin/env bash
# Script de build pour Render.com
set -o errexit

# Installer les dependances Python
pip install -r requirements.txt

# Construire le frontend React
cd ../frontend
npm install
CI=false npm run build
cd ../backend

# Collecter les fichiers statiques Django
python manage.py collectstatic --noinput

# Appliquer les migrations
python manage.py migrate

# Importer les donnees initiales si la base est vide (premier deploiement)
set +e
python manage.py shell -c "from django.contrib.auth.models import User; exit(0 if User.objects.count() == 0 else 1)"
if [ $? -eq 0 ]; then
    echo "Base de donnees vide, importation des donnees..."
    python manage.py loaddata data_backup.json
    echo "Donnees importees avec succes!"
else
    echo "Base deja remplie, import ignore."
fi
set -e
