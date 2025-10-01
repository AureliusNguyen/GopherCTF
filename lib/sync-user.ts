import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function syncUser() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    // Create or update user
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          username: clerkUser.username || clerkUser.firstName || "User",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          // Check if user is admin from Clerk public metadata
          isAdmin: clerkUser.publicMetadata?.isAdmin === true || false,
        },
      });
    } else {
      // Update user info from Clerk (in case it changed)
      user = await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || user.email,
          username: clerkUser.username || clerkUser.firstName || user.username,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          // Update admin status from Clerk metadata
          isAdmin: clerkUser.publicMetadata?.isAdmin === true || user.isAdmin,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}