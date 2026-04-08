// Redis utility file

import { redis } from "./client";

const nowMs = () => Date.now();

// Get JSON from Redis
export async function getJSON(key) {
  try {
    const value = await redis.get(key);
    return value ?? null;
  } catch (error) {
    console.error(`Redis get failed for key: ${key}`, error);
    return null;
  }
}

// Set JSON in Redis with optional TTL
export async function setJSON(key, value, ttlSeconds) {
  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await redis.set(key, value, { ex: ttlSeconds });
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Redis set failed for key: ${key}`, error);
    return false;
  }
}

// Delete a single key
export async function deleteKey(key) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`Redis delete failed for key: ${key}`, error);
    return false;
  }
}

// Delete multiple keys
export async function deleteKeys(keys) {
  try {
    if (!keys.length) return true;
    await redis.del(...keys);
    return true;
  } catch (error) {
    console.error("Redis bulk delete failed", error);
    return false;
  }
}

// Cache wrapper with metrics
export async function withCache(key, producer, ttlSeconds) {
  const startMs = nowMs();

  const redisGetStartMs = nowMs();
  const cached = await getJSON(key);
  const redisGetMs = nowMs() - redisGetStartMs;

  if (cached !== null) {
    return {
      data: cached,
      source: "cache",
      metrics: {
        redisGetMs,
        producerMs: 0,
        redisSetMs: 0,
        totalMs: nowMs() - startMs,
      },
    };
  }

  const producerStartMs = nowMs();
  const fresh = await producer(); // fetching from DB (e.g. Postgres)
  const producerMs = nowMs() - producerStartMs;

  const redisSetStartMs = nowMs();
  await setJSON(key, fresh, ttlSeconds);
  const redisSetMs = nowMs() - redisSetStartMs;

  return {
    data: fresh,
    source: "origin",
    metrics: {
      redisGetMs,
      producerMs,
      redisSetMs,
      totalMs: nowMs() - startMs,
    },
  };
}