# Clerk + Supabase Integration Guide

## ✅ Integration Complete!

Your Clerk users are now synced with Supabase database.

## Current Status:

- **User synced:** nguy5272@umn.edu (username: madarame)
- **Admin status:** ✅ Enabled
- **Database:** Supabase PostgreSQL

## How the Integration Works:

1. **User Authentication:** Handled by Clerk
2. **User Data Storage:** Synced to Supabase database
3. **Admin Status:** Stored in Supabase `User` table

## Admin Access:

The admin user (nguy5272@umn.edu) can now access:
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/challenges` - Challenge management
- `/admin/teams` - Team management
- `/admin/categories` - Category management

## Automatic User Sync:

When users sign in through Clerk, they are automatically synced to the database via:
- `lib/sync-user.ts` - Sync function
- Profile page creates user on first visit

## Manual Sync Commands:

```bash
# Sync all Clerk users to database
npx tsx scripts/sync-clerk-users.ts

# Make a user admin by email
npx tsx scripts/make-admin.ts user@example.com

# Make a user admin by username
npx tsx scripts/make-admin.ts username
```

## Verifying in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/aekxodfzyatfxydhpync)
2. Click "Table Editor"
3. Select "User" table
4. You should see:
   - User with email: nguy5272@umn.edu
   - isAdmin: true
   - clerkId: (synced from Clerk)

## Setting Admin in Clerk (Optional):

You can also set admin status in Clerk's public metadata:
1. Go to Clerk Dashboard
2. Select your user
3. Edit public metadata:
```json
{
  "isAdmin": true
}
```

## Troubleshooting:

If admin panel doesn't show:
1. Sign out and sign back in
2. Clear browser cookies
3. Check database for user record
4. Run sync script again: `npx tsx scripts/sync-clerk-users.ts`

## Important Notes:

- First sign-in creates user in database
- Admin status is stored in Supabase, not Clerk
- User sync happens automatically on profile page visit
- Manual sync available via scripts