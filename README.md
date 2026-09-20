# Travel CRM Frontend

A React + Vite frontend for a travel business CRM. The app provides secure login, role-aware access, dashboard views, employee and role management, lead tracking, and an email builder workflow.

## Overview

This project is the client application for a travel CRM platform. It connects to a backend API for authentication and business data, and is designed for internal staff to manage operations such as:

- user authentication and session handling
- dashboard overview for signed-in users
- employee management
- role and permission-based access
- lead tracking
- email composition and campaign workflows
- public acceptance flow using a tokenized route

## Tech Stack

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- JavaScript (ES modules)

## Features

- Secure login screen with email/password flow
- Protected routes and public routes
- Role-based permission checks through the auth context
- Dashboard with user role and permission summary
- Employees page for team management
- Roles page for access control
- Leads page for sales pipeline management
- Email builder page for outbound communication
- Public acceptance page for token-based access: `/accept/:token`
- Session-based auth storage using `sessionStorage`

## Project Structure

```bash
src/
├── api/              # API client wrappers for backend endpoints
├── components/       # Reusable UI and guard components
├── context/          # Auth context and app-wide auth state
├── hooks/            # Custom hooks like useAuth
├── layouts/          # Shared page layout such as dashboard shell
├── pages/            # Feature pages
├── routes/           # Route configuration
├── utils/            # Auth helpers and permission utilities
├── App.jsx           # Entry app component
├── main.jsx          # React bootstrap
├── index.css         # Global styles
└── ...
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ or 20+
- npm
- A backend API that exposes the expected auth and CRM endpoints

## Environment Configuration

Create a `.env` or `.env.local` file in the project root and define the backend base URL:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

This value is required because the frontend client reads it from `import.meta.env.VITE_API_BASE_URL`.

> The frontend expects a backend service such as `/auth/login` and `/auth/me` to exist.

## Installation

```bash
git clone https://github.com/NarutoCRM/travel-crm-frontend.git
cd travel-crm-frontend
npm install
```

## Running the App

### Local development

```bash
npm run dev
```

The app will usually run at:

```bash
http://localhost:5173
```

### Using Docker

This project includes a Docker Compose setup:

```bash
docker compose up --build
```

The frontend service is configured to run on port `5173`.

## Available Scripts

```bash
npm run dev     # start the Vite development server
npm run build   # generate a production build
npm run preview # preview the production build locally
npm run lint    # run the configured linter
```

## Routing

The app has the following main routes:

- `/login` - sign in page
- `/dashboard` - default dashboard after login
- `/employees` - employee management
- `/roles` - role and permission management
- `/leads` - leads workspace
- `/emails` - email builder
- `/accept/:token` - public acceptance link
- `/` and any unmatched routes redirect to `/dashboard`

## Authentication Behavior

The app uses a session-based token and user payload stored in `sessionStorage`:

- `travel_crm_token`
- `travel_crm_user`

The AuthContext loads the user on startup and redirects unauthenticated users away from protected routes.

## Notes

This repository appears to be the frontend portion of a larger Travel CRM system. The backend is not included here, so to run the app successfully you need the corresponding API service. The frontend is wired for a standard REST API and expects a working authentication backend to provide user and permission data.

## License

This project does not currently include a license file. If needed, add a license before publishing or sharing the codebase.
