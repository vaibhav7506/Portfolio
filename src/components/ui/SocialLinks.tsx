"use client"

import { useState } from "react"
import styles from "./SocialLinks.module.css"

const profiles = [
  { id: "github", label: "GITHUB", href: "https://github.com/vaibhav7506" },
  { id: "linkedin", label: "LINKEDIN", href: "https://www.linkedin.com/in/vaibhav-sharma-996aa8249/" },
  { id: "leetcode", label: "LEETCODE", href: "https://leetcode.com/u/vaibhav7506/" },
] as const

function SocialLink({ profile }: { profile: (typeof profiles)[number] }) {
  const [clickSequence, setClickSequence] = useState(0)

  return (
    <a href={profile.href} target="_blank" rel="noopener noreferrer"
      className={styles.link} data-social={profile.id} aria-label={`${profile.label} profile (opens in a new tab)`}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        setClickSequence((sequence) => sequence + 1)
      }}>
      <span key={`label-${clickSequence}`} className={clickSequence > 0 ? styles.labelClicked : undefined}>{profile.label}</span>
      <span key={`arrow-${clickSequence}`} className={`${styles.arrow} ${clickSequence > 0 ? styles.arrowClicked : ""}`} aria-hidden="true">↗</span>
      <svg className={styles.frame} viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
        <rect x=".75" y=".75" width="98.5" height="30.5" rx="4" pathLength="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {clickSequence > 0 && <span key={clickSequence} className={styles.clickEffect} aria-hidden="true" />}
    </a>
  )
}

export function SocialLinks() {
  return (
    <nav aria-label="Social profiles" className={styles.links}>
      {profiles.map((profile) => (
        <SocialLink key={profile.id} profile={profile} />
      ))}
    </nav>
  )
}
