"use client"

import { useCallback, useState } from "react"
import { NetworkScene } from "./NetworkScene"
import { ExploreLoopOSLink } from "./ExploreLoopOSLink"
import { FailureControl } from "./FailureControl"

export function HeroSection() {
  const [isFailureMode, setIsFailureMode] = useState(false)
  const [metrics, setMetrics] = useState({
    latency: 0,
    tokens: 0,
    score: "0.00",
    retries: 0,
  })

  const triggerFailure = () => {
    setIsFailureMode(true)
  }

  const resetFailure = useCallback(() => {
    setIsFailureMode(false)
  }, [])

  const scoreNum = parseFloat(metrics.score)
  const isScorePass = scoreNum >= 7.5 || scoreNum === 0

  return (
    <section aria-labelledby="loopos-introduction" className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-center min-h-[calc(100vh-56px)]">
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
          <h2 id="loopos-introduction" className="text-3xl md:text-4xl font-extrabold text-text tracking-tight leading-tight">
            Building agent infrastructure with guardrails, evaluators, and recovery loops.
          </h2>
          <p className="text-sm text-text-2 leading-relaxed font-sans">
            Built LoopOS, SentientWallet, and GitBlamed — using Cloudflare Workers, Next.js, and multi-agent architectures.
          </p>
          <p className="text-xs text-text-3 leading-relaxed">The agent scene below is a conceptual animation with sample events and metrics, rather than a recording of the deployed LoopOS executor.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono">
          <ExploreLoopOSLink href="/work/loopos#case-study" />
          <FailureControl isFailureMode={isFailureMode}
            onToggle={() => {
              if (isFailureMode) {
                resetFailure()
              } else {
                triggerFailure()
              }
            }}
          />
        </div>

        {/* Metrics Grid */}
        <div aria-label="Illustrative run metrics" className="grid grid-cols-2 gap-4 border border-border bg-surface p-4 rounded-lg shadow-inner font-mono">
          <p className="col-span-2 text-[10px] text-text-2 font-semibold uppercase tracking-wide">Illustrative run · sample metrics</p>
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
          key={isFailureMode ? "failure" : "normal"}
          isFailureMode={isFailureMode}
          resetFailure={resetFailure}
          onMetricsChange={setMetrics}
        />
      </div>
    </section>
  )
}
