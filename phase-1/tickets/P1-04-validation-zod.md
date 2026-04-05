# P1-04 : Validation avec Zod

**Difficulté:** 🟡 Moyen  
**Dépend de:** P1-03  
**Débloque:** P1-05

---

## Description

Ajouter la validation des inputs avec Zod. Les requêtes invalides doivent être rejetées avant d'atteindre la logique métier. Créer des schémas Zod pour les DTOs.

---

## Sujets à maîtriser

- Zod basics (schémas, validation)
- Créer des schemas réutilisables
- `parse()` vs `safeParse()`
- Middleware de validation
- Types TypeScript générés depuis Zod

---

## Acceptance Criteria

- [x] Fichier `src/posts/posts.schema.ts` créé avec schémas Zod
- [x] Schéma `CreatePostSchema` : title (string, min 1), content (string, min 1)
- [x] Schéma `UpdatePostSchema` : title (optional), content (optional)
- [x] Schéma `IDSchema` : id (number, positive)
- [x] Route `POST /posts` valide le body avec `CreatePostSchema`
- [x] Route `PATCH /posts/:id` valide le body avec `UpdatePostSchema`
- [x] Route `GET /posts/:id` valide l'ID avec `IDSchema`
- [x] Requête invalide retourne une erreur sans créer/modifier le post
- [x] Messages d'erreur Zod clairs (ou personnalisés)
- [x] Génération de types TypeScript depuis Zod : `type CreatePost = z.infer<typeof CreatePostSchema>`

---

## Details techniques

### Schema Zod

```typescript
import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

export const IDSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Types générés
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
```

### Utilisation dans les routes

```typescript
router.post('/posts', (req, res) => {
  const result = CreatePostSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const post = postsService.create(result.data);
  res.json(post);
});
```

---

## Points clés

- Utiliser `safeParse()` pour ne pas lever une exception (mieux pour les erreurs attendues)
- `z.coerce.number()` pour convertir les strings en nombres
- `.optional()` pour les champs optionnels
- Réutiliser les schémas (ne pas les redéfinir)

---

## Validation

```bash
npm run start:dev

# Test 1: POST /posts valide
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World"}'
# Response: { id: ..., title: "Hello", ... }

# Test 2: POST /posts invalide (title vide)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"","content":"World"}'
# Response: erreur 400 avec message Zod

# Test 3: POST /posts invalide (manque content)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello"}'
# Response: erreur 400

# Test 4: PATCH /posts/:id valide (modifie que title)
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title"}'
# Response: post modifié

# Test 5: PATCH /posts/:id invalide (title vide)
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
# Response: erreur 400

# Test 6: GET /posts/:id invalide (ID non-numérique)
curl http://localhost:3000/posts/abc
# Response: erreur 400 ou traitement du coerce
```
