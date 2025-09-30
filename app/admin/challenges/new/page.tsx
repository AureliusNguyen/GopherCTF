import { prisma } from "@/lib/db";
import { ChallengeCreateForm } from "@/components/admin/challenge-create-form";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return categories;
}

export default async function NewChallengePage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Challenge</h1>
        <p className="text-muted-foreground">
          Add a new challenge to the platform
        </p>
      </div>

      <ChallengeCreateForm categories={categories} />
    </div>
  );
}