import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ChallengeEditForm } from "@/components/admin/challenge-edit-form";

async function getChallengeAndCategories(id: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return { challenge, categories };
}

export default async function EditChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { challenge, categories } = await getChallengeAndCategories(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Edit Challenge</h1>
        <p className="text-muted-foreground">
          Update challenge details without losing solves
        </p>
      </div>

      <ChallengeEditForm challenge={challenge} categories={categories} />
    </div>
  );
}