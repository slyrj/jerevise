# 📚 Quiz Cours IA

> Transforme tes photos de cours en quiz interactif grâce à l'IA Mistral.

MVP minimal, mobile-first, hébergeable gratuitement sur Netlify.

---

## ✨ Fonctionnement

1. L'utilisateur prend une ou plusieurs photos de son cours
2. L'IA (Mistral) analyse les images et génère 10 questions (QCM / Vrai-Faux)
3. L'utilisateur répond dans l'appli
4. Score + correction détaillée affichés immédiatement

---

## 🛠️ Stack

| Couche | Techno |
|--------|--------|
| Frontend | Next.js 14 + TypeScript + TailwindCSS |
| IA | Mistral API (Pixtral-12b vision) |
| Déploiement | Netlify |

---

## 🚀 Lancement en local

### 1. Prérequis

- Node.js ≥ 18
- npm ≥ 9
- Une clé API Mistral ([console.mistral.ai](https://console.mistral.ai))

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Ouvre `.env.local` et renseigne ta clé Mistral :

```
MISTRAL_API_KEY=ta_vraie_cle_ici
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) 🎉

---

## ☁️ Déploiement sur Netlify

### Option A — Interface Netlify (recommandé)

1. Push le projet sur GitHub/GitLab
2. Va sur [netlify.com](https://netlify.com) → **New site from Git**
3. Connecte ton repo
4. Paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
5. Ajoute la variable d'environnement dans **Site settings > Environment variables** :
   - `MISTRAL_API_KEY` = ta clé Mistral
6. Clique **Deploy** ✅

### Option B — CLI Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set MISTRAL_API_KEY ta_cle_ici
netlify deploy --prod
```

---

## 📁 Structure du projet

```
quiz-cours/
├── components/
│   ├── UploadScreen.tsx    # Écran d'upload des images
│   ├── LoadingScreen.tsx   # Écran de chargement
│   ├── QuizScreen.tsx      # Affichage et interaction du quiz
│   └── ResultsScreen.tsx   # Score + correction
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx           # Orchestration des étapes
│   └── api/
│       └── generate-quiz.ts  # API route → Mistral
├── styles/
│   └── globals.css
├── types/
│   └── index.ts            # Types TypeScript partagés
├── .env.local.example
├── netlify.toml
└── README.md
```

---

## 🔒 Sécurité

- La clé Mistral est **uniquement côté serveur** (API route Next.js)
- Les images sont traitées en mémoire et **jamais sauvegardées**
- Aucune base de données, aucun stockage permanent

---

## 💡 Personnalisation rapide

| Ce que tu veux changer | Où |
|---|---|
| Nombre de questions | Prompt dans `pages/api/generate-quiz.ts` |
| Modèle Mistral | Variable `model` dans l'API route |
| Couleurs | `tailwind.config.ts` + `styles/globals.css` |
| Textes UI | Composants dans `components/` |

---

## 📝 Licence

MIT — fais-en ce que tu veux !
