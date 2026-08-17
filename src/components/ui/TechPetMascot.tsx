"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface TechPetMascotProps {
  /** Icon representing the currently active stack category. */
  icon: LucideIcon
  /** Label shown under the mascot — also keys the reaction/nod animation. */
  label: string
}

/**
 * A small floating "companion unit" for the stack section — idles with a
 * gentle bob and periodic blink, and does a quick reactive nod + swaps its
 * held icon whenever the selected tech category changes. Pure SVG + framer
 * motion, no image assets, so it inherits the site's theme colors directly
 * via CSS variables (accent/border/surface) and needs no new dependencies.
 *
 * The "nod" on category change is driven by remounting the SVG with
 * `key={label}` and an initial→animate transition, rather than a
 * setState-in-effect — keeps it compatible with the reactCompiler lint
 * rules (react-hooks/set-state-in-effect) already enforced in this repo.
 */
export function TechPetMascot({ icon: Icon, label }: TechPetMascotProps) {
  const [blink, setBlink] = useState(false)

  // Idle blink loop — randomized interval so it doesn't feel mechanical.
  // setBlink only fires inside the setTimeout callback (not synchronously
  // in the effect body), so this is fine under set-state-in-effect.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const scheduleBlink = () => {
      const delay = 2600 + Math.random() * 3200
      timeout = setTimeout(() => {
        setBlink(true)
        setTimeout(() => setBlink(false), 130)
        scheduleBlink()
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="relative"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Reaction bubble — holographic readout of the active category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-accent-dim border border-accent/40"
          >
            <Icon className="w-4 h-4 text-accent" strokeWidth={2.25} />
          </motion.div>
        </AnimatePresence>

        {/* key={label} remounts on category change, replaying the
            initial → animate "nod" without any extra React state. */}
        <motion.svg
          key={label}
          width="96"
          height="106"
          viewBox="0 0 96 106"
          fill="none"
          initial={{ rotate: -6 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Antenna */}
          <line x1="48" y1="20" x2="48" y2="6" stroke="var(--border-hover)" strokeWidth="2" />
          <motion.circle
            cx="48"
            cy="6"
            r="3.5"
            fill="var(--accent)"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.45, 1, 0.45, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Body capsule */}
          <rect
            x="14"
            y="20"
            width="68"
            height="58"
            rx="20"
            fill="var(--bg-surface)"
            stroke="var(--border-hover)"
            strokeWidth="1.5"
          />

          {/* Visor */}
          <rect x="24" y="36" width="48" height="24" rx="12" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />

          {/* Eyes (blink = squash vertically) */}
          <motion.ellipse
            cx="38"
            cy="48"
            rx="4.5"
            animate={{ ry: blink ? 0.6 : 5 }}
            transition={{ duration: 0.1 }}
            fill="var(--accent)"
          />
          <motion.ellipse
            cx="58"
            cy="48"
            rx="4.5"
            animate={{ ry: blink ? 0.6 : 5 }}
            transition={{ duration: 0.1 }}
            fill="var(--accent)"
          />

          {/* Hover thrusters */}
          <motion.ellipse
            cx="30"
            cy="92"
            ry="2.5"
            fill="var(--accent)"
            animate={{ opacity: [0.15, 0.5, 0.15], rx: [5, 7, 5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="66"
            cy="92"
            ry="2.5"
            fill="var(--accent)"
            animate={{ opacity: [0.15, 0.5, 0.15], rx: [5, 7, 5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.svg>
      </motion.div>

      <div className="font-mono text-[10px] font-bold text-text-3 uppercase tracking-wider text-center leading-relaxed">
        Companion Unit
        <div className="text-accent normal-case tracking-normal text-[11px] mt-0.5">{label}</div>
      </div>
    </div>
  )
}