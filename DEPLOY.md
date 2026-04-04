// Follow these steps to deploy Minsii completely (Frontend + Backend)

## 1. Backend: Configuration de Supabase (Production)

Pour que l'application fonctionne avec de vraies données et l'authentification :

### A. Base de Données (SQL)
1.  Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard).
2.  Allez dans le **SQL Editor**.
3.  Copiez le contenu du fichier [production_schema.sql](file:///c:/Users/erica/Downloads/minsii---marketplace-%C3%A9ducative-b%C3%A9ninoise/specs/production_schema.sql) et exécutez-le.
    *   *Cela créera toutes les tables nécessaires (`profiles`, `teacher_profiles`, etc.) avec leurs politiques de sécurité (RLS).*

### B. Stockage (Storage)
1.  Allez dans l'onglet **Storage** de Supabase.
2.  Créez les 3 buckets suivants en suivant les instructions du fichier [storage_setup.md](file:///c:/Users/erica/Downloads/minsii---marketplace-%C3%A9ducative-b%C3%A9ninoise/specs/storage_setup.md) :
    *   `avatars` (Public)
    *   `diplomas` (Privé)
    *   `institution_logos` (Public)

### C. Variables d'Environnement
Récupérez vos clés API (Project URL et Anon Key) dans `Settings > API` et mettez-les dans vos paramètres de déploiement (Netlify/Vercel) :
*   `VITE_SUPABASE_URL`
*   `VITE_SUPABASE_ANON_KEY`

---

## 2. Frontend: Déploiement Statique

### Option 1 : Netlify (Recommandé)
1.  Lancer `npm run build` pour générer le dossier `dist/`.
2.  Glisser le dossier `dist/` sur [Netlify Drop](https://app.netlify.com/drop).

### Option 2 : Vercel
1.  Installer la CLI : `npm i -g vercel`.
2.  Lancer `vercel --prod`.

---

## 3. Intelligence Artificielle (Optionnel - P1)
Si vous souhaitez activer le **Smart Match** (recherche par IA) :
1.  Déployez l'Edge Function située dans `supabase/functions/gemini-match`.
2.  Ajoutez votre `GEMINI_API_KEY` dans les secrets Supabase :
    ```bash
    supabase secrets set GEMINI_API_KEY=votre_cle_ici
    ```

---
*Minsii Team - Guide de production v1.0*
