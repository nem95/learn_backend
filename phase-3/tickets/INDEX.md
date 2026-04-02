# Tickets Phase 3 : Async & Background Jobs (Semaines 7-8)

## 📋 Liste des Tickets

### Semaine 7-8 : Queues & Jobs

| Ticket | Titre | Difficulté |
|--------|-------|-----------|
| P3-01 | Setup Bull + Redis queues | 🟡 Moyen |
| P3-02 | Email job (welcome email) | 🟡 Moyen |
| P3-03 | Trigger email job au register | 🟡 Moyen |
| P3-04 | Email job (comment notification) | 🟡 Moyen |
| P3-05 | Retry logic et gestion d'erreurs | 🟡 Moyen |
| P3-06 | Export PDF job | 🟠 Difficile |
| P3-07 | Job status endpoint | 🟡 Moyen |
| P3-08 | Tests des jobs (mock queues) | 🟡 Moyen |

---

## 🎯 Vue d'ensemble

- Queues Bull pour les jobs asynchrones
- Email asynchrone avec Nodemailer
- Export PDF en background
- Retry logic avec backoff exponentiel
- Job status visible pour l'utilisateur

---

## 📊 Progression

**Total : 8 tickets à compléter**

- [ ] Setup des queues : P3-01
- [ ] Jobs d'email : P3-02, P3-03, P3-04
- [ ] Robustesse : P3-05, P3-06
- [ ] UI et tests : P3-07, P3-08

---

## 💡 Notes

- Chaque job doit avoir un retry strategy
- Tests : mock la queue, pas la vraie Redis
- Nodemailer en dev peut utiliser MailHog

**Phase complète →** Prêt pour NestJS + Microservices (Phase 4)
