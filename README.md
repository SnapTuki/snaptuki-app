# SnapTuki

SnapTuki is a comprehensive elder-care management platform designed to monitor staff tasks, ensure resident safety, and reduce operational errors within care agencies. This repository houses the complete full-stack application, utilizing a monorepo structure for both the frontend staff portal and the backend API.

---

## 1. 🏗️ Architecture & Tech Stack

SnapTuki is built using a modern JavaScript/TypeScript ecosystem and follows a strict Domain-Driven Design (DDD) architecture on the backend.

**Frontend (`apps/staff-portal`)**
* React 
* TypeScript
* Vite (Development environment)
* Architecture: Feature-matching folder structure

**Backend (`apps/api`)**
* Node.js & TypeScript
* GraphQL
* Prisma ORM (Tightly integrated with the domain layer)
* Architecture: Domain-Driven Design (DDD)

**Infrastructure & Data**
* PostgreSQL
* Redis
* Docker & Docker Compose

---

## 2. 📁 Repository Structure

```text
snaptuki/
├── apps/
│   ├── api/                # The Node.js/GraphQL backend
│   └── staff-portal/       # The React/Vite frontend UI
├── docker-compose.yml      # Master infrastructure orchestrator
└── README.md
```

# 3. 🚀 Developer Onboarding

We use Docker Compose to manage the local development environment. This ensures that the database, backend, and frontend all spin up seamlessly with hot-reloading enabled, without requiring you to install Node, Postgres, or Redis directly on your host machine.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

* Docker Desktop (Mac/Windows) or Docker Engine (Linux)
* Git

## Step 1: Initial Setup

Clone the repository to your local machine:

```bash
git clone https://github.com/SnapTuki/
cd snaptuki
```

## Step 2: Environment Variables

To keep configuration DRY, both the Backend API and the PostgreSQL database read from a single `.env` file located in the `api` directory.

Navigate to the backend folder:

```bash
cd apps/api
```

Copy the template file to create your local environment vault:

```bash
cp .env.example .env
```

Open `apps/api/.env` and ensure the database credentials match your local setup.

> **Note:** Do not commit the actual `.env` file to version control.

## Step 3: Start the Infrastructure

Return to the root directory of the project and start the Docker environment:

```bash
cd ../../  # Return to the snaptuki/ root folder
docker compose up
```

# 4. 🗄️ Database Initialization

Because Docker creates a completely fresh database instance, you need to push the Prisma schema to create the tables on your first run.

Leave the `docker compose up` terminal running, open a new terminal window, and run:

```bash
docker compose exec api npx prisma db push
```

Once the containers are running and the database is initialized, you can access the stack at the following local URLs:

| Service                 | URL                           |
| ----------------------- | ----------------------------- |
| Staff Portal (Frontend) | http://localhost:5173         |
| GraphQL API Playground  | http://localhost:4000/graphql |
| Database Access         | localhost:5432                |

For database access, use your preferred SQL client (e.g., DBeaver or TablePlus) with the credentials specified in your `.env` file.

