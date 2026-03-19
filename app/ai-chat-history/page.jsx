"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ChatHistoryPage() {
  const [history, setHistory] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) setHistory(JSON.parse(savedMessages));
  }, []);

  // Clear history
  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen pt-24 p-6 bg-background"> {/* pt-24 to avoid header overlap */}
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Link href="/ai-career-dashboard">
          <button className="px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center">
        Your Chat History
      </h1>

      {history.length === 0 && (
        <p className="text-center text-muted-foreground">
          No chat history yet.
        </p>
      )}

      <div className="flex flex-col space-y-3 max-w-3xl mx-auto">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[75%] break-words ${
              msg.role === "user"
                ? "self-end bg-blue-500 text-white"
                : "self-start bg-yellow-400 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={clearHistory}
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}