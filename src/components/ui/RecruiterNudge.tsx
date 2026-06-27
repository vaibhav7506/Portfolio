"use client"

import { useEffect, useState } from "react"

export function RecruiterNudge() {
  const [phase, setPhase] = useState<"hidden" | "nudge" | "cta" | "dismissed">("hidden")

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase((p) => p === "hidden" ? "nudge" : p)
    }, 10000)

    const t2 = setTimeout(() => {
      setPhase((p) => p === "nudge" ? "cta" : p)
    }, 15000)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

   useEffect(() => {
    if (phase !== "dismissed") return

    const loop = setTimeout(() => {
      setPhase("cta")
    }, 90000)

    return () => clearTimeout(loop)
  }, [phase])

  if (phase === "hidden" || phase === "dismissed") return null

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[120] pointer-events-none flex flex-col items-center gap-2 nudge-enter">
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
                setPhase("dismissed")
              }}
              className="text-accent hover:text-accent/80 font-bold cursor-pointer shrink-0"
            >
              VIEW →
            </button>
            <button onClick={() => setPhase("dismissed")} className="text-text-3 hover:text-text cursor-pointer ml-1 shrink-0">✕</button>
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
             onClick={() => setPhase("dismissed")}
>
  HIRE ME →
</a>
            
            <button onClick={() => setPhase("dismissed")} className="text-text-3 hover:text-text cursor-pointer shrink-0">✕</button>
          </>
        )}
      </div>
    </div>
  )
}