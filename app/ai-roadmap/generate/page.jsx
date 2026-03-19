"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GenerateRoadmapPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Web Developer";
  const router = useRouter();

  const roadmapSteps = [
    { title: `Learn HTML/CSS for ${role}` },
    { title: `Learn JavaScript for ${role}` },
    { title: `Build Projects for ${role}` },
    { title: `Learn Frameworks for ${role}` },
    { title: `Deploy Projects for ${role}` },
    { title: `Apply for ${role} roles` },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/ai-roadmap");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black">

      {/* ✅ Background */}
      <div className="grid-background-page" />

      {/* ✅ Content */}
      <div className="flex-grow w-full px-6 pt-24 relative z-10">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-600 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Roadmap
          </button>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
          Roadmap for {role}
        </h1>

        {/* Steps */}
        <div className="flex flex-col items-center w-full space-y-8 pb-24">
          {roadmapSteps.map((step, index) => (
            <div key={index} className="w-full flex flex-col items-center">

              {/* Step Card */}
              <div className="w-full md:w-3/5 text-center py-4 rounded bg-yellow-300 text-black font-medium shadow-lg">
                {index + 1}. {step.title}
              </div>

              {/* Arrow */}
              {index < roadmapSteps.length - 1 && (
                <div className="text-3xl mt-4 text-white select-none">↓</div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}