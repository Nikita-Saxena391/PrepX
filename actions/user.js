"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();

  // ❌ was throwing → causes crash
  if (!userId) return { success: false };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  // ❌ was throwing → causes crash
  if (!user) return { success: false };

  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          // ❌ was using db instead of tx
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
        timeout: 10000,
      }
    );

    revalidatePath("/");

    // ❌ was returning result.user (doesn't exist)
    return { success: true };

  } catch (error) {
    console.error("Error updating user and industry:", error.message);

    // ❌ was throwing → crash
    return { success: false };
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();

  // ❌ was throwing → crash
  if (!userId) return { isOnboarded: false };

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);

    // ❌ was throwing → crash
    return { isOnboarded: false };
  }
}
