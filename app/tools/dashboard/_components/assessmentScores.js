// src/components/AssessmentScores.js
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function AssessmentScores({ assessments }) {
  // Group assessments by type
  const categories = {};

  assessments.forEach((a) => {
    const type = a.type || "general";
    if (!categories[type]) {
      categories[type] = [];
    }
    categories[type].push(a.quizScore);
  });

  // Calculate average scores for each type
  const scores = Object.entries(categories).map(([type, arr]) => {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return { type, avg };
  });

  return (
    <Card
      className="bg-black
      border border-blue-500/30
      shadow-[0_0_10px_rgba(0,140,255,0.35)]
      rounded-xl"
    >
      <CardHeader>
        <CardTitle className="text-yellow-300 text-2xl">
          Assessment Scores
        </CardTitle>
        <CardDescription>
          Snapshot of your average scores by assessment type.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {scores.length > 0 ? (
          <div className="space-y-2 text-base">
            {scores.map((s) => (
              <div
                key={s.type}
                className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
              >
                {s.type === "core" && <span>Core Subjects:</span>}
                {s.type === "aptitude" && <span>Aptitude:</span>}
                {s.type === "technical" && <span>Technical:</span>}
                {!["core", "aptitude", "technical"].includes(s.type) && (
                  <span className="capitalize">{s.type}:</span>
                )}

                <span className="font-semibold text-green-400">
                  {s.avg.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300">
            No scores yet. Take your first assessment and this section will
            start tracking your progress.
          </p>
        )}
      </CardContent>
    </Card>
  );
}