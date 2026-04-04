# Minsii Production Storage Configuration

Pour le lancement en production, les buckets suivants doivent être configurés dans le dashboard Supabase (Storage).

## 1. Buckets requis

| Nom du Bucket | Public | Taille Max | Types autorisés | Description |
| :--- | :--- | :--- | :--- | :--- |
| `avatars` | Oui | 2 Mo | jpg, png, webp | Photos de profil (Étudiants, Mentors) |
| `diplomas` | Non | 5 Mo | pdf, jpg, png | Diplômes et certifications (Vérification manuelle) |
| `institution_logos` | Oui | 2 Mo | jpg, png, svg | Logos des établissements scolaires / Universités |

## 2. Politiques de Sécurité (RLS Storage)

### Bucket: `avatars`
*   **SELECT**: `public` (Tout le monde peut voir les avatars sur le marketplace).
*   **INSERT / UPDATE**: `auth.uid() = id` (L'utilisateur ne peut modifier que sa propre photo).
*   **DELETE**: `auth.uid() = id`.

### Bucket: `diplomas` (Privé)
*   **SELECT**: `auth.uid() = id` OR `role = 'admin'` (L'utilisateur et les admins Minsii uniquement).
*   **INSERT / UPDATE**: `auth.uid() = id`.
*   **DELETE**: `auth.uid() = id`.

### Bucket: `institution_logos`
*   **SELECT**: `public`.
*   **INSERT / UPDATE**: `auth.uid() = id` (Réservé aux profils de type `director`).
*   **DELETE**: `auth.uid() = id`.

## 3. Optimisation des performances
Il est recommandé d'activer l'optimisation d'image (Image Transformation) de Supabase pour servir les avatars en format compressé via l'URL :
`https://[PROJECT_ID].supabase.co/storage/v1/render/image/public/avatars/[AVATAR_PATH]?width=200&height=200&resize=cover`
