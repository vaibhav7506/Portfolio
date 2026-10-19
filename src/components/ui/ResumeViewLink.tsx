"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight, FileText } from "lucide-react"
import { resumeLinks, type ResumeKind } from "@/lib/resumeLinks"
import styles from "./ResumeViewLink.module.css"

export function ResumeViewLink({ kind }: { kind: ResumeKind }) {
  const sweepRef = useRef<HTMLSpanElement>(null)
  const animationRef = useRef<Animation | null>(null)

  useEffect(() => () => animationRef.current?.cancel(), [])

  return (
    <div className={styles.wrapper}>
      <a href={resumeLinks[kind].url} target="_blank" rel="noopener noreferrer" data-resume-link={kind}
        className={styles.link} onClick={() => {
          animationRef.current?.cancel()
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && sweepRef.current?.animate) {
            animationRef.current = sweepRef.current.animate([
              { opacity: 0, transform: "translateX(-100%)" },
              { opacity: 1, offset: 0.3 },
              { opacity: 0, transform: "translateX(100%)" },
            ], { duration: 550, easing: "ease-out" })
          }
        }}>
        <FileText size={15} aria-hidden="true" />
        <span>RÉSUMÉ ({resumeLinks[kind].label})<span className="sr-only"> (opens in a new tab)</span></span>
        <ArrowUpRight className={styles.arrow} size={16} aria-hidden="true" />
        <span ref={sweepRef} className={styles.sweep} aria-hidden="true" />
      </a>
      <p className={styles.caption}>Google Drive · opens in a new tab</p>
    </div>
  )
}
