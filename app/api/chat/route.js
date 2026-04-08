import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Clerk auth
import { db } from "@/lib/prisma";
import { getActiveChatMessages } from "@/lib/chat-session"; // corrected path

export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    if (!chatId) {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    // Find the user in DB by Clerk ID
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check the chat belongs to this user
    const chat = await db.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== dbUser.id) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Try Redis first
    const redisMessages = await getActiveChatMessages(chatId);
    if (redisMessages.length > 0) {
      return NextResponse.json({ messages: redisMessages, source: "redis" });
    }

    // Fallback to Postgres
    const dbMessages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: { id: true, content: true, role: true, createdAt: true },
    });

    const messages = dbMessages.map((m) => ({
      id: m.id,
      chatId,
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
// POST /api/chat
export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { chatId, message } = body;

    if (!chatId || !message) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    // Get DB user
    const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check chat exists
    const chat = await db.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== dbUser.id) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    // Save user message
    const userMessage = await db.message.create({
      data: { chatId, role: "user", content: message },
    });

    // Get chat history for AI
    const history = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    // Call AI (Groq)
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const aiResp = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });

    const aiMessage = aiResp.choices[0]?.message?.content || "No response from AI";

    // Save AI message
    await db.message.create({
      data: { chatId, role: "assistant", content: aiMessage },
    });

   // After getting aiMessage
return new Response(aiMessage, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
 catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}