"use client"

import { useEffect, useRef } from "react"
import styles from "./FailureControl.module.css"

interface FailureControlProps {
  isFailureMode: boolean
  onToggle: () => void
}

export function FailureControl({ isFailureMode, onToggle }: FailureControlProps) {
  const faultRef = useRef<HTMLSpanElement>(null)
  const animationsRef = useRef<Animation[]>([])

  useEffect(() => () => {
    animationsRef.current.forEach((animation) => animation.cancel())
  }, [])

  return (
    <button
      type="button"
      data-failure={isFailureMode}
      className={`flex items-center justify-center px-5 py-3 text-xs font-bold rounded-md border tracking-wider text-center cursor-pointer ${styles.button}`}
      onClick={(event) => {
        animationsRef.current.forEach((animation) => animation.cancel())
        animationsRef.current = []
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && event.currentTarget.animate) {
          if (!isFailureMode) {
            animationsRef.current.push(event.currentTarget.animate(
              [0, -3, 3, -2, 1, 0].map((x) => ({ transform: `translateX(${x}px)` })),
              { duration: 320, easing: "ease-out" },
            ))
          }
          if (faultRef.current) {
            animationsRef.current.push(faultRef.current.animate(
              isFailureMode
                ? [{ opacity: 0.65, transform: "scaleX(1)" }, { opacity: 0, transform: "scaleX(0)" }]
                : [{ opacity: 0 }, { opacity: 0.65, offset: 0.25 }, { opacity: 0 }],
              { duration: 360, easing: "ease-out" },
            ))
          }
        }
        // Apply the real failure/reset immediately; animation never gates it.
        onToggle()
      }}
    >
      <span ref={faultRef} className={styles.fault} aria-hidden="true">
        <svg viewBox="0 0 200 24" preserveAspectRatio="none" fill="none">
          <path d="M0 12H35L42 5L50 20L58 4L66 12H135L143 7L152 19L160 9L168 12H200" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
      <span className={styles.label}>{isFailureMode ? "RESET RUN SEQUENCE" : "INJECT FAILURE"}</span>
    </button>
  )
}
