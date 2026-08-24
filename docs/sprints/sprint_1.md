# Sprint 5 Summary: Project Foundation

* **Objective:** Establish the technical foundation, development environment, and CI pipeline for the **CineVerse** cinema booking system (business logic such as authentication and booking has not been implemented yet).
* **Monorepo Architecture:** Utilised **Turborepo** and **npm workspaces** to manage `apps` (`web`, `api`) alongside shared `packages` (`ui`, `eslint-config`, `typescript-config`).
* **Frontend & Backend:**
  * **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui (port 3000).
  * **Backend:** Node.js, Express.js, TypeScript, Prisma (port 4000).
* **Containerisation & Database:** 
  * Docker & Docker Compose run 3 services synchronously: Frontend, Backend API, and PostgreSQL (port 5432).
  * Supports seamless switching between Local PostgreSQL (Docker) and Cloud PostgreSQL (Supabase) via environment variables.
* **CI/CD & Version Control:** 
  * Configured a basic **GitHub Actions** pipeline to automatically install dependencies and verify builds on push/PR.
  * Verified successful production builds for both frontend and backend applications.
  * Marked sprint completion with version tag **`v0.5.0`**.

## 1. Sprint Overview

Sprint 5 focused on establishing the technical foundation of the CineVerse cinema booking system.

The main objective was to prepare a consistent development environment, establish the frontend and backend applications, introduce containerisation using Docker, and configure a basic Continuous Integration (CI) pipeline.

This sprint focused on infrastructure and development foundations rather than implementing business features such as authentication or ticket booking.

---

## 2. Sprint Objectives

The main objectives of Sprint 5 were:

- Establish the frontend application using Next.js and TypeScript.
- Establish the backend API using Express.js and TypeScript.
- Configure the project as a Turborepo monorepo.
- Configure npm workspaces for dependency management.
- Configure Docker for local development.
- Containerise the frontend and backend applications.
- Run PostgreSQL locally using Docker.
- Configure Docker Compose for local services.
- Establish a basic GitHub Actions CI pipeline.
- Verify that the applications can be built successfully.

---

## 3. Project Structure

The project uses a monorepo structure:

```text
CineVerse
├── apps
│   ├── web
│   └── api
│
├── packages
│   ├── ui
│   ├── eslint-config
│   └── typescript-config
│
├── docs
│
├── .github
│   └── workflows
│       └── ci.yml
│
├── Dockerfile.api
├── Dockerfile.web
├── docker-compose.yml
├── .dockerignore
├── package.json
└── turbo.json
```

The `web` application provides the frontend while the `api` application provides the backend API.

---

## 4. Frontend Foundation

The frontend was established using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

The frontend can be built using:

```bash
npm run build
```

The production build was successfully generated during this sprint.

---

## 5. Backend Foundation

The backend was established using:

- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL

The API includes a basic server structure and health-check route.

The backend can be built using:

```bash
npm run build
```

The TypeScript compilation completed successfully.

---

## 6. Monorepo Configuration

Turborepo was used to manage the frontend, backend, and shared packages within a single repository.

The root project provides commands such as:

```bash
npm run dev
npm run build
npm run lint
npm run check-types
```

During this sprint, the main focus was on the development and build foundation.

---

## 7. Docker Implementation

Docker was introduced to provide a consistent local development environment.

The following services were containerised:

- Frontend
- Backend API
- PostgreSQL

The project uses:

- `Dockerfile.web`
- `Dockerfile.api`
- `docker-compose.yml`

Docker Compose is used to run the local services together.

The local environment was successfully verified with:

```bash
docker compose ps
```

The services were successfully running on:

- **Web:** `localhost:3000`
- **API:** `localhost:4000`
- **PostgreSQL:** `localhost:5432`

---

## 8. Database Strategy

PostgreSQL was configured for local development using Docker.

A cloud PostgreSQL database using Supabase is also available for later development and deployment.

The application uses environment variables for database configuration, allowing the database connection to be changed between environments without changing the application code.

**Strategy Overview:**

```text
Local development  ──> Local PostgreSQL
Production         ──> Supabase PostgreSQL
```

This approach allows the database provider to be changed without modifying the application's database logic.

---

## 9. Continuous Integration

A basic GitHub Actions CI workflow was introduced.

**Workflow Pipeline:**

```text
Push / Pull Request
        ↓
Checkout repository
        ↓
Setup Node.js
        ↓
Setup npm
        ↓
Install dependencies
        ↓
Build project
```

The workflow is located at:

- `.github/workflows/ci.yml`

The CI pipeline verifies that the project can be installed and built successfully in a clean GitHub Actions environment.

---

## 10. Build Verification

The project was tested locally using:

```bash
npm run build
```

The build completed successfully for both applications:

- `api#build` → **successful**
- `web#build` → **successful**

The Next.js production build also completed successfully.

---

## 11. Development Workflow

The development workflow established during this sprint is:

```text
Developer
    ↓
Local development
    ↓
Docker Compose
    ↓
Web + API + PostgreSQL
    ↓
Git commit
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Install dependencies
    ↓
Build
    ↓
CI result
```

This provides a foundation for adding application features in later sprints.

---

## 12. Version Control

Sprint 5 was completed and recorded as:

**`v0.5.0`**

The tag represents the stable state of the project at the end of the Project Foundation sprint. Future sprints will create additional version tags.

---

## 13. Sprint Outcome

Sprint 5 successfully established the technical foundation of CineVerse.

**Summary of deliverables:**

- Frontend application
- Backend API
- TypeScript configuration
- Turborepo monorepo
- npm workspace
- Docker configuration
- Local PostgreSQL environment
- Docker Compose
- GitHub repository
- GitHub Actions CI
- Successful local production build

No major cinema business logic was implemented in this sprint. The foundation is now ready for subsequent development of authentication, authorization, movie management, showtimes, seat management, booking, payment, and other system features.
```