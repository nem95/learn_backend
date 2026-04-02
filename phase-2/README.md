# Phase 2 : Patterns Intermédiaires (Semaines 4-6)

## Objectif
Apprendre les patterns de production : authentification, tests, cache, rate limiting.

**👉 [Voir les TICKETS →](./tickets/INDEX.md)**

---

## Semaine 4 : Authentification + Projet #3

### À apprendre
- Hachage des mots de passe (bcrypt)
- JWT "à la main" (créer, valider, refresh)
- Middleware d'authentification Express custom
- Refresh tokens et expiration

### **Projet #3 : Blog API avec Auth complet**

#### Routes à ajouter
```
POST   /auth/register      → {email, password} → user créé
POST   /auth/login         → {email, password} → JWT + refresh token
POST   /auth/refresh       → {refreshToken} → nouveau JWT
GET    /auth/me            → info utilisateur (protégée)

POST   /posts              → créer post (protégée, JWT requis)
PATCH  /posts/:id          → modifier (seulement l'auteur)
DELETE /posts/:id          → supprimer (seulement l'auteur ou admin)
```

#### Points clés à implémenter
- ✅ Hacher le mot de passe avec bcrypt avant l'enregistrement
- ✅ JWT include l'ID du user : `{ userId, email, exp, iat }`
- ✅ Middleware pour valider le JWT sur les routes protégées
- ✅ Refresh token séparé stocké en BD
- ✅ Retourner 401 si pas d'auth, 403 si pas de permission
- ✅ Token expiration (15 min pour access, 7 jours pour refresh)

#### Structure
```
src/
├── app.ts
├── server.ts
├── types/index.ts
├── auth/
│   ├── auth.router.ts
│   ├── auth.service.ts
│   ├── auth.schema.ts
│   └── auth.middleware.ts        ← NEW : middleware d'authentification
├── posts/
│   ├── posts.router.ts           ← UPDATED : utiliser auth middleware
│   ├── posts.service.ts
│   └── posts.schema.ts
└── utils/
    └── jwt.ts                    ← NEW : helpers JWT
```

#### Dépendances à ajouter
```json
{
  "dependencies": {
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x",
    "@types/jsonwebtoken": "^9.x"
  }
}
```

#### Prisma schema update
```prisma
model User {
  id            Int     @id @default(autoincrement())
  email         String  @unique
  name          String?
  password      String  // hashed with bcrypt
  refreshToken  String? // for refresh token flow
  posts         Post[]
  createdAt     DateTime @default(now())
}
```

#### Vérification
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
# Response: { accessToken: "...", refreshToken: "..." }

# Utiliser le JWT pour créer un post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"Mon post","content":"Contenu"}'

# Refresh le token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## Semaine 5 : Tests + Projet #4

### À apprendre
- Tests unitaires avec Jest (logique métier)
- Tests d'intégration avec Supertest (endpoints API)
- Coverage goal: 70%+
- Mock de dépendances (Prisma)

### **Projet #4 : Blog API avec tests complets**

#### Dépendances
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

