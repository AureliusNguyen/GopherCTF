import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Shield, Target, Users, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user?.isAdmin) {
    redirect("/challenges");
  }

  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-destructive/10 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-destructive" />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/admin/challenges">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Target className="h-4 w-4" />
                  Challenges
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <FolderTree className="h-4 w-4" />
                  Categories
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Users
                </Button>
              </Link>
              <Link href="/admin/teams">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Teams
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/challenges">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 GopherHack CTF made by{" "}
            <a
              href="https://www.linkedin.com/in/aurelius-nguyen/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Aurelius Nguyen
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}