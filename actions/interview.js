"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { cacheKeys } from "../lib/redis/keys";
import { TTL } from "../lib/redis/ttl";
import { withCache, deleteKey } from "../lib/redis/cache";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ------------------ GENERATE QUIZ ------------------
export async function generateQuiz(type, subject) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found in DB");

  let prompt = "";

  if (type === "technical") {
    prompt = `
You are an expert technical interviewer.

Generate 10 technical interview questions for a ${user.industry} professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.

Rules:
- Medium to hard difficulty
- Each question must be multiple-choice
- Exactly 4 options, 1 correct answer
- Include "topic" and "explanation" fields

Return ONLY valid JSON:
{
  "questions":[
    {
      "question":"string",
      "options":["string","string","string","string"],
      "correctAnswer":"string",
      "explanation":"string",
      "topic":"string"
    }
  ]
}
`;
  } else if (type === "aptitude") {
    prompt = `
You are an expert campus placement test designer.

Generate 10 multiple choice aptitude questions for the subject: ${subject}.

Rules:
- 4 options, 1 correct answer
- Include "topic" and "explanation" fields
- Placement level difficulty

Return ONLY valid JSON:
{
  "questions":[
    {
      "question":"string",
      "options":["string","string","string","string"],
      "correctAnswer":"string",
      "explanation":"string",
      "topic":"string"
    }
  ]
}
`;
  } else if (type === "core") {
    prompt = `
You are a CS interviewer.

Generate 10 multiple-choice questions for ${subject}.

Rules:
- Medium to hard difficulty
- 4 options, 1 correct answer
- Include "topic" and "explanation" fields

Return ONLY valid JSON:
{
  "questions":[
    {
      "question":"string",
      "options":["string","string","string","string"],
      "correctAnswer":"string",
      "explanation":"string",
      "topic":"string"
    }
  ]
}
`;
  }

  const extractJsonObject = (raw) => {
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("No valid JSON object found in model response");
    }
    return cleaned.slice(start, end + 1);
  };

  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are an expert technical interviewer who creates high-quality placement questions. Always return strict JSON."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      const text = response.choices[0]?.message?.content;
      const finishReason = response.choices[0]?.finish_reason;

      if (!text) throw new Error("Empty response from Groq");
      if (finishReason === "length") continue; // retry if truncated

      const jsonString = extractJsonObject(text);
      const parsed = JSON.parse(jsonString);

      if (!parsed || !Array.isArray(parsed.questions))
        throw new Error("Invalid quiz schema: questions array missing");
      if (parsed.questions.length !== 10)
        throw new Error(
          `Invalid question count: expected 10, got ${parsed.questions.length}`
        );

      for (const q of parsed.questions) {
        if (
          !q?.question ||
          !Array.isArray(q?.options) ||
          q.options.length !== 4 ||
          !q?.correctAnswer ||
          !q?.topic
        ) {
          throw new Error("Invalid question structure in model response");
        }
      }

      return parsed.questions;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz questions");
      }
    }
  }
  throw new Error("Failed to generate quiz questions");
}

// ------------------ SAVE QUIZ RESULT ------------------
export async function saveQuizResult(questions, answers, score, type, subject) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found in DB");

  const questionResults = questions.map((q, i) => ({
    question: q.question,
    topic: q.topic,
    answer: q.correctAnswer,
    userAnswer: answers[i] ?? "",
    isCorrect: q.correctAnswer === answers[i],
    explanation: q.explanation
  }));

  const weakTopics = [
    ...new Set(questionResults.filter((q) => !q.isCorrect).map((q) => q.topic))
  ];

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = null;

  if (wrongAnswers.length > 0) {
    const wrongText = wrongAnswers
      .map(
        (q) =>
          `Question: ${q.question}\nCorrect: ${q.answer}\nUser: ${q.userAnswer}`
      )
      .join("\n");

    const improvementPrompt = `
The user completed an assessment on ${subject} (${type}).

Here are the questions they answered incorrectly:
${wrongText}

Identify the knowledge gaps and suggest improvements (encouraging, 2 sentences max)
`;

    try {
      const tipResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a supportive mentor." },
          { role: "user", content: improvementPrompt }
        ],
        temperature: 0.6
      });

      improvementTip = tipResponse.choices[0]?.message?.content?.trim() ?? null;
    } catch (err) {
      console.error("Error generating improvement tip:", err);
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        type,
        subject,
        quizScore: score,
        totalQuestions: questions.length,
        questions: questionResults,
        weakTopics,
        improvementTip
      }
    });

    const key = cacheKeys.assessmentsByUser(user.id);
    await deleteKey(key);

    return assessment;
  } catch (err) {
    console.error("Error saving quiz result:", err);
    throw new Error("Failed to save quiz result");
  }
}

// ------------------ GET ASSESSMENTS ------------------
export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found in DB");

  const key = cacheKeys.assessmentsByUser(user.id);

  const { data } = await withCache(
    key,
    async () =>
      db.assessment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" }
      }),
    TTL.ASSESSMENTS_SECONDS
  );

  return data;
}

// ------------------ CLEAR ASSESSMENTS ------------------
export async function clearAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found in DB");

  await db.assessment.deleteMany({ where: { userId: user.id } });
  const key = cacheKeys.assessmentsByUser(user.id);
  await deleteKey(key);
}

// ------------------ COUNT ASSESSMENTS ------------------
export async function countAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found in DB");

  const counts = await db.assessment.groupBy({
    by: ["type"],
    where: { userId: user.id },
    _count: { type: true }
  });

  const result = { aptitude: 0, technical: 0, core: 0 };
  counts.forEach((c) => {
    const t = c.type?.toLowerCase();
    if (result[t] !== undefined) result[t] = c._count.type;
  });

  return result;
}