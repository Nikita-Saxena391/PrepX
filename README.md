🚀 PrepX
AI-Powered Interview Preparation Platform

Tagline:
A unified AI-driven platform for interview preparation, resume building, assessments, and career growth.

1. 🧠 Project Overview

PrepX is a full-stack AI career preparation platform designed to help students and professionals prepare for technical interviews using a single intelligent system.

It integrates:

AI career coaching
Resume building & optimization
Quiz-based assessments
Personalized learning roadmaps
Industry insights
2. ❗ Problem Statement

Interview preparation is fragmented across multiple tools:

Separate platforms for resumes, quizzes, and mock interviews
No centralized progress tracking
Lack of personalized feedback loops
Static learning resources

👉 This leads to inefficient preparation and slower skill improvement.

3. 💡 Solution

PrepX unifies the entire preparation journey into one AI-powered system that:

Tracks user progress
Generates personalized learning content
Provides real-time AI feedback
Continuously adapts to user performance
4. ✨ Key Features
🤖 AI Career Assistant
Chat-based AI mentor
Role-specific guidance (SDE, Analyst, etc.)
Context-aware responses using chat memory
📝 Smart Resume Builder
Build resumes inside the platform
AI improves:
Bullet points
Project descriptions
ATS optimization
🧪 Quiz & Assessment System
AI-generated quizzes
Covers:
DSA
Aptitude
CS fundamentals
Instant scoring + feedback
📊 Industry Insights
Latest tech trends and skill demand
Cached for fast performance
Updated via scheduled background jobs
🗺️ AI Learning Roadmaps
Personalized career roadmap generator
Visual graph-based roadmap (React Flow)
Progression path:
Basics → Intermediate → Advanced → Projects → Interview Prep
💬 AI Mock Interview (Text-Based)
Simulated interview experience
AI-driven question flow
Post-interview evaluation:
Technical score
Communication score
Improvement suggestions
❌ Removed Features
❌ MongoDB removed
❌ Subscription system removed (Stripe removed)
❌ Voice interview system removed
5. 🧰 Tech Stack (Final Version)
Frontend
Next.js (App Router)
React
Tailwind CSS
Radix UI
React Flow
Backend
Next.js API Routes + Server Actions
Database
NeonDB (PostgreSQL)
Prisma ORM

Used for:

Users
Resumes
Quizzes
Roadmaps
Interview sessions
Progress tracking
Caching Layer
Redis (Upstash)
Chat sessions
Insights caching
Temporary AI state
AI Layer
Groq (Llama models)
Google Gemini

Used for:

Chat responses
Resume enhancement
Quiz generation
Interview evaluation
Roadmap generation
Background Jobs
Inngest
Weekly industry insights refresh
Authentication
Clerk Auth
Google login
GitHub login
Email/password
Session management
6. 🏗️ System Architecture

Frontend (Next.js UI)
⬇
Backend (API Routes / Server Actions)
⬇
AI Layer (Groq / Gemini)
⬇
Data Layer

NeonDB (Prisma)
Redis (cache + session storage)
7. 🔄 Core Pipelines
💬 Chat Pipeline
User sends message
Stored in Redis session buffer
AI generates response
Response streamed
Stored in NeonDB
🧪 Quiz Pipeline
AI generates quiz dynamically
Stored in NeonDB
User submits answers
AI evaluates + returns score
📝 Resume Pipeline
User inputs resume data
AI enhances content
Stored in NeonDB (versioned)
📊 Insights Pipeline
Check Redis cache
If miss → AI generates insights
Stored + refreshed via Inngest
🗺️ Roadmap Pipeline
AI generates structured JSON roadmap
Stored in NeonDB
Rendered using React Flow
