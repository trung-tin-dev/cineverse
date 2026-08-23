# Sprint 1 - Project Setup

## 1. Sprint Goal

The goal of Sprint 1 was to establish the basic foundation and development environment for the CineVerse cinema booking system.

## 2. Objectives

The main objectives of Sprint 1 were:

- Set up the project structure.
- Set up the frontend and backend applications.
- Configure the database.
- Configure Prisma ORM.
- Set up environment variables.
- Create the initial project documentation.
- Prepare the project for future development.

## 3. Technology Stack

The following technologies were selected and configured:

- **Next.js** - Frontend framework
- **TypeScript** - Programming language
- **Tailwind CSS** - Frontend styling
- **Express.js** - Backend API framework
- **PostgreSQL** - Database
- **Supabase** - PostgreSQL hosting
- **Prisma ORM** - Database access and management
- **Turborepo** - Monorepo management
- **npm** - Package management
- **Git and GitHub** - Version control

---

## 4. Project Structure

The project was created as a Turborepo monorepo:

```text
cineverse/
├── apps/
│   ├── api/
│   └── web/
├── packages/
├── docs/
├── package.json
└── turbo.json