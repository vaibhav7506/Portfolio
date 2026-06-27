"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0
      setPercent(pct)
    }
    window.addEventListener("scroll", handler, { passive: true })
    handler()
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const totalBars = 10
  const filledBars = Math.round((percent / 100) * totalBars)
  const bar = "█".repeat(filledBars) + "░".repeat(totalBars - filledBars)

  return (
    <div className="fixed top-[56px] left-0 right-0 z-40 h-[26px] bg-[#0A0D12]/90 border-b border-border/50 backdrop-blur-sm flex items-center justify-center font-mono text-[10px] text-text-3 select-none pointer-events-none">
      <span className="tracking-wider">MISSION PROGRESS&nbsp;&nbsp;</span>
      <span className="text-accent">{bar}</span>
      <span className="ml-2 text-text-mono font-bold">{percent}%</span>
    </div>
  )
}