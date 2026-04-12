# P1-07 : Setup PostgreSQL + Prisma

**Difficulté:** 🟡 Moyen  
**Dépend de:** P1-06  
**Débloque:** P1-08

---

## Description

Installer PostgreSQL en Docker et configurer Prisma pour communiquer avec la base de données. Créer un service Prisma pour la connexion.

---

## Sujets à maîtriser

- Docker et conteneurs
- PostgreSQL basics
- Prisma CLI et configuration
- Variables d'environnement (.env)
- Connexion à une base de données

---

## Acceptance Criteria

- [x] PostgreSQL lancé en Docker (`docker run ...`)
- [x] `.env` créé avec `DATABASE_URL`
- [x] Prisma installé : `npm install @prisma/client` et `npm install -D prisma`
- [x] `npx prisma init` lancé (crée `prisma/schema.prisma`)
- [x] `prisma/schema.prisma` configuré avec PostgreSQL
- [x] Fichier `src/database/prisma.service.ts` créé (wrapper Prisma)
- [x] Service Prisma injecté dans `app.ts`
- [x] Test de connexion : `npx prisma db push` lance sans erreur
- [x] `npx prisma studio` ouvre l'interface web (optionnel mais sympa)
- [x] `.env` ajouté au `.gitignore`

---

## Details techniques

### Lancer PostgreSQL en Docker

```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  -d postgres:15
```

Ou avec Docker Compose (mieux) :
```yaml
# docker-compose.yml
version: '3.9'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

### Fichier .env

```
DATABASE_URL="postgresql://postgres:secret@localhost:5432/blog"
NODE_ENV="development"
```

### Schema Prisma de base

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Modèles ajoutés plus tard
```

### Service Prisma

```typescript
// src/database/prisma.service.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log('Prisma connected to database'))
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
```

---

## Points clés

- PASSWORD en .env ne doit pas être pushé (ajouter .gitignore)
- PostgreSQL doit tourner pour que Prisma puisse se connecter
- Si la connexion échoue, vérifier les credentials dans DATABASE_URL
- `.env` doit être au root du projet (où package.json)

---

## Validation

```bash
# Test 1: PostgreSQL tourne
docker ps | grep postgres
# Devrait afficher le conteneur postgres

# Test 2: Prisma peut se connecter
npx prisma db push
# Pas d'erreur de connexion

# Test 3: Prisma Studio marche (optionnel)
npx prisma studio
# Doit ouvrir http://localhost:5555 dans le navigateur

# Test 4: Quitter avec Ctrl+C
```
