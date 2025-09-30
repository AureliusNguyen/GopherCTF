import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateDynamicScore } from "@/lib/scoring";

async function getChallenges() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const challenges = await prisma.challenge.findMany({
    where: { visible: true },
    include: {
      category: true,
      solves: true,
      _count: {
        select: { solves: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Get user's solves if authenticated
  let userSolves: string[] = [];
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { solves: true },
    });
    userSolves = user?.solves.map((s) => s.challengeId) || [];
  }

  return { challenges, categories, userSolves };
}

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { challenges, categories, userSolves } = await getChallenges();
  const params = await searchParams;

  // Calculate dynamic points for each challenge
  const challengesWithPoints = challenges.map((challenge) => ({
    ...challenge,
    currentPoints: calculateDynamicScore(
      challenge.basePoints,
      challenge.minPoints,
      challenge._count.solves
    ),
  }));

  // Filter by category
  const selectedCategory = params.category || "all";
  const filteredChallenges =
    selectedCategory === "all"
      ? challengesWithPoints
      : challengesWithPoints.filter(
          (c) => c.category.name.toLowerCase() === selectedCategory
        );

  // Filter by search
  const searchQuery = params.search?.toLowerCase() || "";
  const searchedChallenges = searchQuery
    ? filteredChallenges.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery) ||
          c.description.toLowerCase().includes(searchQuery)
      )
    : filteredChallenges;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Challenges</h1>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue={selectedCategory} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
          <TabsTrigger value="all" asChild>
            <Link href="/challenges?category=all">All</Link>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.name.toLowerCase()}
              asChild
            >
              <Link href={`/challenges?category=${category.name.toLowerCase()}`}>
                {category.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchedChallenges.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No challenges found
              </div>
            ) : (
              searchedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  category={{
                    name: challenge.category.name,
                    color: challenge.category.color,
                  }}
                  difficulty={challenge.difficulty}
                  points={challenge.currentPoints}
                  solveCount={challenge._count.solves}
                  solved={userSolves.includes(challenge.id)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
