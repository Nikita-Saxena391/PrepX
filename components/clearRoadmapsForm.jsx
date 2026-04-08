"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NextResponse } from "next/server";
import ClearRoadmapsButton from "./clearRoadmapsButton";

const ClearRoadmapsForm = () => {
  const router = useRouter();

  async function action() {
  const res = await fetch("/api/roadmap-delete", {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.success) {
    toast.success("All Roadmaps Cleared Successfully!!");
    router.refresh();
  } else {
    toast.error(data.error || "Couldn't delete the roadmaps");
  }
}

  return (
    <form action={action}>
      <ClearRoadmapsButton />
    </form>
  );
};

export default ClearRoadmapsForm;