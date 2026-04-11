export default async function OnboardingPage() {
  let isOnboarded = false;

  try {
    const res = await getUserOnboardingStatus();
    isOnboarded = res?.isOnboarded;
  } catch (err) {
    console.error("onboarding check failed:", err);
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
