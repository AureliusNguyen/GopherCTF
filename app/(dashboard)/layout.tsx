import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Flag, Trophy, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GopherHack CTF</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/challenges">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Target className="h-4 w-4" />
                  Challenges
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </nav>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

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
