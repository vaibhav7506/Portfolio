"use client"

import { projects } from "@/lib/projects"

export function AboutSection() {
  
  
  return (
   <section  id="about" className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50 scroll-mt-[56px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-center">
        {/* Left: Narrative Copy */}
       <div className="about-left space-y-6">
          <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
            ABOUT ME
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
            I build around failure, recovery, and review.
          </h2>
           <div className="p-4 border border-border bg-surface rounded-lg font-mono text-[10px] text-text-mono mt-6 leading-relaxed">
              Across {projects.length} projects, I explore observable AI loops, reviewable code migrations, endpoint security checks, queued workflows, and browser QA. The case studies document what works and what still needs work.
            </div>
            
          <div className="space-y-4 text-sm text-text-2 leading-relaxed font-sans">
            <p>
              I&apos;m Vaibhav — a CS engineer and MMMUT 2026 graduate focused on AI agent infrastructure and full-stack applications. My projects cover evaluators, action validation, provider fallback, and observability.
            </p>
            <p>
              Before writing a line of code, I ask: what breaks, what degrades, and what needs to recover automatically? That question is the foundation of everything I build — from LoopOS&apos;s loop observability to GitBlamed&apos;s 3-provider fallback chain.
            </p>
            <p>
              Off the stack: I captained my university football team. That experience taught me to coordinate roles, communicate under pressure, and take responsibility for results.
            </p>
            
            {/* Cross-project Narrative */}
           
          </div>
        </div>

        {/* Right: System Status Terminal Panel */}
       <div className="about-right border border-border bg-surface p-6 rounded-lg font-mono text-xs shadow-panel space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-2">
            <span className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">
              At a glance
            </span>
            <span className="text-success text-[10px] uppercase font-bold animate-pulse">
              OPEN TO WORK
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-text-3 font-semibold">STATUS</span>
              <span className="text-success font-bold">AVAILABLE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-3 font-semibold">LOCATION</span>
              <span className="text-text">INDIA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-3 font-semibold">GRADUATION</span>
              <span className="text-text">JUN 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-3 font-semibold">FOCUS</span>
              <span className="text-text-mono font-bold">AI INFRA</span>
            </div>
            <div className="flex justify-between items-center">
  <span className="text-text-3 font-semibold">LEETCODE</span>
  
  <a  href="https://leetcode.com/u/vaibhav7506/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-text font-bold hover:text-accent transition-colors duration-150 flex items-center gap-1 group"
  >
    VIEW PROFILE
    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">↗</span>
  </a>
</div>
            <div className="flex justify-between items-center">
              <span className="text-text-3 font-semibold">CURRENT BUILD</span>
              <span className="text-accent font-bold">LoopOS</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
