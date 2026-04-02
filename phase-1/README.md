# Phase 1 : Fondations Express (Semaines 1-3)

## Objectif
Maîtriser les bases du backend "à la hand" : routing, middlewares, gestion d'erreurs, validation.

**👉 [Voir les TICKETS →](./tickets/INDEX.md)**

---

## Semaine 1-2 : Express Core + Projet #1

### À apprendre
- Créer un serveur HTTP avec Express
- Routes (GET, POST, PATCH, DELETE)
- Middlewares (custom + built-in)
- Gestion des erreurs (middleware d'erreur global)
- Validation des inputs avec Zod
- Variables d'environnement (`dotenv`)
- Types TypeScript

### **Projet #1 : Blog API (in-memory)**

#### Routes à implémenter
```
GET    /posts              → liste tous les posts
POST   /posts              → crée un post (body: {title, content})
GET    /posts/:id          → détail d'un post
PATCH  /posts/:id          → modifie un post (body: {title?, content?})
DELETE /posts/:id          → supprime un post
```

#### Requis
- ✅ Stockage en mémoire (tableau ou Map)
- ✅ Validation des inputs avec Zod
- ✅ Codes HTTP corrects (201 pour POST, 204 pour DELETE, 400 pour validation error)
- ✅ IDs uniques (uuid ou simple counter)
- ✅ Middleware d'erreur global qui catch toutes les erreurs

#### Structure sugérée
```
projet-1/
├── src/
│   ├── app.ts              ← créer et config Express
│   ├── server.ts           ← démarrer le serveur
│   ├── types/
│   │   └── index.ts        ← types TypeScript
│   └── posts/
│       ├── posts.router.ts    ← routes
│       ├── posts.service.ts   ← logique métier
│       └── posts.schema.ts    ← validation Zod
├── package.json
├── tsconfig.json
└── .env
```

#### Dépendances
```json
{
  "dependencies": {
    "express": "^4.x",
    "zod": "^3.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/express": "^4.x",
    "@types/node": "^20.x",
    "tsx": "^4.x"
  }
}
```

#### Package.json scripts
```json
{
  "scripts": {
    "start": "tsx src/server.ts",
    "start:dev": "tsx watch src/server.ts"
  }
}
```

#### Vérification
```bash
npm install
npm run start:dev

# Tester avec curl :
curl http://localhost:3000/posts
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World"}'
curl http://localhost:3000/posts/1
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'
curl -X DELETE http://localhost:3000/posts/1
```

---

## Semaine 3 : Prisma + PostgreSQL + Projet #2

### À apprendre
- Installer PostgreSQL (Docker ou local)
- Prisma basics : schema, migrations
- Relations (1-to-many)
- Requêtes Prisma

### **Projet #2 : Blog API + PostgreSQL**

#### Étapes
1. **Lancer PostgreSQL en Docker**
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=secret \
     -p 5432:5432 -d postgres:latest
   ```

2. **Installer Prisma**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npx prisma init
   ```

3. **Configurer .env**
   ```
   DATABASE_URL="postgresql://postgres:secret@localhost:5432/blog"
   ```

4. **Créer le schema Prisma** (`prisma/schema.prisma`)
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model User {
     id    Int     @id @default(autoincrement())
     email String  @unique
     name  String?
     posts Post[]
   }

   model Post {
     id    Int     @id @default(autoincrement())
     title String
     content String
     createdAt DateTime @default(now())
     author User @relation(fields: [authorId], references: [id])
     authorId Int
   }

   model Comment {
     id    Int     @id @default(autoincrement())
     text String
     createdAt DateTime @default(now())
     post Post @relation(fields: [postId], references: [id])
     postId Int
   }
   ```

5. **Faire la migration**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Remplacer le stockage in-memory par des appels Prisma**

#### Routes à mettre à jour
- `POST /posts` → Chercher l'auteur en BD, créer le post
- `GET /posts/:id` → Récupérer du Prisma
- Ajouter `POST /posts/:id/comments` pour les commentaires
- Ajouter `GET /posts/:id/comments` pour lister les comments

#### Vérification
```bash
npm install @prisma/client
npm run start:dev

# Voir et modifier la BD graphiquement :
npx prisma studio
```

---

## Checklist Phase 1 ✅

- [ ] Projet #1 : API in-memory fonctionne
  - [ ] Toutes les routes fonctionnent
  - [ ] Validation Zod marche
  - [ ] Codes HTTP corrects
  - [ ] Middleware d'erreur global

- [ ] Projet #2 : PostgreSQL + Prisma
  - [ ] PostgreSQL marche en Docker
  - [ ] Prisma schema créé et migré
  - [ ] Routes mises à jour pour utiliser Prisma
  - [ ] Relations User-Post-Comment fonctionnent
  - [ ] Prisma Studio s'ouvre correctement

---

## Tips

1. **Comprendre Express avant tout** — Lis les docs officielles (30 min)
2. **Middleware order matters** — L'ordre des middlewares est crucial
3. **Error handling** — Ne pas oublier le middleware d'erreur à la fin
4. **Zod validation** — Utilise parse() ou safeParse() pour valider les inputs
5. **Prisma relations** — Comprendre les @relation et les foreign keys

---

## Ressources

- Express : https://expressjs.com/
- Zod : https://zod.dev/
- Prisma : https://www.prisma.io/docs/
- PostgreSQL Docker : https://hub.docker.com/_/postgres
