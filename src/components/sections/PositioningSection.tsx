"use client"

import React, { MouseEvent, useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface PillarCardProps {
  title: string
  description: string
  index: number
}

function PillarCard({ title, description, index }: PillarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty("--mouse-x", `${x}px`)
    cardRef.current.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="pillar-card group relative flex flex-col justify-between p-8 border border-border bg-surface rounded-lg overflow-hidden transition-colors duration-300 hover:border-accent/30"
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* Radial Gradient Hover Highlight Spotlight (follows cursor) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: "radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(77, 163, 255, 0.08), transparent 80%)",
        }}
      />

      {/* Dynamic Border Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          border: "1px solid transparent",
          background: "radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(77, 163, 255, 0.35), transparent 80%)",
          maskImage: "linear-gradient(black, black) exclude, linear-gradient(black, black)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Content */}
      <div className="relative z-20 space-y-4">
        {/* Index indicator */}
        <span className="font-mono text-xs text-text-3 font-semibold tracking-wider">
          0{index + 1}
        </span>
        <h2 className="text-lg font-bold text-text group-hover:text-accent transition-colors duration-200">
          {title}
        </h2>
        <p className="text-xs text-text-2 leading-relaxed font-sans">
          {description}
        </p>
      </div>
    </div>
  )
}

export function PositioningSection({ headingLevel = "h1" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      // Heading slides up on scroll
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })

      // Pillar cards stagger in one by one
      gsap.from(".pillar-card", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: pillarsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const pillars = [
    {
      title: "AGENT ARCHITECTURE",
      description: "Multi-agent orchestration with generator→evaluator loops, weighted scoring, and automated recovery paths.",
    },
    {
      title: "APPLICATION INFRASTRUCTURE",
      description: "Cloudflare Workers request handling, edge caching, rate limiting, and sequential AI-provider fallback.",
    },
    {
      title: "OBSERVABILITY",
      description: "Cost tracking via Cloudflare AI Gateway, anomaly detection, alarm-based execution, and structured failure classification.",
    },
  ]

 return (
    <section ref={sectionRef} aria-labelledby="specialization-heading" className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24 min-h-[calc(100svh-82px)] flex flex-col justify-center">
      {/* Eyebrow and Header */}
        <div ref={headingRef} className="max-w-3xl flex flex-col space-y-4 mb-12 md:mb-16">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          SPECIALIZATION
        </span>
        <Heading id="specialization-heading" className="text-3xl md:text-5xl font-extrabold text-text tracking-tight leading-tight">
          AI systems that don&apos;t just run — they recover.
        </Heading>
        <p className="text-sm text-text-2 font-sans leading-relaxed">
          I build infrastructure to inspect model outputs, record failures, and support bounded recovery paths.
        </p>
      </div>

      {/* Pillars Grid */}
      <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => (
          <PillarCard
            key={pillar.title}
            title={pillar.title}
            description={pillar.description}
            index={idx}
          />
        ))}
      </div>
    </section>
  )
}
