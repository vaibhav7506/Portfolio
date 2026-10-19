"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "./ExploreLoopOSLink.module.css"

export function ExploreLoopOSLink({ href = "/work/loopos" }: { href?: string }) {
  const router = useRouter()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (navigationTimer.current !== null) clearTimeout(navigationTimer.current)
  }, [])

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`flex items-center justify-center gap-3 px-5 py-3 text-xs font-bold rounded-md bg-accent text-bg hover:bg-accent/90 transition-colors duration-150 tracking-wider text-center ${styles.link}`}
      onNavigate={(event) => {
        // Next leaves modified clicks and new-tab navigation to the browser.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        event.preventDefault()
        if (navigationTimer.current !== null) return
        linkRef.current?.setAttribute("data-launching", "true")
        navigationTimer.current = setTimeout(() => {
          router.push(href)
          linkRef.current?.removeAttribute("data-launching")
          navigationTimer.current = null
        }, 320)
      }}
    >
      <span className={styles.label}>EXPLORE LOOPOS</span>
      <span className={styles.arrowWindow} aria-hidden="true"><span className={styles.arrow}>→</span></span>
    </Link>
  )
}
