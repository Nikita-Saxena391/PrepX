import { index } from "../app/lib/pinecone";

export async function storeMemory(userId, chatId, message, role) {
  const text = message?.trim();

  if (!userId || !chatId || !text) {
    return;
  }

  const createdAt = Date.now();

  await index.namespace(userId).upsertRecords({
    records: [
      {
        id: crypto.randomUUID(),
        userId,
        chatId,
        role,
        createdAt,
        text,
      },
    ],
  });
}