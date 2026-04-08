// lib/redis/chat-session.js

import { cacheKeys } from "./redis/keys";
import { TTL } from "./redis/ttl";
import { deleteKeys, getJSON, setJSON } from "./redis/cache";
import crypto from "crypto";
// current time
function nowIso() {
  return new Date().toISOString();
}

// create message object
function createMessage(input) {
  return {
    id: input.id || crypto.randomUUID(),
    chatId: input.chatId,
    role: input.role,
    content: input.content,
    createdAt: input.createdAt || nowIso(),
  };
}

// ensure session exists
export async function ensureActiveChatSession(chatId, userId) {
  const sessionKey = cacheKeys.chatSession(chatId);
  const existing = await getJSON(sessionKey);

  const nextSession = existing
    ? {
        ...existing,
        status: "active",
        updatedAt: nowIso(),
      }
    : {
        chatId,
        userId,
        status: "active",
        startedAt: nowIso(),
        updatedAt: nowIso(),
      };

  await setJSON(sessionKey, nextSession, TTL.CHAT_ACTIVE_SECONDS);
  return nextSession;
}

// append message
export async function appendChatMessage(input) {
  await ensureActiveChatSession(input.chatId, input.userId);

  const messagesKey = cacheKeys.chatMessages(input.chatId);
  const existing = (await getJSON(messagesKey)) || [];

  const message = createMessage(input);
  const next = [...existing, message];

  await setJSON(messagesKey, next, TTL.CHAT_ACTIVE_SECONDS);

  // update session timestamp
  const sessionKey = cacheKeys.chatSession(input.chatId);
  const session = await getJSON(sessionKey);

  if (session) {
    await setJSON(
      sessionKey,
      { ...session, updatedAt: nowIso(), status: "active" },
      TTL.CHAT_ACTIVE_SECONDS
    );
  }

  return message;
}

// get messages
export async function getActiveChatMessages(chatId) {
  const key = cacheKeys.chatMessages(chatId);
  const messages = await getJSON(key);
  return messages || [];
}

// get session
export async function getChatSession(chatId) {
  const key = cacheKeys.chatSession(chatId);
  return await getJSON(key);
}

// finalize chat
export async function markChatSessionFinalized(chatId) {
  const sessionKey = cacheKeys.chatSession(chatId);
  const existing = await getJSON(sessionKey);

  if (!existing) return null;

  const finalized = {
    ...existing,
    status: "finalized",
    updatedAt: nowIso(),
  };

  await setJSON(sessionKey, finalized, TTL.CHAT_FINALIZED_SECONDS);
  return finalized;
}

// clear redis
export async function clearChatSessionCache(chatId) {
  const sessionKey = cacheKeys.chatSession(chatId);
  const messagesKey = cacheKeys.chatMessages(chatId);

  await deleteKeys([sessionKey, messagesKey]);
}