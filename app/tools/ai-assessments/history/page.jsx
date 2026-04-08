// pages/tools/ai-assessments/history.js
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StatsCards from "@/components/StatsCards";
import PerformanceChart from "@/components/PerformanceChart";
import QuizList from "@/components/QuizList";
import { getAssessments } from "@/actions/interview";

const Page = async () => {
  const assessments = await getAssessments();

  return (
  <div className="min-h-screen pt-20">
      <Link href={"/tools/ai-assessments"}>
        <Button variant="link" className="gap-2 pl-0 cursor-pointer m-2 text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment DashBoard
        </Button>
      </Link>

      <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent mt-5 text-center">
        Assessments History
      </h1>

      <div className="m-5">
        <StatsCards assessments={assessments} />

        <div className="container mx-auto mt-10 mb-10">
          <PerformanceChart assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  );
};

export default Page;