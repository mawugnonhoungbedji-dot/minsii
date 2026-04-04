# Cahier des Charges — MVP Plateforme EduConnect

**Version** : 1.0  
**Date** : Février 2026  
**Statut** : En cours de développement  

---

## 1. Présentation du projet

### 1.1 Vision

Créer une plateforme web qui connecte les enseignants qualifiés aux parents cherchant des cours à domicile et aux directeurs d'établissements privés, tout en valorisant le métier d'enseignant et en développant un écosystème professionnel durable.

### 1.2 Objectifs

- Rendre le métier d'enseignant plus noble et plus satisfaisant
- Développer un écosystème où les enseignants peuvent facilement entreprendre
- Permettre aux parents d'accéder à des enseignants qualifiés et vérifiés pour leurs enfants
- Offrir aux directeurs d'établissements un accès simplifié à des profils enseignants fiables

### 1.3 Périmètre du MVP

Le MVP cible 3 types d'utilisateurs : **enseignants**, **parents** et **directeurs d'établissements**, avec un espace **administrateur** pour la modération et la gestion de la plateforme.

---

## 2. Utilisateurs & rôles

| Rôle | Description | Objectif principal |
| --- | --- | --- |
| Enseignant | Professeur cherchant des élèves ou des postes | Trouver des opportunités, gérer son activité |
| Parent | Parent cherchant un enseignant pour son enfant | Trouver un enseignant qualifié et de confiance |
| Directeur | Responsable d'un établissement privé | Recruter des enseignants fiables |
| Administrateur | Gestionnaire de la plateforme (fondateur) | Vérifier, modérer, piloter la plateforme |

---

## 3. Fonctionnalités MVP

### 3.1 Authentification & Onboarding

#### Applicable à tous les rôles

- Inscription avec choix du rôle (enseignant / parent / directeur)
- Formulaire d'onboarding guidé et adapté à chaque rôle
- Connexion par email + mot de passe
- Récupération de mot de passe par email
- Vérification de l'adresse email à l'inscription

**Règle importante** : le profil d'un enseignant n'est pas visible publiquement tant qu'il n'a pas été validé par l'administrateur.

---

### 3.2 Profil Enseignant

Le profil enseignant est le cœur du produit. Il doit être riche, clair et inspirer confiance.

#### Informations obligatoires

- Photo de profil
- Nom complet
- Matières enseignées (sélection multiple)
- Niveaux scolaires couverts (maternelle, primaire, collège, lycée, supérieur)
- Localisation (ville / quartier)
- Tarif horaire
- Disponibilités (jours et créneaux horaires)

#### Informations optionnelles (mais encouragées)

- Courte biographie / présentation
- Expérience professionnelle (années, établissements)
- Diplômes et certifications (avec upload de documents)
- Vidéo de présentation courte
- Langues d'enseignement

#### Indicateur de complétude du profil

#### Statuts possibles d'un profil enseignant

```text
Soumis → En attente de vérification
              ↓
  [Admin examine le profil]
              ↓
Approuvé ✓  |  Correction demandée ↺  |  Rejeté ✗
```

L'enseignant reçoit une notification email à chaque changement de statut.

---

### 3.3 Recherche & Filtres

#### Accessible aux parents et directeurs

- Barre de recherche par mot-clé (matière, nom)
- Filtres disponibles :
  - Matière enseignée
  - Niveau scolaire
  - Localisation (ville / quartier)
  - Disponibilité (jour de la semaine)
  - Fourchette de tarif horaire
  - Profil vérifié uniquement
- Affichage des résultats en liste ou grille
- Tri par : pertinence, note moyenne, tarif croissant/décroissant
- Pagination des résultats

---

### 3.4 Système de Mise en Relation & Offres

#### Flux 1 : Mise en relation directe (Parent/Directeur -> Enseignant)

1. Le parent ou directeur consulte un profil enseignant
2. Il envoie une **demande de mise en relation**.
3. L'enseignant accepte ou décline.

#### Flux 2 : Offre d'emploi (Directeur -> Enseignants)

