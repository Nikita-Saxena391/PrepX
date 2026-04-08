import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const historyRaw = await redis.get(`history:${userId}`);

    // ✅ FIX: handle both string + object
    const history =
      typeof historyRaw === "string"
        ? JSON.parse(historyRaw)
        : historyRaw || [];

    const latest = history.length
      ? history[history.length - 1]
      : { role: "", roadmap: [] };

    return new Response(JSON.stringify(latest), {
      status: 200,
    });
  } catch (err) {
    console.error("Error fetching roadmap:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}