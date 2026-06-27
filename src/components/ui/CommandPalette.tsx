"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

interface Command {
  id: string
  label: string
  category: string
  action: () => void
  shortcut?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const commands: Command[] = [
    {
      id: "projects",
      label: "View Projects",
      category: "NAVIGATE",
      action: () => { document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); setOpen(false) },
      shortcut: "P",
    },
    {
      id: "about",
      label: "About Vaibhav",
      category: "NAVIGATE",
      action: () => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); setOpen(false) },
      shortcut: "A",
    },
  {
  id: "contact",
  label: "Send Email",
  category: "NAVIGATE",
  action: () => {
    const a = document.createElement("a")
    a.href = "https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
    a.target = "_blank"
    a.rel = "noopener noreferrer"
    a.click()
    setOpen(false)
  },
},
    {
      id: "github",
      label: "Open GitHub",
      category: "NAVIGATE",
      action: () => { window.open("https://github.com/vaibhav7506", "_blank"); setOpen(false) },
    },
    {
      id: "resume-swe",
      label: "Download Resume (SWE)",
      category: "FILES",
      action: () => { window.open("/Vaibhav_resume.pdf", "_blank"); setOpen(false) },
    },
    {
      id: "resume-aiml",
      label: "Download Resume (AI/ML)",
      category: "FILES",
      action: () => { window.open("/Vaibhav_AIML_resume.pdf", "_blank"); setOpen(false) },
    },
    {
      id: "loopos",
      label: "LoopOS — Case Study",
      category: "PROJECTS",
      action: () => { router.push("/work/loopos"); setOpen(false) },
    },
    {
      id: "gitblamed",
      label: "GitBlamed — Case Study",
      category: "PROJECTS",
      action: () => { router.push("/work/gitblamed"); setOpen(false) },
    },
    {
      id: "sentientwallet",
      label: "SentientWallet — Case Study",
      category: "PROJECTS",
      action: () => { router.push("/work/sentientwallet"); setOpen(false) },
    },
    {
      id: "automation",
      label: "Automation Platform — Case Study",
      category: "PROJECTS",
      action: () => { router.push("/work/automation-platform"); setOpen(false) },
    },
    {
      id: "linkedin",
      label: "Open LinkedIn",
      category: "NAVIGATE",
      action: () => { window.open("https://www.linkedin.com/in/vaibhav-sharma-996aa8249/", "_blank"); setOpen(false) },
    },
  ]

  const filtered = query.trim() === ""
    ? commands
    : commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )

  // Group by category
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  const flat = Object.values(grouped).flat()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setOpen((prev) => !prev)
      setQuery("")
      setSelected(0)
    }
    if (e.key === "Escape") setOpen(false)
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, flat.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === "Enter") {
      flat[selected]?.action()
    }
  }

  if (!open) return (
    <button
      onClick={() => { setOpen(true); setQuery(""); setSelected(0) }}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface hover:border-accent/40 transition-all duration-150 font-mono text-[10px] text-text-3 hover:text-text cursor-pointer"
      title="Open command palette"
    >
      <span>⌘K</span>
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg bg-[#0F1318] border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handlePaletteKeyDown}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <span className="text-accent font-mono text-sm font-bold">{">"}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
            placeholder="Type a command or search..."
            className="flex-grow bg-transparent font-mono text-sm text-text placeholder:text-text-3 outline-none"
          />
          <kbd className="text-[10px] font-mono text-text-3 border border-border px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2 scrollbar-none">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-4 py-1.5 font-mono text-[9px] font-bold text-text-3 tracking-widest uppercase">
                {category}
              </div>
              {cmds.map((cmd) => {
                const globalIdx = flat.findIndex((c) => c.id === cmd.id)
                const isSelected = globalIdx === selected
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelected(globalIdx)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors duration-100 cursor-pointer ${
                      isSelected ? "bg-accent/10 text-accent" : "text-text-2 hover:bg-surface"
                    }`}
                  >
                    <span className="font-mono text-xs">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className={`text-[10px] font-mono border px-1.5 py-0.5 rounded transition-colors ${
                        isSelected ? "border-accent/30 text-accent" : "border-border text-text-3"
                      }`}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && !cmd.shortcut && (
                      <span className="text-[10px] font-mono text-accent/60">↵ enter</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          {flat.length === 0 && (
            <div className="px-4 py-8 text-center font-mono text-xs text-text-3 italic">
              No commands found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 font-mono text-[9px] text-text-3">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <span className="ml-auto">MISSION CONTROL v1.0</span>
        </div>
      </div>
    </div>
  )
}