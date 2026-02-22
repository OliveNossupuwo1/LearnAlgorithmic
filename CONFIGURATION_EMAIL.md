# Configuration de l'envoi d'emails

Pour que l'application puisse envoyer de vrais emails (pour la réinitialisation de mot de passe), vous devez configurer un serveur SMTP.

## Option 1: Mode Développement (Console)

Pour afficher les emails dans la console (pas de vrais emails):

1. Ouvrez `backend/LearnAlgorithmic/settings.py`
2. Remplacez:
   ```python
   EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
   ```
   par:
   ```python
   EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
   ```

3. Les emails s'afficheront dans le terminal où vous exécutez `python manage.py runserver`

## Option 2: Utiliser Gmail pour envoyer de vrais emails

### Étape 1: Activer la validation en 2 étapes sur Gmail

1. Allez sur [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Sous "Connexion à Google", cliquez sur "Validation en deux étapes"
3. Suivez les instructions pour l'activer

### Étape 2: Générer un mot de passe d'application

1. Une fois la validation en 2 étapes activée, allez sur [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Connectez-vous si nécessaire
3. Dans "Sélectionner l'application", choisissez "Autre (nom personnalisé)"
4. Entrez "LearnAlgorithmic" comme nom
5. Cliquez sur "Générer"
6. **Copiez le mot de passe généré** (format: xxxx-xxxx-xxxx-xxxx)
7. Vous ne pourrez plus le voir après avoir fermé cette fenêtre!

### Étape 3: Configurer l'application

1. Dans le dossier `backend`, créez un fichier `.env` (copiez `.env.example`):
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Éditez le fichier `.env` et remplissez vos informations:
   ```env
   EMAIL_HOST_USER=votre-email@gmail.com
   EMAIL_HOST_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

   **Important**: Utilisez le mot de passe d'application généré à l'étape 2, PAS votre mot de passe Gmail normal!

3. Le fichier `.env` est déjà dans `.gitignore`, donc vos identifiants ne seront pas commités

### Étape 4: Redémarrer le serveur

```bash
cd backend
python manage.py runserver
```

### Étape 5: Tester

1. Allez sur la page de connexion
2. Cliquez sur "Mot de passe oublié ?"
3. Entrez votre email
4. Vous devriez recevoir un email dans votre boîte de réception!

## Option 3: Utiliser un autre service SMTP

Si vous n'utilisez pas Gmail, modifiez ces paramètres dans `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.votre-service.com'  # Ex: smtp.outlook.com, smtp.mailgun.org
EMAIL_PORT = 587  # ou 465 pour SSL
EMAIL_USE_TLS = True  # ou EMAIL_USE_SSL = True pour le port 465
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
```

## Dépannage

### "SMTPAuthenticationError: Username and Password not accepted"
- Vérifiez que la validation en 2 étapes est activée
- Assurez-vous d'utiliser le mot de passe d'application, pas votre mot de passe Gmail
- Vérifiez que le fichier `.env` est dans le bon dossier (`backend/`)

### "SMTPConnectError: [Errno 11001] getaddrinfo failed"
- Vérifiez votre connexion Internet
- Vérifiez que `EMAIL_HOST` est correct

### L'email n'arrive pas
- Vérifiez vos spams
- Vérifiez que `EMAIL_HOST_USER` contient votre vraie adresse email
- Regardez les logs du serveur Django pour voir les erreurs

### Le serveur ne redémarre pas
- Arrêtez le serveur (Ctrl+C)
- Relancez: `python manage.py runserver`
- Le fichier `.env` est chargé au démarrage de Django
