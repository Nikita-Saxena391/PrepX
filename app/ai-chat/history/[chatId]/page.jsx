// app/ai-chat/history/[chatId]/page.jsx
import { currentUser } from "@clerk/nextjs/server"; // Clerk auth
import { db } from "@/lib/prisma"; // 
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ChatHistoryDetail({ params }) {
  const { chatId } = params;

  if (!chatId) notFound();

  const userSession = await currentUser();
  if (!userSession?.id) notFound();

  const user = await db.user.findUnique({
    where: { clerkUserId: userSession.id },
  });
  if (!user) notFound();

  const chat = await db.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!chat || chat.userId !== user.id) notFound();

  return (
    <div className="p-6 mx-auto mt-16">
      <Link href="/ai-chat/history">
    <Button variant="link" className="gap-2 pl-0 cursor-pointer">
      <ArrowLeft className="h-4 w-4" />
      Back to Chat History
    </Button>
  </Link>

      <h1 className="text-3xl font-bold mb-1 text-center">
        {chat.title ?? "AI Career Chat"}
      </h1>
      <p className="text-sm text-center text-yellow-400 mb-6">
        {new Date(chat.createdAt).toLocaleString()}
      </p>

      <div className="space-y-3 m-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-900 text-white ml-auto"
                : "bg-green-800 text-white"
            } max-w-[70%]`}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
          </div>
        ))}
      </div>
    </div>
  );
}