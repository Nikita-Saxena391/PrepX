"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye } from "lucide-react";

const USER_ID = "defaultUser";

export default function RoadmapHistoryPage() {
  const [history, setHistory] = useState([]);

  // Fetch history
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/get-history?userId=${USER_ID}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete roadmap
  const deleteItem = async (index) => {
    try {
      await fetch("/api/delete-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: USER_ID, index }),
      });

      fetchHistory(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Your Roadmap History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-400">
          No saved roadmaps yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition"
            >
              {/* Role */}
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                {item.role}
              </h2>

              {/* Date */}
              <p className="text-sm text-gray-400 mb-4">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              {/* Roadmap Preview */}
              <ul className="text-sm text-gray-300 mb-4 list-disc pl-4">
                {item.roadmap.slice(0, 3).map((node, i) => (
                  <li key={i}>{node.title}</li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  onClick={() =>
                    alert("You can route to detailed view later")
                  }
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>

                <button
                  onClick={() => deleteItem(index)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}