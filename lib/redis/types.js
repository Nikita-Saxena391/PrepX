
/**
 * @typedef {"user" | "assistant" | "system"} ChatRole
 */

/**
 * @typedef {Object} CachedChatMessage
 * @property {string} id
 * @property {string} chatId
 * @property {ChatRole} role
 * @property {string} content
 * @property {string} createdAt - ISO string
 */

/**
 * @typedef {Object} CachedChatSession
 * @property {string} chatId
 * @property {string} userId
 * @property {"active" | "finalized"} status
 * @property {string} startedAt - ISO string
 * @property {string} updatedAt - ISO string
 */

/**
 * @typedef {Object} CachedAssessmentHistoryItem
 * @property {string} id
 * @property {string} userId
 * @property {string} quizType
 * @property {number} score
 * @property {string} createdAt - ISO string
 */

/**
 * @typedef {Object} CachedRoadmapHistoryItem
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} createdAt - ISO string
 * @property {string} updatedAt - ISO string
 */

/**
 * @typedef {Object} CachedIndustryInsights
 * @property {string} industry
 * @property {any} salaryRanges
 * @property {number} growthRate
 * @property {"HIGH" | "MEDIUM" | "LOW"} demandLevel
 * @property {string[]} topSkills
 * @property {string} marketOutlook
 * @property {string[]} keyTrends
 * @property {string[]} recommendedSkills
 * @property {string} lastUpdated - ISO string
 * @property {string} nextUpdate - ISO string
 */

export {};