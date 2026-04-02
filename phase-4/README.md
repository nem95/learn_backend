# Phase 4 : NestJS + Microservices (Semaines 9-13)

## Objectif
Passer d'une API monolithe Express à une architecture microservices avec NestJS.

**👉 [Voir les TICKETS →](./tickets/INDEX.md)**

---

## Semaine 9 : Transition vers NestJS

### À apprendre
Comprendre que NestJS est juste une abstraction du code Express qu'on a écrit.

| Concept Express | Concept NestJS | Rôle |
|-----------------|----------------|------|
| Middleware d'auth | Guard (@UseGuards) | Protéger les routes |
| Middleware Zod | Pipe (@UsePipes) | Valider les données |
| Router + logique métier | Controller + Service | Traiter les requêtes |
| Organisation manuelle | Module (@Module) | Organiser le code |
| try/catch global | Exception Filter | Gérer les erreurs |
| Injection manuelle | Dependency Injection | Déclarr les dépendances |

### **Projet #7 : Monolithe NestJS**

#### Étapes
1. **Créer un nouveau projet NestJS**
   ```bash
   npm i -g @nestjs/cli
   nest new blog-api
   cd blog-api
   ```

2. **Installer les dépendances nécessaires**
   ```bash
   npm install @prisma/client prisma
   npm install bcrypt jsonwebtoken
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt
   npm install bull @nestjs/bull
   npm install nodemailer
   ```

3. **Refactoriser le projet #5 Express en NestJS**
   - Créer modules : AuthModule, PostsModule, CommentsModule
   - Créer services pour la logique métier
   - Créer controllers pour les routes
   - Créer guards pour l'authentification
   - Créer pipes pour la validation
   - Créer les queues Bull avec NestJS

4. **Vérifier que tout marche pareil**
   ```bash
   npm run start:dev
   ```

#### Structure NestJS
```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── filters/
│       └── http-exception.filter.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── posts/
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── dto/
│   │   ├── create-post.dto.ts
│   │   └── update-post.dto.ts
│   └── entities/
│       └── post.entity.ts
├── comments/
│   ├── comments.module.ts
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   └── dto/
│       └── create-comment.dto.ts
├── jobs/
│   ├── email/
│   │   ├── email.module.ts
│   │   └── email.processor.ts
│   └── export/
│       ├── export.module.ts
│       └── export.processor.ts
└── database/
    └── prisma.service.ts
```

#### Exemple : Auth Module

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Exporter pour les autres modules
})
export class AuthModule {}

// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) throw new UnauthorizedException();
    
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      refreshToken: '...',
    };
  }
}

// auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() { email, password }) {
    return this.authService.register(email, password);
  }

  @Post('login')
  login(@Body() { email, password }) {
    return this.authService.login(email, password);
  }
}
```

#### Dépendances
```json
{
  "dependencies": {
    "@nestjs/common": "^10.x",
    "@nestjs/core": "^10.x",
    "@nestjs/jwt": "^12.x",
    "@nestjs/passport": "^10.x",
    "@nestjs/bull": "^10.x",
    "@prisma/client": "^5.x",
    "passport-jwt": "^4.x",
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x",
    "bull": "^4.x",
    "nodemailer": "^6.x"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.x",
    "@nestjs/testing": "^10.x",
    "jest": "^29.x",
    "supertest": "^6.x",
    "ts-jest": "^29.x"
  }
}
```

---

## Semaines 10-12 : Microservices

### À apprendre
- Communication entre services
- API Gateway pattern
- Event-driven architecture avec Redis pub/sub
- Service discovery basique

### **Projet #8 : Blog en Microservices**

#### Architecture cible

```
┌────────────────────────────────┐
│      API Gateway (NestJS)      │
│  (port 3000)                   │
│  - Routes + Middleware global  │
└──────────┬─────────────────────┘
           │
    ┌──────┼─────┬──────────┬──────────┐
    │      │     │          │          │
    ▼      ▼     ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌──────────┐
│Auth    │ │Posts │ │Users   │ │Notifs    │
│Service │ │Serv. │ │Service │ │Service   │
│3001    │ │3002  │ │ 3003   │ │ 3004     │
└────────┘ └──────┘ └────────┘ └──────────┘
   │         │         │         │
   └─────────┴─────────┴─────────┘
      Each: own DB + own Redis
```

#### Services à créer

**1. API Gateway** (port 3000)
- Route vers les microservices
- Middleware d'authentification global
- Logging, monitoring

**2. Auth Service** (port 3001)
- Register, login, refresh token
- Validate token (appelé par les autres services)
- Génère les JWT

**3. Posts Service** (port 3002)
- CRUD posts
- Cache Redis
- Appelle Auth Service pour valider le token
- Émet un event "post.created" quand un post est créé

**4. Users Service** (port 3003)
- Profils utilisateurs
- Préférences

**5. Notifications Service** (port 3004)
- Reçoit les events des autres services
- Envoie les emails

#### Communication

**Synchrone (HTTP/TCP):**
```
API Gateway → Auth Service.validateToken()
Posts Service → Auth Service.validateToken()
```

**Asynchrone (Redis pub/sub):**
```
Posts Service emit("post.created", { postId, userId })
  ↓
Notifications Service receive("post.created")
  ↓
Send email notification
```

#### Créer les services NestJS

```bash
# Créer chaque service en tant que projet NestJS séparé
nest new services/auth-service
nest new services/posts-service
nest new services/users-service
nest new services/notifications-service

