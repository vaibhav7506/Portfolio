import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Now — Vaibhav Sharma",
  description: "What Vaibhav is working on right now.",
}

export default function NowPage() {
  return (
    <article className="min-h-screen bg-bg text-text pb-20">
      <div className="max-w-2xl mx-auto px-6 pt-16 md:pt-24">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-mono font-bold text-text-3 hover:text-accent transition-colors duration-150 mb-10 uppercase tracking-wider"
        >
          ← Back to Mission Control
        </Link>

        {/* Header */}
        <div className="space-y-3 mb-12 border-b border-border/50 pb-10">
          <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
            /now
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text">
            What I'm doing now
          </h1>
          <p className="text-sm text-text-2 font-sans leading-relaxed">
            A snapshot of what's actually occupying my time. Updated June 2026.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-success font-bold">ACTIVE</span>
            <span className="text-text-3">— last updated June 2026</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">

          {/* Building */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-accent tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              Building
            </h2>
            <div className="space-y-4 pl-3 border-l border-border/50">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text">Going back to everything I've built and making it better</p>
                <p className="text-sm text-text-2 font-sans leading-relaxed">
                  Not chasing new projects right now — going deep on the ones that exist. LoopOS, GitBlamed, SentientWallet, the Automation Platform. Each one has rough edges I know about and am systematically fixing. The engineering decisions were right. The execution details are getting tighter.
                </p>
              </div>
              <div className="p-4 border border-border bg-surface rounded-lg font-mono text-[11px] text-text-mono leading-relaxed">
                "Ship it, then make it honest." — current operating mode
              </div>
            </div>
          </section>

          {/* Learning */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-accent tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              Learning
            </h2>
            <div className="space-y-4 pl-3 border-l border-border/50">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text">Japanese — from scratch</p>
                <p className="text-sm text-text-2 font-sans leading-relaxed">
                  Learning a language with a completely different structure than anything I've studied before. There's something about forcing your brain into an entirely foreign grammar system that sharpens how you think about structure in general. Early days — hiragana first.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text">AI — going deeper than the surface</p>
                <p className="text-sm text-text-2 font-sans leading-relaxed">
                  Moving past "use the API" into how these systems actually work. Attention mechanisms, fine-tuning pipelines, embedding spaces, retrieval architectures. The goal is to build AI systems I can fully reason about, not just integrate.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text">MERN — going in depth</p>
                <p className="text-sm text-text-2 font-sans leading-relaxed">
                  I've shipped with these tools. Now learning the internals — MongoDB aggregation pipelines, Express middleware architecture, React reconciler, Node.js event loop mechanics. The difference between using a tool and understanding it is where senior engineers live.
                </p>
              </div>
            </div>
          </section>

          {/* Writing */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-accent tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full" />
              Writing
            </h2>
            <div className="space-y-4 pl-3 border-l border-border/50">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-text">A storybook — three stories written from scratch</p>
                <p className="text-sm text-text-2 font-sans leading-relaxed">
                  Not technical writing. Actual stories. Three done so far, written from nothing. I find that writing fiction and writing code use the same underlying skill — you're constructing a world with internal rules that has to make sense to someone else. The medium is different. The discipline is identical.
                </p>
              </div>
            </div>
          </section>

          {/* Not doing */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-text-3 tracking-widest uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-text-3 rounded-full" />
              Not doing right now
            </h2>
            <div className="pl-3 border-l border-border/30">
              <p className="text-sm text-text-3 font-sans leading-relaxed">
                Starting new projects for the sake of it. Chasing trends. Building things I can't explain the architecture of. Adding features that look impressive but don't make the system more honest.
              </p>
            </div>
          </section>

          {/* Footer note */}
          <div className="border-t border-border/50 pt-8 space-y-3">
            <p className="text-xs text-text-3 font-sans leading-relaxed">
              This is a <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">/now page</a> — a concept by Derek Sivers. It's a public declaration of what actually has my attention, not what looks good to say.
            </p>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <Link href="/" className="text-accent hover:text-accent/80 transition-colors">
                ← Portfolio
              </Link>
               <a href="https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
         target="_blank">
                vs7977722@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}