"use client"

import type { LucideIcon } from "lucide-react"
import styles from "./TechPetMascot.module.css"

interface TechPetMascotProps {
  icon: LucideIcon
  label: string
  category: "web" | "ai" | "backend" | "data" | "devops"
  running: boolean
}

/** The companion keeps its silhouette, with a different motion scene per category. */
export function TechPetMascot({ icon: Icon, label, category, running }: TechPetMascotProps) {
  return (
    <div className={styles.companion} data-category={category} data-running={running}>
      <div className={styles.stage} aria-hidden="true">
        <svg className={styles.environment} viewBox="0 0 208 176" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {category === "web" && <>
            <g className={styles.codeCard}><rect x="6" y="42" width="49" height="38" rx="5" /><path d="M6 52h49M12 47h2m4 0h2" /><path className={styles.codeLines} pathLength="100" d="m18 59-5 5 5 5m24-10 5 5-5 5m-12-12-4 14" /></g>
            <g className={styles.codeCardSecond}><rect x="155" y="84" width="47" height="36" rx="5" /><path d="M155 93h47" /><path className={styles.codeLines} pathLength="100" d="M163 101h22m-22 7h13" /><path className={styles.cursor} d="M190 100v10" /></g>
            <path className={styles.codeConnector} d="M55 64h11m76 38h13" />
          </>}
          {category === "ai" && <>
            <path className={styles.neuralPath} pathLength="100" d="m24 52 44-32 36 28 38-28 43 32-13 65-68 25-68-25-12-65Zm0 0 80-4 81 4M68 20l-32 97 68-69 68 69-30-97M36 117h136" />
            {[ [24,52], [68,20], [142,20], [185,52], [172,117], [36,117] ].map(([cx,cy], index) => <circle key={index} className={styles.neuron} cx={cx} cy={cy} r="3" style={{ animationDelay: `${index * .28}s` }} />)}
            <circle className={styles.thoughtRing} cx="104" cy="48" r="17" />
          </>}
          {category === "backend" && <>
            <g className={styles.rack}><rect x="5" y="66" width="36" height="48" rx="5" /><path d="M5 82h36M5 98h36M12 74h12m-12 16h12m-12 16h12" /><circle cx="33" cy="74" r="1.5" /><circle cx="33" cy="90" r="1.5" /><circle cx="33" cy="106" r="1.5" /></g>
            <g className={styles.rackSecond}><rect x="167" y="66" width="36" height="48" rx="5" /><path d="M167 82h36M167 98h36M174 74h12m-12 16h12m-12 16h12" /><circle cx="195" cy="74" r="1.5" /><circle cx="195" cy="90" r="1.5" /><circle cx="195" cy="106" r="1.5" /></g>
            <path className={styles.route} d="M41 88h17V28h92v60h17" /><path className={styles.packet} pathLength="100" d="M41 88h17V28h92v60h17" />
          </>}
          {category === "data" && <>
            {[24,184].map((x, index) => <g key={x} className={index === 0 ? styles.storage : styles.storageSecond}>
              <path className={styles.dataLayer} d={`M${x-16} 91v13c0 10 32 10 32 0V91`} /><path className={styles.dataLayerMiddle} d={`M${x-16} 78v13c0 10 32 10 32 0V78`} /><path className={styles.dataLayerTop} d={`M${x-16} 65v13c0 10 32 10 32 0V65`} /><ellipse cx={x} cy="65" rx="16" ry="6" />
            </g>)}
            <path className={styles.dataRoute} pathLength="100" d="M40 89h20m88 0h20M83 31h42m-32-7h22m-32 14h42" />
          </>}
          {category === "devops" && <>
            <path className={styles.shield} pathLength="100" d="m104 18 70 25v42c0 35-33 60-70 75-37-15-70-40-70-75V43l70-25Z" />
            <path className={styles.shieldInner} d="m104 27 61 22v35c0 29-26 51-61 66-35-15-61-37-61-66V49l61-22Z" />
            <path className={styles.securityScan} d="M45 55h118" />
            <g className={styles.verification}><circle cx="174" cy="37" r="12" fill="var(--bg-surface, #111823)" /><path className={styles.check} pathLength="100" d="m168 37 4 4 8-8" /></g>
          </>}
        </svg>
        <div className={styles.iconBubble}><Icon size={16} strokeWidth={2.25} /></div>
        <div className={styles.robotMotion}>
          <svg className={styles.robot} width="96" height="106" viewBox="0 0 96 106" fill="none">
            <line x1="48" y1="20" x2="48" y2="6" stroke="var(--border-hover)" strokeWidth="2" />
            <circle className={styles.antenna} cx="48" cy="6" r="3.5" fill="currentColor" />
            <rect x="14" y="20" width="68" height="58" rx="20" fill="var(--bg-surface, #111823)" stroke="var(--border-hover)" strokeWidth="1.5" />
            <rect x="24" y="36" width="48" height="24" rx="12" fill="var(--bg)" stroke="var(--border)" />
            <g className={styles.eyes}><ellipse cx="38" cy="48" rx="4.5" ry="5" fill="currentColor" /><ellipse cx="58" cy="48" rx="4.5" ry="5" fill="currentColor" /></g>
            <g className={styles.thrusters}><ellipse cx="30" cy="92" rx="6" ry="2.5" fill="currentColor" /><ellipse cx="66" cy="92" rx="6" ry="2.5" fill="currentColor" /></g>
          </svg>
        </div>
      </div>
      <div className={styles.caption}>Companion Unit<span>{label}</span></div>
      <span className={styles.hint}>Select a category to replay</span>
    </div>
  )
}
