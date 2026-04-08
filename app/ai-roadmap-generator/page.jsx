"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GeneratePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title) {
      alert("Enter a topic");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (data.id) {
        router.push(`/ai-roadmap/${data.id}`);
      } else {
        alert(data.error || "Failed to generate roadmap");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ✅ GLOBAL GRID BACKGROUND */}
      <div className="grid-background" />

      {/* CONTENT */}
      <div className="relative z-10 pt-24 px-4 py-10 flex flex-col items-center justify-center">

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center gradient-title mb-4">
          AI Roadmap Generator 
        </h1>

        <p className="text-center text-muted-foreground max-w-2xl mb-10">
          Generate a personalized roadmap for any tech stack or skill in seconds.
        </p>

        {/* MAIN SECTION */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* LEFT IMAGE */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-full h-80 md:h-[28rem]">
              <Image
                src="/roadmap_girl.jpeg"
                width={1280}
                height={720}
                alt="Roadmap"
                className="rounded-xl shadow-2xl border border-white/10 h-[400px] w-auto object-contain"
              />
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="w-full backdrop-blur bg-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-4 border border-white/10">

            <input
              className="px-4 py-3 rounded-xl w-full bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter topic (e.g. MERN, DSA, React)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>

            <Link href="/history">
              <button className="w-full px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition">
                View History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}