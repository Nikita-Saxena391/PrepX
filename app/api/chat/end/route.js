import { NextResponse } from "next/server";

import { groq } from "@/lib/groq"; // now works thanks to baseUrl
import {
  getActiveChatMessages,
  markChatSessionFinalized,
  clearChatSessionCache,
} from "@/lib/chat-session"; // updated path using alias
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"; // no need for relative paths
import crypto from "crypto";
async function generateTitleFromTranscript(transcriptLines) {
  if (!transcriptLines.length) return "AI Career Chat";

  const transcript = transcriptLines.join("\n").slice(0, 8000);

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_completion_tokens: 24,
    messages: [
      {
        role: "system",
        content:
          "Generate a concise career-chat title (max 8 words). Return title only, no quotes, no punctuation at ends.",
      },
      {
        role: "user",
        content: `Transcript:\n${transcript}`,
      },
    ],
  });

  const rawTitle = response.choices[0]?.message?.content?.trim();
  if (!rawTitle) return "AI Career Chat";

  return rawTitle.replace(/^['"\s]+|['"\s]+$/g, "").slice(0, 80) || "AI Career Chat";
}

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const chatId = body?.chatId;
    const clientMessages = Array.isArray(body?.messages) ? body.messages : [];

    if (!chatId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id }, // match with your Prisma model
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await db.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.userId !== dbUser.id) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.isEnded) {
      // Idempotent end operation
      return NextResponse.json({ success: true, alreadyEnded: true }, { status: 200 });
    }

    const redisMessages = await getActiveChatMessages(chatId);
    const sourceMessages =
      redisMessages.length > 0
        ? redisMessages
        : clientMessages.map((m) => ({
            id: crypto.randomUUID(),
            chatId,
            role: m.role || "user",
            content: m.content || "",
            createdAt: new Date().toISOString(),
          }));

    const normalized = sourceMessages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    if (normalized.length === 0) {
      await db.chat.update({
        where: { id: chatId },
        data: { title: "AI Career Chat", isEnded: true },
      });

      await markChatSessionFinalized(chatId);
      await clearChatSessionCache(chatId);

      return NextResponse.json({ success: true });
    }

    const firstFewMessages = normalized.slice(0, 10);
    const transcriptLines = firstFewMessages.map((m) => `${m.role}: ${m.content}`);

    let title = "AI Career Chat";
    try {
      title = await generateTitleFromTranscript(transcriptLines);
    } catch (err) {
      console.error("TITLE GENERATION ERROR:", err);
      const firstUserMessage = normalized.find((m) => m.role === "user")?.content;
      title = firstUserMessage?.slice(0, 50) || "AI Career Chat";
    }

    await db.$transaction([
      db.message.createMany({
        data: normalized.map((m) => ({
          chatId,
          role: m.role,
          content: m.content,
        })),
      }),
      db.chat.update({
        where: { id: chatId },
        data: { title, isEnded: true },
      }),
    ]);

    try {
      await markChatSessionFinalized(chatId);
      await clearChatSessionCache(chatId);
    } catch (err) {
      console.error("Redis cleanup after chat-end failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CHAT END ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}