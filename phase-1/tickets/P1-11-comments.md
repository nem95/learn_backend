# P1-11 : Implémenter les commentaires

**Difficulté:** 🟡 Moyen  
**Dépend de:** P1-10  
**Débloque:** Phase 2 ✅

---

## Description

Ajouter les routes pour créer et lister les commentaires sur les posts. Les commentaires sont des entités enfants des posts.

---

## Sujets à maîtriser

- Routes imbriquées (nested routes)
- Relations parent-enfant avec Prisma
- `include` pour charger les relations
- Validation des commentaires
- Codes HTTP pour les ressources enfants

---

## Acceptance Criteria

- [ ] Fichier `src/comments/comments.service.ts` créé
- [ ] Fichier `src/comments/comments.router.ts` créé
- [ ] Fichier `src/comments/comments.schema.ts` créé (validation Zod)
- [ ] Route `POST /posts/:id/comments` crée un commentaire
- [ ] Route `GET /posts/:id/comments` liste les commentaires du post
- [ ] Validation : texte du commentaire obligatoire (min 1 char)
- [ ] Codes HTTP corrects (201 pour CREATE, 200 pour LIST, 404 si post pas trouvé)
- [ ] Commentaires incluent le `createdAt` timestamp
- [ ] Erreur si on commente un post qui n'existe pas (404)
- [ ] Les commentaires persistent en BD

---

## Details techniques

### Routes

```
POST   /posts/:id/comments        → Créer un commentaire
GET    /posts/:id/comments        → Lister les commentaires
```

### Schema Zod

```typescript
export const CreateCommentSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
});

export type CreateComment = z.infer<typeof CreateCommentSchema>;
```

### Service

```typescript
import { prisma } from '../database/prisma.service';
import { AppError } from '../utils/errors';

export async function createComment(postId: number, text: string) {
  // Vérifier que le post existe
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  // Créer le commentaire
  return await prisma.comment.create({
    data: {
      text,
      postId,
    },
  });
}

export async function getCommentsForPost(postId: number) {
  // Vérifier que le post existe
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  // Récupérer les commentaires
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
  });
}
```

### Router

```typescript
import { Router } from 'express';
import { CreateCommentSchema } from './comments.schema';
import * as commentsService from './comments.service';

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/', async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const comments = await commentsService.getCommentsForPost(postId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.post('/', async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    
    const result = CreateCommentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const comment = await commentsService.createComment(postId, result.data.text);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});
```

### Enregistrement dans app.ts

```typescript
import { commentsRouter } from './comments/comments.router';

// ...
app.use('/posts/:id/comments', commentsRouter);
```

---

## Points clés

- `mergeParams: true` pour accéder à `:id` du parent
- Vérifier l'existence du post avant de créer/lister les commentaires
- `orderBy: { createdAt: 'desc' }` pour trier par récent d'abord
- Routes imbriquées : `/posts/:id/comments` pour bien montrer la relation

---

## Validation

```bash
npm run start:dev

# Setup : créer un user et un post
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"author@example.com","name":"Author"}'
# Response: { id: 1, ... }

curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","authorId":1}'
# Response: { id: 1, ... }

# Test 1: GET /posts/:id/comments (vide)
curl http://localhost:3000/posts/1/comments
# Response: []

# Test 2: POST /posts/:id/comments
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"text":"Great post!"}'
# Response: { id: 1, text: "Great post!", postId: 1, createdAt: "..." }

# Test 3: POST second commentaire
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"text":"Thanks!"}'
# Response: { id: 2, text: "Thanks!", postId: 1, createdAt: "..." }

# Test 4: GET /posts/:id/comments (avec commentaires)
curl http://localhost:3000/posts/1/comments
# Response: [{ id: 2, ... }, { id: 1, ... }] (ordre récent d'abord)

# Test 5: POST sur post non-existent → 404
curl -X POST http://localhost:3000/posts/999/comments \
  -H "Content-Type: application/json" \
  -d '{"text":"Comment"}'
# Response: 404 "Post not found"

# Test 6: GET comments sur post non-existent → 404
curl http://localhost:3000/posts/999/comments
# Response: 404 "Post not found"

# Test 7: POST commentaire vide → 400
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"text":""}'
# Response: 400 avec erreur validation
```

---

## 🎉 Phase 1 Complète!

Une fois P1-11 fini, tu as :
- ✅ Express avec routing et middlewares
- ✅ Validation avec Zod
- ✅ Gestion d'erreurs global
- ✅ PostgreSQL et Prisma
- ✅ Relations (User → Posts → Comments)
- ✅ API CRUD complète

**Prêt pour la Phase 2 : Authentification et Tests!**
