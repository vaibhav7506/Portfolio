"use client"

import React, { useEffect, useState, useRef } from "react"

interface Step {
  id: number
  title: string
  subtitle: string
  description: string
  impact: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "1. Goal Decomposition",
    subtitle: "Planner Layer",
    description: "The platform receives a high-level prompt, like 'stress-test Q3 payment gateway.' The Planner breaks this down into dependency subtasks, validating parameters and checking limits.",
    impact: "Impact: Ambiguous goals are rejected at the edge, saving up to 60% of API token budget before processing.",
  },
  {
    id: 2,
    title: "2. Intelligent Routing",
    subtitle: "Vector Matcher",
    description: "Router evaluates matching scores of specialist agents. It measures the capability score (e.g. Research: 94%, Executor: 91%) and spins up isolates on Cloudflare Workers.",
    impact: "Impact: Tasks route to optimal LLM contexts (e.g. Groq for speed, Gemini Flash for cache depth).",
  },
  {
    id: 3,
    title: "3. Quality Gate Evaluation",
    subtitle: "Weighted Scoring",
    description: "The Evaluator runs a quality check. It scores outputs across Coherence, Accuracy, Completeness, and Safety. A strict threshold score of 7.5/10.0 must be met.",
    impact: "Impact: Invalid data or hallucinated JSON results are automatically filtered, preventing downstream database pollution.",
  },
  {
    id: 4,
    title: "4. Recovery & Persistence",
    subtitle: "Durable Object Alarm",
    description: "If score >= 7.5, Memory writes vectors to D1 database. If score < 7.5, a Durable Object alarm coordinates a retry. It logs failure type (INFRA vs BUSINESS) and re-runs the loop.",
    impact: "Impact: Eliminates silent failures. System automatically recovers and logs plain-English audit trails.",
  },
]

