import { redirect } from "next/navigation";
import { getResume } from "@/actions/resume";
import { getUserOnboardingStatus } from "@/actions/user";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  // ✅ GET STATUS FIRST
  const { isOnboarded } = await getUserOnboardingStatus();

  // ✅ THEN CHECK
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // ✅ THEN FETCH RESUME
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
