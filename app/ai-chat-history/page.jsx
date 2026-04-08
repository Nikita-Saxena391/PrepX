"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const USER_ID = "defaultUser"; // Replace with real user ID if you have auth

export default function ChatHistoryPage() {
  const [history, setHistory] = useState([]);

  // Load chat from Redis API
  useEffect(() => {
    fetch(`/api/get-chat?userId=${USER_ID}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.messages || []))
      .catch(console.error);
  }, []);

  // Clear chat
  const clearHistory = async () => {
    try {
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, messages: [] }),
      });
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  return (
    <div className="min-h-screen pt-24 p-6 bg-background">

      {/* Back Button */}
      <div className="mb-6">
        <Link href="/ai-career-dashboard">
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition"
          >
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
            type="button"
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