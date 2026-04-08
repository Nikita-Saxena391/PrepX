import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const { role, roadmap, userId } = body;

    console.log("SAVE API BODY:", body); // ✅ debug

    // ❌ validation fix
    if (!role || !roadmap || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400 }
      );
    }

    const newEntry = {
      role,
      roadmap,
      createdAt: new Date().toISOString(),
    };

    // ✅ get existing history
    const historyRaw = await redis.get(`history:${userId}`);

    let history =
      typeof historyRaw === "string"
        ? JSON.parse(historyRaw)
        : historyRaw || [];

    // ✅ push new data
    history.push(newEntry);

    // ✅ save back
    await redis.set(`history:${userId}`, JSON.stringify(history));

    return new Response(
      JSON.stringify({ message: "Saved successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("SAVE ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}