1. Le directeur publie une **offre d'emploi** sur la plateforme.
2. Les enseignants consultent le catalogue des offres en temps réel.
3. L'enseignant peut **souscrire** (candidater) à une offre.
4. Le directeur examine les candidatures et peut **valider** ou rejeter les souscriptions.
5. Une conversation est ouverte en cas de validation mutuelle.

#### Statuts d'une demande

---

### 3.5 Messagerie Interne

- Fil de conversation par mise en relation
- Envoi de messages texte
- Notifications en temps réel (ou par email si hors connexion)
- Historique des conversations accessible depuis le tableau de bord
- Indication de lecture (lu / non lu)

> **Hors MVP** : appels vidéo, partage de fichiers, messagerie de groupe

---

### 3.6 Tableaux de Bord Utilisateurs

#### Tableau de bord — Enseignant

- Vue d'ensemble : demandes reçues, conversations actives, statistiques du profil
- Statistiques : nombre de vues du profil, nombre de demandes reçues
- Gestion du profil (modification, mise à jour des disponibilités)
- Historique des mises en relation
- Avis reçus

#### Tableau de bord — Parent

- Demandes envoyées et leur statut
- Conversations actives
- Liste des enseignants mis en favoris
- Historique des mises en relation

#### Tableau de bord — Directeur

- Offres publiées et candidatures reçues
- Conversations actives
- Historique des recrutements

---

### 3.7 Avis & Évaluations

- Après une mise en relation confirmée, le parent peut laisser un avis sur l'enseignant
- L'avis comprend : une note (1 à 5 étoiles) + un commentaire écrit
- Les avis sont visibles sur le profil public de l'enseignant
- Un enseignant ne peut pas supprimer un avis
- L'administrateur peut modérer les avis signalés
- Tout utilisateur peut **signaler** un avis inapproprié

---

## 4. Dashboard Administrateur

### 4.1 Vue d'ensemble & métriques

