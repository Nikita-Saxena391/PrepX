"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // ✅ Ensure user exists (fixes your crash)
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    const clerk = await currentUser();

    user = await db.user.create({
      data: {
        clerkUserId: userId,
        name: `${clerk?.firstName ?? ""} ${clerk?.lastName ?? ""}`.trim(),
        imageUrl: clerk?.imageUrl,
        email: clerk?.emailAddresses?.[0]?.emailAddress,
      },
    });
  }

  try {
    const result = await db.$transaction(
      async (tx) => {
        // 1. Check industry insight
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // 2. Generate if missing
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ),
            },
          });
        }

        // 3. Update user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 40000,
      }
    );

    revalidatePath("/");
    return result.updatedUser; // ✅ FIXED (was result.user ❌)
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  return {
    isOnboarded: !!user?.industry,
  };
}
