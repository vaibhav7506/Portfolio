"use client"

import { useEffect, useRef, useState } from "react"
import { projects, projectStatusLabels } from "@/lib/projects"

const RESPONSES: Record<string, string[]> = {
  "sudo hire vaibhav": [
    "$ sudo hire vaibhav",
    "[sudo] opening the hiring conversation...",
    `${projects.length} projects available to review`,
    "Source links and limitations are in each case study.",
    "",
    "ACCESS GRANTED",
    "To arrange an interview, send a few time options:",
    "→ vs7977722@gmail.com",
  ],
  "help": [
    "$ help",
    "Available commands:",
    "  sudo hire vaibhav   — The obvious one",
    "  ls projects         — List all projects",
    "  cat about.txt       — Who is this guy",
    "  ping vaibhav        — Check availability",
    "  stack               — View tech stack",
    "  salary              — You know you want to",
    "  diagnose            — View portfolio evidence links",
    "  interview vaibhav   — Contact about an interview",
    "  achievements        — View unlocked achievements",
    "  secret              — ???",
    "  clear               — Clear terminal",
  ],
  "ls projects": [
    "$ ls projects/",
    ...projects.map((project) => `${project.title.padEnd(22)} ${projectStatusLabels[project.status]}`),
    "",
    `${projects.length} projects — source and case studies available`,
  ],
  "cat about.txt": [
    "$ cat about.txt",
    "Name:       Vaibhav Sharma",
    "Degree:     CS Engineering, MMMUT 2026",
    "Focus:      AI agent infrastructure",
    "Stack:      TypeScript, CF Workers, Next.js",
    "LeetCode:   leetcode.com/u/vaibhav7506/",
    "Football:   Captain (yes, both kinds of systems)",
    "",
    "Available for: Full-time, internships, freelance",
  ],
  "ping vaibhav": [
    "$ ping vaibhav.dev",
    "Availability: open to full-time roles and internships",
    "Timezone: IST",
    "",
    "→ Contact: vs7977722@gmail.com",
  ],
  "stack": [
    "$ cat stack.config",
    "",
    "PROJECT STACK",
    "─────────────────────────────────",
    "Runtime     Cloudflare Workers + Node.js",
    "Framework   Next.js 16",
    "Language    TypeScript + Python",
    "AI Layer    Groq → Gemini → Claude (fallback chain)",
    "Database    Cloudflare D1 + KV",
    "Agents      LangChain + custom orchestration",
    "Deploy      Vercel + Cloudflare Pages",
    "Observ.     Cloudflare AI Gateway",
    "─────────────────────────────────",
    "→ See case studies for implementation details and limits",
  ],
  "salary": [
    "$ calculating market_rate --honest",
    "",
    "Compensation depends on the role and scope.",
    "No market-rate lookup is performed by this terminal.",
    "",
    "Let's discuss the opportunity directly.",
    "",
    "→ vs7977722@gmail.com",
    "→ Response time: < 24 hours",
  ],
  "diagnose": [
    "$ diagnose --full",
    "",
    "Portfolio evidence index",
    "",
    `Case studies: ${projects.length}`,
    "Source and implementation evidence: /#work",
    "Public GitHub activity: /#proof",
    "Machine-readable profile: /llm.txt",
    "SentientWallet: prototype with simulated execution",
    "TracePilot: in development",
    "",
    "This command does not run a performance or uptime benchmark.",
  ],
  "interview vaibhav": [
    "$ schedule interview --candidate=vaibhav",
    "",
    "Share your proposed time, timezone, and role by email.",
    "Response target: within 24 hours",
    "Timezone: IST",
    "",
    "To schedule:",
    "→ vs7977722@gmail.com",
    "→ Subject: Interview — [Your Company]",
    "",
    "Opening email...",
  ],
  "achievements": [
    "$ cat achievements.log",
    "",
    "ACHIEVEMENTS UNLOCKED",
    "─────────────────────────────────",
    "[★] Built a treasury proposal and validation prototype",
    "[★] Implemented sequential provider fallback in GitBlamed",
    "[★] Public JavaScript-to-TypeScript migration demo PR",
    "[★] Captained university football team",
    `[★] ${projects.length} projects documented in the current portfolio`,
    "[★] Portfolio with live execution trace animation",
    "[★] You found the terminal. Respect.",
    "─────────────────────────────────",
    "",
    "Hidden achievement: try 'secret'",
  ],
  "secret": [
    "$ ./secret.sh",
    "",
    "Decrypting...",
    "",
    "If you're reading this at 2AM evaluating candidates,",
    "you deserve a great hire.",
    "",
    "Vaibhav built this terminal because he believes",
    "the best engineers leave traces of curiosity",
    "everywhere they go.",
    "",
    "You found one.",
    "",
    "→ vs7977722@gmail.com",
    "→ Let's build something.",
  ],
  "whoami": [
    "$ whoami",
    "vaibhav",
    "",
    "A CS engineer who asks 'what breaks' before",
    "'what should it do'.",
    "",
    "Currently: Building LoopOS",
    "Previously: GitBlamed, SentientWallet, AutomationPlatform",
    "Always: Thinking in systems",
  ],
  "ls": [
    "$ ls",
    "projects/   resume/   contact/   system/   secrets/",
    "",
    "Try: ls projects",
  ],
  "cat": [
    "$ cat",
    "Usage: cat <filename>",
    "Example: cat about.txt",
  ],
  "clear": [],
}

const EASTER_EGG_TRIGGER = ["sudo", "ls", "cat", "ping", "help"]

const OPEN_EMAIL_COMMANDS = ["sudo hire vaibhav", "interview vaibhav", "salary"]

export function EasterEggTerminal() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [lines, setLines] = useState<{ text: string; type: "input" | "output" | "success" | "error" }[]>([
    { text: "VAIBHAV OS v1.0.0 — Portfolio shortcuts. Type 'help' for commands.", type: "output" },
    { text: "Hint: try  sudo hire vaibhav", type: "output" },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingRef = useRef<NodeJS.Timeout[]>([])
  const bufferRef = useRef("")

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  const typeLines = (outputLines: string[], isSuccess: boolean, triggerEmail?: boolean) => {
    typingRef.current.forEach(clearTimeout)
    typingRef.current = []

    outputLines.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            text: line,
            type: isSuccess && (
              line.includes("GRANTED") ||
              line.includes("scheduled") ||
              line.includes("STRONG") ||
              line.includes("ONLINE") ||
              line.includes("★") ||
              line.includes("✓")
            )
              ? "success"
              : line.startsWith("→")
              ? "success"
              : "output",
          },
        ])
      }, i * 80)
      typingRef.current.push(t)
    })

    // Open Gmail after typing completes for relevant commands
    if (triggerEmail) {
      const totalDelay = outputLines.length * 80 + 400
      const t = setTimeout(() => {
        const a = document.createElement("a")
        a.href = "https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
        a.target = "_blank"
        a.rel = "noopener noreferrer"
        a.click()
      }, totalDelay)
      typingRef.current.push(t)
    }
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
    const triggerEmail = OPEN_EMAIL_COMMANDS.includes(cmd)

    if (response) {
      typeLines(response.slice(1), ["sudo hire vaibhav", "diagnose", "achievements", "ping vaibhav", "interview vaibhav"].includes(cmd), triggerEmail)
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
                : line.type === "error"
                ? "text-error"
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
