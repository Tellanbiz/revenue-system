# Revenue System - Environment Configuration

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/revenue_system"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production-make-it-at-least-32-characters"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="another-random-secret-for-nextauth-sessions"
```

## Setting up the Database

1. Install PostgreSQL and create a database named `revenue_system`
2. Update the `DATABASE_URL` with your connection details
3. Run the migrations: `bunx drizzle-kit push`

## JWT Secret Generation

Generate a secure JWT secret:
```bash
# Using openssl
openssl rand -base64 32

# Or using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Development Setup

1. Copy the environment variables above to `.env.local`
2. Install dependencies: `bun install`
3. Generate and run migrations: `bunx drizzle-kit push`
4. Start the development server: `bun run dev`
