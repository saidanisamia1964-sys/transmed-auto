# TransMed Auto — Site Export Véhicules

Site vitrine pour l'export de véhicules France → Algérie, avec BackOffice admin complet.

## Stack technique

- **React 18** + Vite (bundler ultra-rapide)
- **Tailwind CSS** (styling)
- **Lucide React** (icônes)
- 100% frontend, déployable en statique

---

## ⚡ DÉMARRAGE LOCAL (sur ton ordinateur)

### Pré-requis : installer Node.js
1. Télécharger Node.js LTS : https://nodejs.org/
2. Installer (suivre les étapes)
3. Vérifier dans le terminal : `node --version` (doit afficher v20 ou v22)

### Lancer le site en local
```bash
# Dans le dossier du projet
npm install        # télécharge les dépendances (1ère fois seulement, ~2 min)
npm run dev        # lance le site sur http://localhost:5173
```

Ouvre ton navigateur : **http://localhost:5173**

### Construire la version production
```bash
npm run build      # génère le dossier dist/ optimisé
npm run preview    # teste la version production en local
```

---

## 🚀 DÉPLOIEMENT EN LIGNE (GitHub + Vercel)

### Étape 1 — Créer un compte GitHub
1. Va sur **https://github.com**
2. Clique "Sign up" → crée ton compte (gratuit)
3. Vérifie ton e-mail

### Étape 2 — Créer un nouveau repository
1. Clique sur le **"+"** en haut à droite → "New repository"
2. Nom : `transmed-auto` (ou ce que tu veux)
3. Coche **"Public"** (Vercel gratuit demande le public)
4. **NE COCHE PAS** "Add a README file"
5. Clique "Create repository"

### Étape 3 — Pousser le code sur GitHub
Ouvre un terminal dans le dossier du projet :

```bash
# Initialiser Git
git init
git add .
git commit -m "Premier commit - TransMed Auto"
git branch -M main

# Lier au repository GitHub (REMPLACE ton-username)
git remote add origin https://github.com/ton-username/transmed-auto.git
git push -u origin main
```

GitHub te demandera tes identifiants. **Important** : depuis 2021, GitHub n'accepte plus le mot de passe — il faut un **Personal Access Token** :
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Coche `repo` (toutes les cases)
4. Génère et copie le token
5. Utilise CE TOKEN comme mot de passe lors du push

### Étape 4 — Déployer sur Vercel
1. Va sur **https://vercel.com**
2. Clique "Sign Up" → choisis **"Continue with GitHub"** (autorise Vercel)
3. Une fois connecté, clique **"Add New..." → "Project"**
4. Tu verras la liste de tes repos GitHub → clique **"Import"** sur `transmed-auto`
5. Vercel détecte automatiquement Vite — laisse les paramètres par défaut
6. Clique **"Deploy"**
7. Attends ~1 minute → ton site est en ligne ! 🎉

URL fournie : `https://transmed-auto.vercel.app` (ou similaire)

### Étape 5 — Mettre à jour le site
À chaque modification :
```bash
git add .
git commit -m "Mise à jour"
git push
```
Vercel redéploie automatiquement en 30 secondes.

---

## 🌐 DOMAINE PERSONNALISÉ (optionnel)

### Acheter un domaine
- **`.com` / `.fr`** : OVH, Gandi, Namecheap (~10-15 €/an)
- **`.dz`** : NIC.dz (registrar officiel algérien, justificatif requis)

### Connecter à Vercel
1. Vercel → ton projet → "Settings" → "Domains"
2. "Add" → entre ton domaine (ex: `transmed-auto.fr`)
3. Vercel te donne 2 enregistrements DNS à configurer chez ton registrar
4. Va sur ton registrar → zone DNS → ajoute les enregistrements
5. Attends 5 min à 24h → ton domaine est lié + SSL automatique

---

## 🔐 ACCÈS BACKOFFICE

URL : Cliquer sur "Admin" dans le top bar du site
- **Identifiant** : `admin`
- **Mot de passe** : `admin123`

⚠️ **À CHANGER avant la mise en production réelle** dans `src/App.jsx` (chercher `admin123`).

---

## ⚠️ LIMITES ACTUELLES À CONNAÎTRE

Ce site est **100% frontend statique**. Cela veut dire :
- ✅ Affichage parfait, navigation rapide, SEO OK
- ❌ Les modifications faites dans l'admin **ne sont pas sauvegardées** (perdues au refresh)
- ❌ Le formulaire de contact **n'envoie pas réellement** d'e-mail
- ❌ Le compteur visiteurs est **simulé**

### Pour passer en vraie production, il faut :
1. **Backend + base de données** pour persister les données admin
   - Option simple : Supabase (gratuit) ou Firebase
   - Option complète : Node.js + PostgreSQL sur Vercel ou Railway
2. **Service d'envoi d'e-mails** pour le formulaire
   - EmailJS (gratuit, simple)
   - Resend / SendGrid (plus pro)
3. **Vrai système d'auth admin** avec mot de passe hashé

Si tu veux passer à cette étape, demande à ton dev (ou à Claude) la version backend.

---

## 💰 COÛTS RÉELS

| Élément | Prix |
|---|---|
| Hébergement Vercel Hobby | **Gratuit** |
| GitHub | **Gratuit** |
| HTTPS / SSL | **Gratuit** (auto via Vercel) |
| Domaine `.com` ou `.fr` | ~12 €/an |
| Domaine `.dz` | ~30-50 €/an (via NIC.dz) |
| **Total annuel** | **~12 à 50 €** |

Comparaison devis Edisoft : 190 000 DA (~1 280 €) → **économie d'environ 95%** sur l'hébergement et le domaine.

---

## 📚 RESSOURCES UTILES

- Documentation Vercel : https://vercel.com/docs
- Tutoriel Git pour débutants : https://learngitbranching.js.org/
- Documentation Vite : https://vitejs.dev/
- Tailwind CSS docs : https://tailwindcss.com/docs

## ❓ Problèmes fréquents

**"npm: command not found"** → Node.js pas installé. Va sur nodejs.org

**"Permission denied" lors du push GitHub** → Utilise un Personal Access Token (cf. Étape 3)

**Le site ne se construit pas sur Vercel** → Vérifie que `package.json` est bien à la racine du repo

**Les images Unsplash ne chargent pas** → Vérifier la connexion. Pour la production, héberger les vraies images dans `public/` ou sur un CDN.
