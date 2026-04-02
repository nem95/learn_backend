# Phase 3 : Async & Background Jobs (Semaines 7-8)

## Objectif
Apprendre à gérer les tâches asynchrones longues : email, exports, notifications avec Redis queues.

**👉 [Voir les TICKETS →](./tickets/INDEX.md)**

---

## Semaines 7-8 : Queues + Projet #6

### À apprendre
- Queues Redis avec Bull
- Jobs asynchrones
- Retry logic et gestion d'erreurs
- Email avec Nodemailer
- Production-ready async operations

### **Projet #6 : Blog API avec notifications et exports**

#### Fonctionnalités à implémenter
- ✅ Queue Bull pour les emails
- ✅ Email de bienvenue à l'inscription (job asynchrone)
- ✅ Notifications email quand quelqu'un commente (job)
- ✅ Export des posts en PDF (background job long)
- ✅ Retry logic (3 tentatives avec backoff exponentiel)
- ✅ Job status visible pour l'utilisateur

#### Structure
```
src/
├── app.ts
├── server.ts
├── types/index.ts
├── jobs/
│   ├── jobs.setup.ts          ← NEW : initialiser toutes les queues
│   ├── email.job.ts           ← NEW : jobs d'email
│   ├── export.job.ts          ← NEW : jobs d'export PDF
│   └── jobs.queue.ts          ← NEW : créer/déclarer les queues
├── auth/
│   ├── auth.router.ts         ← UPDATED : créer un job au register
│   ├── auth.service.ts
│   ├── auth.schema.ts
│   └── auth.middleware.ts
├── posts/
│   ├── posts.router.ts        ← UPDATED : ajouter export endpoint
│   ├── posts.service.ts
│   └── posts.schema.ts
├── comments/
│   ├── comments.router.ts     ← NEW
│   ├── comments.service.ts    ← NEW : créer un job de notification
│   └── comments.schema.ts     ← NEW
└── mail/
    └── mail.service.ts        ← NEW : helper pour envoyer les emails
```

#### Dépendances
```json
{
  "dependencies": {
    "bull": "^4.x",
    "nodemailer": "^6.x",
    "pdfkit": "^0.13.x"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.x"
  }
}
```

#### Routes à ajouter
```
POST   /posts/:id/comments           → créer un commentaire (protégée)
GET    /posts/:id/comments           → lister les commentaires
POST   /posts/:id/export             → créer un job d'export PDF
GET    /exports/:jobId               → status du job d'export
```

#### Exemple : Email Job

```typescript
// jobs/email.job.ts
import { Queue } from 'bull';

export const emailQueue = new Queue('email', {
  redis: { host: 'localhost', port: 6379 },
});

emailQueue.process(async (job) => {
  const { email, subject, text } = job.data;
  
  try {
    await sendEmail(email, subject, text);
    return { success: true };
  } catch (error) {
    // Bull retry automatiquement (3 fois par défaut)
    throw error;
  }
});

emailQueue.on('completed', (job) => {
  console.log(`Email sent to ${job.data.email}`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Email job failed:`, err.message);
});
```

#### Exemple : Utiliser une queue

```typescript
// auth.service.ts
async register(email: string, password: string) {
  const user = await prisma.user.create({ data: { email, password: hashedPassword } });
  
  // Créer un job d'email sans bloquer
  await emailQueue.add({
    email,
    subject: 'Welcome!',
    text: `Hi ${email}, welcome to our blog!`,
  }, {
    attempts: 3,           // Réessayer 3 fois
    backoff: {
      type: 'exponential',
      delay: 2000,         // 2 sec, 4 sec, 8 sec
    },
  });

  return user;
}
```

#### Setup des queues au démarrage

```typescript
// jobs/jobs.setup.ts
import { emailQueue } from './email.job';
import { exportQueue } from './export.job';

export function setupQueues() {
  console.log('Setting up Bull queues...');
  
  // Créer les processeurs pour chaque queue
  emailQueue.process(emailJobHandler);
  exportQueue.process(exportJobHandler);
}
```

#### Vérification
```bash
# Lancer Redis et le serveur
docker run -d -p 6379:6379 redis:latest
npm run start:dev

# Test 1: Register (déclenche un email job)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret"}'
# Attendre quelques secondes, vérifier les logs "Email sent"

# Test 2: Créer un commentaire (déclenche une notification)
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"text":"Great post!"}'

# Test 3: Exporter les posts
curl -X POST http://localhost:3000/posts/1/export \
  -H "Authorization: Bearer TOKEN"
# Response: { jobId: "...", status: "pending" }

# Test 4: Checker le status du job d'export
curl http://localhost:3000/exports/JOB_ID
# Response: { status: "completed", result: { pdf: "..." } }
```

---

## Architecture Queue

```
┌────────────────────────────────────────┐
│      Express Application               │
│    (Créer des jobs)                   │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│        Redis Queue (Bull)              │
│  ┌─────────────────────────────────┐  │
│  │ Email Queue                     │  │
│  │ - Welcome email                 │  │
│  │ - Comment notification          │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ Export Queue                    │  │
│  │ - PDF generation                │  │
│  └─────────────────────────────────┘  │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│    Job Processors                      │
│  - Process email jobs                  │
│  - Process export jobs                 │
│  - Retry on failure                    │
└────────────────────────────────────────┘
```

---

## Checklist Phase 3 ✅

### Setup
- [ ] Redis tourne en Docker
- [ ] Bull installé et configuré
- [ ] Nodemailer configuré (ou fake mail pour dev)
- [ ] Jobs setup au démarrage du serveur

### Jobs
- [ ] Job d'email de bienvenue fonctionne
- [ ] Job de notification de commentaire fonctionne
- [ ] Job d'export PDF fonctionne
- [ ] Retry logic fonctionne (test en cassant le job)
- [ ] Job status queryable

### Routes
- [ ] POST /posts/:id/comments marche
- [ ] GET /posts/:id/comments marche
- [ ] POST /posts/:id/export crée un job
- [ ] GET /exports/:jobId retourne le status

### Testing
- [ ] Tests pour les jobs (mock Redis queue)
- [ ] Tests intégration pour les endpoints qui créent des jobs

---

## Tips

1. **Redis pour Bull** — Bull stocke les jobs dans Redis
2. **Nodemailer en dev** — Utilise un transport d'emails fake ou ethereal
3. **Retry strategy** — Exponential backoff pour éviter les surcharges
4. **Job status** — Garder une trace des jobs pour l'utilisateur
5. **Error handling** — Les erreurs dans les jobs ne doivent pas crasher le serveur
6. **Testing** — Mock la queue Bull avec `bull-board` pour voir les jobs en temps réel

---

## Configuration d'exemple : Nodemailer (dev)

```typescript
// mail.service.ts
import nodemailer from 'nodemailer';

export const mailService = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'localhost',
  port: parseInt(process.env.MAIL_PORT || '1025'),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function sendEmail(email: string, subject: string, text: string) {
  return await mailService.sendMail({
    from: process.env.MAIL_FROM || 'noreply@blog.com',
    to: email,
    subject,
    text,
  });
}
```

En dev, utilise MailHog :
```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
# Voir les emails : http://localhost:8025
```

---

## Ressources

- Bull : https://github.com/OptimalBits/bull
- Nodemailer : https://nodemailer.com/
- PDF generation : https://pdfkit.org/
- MailHog : https://github.com/mailhog/MailHog
- Redis : https://redis.io/docs/
