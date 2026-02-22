# 📊 Résumé des Données - LearnAlgorithmic

## 🎯 L'essentiel à retenir

### TOUS vos données sont dans 1 fichier principal:

```
LearnAlgorithmic/backend/db.sqlite3
```

**Taille**: 324 KB
**Contenu**: TOUT (utilisateurs, modules, leçons, quiz, progression, etc.)

### Comment sauvegarder vos données:

**Option 1 - Simple (double-clic)**:
```
backup_data.bat (Windows)
```

**Option 2 - Python**:
```bash
python backup_data.py
```

**Option 3 - Manuel**:
```bash
# Juste copier ces 2 fichiers:
LearnAlgorithmic/backend/db.sqlite3  → backup/
LearnAlgorithmic/backend/.env         → backup/
```

---

## 📦 Ce qui est stocké

### Base de données (db.sqlite3)

| Type de données | Quantité |
|----------------|----------|
| 👥 Utilisateurs | 5 comptes |
| 📚 Modules | 2 modules |
| 📖 Leçons | ~10+ leçons |
| 🧩 Concepts | ~20+ concepts |
| 💡 Exemples | ~30+ exemples |
| 🎬 Simulations | ~5+ simulations |
| 📝 Quiz | ~5+ quiz |
| ✍️ Exercices | ~10+ exercices |
| 📊 Progression utilisateur | Toutes les tentatives |

### Configuration (.env)

```env
EMAIL_HOST_USER=olivenossupuwo@gmail.com
EMAIL_HOST_PASSWORD=tcjg laly pmcu ckhl
```

---

## 🚀 Pour déployer

### Étape 1: Sauvegarder
```bash
python backup_data.py
```

### Étape 2: Sur le nouveau serveur
```bash
# Copier le fichier db.sqlite3
cp backup/db.sqlite3.backup LearnAlgorithmic/backend/db.sqlite3

# Copier la config
cp backup/.env.backup LearnAlgorithmic/backend/.env

# C'est tout! Toutes vos données sont là.
```

---

## ✅ Checklist avant déploiement

- [ ] `db.sqlite3` sauvegardé
- [ ] `.env` sauvegardé
- [ ] Code sur GitHub
- [ ] Backup copié sur disque externe ou cloud
- [ ] Guide de déploiement lu (`GUIDE_DEPLOIEMENT.md`)

---

## 🆘 Restauration rapide

Si vous perdez vos données:

```bash
# Restaurer depuis le backup
cp backup_YYYYMMDD_HHMMSS/db.sqlite3.backup LearnAlgorithmic/backend/db.sqlite3
cp backup_YYYYMMDD_HHMMSS/.env.backup LearnAlgorithmic/backend/.env

# Relancer l'application
cd LearnAlgorithmic/backend
python manage.py runserver
```

**TOUTES vos données seront restaurées!** ✨

---

## 📌 Important

1. **SQLite = 1 fichier = Toutes vos données**
2. Faites des sauvegardes régulières (hebdomadaires minimum)
3. Gardez au moins 3 copies:
   - Sur votre PC
   - Sur un disque externe
   - Dans le cloud (Google Drive, Dropbox, etc.)
4. Pour la production, envisagez PostgreSQL (voir `GUIDE_DEPLOIEMENT.md`)

---

## 💡 Conseil Pro

Avant chaque modification importante:
```bash
python backup_data.py
```

Comme ça, vous pouvez toujours revenir en arrière! 🔄
