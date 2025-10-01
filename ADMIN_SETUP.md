# Admin User Setup Guide

## Accessing Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Or if using Vercel's Supabase integration: https://supabase.com/dashboard/project/aekxodfzyatfxydhpync

2. **Navigate to Table Editor**
   - Click "Table Editor" in the left sidebar
   - Select the "User" table

## Making a User Admin

### Option 1: Via Supabase Dashboard (Recommended)
1. In Table Editor → User table
2. Find the user you want to make admin
3. Click on the row to edit
4. Change `isAdmin` from `false` to `true`
5. Click "Save"

### Option 2: Via SQL Editor
1. Go to "SQL Editor" in Supabase dashboard
2. Run this query (replace email with actual admin email):

```sql
UPDATE "User"
SET "isAdmin" = true
WHERE email = 'admin@example.com';
```

### Option 3: Create Admin Script (For Local Testing)
Create a file `scripts/makeAdmin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    });
    console.log(`✅ User ${user.email} is now an admin`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Replace with your email
makeAdmin('your-email@example.com');
```

Run with: `npx tsx scripts/makeAdmin.ts`

## Verifying Admin Access

1. **Sign in to the CTF platform** with the admin account
2. **Check for admin panel** - You should see:
   - `/admin` link in navigation
   - Admin dashboard at `/admin`
   - User management at `/admin/users`
   - Challenge management at `/admin/challenges`

## Admin Capabilities

Once admin, you can:
- ✅ View all users and teams
- ✅ Disable/enable users and teams
- ✅ Create new challenges
- ✅ Edit existing challenges
- ✅ Toggle challenge visibility
- ✅ View submission history
- ✅ Manage categories

## Database Schema Reference

The `User` table has these admin-related fields:
- `isAdmin` (Boolean) - Admin status
- `disabled` (Boolean) - Account disabled status
- `clerkId` (String) - Clerk authentication ID
- `email` (String) - User email

## Troubleshooting

If admin panel doesn't show after setting `isAdmin = true`:
1. Sign out and sign back in
2. Clear browser cache
3. Check that the database change was saved
4. Verify the email matches exactly