# Et une API Gateway
nest new api-gateway
```

#### Structure au niveau du projet

```
blog-microservices/
├── package.json (workspace root)
├── api-gateway/
│   ├── src/
│   │   ├── main.ts
│   │   └── app.module.ts
│   └── package.json
├── services/
│   ├── auth/
│   │   ├── src/
│   │   └── package.json
│   ├── posts/
│   │   ├── src/
│   │   └── package.json
│   ├── users/
│   │   ├── src/
│   │   └── package.json
│   └── notifications/
│       ├── src/
│       └── package.json
└── docker-compose.yml
```

#### Exemple : API Gateway

```typescript
// api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
      {
        name: 'POSTS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
    ]),
  ],
})
export class AppModule {}
```

#### Exemple : Service Client dans API Gateway

```typescript
// api-gateway/src/posts/posts.controller.ts
import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('posts')
export class PostsController {
  constructor(@Inject('POSTS_SERVICE') private postsService: ClientProxy) {}

  @Get()
  async getPosts() {
    // Appel au Posts Service
    return this.postsService.send('get_posts', {});
  }

  @Post()
  async createPost(@Body() body) {
    // Appel au Posts Service
    return this.postsService.send('create_post', body);
  }
}
```

#### Exemple : Service recevant les appels

```typescript
// services/posts/src/posts.controller.ts
import { Controller, MessagePattern } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private postsService: PostsService) {}

  @MessagePattern('get_posts')
  async getPosts() {
    return this.postsService.findAll();
  }

  @MessagePattern('create_post')
  async createPost(data) {
    return this.postsService.create(data);
  }
}
```

#### Redis pub/sub entre services

```typescript
// services/posts/src/posts.service.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostsService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(data) {
    const post = await this.prisma.post.create({ data });
    
    // Émettre un event
    this.eventEmitter.emit('post.created', { postId: post.id, userId: post.authorId });
    
    return post;
  }
}
```

```typescript
// services/notifications/src/notifications.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  @OnEvent('post.created')
  async handlePostCreated(payload: any) {
    console.log('A new post was created:', payload);
    // Envoyer une notification email
  }
}
```

---

## Semaine 13 : Dockeriser et Déployer

### À apprendre
- Docker per service
- Docker Compose pour dev local
- GitHub Actions CI/CD
- Health checks
- Structured logging

### **Dockerfication**

#### Dockerfile pour un service NestJS

```dockerfile
# services/posts/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
```

#### Docker Compose (dev local)

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - auth-service
      - posts-service
      - users-service
      - notifications-service

  auth-service:
    build: ./services/auth
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:secret@postgres:5432/auth
      - NODE_ENV=development
    depends_on:
      - postgres

  posts-service:
    build: ./services/posts
    ports:
      - "3002:3002"
    environment:
      - DATABASE_URL=postgresql://postgres:secret@postgres:5432/posts
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis

  users-service:
    build: ./services/users
    ports:
      - "3003:3003"
    environment:
      - DATABASE_URL=postgresql://postgres:secret@postgres:5432/users
      - NODE_ENV=development
    depends_on:
      - postgres

  notifications-service:
    build: ./services/notifications
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=development
    depends_on:
      - redis

volumes:
  postgres_data:
```

#### Lancer localement

```bash
docker-compose up
# Attendre que tous les services soient prêts
curl http://localhost:3000/posts
```

#### GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: secret
      redis:
        image: redis:7

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test
      - run: npm run build
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Push images to Docker Hub
        run: |
          docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
          docker-compose push
```

---

## Checklist Phase 4 ✅

### Semaine 9 : Transition NestJS
- [ ] Nouveau projet NestJS créé
- [ ] Modules Auth, Posts, Comments créés
- [ ] Toutes les routes fonctionnent
- [ ] Tests passent
- [ ] Même fonctionnalités qu'Express

### Semaines 10-12 : Microservices
- [ ] 5 services créés (API Gateway + 4 services)
- [ ] Chaque service a sa propre BD
- [ ] API Gateway route vers les services
- [ ] Auth Service peut valider les tokens
- [ ] Posts Service émet un event
- [ ] Notifications Service reçoit l'event
- [ ] Tous les tests passent

### Semaine 13 : Dockerisation
- [ ] Chaque service a un Dockerfile
- [ ] Docker Compose démarre tout
- [ ] GitHub Actions lance les tests
- [ ] GitHub Actions build et push les images
- [ ] Tous les services ont un `/health` endpoint
- [ ] Logs structurés avec Pino
- [ ] Déployé sur Railway ou Render

---

## Tips

1. **Commencer monolithe NestJS d'abord** — Apprendre NestJS avant les microservices
2. **Microservices = compliquent** — Garder simple au début, diviser progressivement
3. **Service discovery** — Hardcoder les hosts en dev, utiliser Consul/Eureka en prod
4. **Monitoring** — Chaque service doit logger et rapporter sa health
5. **Testing** — Mock les appels entre services dans les tests
6. **Database per service** — Chaque service a sa propre BD (ou partagée au début)

---

## Ressources

- NestJS : https://docs.nestjs.com/
- Microservices NestJS : https://docs.nestjs.com/microservices/basics
- Docker : https://docs.docker.com/
- Docker Compose : https://docs.docker.com/compose/
- GitHub Actions : https://docs.github.com/en/actions
- Event Emitter : https://docs.nestjs.com/techniques/events
