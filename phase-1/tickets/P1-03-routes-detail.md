# P1-03 : Routes détail (GET /posts/:id, PATCH /posts/:id, DELETE /posts/:id)

**Difficulté:** 🟢 Facile  
**Dépend de:** P1-02  
**Débloque:** P1-04

---

## Description

Implémenter les routes pour récupérer, modifier, et supprimer un post spécifique par ID. Toujours pas de validation, on ajoute juste les routes.

---

## Sujets à maîtriser

- Routes avec paramètres (`app.get('/posts/:id')`)
- `req.params` pour accéder aux paramètres d'URL
- `req.body` pour accéder au corps de la requête
- Opérations CRUD de base
- Gestion des cas "not found"

---

## Acceptance Criteria

- [ ] Route `GET /posts/:id` retourne un post spécifique
- [ ] Route `GET /posts/:id` retourne une erreur si l'ID n'existe pas (500 c'est OK pour l'instant)
- [ ] Route `PATCH /posts/:id` modifie un post (partiellement ou totalement)
- [ ] Route `PATCH /posts/:id` met à jour uniquement les champs fournis dans le body
- [ ] Route `DELETE /posts/:id` supprime un post
- [ ] `GET /posts` n'affiche plus les posts supprimés
- [ ] Routes enregistrées dans le router avec `router.get()`, `router.patch()`, `router.delete()`
- [ ] `req.params.id` est extracté et converti en nombre

---

## Details techniques

### Paramètres dynamiques

```typescript
router.get('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Trouver le post avec cet ID
});
```

### Modification partielle (PATCH)

Seulement les champs fournis doivent être modifiés :
```typescript
{
  "title": "Nouveau titre"
  // content ne change pas
}
```

---

## Points clés

- Vérifier que l'ID existe avant de modifier/supprimer
- Convertir `req.params.id` en nombre (string → number)
- PATCH = modification partielle, PUT = replacement complet (PATCH suffit)
- Retourner le post modifié après une modification

---

## Validation

```bash
npm run start:dev

# Test 1: GET /posts/:id (valide)
curl http://localhost:3000/posts/1
# Response: { id: 1, title: "Hello", content: "World", createdAt: "..." }

# Test 2: GET /posts/:id (invalide)
curl http://localhost:3000/posts/999
# Response: erreur (500 OK pour l'instant, on gère plus tard)

# Test 3: PATCH /posts/:id (modifier title)
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
# Response: { id: 1, title: "Updated Title", content: "World", createdAt: "..." }

# Test 4: PATCH /posts/:id (modifier content)
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated Content"}'
# Response: { id: 1, title: "Updated Title", content: "Updated Content", createdAt: "..." }

# Test 5: DELETE /posts/:id
curl -X DELETE http://localhost:3000/posts/1

# Test 6: GET /posts (ne doit pas inclure le post supprimé)
curl http://localhost:3000/posts
# Response: [] ou [autres posts non supprimés]

# Test 7: GET /posts/:id (post supprimé)
curl http://localhost:3000/posts/1
# Response: erreur (post not found)
```
