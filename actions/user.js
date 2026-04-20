export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();

    // ✅ DO NOT THROW
    if (!userId) {
      return { isOnboarded: false };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Onboarding status error:", error);
    return { isOnboarded: false }; // ✅ prevent crash
  }
}
