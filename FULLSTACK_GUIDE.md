# Guide Fullstack : Express → NestJS → Microservices

Tu es dev React/Next.js et tu veux devenir fullstack. Ce guide te montre comment progresser pas à pas en construisant des vrais projets.

---

## Stack Globale

| Layer | Phase 1-3 | Phase 4 |
|-------|-----------|---------|
| Framework | Express.js + TypeScript | NestJS |
| ORM | Prisma | Prisma |
| BD | PostgreSQL | PostgreSQL (par service) |
| Cache | Redis | Redis |
| Queues | Bull | Bull |
| Auth | JWT (jsonwebtoken) | JWT (Passport) |
| Tests | Jest + Supertest | Jest + Supertest |
| DevOps | Docker, Docker Compose | Docker, Docker Compose, GitHub Actions |
| Microservices | - | @nestjs/microservices |

---

## PHASE 1 : Fondations Express (Semaines 1-3)

### Objectif
Maîtriser les bases du backend "à la main" : routing, middlewares, gestion d'erreurs, validation.

### Semaine 1-2 : Express Core

#### À apprendre
- Créer un serveur HTTP avec Express
- Routes (GET, POST, PATCH, DELETE)
- Middlewares (custom + built-in)
- Gestion des erreurs (middleware d'erreur global)
- Validation des inputs avec Zod
- Variables d'environnement (`dotenv`)
- Types TypeScript

#### **Projet #1 : Blog API (in-memory)**

**Routes à implémenter:**
```
GET    /posts              → liste tous les posts
POST   /posts              → crée un post (body: {title, content})
GET    /posts/:id          → détail d'un post
PATCH  /posts/:id          → modifie un post (body: {title?, content?})
DELETE /posts/:id          → supprime un post
```

**Requis:**
- Stockage en mémoire (tableau ou Map)
- Validation des inputs avec Zod
- Codes HTTP corrects (201 pour POST, 204 pour DELETE, 400 pour validation error)
- IDs uniques (uuid ou simple counter)
- Middleware d'erreur global qui catch toutes les erreurs

**Structure sugérée:**
```
src/
├── app.ts              ← créer et config Express
├── server.ts           ← démarrer le serveur
├── types/
│   └── index.ts        ← types TypeScript
└── posts/
    ├── posts.router.ts    ← routes
    ├── posts.service.ts   ← logique métier
    └── posts.schema.ts    ← validation Zod
```

**Dépendances:**
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

**Package.json scripts:**
```json
{
  "scripts": {
    "start": "tsx src/server.ts",
    "start:dev": "tsx watch src/server.ts"
  }
}
```

**Vérification:**
```bash
npm run start:dev

# Tester avec curl :
curl http://localhost:3000/posts
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World"}'
```

---

### Semaine 3 : Prisma + PostgreSQL

#### À apprendre
- Installer PostgreSQL (Docker)
- Prisma basics : schema, migrations
- Relations (1-to-many)
- Requêtes Prisma

#### **Projet #2 : Blog API + PostgreSQL**

**Étapes:**
1. Lancer PostgreSQL en Docker Compose
2. Installer Prisma : `npm install @prisma/client && npm install -D prisma`
3. Initialiser Prisma : `npx prisma init`
4. Créer le schema Prisma :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
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
   ```
5. Faire la migration : `npx prisma migrate dev --name init`
6. Remplacer le stockage in-memory par des appels Prisma

**Routes à mettre à jour:**
- `POST /posts` → Chercher l'auteur en BD, créer le post
- `GET /posts/:id` → Récupérer du Prisma
- Ajouter `POST /posts/:id/comments` pour les commentaires

**Vérification:**
```bash
npm run start:dev

# Voir la BD :
npx prisma studio
```

---

## PHASE 2 : Patterns Intermédiaires (Semaines 4-6)

### Semaine 4 : Authentification

#### À apprendre
- Hachage des mots de passe (bcrypt)
- JWT "à la main" (créer, valider)
- Middleware d'authentification Express custom
- Refresh tokens

#### **Projet #3 : Blog API avec Auth**

**Routes à ajouter:**
```
POST   /auth/register    → créer un compte
POST   /auth/login       → retourne un JWT + refresh token
POST   /auth/refresh     → retourne un nouveau JWT
POST   /posts            → protégée (JWT requis)
PATCH  /posts/:id        → seulement l'auteur peut modifier
DELETE /posts/:id        → seulement l'auteur ou admin peut supprimer
```

**Points clés:**
- Hacher le mot de passe avec bcrypt avant de l'enregistrer
- JWT include l'ID du user : `{ userId, exp, iat }`
- Middleware pour valider le JWT sur les routes protégées
- Refresh token séparé stocké en BD (ou Redis plus tard)
- Retourner 401 si pas d'auth, 403 si pas de permission

**Dépendances à ajouter:**
```json
{
  "bcrypt": "^5.x",
  "jsonwebtoken": "^9.x"
}
```

**Dépendances dev:**
```json
{
  "@types/bcrypt": "^5.x",
  "@types/jsonwebtoken": "^9.x"
}
```

**Vérification:**
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Créer un post (avec le JWT obtenu)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"title":"Mon post","content":"Contenu"}'
```

---

### Semaine 5 : Tests

#### À apprendre
- Tests unitaires avec Jest
- Tests d'intégration avec Supertest
- Coverage 70%+

#### **Projet #4 : Blog API avec tests**

**Tests à implémenter:**
- Service tests : `posts.service.test.ts` (logique métier)
- Route tests : `posts.router.test.ts` (endpoints)
- Auth tests : register, login, refresh token

**Dépendances:**
```json
{
  "devDependencies": {
    "jest": "^29.x",
    "@types/jest": "^29.x",
    "supertest": "^6.x",
    "@types/supertest": "^2.x",
    "ts-jest": "^29.x"
  }
}
```

**Jest config (jest.config.js):**
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
};
```

**Vérification:**
```bash
npm test
npm test -- --coverage
```

---

### Semaine 6 : Redis + Cache + Rate Limiting

#### À apprendre
- Cache avec Redis
- Rate limiting par IP/user
- Optimisation des requêtes Prisma (pagination, select)

#### **Projet #5 : Blog API robuste**

**À implémenter:**
- Cache les 20 derniers posts (1h TTL)
- Rate limit : 100 requests/15min par IP (avec express-rate-limit)
- Pagination : `GET /posts?page=1&limit=10`
- Seulement retourner certains champs (select Prisma)

**Dépendances:**
```json
{
  "dependencies": {
    "redis": "^4.x",
    "express-rate-limit": "^7.x"
  }
}
```

**Vérification:**
```bash
# Vérifier le cache
npm run start:dev

