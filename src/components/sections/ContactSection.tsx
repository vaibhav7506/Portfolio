"use client"
import { AvailabilityWidget } from "@/components/ui/AvailabilityWidget"
import { EmailContactButton } from "@/components/ui/EmailContactButton"
import { ResumeViewLink } from "@/components/ui/ResumeViewLink"
import { SocialLinks } from "@/components/ui/SocialLinks"
import { CopyEmail } from "@/components/ui/CopyEmail"

export function ContactSection() {
  return (
    <section id="contact" className="w-full scroll-mt-28 border-t border-border/50 bg-[#0A0D12]">
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
          <EmailContactButton />
          <CopyEmail />
           <div id="resume" className="flex flex-wrap justify-center items-start gap-3 scroll-mt-28">
            <ResumeViewLink kind="sde" />
            <ResumeViewLink kind="aiml" />
          </div>
        </div>

        {/* Socials */}
        <SocialLinks />
      </div>

      {/* Global Footer */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-text-3">
        <div>
          <span>Built by Vaibhav Sharma · 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/vaibhav7506/Portfolio"
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
