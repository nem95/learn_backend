# Tickets Phase 1 : Fondations Express

## 📋 Liste des Tickets

### Projet #1 : Blog API (in-memory)

| Ticket | Titre | Difficulté |
|--------|-------|-----------|
| [P1-01](./P1-01-setup-express.md) | Setup Express + TypeScript | 🟢 Facile |
| [P1-02](./P1-02-routes-base.md) | Implémenter routes de base (GET /posts, POST /posts) | 🟢 Facile |
| [P1-03](./P1-03-routes-detail.md) | Implémenter routes détail (GET/PATCH/DELETE /posts/:id) | 🟢 Facile |
| [P1-04](./P1-04-validation-zod.md) | Ajouter validation avec Zod | 🟡 Moyen |
| [P1-05](./P1-05-http-codes.md) | Codes HTTP corrects (201, 204, 400) | 🟢 Facile |
| [P1-06](./P1-06-error-handling.md) | Middleware d'erreur global | 🟡 Moyen |

### Projet #2 : Blog API + PostgreSQL

| Ticket | Titre | Difficulté |
|--------|-------|-----------|
| [P1-07](./P1-07-setup-postgres.md) | Setup PostgreSQL + Prisma | 🟡 Moyen |
| [P1-08](./P1-08-schema-prisma.md) | Créer schema Prisma (User, Post, Comment) | 🟢 Facile |
| [P1-09](./P1-09-migrations.md) | Migrations Prisma | 🟢 Facile |
| [P1-10](./P1-10-remplacer-db.md) | Remplacer in-memory par Prisma | 🟡 Moyen |
| [P1-11](./P1-11-comments.md) | Implémenter les commentaires | 🟡 Moyen |

---

## 🎯 Vue d'ensemble

**Projet #1 (Semaines 1-2):** Maîtriser Express, routing, validation, gestion d'erreurs
- Stockage en mémoire (pas de BD)
- Tous les concepts Express de base

**Projet #2 (Semaine 3):** Ajouter une vraie base de données
- PostgreSQL en Docker
- Prisma ORM
- Relations entre tables

---

## 📊 Progression

- [ ] **Projet #1** : 6 tickets (tous les tickets verts/jaunes)
- [ ] **Projet #2** : 5 tickets (tous les tickets verts/jaunes)

**Total : 11 tickets à compléter**

---

## 💡 Ordre recommandé

Faire les tickets **dans l'ordre** — chaque ticket dépend du précédent.
