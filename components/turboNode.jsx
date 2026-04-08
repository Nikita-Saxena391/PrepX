import { Handle, Position } from "@xyflow/react";
import React from "react";

const TurboNode = ({ data }) => {
  if (!data) return null; // ✅ prevent crash

  return (
    <div className="rounded-lg bg-yellow-300 shadow-md p-4 w-64 pointer-events-auto">
      
      <div className="font-bold text-lg text-red-500">
        {data?.title || "No Title"}
      </div>

      <p className="text-sm text-black mt-1">
        {data?.description || ""}
      </p>

      {data?.link && (
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-600 mt-2 underline inline-block"
        >
          Learn more →
        </a>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TurboNode;