import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Flag } from "lucide-react";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  category: {
    name: string;
    color: string;
  };
  difficulty: string;
  points: number;
  solveCount: number;
  solved: boolean;
}

export function ChallengeCard({
  id,
  title,
  description,
  category,
  difficulty,
  points,
  solveCount,
  solved,
}: ChallengeCardProps) {
  const difficultyColors = {
    easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  return (
    <Link href={`/challenges/${id}`}>
      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer relative">
        {solved && (
          <div className="absolute top-3 right-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}

        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                borderColor: category.color,
              }}
              className="border"
            >
              {category.name}
            </Badge>
            <Badge
              variant="outline"
              className={difficultyColors[difficulty as keyof typeof difficultyColors]}
            >
              {difficulty}
            </Badge>
          </div>

          <CardTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            {title}
          </CardTitle>

          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="font-bold text-primary">{points}</span>
              <span className="text-muted-foreground">points</span>
            </div>
            <div className="text-muted-foreground">
              {solveCount} {solveCount === 1 ? 'solve' : 'solves'}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}