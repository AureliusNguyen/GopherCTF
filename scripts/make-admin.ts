import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the email or Clerk ID from command line args
  const identifier = process.argv[2];

  if (!identifier) {
    console.log('📝 Usage: pnpm tsx scripts/make-admin.ts <email-or-clerk-id>');
    console.log('\nOr run without arguments to make the first user an admin:');
    console.log('   pnpm tsx scripts/make-admin.ts');

    // Make first user admin if no identifier provided
    const firstUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    if (!firstUser) {
      console.log('\n❌ No users found in database. Sign up first!');
      return;
    }

    await prisma.user.update({
      where: { id: firstUser.id },
      data: { isAdmin: true }
    });

    console.log('\n✅ Made first user an admin:');
    console.log(`   Username: ${firstUser.username}`);
    console.log(`   Email: ${firstUser.email}`);
    return;
  }

  // Try to find user by email or Clerk ID
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { clerkId: identifier },
        { username: identifier }
      ]
    }
  });

  if (!user) {
    console.log(`❌ User not found: ${identifier}`);
    console.log('\nAvailable users:');
    const allUsers = await prisma.user.findMany({
      select: { username: true, email: true, isAdmin: true }
    });
    allUsers.forEach(u => {
      console.log(`   - ${u.username} (${u.email}) ${u.isAdmin ? '👑 Admin' : ''}`);
    });
    return;
  }

  if (user.isAdmin) {
    console.log(`ℹ️  User "${user.username}" is already an admin`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isAdmin: true }
  });

  console.log('✅ User promoted to admin:');
  console.log(`   Username: ${user.username}`);
  console.log(`   Email: ${user.email}`);
  console.log('\n🔑 You can now access the admin panel at: http://localhost:3000/admin');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });