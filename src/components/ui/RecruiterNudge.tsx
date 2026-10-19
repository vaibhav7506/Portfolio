"use client"

import { useEffect, useState } from "react"

const dismissalKey = "portfolio:hiring-prompt-dismissed"
let dismissedForSession = false

export function RecruiterNudge() {
  const [phase, setPhase] = useState<"hidden" | "nudge" | "cta" | "dismissed">("hidden")

  useEffect(() => {
    if (dismissedForSession) return
    try {
      if (localStorage.getItem(dismissalKey) === "true") return
    } catch {
      // Keep dismissal in memory when browser storage is unavailable.
    }

    const t1 = setTimeout(() => {
      setPhase((p) => p === "hidden" ? "nudge" : p)
    }, 10000)

    const t2 = setTimeout(() => {
      setPhase((p) => p === "nudge" ? "cta" : p)
    }, 15000)

    const onStorage = (event: StorageEvent) => {
      if (event.key === dismissalKey && event.newValue === "true") {
        dismissedForSession = true
        setPhase("dismissed")
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("storage", onStorage) }
  }, [])

  const dismiss = () => {
    dismissedForSession = true
    try { localStorage.setItem(dismissalKey, "true") } catch { /* In-memory dismissal remains active. */ }
    setPhase("dismissed")
  }

  if (phase === "hidden" || phase === "dismissed") return null

  return (
    <div role="region" aria-label="Portfolio hiring prompt" className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[120] pointer-events-none flex flex-col items-center gap-2 nudge-enter">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border font-mono text-xs shadow-2xl backdrop-blur-md transition-all duration-500 w-full md:w-auto justify-between md:justify-start ${
          phase === "cta"
            ? "border-accent/40 bg-[#0A0D12]/95 text-text"
            : "border-border/60 bg-[#0F1318]/90 text-text-2"
        }`}
      >
        {phase === "nudge" && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
            <span>You&apos;ve been here a while — seen the case studies yet?</span>
            <button
              onClick={() => {
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
                dismiss()
              }}
              className="text-accent hover:text-accent/80 font-bold cursor-pointer shrink-0"
            >
              VIEW →
            </button>
            <button type="button" aria-label="Dismiss hiring prompt" onClick={dismiss} className="text-text-3 hover:text-text cursor-pointer ml-1 shrink-0 p-2">✕</button>
          </>
        )}
        {phase === "cta" && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="text-accent font-bold">Impressed? Let&apos;s talk.</span>
            <a
              href="https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
             target="_blank"
             rel="noopener noreferrer"
             className="px-3 py-1 rounded-md bg-accent text-bg font-bold hover:bg-accent/90 transition-colors cursor-pointer shrink-0"
             onClick={dismiss}
>
  HIRE ME →
</a>
            
            <button type="button" aria-label="Dismiss hiring prompt" onClick={dismiss} className="text-text-3 hover:text-text cursor-pointer shrink-0 p-2">✕</button>
          </>
        )}
      </div>
    </div>
  )
}
