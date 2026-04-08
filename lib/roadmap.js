import { db } from "@/lib/prisma";

export async function getRoadmapHistory() {
  return await db.roadmap.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteAllRoadmaps() {
  await db.roadmap.deleteMany();
  return { success: true };
}