import redis from "@/lib/redis";

export async function POST(req) {
  try {
    const { userId, messages } = await req.json();
    if (!userId || !messages) throw new Error("Missing userId or messages");

    await redis.set(`chat:${userId}`, JSON.stringify(messages));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Redis save error:", err);
    return new Response(JSON.stringify({ error: "Failed to save chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}