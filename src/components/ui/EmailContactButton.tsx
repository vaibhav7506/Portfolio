"use client"

import { useState } from "react"
import { useAnimatedNavigation } from "@/hooks/useAnimatedNavigation"
import { MagneticButton } from "./MagneticButton"
import styles from "./EmailContactButton.module.css"

export function EmailContactButton() {
  const [launch, setLaunch] = useState(0)
  const { opening, activate } = useAnimatedNavigation(1300)

  return (
    <span className={styles.wrapper} data-opening={opening}>
      <MagneticButton
        href="https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
        target="_blank"
        rel="noopener noreferrer"
        aria-busy={opening}
        onClick={event => activate(event, () => setLaunch(current => current + 1))}
        strength={20}
        radius={90}
        className={`inline-flex items-center justify-center px-8 py-3.5 font-mono text-xs font-bold tracking-wider rounded-md bg-accent text-bg hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 ${styles.link}`}
      >
        <span className={styles.content}>
          <span className={styles.label}>
            <span data-visible={!opening}>SEND ME AN EMAIL</span>
            <span data-visible={opening} aria-hidden="true">OPENING GMAIL</span>
          </span>
          <span key={launch} className={styles.scene} aria-hidden="true">
            <svg className={styles.envelope} width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path className={styles.flap} d="m3 7 9 6 9-6" />
              <path className={styles.letter} d="M7 10V4h10v6M10 7h4" />
            </svg>
            <svg className={styles.plane} width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 3-6.5 18-4-7.5L3 9.5 21 3ZM10.5 13.5 21 3" /></svg>
            <span className={styles.trail} /><span className={styles.glint} />
          </span>
        </span>
        <span key={`pulse-${launch}`} className={styles.pulse} aria-hidden="true" />
      </MagneticButton>
      <span className="sr-only" role="status" aria-live="polite">{opening ? "Opening Gmail compose in a new tab." : ""}</span>
    </span>
  )
}
