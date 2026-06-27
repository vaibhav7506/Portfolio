"use client"

import React, { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import * as THREE from "three"
import { ScenarioType } from "./SystemBlueprint"

interface NodeData {
  id: string
  name: string
  role: string
  tech: string
  decision: string
  pos: [number, number, number]
  color: string
}

const BLUEPRINT_NODES: NodeData[] = [
  {
    id: "browser",
    name: "BROWSER",
    role: "User dashboard rendering real-time metrics and DAG loops.",
    tech: "Next.js, SSE / WebSockets",
    decision: "Renders dashboard. Connects via edge-optimized serverless streams for live node tracking.",
    pos: [-2, 2, 2],
    color: "#4DA3FF",
  },
  {
    id: "pages",
    name: "CF PAGES",
    role: "Global CDN hosting for statically built portfolio bundle.",
    tech: "Cloudflare Pages CDN",
    decision: "Edge CDN hosting ensures 100% static asset caching and zero cold starts worldwide.",
    pos: [2, 2, 2],
    color: "#4DA3FF",
  },
  {
    id: "gateway",
    name: "WORKERS GATEWAY",
    role: "Serverless routing gate, Auth verification, and rate limiting.",
    tech: "Cloudflare Workers, Hono.js",
    decision: "Verifies JWTs and applies custom 100req/min IP-based rate limiting before downstream execution.",
    pos: [0, 1.2, 1],
    color: "#4DA3FF",
  },
  {
    id: "planner",
    name: "PLANNER",
    role: "LoopOS orchestrator stage 1: goal decomposition.",
    tech: "TypeScript, Claude 3.5 Sonnet",
    decision: "Splits goals into dependency DAGs and checks for recursive loops using JSON Schema gates.",
    pos: [-1.2, 0.2, 0],
    color: "#4DA3FF",
  },
  {
    id: "router",
    name: "ROUTER",
    role: "LoopOS orchestrator stage 2: capability matching.",
    tech: "Workers, Embeddings Similarity",
    decision: "Computes similarity vector score between agents and subtasks, routing to highest specialist.",
    pos: [1.2, 0.2, 0],
    color: "#4DA3FF",
  },
  {
    id: "research",
    name: "RESEARCH AGENT",
    role: "Fetches context from external web resources.",
    tech: "Groq, Gemini, Claude APIs",
    decision: "Runs sequential provider fallback: if Groq times out, routes to Gemini, then Claude.",
    pos: [-2, -0.8, -1],
    color: "#F59E0B",
  },
  {
    id: "executor",
    name: "EXECUTOR AGENT",
    role: "Processes context data and generates response templates.",
    tech: "Claude 3.5, OpenAI API",
    decision: "Assembles prompt templates and context snippets inside secure serverless executor isolate.",
    pos: [0, -0.8, -1],
    color: "#F59E0B",
  },
  {
    id: "evaluator",
    name: "EVALUATOR",
    role: "LoopOS quality gateway checking criteria scores.",
    tech: "Workers AI, Durable Objects",
    decision: "Scores outputs on 4 criteria. Rejects runs below 7.5 threshold, sending back to Planner.",
    pos: [2, -0.8, -1],
    color: "#22C55E",
  },
  {
    id: "durable_objects",
    name: "DURABLE OBJECTS",
    role: "State lock, alarm checks, and transaction coordination.",
    tech: "CF Durable Objects",
    decision: "Maintains strong transactional state and schedules alarms to guarantee execution retries survive restarts.",
    pos: [-1, -1.8, -2],
    color: "#EF4444",
  },
  {
    id: "d1_kv",
    name: "D1 DB / KV CACHE",
    role: "Persistent execution logs and temporary token caches.",
    tech: "Cloudflare D1, Workers KV",
    decision: "D1 relational store logs run metrics, KV stores token counts and fallbacks with 24h TTL.",
    pos: [1, -1.8, -2],
    color: "#EF4444",
  },
]

const CONNECTIONS = [
  { from: "browser", to: "gateway" },
  { from: "pages", to: "gateway" },
  { from: "gateway", to: "planner" },
  { from: "gateway", to: "router" },
  { from: "planner", to: "router" },
  { from: "router", to: "research" },
  { from: "router", to: "executor" },
  { from: "research", to: "evaluator" },
  { from: "executor", to: "evaluator" },
  { from: "evaluator", to: "durable_objects" },
  { from: "durable_objects", to: "d1_kv" },
  { from: "evaluator", to: "planner" },
]

interface SceneNodeProps {
  node: NodeData
  onHover: (node: NodeData | null) => void
  scenario: ScenarioType
}

function SceneNode({ node, onHover, scenario }: SceneNodeProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = node.pos[1] + Math.sin(state.clock.getElapsedTime() * 1.5 + node.pos[0]) * 0.05
    }
  })

  let nodeColor = node.color
  if (scenario === "FAILURE" && node.id === "research") {
    nodeColor = "#EF4444"
  } else if (scenario === "BUDGET" && node.id === "gateway") {
    nodeColor = "#F59E0B"
  } else if (scenario === "QUALITY" && node.id === "evaluator") {
    nodeColor = "#EF4444"
  }

  return (
    <mesh
      ref={meshRef}
      position={node.pos}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(node)
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
      }}
      scale={hovered ? 1.2 : 1.0}
    >
      <boxGeometry args={[0.5, 0.3, 0.5]} />
      <meshStandardMaterial
        color={nodeColor}
        emissive={nodeColor}
        emissiveIntensity={hovered ? 0.8 : 0.25}
        roughness={0.2}
      />
      <Html distanceFactor={6} position={[0, 0.35, 0]} center pointerEvents="none">
        <div className="px-2 py-0.5 bg-[#0F1318]/90 border border-border text-[8px] font-mono font-bold tracking-wider rounded select-none text-text text-center whitespace-nowrap shadow-md">
          {node.name}
        </div>
      </Html>
    </mesh>
  )
}

