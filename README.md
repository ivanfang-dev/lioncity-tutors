# LionCity Tutors

LionCity Tutors is a full-featured tutoring platform built as a monorepo using Node.js, React, Tailwind CSS, and MongoDB. It consists of multiple apps, including a backend API, a web frontend, and a Telegram bot for tutor management.

---

## Table of Contents

- [Project Structure](#project-structure)  
- [Features](#features)  
- [Technologies](#technologies)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
# LionCity Tutors

LionCity Tutors is a production-ready tutoring platform (monorepo) that includes:

- a Next.js website (`apps/website`) for parents/students,
- an Express backend API (`apps/backend`) for form submission and admin tasks,
- a Telegram bot (`apps/telegram-bot`) used for tutor management and notifications,
- shared utilities packaged under `packages/shared`.

This README covers how to run and develop the project locally, environment variables, and troubleshooting tips.

## Table of contents

- [Quick start](#quick-start)
- [Repository structure](#repository-structure)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Environment variables](#environment-variables)
- [Common scripts](#common-scripts)
- [Local development](#local-development)
- [Building & deployment](#building--deployment)


## Quick start

Prerequisites:

- Node.js 18+ (or the version you use for Next 14)
- npm 9+ (this repo uses npm workspaces)
- A MongoDB Atlas URI or local MongoDB instance

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/lioncity-tutors.git
cd lioncity-tutors
npm run install:all
```

2. Create environment files (see next section for required variables).

3. Start the website or backend independently (examples below) or run both in parallel.


## Repository structure

Top-level layout (important folders):

- `apps/`
	- `website/` — Next.js (app router) site (frontend)
	- `backend/` — Express API used for contact forms and admin tasks
	- `telegram-bot/` — Telegram bot code and API wrappers
- `packages/`
	- `shared/` — utilities/constants shared between apps
- `package.json` — workspace scripts (run dev/build across workspaces)


## Features

- Parent-facing Next.js website with forms for tutor requests
- Backend API for storing leads and basic admin endpoints
- Telegram bot integration for tutors and assignment workflows
- Tailwind CSS + GSAP + Framer Motion for UI and animations


## Tech stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion, GSAP
- Backend: Node.js, Express, Mongoose (MongoDB)
- Bot: node-telegram-bot-api
- Monorepo: npm Workspaces


## Environment variables

For local development, create `.env` files in the root and/or specific app folders. Example variables used across the repo:

- `MONGODB_URI` — MongoDB connection string (used by backend and bot)
- `PORT` — backend port (optional; defaults to 4000)
- `BOT_TOKEN` — Telegram bot token (used by `apps/telegram-bot`)
- `ADMIN_USERS` — comma-separated Telegram user IDs with admin access
- `NODE_ENV` — development/production

Important: Do NOT commit real credentials. Add `.env` to `.gitignore` (already present).

Example `.env` (do not commit):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lioncity?retryWrites=true&w=majority
PORT=4000
# For telegram bot
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
ADMIN_USERS=123456789
```


## Common scripts (root)

From the repo root you can use workspace-aware scripts defined in `package.json`:

- `npm run dev:website` — run Next.js website in dev mode (runs `apps/website` `dev` script)
- `npm run dev:backend` — run Express backend in dev mode (runs `apps/backend` `dev` script)
- `npm run dev:bot` — run telegram bot (if configured)
- `npm run dev:all` — runs website + backend concurrently (requires `concurrently`)
- `npm run build` — builds the website workspace (`apps/website`)
- `npm run start:backend` — start backend (production-like)

You can also cd into each app and use its own scripts, for example:

```bash
cd apps/website
npm run dev

cd ../../apps/backend
npm run dev
```


## Local development

1. Install deps (done earlier):

```bash
npm run install:all
```

2. Run the website:

```bash
npm run dev:website
# or, from apps/website
cd apps/website && npm run dev
```

3. Run the backend (in another terminal):

```bash
npm run dev:backend
```

4. (Optional) Run both concurrently:

```bash
npm run dev:all
```

Notes:

- The website is Next.js app router — pages are under `apps/website/src/app`.
- The backend listens on `PORT` (defaults in code to 4000). Make sure `MONGODB_URI` is set before starting.


## Building & deployment

- To build the Next.js website for production from the repo root:

```bash
npm run build
```

- To start the backend for production:

```bash
npm run start:backend
```

Deployment notes:

- The website can be deployed to Vercel or any platform supporting Next.js.
- The backend requires a Node host and a MongoDB Atlas (or compatible) connection string.
- For the Telegram bot, set `BOT_TOKEN` and run it in a process manager (PM2, systemd) or host it on a server that can reach Telegram.
