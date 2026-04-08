const APP_PREFIX = "prepx"; // your app namespace
const KEY_VERSION = "v1";

// function for generating keys
function makeKey(...parts) {
  return [APP_PREFIX, KEY_VERSION, ...parts].join(":");
}

export const cacheKeys = {
  chatSession: (chatId) => makeKey("chat", "session", chatId),

  chatMessages: (chatId) => makeKey("chat", "messages", chatId),

  assessmentsByUser: (userId) => makeKey("assessments", userId),

  roadmapsByUser: (userId) =>
    makeKey("roadmaps", "user", userId),

  industryInsights: (industry) =>
    makeKey("industry-insights", industry.toLowerCase()),
};

export const cachePrefixes = {
  app: makeKey(),
  chat: makeKey("chat"),
  assessments: makeKey("assessments"),
  roadmaps: makeKey("roadmaps"),
  insights: makeKey("industry-insights"),
};