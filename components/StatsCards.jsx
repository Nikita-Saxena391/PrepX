import { Brain, Target, Trophy, ClipboardCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { countAssessments } from "../actions/interview";

const StatsCards = async ({ assessments }) => {
  const count = await countAssessments();
  if (!count) return null;

  const getAverageScore = () => {
    if (!assessments || !assessments.length) return 0;

    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );

    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments || !assessments.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments || !assessments.length) return 0;

    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      
      {/* Average Score */}
      <Card className="w-80 bg-black border border-blue-500/30 shadow-[0_0_25px_rgba(0,140,255,0.35)] rounded-xl m-5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-blue-300">
            Average Score
          </CardTitle>
          <Trophy className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">
            {getAverageScore()}%
          </div>
          <p className="text-xs">Across all assessments</p>
        </CardContent>
      </Card>

      {/* Questions Practiced */}
      <Card className="w-80 bg-black border border-blue-500/30 shadow-[0_0_15px_rgba(0,140,255,0.35)] rounded-xl m-5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-blue-300">
            Questions Practiced
          </CardTitle>
          <Brain className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">
            {getTotalQuestions()}
          </div>
          <p className="text-xs">Total questions</p>
        </CardContent>
      </Card>

      {/* Latest Score */}
      <Card className="w-80 bg-black border border-blue-500/30 shadow-[0_0_15px_rgba(0,140,255,0.35)] rounded-xl m-5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-blue-300">
            Latest Score
          </CardTitle>
          <Target className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">
            {getLatestAssessment()?.quizScore?.toFixed(1) || 0}%
          </div>
          <p className="text-xs">Most recent quiz</p>
        </CardContent>
      </Card>

      {/* Assessments Taken */}
      <Card className="w-80 bg-black border border-blue-500/30 shadow-[0_0_15px_rgba(0,140,255,0.35)] rounded-xl m-5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-blue-300">
            Assessments Taken
          </CardTitle>
          <ClipboardCheck className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            Aptitude Assessment:{" "}
            <span className="text-green-400 font-bold">
              {count.aptitude}
            </span>
          </p>
          <p>
            Technical:{" "}
            <span className="text-green-400 font-bold">
              {count.technical}
            </span>
          </p>
          <p>
            Core Subjects:{" "}
            <span className="text-green-400 font-bold">
              {count.core}
            </span>
          </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default StatsCards;