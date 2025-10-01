"use server";

import { syncUser } from "@/lib/sync-user";

export async function UserSync() {
  await syncUser();
  return null;
}