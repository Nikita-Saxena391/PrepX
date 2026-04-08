import RoadmapViewer from "@/components/RoadmapViewer";
import { db } from "@/lib/prisma"; // ✅ correct
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function Page({ params }) {
  const { id } = await params;

  // now use id


  // Fetch roadmap from DB
  const roadmap = await db.roadmap.findUnique({
    where: {
      id: id,
    },
  });

  if (!roadmap) return notFound();

  return (
    <div className="pt-20 px-4 min-h-screen">
      <Link href="/history" className="text-blue-400">
        ← Back
      </Link>

      {/* ✅ PASS DATA TO VIEWER */}
      <RoadmapViewer roadmap={roadmap} />
    </div>
  );
}