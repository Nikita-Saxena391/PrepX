"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Route, Clock } from "lucide-react";

export default function AiRoadmapPage() {
  const router = useRouter();
  const [username, setUsername] = useState("there");
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) setUsername(savedName.split(" ")[0]);
  }, []);

  // ✅ FIXED FUNCTION
  const generateRoadmap = () => {
    if (!role.trim()) return alert("Please enter a role!");

    let fixedRole = role.trim();

    // 🔥 Handle vague inputs
    if (fixedRole.toLowerCase() === "full stack") {
      fixedRole = "Full Stack Developer";
    }

    // 🔥 Optional smarter handling
    if (fixedRole.toLowerCase().includes("full stack")) {
      fixedRole = "Full Stack Developer";
    }

    router.push(
      `/ai-roadmap/generate?role=${encodeURIComponent(fixedRole)}`
    );
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-10 lg:px-20 bg-background flex flex-col gap-6">
      
      {/* Top Buttons */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </Link>

        <Link href="/roadmap-history">
          <button className="
            inline-flex items-center gap-2 px-5 py-2.5 
            rounded-xl font-semibold 
            bg-gradient-to-r from-yellow-300 to-yellow-200 
            text-black shadow-lg shadow-yellow-300/30
            hover:from-yellow-200 hover:to-yellow-100 hover:shadow-yellow-300/40
            active:scale-[0.97] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2
          ">
            <Clock className="h-4 w-4" />
            View History
          </button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          AI Career Roadmap Generator
        </h1>
        <p className="mt-4 text-md md:text-xl font-medium text-gray-400 max-w-3xl mx-auto">
          Enter your desired role and get a clear, step-by-step roadmap to level up your career with AI guidance.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-card border border-gray-700 rounded-xl p-6 max-w-md mx-auto flex flex-col gap-4 shadow-lg">
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter role (e.g., Web Developer, Data Scientist)"
          className="border border-gray-400 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
          onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
        />

        <button
          onClick={generateRoadmap}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-red-600 to-pink-600
            text-white shadow-lg shadow-red-500/30
            hover:from-red-500 hover:to-pink-500 hover:shadow-red-500/45
            active:scale-[0.97]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
          "
        >
          <Route className="h-4 w-4" /> Generate Roadmap
        </button>
      </div>
    </div>
  );
}