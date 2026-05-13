<div align="center">

# DropIt

**Portal de feedback corporativo para priorizar el desarrollo de producto.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.16.0-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![NextAuth](https://img.shields.io/badge/NextAuth-4.24.7-7C3AED?style=flat-square&logo=auth0&logoColor=white)](https://next-auth.js.org)
[![AWS S3](https://img.shields.io/badge/AWS_S3-SDK_3.600-FF9900?style=flat-square&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose)

</div>

---

## Overview

DropIt is a corporate feedback portal where employees submit feature requests, vote on ideas, and track progress through a development lifecycle. Duplicate detection runs in real-time to keep feedback organized. Access is restricted to corporate accounts via Azure AD.

See [`docs/`](./docs) for domain-specific documentation.

---

## Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Azure AD app registration
- AWS S3 bucket

### Environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL=postgresql://dropit:dropit_secret@localhost:5432/dropit

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

### Local development

```bash
# Start the database
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
npm install

# Apply migrations and seed
npm run db:migrate
npm run db:seed

# Start dev server
npm run dev
```

App available at `http://localhost:3000`.

### Production

```bash
docker compose up -d
```

Migrations run automatically on startup via the `migrate` service.

### Database utilities

```bash
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:migrate    # Run pending migrations
npm run db:push       # Push schema changes without a migration file
npm run db:studio     # Open Prisma Studio
npm run db:seed       # Seed initial data
```
