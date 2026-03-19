"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Route } from "lucide-react";

export default function AiRoadmapPage() {
  const [username, setUsername] = useState("there");
  const [role, setRole] = useState("");
  const router = useRouter();

  useState(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) setUsername(savedName.split(" ")[0]);
  }, []);

  const generateRoadmap = () => {
    if (!role.trim()) return alert("Please enter a role or career!");
    router.push(`/ai-roadmap/generate?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="min-h-screen px-6 md:px-10 lg:px-20 pt-24 bg-background">
      
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <button className="flex items-center gap-2 pl-0 text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          AI Career Roadmap Generator
        </h1>
        <p className="mt-4 text-md md:text-2xl font-medium text-gray-400 max-w-3xl mx-auto">
  Hi {username}! Enter your desired career role and get a personalized, step-by-step roadmap powered by AI.
</p>
      </div>

      {/* Input + Button */}
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter role (e.g., Web Developer, Data Scientist)"
          className="border border-gray-400 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ✅ Styled Button with Roadmap Icon */}
        <button
          onClick={generateRoadmap}
          className="
            inline-flex items-center justify-center
            px-5 py-2.5 rounded-xl font-semibold
            bg-gradient-to-r from-red-600 to-pink-600
            text-white shadow-lg shadow-red-500/30
            hover:from-red-500 hover:to-pink-500
            hover:shadow-red-500/45
            active:scale-[0.97]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
          "
        >
          <Route className="h-4 w-4 mr-2" />
          Generate Roadmap
        </button>
      </div>
    </div>
  );
}