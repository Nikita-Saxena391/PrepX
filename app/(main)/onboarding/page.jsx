export default async function OnboardingPage() {
  let isOnboarded = false;

  try {
    const res = await getUserOnboardingStatus();
    isOnboarded = res?.isOnboarded;
  } catch (error) {
    console.log("Onboarding status error:", error);
    isOnboarded = false;
  }

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}
