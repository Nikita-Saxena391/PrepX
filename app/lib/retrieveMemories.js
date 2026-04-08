import { index } from "./pinecone";

export async function retrieveMemories(userId, query) {
  if (!userId || !query || !query.trim()) return [];

  const results = await index.namespace(userId).searchRecords({
    query: {
      topK: 12,
      inputs: {
        text: query,
      },
    },
    fields: ["text"],
  });

  return results.result.hits
    .map((hit) => hit.fields?.text)
    .filter((text) => typeof text === "string");
}