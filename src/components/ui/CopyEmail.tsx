"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

const email = "vs7977722@gmail.com"

export function CopyEmail() {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "manual">("idle")
  const addressRef = useRef<HTMLAnchorElement>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  const copy = async () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    setStatus("copying")
    try {
      await navigator.clipboard.writeText(email)
      setStatus("copied")
      resetTimer.current = setTimeout(() => setStatus("idle"), 3000)
    } catch {
      const selection = window.getSelection()
      if (addressRef.current && selection) {
        const range = document.createRange()
        range.selectNodeContents(addressRef.current)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setStatus("manual")
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <a ref={addressRef} href={`mailto:${email}`} className="font-mono text-xs sm:text-sm text-text-2 hover:text-accent underline underline-offset-4 decoration-border transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4">{email}</a>
        <button type="button" onClick={() => void copy()} disabled={status === "copying"}
          aria-label={status === "copied" ? "Email address copied" : "Copy email address"}
          className="inline-flex items-center justify-center gap-2 min-h-11 w-24 px-3 border border-border rounded-md font-mono text-[11px] text-text-2 hover:border-accent/60 hover:text-accent hover:bg-accent/5 transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 cursor-pointer disabled:cursor-wait">
          {status === "copied" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {status === "copied" ? "Copied" : status === "copying" ? "Copying…" : "Copy"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-4 text-[10px] font-mono text-text-3">
        {status === "copied" ? "Email address copied to clipboard." : status === "manual" ? "Copy unavailable. Select the address above and copy it manually." : ""}
      </p>
    </div>
  )
}
