# Tickets Phase 4 : NestJS + Microservices (Semaines 9-13)

## 📋 Liste des Tickets

### Semaine 9 : Transition NestJS

| Ticket | Titre | Difficulté |
|--------|-------|-----------|
| P4-01 | Setup NestJS project | 🟢 Facile |
| P4-02 | Auth Module (refactor Express) | 🟡 Moyen |
| P4-03 | Posts Module (refactor Express) | 🟡 Moyen |
| P4-04 | Comments Module (refactor Express) | 🟡 Moyen |
| P4-05 | Migrer les jobs Bull (NestJS) | 🟡 Moyen |
| P4-06 | Tests NestJS (Jest + Supertest) | 🟡 Moyen |

### Semaines 10-12 : Microservices

| Ticket | Titre | Difficulté |
|--------|-------|-----------|
| P4-07 | API Gateway (NestJS) | 🟡 Moyen |
| P4-08 | Auth Service (microservice) | 🟠 Difficile |
| P4-09 | Posts Service (microservice) | 🟠 Difficile |
| P4-10 | Users Service (microservice) | 🟡 Moyen |
| P4-11 | Notifications Service (microservice) | 🟠 Difficile |
| P4-12 | Communication inter-services (TCP) | 🟠 Difficile |
| P4-13 | Event-driven (Redis pub/sub) | 🟠 Difficile |
| P4-14 | Service discovery basique | 🟡 Moyen |

### Semaine 13 : Production-ready

| Ticket | Titre | Difficulté |
|--------|-------|-----------|
| P4-15 | Dockerifier chaque service | 🟡 Moyen |
| P4-16 | Docker Compose local dev | 🟡 Moyen |
| P4-17 | Health checks endpoints | 🟢 Facile |
| P4-18 | Structured logging (Pino) | 🟡 Moyen |
| P4-19 | GitHub Actions CI/CD | 🟠 Difficile |
| P4-20 | Déployer sur Railway/Render | 🟠 Difficile |

---

## 🎯 Vue d'ensemble

### Semaine 9 : Apprendre NestJS
- Refactoriser le code Express en code NestJS
- Comprendre : Modules, Controllers, Services, Guards, Pipes

### Semaines 10-12 : Découper en microservices
- 1 API Gateway + 4 services indépendants
- Chaque service a sa propre BD
- Communication sync (TCP) et async (Redis)

### Semaine 13 : Production
- Docker par service
- Orchestration local avec Docker Compose
- Déploiement complet

---

## 📊 Progression

**Total : 20 tickets à compléter**

- [ ] **Semaine 9** : 6 tickets (monolithe NestJS)
- [ ] **Semaines 10-12** : 8 tickets (découper en 5 services)
- [ ] **Semaine 13** : 6 tickets (Docker + deployment)

---

## 🏗️ Architecture finale

```
┌──────────────────────┐
│    API Gateway       │  Port 3000
│  (HTTP routes)       │
└──────────┬───────────┘
           │ TCP / Redis
    ┌──────┼────┬──────┬──────────┐
    ▼      ▼    ▼      ▼          ▼
┌──────┐ ┌────┐ ┌────┐ ┌────────┐
│Auth  │ │Sts │ │Users│ │Notifs  │
│3001  │ │3002│ │3003 │ │ 3004   │
└──────┘ └────┘ └────┘ └────────┘
  own    own    own      own
   DB     DB     DB       DB
```

---

## 💡 Tips

- Phase 9 : NestJS peut sembler lourd au début, c'est juste des abstractions
- Phases 10-12 : Microservices = compliquent. Garder simple!
- Phase 13 : Docker est obligatoire pour la scalabilité
- Production : Utiliser une stratégie d'env vars robuste

**Après Phase 4 →** Fullstack complet! 🚀
