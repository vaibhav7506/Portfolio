"use client"

import { useState } from "react"
import Link from "next/link"
import { NetworkScene } from "./NetworkScene"

export function HeroSection() {
  const [isFailureMode, setIsFailureMode] = useState(false)
  const [metrics, setMetrics] = useState({
    latency: 0,
    tokens: 0,
    score: "0.00",
    retries: 0,
  })

  // Track if a node is currently being inspected to show a status note in UI
  const [inspectedNode, setInspectedNode] = useState<string | null>(null)

  const handleMetricsChange = (newMetrics: typeof metrics) => {
    setMetrics(newMetrics)
  }

  const handleInspectNode = (node: string | null) => {
    setInspectedNode(node)
  }

  const triggerFailure = () => {
    setIsFailureMode(true)
  }

  const resetFailure = () => {
    setIsFailureMode(false)
  }

  const scoreNum = parseFloat(metrics.score)
  const isScorePass = scoreNum >= 7.5 || scoreNum === 0

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-center min-h-[calc(100vh-56px)]">
      {/* Left Column (Copy + Metrics) */}
      <div className="flex flex-col space-y-8 lg:max-w-[340px]">
        {/* Availability Badge */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/20 bg-success/5 font-mono text-[11px] font-bold text-success tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            AVAILABLE — OPEN TO ROLES
          </span>
        </div>

        {/* Copy text */}
        <div className="space-y-4">
          <p className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
            FULL-STACK ENGINEER — AI AGENT SYSTEMS
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight leading-tight">
            Building agent infrastructure with guardrails, evaluators, and recovery loops.
          </h1>
          <p className="text-sm text-text-2 leading-relaxed font-sans">
            Built LoopOS, SentientWallet, and GitBlamed — using Cloudflare Workers, Next.js, and multi-agent architectures.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono">
          <Link
            href="/work/loopos"
            className="flex items-center justify-center px-5 py-3 text-xs font-bold rounded-md bg-accent text-bg hover:bg-accent/90 transition-all duration-150 tracking-wider text-center"
          >
            EXPLORE LOOPOS →
          </Link>
          <button
            onClick={() => {
              if (isFailureMode) {
                resetFailure()
              } else {
                triggerFailure()
              }
            }}
            className={`flex items-center justify-center px-5 py-3 text-xs font-bold rounded-md border transition-all duration-150 tracking-wider text-center cursor-pointer ${
              isFailureMode
                ? "border-error bg-error/10 text-error hover:bg-error hover:text-text"
                : "border-border hover:border-error/50 hover:text-error"
            }`}
          >
            {isFailureMode ? "RESET RUN SEQUENCE" : "INJECT FAILURE"}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 border border-border bg-surface p-4 rounded-lg shadow-inner font-mono">
          {/* Latency */}
          <div className="flex flex-col">
            <span className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">LATENCY</span>
            <span className="text-lg font-bold text-text-mono transition-all">
              {metrics.latency} <span className="text-xs font-normal text-text-3">ms</span>
            </span>
          </div>

          {/* Tokens */}
          <div className="flex flex-col">
            <span className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">TOKENS</span>
            <span className="text-lg font-bold text-text">
              {metrics.tokens}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col">
            <span className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">SCORE</span>
            <span
              className={`text-lg font-bold transition-colors ${
                metrics.score === "0.00"
                  ? "text-text"
                  : isScorePass
                  ? "text-success"
                  : "text-error"
              }`}
            >
              {metrics.score}
            </span>
          </div>

          {/* Retries */}
          <div className="flex flex-col">
            <span className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">RETRIES</span>
            <span className={`text-lg font-bold ${metrics.retries > 0 ? "text-warning" : "text-text"}`}>
              {metrics.retries}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column (DAG Visualization Canvas) */}
      <div className="w-full h-full min-h-[460px] flex items-center justify-center relative">
        <NetworkScene
          isFailureMode={isFailureMode}
          triggerFailure={triggerFailure}
          resetFailure={resetFailure}
          onMetricsChange={handleMetricsChange}
          onInspectNode={handleInspectNode}
        />
      </div>
    </section>
  )
}
