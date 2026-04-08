// app/api/chat/messages/route.js
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getActiveChatMessages } from "@/lib/chat-session";

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    if (!chatId) return NextResponse.json({ error: "chatId is required" }, { status: 400 });

    // Get user from DB
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get chat and check ownership
    const chat = await db.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== dbUser.id) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    // Try Redis first
    const redisMessages = await getActiveChatMessages(chatId);
    if (redisMessages.length > 0) return NextResponse.json({ messages: redisMessages, source: "redis" });

    // Fallback to Postgres
    const dbMessages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: { id: true, role: true, content: true, createdAt: true },
    });

    const messages = dbMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({ messages, source: "postgres" });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}