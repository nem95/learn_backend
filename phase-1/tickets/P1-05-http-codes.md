# P1-05 : Codes HTTP corrects

**Difficulté:** 🟢 Facile  
**Dépend de:** P1-04  
**Débloque:** P1-06

---

## Description

Ajouter les codes HTTP corrects pour chaque type de réponse. Les clients (et les tests) s'appuient sur les codes HTTP pour savoir si l'opération a réussi ou échoué.

---

## Sujets à maîtriser

- Les codes HTTP standards (200, 201, 204, 400, 401, 404, 500)
- Quand utiliser quel code
- `res.status(code)` pour définir le code
- Différence entre 200 et 201, 204 et 200
- Différence entre 400, 401, 403, 404

---

## Acceptance Criteria

- [x] `GET /posts` retourne 200 (OK)
- [x] `GET /posts/:id` (trouvé) retourne 200 (OK)
- [x] `GET /posts/:id` (pas trouvé) retourne 404 (Not Found)
- [x] `POST /posts` (succès) retourne 201 (Created)
- [x] `POST /posts` (invalid) retourne 400 (Bad Request)
- [x] `PATCH /posts/:id` (succès) retourne 200 (OK)
- [x] `PATCH /posts/:id` (invalid) retourne 400 (Bad Request)
- [x] `PATCH /posts/:id` (pas trouvé) retourne 404 (Not Found)
- [x] `DELETE /posts/:id` (succès) retourne 204 (No Content) ou 200
- [x] `DELETE /posts/:id` (pas trouvé) retourne 404 (Not Found)
- [x] Codes testables avec curl : `curl -w "%{http_code}\n"`

## Validation de la code review

✅ **VALIDÉ** - 2026-04-05

Tous les codes HTTP sont correctement implémentés. Points d'apprentissage à explorer pour la prochaine itération : cohérence du nommage des variables (singulier/pluriel), expliciter les codes 200 par défaut pour la clarté, et réfléchir aux cas limites dans la gestion des erreurs (ordre de priorité des conditions).

---

## Details techniques

### Codes HTTP standards

| Code | Sens | Utilisation |
|------|------|-------------|
| 200 | OK | GET succès, PATCH succès |
| 201 | Created | POST succès (nouvelle ressource créée) |
| 204 | No Content | DELETE succès (pas de body à retourner) |
| 400 | Bad Request | Validation échouée, données invalides |
| 401 | Unauthorized | Auth échouée (on verra plus tard) |
| 403 | Forbidden | Pas de permission (on verra plus tard) |
| 404 | Not Found | Ressource n'existe pas |
| 500 | Server Error | Erreur serveur non gérée |

### Code Express

```typescript
// GET succès
res.status(200).json(post);
// ou simplement
res.json(post); // 200 par défaut

// POST succès
res.status(201).json(post);

// DELETE succès (pas de body)
res.status(204).send();

// Erreur validation
res.status(400).json({ error: "..." });

// Pas trouvé
res.status(404).json({ error: "Post not found" });
```

---

## Points clés

- 201 pour POST (création)
- 204 pour DELETE (pas de contenu à retourner)
- 200 par défaut dans Express (ne pas oublier de le préciser pour clarté)
- Les erreurs doivent toujours avoir un code 4xx (client) ou 5xx (serveur)

---

## Validation

```bash
npm run start:dev

# Test les codes HTTP avec -w "%{http_code}\n"

# Test 1: GET /posts → 200
curl -w "%{http_code}\n" http://localhost:3000/posts

# Test 2: POST /posts (succès) → 201
curl -w "%{http_code}\n" -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World"}'

# Test 3: GET /posts/:id (valide) → 200
curl -w "%{http_code}\n" http://localhost:3000/posts/1

# Test 4: GET /posts/:id (invalide) → 404
curl -w "%{http_code}\n" http://localhost:3000/posts/999

# Test 5: POST /posts (invalid) → 400
curl -w "%{http_code}\n" -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":""}'

# Test 6: DELETE /posts/:id (succès) → 204
curl -w "%{http_code}\n" -X DELETE http://localhost:3000/posts/1

# Test 7: DELETE /posts/:id (pas trouvé) → 404
curl -w "%{http_code}\n" -X DELETE http://localhost:3000/posts/999
```

Tous les codes doivent correspondre à la table ci-dessus.
