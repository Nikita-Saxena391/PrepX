# 🚀 PrepX

### AI-Powered Interview Preparation Platform

> *A unified AI-driven platform for interview preparation, resume building, assessments, and career growth.*

---

## 🧠 Overview

**PrepX** is a full-stack AI-powered career preparation platform designed to help students and professionals prepare for technical interviews in one unified system.

It combines:

- AI Career Coaching  
- Smart Resume Builder  
- Quiz & Skill Assessment System  
- AI Learning Roadmaps  
- Industry Insights  

No fragmented tools — everything in one place.

---

## ❗ Problem Statement

Interview preparation is currently scattered across multiple platforms:

- Separate tools for resumes, quizzes, and mock interviews  
- No centralized progress tracking  
- Lack of personalized feedback  
- Static and non-adaptive learning resources  

This leads to inefficient preparation and slow skill improvement.

---

## 💡 Solution

**PrepX solves this by creating a unified AI-driven preparation ecosystem** that:

- Tracks user progress  
- Generates personalized learning content  
- Provides real-time AI feedback  
- Continuously adapts based on user performance  

---

## ✨ Features

### 🤖 AI Career Assistant
- Chat-based AI mentor
- Role-specific guidance (SDE, Data Analyst, etc.)
- Context-aware responses using chat memory

---

### 📝 Smart Resume Builder
- Build resumes inside the platform
- AI-powered improvements:
  - Bullet point optimization
  - Project descriptions
  - ATS-friendly formatting

---

### 🧪 Quiz & Assessment System
- AI-generated quizzes
- Topics:
  - Data Structures & Algorithms
  - Aptitude
  - CS Fundamentals
- Instant scoring + AI feedback

---

### 📊 Industry Insights
- Latest tech trends and skill demand analysis
- Cached for fast performance
- Updated using scheduled background jobs

---

### 🗺️ AI Learning Roadmaps
- Personalized career roadmap generator
- Visual graph-based roadmap using React Flow
- Learning progression:
  - Basics → Intermediate → Advanced → Projects → Interview Prep

---

### 💬 AI Mock Interview (Text-Based)
- Simulated interview experience
- AI-driven question flow
- Post-interview evaluation:
  - Technical score
  - Communication score
  - Improvement suggestions

---

## 🧰 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Radix UI
- React Flow

---

### Backend
- Next.js API Routes
- Server Actions

---

### Database
- **NeonDB (PostgreSQL)**
- Prisma ORM

Used for:
- Users
- Resumes
- Quizzes
- Roadmaps
- Interview sessions
- Progress tracking

---

### Caching
- Redis (Upstash)
  - Chat sessions
  - Insights caching
  - Temporary AI state

---

### AI Integration
- Groq (Llama models)
- Google Gemini

Used for:
- Chat responses
- Resume enhancement
- Quiz generation
- Interview evaluation
- Roadmap generation

---

### Background Jobs
- Inngest
  - Weekly industry insights refresh

---

### Authentication
- Clerk Auth
  - Google login
  - GitHub login
  - Email/password login
  - Session management

---

## 🏗️ Architecture
