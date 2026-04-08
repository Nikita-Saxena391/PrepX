"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const USER_ID = "defaultUser";

export default function RoadmapTree() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 LOAD ROADMAP
  useEffect(() => {
    async function loadRoadmap() {
      const roleFromURL = searchParams.get("role");

      if (!roleFromURL) {
        setError("No role provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: roleFromURL,
            userId: USER_ID,
          }),
        });

        const data = await res.json();

        console.log("TREE API:", data);

        // ❌ Handle API errors
        if (!res.ok || data.error) {
          setError(data.error || "Failed to generate roadmap");
          setRoadmap([]);
        } else {
          setRole(roleFromURL);
          setRoadmap(data.roadmap || []);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, [searchParams]);

  // 🔙 BACK
  const handleBack = () => {
    router.push("/ai-roadmap");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="flex-grow w-full px-6 pt-24">
        
        {/* BACK BUTTON */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-600 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Roadmap
          </button>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
          Roadmap for {role}
        </h1>

        {/* 🔄 LOADING */}
        {loading && (
          <div className="text-center text-white text-xl mt-20">
            Generating roadmap... 🚀
          </div>
        )}

        {/* ❌ ERROR */}
        {!loading && error && (
          <div className="text-center text-red-400 text-lg mt-10">
            {error}
          </div>
        )}

        {/* ✅ ROADMAP */}
        {!loading && !error && roadmap.length > 0 && (
          <div className="flex flex-col items-center w-full space-y-8 pb-24">
            {roadmap.map((step, index) => (
              <div key={index} className="w-full flex flex-col items-center">
                <div className="w-full md:w-3/5 text-center py-4 rounded bg-yellow-300 text-black font-medium shadow-lg">
                  {index + 1}. {step.title}
                </div>

                {index < roadmap.length - 1 && (
                  <div className="text-3xl mt-4 text-white select-none">↓</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ❌ EMPTY STATE */}
        {!loading && !error && roadmap.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No roadmap generated. Try a different role.
          </div>
        )}
      </div>
    </div>
  );
}