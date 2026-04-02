# P1-10 : Remplacer in-memory par Prisma

**Difficulté:** 🟡 Moyen  
**Dépend de:** P1-09  
**Débloque:** P1-11

---

## Description

Refactoriser le service `posts.service.ts` pour utiliser Prisma au lieu du stockage en mémoire. Les routes ne changeront pas, seule l'implémentation du service change.

---

## Sujets à maîtriser

- Requêtes Prisma CRUD
- Types Prisma (`Post`, `User`)
- `include` et `select` pour les relations
- Gestion d'erreurs Prisma
- Transactions Prisma (optionnel)

---

## Acceptance Criteria

- [ ] Service `posts.service.ts` utilise Prisma au lieu du tableau en mémoire
- [ ] Méthode `getAll()` utilise `prisma.post.findMany()`
- [ ] Méthode `getById(id)` utilise `prisma.post.findUnique()`
- [ ] Méthode `create(data)` utilise `prisma.post.create()`
- [ ] Méthode `update(id, data)` utilise `prisma.post.update()`
- [ ] Méthode `delete(id)` utilise `prisma.post.delete()`
- [ ] Erreurs gérées : `RecordNotFound` → throw `AppError(404)`
- [ ] Les routes ne changent pas (interface reste la même)
- [ ] Les tests d'intégration passent
- [ ] `npm run start:dev` lance sans erreur
- [ ] Les données persistent après redémarrage du serveur

---

## Details techniques

### Avant (in-memory)

```typescript
const posts = new Map<number, Post>();

export function getById(id: number) {
  return posts.get(id) || null;
}
```

### Après (Prisma)

```typescript
import { prisma } from '../database/prisma.service';

export async function getById(id: number) {
  return await prisma.post.findUnique({
    where: { id },
    include: { author: true }, // optionnel, pour avoir l'user
  });
}
```

### Tous les CRUD Prisma

```typescript
// CREATE
const post = await prisma.post.create({
  data: {
    title: "...",
    content: "...",
    authorId: userId, // doit avoir un auteur
  },
});

// READ ALL
const posts = await prisma.post.findMany();

// READ ONE
const post = await prisma.post.findUnique({
  where: { id },
});

// UPDATE
const updated = await prisma.post.update({
  where: { id },
  data: { title: "..." }, // modifie seulement si fourni
});

// DELETE
await prisma.post.delete({
  where: { id },
});

// DELETE (safe, retourne null si pas trouvé)
const deleted = await prisma.post.findUnique({ where: { id } });
if (!deleted) throw new AppError(404, 'Post not found');
await prisma.post.delete({ where: { id } });
```

### Gestion d'erreurs Prisma

```typescript
import { Prisma } from '@prisma/client';

try {
  const post = await prisma.post.create({
    data: { ... },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint failed
    }
    if (error.code === 'P2025') {
      // Record not found
    }
  }
  throw error;
}
```

### Les routes ne changent pas

```typescript
// Avant et après : même signature
router.post('/posts', async (req, res, next) => {
  try {
    const result = CreatePostSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    // Ici c'est maintenant async/await Prisma
    const post = await postsService.create(result.data);
    
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});
```

---

## Points clés

- Les méthodes du service deviennent `async`
- Utiliser `await` avant chaque appel Prisma
- `findUnique()` retourne `null` si pas trouvé (pas throw)
- `delete()` throw si pas trouvé (vérifier avant)
- Les routes doivent être `async` si elles utilisent `await`

---

## Validation

```bash
npm run start:dev

# Test 1: CREATE (d'abord créer un User, sinon authorId invalide)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"author@example.com","name":"Author"}'
# Response: { id: 1, email: "author@example.com", name: "Author" }

# Test 2: CREATE POST (avec l'auteur créé)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","authorId":1}'
# Response: { id: 1, title: "Hello", content: "World", authorId: 1, createdAt: "..." }

# Test 3: READ ALL
curl http://localhost:3000/posts
# Response: [{ id: 1, ... }]

# Test 4: READ ONE
curl http://localhost:3000/posts/1
# Response: { id: 1, ... }

# Test 5: UPDATE
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'
# Response: { id: 1, title: "Updated", ... }

# Test 6: DELETE
curl -X DELETE http://localhost:3000/posts/1

# Test 7: READ non-existent
curl http://localhost:3000/posts/999
# Response: 404

# Test 8: Vérifier persistence (restart le serveur)
npm run start:dev
curl http://localhost:3000/posts
# Devrait afficher les posts créés
```
