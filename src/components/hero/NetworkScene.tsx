"use client"

import React, { useState, useEffect, useRef } from "react"

export type NodeType = "PLANNER" | "ROUTER" | "RESEARCH" | "EXECUTOR" | "EVALUATOR" | "MEMORY"
export type NodeState = "idle" | "active" | "complete" | "error" | "warning"

interface NodeInfo {
  id: NodeType
  name: string
  cx: number
  cy: number
  w: number
  h: number
}

const NODES: NodeInfo[] = [
  { id: "PLANNER", name: "PLANNER", cx: 290, cy: 45, w: 118, h: 48 },
  { id: "ROUTER", name: "ROUTER", cx: 290, cy: 148, w: 118, h: 34 },
  { id: "RESEARCH", name: "RESEARCH", cx: 148, cy: 252, w: 118, h: 34 },
  { id: "EXECUTOR", name: "EXECUTOR", cx: 432, cy: 252, w: 118, h: 34 },
  { id: "EVALUATOR", name: "EVALUATOR", cx: 290, cy: 356, w: 118, h: 34 },
  { id: "MEMORY", name: "MEMORY", cx: 148, cy: 452, w: 118, h: 34 },
]

export const NODE_DETAILS = {
  PLANNER: {
    name: "PLANNER",
    purpose: "Decomposes goal into executable subtasks. Determines dependencies and parallel opportunities.",
    failures: "Goal ambiguous → clarification | Budget exceeded → task reduction | Recursion → depth limit",
    recovery: "BUSINESS_FAILURE raised. Invalid goals not retried — rephrasing required at source.",
    stack: "TypeScript, Cloudflare Workers, Hono.js"
  },
  ROUTER: {
    name: "ROUTER",
    purpose: "Scores agents against tasks using capability embeddings. Routes to highest-scoring specialist.",
    failures: "No capable agent → skip | Score below minimum → escalation",
    recovery: "Falls back to generalist executor when no specialist meets minimum threshold.",
    stack: "TypeScript, Cloudflare Workers, Embedding similarity"
  },
  RESEARCH: {
    name: "RESEARCH",
    purpose: "Fetches external context. 3-provider sequential fallback: Groq → Gemini → Claude.",
    failures: "Single timeout → fallback | All down → INFRA_FAILURE | Rate limit → exponential backoff",
    recovery: "Full cascade: alarm raised, executor uses cached context. Classified as INFRA_FAILURE.",
    stack: "Groq, Gemini Flash, Claude, Cloudflare KV Cache"
  },
  EXECUTOR: {
    name: "EXECUTOR",
    purpose: "Primary output generator in the generator→evaluator loop.",
    failures: "JSON parse → fallback format | Short output → 1 regeneration | Violation → hard stop",
    recovery: "1 regeneration before Evaluator. Failure flag propagates for score adjustment.",
    stack: "TypeScript, OpenAI API, Cloudflare Workers"
  },
  EVALUATOR: {
    name: "EVALUATOR",
    purpose: "Scores output against 4 weighted criteria. Quality gate — nothing exits without passing.",
    failures: "Score < 7.5 → retry to Planner | JSON fail → score 0 | 2 consecutive → ANOMALY alarm",
    recovery: "2-check anomaly detection. Jaccard duplicate detection. Budget spike detection.",
    stack: "TypeScript, Cloudflare AI Gateway, Durable Objects"
  },
  MEMORY: {
    name: "MEMORY",
    purpose: "Persists run context, scores, evaluation history. Enables cross-run Jaccard detection.",
    failures: "Write timeout → async queue | Quota exceeded → LRU eviction",
    recovery: "Non-blocking — runs complete regardless. Failures logged to infra channel.",
    stack: "Cloudflare D1, Durable Objects, KV Storage"
  }
}

interface LogEntry {
  type: string
  message: string
  color: string
}