#### Jest config (`jest.config.js`)
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.schema.ts',
    '!src/**/*.types.ts',
  ],
};
```

#### Package.json scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Tests à implémenter

**posts.service.test.ts** (unitaires)
```typescript
describe('PostsService', () => {
  // Tests pour createPost, getPost, updatePost, deletePost
  // Mock Prisma
});
```

**auth.service.test.ts** (unitaires)
```typescript
describe('AuthService', () => {
  // Tests pour register, login, validateToken
  // Mock bcrypt, JWT
});
```

**posts.router.test.ts** (intégration)
```typescript
describe('POST /posts', () => {
  // Test avec Supertest
  // Test avec et sans authentification
});
```

**auth.router.test.ts** (intégration)
```typescript
describe('Auth endpoints', () => {
  // Test /auth/register
  // Test /auth/login
  // Test /auth/refresh
});
```

#### Vérification
```bash
npm test
npm test -- --watch
npm test:coverage
# Goal: 70%+ coverage
```

---

## Semaine 6 : Redis + Cache + Rate Limiting + Projet #5

### À apprendre
- Cache avec Redis
- Rate limiting par IP/user avec express-rate-limit
- Optimisation des requêtes Prisma (pagination, select)
- TTL (Time To Live)

### **Projet #5 : Blog API robuste et performante**

#### À implémenter
- ✅ Cache Redis pour les 20 derniers posts (1h TTL)
- ✅ Cache invalidé quand un post est créé/modifié
- ✅ Rate limit : 100 requests/15min par IP global
- ✅ Rate limit : 50 requests/15min par user authentifié
- ✅ Pagination : `GET /posts?page=1&limit=10`
- ✅ Seulement retourner certains champs (select Prisma)

#### Dépendances
```json
{
  "dependencies": {
    "redis": "^4.x",
    "express-rate-limit": "^7.x"
  },
  "devDependencies": {
    "@types/redis": "^4.x"
  }
}
```

#### Routes à mettre à jour
```
GET /posts?page=1&limit=10   → paginé, avec cache
GET /posts/:id               → avec cache
POST /posts                  → invalidate cache
PATCH /posts/:id             → invalidate cache
DELETE /posts/:id            → invalidate cache
```

#### Implementation checklist
- ✅ Connecter à Redis au démarrage du serveur
- ✅ Créer un middleware de rate limiting global
- ✅ Créer un middleware de rate limiting pour les utilisateurs authentifiés
- ✅ Implémenter le caching pour les GET /posts
- ✅ Implémenter l'invalidation du cache
- ✅ Ajouter pagination avec Prisma (skip, take)

#### Vérification
```bash
# Lancer Redis en Docker
docker run -d -p 6379:6379 redis:latest

npm run start:dev

# Test 1: Tester le cache
time curl http://localhost:3000/posts      # First call: lent
time curl http://localhost:3000/posts      # Second call: rapide

# Test 2: Tester le rate limit
for i in {1..150}; do 
  curl http://localhost:3000/posts
done
# Vous devriez être bloqué après 100 requêtes

# Test 3: Tester la pagination
curl http://localhost:3000/posts?page=1&limit=5
curl http://localhost:3000/posts?page=2&limit=5
```

---

## Checklist Phase 2 ✅

### Semaine 4 : Authentification
- [ ] Register endpoint fonctionne
- [ ] Login endpoint retourne JWT + refresh token
- [ ] Middleware d'auth fonctionne
- [ ] Routes protégées retournent 401 sans token
- [ ] Routes retournent 403 sans permission
- [ ] Refresh token flow marche
- [ ] Prisma schema avec User.password et User.refreshToken

### Semaine 5 : Tests
- [ ] Tous les services ont des tests unitaires
- [ ] Tous les endpoints ont des tests d'intégration
- [ ] Coverage > 70%
- [ ] `npm test` passe sans erreurs
- [ ] `npm test:coverage` montre des résultats

### Semaine 6 : Cache et Rate Limiting
- [ ] Redis se connecte au démarrage
- [ ] Rate limit global fonctionne
- [ ] Rate limit par user fonctionne
- [ ] Caching des posts fonctionne
- [ ] Invalidation du cache fonctionne
- [ ] Pagination fonctionne

---

## Tips

1. **JWT secrets** — Utilise un .env pour les secrets (JWT_SECRET, REFRESH_SECRET)
2. **Password hashing** — Ne jamais stocker les mots de passe en clair
3. **Token expiration** — Access token court (15 min), refresh token long (7 jours)
4. **Rate limiting** — Adapter les limites à ton cas d'usage
5. **Cache invalidation** — C'est plus dur que cacher (citation: Phil Karlton)
6. **Tests mocking** — Mock Prisma pour les tests unitaires, BD réelle pour les intégration

---

## Ressources

- bcrypt : https://github.com/kelektiv/node.bcrypt.js
- JWT : https://jwt.io/
- express-rate-limit : https://github.com/nfriedly/express-rate-limit
- Redis : https://redis.io/docs/
- Jest : https://jestjs.io/
- Supertest : https://github.com/visionmedia/supertest
