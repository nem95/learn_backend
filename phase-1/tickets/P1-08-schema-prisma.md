# P1-08 : Schema Prisma (User, Post, Comment)

**Difficulté:** 🟢 Facile  
**Dépend de:** P1-07  
**Débloque:** P1-09

---

## Description

Créer le schema Prisma avec les modèles User, Post, et Comment. Définir les relations entre les tables.

---

## Sujets à maîtriser

- Modèles Prisma
- Types de données (String, Int, Boolean, DateTime)
- Relations (1-to-many, many-to-1)
- Clés primaires et foreign keys
- Defaults et validations basiques
- Indices

---

## Acceptance Criteria

- [x] Modèle `User` créé avec champs : id, email, name
- [x] Modèle `Post` créé avec champs : id, title, content, createdAt, authorId
- [x] Modèle `Comment` créé avec champs : id, text, createdAt, postId
- [x] Relations : User.posts (1-to-many) et Post.comments (1-to-many)
- [x] `email` unique sur User
- [x] `id` auto-incrémenté pour toutes les tables
- [x] `createdAt` defaults à `now()`
- [x] Foreign keys correctes : Post.authorId → User.id, Comment.postId → Post.id
- [x] Schema valide : `npx prisma validate` pas d'erreurs

---

## Details techniques

### Schema Prisma complet

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
  
  @@map("users") // optionnel : renommer la table en BD
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
  
  author    User @relation(fields: [authorId], references: [id])
  authorId  Int
  
  comments  Comment[]
  
  @@map("posts")
}

model Comment {
  id        Int     @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now())
  
  post      Post @relation(fields: [postId], references: [id])
  postId    Int
  
  @@map("comments")
}
```

### Points clés sur les relations

- `posts Post[]` = relation inversée (un user a plusieurs posts)
- `@relation(fields: [...], references: [...])` = foreign key
- Les relations sont bidirectionnelles (User ↔ Post, Post ↔ Comment)
- Prisma génère les foreign keys automatiquement

---

## Validation

```bash
# Valider le schema
npx prisma validate
# Pas d'erreurs

# Voir l'aperçu du schema
npx prisma db push --dry-run
# Doit montrer les créations de tables

# Ne pas faire le push pour l'instant
# (on va le faire au P1-09)
```

---

## Checklist

- [x] Tous les modèles présents
- [x] Tous les champs présents
- [x] Relations correctes
- [x] `@unique` sur email
- [x] `@id @default(autoincrement())` sur tous les id
- [x] `@default(now())` sur createdAt
- [x] Schema valide
