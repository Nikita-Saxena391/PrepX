"use server";

import { auth } from "@clerk/nextjs/server";
import {db} from "../lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ✅ START CHAT
export async function startChat() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // find user in DB using clerkUserId
  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  // create new chat
  const chat = await db.chat.create({
    data: {
      userId: dbUser.id,
    },
  });

  // redirect to chat page
  redirect(`/ai-chat/${chat.id}`);
}

// ✅ DELETE ALL CHATS
export async function deleteAllChats() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  await db.chat.deleteMany({
    where: {
      userId: dbUser.id,
    },
  });

  revalidatePath("/ai-chat/history");

  return { success: true };
}