- Nombre total d'enseignants (inscrits / vérifiés / rejetés / en attente)
- Nombre total de parents inscrits
- Nombre total de directeurs inscrits
- Nombre de mises en relation effectuées
- Nouveaux inscrits (aujourd'hui / cette semaine / ce mois)
- Avis en attente de modération

### 4.2 Gestion des candidatures enseignants

#### Note critique administrateur

- File de candidatures classée par date (les plus récentes en premier)
- Filtres : En attente / Approuvés / Corrections demandées / Rejetés
- Vue détaillée d'une candidature :
  - Toutes les informations du profil
  - Documents uploadés (diplômes, pièce d'identité)
  - Date d'inscription
  - Historique des actions admin sur ce profil
- Actions disponibles :
  - **Approuver** → le profil devient visible publiquement
  - **Demander une correction** → message personnalisé envoyé à l'enseignant
  - **Rejeter** → motif obligatoire, notification envoyée à l'enseignant
- Badge **"Profil vérifié ✓"** attribué manuellement après validation

### 4.3 Gestion des utilisateurs

- Recherche d'un utilisateur par nom, email ou rôle
- Vue du profil complet et de l'activité d'un utilisateur
- Actions disponibles :
  - Suspendre un compte (temporaire)
  - Supprimer un compte (définitif, avec confirmation)
  - Envoyer un message à l'utilisateur

### 4.4 Modération des avis

- Vue centralisée de tous les avis publiés
- Filtres : tous / signalés / récents / par note
- Actions disponibles :
  - Masquer un avis
  - Supprimer un avis
  - Ignorer un signalement

### 4.5 Gestion du contenu signalé

- File des signalements (avis, messages, profils)
- Type de signalement + auteur + contenu signalé
- Actions : traiter / ignorer

### 4.6 Accès & sécurité

- Accès réservé au compte administrateur (rôle distinct en base de données)
- Route protégée `/admin` avec authentification renforcée
- Historique des actions admin (logs)

---

## 5. Architecture des pages

```text
/                          → Landing page (présentation + CTA inscription)
/inscription               → Choix du rôle + formulaire
/connexion                 → Connexion
/mot-de-passe-oublie       → Récupération de mot de passe

/enseignants               → Liste / résultats de recherche
/enseignants/[slug]        → Profil public d'un enseignant

/recherche                 → Recherche avec filtres

/messages                  → Liste des conversations
/messages/[id]             → Conversation individuelle

/tableau-de-bord           → Vue selon le rôle connecté
/tableau-de-bord/profil    → Édition du profil (enseignant)
/tableau-de-bord/demandes  → Demandes envoyées / reçues

/demandes/nouvelle         → Formulaire de mise en relation
/demandes/[id]             → Détail d'une demande

/admin                     → Dashboard admin (accès restreint)
/admin/candidatures        → File de vérification des enseignants
/admin/utilisateurs        → Gestion des comptes
/admin/avis                → Modération des avis
/admin/signalements        → Contenu signalé
/admin/statistiques        → Métriques globales
```

---

## 6. Fonctionnalités hors périmètre MVP (V2)

Ces fonctionnalités sont importantes mais reportées après validation du marché.

| Fonctionnalité | Justification du report |
| --- | --- | --- |
| Paiement en ligne | Ajoute de la complexité technique et réglementaire |
| Visioconférence intégrée | Outils tiers suffisants pour le démarrage |
| Calendrier de réservation automatique | Peut se faire manuellement via messagerie |
| Badges et certifications enseignants | Valeur ajoutée, pas critique au lancement |
| Espace communautaire enseignants | Nécessite une masse critique d'utilisateurs |
| Application mobile | À prioriser après validation du modèle web |
| Notifications push | Emails suffisants pour le MVP |

---

## 7. Planning de développement

### Mois 1 — Le socle

- [ ] Authentification (inscription, connexion, récupération mdp)
- [ ] Onboarding par rôle
- [ ] Création et édition du profil enseignant
- [ ] Indicateur de complétude du profil
- [ ] Upload de documents (diplômes)
- [ ] **Admin : file de candidatures et validation des profils**
- [ ] Landing page + pages statiques (À propos, FAQ)

**Livrable fin mois 1** : un enseignant peut créer son profil et le soumettre à validation. L'admin peut approuver, corriger ou rejeter.

---

### Mois 2 — Le flux de mise en relation

- [ ] Recherche avec filtres
- [ ] Profil public enseignant (visible après validation)
- [ ] Système de demande de mise en relation
- [ ] Messagerie interne
- [ ] Notifications email (statuts de demande, nouveaux messages)
- [ ] Tableau de bord par rôle (enseignant, parent, directeur)
- [ ] **Admin : gestion des utilisateurs + métriques globales**

**Livrable fin mois 2** : un parent peut trouver un enseignant, envoyer une demande et échanger par message.

---

### Mois 3 — Confiance & lancement

- [ ] Système d'avis et évaluations
- [ ] Signalement de contenu
- [ ] **Admin : modération des avis et signalements**
- [ ] Système de favoris (parents)
- [ ] Corrections UX/UI après tests utilisateurs
- [ ] Tests avec 20 à 30 enseignants réels
- [ ] Préparation du lancement public

**Livrable fin mois 3** : plateforme stable, 20-30 enseignants vérifiés inscrits, prêt pour le lancement.

---

## 8. Règles métier importantes

1. **Un profil enseignant n'est jamais visible publiquement sans validation admin.**
2. **Le paiement se fait hors plateforme** pour le MVP — la plateforme ne gère aucune transaction financière.
3. **Un enseignant ne peut pas supprimer les avis** laissés sur son profil — seul l'admin peut modérer.
4. **Toute action admin critique** (suspension, suppression de compte) nécessite une confirmation.
5. **L'admin reçoit une notification** à chaque nouvelle candidature enseignant.
6. **Un utilisateur suspendu** ne peut plus se connecter mais ses données sont conservées.

---

## 9. Indicateurs de succès du MVP

| Indicateur | Objectif au lancement |
| --- | --- | --- |
| Enseignants vérifiés inscrits | 30 minimum |
| Parents inscrits | 50 minimum |
| Mises en relation effectuées | 20 minimum |
| Taux de complétion du profil enseignant | > 70% |
| Délai de validation d'un profil | < 48h |

---

*Document évolutif — à mettre à jour à chaque itération du produit.*
