# Work Note

# **Friday, May 29, 2026**

## **Initialize project with Turborepo (Next.js and Express.js)**

1. *Initialize project structure with Turborepo.*

```bash
pnpm dlx create-turbo@latest cineverse
```

2. *Create backend server with Express (TypeScript).*

```bash
pnpm add express dotenv

pnpm add -D typescript @types/express @types/node ts-node-dev
```
- Config tsconfig.json (apps/api) and package.json (turbo source).

## **Initialize Prisma ORM and connect to Neon Postgres**

*Initialize Prisma ORM*

- Install prisma @prisma/client @prisma/adapter pg

```bash
pnpm add -D prisma @prisma/client --filter api

pnpm add @prisma/adapter-pg pg --filter api
```

- Create prisma.schema and migration
```bash
model Movie {
  id        Int   @id @default(autoincrement())
  title     String
  desc      String
  director  String
  year      Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

pnpm prisma migrate dev --name init_movies

pnpm prisma generate
```

- Config PrismaClient

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

## **Basic CRUD for movies**

- Route:  api/movies
- Repository - Service - Controller - Route