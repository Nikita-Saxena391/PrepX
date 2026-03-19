"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";

export default function AiRoadmapPage() {
  const [username, setUsername] = useState("there");

  // Example: load username from localStorage or your auth system
  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) setUsername(savedName.split(" ")[0]);
  }, []);

  const generateRoadmap = () => {
    // Replace with your roadmap generation logic
    alert("Roadmap generation triggered!");
  };

  return (
    <div className="min-h-screen px-6 pt-24 bg-background">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/ai-career-dashboard">
          <button className="flex items-center gap-2 pl-0 text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center mt-6">
        <h1 className="text-6xl md:text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          AI Career Roadmap Generator
        </h1>
        <p className="mt-4 text-md md:text-2xl font-medium text-gray-400 max-w-3xl mx-auto">
          Generate a personalized step-by-step roadmap to achieve your dream career using the power of AI.
        </p>
      </div>

      {/* Roadmap section */}
      <div className="text-center mt-10">
        <div className="inline-flex flex-col md:flex-row items-center gap-5 bg-gray-200/30 px-6 py-6 rounded-2xl">

          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/ai-roadmap.png"
              width={600}
              height={400}
              alt="AI Career Roadmap Generator Preview"
              className="rounded-2xl object-cover"
            />
          </div>

          {/* CTA */}
          <div className="max-w-md text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">
              Hi <span className="text-blue-500">{username}</span> 👋
            </h1>
            <p className="text-gray-500 mb-6">
              Your career journey starts here. Generate a smart roadmap and discover exactly what to learn next.
            </p>

            {/* Generate roadmap button */}
            <button
              onClick={generateRoadmap}
              className="w-full md:w-auto text-lg py-4 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition-all mb-4"
            >
              Generate Roadmap
            </button>

            {/* History link */}
            <Link href="/ai-roadmap/history">
              <button className="w-full md:w-auto text-lg py-4 px-6 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-all flex items-center justify-center gap-2">
                <History className="h-5 w-5" /> View Roadmap History
              </button>
            </Link>

            <span className="inline-block mt-4 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              AI-Generated Career Roadmaps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}