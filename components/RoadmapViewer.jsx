"use client";

import React from "react";
import RoadmapCanvas from "@/components/RoadmapCanvas";
import { useRouter } from "next/navigation";

const RoadmapViewer = ({ roadmap }) => {
  const router = useRouter();

 const handleDelete = async () => {
  try {
    const res = await fetch(`/api/delete-roadmap/${roadmap.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Roadmap deleted successfully");
      router.push("/history");
    } else {
      alert(data.error || "Delete failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen p-4 gap-4">

        {/* LEFT INFO PANEL */}
        <div className="bg-muted/80 p-4 rounded-lg space-y-3 h-fit">
          <h2 className="text-yellow-300 text-2xl font-bold">
            {roadmap?.title}
          </h2>

          <div className="text-white text-base">
            <span className="text-amber-500 font-bold">Description: </span>
            {roadmap?.description}
          </div>

          <div className="text-lg font-bold text-white">
            <span className="text-amber-500">Duration: </span>
            {roadmap?.duration}
          </div>

          {/* ✅ DELETE BUTTON */}
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Roadmap
          </button>
        </div>

        {/* RIGHT CANVAS */}
        <div className="md:col-span-2 h-[80vh] w-full rounded-lg border">
          <RoadmapCanvas
            initialNodes={roadmap?.nodes}
            initialEdges={roadmap?.edges}
          />
        </div>

      </div>
    </div>
  );
};

export default RoadmapViewer;