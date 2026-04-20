"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const updateUser = async (data) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await db.user.update({
      where: { clerkId: userId },
      data: {
        industry: data.industry,
        experience: data.experience,
        skills: data.skills,
        bio: data.bio,
        isOnboarded: true, // 🔥 IMPORTANT
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateUser error:", error);
    return { success: false, message: error.message };
  }
};
