# 📧 Guide Rapide - Configuration Email

## Pour recevoir de VRAIS emails

### 1️⃣ Générer un mot de passe d'application Gmail

1. Allez sur: https://myaccount.google.com/apppasswords
2. Connectez-vous avec votre compte Gmail
3. Si on vous demande d'activer la validation en 2 étapes, faites-le d'abord
4. Sélectionnez "Autre (nom personnalisé)" et entrez "LearnAlgorithmic"
5. Cliquez sur "Générer"
6. **COPIEZ le mot de passe** (exemple: `abcd efgh ijkl mnop`)

### 2️⃣ Configurer le fichier .env

1. Ouvrez le fichier: `backend/.env`
2. Remplissez vos informations:

```env
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
```

### 3️⃣ Redémarrer le serveur

```bash
# Arrêtez le serveur avec Ctrl+C, puis relancez:
cd backend
python manage.py runserver
```

### 4️⃣ Tester

1. Allez sur http://localhost:3000/login
2. Cliquez sur "Mot de passe oublié ?"
3. Entrez votre email
4. Vérifiez votre boîte de réception! 📬

---

## Pour voir les emails en CONSOLE (développement)

Si vous ne voulez pas configurer Gmail:

1. Ouvrez `backend/LearnAlgorithmic/settings.py`
2. Ligne 143, changez:
   ```python
   EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
   ```
   en:
   ```python
   EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
   ```

3. Les emails s'afficheront dans le terminal du serveur Django
