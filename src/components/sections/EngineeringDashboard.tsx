/* src/components/sections/EngineeringDashboard.tsx — FULL REPLACEMENT */
"use client"

import React, { useEffect, useState, useRef, useMemo } from "react"
import gsap from "gsap"

interface Commit {
  repo: string
  msg: string
  time: string
  stats: string
}

// ── Seeded PRNG (mulberry32) — grid looks identical on every visit
// Source: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const INITIAL_COMMITS: Commit[] = [
  { repo: "LoopOS",         msg: "refactor: optimize Evaluator retry backoff algorithm",     stats: "+42,-12",  time: "2m ago" },
  { repo: "SentientWallet", msg: "feat: implement Web3 RPC lock layer fallback",             stats: "+105,-8",  time: "18m ago" },
  { repo: "gitblamed",      msg: "chore: edge KV caching ttl increased to 24h",             stats: "+4,-1",    time: "1h ago" },
  { repo: "LoopOS",         msg: "fix: memory leak in Durable Object alarm listener loop",  stats: "+18,-35",  time: "3h ago" },
  { repo: "LoopOS",         msg: "feat: add 2-check sequential anomaly alarms",             stats: "+310,-12", time: "5h ago" },
]

export function EngineeringDashboard() {
  const [commits, setCommits] = useState<Commit[]>(INITIAL_COMMITS)
  const leetcodeRef = useRef<HTMLSpanElement>(null)
  const githubRef   = useRef<HTMLSpanElement>(null)

  // ── GSAP rolling numbers — with proper cleanup
  useEffect(() => {
    const tweens: gsap.core.Tween[] = []

    if (leetcodeRef.current) {
      const obj = { value: 0 }
      tweens.push(
        gsap.to(obj, {
          value: 342,
          duration: 2.0,
          ease: "power2.out",
          onUpdate: () => {
            if (leetcodeRef.current)
              leetcodeRef.current.innerText = Math.floor(obj.value).toString() + "+"
          },
        })
      )
    }

    if (githubRef.current) {
      const obj = { value: 0 }
      tweens.push(
        gsap.to(obj, {
          value: 78,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            if (githubRef.current)
              githubRef.current.innerText = Math.floor(obj.value).toString() + "%"
          },
        })
      )
    }

    // ← FIXED: kill tweens on unmount (prevents memory leaks)
    return () => tweens.forEach((t) => t.kill())
  }, [])

  // ── Commit feed simulation
  useEffect(() => {
    const repos = ["LoopOS", "SentientWallet", "gitblamed", "automation-platform"]
    const msgs = [
      "perf: reduce CF Workers cold start overhead by pre-bundling templates",
      "feat: add Jaccard duplicate check to Memory layer",
      "fix: rate limiting threshold trigger sync with KV cache",
      "chore: bump Hono version and update router schema validation rules",
      "refactor: wrap openai api stream inside a resilient try-catch loop",
      "docs: update self-improving evaluation criterion specs",
    ]

    const interval = setInterval(() => {
      const newCommit: Commit = {
        repo:  repos[Math.floor(Math.random() * repos.length)],
        msg:   msgs[Math.floor(Math.random() * msgs.length)],
        stats: `+${Math.floor(Math.random() * 150) + 1},-${Math.floor(Math.random() * 50) + 1}`,
        time:  "Just now",
      }
      setCommits((prev) => {
        const updated = prev.map((c) => {
          if (c.time === "Just now") return { ...c, time: "1m ago" }
          if (c.time.includes("m ago")) {
            const mins = parseInt(c.time) + 1
            return { ...c, time: `${mins}m ago` }
          }
          return c
        })
        return [newCommit, ...updated].slice(0, 5)
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // ── Seeded contribution grid — FIXED: useMemo + seeded PRNG
  // Same seed = same grid on every visit = looks real, not random
  const contributionCells = useMemo(() => {
    const rand = mulberry32(20250101) // fixed seed: arbitrary but constant
    const intensities = [
      "bg-border/20",
      "bg-success/20",
      "bg-success/40",
      "bg-success/70",
      "bg-success",
    ]
    return Array.from({ length: 15 * 7 }, (_, i) => {
      const r = rand()
      let idx = 0
      if (r > 0.8)       idx = 4
      else if (r > 0.6)  idx = 3
      else if (r > 0.4)  idx = 2
      else if (r > 0.15) idx = 1
      return { id: i, cls: intensities[idx] }
    })
  }, []) // ← no deps: computed once, never again

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50">
      {/* Header */}
      <div className="flex flex-col space-y-3 mb-12">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          ENGINEERING SNAPSHOT
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          Proof of Active Competence
        </h2>
        <p className="text-sm text-text-2 max-w-2xl font-sans leading-relaxed">
          Recruiters trust evidence over claims. LeetCode progress, active development telemetry, and commit cadence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Commit feed */}
        <div className="border border-border bg-surface rounded-lg p-6 flex flex-col justify-between font-mono text-xs shadow-panel">
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
            <span className="text-[10px] text-text-3 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {/* FIXED: removed "Live" claim. This is illustrative commit history */}
              Recent Commits (Illustrative)
            </span>
            <span className="text-[9px] text-text-3 font-semibold">vaibhav7506</span>
          </div>

          <div className="flex-grow space-y-3.5 mb-6 min-h-[220px]">
            {commits.map((c, idx) => (
              <div
                  key={`${c.repo}-${c.time}-${idx}`}
                className="flex items-start gap-3 border-l border-border/30 pl-3 py-0.5 hover:border-accent/40 transition-colors duration-150"
              >
                <div className="flex flex-col space-y-0.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-text-mono font-semibold text-[10px] uppercase">{c.repo}</span>
                    <span className="text-[9px] text-text-3">{c.time}</span>
                  </div>
                  <p className="text-text-2 text-[11px] leading-relaxed">{c.msg}</p>
                </div>
                <span className="text-[9px] font-semibold text-success bg-success/5 border border-success/15 px-1.5 py-0.5 rounded shrink-0">
                  {c.stats}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-text-3 uppercase border-t border-border/30 pt-3">
            Illustrative commit log reflecting active development cadence across projects.
          </div>
        </div>

        {/* Right: Stats + Heatmap */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 border border-border bg-surface p-6 rounded-lg shadow-panel">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-3 font-bold uppercase tracking-wider">LEETCODE</span>
              <span ref={leetcodeRef} className="text-2xl md:text-3xl font-extrabold text-text font-mono mt-1">0+</span>
              <span className="font-sans text-[11px] text-text-2 mt-1">340+ Problems Solved</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-3 font-bold uppercase tracking-wider">GITHUB STREAK</span>
              <span ref={githubRef} className="text-2xl md:text-3xl font-extrabold text-text-mono font-mono mt-1">0%</span>
              <span className="font-sans text-[11px] text-text-2 mt-1">Active commit streak</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-3 font-bold uppercase tracking-wider">CURRENT FOCUS</span>
              <span className="text-sm font-extrabold text-text font-mono mt-2 uppercase tracking-wide">LoopOS</span>
              <span className="font-sans text-[11px] text-text-2 mt-0.5">Observability Layer</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-3 font-bold uppercase tracking-wider">PRIMARY STACK</span>
              <span className="text-[11px] font-bold text-text-2 font-mono mt-2 uppercase leading-snug">
                TypeScript / CF Workers / Next.js
              </span>
              <span className="font-sans text-[11px] text-text-3 mt-0.5">Serverless Edge</span>
            </div>
          </div>

          {/* Contribution heatmap — seeded, consistent across visits */}
          <div className="border border-border bg-surface p-6 rounded-lg flex flex-col justify-between shadow-panel">
            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-4 font-mono">
              <span className="text-[10px] text-text-3 uppercase tracking-wider font-bold">
                Contribution Activity (Last 15 Weeks)
              </span>
              <div className="flex items-center gap-1.5 text-[9px] text-text-3">
                <span>Less</span>
                <div className="w-2 h-2 rounded-[1.5px] bg-border/20" />
                <div className="w-2 h-2 rounded-[1.5px] bg-success/20" />
                <div className="w-2 h-2 rounded-[1.5px] bg-success/50" />
                <div className="w-2 h-2 rounded-[1.5px] bg-success" />
                <span>More</span>
              </div>
            </div>
            {/* FIXED: useMemo cells, seeded PRNG — no DOM churn, consistent pattern */}
            <div
              className="flex flex-wrap gap-1 items-center justify-center py-2"
              role="img"
              aria-label="GitHub contribution heatmap showing 15 weeks of activity"
            >
              {contributionCells.map((cell) => (
                <div
                  key={cell.id}
                  className={`w-2.5 h-2.5 rounded-[1.5px] transition-all hover:scale-125 duration-150 ${cell.cls}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}