"use client";

import { CheckCircle2, Trophy, XCircle, ArrowLeft } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
  if (!result) return null;

  return (
    <div className="mx-auto">
      {/* Back Button */}
      <Link href="/tools/ai-assessments">
        <Button variant="link" className="gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments Dashboard
        </Button>
      </Link>

      {/* Score Section */}
      <div className="flex justify-center items-center m-4 gap-2">
        <div className="flex items-center gap-2 text-xl sm:text-3xl font-bold">
          <Trophy className="h-8 w-8 text-yellow-500" />
          You Scored:
        </div>

        <div className="text-2xl sm:text-4xl font-bold text-green-600">
          {result.quizScore?.toFixed(1)}%
        </div>
      </div>

      <CardContent>
        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-black p-4 rounded-lg m-4">
            <div className="text-lg font-semibold text-yellow-500 mb-2">
              Improvement Tip
            </div>
            <div className="text-green-600 font-semibold">
              {result.improvementTip}
            </div>
          </div>
        )}

        {/* Questions Review */}
        <div className="bg-muted/50 rounded-sm p-4 m-2">
          <div className="text-2xl sm:text-3xl font-medium text-center mt-3">
            Questions Review
          </div>

          {result.questions?.map((q, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-2 m-3 bg-black"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-red-400">
                  <span className="text-red-300">Question:</span>{" "}
                  {q.question}
                </div>

                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                )}
              </div>

              <div>
                <div>
                  <span className="text-yellow-300">Your answer:</span>{" "}
                  {q.userAnswer}
                </div>

                {!q.isCorrect && (
                  <div>
                    <span className="text-green-300">Correct answer:</span>{" "}
                    {q.answer}
                  </div>
                )}
              </div>

              <div className="text-sm bg-gray-950 p-2 rounded">
                <div className="font-medium text-green-300">
                  Explanation:
                </div>
                <p>{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Start New Quiz Button */}
      {!hideStartNew && (
        <div className="flex justify-center mt-6">
          <Button onClick={onStartNew}>
            Start New Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizResult;