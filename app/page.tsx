import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag, Trophy, Users, Zap } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GopherHack CTF</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/challenges">
              <Button variant="ghost">Challenges</Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            {!userId ? (
              <>
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl cursor-default">
            Welcome to
            <span
              className="inline-block mt-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-98 cursor-default"
              style={{
                boxShadow:
                  "0 4px 16px 0 rgba(0,0,0,0.10), 0 1.5px 0 0 var(--tw-shadow-color,rgba(0,0,0,0.10))",
                transform: "perspective(600px) translateZ(0)",
              }}
            >
              GopherHack CTF
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your cybersecurity skills with challenges from beginner to
            advanced. Compete individually or in teams, climb the leaderboard,
            and prove you are a real hacker.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {!userId ? (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2 cursor-pointer">
                    <Zap className="h-4 w-4" />
                    Start Competing
                  </Button>
                </Link>
                <Link href="/challenges">
                  <Button
                    size="lg"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    View Challenges
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/challenges">
                <Button size="lg" className="gap-2 cursor-pointer">
                  <Zap className="h-4 w-4" />
                  Go to Challenges
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="transition-transform hover:-translate-y-2 cursor-default">
            <CardHeader>
              <Flag className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Diverse Challenges</CardTitle>
              <CardDescription>
                From web exploitation to cryptography, test your skills across
                multiple categories with varying difficulty levels.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-transform hover:-translate-y-2 cursor-default">
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Team or Solo <span className="text-sm text-muted-foreground">(Coming Soon)</span></CardTitle>
              <CardDescription>
                Choose to compete individually or form a team. Collaborate with
                others or go it alone to reach the top.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-transform hover:-translate-y-2 cursor-default">
            <CardHeader>
              <Trophy className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Dynamic Scoring</CardTitle>
              <CardDescription>
                Points adjust based on solve count. Be among the first to solve
                challenges for maximum points.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Active Challenges
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Categories
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Always Available
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start?</h2>
          <p className="text-lg text-muted-foreground">
            Click this unsuspicious button!
          </p>
          <div className="flex justify-center">
            <svg
              className="mx-auto animate-bounce"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          {!userId ? (
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 cursor-pointer">
                Create Your Account
              </Button>
            </Link>
          ) : (
            <Link href="/challenges">
              <Button size="lg" className="gap-2 cursor-pointer">
                <Zap className="h-4 w-4" />
                Go to Challenges
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
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
