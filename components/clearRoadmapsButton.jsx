"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="destructive"
      type="submit"
      disabled={pending}
      className="cursor-pointer"
    >
      {pending ? "Clearing..." : "Clear Roadmaps"}
    </Button>
  );
}

export default function ClearRoadmapsButton() {
  return <SubmitButton />;
}