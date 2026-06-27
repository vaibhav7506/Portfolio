"use client"

import { useEffect, useRef, useState } from "react"

const RESPONSES: Record<string, string[]> = {
  "sudo hire vaibhav": [
    "$ sudo hire vaibhav",
    "[sudo] verifying credentials...",
    "✓ Portfolio reviewed",
    "✓ GitHub inspected",
    "✓ Case studies evaluated",
    "✓ Systems thinking: CONFIRMED",
    "",
    "ACCESS GRANTED",
    "Interview scheduled. Check your calendar.",
    "→ vs7977722@gmail.com",
  ],
  "help": [
    "$ help",
    "Available commands:",
    "  sudo hire vaibhav   — The obvious one",
    "  ls projects         — List all projects",
    "  cat about.txt       — Who is this guy",
    "  ping vaibhav        — Check availability",
    "  clear               — Clear terminal",
  ],
  "ls projects": [
    "$ ls projects/",
    "drwxr-xr-x  LoopOS/          AI loop observability platform",
    "drwxr-xr-x  GitBlamed/       Viral GitHub roaster, 3-provider AI",
    "drwxr-xr-x  SentientWallet/  Autonomous DAO treasury agent",
    "drwxr-xr-x  AutomationPlatform/ DAG workflow engine, 15 APIs",
    "",
    "4 directories, 0 toy projects",
  ],
  "cat about.txt": [
    "$ cat about.txt",
    "Name:       Vaibhav Sharma",
    "Degree:     CS Engineering, MMMUT 2026",
    "Focus:      AI agent infrastructure",
    "Stack:      TypeScript, CF Workers, Next.js",
    "LeetCode:   340+ solved",
    "Football:   Captain (yes, both kinds of systems)",
    "",
    "Available for: Full-time, internships, freelance",
  ],
  "ping vaibhav": [
    "$ ping vaibhav.dev",
    "PING vaibhav.dev: 56 bytes of data",
    "64 bytes: seq=0 ttl=64 time=0.42ms",
    "64 bytes: seq=1 ttl=64 time=0.38ms",
    "64 bytes: seq=2 ttl=64 time=0.41ms",
    "",
    "→ vaibhav is ONLINE and AVAILABLE",
  ],
  "clear": [],
}

const EASTER_EGG_TRIGGER = ["sudo", "ls", "cat", "ping", "help"]

export function EasterEggTerminal() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [lines, setLines] = useState<{ text: string; type: "input" | "output" | "success" | "error" }[]>([
    { text: "VAIBHAV OS v1.0.0 — Type 'help' for commands", type: "output" },
    { text: "Hint: try  sudo hire vaibhav", type: "output" },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingRef = useRef<NodeJS.Timeout[]>([])

  // Detect trigger words while typing anywhere on page
  const bufferRef = useRef("")

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack input fields
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return

      if (e.key === "`" && (e.metaKey || e.ctrlKey)) {
        setOpen((p) => !p)
        return
      }

      bufferRef.current = (bufferRef.current + e.key).slice(-20)
      if (EASTER_EGG_TRIGGER.some((t) => bufferRef.current.includes(t))) {
        setOpen(true)
        bufferRef.current = ""
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const typeLines = (outputLines: string[], isSuccess: boolean) => {
    typingRef.current.forEach(clearTimeout)
    typingRef.current = []

    outputLines.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            text: line,
            type: isSuccess && (line.includes("GRANTED") || line.includes("scheduled"))
              ? "success"
              : line.startsWith("→")
              ? "success"
              : "output",
          },
        ])
      }, i * 80)
      typingRef.current.push(t)
    })
  }

  const handleSubmit = () => {
    const cmd = input.trim().toLowerCase()
    if (!cmd) return

    setHistory((h) => [cmd, ...h])
    setHistoryIdx(-1)
    setLines((prev) => [...prev, { text: `$ ${cmd}`, type: "input" }])
    setInput("")

    if (cmd === "clear") {
      setTimeout(() => setLines([{ text: "Terminal cleared.", type: "output" }]), 100)
      return
    }

    const response = RESPONSES[cmd]
    if (response) {
      typeLines(response.slice(1), cmd === "sudo hire vaibhav")
    } else {
      typeLines([`Command not found: ${cmd}`, "Type 'help' for available commands."], false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit()
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const idx = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(idx)
      setInput(history[idx] ?? "")
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? "" : history[idx])
    }
    if (e.key === "Escape") setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed bottom-6 left-6 z-[150] w-[440px] max-w-[calc(100vw-3rem)] bg-[#0A0D12] border border-border rounded-lg shadow-2xl overflow-hidden font-mono text-xs"
      style={{ maxHeight: "340px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-[#0F1318]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
        </div>
        <span className="text-text-3 text-[9px] font-bold tracking-wider">VAIBHAV_OS — bash</span>
        <button
          onClick={() => setOpen(false)}
          className="text-text-3 hover:text-text text-[10px] cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Output */}
      <div className="px-4 py-3 overflow-y-auto space-y-1" style={{ maxHeight: "240px" }}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "input"
                ? "text-text-mono"
                : line.type === "success"
                ? "text-success font-bold"
                : "text-text-2"
            }
          >
            {line.text || <>&nbsp;</>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border">
        <span className="text-success font-bold">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent text-text-mono outline-none placeholder:text-text-3"
          placeholder="type a command..."
          autoComplete="off"
          spellCheck={false}
        />
        <span className="w-1.5 h-4 bg-accent animate-pulse" />
      </div>
    </div>
  )
}