"use client";

import ClearChatsButton from "./ClearChatsButton";
import { toast } from "sonner";
import { deleteAllChats } from "@/actions/ai-chat";

export default function ClearChatsForm() {
  // standard React function for form submission
  const handleClearChats = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const res = await deleteAllChats();
      if (res?.success) {
        toast.success("All chats cleared successfully.");
      } else {
        toast.error("Failed to clear chats.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while clearing chats.");
    }
  };

  return (
    <form onSubmit={handleClearChats}>
      <ClearChatsButton />
    </form>
  );
}