interface ConnectionLineProps {
  fromNode: NodeData
  toNode: NodeData
  scenario: ScenarioType
}

// REPLACE with:
function ConnectionLine({ fromNode, toNode, scenario }: ConnectionLineProps) {
  const packetRef = useRef<THREE.Mesh>(null)  // lineRef removed — was never used

  // Determine path color based on scenario
  let pathColor = "#4DA3FF"
  if (scenario === "FAILURE" && fromNode.id === "router" && toNode.id === "research") {
    pathColor = "#EF4444"
  } else if (scenario === "BUDGET" && fromNode.id === "gateway") {
    pathColor = "#F59E0B"
  } else if (scenario === "QUALITY" && fromNode.id === "evaluator" && toNode.id === "planner") {
    pathColor = "#EF4444"
  }

  // Build the Three.js Line object imperatively — avoids JSX ref typing conflict
  // between React 19 and @react-three/fiber v9
  const lineObject = useMemo(() => {
    const points = [
      new THREE.Vector3(...fromNode.pos),
      new THREE.Vector3(...toNode.pos),
    ]
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({
      color: pathColor,
      transparent: true,
      opacity: 0.3,
    })
    return new THREE.Line(geo, mat)
  }, [fromNode.pos, toNode.pos, pathColor])

  // Packet dot travels from fromNode to toNode continuously
  useFrame((state) => {
    if (!packetRef.current) return
    const t = (state.clock.getElapsedTime() * 0.4 + fromNode.pos[0] * 0.2) % 1.0
    packetRef.current.position.lerpVectors(
      new THREE.Vector3(...fromNode.pos),
      new THREE.Vector3(...toNode.pos),
      t
    )
  })

  return (
    <group>
      {/* primitive avoids the <line> JSX ref-type conflict in React 19 + R3F v9 */}
      <primitive object={lineObject} />

      {/* Animated packet dot along the connection */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={pathColor} />
      </mesh>
    </group>
  )
}

interface SystemBlueprintCanvasProps {
  scenario: ScenarioType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHoverNode: (nodeData: any) => void
}

export function SystemBlueprintCanvas({ scenario, onHoverNode }: SystemBlueprintCanvasProps) {
  const handleHoverNode = (node: NodeData | null) => {
    if (node) {
      onHoverNode({
        name: node.name,
        role: node.role,
        tech: node.tech,
        decision: node.decision,
      })
    } else {
      onHoverNode(null)
    }
  }

  return (
    <Canvas
      camera={{ position: [3, 2, 5], fov: 60 }}
      className="w-full h-full min-h-[500px]"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {BLUEPRINT_NODES.map((node) => (
        <SceneNode
          key={node.id}
          node={node}
          onHover={handleHoverNode}
          scenario={scenario}
        />
      ))}

      {CONNECTIONS.map((conn, idx) => {
        const fromNode = BLUEPRINT_NODES.find((n) => n.id === conn.from)
        const toNode = BLUEPRINT_NODES.find((n) => n.id === conn.to)
        if (!fromNode || !toNode) return null
        return (
          <ConnectionLine
            key={idx}
            fromNode={fromNode}
            toNode={toNode}
            scenario={scenario}
          />
        )
      })}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 1.5}
        minDistance={3}
        maxDistance={10}
      />
    </Canvas>
  )
}