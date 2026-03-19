"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

export default function AiCareerDashboard() {
  const { user } = useUser(); // Get user from Clerk
  const username = user?.firstName || "User";

  return (
    <div className="min-h-screen bg-background pt-24 px-4 py-10 flex flex-col items-center justify-center">

      {/* ✅ Back Button (LEFT SIDE) */}
      <div className="w-full px-6 md:px-10 lg:px-20 mb-4">
        <Link href="/">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </Link>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center gradient-title mb-4">
        AI Career Coach
      </h1>

      <p className="text-center text-muted-foreground max-w-3xl mb-10">
        Discover your path, unlock hidden potential, and get personalized AI guidance for every career decision you make.
      </p>

      {/* Main Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left side: Image */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <div className="relative w-full h-80 md:h-[28rem]">
            <Image
              src="/girl2.png"
              width={1280}
              height={720}
              alt="Girl Image"
              className="rounded-lg shadow-2xl border h-[400px] w-auto object-contain transition-all duration-500"
            />
          </div>
        </div>

        {/* Right side: User greeting + buttons */}
        <div className="flex flex-col items-center md:items-start space-y-4 justify-start">
          <p className="text-xl font-medium">
            Hi <span className="text-blue-500">{username}</span> 👋
          </p>

          <p className="text-muted-foreground mb-4 max-w-md">
            Ready to prepare for interviews, and get instant AI mentorship tailored just for you?
          </p>

          {/* Start Chatting Button */}
          <Link href="/ai-career-coach">
            <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition">
              Start Chatting
            </button>
          </Link>

          {/* Chat History Button */}
          <Link href="/ai-chat-history">
            <button className="w-full md:w-auto px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition">
              Chat History
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}