import { getAssessments } from "@/actions/interview";
import StatsCards from "../../../components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "@/components/QuizList";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="relative min-h-screen">
      {/* Grid background */}
      <div className="grid-background fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 space-y-6 p-6">
        <div className="flex items-center justify-center mb-5">
          <h1 className="text-6xl font-bold gradient-title text-center">
            Performance Dashboard
          </h1>
        </div>

        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}