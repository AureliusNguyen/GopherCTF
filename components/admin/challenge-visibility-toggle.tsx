"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ChallengeVisibilityToggleProps {
  challengeId: string;
  initialVisible: boolean;
  title: string;
}

export function ChallengeVisibilityToggle({
  challengeId,
  initialVisible,
  title,
}: ChallengeVisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleToggle(checked: boolean) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/challenges/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId, visible: checked }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setIsVisible(checked);
      toast.success(`${title} is now ${checked ? "visible" : "hidden"}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update visibility");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Switch
      checked={isVisible}
      onCheckedChange={handleToggle}
      disabled={isLoading}
    />
  );
}