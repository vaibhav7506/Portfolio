"use client"
import { AvailabilityWidget } from "@/components/ui/AvailabilityWidget"

export function ContactSection() {
  return (
    <section className="w-full border-t border-border/50 bg-[#0A0D12]">
      {/* Contact Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-8">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          CONTACT
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight max-w-xl">
          Interested in AI infrastructure roles or collaborations?
        </h2>
        <AvailabilityWidget /> 
        <p className="text-sm text-text-2 max-w-md font-sans leading-relaxed">
          Open to full-time, internships, and freelance AI/full-stack projects. I respond within 24 hours.
        </p>

        {/* Call to action */}
         <div className="pt-2 flex flex-col items-center gap-4">
          <a href="https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3.5 font-mono text-xs font-bold tracking-wider rounded-md bg-accent text-bg hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
          >
            SEND ME AN EMAIL →
          </a>
           <div className="flex items-center gap-3 font-mono text-[11px]">
            <div>
            <a  href="/Vaibhav_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-surface hover:bg-hover hover:text-accent hover:border-accent/40 transition-all duration-150 font-bold tracking-wider"
            >
              RESUME (SWE) ↓
            </a>
            </div>
             <div>
            <a  href="/Vaibhav_AIML_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-surface hover:bg-hover hover:text-accent hover:border-accent/40 transition-all duration-150 font-bold tracking-wider"
            >
              RESUME (AI/ML) ↓
            </a>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="flex gap-6 font-mono text-[11px] font-bold text-text-2 pt-4">
          <a
            href="https://github.com/vaibhav7506"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            GITHUB ↗
          </a>
          <a
            href="https://www.linkedin.com/in/vaibhav-sharma-996aa8249/" // Placeholder Link, standard format
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            LINKEDIN ↗
          </a>
          <a
            href="https://leetcode.com/u/vaibhav7506/" // Placeholder Link, standard format
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            LEETCODE ↗
          </a>
        </div>
      </div>

      {/* Global Footer */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-text-3">
        <div>
          <span>Built by Vaibhav Sharma · 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/vaibhav7506/Portfolioo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-2 transition-colors duration-150"
          >
            Source on GitHub
          </a>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-success font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            LIVE NODE
          </span>
        </div>
      </div>
    </section>
  )
}
