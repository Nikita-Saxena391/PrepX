"use client";

export default function StepCard({ data }) {
  return (
    <div className="px-4 py-2 min-w-[140px] bg-blue-600 text-white rounded-lg shadow-lg text-center font-semibold">
      <div className="text-lg">Step {data.step}</div>
      <div className="mt-1">{data.title}</div>
    </div>
  );
}