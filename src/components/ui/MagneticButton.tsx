"use client"

import { useRef, MouseEvent, ReactNode } from "react"
import gsap from "gsap"

interface MagneticButtonProps {
  children: ReactNode
  href: string
  className?: string
  target?: string
  rel?: string
  /** Max pixel offset the button can be pulled toward the cursor. */
  strength?: number
  /** Radius (px) around the button center where the magnetic pull activates. */
  radius?: number
}

/**
 * Wraps an <a> CTA with a magnetic hover effect: the button subtly pulls
 * toward the cursor as it enters `radius`, and snaps back on mouse-leave.
 * Uses gsap.quickTo for a performant, interrupt-safe tween (no animation
 * queue buildup on rapid mouse movement).
 */
export function MagneticButton({
  children,
  href,
  className,
  target,
  rel,
  strength = 16,
  radius = 70,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  const getTweens = () => {
    if (!ref.current) return null
    if (!xTo.current) {
      xTo.current = gsap.quickTo(ref.current, "x", {
        duration: 0.5,
        ease: "power3.out",
      })
    }
    if (!yTo.current) {
      yTo.current = gsap.quickTo(ref.current, "y", {
        duration: 0.5,
        ease: "power3.out",
      })
    }
    return { x: xTo.current, y: yTo.current }
  }

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const tweens = getTweens()
    if (!tweens) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const distance = Math.sqrt(distX * distX + distY * distY)

    if (distance < radius) {
      const pullX = (distX / radius) * strength
      const pullY = (distY / radius) * strength
      tweens.x(pullX)
      tweens.y(pullY)
    } else {
      tweens.x(0)
      tweens.y(0)
    }
  }

  const handleMouseLeave = () => {
    const tweens = getTweens()
    tweens?.x(0)
    tweens?.y(0)
  }

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {children}
    </a>
  )
}