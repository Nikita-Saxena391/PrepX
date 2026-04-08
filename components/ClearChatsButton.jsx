"use client";

import { Button } from "@/components/ui/button";

export default function ClearChatsButton({ loading }) {
  return (
    <Button
      variant="destructive"
      type="submit"
      disabled={loading}
      className="cursor-pointer"
    >
      {loading ? "Clearing..." : "Clear Chats"}
    </Button>
  );
}