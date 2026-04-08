import { db } from "@/lib/prisma";
import Link from "next/link";
import RoadmapViewer from "@/components/RoadmapViewer";

export default async function Page({ params }) {
  const { id } = params;

  const roadmap = await db.roadmap.findUnique({
    where: { id },
  });

  // ✅ STEP 1: DEBUG HERE
  console.log("ROADMAP FROM DB:", roadmap);

  if (!roadmap) {
    return <div className="pt-20 text-white">Roadmap not found</div>;
  }

  return (
    <div className="pt-20 px-4 min-h-screen">
      <Link href="/ai-roadmap-generator" className="text-blue-400">
        ← Back
      </Link>

      {/* ✅ PASS DATA TO VIEWER */}
      <RoadmapViewer roadmap={roadmap} />
    </div>
  );
}