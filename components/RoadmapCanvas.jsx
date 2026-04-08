"use client";

import { layoutNodes } from "@/lib/dagre";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MarkerType,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TurboNode from "@/components/turboNode";

const nodeTypes = {
  turbo: TurboNode,
};

const RoadmapCanvas = ({ initialNodes, initialEdges }) => {
  const layoutedNodes = useMemo(() => {
    if (!initialNodes || !initialEdges) return [];

    return layoutNodes(
      initialNodes.map((node) => ({
        ...node,
        type: "turbo",
      })),
      initialEdges
    );
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // 🔥 FIX HERE
  useEffect(() => {
    if (layoutedNodes.length) {
      setNodes(layoutedNodes);
    }
   if (initialEdges) {
  const edgesWithIds = initialEdges.map((edge, index) => ({
    id: edge.id || `edge-${index}`, // ✅ ensure unique id
    ...edge,
  }));

  setEdges(edgesWithIds);
}
  }, [layoutedNodes, initialEdges]);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) =>
        applyNodeChanges(changes, nodesSnapshot)
      ),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) =>
        applyEdgeChanges(changes, edgesSnapshot)
      ),
    []
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#64748b", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#64748b",
          },
        }}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default RoadmapCanvas;