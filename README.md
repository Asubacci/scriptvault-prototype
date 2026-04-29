# ScriptVault Prototype

ScriptVault is a clickable prototype for a screenplay ecosystem web app covering:

- Marketplace for production-ready screenplays
- Script coverage and marketplace eligibility
- Screenplay generation
- Producer early access / demand capture
- Member and admin dashboard concepts
- About and contact pages

## Run Locally

```powershell
npm.cmd run serve
```

Open:

```text
http://localhost:4173
```

You can also open a section directly:

```text
http://localhost:4173/#producers
http://localhost:4173/#coverage
http://localhost:4173/#generator
```

## Verify

```powershell
npm.cmd run verify
```

This runs:

- JavaScript syntax checks
- ESLint
- Prettier format check
- Playwright smoke test

## Current Architecture

This is currently a static prototype using HTML, CSS, modular JavaScript, and a tiny local Node server.

Production recommendation:

- Frontend/app framework: Next.js
- Database: PostgreSQL
- ORM/migrations: Prisma
- Background jobs: Redis + BullMQ
- File storage: S3-compatible storage
- AI workflows: queued workers for script coverage, screenplay generation, PDF creation, and cover image generation

## Important Status

The prototype demonstrates user flows and product direction. It does not yet include real authentication, database persistence, payments, file uploads, script analysis, screenplay generation, or production deployment.