# Faire plusieurs requêtes rapidement
for i in {1..150}; do curl http://localhost:3000/posts; done

# Vous devriez être bloqué après 100 requêtes
```

---

## PHASE 3 : Async & Background Jobs (Semaines 7-8)

### À apprendre
- Queues Redis avec Bull
- Jobs asynchrones
- Retry logic
- Webhooks

### **Projet #6 : Blog API avec notifications**

**À implémenter:**
- Queue Bull pour les emails
- Email de bienvenue à l'inscription
- Notifications quand quelqu'un commente
- Export des posts en PDF (background job)

**Dépendances:**
```json
{
  "dependencies": {
    "bull": "^4.x",
    "nodemailer": "^6.x"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.x"
  }
}
```

**Vérification:**
```bash
# Les jobs devraient être traités en arrière-plan
npm run start:dev
curl -X POST http://localhost:3000/auth/register ...
# Vérifier les logs "Email sent"
```

---

## PHASE 4 : Transition NestJS + Microservices (Semaines 9-13)

### Objectif
Passer du monolithe Express à une architecture microservices avec NestJS.

### Semaine 9 : Transition vers NestJS

#### À comprendre
Comment les abstractions NestJS correspondent à ce qu'on a fait avec Express :

| Express | NestJS |
|---------|--------|
| Middleware d'auth | Guard (@UseGuards) |
| Middleware de validation Zod | Pipe (@UsePipes) |
| Router + logique métier | Controller + Service |
| Organisation manuelle | Modules |
| try/catch | Exception filters |

**Étapes:**
1. Lire la doc NestJS (15 min)
2. Créer un nouveau projet : `npm i -g @nestjs/cli && nest new blog-api`
3. Refactoriser le projet #5 Express en NestJS (même fonctionnalités)

**Structure NestJS:**
```
src/
├── main.ts
├── app.module.ts
└── posts/
    ├── posts.module.ts
    ├── posts.controller.ts
    ├── posts.service.ts
    ├── dto/
    │   ├── create-post.dto.ts
    │   └── update-post.dto.ts
    └── posts.entity.ts
```

---

### Semaine 10-11 : Microservices avec NestJS

#### À apprendre
- Communication TCP entre services
- Pub/Sub avec Redis
- Event-driven architecture

#### Architecture cible
```
┌──────────────────────┐
│   API Gateway        │  NestJS (port 3000)
│  Route + Auth        │
└──────────┬───────────┘
           │ TCP / Redis Events
    ┌──────┼───────┬──────────┬──────────┐
    ▼      ▼       ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌───────┐ ┌──────────┐
