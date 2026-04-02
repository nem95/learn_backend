# P1-01 : Setup Express + TypeScript

**Difficulté:** 🟢 Facile  
**Dépend de:** Rien  
**Débloque:** P1-02

---

## Description

Initialiser un projet Node.js avec Express et TypeScript configurés correctement. Créer le fichier principal du serveur qui démarre et écoute sur le port 3000.

---

## Sujets à maîtriser

- Package.json et npm
- TypeScript configuration (tsconfig.json)
- Express basics (import, app creation)
- Middleware global (`app.use()`)
- Port listening et logging

---

## Acceptance Criteria

- [ ] Dossier `projet-1/` créé avec `package.json`
- [ ] Dépendances installées : `express`, `zod`, `dotenv`, et dev deps (`typescript`, `@types/express`, `@types/node`, `tsx`)
- [ ] `tsconfig.json` configuré correctement
- [ ] Fichier `src/app.ts` crée et exporte une app Express configurée
- [ ] Fichier `src/server.ts` crée le serveur et écoute sur le port 3000
- [ ] Script `npm run start:dev` lance le serveur avec `tsx watch`
- [ ] Script `npm run start` lance le serveur en production
- [ ] Middleware global : `express.json()` et logging (console.log ou simple logger)
- [ ] Serveur démarre sans erreurs : `npm run start:dev`
- [ ] Message de confirmation dans la console : "Server running on port 3000"

---

## Details techniques

### Package.json structure
```
{
  "name": "blog-api-project-1",
  "version": "1.0.0",
  "type": "module" ou "commonjs" (à toi de choisir),
  "scripts": {
    "start": "tsx src/server.ts",
    "start:dev": "tsx watch src/server.ts"
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

### Dossier à créer
```
projet-1/
├── src/
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

---

## Points clés

- Les types TypeScript doivent être corrects (`Express.Application`)
- Ne pas oublier les import/export
- `tsx watch` recharge automatiquement à chaque changement
- Vérifier que le port 3000 est disponible

---

## Validation

```bash
cd projet-1
npm install
npm run start:dev
# Devrait afficher: "Server running on port 3000"

# Tester dans un autre terminal
curl http://localhost:3000
# N'importe quelle réponse est OK (404 c'est normal)
```
