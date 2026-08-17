"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { projects } from "@/lib/projects"
import { ProjectCard } from "../projects/ProjectCard"

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })
export function ProjectsSection() {
  
 
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//      if (window.innerWidth < 768) return
//   const ctx = gsap.context(() => {
//     gsap.from(headingRef.current, {
//       y: 40,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power3.out",
//       scrollTrigger: {
//         trigger: headingRef.current,
//         start: "top 80%",
//         toggleActions: "play none none none",
//       },
//     })

//     const cards = document.querySelectorAll(".project-card")
//     if (cards.length > 0) {
//       gsap.from(cards, {
//         y: 60,
//         opacity: 0,
//         duration: 0.7,
//         stagger: 0.12,
//         ease: "power3.out",
//         scrollTrigger: {
         
//           start: "top 80%",
//           toggleActions: "play none reset none",
//         },
//       })
//     }
//   }, sectionRef)

//   return () => ctx.revert()
// }, [])

  const featuredProjects = projects.filter((p) => p.featured)
  const remainingProjects = projects.filter((p) => !p.featured)

  return (
   <section ref={sectionRef} id="work" className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50 scroll-mt-[56px]">
      {/* Header */}
      <div ref={headingRef} className="flex flex-col space-y-3 mb-12">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          PROJECTS
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          Production-grade systems & infrastructure
        </h2>
        <p className="text-sm text-text-2 max-w-2xl font-sans leading-relaxed">
          These aren&apos;t toy projects. They are deployed systems built to handle real traffic, manage financial risk, and enforce strict execution guardrails.
        </p>
      </div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Remaining Projects Section */}
      {remainingProjects.length > 0 && (
        <div className="mt-16">
          <div className="border-b border-border/50 pb-3 mb-8">
            <h3 className="font-mono text-xs font-bold text-text-2 tracking-wider uppercase">
              Other Systems & Utilities
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