│ Auth │ │Posts │ │ Users │ │ Notifs   │
│3001  │ │3002  │ │ 3003  │ │ 3004     │
└──────┘ └──────┘ └───────┘ └──────────┘
   │        │        │         │
   └────────┴────────┴─────────┘
      Chaque service : sa propre BD
```

**Services à créer:**
1. **API Gateway** — Route les requêtes vers les bons services
2. **Auth Service** — Register, login, validate JWT
3. **Posts Service** — CRUD posts + cache Redis
4. **Users Service** — Profils, préférences
5. **Notifications Service** — Envoyer emails

**Communication:**
- API Gateway → Auth Service : appel TCP synchrone
- Posts Service → Notifications Service : Redis pub/sub asynchrone

**Dépendances NestJS:**
```json
{
  "@nestjs/common": "^10.x",
  "@nestjs/core": "^10.x",
  "@nestjs/microservices": "^10.x",
  "@nestjs/jwt": "^12.x",
  "@nestjs/passport": "^10.x",
  "@nestjs/bull": "^10.x",
  "passport-jwt": "^4.x"
}
```

---

### Semaine 12 : Découper le monolithe

**Étapes:**
1. Créer 5 dossiers services/ avec NestJS
2. Chacun a sa propre BD (Prisma séparé)
3. API Gateway en Express simple (router + appels HTTP/TCP)
4. Services communiquent via Redis pub/sub

**Checklist:**
- [ ] Auth Service marche indépendamment
- [ ] Posts Service marche indépendamment
- [ ] API Gateway peut router vers Auth Service
- [ ] API Gateway peut router vers Posts Service
- [ ] Posts Service envoie un event quand un post est créé
- [ ] Notifications Service reçoit l'event et envoie un email

---

### Semaine 13 : Production-ready

#### À apprendre
- Docker per service
- Docker Compose pour dev local
- GitHub Actions CI/CD
- Health checks
- Structured logs (Pino)

**Checklist:**
- [ ] Chaque service a un Dockerfile
- [ ] Docker Compose démarre tous les services + PostgreSQL + Redis
- [ ] GitHub Actions lance les tests à chaque push
- [ ] GitHub Actions build et push les images Docker
- [ ] Tous les services ont un endpoint `/health` (Kubernetes-compatible)
- [ ] Logs structurés avec Pino
- [ ] Déployer sur Railway ou Render

**Fichiers à créer:**
```
docker-compose.yml     ← tous les services
.github/workflows/
└── ci.yml             ← GitHub Actions
services/
├── api-gateway/Dockerfile
├── auth/Dockerfile
├── posts/Dockerfile
├── users/Dockerfile
└── notifications/Dockerfile
```

---

## Ressources

### Express
- https://expressjs.com/ — Docs officielles
- Prisma : https://www.prisma.io/docs/

### NestJS
- https://docs.nestjs.com/ — Docs officielles (excellentes)
- Module system : https://docs.nestjs.com/modules
- Microservices : https://docs.nestjs.com/microservices/basics

### Testing
- Jest : https://jestjs.io/
- Supertest : https://github.com/visionmedia/supertest

### DevOps
- Docker : https://docs.docker.com/
- Docker Compose : https://docs.docker.com/compose/

### Concepts
- JWT : https://jwt.io/
- OAuth / Refresh tokens : https://datatracker.ietf.org/doc/html/rfc6749

---

## Notes Importantes

1. **Maîtrise une semaine avant de passer à la suivante** — Ne pas rush
2. **Code réel > Tutoriels** — Construis les projets toi-même
3. **Les bases d'abord** — Comprendre SQL avant Prisma, middleware avant NestJS Guards
4. **Déploie tôt** — Phase 3 semaine 6, tu dois déployer la première version
5. **Lire du code** — Regarde comment d'autres construisent leurs backends
6. **Les microservices ne sont pas la solution à tout** — Comprendre quand les utiliser

---

## Checklist Finale

### Phase 1 ✅
- [ ] Projet #1 : Blog API in-memory avec Express
- [ ] Projet #2 : Blog API + PostgreSQL

### Phase 2 ✅
- [ ] Projet #3 : Blog API avec authentification
- [ ] Projet #4 : Blog API avec tests
- [ ] Projet #5 : Blog API avec cache et rate limiting

### Phase 3 ✅
- [ ] Projet #6 : Blog API avec queues et notifications

### Phase 4 ✅
- [ ] Semaine 9 : Refactoriser en NestJS (monolithe)
- [ ] Semaine 10-12 : Découper en 5 microservices
- [ ] Semaine 13 : Dockeriser et déployer

---

Bon courage ! 🚀
