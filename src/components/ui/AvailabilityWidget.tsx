"use client"

import { useSyncExternalStore } from "react"

const subscribeClock = (notify: () => void) => {
  const interval = setInterval(notify, 1000)
  return () => clearInterval(interval)
}
const getClockSnapshot = () => Math.floor(Date.now() / 60000)
const getServerClockSnapshot = () => null

function getISTStatus(timestamp: number) {
  const now = new Date(timestamp)
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(now)
  const hour = Number(parts.find((part) => part.type === "hour")?.value)
  const day = parts.find((part) => part.type === "weekday")?.value

  const timeStr = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toUpperCase()

  if (day === "Sun" || day === "Sat") {
    return { status: "ONLINE", label: "Weekend — usually responds fast", color: "success", time: timeStr }
  }
  if (hour >= 9 && hour < 23) {
    return { status: "ONLINE", label: "Active working hours", color: "success", time: timeStr }
  }
  return { status: "ASYNC", label: "Sleeping — responds by morning IST", color: "warning", time: timeStr }
}

export function AvailabilityWidget() {
  // A stable server snapshot avoids time mismatches during hydration and cached navigation.
  const minute = useSyncExternalStore<number | null>(subscribeClock, getClockSnapshot, getServerClockSnapshot)
  const data = minute === null ? null : getISTStatus(minute * 60000)

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-surface font-mono text-[10px]">
      {/* Clock */}
      <div className="flex flex-col items-center border-r border-border/50 pr-3">
        <span className="text-text-3 uppercase tracking-wider text-[8px]">IST</span>
        <span className="text-text-mono font-bold">{data?.time ?? "—:—"}</span>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              data === null ? "bg-text-3" : data.color === "success" ? "bg-success animate-pulse" : "bg-warning animate-pulse"
            }`}
          />
          <span className={`font-bold tracking-wider ${data === null ? "text-text-3" : data.color === "success" ? "text-success" : "text-warning"}`}>
            {data?.status ?? "—"}
          </span>
        </div>
        <span className="text-text-3">{data?.label ?? "Checking local time…"}</span>
      </div>

      {/* Response time */}
      <div className="border-l border-border/50 pl-3 flex flex-col gap-0.5">
        <span className="text-text-3 text-[8px] uppercase tracking-wider">Response target</span>
        <span className="text-text font-bold">&lt; 24h</span>
      </div>
    </div>
  )
}
