"use client"

import { useState } from "react"
import { ExternalLink, GitBranch } from "lucide-react"
import { useAnimatedNavigation } from "@/hooks/useAnimatedNavigation"
import styles from "./GitHubProfileLink.module.css"

export function GitHubProfileLink({ href, username }: { href: string; username: string }) {
  const { opening, activate } = useAnimatedNavigation(1150)
  const [activation, setActivation] = useState(0)

  return (
    <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer"
      data-github-profile data-opening={opening} aria-busy={opening} onClick={event => activate(event, () => setActivation(current => current + 1))}>
      <span className="sr-only">GitHub profile for @{username} (opens in a new tab)</span>
      <span className={styles.inside} aria-hidden="true">
        <GitBranch size={16} />
        <span>OPENING GITHUB</span>
        <ExternalLink size={12} />
      </span>
      <span key={activation} className={styles.face} aria-hidden="true">
        <GitBranch className={styles.branch} size={15} />
        <span>@{username}</span>
        <ExternalLink size={12} />
      </span>
      <span className={styles.hinge} aria-hidden="true" />
    </a>
  )
}
