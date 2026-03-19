"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AiCareerCoachPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const exampleQuestions = [
    "How can I improve my resume?",
    "What skills are required for a frontend developer?",
    "How do I prepare for a software engineering interview?",
    "Can you suggest career paths in AI?",
    "How can I negotiate a higher salary?"
  ];

  // Load chat history
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to API
  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const newMessage = { role: "user", text };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.text };

      const allMessages = [...updatedMessages, aiMessage];
      setMessages(allMessages);

      localStorage.setItem("chatHistory", JSON.stringify(allMessages));
    } catch (err) {
      console.error(err);
      const errorMessage = { role: "ai", text: "Error contacting AI." };
      const allMessages = [...updatedMessages, errorMessage];
      setMessages(allMessages);
      localStorage.setItem("chatHistory", JSON.stringify(allMessages));
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-background">

      {/* ✅ Back Button (LEFT SIDE) */}
      <div className="px-6 md:px-10 lg:px-20 mb-4">
        <Link href="/ai-career-dashboard">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* ✅ Center Content */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Heading */}
        <h1 className="text-5xl font-extrabold gradient-title text-center">
          AI Career Coach
        </h1>

        {/* Chat Box */}
        <div className="border border-border rounded-xl p-4 h-[400px] overflow-y-auto flex flex-col space-y-3 bg-card">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] p-3 rounded-xl break-words ${
                msg.role === "user"
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-yellow-400 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Example Questions */}
        <div className="space-y-2">
          <p className="text-muted-foreground font-semibold">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="px-3 py-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Need career advice? Start typing…"
            className="flex-1 border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={() => sendMessage()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition-all"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}