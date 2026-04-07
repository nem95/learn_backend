# P1-06 : Middleware d'erreur global

**Difficulté:** 🟡 Moyen  
**Dépend de:** P1-05  
**Débloque:** P1-07

---

## Description

Ajouter un middleware d'erreur global pour capturer toutes les erreurs non gérées. Permet de transformer les erreurs en réponses JSON cohérentes.

---

## Sujets à maîtriser

- Erreur handling en Express
- Middleware d'erreur (4 paramètres)
- Try/catch dans les routes
- Types d'erreurs personnalisées
- Logging des erreurs
- Sécurité (ne pas exposer les stack traces en production)

---

## Acceptance Criteria

- [x] Middleware d'erreur global créé dans `src/app.ts`
- [x] Middleware positionné **après tous les autres middlewares et routes**
- [x] Erreurs levées dans les routes sont catchées par le middleware
- [x] Erreurs retournent une réponse JSON avec status et message
- [x] Stack trace loggée en console (et fichier en production)
- [x] Erreurs non gérées retournent 500 avec message générique
- [x] Erreurs prévisibles (validation, not found) retournent 400/404 avec message
- [x] Le middleware ne crash pas le serveur, il retourne une erreur HTTP
- [x] Erreurs levées dans le middleware d'erreur lui-même sont gérées
- [x] Fonction helper `AppError` créée pour les erreurs applicatives

---

## Details techniques

### Middleware d'erreur Express

```typescript
// app.ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // 4 paramètres = error middleware
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});
```

**Important:** Le middleware d'erreur doit être **le dernier** middleware/route enregistré.

### Classe d'erreur personnalisée

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Utilisation dans les routes

```typescript
router.get('/posts/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const post = postsService.getById(id);
    
    if (!post) {
      throw new AppError(404, 'Post not found');
    }
    
    res.json(post);
  } catch (error) {
    next(error); // Passe au middleware d'erreur
  }
});
```

### Ou avec async/await

```typescript
router.post('/posts', async (req, res, next) => {
  try {
    // validation, création, etc
  } catch (error) {
    next(error);
  }
});
```

---

## Points clés

- Middleware avec 4 paramètres : `(err, req, res, next)`
- `next(error)` pour passer au middleware d'erreur
- Positionner le middleware **à la fin** de l'app
- Différencier les erreurs prévisibles (AppError) des erreurs inattendues
- Ne pas exposer les stack traces en production

---

## Validation

```bash
npm run start:dev

# Test 1: Erreur gérée (not found)
curl http://localhost:3000/posts/999
# Response: 404 avec message "Post not found"

# Test 2: Validation error
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
# Response: 400 avec message de validation

# Test 3: Levée d'erreur dans le service
# Modifier le service pour lever une erreur
# Exemple: division par zéro, null pointer, etc
# Le middleware doit catch et retourner 500

# Test 4: Erreur non attendue
curl http://localhost:3000/posts/not-a-number
# Response: 400 ou 500 (dépend du handling)

# Tous les cas doivent retourner une réponse JSON valide
```

---

## Checklist du middleware

- [x] Middleware créé avec 4 paramètres
- [x] Middleware enregistré en dernier
- [x] Console.error pour logger les erreurs
- [x] Response JSON avec status et message
- [x] Stack trace visible en dev
- [x] Stack trace cachée en production
- [x] Erreurs AppError retournent leur statusCode
- [x] Erreurs inattendues retournent 500
- [x] Serveur ne crash pas

---

## ✅ Code Review - APPROUVÉ

Le ticket est **complètement implémenté** et conforme aux spécifications. Tous les acceptance criteria sont satisfaits :
- Architecture du middleware correcte
- Gestion d'erreurs robuste
- Pas d'exposition de données sensibles
- Code bien structuré avec AppError et try/catch cohérent
