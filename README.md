# Project Planner

A simple project planning tool built with Next.js and SQLite.

## Features

- Create and manage multiple projects
- Add tasks with team-specific codes (e.g., FOO-123)
- Visual timeline with weekly view
- Color-coded tasks by team
- Today's date indicator
- Persistent storage using SQLite

## Prerequisites

- Node.js 18 or later
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-planner
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```bash
DATABASE_URL=planner.db
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/lib` - Database and utility functions
- `/src/utils` - Helper functions and logger

## Database Schema

### Projects
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- created_at (DATETIME)

### Tasks
- id (INTEGER PRIMARY KEY)
- project_id (INTEGER)
- title (TEXT)
- code (TEXT)
- start_date (DATE)
- end_date (DATE)
- created_at (DATETIME) 