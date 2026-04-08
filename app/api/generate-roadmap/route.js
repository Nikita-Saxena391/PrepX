import Groq from "groq-sdk";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // ✅ 1. FIND USER
    const user = await db.user.findUnique({
      where: {
        clerkUserId: "demo-user",
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // ✅ 2. PROMPT (your original + stricter ending)
    const prompt = `
You are an API that generates structured data for a React Flow roadmap visualization.

Your task is to generate a comprehensive learning roadmap for the given topic.
The roadmap should contain between 8 and 15 nodes depending on topic complexity.

IMPORTANT CONTEXT:

The topic can belong to different categories such as:

1. Career Roadmaps
Examples:
- Google SDE
- Microsoft SWE
- Amazon SDE Preparation

2. Tech Stack Roadmaps
Examples:
- React Developer
- Backend Developer
- AI Engineer
- Full Stack Developer

3. Core Computer Science Subjects
Examples:
- OOPS (Object Oriented Programming)
- DBMS (Database Management Systems)
- CN (Computer Networks)
- OS (Operating Systems)
- System Design

4. Skill Based Roadmaps
Examples:
- DSA Mastery
- Competitive Programming

You must understand the context of the given topic and generate the roadmap accordingly.

Follow these rules strictly:

1. Return ONLY valid JSON.
2. Do NOT include markdown or backticks.
3. The JSON must strictly follow the schema.
4. All node IDs must be unique.
5. Edges must connect valid node IDs.
6. Graph must be DAG (no loops).
7. Nodes should flow top → bottom.

JSON Schema:

{
  "roadmapTitle": "string",
  "description": "string",
  "duration": "string",
  "nodes": [
    {
      "id": "string",
      "position": { "x": number, "y": number },
      "data": {
        "title": "string",
        "description": "string",
        "link": "string"
      }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "nodeId",
      "target": "nodeId"
    }
  ]
}
  CRITICAL RULE (DO NOT BREAK):

Every node MUST include a valid "link".

If even ONE node is missing a link → the entire response is INVALID.

Each node MUST have a DIFFERENT and RELEVANT documentation link.

Examples:
- React → https://react.dev
- Node → https://nodejs.org
- Express → https://expressjs.com
- MongoDB → https://www.mongodb.com/docs

Never repeat the same link for all nodes.
Never leave link empty.

IMPORTANT:
The topic is "${title}".
ONLY generate roadmap for this topic.
`;

    // ✅ 3. CALL GROQ
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from AI");
    }

    // ✅ 4. CLEAN RESPONSE
    response = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = response.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Invalid JSON from AI");
    }

    // ✅ SAFE PARSE
    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (e) {
      console.error("JSON Parse Failed:", match[0]);
      throw new Error("AI returned invalid JSON");
    }

    // ✅ 5. FIX NODES (🔥 IMPORTANT)
    let nodes = (parsed.nodes || []).map((node, index) => ({
      id: node.id || `${index}`,
      position: node.position || { x: 0, y: index * 150 },

      data: {
        label: node.data?.title || "Step",
        title: node.data?.title || "Step",
        description:
          node.data?.description || "No description available",
        link:
          node.data?.link && node.data.link.startsWith("http")
            ? node.data.link
            : "https://developer.mozilla.org",
      },
    }));

    // ✅ 6. FIX EDGES (REMOVE BAD ONES)
    let edges = (parsed.edges || [])
      .filter((edge) => edge.source !== edge.target) // ❌ remove self loops
      .map((edge, index) => ({
        id: edge.id || `e-${index}`,
        source: edge.source,
        target: edge.target,
      }));

    // ✅ 7. REMOVE INVALID EDGE REFERENCES
    const nodeIds = new Set(nodes.map((n) => n.id));
    edges = edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    // ✅ 8. FALLBACK (avoid blank UI)
    if (nodes.length === 0) {
      nodes = [
        {
          id: "1",
          position: { x: 0, y: 0 },
          data: {
            label: "Start Learning 🚀",
            title: "Start Learning 🚀",
            description: "Begin your journey",
            link: "https://developer.mozilla.org",
          },
        },
      ];
    }

    // ✅ 9. SAVE TO DATABASE
    const savedRoadmap = await db.roadmap.create({
      data: {
        title: parsed.roadmapTitle || title,
        description: parsed.description || "",
        duration: parsed.duration || "",
        nodes,
        edges,
        userId: user.id,
      },
    });

    // ✅ 10. RETURN ID
    return NextResponse.json({
      id: savedRoadmap.id,
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function DELETE() {
  try {
    await db.roadmap.deleteMany();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete roadmaps" },
      { status: 500 }
    );
  }
}