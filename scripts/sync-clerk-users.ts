// Run with: npx tsx scripts/sync-clerk-users.ts

import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function syncAllClerkUsers() {
  try {
    console.log('🔄 Syncing Clerk users with database...\n');

    // Get all users from Clerk
    const clerkUsers = await clerkClient.users.getUserList();

    console.log(`Found ${clerkUsers.data.length} users in Clerk\n`);

    for (const clerkUser of clerkUsers.data) {
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const username = clerkUser.username || clerkUser.firstName || 'User';

      // Check if user is admin (you can set this in Clerk Dashboard under user's public metadata)
      const isAdmin = clerkUser.publicMetadata?.isAdmin === true || false;

      // Check if user exists in database
      let user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });

      if (!user) {
        // Create user
        user = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email,
            username,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
            isAdmin,
          },
        });
        console.log(`✅ Created user: ${email} (Admin: ${isAdmin})`);
      } else {
        // Update user
        user = await prisma.user.update({
          where: { clerkId: clerkUser.id },
          data: {
            email,
            username,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
            isAdmin,
          },
        });
        console.log(`📝 Updated user: ${email} (Admin: ${isAdmin})`);
      }
    }

    console.log('\n✨ All users synced successfully!');

    // Show admin users
    const adminUsers = await prisma.user.findMany({
      where: { isAdmin: true },
      select: { email: true, username: true },
    });

    if (adminUsers.length > 0) {
      console.log('\n👑 Admin users:');
      adminUsers.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.username})`);
      });
    } else {
      console.log('\n⚠️  No admin users found. Set isAdmin in Clerk public metadata or database.');
    }

  } catch (error) {
    console.error('❌ Error syncing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
syncAllClerkUsers();