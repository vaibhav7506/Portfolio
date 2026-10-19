"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { MagneticButton } from "./MagneticButton"
import styles from "./HireMeButton.module.css"

export function HireMeButton({ href, target }: { href: string; target?: string }) {
  const [activation, setActivation] = useState(0)
  const [active, setActive] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (resetTimer.current !== null) clearTimeout(resetTimer.current)
  }, [])

  const activate = (event: MouseEvent<HTMLSpanElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (resetTimer.current !== null) clearTimeout(resetTimer.current)
    setActivation((current) => current + 1)
    setActive(true)
    resetTimer.current = setTimeout(() => {
      setActive(false)
      resetTimer.current = null
    }, 1150)
    // The native mail link opens immediately; the animation adds no navigation delay.
  }

  return (
    <span className={styles.wrapper} data-hire-button data-active={active} onClickCapture={activate}>
      <MagneticButton href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={`px-3 py-1 text-xs font-mono font-semibold rounded-md border border-accent bg-accent-dim ${styles.link}`}>
        <span className="sr-only">Hire Me</span>
        <span className={styles.content} aria-hidden="true">
          <span className={styles.words}>
            <span className={styles.letters}>{Array.from("Hire Me").map((letter, index) => <span key={index} className={styles.letterWindow} style={{ "--delay": `${index * 22}ms` } as CSSProperties}><span className={styles.letter}><span>{letter === " " ? "\u00a0" : letter}</span><span>{letter === " " ? "\u00a0" : letter}</span></span></span>)}</span>
            <span className={styles.invitation}>Let’s talk</span>
          </span>
          <span key={activation} className={styles.target}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path className={styles.brackets} d="M5 2H2v3m13-3h3v3M2 15v3h3m13-3v3h-3" />
              <path className={styles.arrow} d="M5 10h10m-4-4 4 4-4 4" />
              <path className={styles.diamond} d="m10 5 5 5-5 5-5-5 5-5Z" />
            </svg>
          </span>
        </span>
        <span key={`scan-${activation}`} className={styles.scanSurface} aria-hidden="true"><span className={styles.scanLine} /><span className={styles.scanGrid} /></span>
        <span className={styles.railTop} aria-hidden="true" /><span className={styles.railBottom} aria-hidden="true" />
      </MagneticButton>
    </span>
  )
}
