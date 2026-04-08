import redis from "@/lib/redis";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) throw new Error("Missing userId");

    const data = await redis.get(`chat:${userId}`);
    const messages = data ? JSON.parse(data) : [];

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Redis get error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}