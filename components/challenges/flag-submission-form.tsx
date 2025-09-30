"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Copy, Check } from "lucide-react";

interface FlagSubmissionFormProps {
  challengeId: string;
  solved: boolean;
  correctFlag?: string;
}

export function FlagSubmissionForm({ challengeId, solved, correctFlag }: FlagSubmissionFormProps) {
  const [flag, setFlag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!flag.trim()) {
      toast.error("Please enter a flag");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, flag: flag.trim() }),
      });

      const data = await response.json();

      if (data.correct) {
        if (data.isAdmin) {
          toast.success(data.message);
        } else {
          toast.success(`Correct! You earned ${data.points} points!`);
        }
        setFlag("");
        router.refresh();
      } else {
        toast.error(data.message || "Incorrect flag. Try again!");
      }
    } catch (error) {
      toast.error("Failed to submit flag. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyFlag() {
    if (correctFlag) {
      await navigator.clipboard.writeText(correctFlag);
      setCopied(true);
      toast.success("Flag copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (solved && correctFlag) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <p className="text-center text-green-500 font-medium mb-3">
            ✓ Challenge Solved!
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-sm bg-background/50 p-2 rounded border">
              {showFlag ? correctFlag : "••••••••••••••••"}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFlag(!showFlag)}
            >
              {showFlag ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyFlag}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="flag" className="text-sm font-medium">
          Submit Flag
        </label>
        <div className="flex gap-2">
          <Input
            id="flag"
            placeholder="gopher{...}"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}