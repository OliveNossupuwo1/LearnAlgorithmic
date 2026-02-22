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
