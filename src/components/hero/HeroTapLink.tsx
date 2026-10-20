"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react"
import styles from "./PortraitHero.module.css"

type TapEffect = "projects" | "resume" | "runbook" | "code" | "loop"

export function HeroTapLink({ effect, children, ...props }: ComponentPropsWithoutRef<"a"> & { effect: TapEffect }) {
  const animations = useRef(new Set<Animation>())
  const touch = useRef<{ id: number; x: number; y: number } | null>(null)

  const cancelFeedback = () => {
    animations.current.forEach(animation => animation.cancel())
    animations.current.clear()
    touch.current = null
  }

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const running = animations.current
    const cancel = () => {
      running.forEach(animation => animation.cancel())
      running.clear()
    }
    motion.addEventListener("change", cancel)
    return () => {
      motion.removeEventListener("change", cancel)
      cancel()
    }
  }, [])

  const startFeedback = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse" || !event.isPrimary || event.button !== 0) return
    cancelFeedback()
    touch.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
    const link = event.currentTarget
    const content = link.querySelector<HTMLElement>("[data-tap-content]")!
    const surface = link.querySelector<HTMLElement>("[data-tap-surface]")!
    const arrow = content.querySelector<SVGElement>("svg")!
    const animate = (element: Element, frames: Keyframe[], duration = 480) => {
      const animation = element.animate(frames, { duration, easing: "cubic-bezier(.22, 1, .36, 1)" })
      animations.current.add(animation)
      const forget = () => animations.current.delete(animation)
      animation.onfinish = forget
      animation.oncancel = forget
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animate(surface, [{ opacity: 0 }, { opacity: 0.5, offset: 0.15 }, { opacity: 0 }], 240)
      return
    }

    switch (effect) {
      case "projects":
        animate(content, [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(2px) scale(.94)", offset: 0.18 },
          { transform: "translateY(-2px) scale(1.025)", offset: 0.6 },
          { transform: "translateY(0) scale(1)" },
        ])
        animate(arrow.parentElement!, [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(12px)", opacity: 0, offset: 0.35 },
          { transform: "translateY(-10px)", opacity: 0, offset: 0.36 },
          { transform: "translateY(0)", opacity: 1 },
        ])
        break
      case "resume":
        animate(surface, [
          { opacity: 0, clipPath: "inset(0 100% 0 0)" },
          { opacity: 0.8, clipPath: "inset(0 0% 0 0)", offset: 0.45 },
          { opacity: 0, clipPath: "inset(0 0% 0 0)" },
        ])
        animate(arrow, [
          { transform: "translate(0, 0)", opacity: 1 },
          { transform: "translate(8px, -8px)", opacity: 0, offset: 0.4 },
          { transform: "translate(-5px, 5px)", opacity: 0, offset: 0.41 },
          { transform: "translate(0, 0)", opacity: 1 },
        ])
        break
      case "runbook":
        animate(surface, [
          { transform: "scale(.15)", opacity: 0.9 },
          { transform: "scale(1.15)", opacity: 0 },
        ], 560)
        break
      case "code":
        animate(surface, [
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, offset: 0.45 },
          { clipPath: "inset(0 0% 0 100%)", opacity: 0 },
        ], 520)
        animate(content, [
          { transform: "translateX(0)" },
          { transform: "translateX(3px)", offset: 0.25 },
          { transform: "translateX(-2px)", offset: 0.55 },
          { transform: "translateX(0)" },
        ], 520)
        break
      case "loop":
        animate(arrow, [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], 560)
        animate(content, [{ transform: "scale(1)" }, { transform: "scale(1.07)", offset: 0.35 }, { transform: "scale(1)" }], 560)
        break
    }
  }

  return (
    <a {...props} data-tap-effect={effect} onPointerDown={startFeedback} onPointerMove={event => {
      const start = touch.current
      if (start?.id === event.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) cancelFeedback()
    }} onPointerUp={() => { touch.current = null }} onPointerCancel={cancelFeedback}>
      <span className={styles.tapSurface} data-tap-surface aria-hidden="true" />
      <span className={styles.tapContent} data-tap-content>{children}</span>
    </a>
  )
}
