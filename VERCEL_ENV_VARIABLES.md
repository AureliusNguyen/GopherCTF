# Vercel Environment Variables

Add these environment variables in your Vercel Dashboard → Settings → Environment Variables:

## Database (Supabase PostgreSQL)

```
DATABASE_URL=postgres://postgres.aekxodfzyatfxydhpync:rwZtbtxbzgySkqMH@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

## Clerk Authentication

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dmlhYmxlLXN0dWQtOTAuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_LMArCCwYtWrIuEgQv936DSeuCMp9HLAXa2ckt8utPA
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/challenges
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/challenges
```

## Setup Complete!

✅ Database schema has been pushed to Supabase
✅ Database has been seeded with sample challenges
✅ All TypeScript errors have been fixed
✅ Build script includes Prisma generation
✅ Project is ready for deployment

## Important Notes:

1. The database is already set up with:
   - 8 categories (Web, Crypto, Forensics, Pwn, Reversing, Misc, OSINT, ML/AI)
   - 19 sample challenges
   - Dynamic scoring system ready

2. First user to sign up should be made an admin by updating the database:
   - Go to Supabase Dashboard → Table Editor → User table
   - Set `isAdmin` to `true` for the admin user

3. File uploads are stored locally in `/public/uploads` and won't persist across deployments
   - Consider using cloud storage (AWS S3, Cloudinary, or Supabase Storage) for production

4. After adding these environment variables in Vercel, trigger a new deployment