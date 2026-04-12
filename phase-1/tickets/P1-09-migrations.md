# P1-09 : Migrations Prisma

**Difficulté:** 🟢 Facile  
**Dépend de:** P1-08  
**Débloque:** P1-10

---

## Description

Exécuter les migrations Prisma pour créer les tables dans PostgreSQL. Les migrations permettent de versionner les changements de schéma.

---

## Sujets à maîtriser

- Migrations Prisma
- `prisma migrate dev` (dev avec création)
- `prisma migrate deploy` (production)
- Fichiers de migration SQL
- Historique des migrations

---

## Acceptance Criteria

- [x] Dossier `prisma/migrations/` créé
- [x] Première migration exécutée : `npx prisma migrate dev --name init`
- [x] Fichier de migration SQL créé dans `prisma/migrations/[timestamp]_init/`
- [x] Tables `users`, `posts`, `comments` créées dans PostgreSQL
- [x] Prisma Client généré (`.prisma/client/`)
- [ ] `npx prisma studio` affiche les 3 tables vides
- [ ] Migration peut être rejouée : `npx prisma migrate reset` (optionnel, pour test)

---

## Details techniques

### Commandes migration

```bash
# Créer une migration depuis le schema
# (recommandé en dev)
npx prisma migrate dev --name init
# Crée le fichier migration + applique + génère Prisma Client

# Juste appliquer les migrations existantes
# (recommandé en production)
npx prisma migrate deploy

# Supprimer la BD et rejouer les migrations (attention!)
# (utile en dev pour tester)
npx prisma migrate reset

# Voir l'état des migrations
npx prisma migrate status
```

### Fichier de migration généré

```sql
-- prisma/migrations/20240402141234_init/migration.sql
-- CreateTable users
CREATE TABLE "users" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT
);

-- CreateTable posts
CREATE TABLE "posts" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "authorId" INTEGER NOT NULL,
  CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id")
);

-- CreateTable comments
CREATE TABLE "comments" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "postId" INTEGER NOT NULL,
  CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id")
);
```

---

## Points clés

- `prisma migrate dev` combine : plan, create, apply, generate
- `prisma migrate deploy` applique seulement (pour production)
- Les migrations sont versionnées avec timestamps
- Toujours committer les migrations avec le code
- Ne jamais modifier les fichiers de migration une fois appliqués

---

## Validation

```bash
# Exécuter la migration
npx prisma migrate dev --name init
# Devrait afficher:
# - Plan to apply
# - ✓ Applied the first migration

# Vérifier les tables
npx prisma studio
# Doit afficher users, posts, comments (vides)

# Vérifier directement en PostgreSQL
psql -U postgres -d blog -c "\\dt"
# Doit afficher les 3 tables

# Vérifier les migrations
npx prisma migrate status
# Devrait montrer "Database schema is up to date"
```