interface StepInfo {
  log: LogEntry
  states: Partial<Record<NodeType, NodeState>>
  edges?: Record<string, boolean>
  metrics: { latency: number; tokens: number; score: string; retries: number }
}

interface NetworkSceneProps {
  isFailureMode: boolean
  triggerFailure: () => void
  resetFailure: () => void
  onMetricsChange: (metrics: { latency: number; tokens: number; score: string; retries: number }) => void
  onInspectNode: (node: NodeType | null) => void
}

export function NetworkScene({
  isFailureMode,
  triggerFailure,
  resetFailure,
  onMetricsChange,
  onInspectNode,
}: NetworkSceneProps) {
  const [nodeStates, setNodeStates] = useState<Record<NodeType, NodeState>>({
    PLANNER: "idle",
    ROUTER: "idle",
    RESEARCH: "idle",
    EXECUTOR: "idle",
    EVALUATOR: "idle",
    MEMORY: "idle",
  })

  const [activeEdges, setActiveEdges] = useState<Record<string, boolean>>({
    "p-ro": false,
    "ro-re": false,
    "ro-ex": false,
    "re-ev": false,
    "ex-ev": false,
    "ev-m": false,
    "ev-p": false,
  })

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const [inspectedNode, setInspectedNode] = useState<NodeType | null>(null)

  // Stream normal run sequence
  const NORMAL_STEPS: StepInfo[] = [
    {
      log: { type: "GOAL_RECEIVED", message: 'Evaluate Q3 infrastructure report', color: "text-text-mono" },
      states: { PLANNER: "active" },
      edges: { "p-ro": true },
      metrics: { latency: 120, tokens: 0, score: "0.00", retries: 0 }
    },
    {
      log: { type: "PLANNER", message: "Decomposing into 3 subtasks...", color: "text-text-2" },
      states: { PLANNER: "active" },
      edges: { "p-ro": true },
      metrics: { latency: 340, tokens: 120, score: "0.00", retries: 0 }
    },
    {
      log: { type: "TASKS_CREATED", message: "[RESEARCH, EXECUTE, EVALUATE]", color: "text-success" },
      states: { PLANNER: "complete", ROUTER: "active" },
      edges: { "p-ro": false, "ro-re": true, "ro-ex": true },
      metrics: { latency: 580, tokens: 190, score: "0.00", retries: 0 }
    },
    {
      log: { type: "ROUTER", message: "Scoring agent capabilities...", color: "text-text-2" },
      states: { PLANNER: "complete", ROUTER: "active" },
      edges: { "ro-re": true, "ro-ex": true },
      metrics: { latency: 740, tokens: 190, score: "0.00", retries: 0 }
    },
    {
      log: { type: "AGENTS_SELECTED", message: "Research: 94%  Execute: 91%", color: "text-success" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "active", EXECUTOR: "active" },
      edges: { "ro-re": false, "ro-ex": false, "re-ev": true },
      metrics: { latency: 910, tokens: 320, score: "0.00", retries: 0 }
    },
    {
      log: { type: "RESEARCH", message: "Fetching external context...", color: "text-text-2" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "warning", EXECUTOR: "active" },
      edges: { "re-ev": true },
      metrics: { latency: 1100, tokens: 320, score: "0.00", retries: 0 }
    },
    {
      log: { type: "API_TIMEOUT", message: "anthropic → 408 Request Timeout", color: "text-warning" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "warning", EXECUTOR: "active" },
      edges: { "re-ev": true },
      metrics: { latency: 1350, tokens: 410, score: "0.00", retries: 0 }
    },
    {
      log: { type: "RETRY", message: "Switching to Groq fallback...", color: "text-warning" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "active", EXECUTOR: "active" },
      edges: { "re-ev": true },
      metrics: { latency: 1510, tokens: 410, score: "0.00", retries: 0 }
    },
    {
      log: { type: "RETRY_SUCCESS", message: "Groq  latency +1.2s (degraded)", color: "text-success" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "active" },
      edges: { "re-ev": false, "ex-ev": true },
      metrics: { latency: 1650, tokens: 590, score: "0.00", retries: 0 }
    },
    {
      log: { type: "EXECUTOR", message: "Processing with fetched context...", color: "text-text-2" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "active" },
      edges: { "ex-ev": true },
      metrics: { latency: 1720, tokens: 590, score: "0.00", retries: 0 }
    },
    {
      log: { type: "EXECUTOR_DONE", message: "Tokens: 847  Output: 2.1KB", color: "text-success" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "active" },
      edges: { "ex-ev": false, "re-ev": false },
      metrics: { latency: 1810, tokens: 847, score: "0.00", retries: 0 }
    },
    {
      log: { type: "EVALUATOR", message: "Scoring 4 weighted criteria...", color: "text-text-2" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "active" },
      edges: {},
      metrics: { latency: 1820, tokens: 847, score: "0.00", retries: 0 }
    },
    {
      log: { type: "SCORE", message: "Coherence 8.2  ·  Accuracy 7.9", color: "text-text-mono" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "active" },
      edges: {},
      metrics: { latency: 1830, tokens: 847, score: "8.05", retries: 0 }
    },
    {
      log: { type: "SCORE", message: "Completeness 8.5  ·  Safety 9.1", color: "text-text-mono" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "active" },
      edges: {},
      metrics: { latency: 1840, tokens: 847, score: "8.42", retries: 0 }
    },
    {
      log: { type: "WEIGHTED_SCORE", message: "8.42 / 10.0  ↑ PASS  (threshold ≥ 7.5)", color: "text-success font-bold" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "complete", MEMORY: "active" },
      edges: { "ev-m": true },
      metrics: { latency: 1840, tokens: 847, score: "8.42", retries: 0 }
    },
    {
      log: { type: "MEMORY", message: "Persisting 3 context vectors...", color: "text-text-2" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "complete", MEMORY: "active" },
      edges: { "ev-m": true },
      metrics: { latency: 1840, tokens: 847, score: "8.42", retries: 0 }
    },
    {
      log: { type: "RUN_COMPLETE", message: "✓ 1.84s  ·  Tokens: 847  ·  Cost: $0.003  ·  Score: 8.42", color: "text-success font-bold animate-pulse" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "complete", MEMORY: "complete" },
      edges: { "ev-m": false },
      metrics: { latency: 1840, tokens: 847, score: "8.42", retries: 0 }
    }
  ]

  // Failure run sequence
  const FAILURE_STEPS: StepInfo[] = [
    {
      log: { type: "FAILURE_INJECTED", message: "Simulating cascade provider failure", color: "text-error font-bold" },
      states: { PLANNER: "active", ROUTER: "idle", RESEARCH: "idle", EXECUTOR: "idle", EVALUATOR: "idle", MEMORY: "idle" },
      edges: { "p-ro": true },
      metrics: { latency: 150, tokens: 0, score: "0.00", retries: 0 }
    },
    {
      log: { type: "PLANNER", message: "Task: stress-test recovery path", color: "text-text-2" },
      states: { PLANNER: "active" },
      edges: { "p-ro": true },
      metrics: { latency: 310, tokens: 80, score: "0.00", retries: 0 }
    },
    {
      log: { type: "ROUTER", message: "High-risk task → activating guardrails", color: "text-warning" },
      states: { PLANNER: "complete", ROUTER: "active" },
      edges: { "p-ro": false, "ro-re": true },
      metrics: { latency: 520, tokens: 150, score: "0.00", retries: 0 }
    },
    {
      log: { type: "PROVIDER_FAIL_1", message: "Groq: 503 Service Unavailable", color: "text-error" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "error" },
      edges: { "ro-re": false, "re-ev": true },
      metrics: { latency: 890, tokens: 230, score: "0.00", retries: 0 }
    },
    {
      log: { type: "PROVIDER_FAIL_2", message: "Gemini: 429 Rate Limited", color: "text-error" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "error" },
      edges: { "re-ev": true },
      metrics: { latency: 1250, tokens: 230, score: "0.00", retries: 0 }
    },
    {
      log: { type: "PROVIDER_FAIL_3", message: "Claude: 30s timeout exceeded", color: "text-error" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "error" },
      edges: { "re-ev": true },
      metrics: { latency: 1610, tokens: 230, score: "0.00", retries: 0 }
    },
    {
      log: { type: "ANOMALY_CHECK_1", message: "Consecutive failure → check 1 / 2", color: "text-warning" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "error", EVALUATOR: "warning" },
      edges: { "re-ev": true },
      metrics: { latency: 1820, tokens: 280, score: "0.00", retries: 0 }
    },
    {
      log: { type: "ANOMALY_CHECK_2", message: "Threshold exceeded → ALARM RAISED", color: "text-error font-bold" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "error", EVALUATOR: "warning" },
      edges: { "re-ev": true },
      metrics: { latency: 2020, tokens: 280, score: "0.00", retries: 0 }
    },
    {
      log: { type: "ALARM", message: "RunTerminationReason: INFRA_FAILURE", color: "text-error font-bold animate-pulse" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "error", EVALUATOR: "warning" },
      edges: { "re-ev": false },
      metrics: { latency: 2150, tokens: 280, score: "0.00", retries: 0 }
    },
    {
      log: { type: "EXECUTOR", message: "Degraded mode: using cached context", color: "text-warning" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "warning" },
      edges: { "ex-ev": true },
      metrics: { latency: 2350, tokens: 490, score: "0.00", retries: 0 }
    },
    {
      log: { type: "EVALUATOR", message: "Re-scoring degraded output...", color: "text-text-2" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "error" },
      edges: { "ex-ev": false },
      metrics: { latency: 2600, tokens: 620, score: "0.00", retries: 0 }
    },
    {
      log: { type: "WEIGHTED_SCORE", message: "6.91 / 10.0  ↓ FAIL  (threshold ≥ 7.5)", color: "text-error font-bold" },
      states: { PLANNER: "complete", ROUTER: "complete", RESEARCH: "complete", EXECUTOR: "complete", EVALUATOR: "error" },
      edges: {},
      metrics: { latency: 2850, tokens: 620, score: "6.91", retries: 0 }
    },
    {
      log: { type: "RETRY_LOOP", message: "Evaluator → Planner  (attempt 2/3)", color: "text-warning" },
      states: { PLANNER: "active", ROUTER: "idle", RESEARCH: "idle", EXECUTOR: "idle", EVALUATOR: "error" },
      edges: { "ev-p": true },
      metrics: { latency: 3100, tokens: 620, score: "6.91", retries: 1 }
    },
    {
      log: { type: "RUN_TERMINATED", message: "BUSINESS_FAILURE  Score: 6.91 < 7.5", color: "text-error font-bold animate-pulse" },
      states: { PLANNER: "error", ROUTER: "idle", RESEARCH: "idle", EXECUTOR: "idle", EVALUATOR: "error", MEMORY: "idle" },
      edges: { "ev-p": false },
      metrics: { latency: 3450, tokens: 620, score: "6.91", retries: 1 }
    }
  ]

  // Play steps
  useEffect(() => {
    const steps = isFailureMode ? FAILURE_STEPS : NORMAL_STEPS
    
    if (currentStep < steps.length) {
      const step = steps[currentStep]
      
      const timer = setTimeout(() => {
        // Add log
        setLogs((prev) => [...prev, step.log].slice(-8)) // Keep last 8 logs
        
        // Update states
        setNodeStates((prev) => ({
          ...prev,
          ...step.states
        }))

        // Update edges
        setActiveEdges((prev) => {
          const next = { ...prev }
          Object.keys(next).forEach((k) => {
            next[k] = step.edges ? !!(step.edges as any)[k] : false
          })
          return next
        })

        // Update metrics
        onMetricsChange({
          latency: step.metrics.latency,
          tokens: step.metrics.tokens,
          score: step.metrics.score,
          retries: step.metrics.retries,
        })

        setCurrentStep((prev) => prev + 1)
      }, 400) // Speed up transitions for snappy feel

      return () => clearTimeout(timer)
    } else {
      // Completed current run, hold for 4.5s then reset and loop
      const timer = setTimeout(() => {
        if (isFailureMode) {
          resetFailure()
        } else {
          // Restart normal
          setLogs([])
          setNodeStates({
            PLANNER: "idle",
            ROUTER: "idle",
            RESEARCH: "idle",
            EXECUTOR: "idle",
            EVALUATOR: "idle",
            MEMORY: "idle",
          })
          setActiveEdges({
            "p-ro": false,
            "ro-re": false,
            "ro-ex": false,
            "re-ev": false,
            "ex-ev": false,
            "ev-m": false,
            "ev-p": false,
          })
          setCurrentStep(0)
        }
      }, 4500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, isFailureMode])

  // Reset when toggling failure mode
  useEffect(() => {
    setLogs([])
    setNodeStates({
      PLANNER: "idle",
      ROUTER: "idle",
      RESEARCH: "idle",
      EXECUTOR: "idle",
      EVALUATOR: "idle",
      MEMORY: "idle",
    })
    setActiveEdges({
      "p-ro": false,
      "ro-re": false,
      "ro-ex": false,
      "re-ev": false,
      "ex-ev": false,
      "ev-m": false,
      "ev-p": false,
    })
    setCurrentStep(0)
  }, [isFailureMode])

  // Style class mapper for nodes
  const getNodeClasses = (state: NodeState) => {
    switch (state) {
      case "active":
        return "stroke-accent fill-accent/10 text-text shadow-[0_0_15px_rgba(77,163,255,0.4)]"
      case "complete":
        return "stroke-success fill-success/8 text-text"
      case "error":
        return "stroke-error fill-error/10 text-text"
      case "warning":
        return "stroke-warning fill-warning/8 text-text"
      case "idle":
      default:
        return "stroke-border fill-[#0F1318] text-text-3"
    }
  }

  const getNodeTextClass = (state: NodeState) => {
    switch (state) {
      case "active":
      case "complete":
      case "error":
      case "warning":
        return "fill-text"
      case "idle":
      default:
        return "fill-text-3"
    }
  }

  return (
    <div className="w-full flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden shadow-panel">
      {/* Visual Canvas Area */}
      <div className="relative flex-grow flex items-center justify-center p-4 bg-[#0A0D12]">
        {/* Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.055]"
          style={{
            backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        <svg
  viewBox="0 0 580 500"
  className="w-full max-h-[380px] z-10 select-none"
  role="img"
  aria-labelledby="dag-title"
  aria-describedby="dag-desc"
>
  <title id="dag-title">LoopOS agent execution trace</title>
  <desc id="dag-desc">
    A directed acyclic graph showing 6 named agent nodes — Planner, Router, Research,
    Executor, Evaluator, Memory — with animated packet flows representing live system execution.
  </desc>
          <defs>
            {/* Glow filters */}
            <filter id="glow-accent" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-error" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connectors / Edges */}
          {/* p-ro */}
          <path
            id="path-p-ro"
            d="M 290 69 L 290 131"
            className="transition-colors duration-300"
            stroke={activeEdges["p-ro"] ? "var(--accent)" : "var(--border)"}
            strokeWidth={activeEdges["p-ro"] ? "2" : "1.5"}
            fill="none"
          />
          {activeEdges["p-ro"] && (
            <circle r="4" fill="var(--accent)">
              <animateMotion dur="1s" repeatCount="indefinite" path="M 290 69 L 290 131" />
            </circle>
          )}

          {/* ro-re */}
          <path
            id="path-ro-re"
            d="M 246 165 Q 148 182 148 235"
            className="transition-colors duration-300"
            stroke={activeEdges["ro-re"] ? "var(--accent)" : "var(--border)"}
            strokeWidth={activeEdges["ro-re"] ? "2" : "1.5"}
            fill="none"
          />
          {activeEdges["ro-re"] && (
            <circle r="4" fill="var(--accent)">
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 246 165 Q 148 182 148 235" />
            </circle>
          )}

          {/* ro-ex */}
          <path
            id="path-ro-ex"
            d="M 334 165 Q 432 182 432 235"
            className="transition-colors duration-300"
            stroke={activeEdges["ro-ex"] ? "var(--accent)" : "var(--border)"}
            strokeWidth={activeEdges["ro-ex"] ? "2" : "1.5"}
            fill="none"
          />
          {activeEdges["ro-ex"] && (
            <circle r="4" fill="var(--accent)">
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 334 165 Q 432 182 432 235" />
            </circle>
          )}

          {/* re-ev */}
          <path
            id="path-re-ev"
            d="M 148 269 L 252 339"
            className="transition-colors duration-300"
            stroke={activeEdges["re-ev"] ? (isFailureMode ? "var(--error)" : "var(--accent)") : "var(--border)"}
            strokeWidth={activeEdges["re-ev"] ? "2" : "1.5"}
            fill="none"
          />
          {activeEdges["re-ev"] && (
            <circle r="4" fill={isFailureMode ? "var(--error)" : "var(--accent)"}>
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 148 269 L 252 339" />
            </circle>
          )}

          {/* ex-ev */}
          <path
            id="path-ex-ev"
            d="M 432 269 L 328 339"
            className="transition-colors duration-300"
            stroke={activeEdges["ex-ev"] ? "var(--accent)" : "var(--border)"}
            strokeWidth={activeEdges["ex-ev"] ? "2" : "1.5"}
            fill="none"
          />
          {activeEdges["ex-ev"] && (
            <circle r="4" fill="var(--accent)">
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 432 269 L 328 339" />
            </circle>
          )}

          {/* ev-m */}
          <path
            id="path-ev-m"
            d="M 252 373 L 148 435"
            className="transition-colors duration-300"
            stroke={activeEdges["ev-m"] ? "var(--success)" : "var(--border)"}
            strokeWidth={activeEdges["ev-m"] ? "2" : "1.5"}
            fill="none"
          />
          {activeEdges["ev-m"] && (
            <g>
              <circle r="4" fill="var(--success)">
                <animateMotion dur="1.2s" repeatCount="indefinite" path="M 252 373 L 148 435" />
              </circle>
              <text x="210" y="395" fill="var(--success)" className="font-mono font-semibold text-[10px]">PASS</text>
            </g>
          )}

          {/* ev-p (retry loop - DASHED, lights up RED during failure) */}
          <path
            id="path-ev-p"
            d="M 349 356 C 532 356 532 52 349 52"
            className="transition-colors duration-300"
            stroke={activeEdges["ev-p"] ? "var(--error)" : "var(--border)"}
            strokeWidth={activeEdges["ev-p"] ? "2" : "1.5"}
            strokeDasharray="4 4"
            fill="none"
          />
          {activeEdges["ev-p"] && (
            <g>
              <circle r="4" fill="var(--error)">
                <animateMotion dur="1.5s" repeatCount="indefinite" path="M 349 356 C 532 356 532 52 349 52" />
              </circle>
              <text x="470" y="200" fill="var(--error)" className="font-mono font-semibold text-[10px]">RETRY</text>
            </g>
          )}

          {/* Nodes */}
          {NODES.map((node) => {
            const state = nodeStates[node.id]
            const isInspectable = true
            const glowFilter = state === "active" ? "url(#glow-accent)" : state === "error" ? "url(#glow-error)" : undefined

            return (
              <g
                key={node.id}
                onClick={() => {
                  setInspectedNode(node.id)
                  onInspectNode(node.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setInspectedNode(node.id)
                    onInspectNode(node.id)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Inspect ${node.id} node — ${nodeStates[node.id]} state`}
                aria-pressed={inspectedNode === node.id}
                className="cursor-pointer group focus-visible:outline-none"
              >
                {/* Node Box */}
                <rect
                  x={node.cx - node.w / 2}
                  y={node.cy - node.h / 2}
                  width={node.w}
                  height={node.h}
                  rx="6"
                  ry="6"
                  className={`transition-all duration-300 ${getNodeClasses(state)}`}
                  strokeWidth={state === "active" || state === "error" ? "2" : "1"}
                  filter={glowFilter}
                />
                
                {/* Text Label */}
                <text
                  x={node.cx}
                  y={node.cy + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  letterSpacing="1.5"
                  fontFamily="var(--font-mono, monospace)"
                  className={`transition-colors duration-300 ${getNodeTextClass(state)}`}
                >
                  {node.name}
                </text>
                {/* Shape indicator — state encoded in BOTH color AND shape (WCAG 1.4.1) */}
                {state === 'complete' && (
                  <text x={node.cx + node.w / 2 - 10} y={node.cy - node.h / 2 + 10}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="var(--success)" aria-hidden="true">✓</text>
                )}
                {state === 'error' && (
                  <text x={node.cx + node.w / 2 - 10} y={node.cy - node.h / 2 + 10}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="var(--error)" aria-hidden="true">✕</text>
                )}
                {state === 'warning' && (
                  <text x={node.cx + node.w / 2 - 10} y={node.cy - node.h / 2 + 10}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="var(--warning)" aria-hidden="true">!</text>
                )}
                {state === 'active' && (
                  <circle cx={node.cx + node.w / 2 - 10} cy={node.cy - node.h / 2 + 10}
                    r="4" fill="var(--accent)" aria-hidden="true">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Trace Log Feed & Console Area (195px height) */}
      <div className="h-[195px] border-t border-border bg-[#0F1318] p-4 flex flex-col font-mono text-[11px] justify-between">
        {inspectedNode ? (
          <>
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
              <span className="text-text-mono font-semibold text-[9px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Inspecting: {inspectedNode}
              </span>
              <button
                onClick={() => {
                  setInspectedNode(null)
                  onInspectNode(null)
                }}
                className="text-text-3 hover:text-text text-[9px] uppercase font-bold cursor-pointer"
              >
                [Close X]
              </button>
            </div>
            <div className="flex-grow space-y-1.5 overflow-y-auto pr-2 select-text scrollbar-none">
              <div><span className="text-accent font-semibold">PURPOSE:</span> {NODE_DETAILS[inspectedNode].purpose}</div>
              <div><span className="text-error font-semibold">FAILURES:</span> {NODE_DETAILS[inspectedNode].failures}</div>
              <div><span className="text-success font-semibold">RECOVERY:</span> {NODE_DETAILS[inspectedNode].recovery}</div>
              <div><span className="text-text-mono font-semibold">STACK:</span> {NODE_DETAILS[inspectedNode].stack}</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
              <span className="text-text-3 font-semibold text-[9px] uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isFailureMode ? "bg-error animate-pulse" : "bg-success animate-ping"}`} />
                Live Execution Stream
              </span>
              <span className="text-text-mono text-[9px]">loopOS v1.0.0</span>
            </div>

            {/* Console Log Rows */}
            <div
             className="flex-grow space-y-1 overflow-y-auto pr-2 scrollbar-none select-text"
             role="log"
             aria-live="polite"
             aria-atomic="false"
             aria-label="Live execution trace log"
            >
               {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-text-3 text-[9px] min-w-[70px] uppercase font-semibold">[{log.type}]</span>
                  <span className={`${log.color} flex-grow`}>{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-text-3 italic text-center py-6">Initializing pipeline components...</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
