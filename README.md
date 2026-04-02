# Backend Learning Path 🚀

> Un parcours progressif et structuré pour maîtriser le développement backend, de Express à NestJS et microservices.

---

## 👋 À propos

Je suis **Naïm**, développeur fullstack orienté **frontend** (React/Next.js) qui souhaite élargir mes compétences en **backend**. 

Ce repository est une **documentation publique** de mon parcours d'apprentissage backend — un guide structuré contenant **4 phases d'apprentissage**, **56 tickets** et **9 projets intégrés** pour explorer tous les aspects du développement backend moderne.

---

## 📚 Contenu du Repository

### 🎯 Guides Principaux

| Document | Description |
|----------|------------|
| **[START_HERE.md](./START_HERE.md)** | Point de départ — lire en premier! |
| **[FULLSTACK_GUIDE.md](./FULLSTACK_GUIDE.md)** | Vue d'ensemble du parcours complet |
| **[TICKETS_GUIDE.md](./TICKETS_GUIDE.md)** | Comment utiliser le système de tickets |
| **[PROJECT_STRUCTURE.txt](./PROJECT_STRUCTURE.txt)** | Visualisation de la structure complète |

### 📂 4 Phases d'Apprentissage

#### **Phase 1 : Fondations Express** (Semaines 1-3)
- **11 tickets** : Express Core, PostgreSQL, Prisma
- **2 projets** : Blog API in-memory → Blog API + Database
- 📖 [Voir la phase →](./phase-1/README.md)

#### **Phase 2 : Patterns Intermédiaires** (Semaines 4-6)
- **17 tickets** : Authentification, Tests, Cache & Rate Limiting
- **3 projets** : Blog API avec Auth, Tests, Performance
- 📖 [Voir la phase →](./phase-2/README.md)

#### **Phase 3 : Async & Background Jobs** (Semaines 7-8)
- **8 tickets** : Queues Redis, Email asynchrone, Jobs, Retry logic
- **1 projet** : Blog API avec notifications et exports
- 📖 [Voir la phase →](./phase-3/README.md)

#### **Phase 4 : NestJS + Microservices** (Semaines 9-13)
- **20 tickets** : Transition NestJS, Microservices, Docker, CI/CD
- **3 projets** : Monolithe NestJS → Microservices → Production
- 📖 [Voir la phase →](./phase-4/README.md)

---

## 🛠️ Technologies Apprises

### Backend Framework
```
Express.js → NestJS
(Phase 1-3)  (Phase 4)
```

### Base de Données & ORM
```
PostgreSQL + Prisma
```

### Cache & Queues
```
Redis (cache, sessions)
Bull (background jobs)
```

### Authentication & Security
```
JWT Tokens
bcrypt Password Hashing
Refresh Token Flow
```

### Testing
```
Jest (unitaires)
Supertest (intégration)
70%+ coverage
```

### DevOps & Deployment
```
Docker
Docker Compose
GitHub Actions (CI/CD)
Railway / Render (Hosting)
```

### Architecture
```
Monolithe Express
    ↓
Monolithe NestJS
    ↓
5 Microservices (Architecture distribuée)
```

---

## 📋 9 Projets Intégrés

### **Projet #1-2 : Blog API Express**
- Routes CRUD, validation, gestion d'erreurs
- Migration vers PostgreSQL + Prisma

### **Projet #3-5 : Blog API Avancée**
- Authentification JWT + bcrypt
- Tests complets (70%+ coverage)
- Cache Redis + rate limiting + pagination

### **Projet #6 : Blog API avec Notifications**
- Queues Bull pour background jobs
- Email asynchrone avec Nodemailer
- Export PDF
- Retry logic et gestion d'erreurs

### **Projet #7-9 : Architecture Microservices**
- Refactor en monolithe NestJS
- Découpe en 5 microservices indépendants
- Docker + Docker Compose + CI/CD
- Production-ready deployment

---

## 🎯 Structure des Tickets

Chaque phase contient des **tickets avec**:
- 📝 **Description claire** : ce qu'il faut faire
- 🎓 **Sujets à maîtriser** : concepts importants
- ✅ **Acceptance Criteria** : conditions de succès
- 💻 **Code examples** : implémentation suggérée
- 🧪 **Validation** : comment tester

**Format** : `PX-YY-titre.md` (ex: `P1-01-setup-express.md`)

---

## 🚀 Comment Utiliser Ce Repository

### 1. **Commence par le guide de démarrage**
```bash
cat START_HERE.md
```

### 2. **Lis la vue d'ensemble**
```bash
cat FULLSTACK_GUIDE.md
```

