# Todo List App

A simple todo list application built with Nuxt 3, TypeScript, and PostgreSQL. This project demonstrates a full-stack setup with CRUD operations, using Drizzle ORM for database management and PrimeVue for the UI components.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Add descriptions to todos
- Dark mode UI (Aura theme)
- Responsive design with Tailwind CSS
- Real-time updates without page refresh

## Tech Stack

- **Framework**: Nuxt 3 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: PrimeVue 4
- **Styling**: Tailwind CSS 4
- **Icons**: PrimeIcons

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (or npm/yarn)

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Configuration

Create a `.env` file in the root directory and add your database connection string:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/todolist
```

Make sure to replace the connection string with your actual PostgreSQL credentials.

### 3. Run Database Migrations

Generate and apply the database schema:

```bash
# Generate migration files
pnpm db:generate

# Push schema to database (or use migrate for versioned migrations)
pnpm db:push
```

Alternatively, if you prefer versioned migrations:

```bash
pnpm db:migrate
```

### 4. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Database Management

The project uses Drizzle ORM for database operations. Here are some useful commands:

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:push` - Push schema changes directly to the database
- `pnpm db:migrate` - Run versioned migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
todolist-dockploy/
├── app/
│   ├── assets/          # Global styles
│   ├── components/      # Vue components
│   ├── composables/     # Composable functions (useTodos)
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   └── app.vue          # Root component
├── server/
│   ├── api/
│   │   └── todos/       # API endpoints (CRUD)
│   └── database/
│       ├── schema.ts     # Drizzle schema definitions
│       └── index.ts     # Database connection
├── drizzle.config.ts    # Drizzle configuration
└── nuxt.config.ts       # Nuxt configuration
```

## API Endpoints

All endpoints are prefixed with `/api/todos`:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a single todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Building for Production

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Notes

- The app uses dark mode by default (Aura theme)
- Todos are sorted by creation date (newest first)
- All API endpoints include proper error handling
- The database schema includes timestamps for `createdAt` and `updatedAt`
