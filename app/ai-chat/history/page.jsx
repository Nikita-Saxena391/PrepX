import { currentUser } from "@clerk/nextjs/server"; // ✅ use currentUser for server components
import {db} from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  ChevronRight,
  History,
  Sparkles,
} from "lucide-react";

import ClearChatsForm from "@/components/ClearChatsForm";

export default async function ChatHistoryPage() {
  // Get logged-in Clerk user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); // Clerk login route
  }

  // Get Prisma user
  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id }, // match with your Prisma model
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  // Get chats
  const chats = await db.chat.findMany({
    where: { userId: dbUser.id, isEnded: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-8xl px-7 py-6 sm:px-6 sm:py-8">
      {/* HEADER CARD */}
      <div className="m-10 rounded-2xl border border-blue-500/30 bg-black/40 p-4 shadow-[0_0_24px_rgba(0,140,255,0.18)] backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/ai-chat-dashboard">
            <Button
              variant="link"
              className="gap-2 pl-0 cursor-pointer text-blue-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Chat Dashboard
            </Button>
          </Link>

          <ClearChatsForm />
        </div>

        {/* TITLE */}
        <div className="mt-4 flex flex-col gap-3 sm:mt-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            <History className="h-3.5 w-3.5" />
            Conversation Archive
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text sm:text-5xl">
            Your Chat History
          </h1>

          <p className="text-sm text-blue-100/80 sm:text-base">
            Revisit previous AI career chats and continue planning your next steps.
          </p>

          <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            {chats.length} saved{" "}
            {chats.length === 1 ? "conversation" : "conversations"}
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {chats.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-blue-500/40 bg-black/30 p-10 text-center m-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">
            <Bot className="h-7 w-7 text-blue-300" />
          </div>

          <h2 className="text-xl font-semibold text-blue-100">No chats yet</h2>

          <p className="mt-2 text-sm text-blue-200/80">
            Start a conversation with the AI Career Coach.
          </p>

          <Link href="/ai-chat-dashboard" className="mt-5 inline-block">
            <Button className="cursor-pointer">Start New Chat</Button>
          </Link>
        </div>
      ) : (
        /* CHAT LIST */
        <div className="mt-8 grid grid-cols-1 gap-4 m-10">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/ai-chat/history/${chat.id}`}
              className="group block rounded-xl border border-blue-500/30 bg-[#071224]/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-yellow-300 sm:text-lg">
                    {chat.title ?? "AI Career Chat"}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-300/85 sm:text-sm">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(chat.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-0.5 shrink-0 rounded-full border border-blue-400/30 bg-blue-500/10 p-2 group-hover:border-cyan-300/60 group-hover:bg-cyan-500/15">
                  <ChevronRight className="h-4 w-4 text-cyan-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}