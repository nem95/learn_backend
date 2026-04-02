# P1-02 : Routes de base (GET /posts, POST /posts)

**Difficulté:** 🟢 Facile  
**Dépend de:** P1-01  
**Débloque:** P1-03

---

## Description

Implémenter les deux routes de base pour lister et créer des posts. Les données sont stockées en mémoire (tableau ou Map). Pas de validation ni codes HTTP spéciaux pour le moment.

---

## Sujets à maîtriser

- Routes Express (`app.get()`, `app.post()`)
- Request/Response objects
- Body parsing avec `express.json()`
- Stockage en mémoire (tableau/Map)
- IDs uniques (counter ou uuid)
- `res.json()` pour retourner du JSON

---

## Acceptance Criteria

- [ ] Fichier `src/posts/posts.service.ts` créé (logique métier)
- [ ] Fichier `src/posts/posts.router.ts` créé (routes)
- [ ] Fichier `src/types/index.ts` créé (types TypeScript)
- [ ] Route `GET /posts` retourne un tableau vide `[]` au démarrage
- [ ] Route `POST /posts` avec body `{title, content}` crée un post et le retourne
- [ ] Chaque post a un `id` unique
- [ ] Chaque post a un `createdAt` timestamp
- [ ] `POST /posts` ajoute le post au stockage en mémoire
- [ ] `GET /posts` retourne tous les posts créés (les nouvelles créations y apparaissent)
- [ ] Router enregistré dans `app.ts` avec `app.use('/posts', postsRouter)`

---

## Details techniques

### Structure de données

```typescript
interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}
```

### Stockage en mémoire

Utiliser un simple tableau ou Map :
```typescript
const posts: Post[] = [];
let nextId = 1;
```

Ou avec Map :
```typescript
const posts = new Map<number, Post>();
let nextId = 1;
```

---

## Points clés

- Express parse automatiquement le JSON si `express.json()` est en middleware
- `res.json(data)` set le header `Content-Type: application/json`
- Les IDs doivent être uniques et incrémentés
- Le `createdAt` doit être à la date/heure courante

---

## Validation

```bash
npm run start:dev

# Test 1: GET /posts (vide)
curl http://localhost:3000/posts
# Response: []

# Test 2: POST /posts
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World"}'
# Response: { id: 1, title: "Hello", content: "World", createdAt: "2026-04-02T..." }

# Test 3: GET /posts (avec le post créé)
curl http://localhost:3000/posts
# Response: [{ id: 1, title: "Hello", content: "World", createdAt: "..." }]

# Test 4: POST un second post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Second","content":"Post"}'
# ID doit être 2, pas 1

# Test 5: GET /posts (avec deux posts)
curl http://localhost:3000/posts
# Response: deux posts avec id 1 et 2
```

---

## ✅ TICKET COMPLÉTÉ - Code Review PASSED

**Date:** 2026-04-02  
**Reviewer:** Claude Code  

### Vérifications effectuées:
- ✅ Fichier `src/posts/posts.service.ts` créé avec logique métier
- ✅ Fichier `src/posts/posts.router.ts` créé avec routes
- ✅ Fichier `src/types/index.ts` créé avec interface `Post`
- ✅ Route `GET /posts` retourne un tableau (vide ou avec posts)
- ✅ Route `POST /posts` crée un post avec body `{title, content}`
- ✅ Chaque post a un `id` unique et incrémenté
- ✅ Chaque post a un `createdAt` timestamp automatique
- ✅ POST ajoute le post au stockage en mémoire
- ✅ GET retourne tous les posts (créations y apparaissent)
- ✅ Router enregistré correctement dans `app.ts` avec `app.use('/posts', postsRouter)`
- ✅ Imports/Exports corrects
- ✅ Typage TypeScript correct

**Code Quality:**
- ✅ Structure claire et séparée
- ✅ Service contient la logique métier
- ✅ Router gère uniquement les routes
- ✅ Types partagés via `src/types/index.ts`

**Statut:** ✅ READY FOR NEXT TICKET (P1-03)
