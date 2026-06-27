"use client"

import { useEffect, useState } from "react"

function getISTStatus() {
  // IST = UTC+5:30
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const ist = new Date(utc + 5.5 * 3600000)
  const hour = ist.getHours()
  const day = ist.getDay() // 0=Sun, 6=Sat

  const timeStr = ist.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toUpperCase()

  if (day === 0 || day === 6) {
    return { status: "ONLINE", label: "Weekend — usually responds fast", color: "success", time: timeStr }
  }
  if (hour >= 9 && hour < 23) {
    return { status: "ONLINE", label: "Active working hours", color: "success", time: timeStr }
  }
  return { status: "ASYNC", label: "Sleeping — responds by morning IST", color: "warning", time: timeStr }
}

export function AvailabilityWidget() {
  const [data, setData] = useState(getISTStatus)

  useEffect(() => {
    const interval = setInterval(() => setData(getISTStatus()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-surface font-mono text-[10px]">
      {/* Clock */}
      <div className="flex flex-col items-center border-r border-border/50 pr-3">
        <span className="text-text-3 uppercase tracking-wider text-[8px]">IST</span>
        <span className="text-text-mono font-bold">{data.time}</span>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              data.color === "success" ? "bg-success animate-pulse" : "bg-warning animate-pulse"
            }`}
          />
          <span className={`font-bold tracking-wider ${data.color === "success" ? "text-success" : "text-warning"}`}>
            {data.status}
          </span>
        </div>
        <span className="text-text-3">{data.label}</span>
      </div>

      {/* Response time */}
      <div className="border-l border-border/50 pl-3 flex flex-col gap-0.5">
        <span className="text-text-3 text-[8px] uppercase tracking-wider">Avg response</span>
        <span className="text-text font-bold">&lt; 24h</span>
      </div>
    </div>
  )
}