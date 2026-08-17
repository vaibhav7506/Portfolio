"use client"

import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Project } from "@/lib/projects"
import { ProjectCard } from "./ProjectCard"

gsap.registerPlugin(ScrollTrigger)

interface HorizontalProjectScrollProps {
  projects: Project[]
}

/**
 * Pins the section and drives a horizontal track from vertical scroll —
 * an Awwwards/FWA-style "control panel" reveal for featured projects.
 *
 * Desktop-only (>=1024px) and respects prefers-reduced-motion via
 * gsap.matchMedia(); everything below that (or with reduced motion on)
 * falls back to a plain horizontally-swipeable row with native touch
 * scroll and no pin — scroll-jacking on mobile fights the user's
 * natural vertical scroll, so the fallback is necessary, not optional.
 */
export function HorizontalProjectScroll({ projects }: HorizontalProjectScrollProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean }
        if (!isDesktop) return

        setPinned(true)

        const track = trackRef.current!
        const section = sectionRef.current!

        // Distance the track needs to travel: total scroll width minus
        // one viewport's worth (the last card ends flush, no overshoot).
        const getScrollDistance = () => Math.max(track.scrollWidth - section.clientWidth, 0)

        const tween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`
              }
              if (hintRef.current) {
                gsap.to(hintRef.current, {
                  opacity: self.progress > 0.06 ? 0 : 1,
                  duration: 0.3,
                  overwrite: "auto",
                })
              }
            },
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      }
    )

    return () => mm.revert()
  }, [projects])

  // Fallback classes: plain swipeable row when not pinned (mobile / reduced-motion)
  const trackClasses = pinned
    ? "flex gap-6 will-change-transform"
    : "flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-12 md:py-16"
      aria-label="Featured projects, horizontal scroll"
    >
      <div ref={trackRef} className={trackClasses}>
        {projects.map((project) => (
          <div
            key={project.slug}
            className={`w-[85vw] sm:w-[420px] shrink-0 ${pinned ? "" : "snap-start"}`}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Progress bar — only meaningful once pinned */}
      {pinned && (
        <div className="absolute bottom-6 left-6 right-6 h-[2px] bg-border/40 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full w-full bg-accent origin-left rounded-full"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      )}

      {/* Disorientation cue — pinned horizontal sections need to explain
          why vertical scroll suddenly stopped moving the page */}
      {pinned && (
        <div
          ref={hintRef}
          className="absolute top-4 right-6 flex items-center gap-2 font-mono text-[10px] font-bold text-text-3 uppercase tracking-wider pointer-events-none"
        >
          <span>Scroll to explore</span>
          <span className="animate-pulse">→</span>
        </div>
      )}
    </section>
  )
}