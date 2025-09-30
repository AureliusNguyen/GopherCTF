# Deployment Guide for Vercel

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (see options below)
3. A Clerk account for authentication

## Database Setup

Since Vercel doesn't support SQLite, you need to use PostgreSQL. Here are three recommended options:

### Option 1: Vercel Postgres (Recommended for Vercel deployment)
1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" → Select "Postgres"
4. Follow the setup wizard
5. Copy the `DATABASE_URL` from the environment variables

### Option 2: Supabase (Free tier available)
1. Sign up at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use the "Connection string" URI)
5. Your DATABASE_URL will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Option 3: Neon (Free tier available)
1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Your DATABASE_URL will look like:
   ```
   postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
   ```

## Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (use one of the PostgreSQL options above)
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/challenges"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/challenges"
```

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables (as listed above)

3. **Initial Database Setup**
   After setting up the database and deploying:

   a. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

   b. Link to your project:
   ```bash
   vercel link
   ```

   c. Push the database schema:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   ```

   d. (Optional) Seed the database:
   ```bash
   npx tsx prisma/seed.ts
   ```

4. **Redeploy**
   - After adding environment variables, trigger a new deployment from Vercel dashboard

## Important Notes

- The build script automatically runs `prisma generate` before building
- Make sure all environment variables are set before deploying
- The first user to sign up will need to be manually set as admin in the database
- File uploads are stored locally and won't persist across deployments (consider using cloud storage like AWS S3 or Cloudinary for production)

## Troubleshooting

### "PrismaClient is not defined" error
- Ensure `DATABASE_URL` is set in Vercel environment variables
- The build script should include `prisma generate`

### "Missing publishableKey" error
- Add all Clerk environment variables to Vercel
- Ensure variable names match exactly (including the NEXT_PUBLIC_ prefix)

### Database connection errors
- Verify your PostgreSQL database is accessible
- Check that the DATABASE_URL format is correct
- Ensure SSL is configured if required (add `?sslmode=require` to the URL)