export function LoopOSSection() {
  const [activeStep, setActiveStep] = useState(1)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = STEPS.map((step, idx) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(step.id)
            }
          })
        },
        {
          root: null,
          rootMargin: "-40% 0px -40% 0px", // triggers when card is in center of viewport
        }
      )

      const element = stepRefs.current[idx]
      if (element) {
        observer.observe(element)
      }

      return { observer, element }
    })

    return () => {
      observers.forEach(({ observer, element }) => {
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [])

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50">
      {/* Header */}
      <div className="flex flex-col space-y-3 mb-16">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          DEEP DIVE
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          LoopOS Scrollytelling deep-dive
        </h2>
        <p className="text-sm text-text-2 max-w-2xl font-sans leading-relaxed">
          Scroll down to trace how LoopOS observes, evaluates, and recovers from failures in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start relative">
        {/* Left Column: Scrolling cards */}
        <div className="space-y-[30vh] pb-[20vh]">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => {
                stepRefs.current[idx] = el
              }}
              className={`p-8 border rounded-lg bg-surface transition-all duration-300 ${
                activeStep === step.id
                  ? "border-accent/40 shadow-2xl scale-102"
                  : "border-border/55 opacity-40"
              }`}
            >
              <span className="font-mono text-xs text-text-mono font-bold uppercase tracking-wider">
                {step.subtitle}
              </span>
              <h3 className="text-lg font-bold text-text mt-2 mb-4">
                {step.title}
              </h3>
              <p className="text-xs text-text-2 leading-relaxed mb-4">
                {step.description}
              </p>
              <div className="p-3 bg-accent-dim border border-accent/20 rounded font-mono text-[10px] text-accent leading-relaxed">
                {step.impact}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Sticky SVG Loop visualizer */}
        <div className="hidden lg:block sticky top-[120px] h-[450px] border border-border bg-[#0A0D12] rounded-lg overflow-hidden p-6 shadow-panel">
          <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-6 font-mono text-[10px]">
            <span className="text-text-3 font-semibold uppercase tracking-wider">
              Loop Telemetry Visualizer
            </span>
            <span className="text-text-mono font-bold">STEP 0{activeStep} / 04</span>
          </div>

          <div className="w-full h-[320px] flex items-center justify-center">
            <svg viewBox="0 0 400 320" className="w-full h-full select-none">
              {/* Nodes */}
              {/* Planner Node */}
              <rect
                x="40"
                y="40"
                width="100"
                height="40"
                rx="6"
                className={`transition-all duration-300 fill-surface stroke-2 ${
                  activeStep === 1
                    ? "stroke-accent shadow-lg"
                    : activeStep > 1
                    ? "stroke-success"
                    : "stroke-border"
                }`}
              />
              <text
                x="90"
                y="64"
                textAnchor="middle"
                className={`font-mono text-[10px] font-bold ${
                  activeStep === 1 ? "fill-text" : "fill-text-3"
                }`}
              >
                PLANNER
              </text>

              {/* Router Node */}
              <rect
                x="260"
                y="40"
                width="100"
                height="40"
                rx="6"
                className={`transition-all duration-300 fill-surface stroke-2 ${
                  activeStep === 2
                    ? "stroke-accent shadow-lg"
                    : activeStep > 2
                    ? "stroke-success"
                    : "stroke-border"
                }`}
              />
              <text
                x="310"
                y="64"
                textAnchor="middle"
                className={`font-mono text-[10px] font-bold ${
                  activeStep === 2 ? "fill-text" : "fill-text-3"
                }`}
              >
                ROUTER
              </text>

              {/* Evaluator Node */}
              <rect
                x="260"
                y="200"
                width="100"
                height="40"
                rx="6"
                className={`transition-all duration-300 fill-surface stroke-2 ${
                  activeStep === 3
                    ? "stroke-accent shadow-lg"
                    : activeStep > 3
                    ? "stroke-success"
                    : "stroke-border"
                }`}
              />
              <text
                x="310"
                y="224"
                textAnchor="middle"
                className={`font-mono text-[10px] font-bold ${
                  activeStep === 3 ? "fill-text" : "fill-text-3"
                }`}
              >
                EVALUATOR
              </text>

              {/* Persistence / Retry Node */}
              <rect
                x="40"
                y="200"
                width="100"
                height="40"
                rx="6"
                className={`transition-all duration-300 fill-surface stroke-2 ${
                  activeStep === 4 ? "stroke-accent shadow-lg" : "stroke-border"
                }`}
              />
              <text
                x="90"
                y="224"
                textAnchor="middle"
                className={`font-mono text-[10px] font-bold ${
                  activeStep === 4 ? "fill-text" : "fill-text-3"
                }`}
              >
                RECOVERY/MEM
              </text>

              {/* Paths */}
              {/* Planner -> Router */}
              <path
                d="M 140 60 L 260 60"
                stroke={activeStep === 1 ? "var(--accent)" : activeStep > 1 ? "var(--success)" : "var(--border)"}
                strokeWidth="2"
                fill="none"
              />

              {/* Router -> Evaluator */}
              <path
                d="M 310 80 L 310 200"
                stroke={activeStep === 2 ? "var(--accent)" : activeStep > 2 ? "var(--success)" : "var(--border)"}
                strokeWidth="2"
                fill="none"
              />

              {/* Evaluator -> Recovery */}
              <path
                d="M 260 220 L 140 220"
                stroke={activeStep === 3 ? "var(--accent)" : activeStep > 3 ? "var(--success)" : "var(--border)"}
                strokeWidth="2"
                fill="none"
              />

              {/* Recovery -> Planner (retry feedback loop) */}
              <path
                d="M 90 200 L 90 80"
                stroke={activeStep === 4 ? "var(--error)" : "var(--border)"}
                strokeWidth="2"
                strokeDasharray={activeStep === 4 ? "none" : "3 3"}
                fill="none"
              />

              {/* Animation Dots */}
              {activeStep === 1 && (
                <circle r="4" fill="var(--accent)">
                  <animateMotion dur="1s" repeatCount="indefinite" path="M 140 60 L 260 60" />
                </circle>
              )}
              {activeStep === 2 && (
                <circle r="4" fill="var(--accent)">
                  <animateMotion dur="1s" repeatCount="indefinite" path="M 310 80 L 310 200" />
                </circle>
              )}
              {activeStep === 3 && (
                <circle r="4" fill="var(--accent)">
                  <animateMotion dur="1s" repeatCount="indefinite" path="M 260 220 L 140 220" />
                </circle>
              )}
              {activeStep === 4 && (
                <circle r="4" fill="var(--error)">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 90 200 L 90 80" />
                </circle>
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
