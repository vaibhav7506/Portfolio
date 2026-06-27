"use client"

import { useEffect, useState, useRef } from "react"

export function DebugOverlay() {
  const [visible, setVisible] = useState(false)
  const [fps, setFps] = useState(0)
  const [memory, setMemory] = useState<string>("--")
  const [scrollY, setScrollY] = useState(0)
  const [renderCount, setRenderCount] = useState(0)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const framesRef = useRef(0)

  // Shift key toggle
  useEffect(() => {
    let shiftTimer: NodeJS.Timeout
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        shiftTimer = setTimeout(() => setVisible((v) => !v), 600)
      }
    }
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") clearTimeout(shiftTimer)
    }
    window.addEventListener("keydown", onDown)
    window.addEventListener("keyup", onUp)
    return () => {
      window.removeEventListener("keydown", onDown)
      window.removeEventListener("keyup", onUp)
      clearTimeout(shiftTimer)
    }
  }, [])

  // FPS counter
  useEffect(() => {
    if (!visible) return
    const tick = () => {
      framesRef.current++
      const now = performance.now()
      if (now - lastTimeRef.current >= 1000) {
        setFps(framesRef.current)
        framesRef.current = 0
        lastTimeRef.current = now
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [visible])

  // Memory + scroll
  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      // @ts-ignore — performance.memory is Chrome-only
      const mem = (performance as any).memory
      if (mem) {
        setMemory(`${Math.round(mem.usedJSHeapSize / 1048576)}MB`)
      }
      setScrollY(Math.round(window.scrollY))
      setRenderCount((c) => c + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  const fpsColor = fps >= 55 ? "text-success" : fps >= 30 ? "text-warning" : "text-error"

  return (
    <div className="fixed top-[72px] right-4 z-[300] font-mono text-[9px] pointer-events-none select-none space-y-1">
      {[
        { label: "FPS",      value: `${fps}`, valueClass: fpsColor },
        { label: "MEMORY",   value: memory,   valueClass: "text-text-mono" },
        { label: "SCROLL Y", value: `${scrollY}px`, valueClass: "text-text-2" },
        { label: "RENDERS",  value: `${renderCount}`, valueClass: "text-text-2" },
        { label: "VIEWPORT", value: typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : "--", valueClass: "text-text-2" },
        { label: "ENV",      value: "CF WORKERS EDGE", valueClass: "text-accent" },
        { label: "MOTION",   value: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "REDUCED" : "FULL", valueClass: "text-text-2" },
      ].map(({ label, value, valueClass }) => (
        <div
          key={label}
          className="flex items-center justify-between gap-4 px-2.5 py-1 rounded bg-[#0A0D12]/90 border border-border/50 backdrop-blur-sm"
          style={{ minWidth: "160px" }}
        >
          <span className="text-text-3 uppercase tracking-wider">{label}</span>
          <span className={`font-bold ${valueClass}`}>{value}</span>
        </div>
      ))}
      <div className="px-2.5 py-1 rounded bg-[#0A0D12]/90 border border-accent/20 text-accent/60 text-center">
        HOLD SHIFT TO HIDE
      </div>
    </div>
  )
}