### 3. **Ouvre une phase**
```bash
cd phase-1
cat README.md           # Concepts
cat tickets/INDEX.md    # Liste des tickets
cat tickets/P1-01-setup-express.md  # Premier ticket
```

### 4. **Fais les tickets dans l'ordre**
```bash
# Chaque ticket a des Acceptance Criteria
# Suis les étapes et valide avec curl
```

### 5. **Commit et avance**
```bash
git add .
git commit -m "P1-01: Setup Express + TypeScript"
```

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| **Phases** | 4 |
| **Tickets** | 56 |
| **Projets** | 9 |
| **Semaines** | 13 (full-time) |
| **Technologies** | 15+ |
| **Lignes de code** | 5000+ |
| **Concepts** | 50+ |

---

## 🎓 Apprentissage Progressif

```
Semaine 1-3  : Express Core
              Routes, validation, gestion d'erreurs
              ↓
Semaine 4-6  : Production Patterns
              Auth, tests, cache, rate limiting
              ↓
Semaine 7-8  : Async & Jobs
              Queues, email, background tasks
              ↓
Semaine 9-13 : Architecture Avancée
              NestJS, microservices, Docker, CI/CD
```

**Chaque semaine s'appuie sur la précédente.**

---

## 💡 Points Clés

✅ **Pas de tutoriels passifs** — Code réel, projets concrets  
✅ **Progression logique** — Chaque phase dépend de la précédente  
✅ **Tickets numérotés** — Facile de tracker la progression  
✅ **Validation incluse** — Commandes curl pour tester  
✅ **Production-ready** — Apprendre les patterns réels  
✅ **Microservices** — Architecture scalable finale  

---

## 🌱 Prérequis

- **Node.js** 18+
- **npm** ou **pnpm**
- **Git** (pour les commits)
- **Docker** (pour Phase 4)
- **PostgreSQL** (Docker OK)
- Basics de **TypeScript** (learned on the way)

---

## 📈 Progression Estimée

| Phase | Tickets | Durée | Projet |
|-------|---------|-------|--------|
| Phase 1 | 11 | 3 sem. | Blog API |
| Phase 2 | 17 | 3 sem. | Blog API avancée |
| Phase 3 | 8 | 2 sem. | Blog API + jobs |
| Phase 4 | 20 | 5 sem. | Microservices |
| **TOTAL** | **56** | **13 sem.** | **9 projets** |

---

## 🎯 Objectifs

### Au terme du parcours, je serai capable de :

✅ Concevoir une API REST robuste avec Express/NestJS  
✅ Utiliser une base de données avec Prisma  
✅ Implémenter l'authentification JWT + bcrypt  
✅ Écrire des tests complets (70%+ coverage)  
✅ Optimiser avec cache et rate limiting  
✅ Créer des jobs asynchrones avec Bull  
✅ Architecturer une application en microservices  
✅ Containeriser avec Docker  
✅ Mettre en place une CI/CD avec GitHub Actions  
✅ Déployer sur un serveur (Railway/Render)  

---

## 🔗 Ressources Utilisées

### Documentation Officielle
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [NestJS](https://docs.nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Bull Queues](https://github.com/OptimalBits/bull)
- [Docker](https://docs.docker.com/)

### Concepts
- [JWT.io](https://jwt.io/)
- [Microservices Patterns](https://microservices.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Suivi de Progression

Chaque phase a un `INDEX.md` où je peux cocher les tickets complétés :

```markdown
- [x] P1-01 : Setup Express
- [x] P1-02 : Routes de base
- [ ] P1-03 : Routes détail
- ...
```

---

## 🎉 Après le parcours

Une fois les 56 tickets complétés, je serai un **développeur fullstack authentique** capable de :
- Concevoir une architecture backend complète
- Gérer toutes les couches (API, DB, Cache, Jobs, Deployment)
- Prendre en charge un projet backend de A à Z
- Contribuer efficacement sur des projets existants

---

## 📝 License

Ce repository est public et à titre éducatif. Libre d'être utilisé comme référence pour apprendre le backend.

---

## 🚀 Commençons!

**[👉 START_HERE.md](./START_HERE.md)** pour débuter  
**[📚 FULLSTACK_GUIDE.md](./FULLSTACK_GUIDE.md)** pour la vue d'ensemble  
**[🎫 TICKETS_GUIDE.md](./TICKETS_GUIDE.md)** pour les détails

---

**Made by Naïm** — Frontend Dev leveling up to Fullstack 💪  
Last updated: April 2026
