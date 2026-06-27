import Link from "next/link"
import { notFound as nextNotFound } from "next/navigation"
import { projects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [
    { slug: "loopos" },
    { slug: "gitblamed" },
    { slug: "sentientwallet" },
    { slug: "automation-platform" },
  ]
}

const CASE_STUDY_CONTENT: Record<
  string,
  {
    centralAngle: string
    problem: string
    decisions: { title: string; options: string; chose: string; tradeoff?: string }[]
    rebuild: string
  }
> = {
  loopos: {
    centralAngle: "What does observability actually mean for AI loops?",
    problem: "Autonomous AI loops fail in ways that are hard to diagnose. Was it the generator hallucinating? The evaluator misconfigured? A provider outage? A budget spike? Without structured observability, the answer is always \"something went wrong somewhere.\" LoopOS was built to make every failure classifiable, every decision traceable, and every cost visible — before those properties become an emergency.",
    decisions: [
      {
        title: "Key Decision 1 — Weighted scoring over pass/fail binary",
        options: "binary yes/no, simple numeric average, or weighted criteria sum.",
        chose: "Chose weighted because not all criteria are equal — \"Safety\" should outweigh \"verbosity.\" A binary system can't express that nuance. Weights let product owners tune quality priorities without touching code.",
        tradeoff: "more configuration surface, mitigated by schema validation requiring weights to sum to 1.0 with a hard error on startup."
      },
      {
        title: "Key Decision 2 — 2-check anomaly detection before alarm",
        options: "alarm on first failure, alarm after N failures, or 2-check sequential confirmation.",
        chose: "Chose 2-check because production AI systems have noisy transient failures. Alerting on every blip creates alert fatigue. 2 sequential checks balance sensitivity with specificity.",
        tradeoff: "real failures take two cycles to surface — acceptable because false positives are worse."
      },
      {
        title: "Key Decision 3 — INFRA_FAILURE vs BUSINESS_FAILURE classification",
        options: "one alarm channel, severity levels (P1/P2/P3), or origin classification.",
        chose: "Chose origin because infra and business failures need completely different responders. A Cloudflare timeout goes to the platform team. A score of 4.2/10 goes to the product team. Mixing them means the wrong team responds, or nobody does."
      },
      {
        title: "Key Decision 4 — Alarm-based Durable Object execution",
        options: "polling, webhooks, or Cloudflare Durable Object alarms.",
        chose: "Chose alarms: native to the platform, guaranteed to fire exactly once, survive restarts. The run literally cannot be lost.",
        tradeoff: "Cloudflare vendor lock-in — deliberate choice."
      }
    ],
    rebuild: "Evaluator weight schema is validated at runtime, not at definition time. Bad weights fail silently on the first run. I'd move validation to the migration layer — the database refuses invalid configurations entirely."
  },
  gitblamed: {
    centralAngle: "Building for virality while engineering for reliability.",
    problem: "Developer portfolios rarely demonstrate AI integration in a way that's verifiable and shareable. Most \"AI projects\" are wrappers with no proof the integration handles production pressure. GitBlamed was built to be two things: something fun to share, and something technically defensible — a multi-provider AI system with edge caching, rate limiting, and real performance constraints built for the moment it goes viral.",
    decisions: [
      {
        title: "Key Decision 1 — Cloudflare Workers over Render/Railway",
        options: "Render and Railway have 1–3 second cold starts.",
        chose: "Cloudflare Workers spin up at the edge in under 5ms and scale automatically. For a share-driven product, perceived latency IS the product quality."
      },
      {
        title: "Key Decision 2 — Sequential fallback over parallel AI requests",
        options: "Parallel requests would triple API cost on every call.",
        chose: "Sequential costs 1x on the happy path (>99% of requests), 2x only when Groq is down, 3x almost never. The latency penalty of fallback (~5s) is rare enough to be acceptable. The cost savings are real and ongoing."
      },
      {
        title: "Key Decision 3 — SVG over PNG for the shareable card",
        options: "The 1MB Cloudflare Workers bundle limit made Puppeteer impossible.",
        chose: "SVG is ~8KB, renders instantly, and works across all platforms that support Twitter cards. Delivery speed beats visual perfection for a share card."
      },
      {
        title: "Key Decision 4 — Per-user OG meta tags for Twitter virality",
        options: "Static OG image = every share looks identical.",
        chose: "With per-user OG tags, the Twitter card shows that specific user's roast card. The card IS the share hook — it creates curiosity before the click, which drives click-through rate."
      }
    ],
    rebuild: "The AI fallback uses a hardcoded 5s timeout before triggering fallback. A 429 (rate limited) should trigger immediate fallback — waiting 5s for a known rejection is unnecessary latency. I'd distinguish timeout failures from explicit rejection failures."
  },
  sentientwallet: {
    centralAngle: "How do you give an AI authority over real money without losing control?",
    problem: "DAO treasuries are managed manually and reactively. By the time a human notices a liquidity crisis or coordinated exploit, the window to act is already closed. SentientWallet is the argument that a properly guardrailed AI agent can monitor continuously, decide faster, and act within bounds humans define in advance.",
    decisions: [
      {
        title: "Key Decision 1 — Rule-based layer BEFORE the LLM, not after",
        options: "An LLM that can hallucinate should never have unconstrained authority over financial transactions.",
        chose: "If the rule layer says \"no swaps when slippage > 3%\", that constraint is enforced before the LLM is invoked. The LLM cannot reason its way around a hard rule. Unknown scenarios default to LOCKDOWN, not CONTINUE — safe by default."
      },
      {
        title: "Key Decision 2 — 5 explicit risk scenarios, no catch-all",
        options: "A catch-all anomaly check.",
        chose: "Risk scenarios: CRASH_DETECTION (asset drops > X% in Y minutes), EXPLOIT_DETECTION (abnormal outflow pattern), LIQUIDITY_CRISIS (pool depth below Z threshold), SLIPPAGE_SPIKE (swap impact exceeds tolerance), RUG_PULL_SIGNAL (rapid concentrated token sell-off). Named scenarios are auditable. 'SLIPPAGE_SPIKE at 4.2%, threshold 3.0%' is something a human can verify. 'Anomaly detected' is not. New risk types require code changes — for a financial system, that's a feature, not a bug."
      },
      {
        title: "Key Decision 3 — Plain-language audit log as a first-class feature",
        options: "Structured JSON logs representing the decisions.",
        chose: "DAO governance requires human accountability. If an agent executes a large swap at 3 AM, DAO members need to read what happened in plain English at a board meeting, not decode JSON. The explanation is required before execution — incoherent explanations flag low-confidence decisions for review."
      },
      {
        title: "Key Decision 4 — Sub-3-second decision latency",
        options: "Standard LLM agent pipelines.",
        chose: "Risk detection (pure Python): ~50ms, LangChain pre-compiled chain: ~200ms, GPT-4o with confidence early-exit: ~1.5–2s, Action validation (rules): ~10ms, Web3 RPC call: ~500ms budget. Any layer exceeding its budget triggers CONSERVATIVE_DEFAULT action, not a wait. Speed achieved by accepting that some decisions are 'safest' rather than 'optimal.'"
      }
    ],
    rebuild: "Risk thresholds are currently hardcoded. They should be governance-voted parameters per treasury — different DAOs have different risk tolerances. The architecture supports this; I just haven't built the config layer yet."
  },
  "automation-platform": {
    centralAngle: "Automation workflows are graph traversal problems disguised as UI products.",
    problem: "Most Zapier-clone tutorials focus on the drag-and-drop UI. The real engineering is what happens after someone clicks \"Run\" — executing an arbitrary directed graph of API calls, handling partial failures, and normalizing 15 completely different response formats into one coherent system.",
    decisions: [
      {
        title: "Key Decision 1 — Workflow state as a DAG, not a linear list",
        options: "Linear sequences can't express parallelism.",
        chose: "A DAG lets the executor determine what can run in parallel and what must wait. Stored as adjacency lists in MongoDB, with topological sort at execution time. Added cycle detection on every save — an invalid workflow saved is an invalid workflow that fails at 2 AM."
      },
      {
        title: "Key Decision 2 — Typed API Adapters for heterogeneous integrations",
        options: "Raw JSON payloads directly returned from APIs.",
        chose: "Gmail returns threads. Slack returns messages. Stripe returns events. Each completely different. With typed adapters, the output is always trigger.body.text regardless of source. Users build workflows without understanding each API's internal structure.",
        tradeoff: "15 integrations = 15 adapters, each maintained separately. Worth it."
      },
      {
        title: "Key Decision 3 — Per-node failure policy (halt vs continue)",
        options: "Unified error policies forcing halt.",
        chose: "Some workflows must be atomic (failed charge → don't send fulfillment email). Others are best-effort (one of 5 Slack notifications fails → others should still send). Default is halt-on-failure (safest), with per-node 'continue on error' toggle. One behavior forced on all workflows means some workflows are always wrong."
      },
      {
        title: "Key Decision 4 — AES-256 credential encryption per workspace",
        options: "Plaintext database key storage.",
        chose: "The platform stores API keys for Gmail, Slack, Stripe — credentials granting access to real business data. Plaintext storage means a database breach exposes every connected account. Per-workspace encryption means breach exposure is isolated. Decryption only at execution time. Negligible latency overhead (AES-256 on a short string is microseconds)."
      }
    ],
    rebuild: "The execution engine is synchronous per workflow run. I'd rebuild as a job queue (BullMQ or Cloudflare Queues) for parallel run execution, automatic retries, run history with replay, and queue depth observability. The current architecture taught me exactly why this matters."
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  const study = CASE_STUDY_CONTENT[slug]

  if (!project || !study) {
    nextNotFound()
  }

  const isLive = project.status === "live"

  return (
    <article className="min-h-screen bg-bg text-text pb-20 select-text">
      {/* Dynamic Header */}
      <div className="border-b border-border bg-surface/50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-mono font-bold text-text-3 hover:text-accent transition-colors duration-150 mb-6 uppercase tracking-wider"
          >
            ← Back to Mission Control
          </Link>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                isLive ? "border-success/20 bg-success/5 text-success" : "border-warning/20 bg-warning/5 text-warning"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-success" : "bg-warning animate-pulse"}`} />
                {project.status.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-text-3 font-semibold">{project.year}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text">
              {project.title}
            </h1>
            <p className="text-sm md:text-base text-text-mono font-mono leading-relaxed max-w-2xl">
              {study.centralAngle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-12">
        {/* Left Column: Core writeup */}
        <div className="space-y-12">
          {/* Problem section */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-accent tracking-widest uppercase border-b border-border pb-2">
              The Problem
            </h2>
            <p className="text-sm text-text-2 leading-relaxed font-sans whitespace-pre-line">
              {study.problem}
            </p>
          </section>

          {/* Decisions Section */}
          <section className="space-y-8">
            <h2 className="font-mono text-xs font-bold text-accent tracking-widest uppercase border-b border-border pb-2">
              Key Engineering Decisions
            </h2>
            <div className="space-y-6">
              {study.decisions.map((dec, i) => (
                <div key={i} className="p-5 border border-border bg-surface rounded-lg space-y-3 shadow-sm">
                  <h3 className="text-[13px] font-bold text-text font-mono uppercase tracking-wide">
                    {dec.title}
                  </h3>
                  <div className="text-xs text-text-3 font-sans leading-relaxed">
                    <span className="font-bold text-text-mono font-mono">[OPTIONS CONSIDERED]</span> {dec.options}
                  </div>
                  <div className="text-xs text-text-2 font-sans leading-relaxed">
                    <span className="font-bold text-success font-mono">[DECISION]</span> {dec.chose}
                  </div>
                  {dec.tradeoff && (
                    <div className="text-xs text-text-3 font-sans leading-relaxed border-t border-border/30 pt-2 mt-2">
                      <span className="font-bold text-warning font-mono">[TRADEOFF]</span> {dec.tradeoff}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Retrospective section */}
          <section className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-accent tracking-widest uppercase border-b border-border pb-2">
              Post-Mortem: What I&apos;d Rebuild
            </h2>
            <p className="text-sm text-text-2 leading-relaxed font-sans italic border-l-2 border-warning/30 pl-4">
              {study.rebuild}
            </p>
          </section>
        </div>

        {/* Right Column: Spec sheet / Sidebar */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="p-5 border border-border bg-surface rounded-lg space-y-4 font-mono text-[11px] shadow-panel">
            <div className="border-b border-border/50 pb-2 mb-2">
              <span className="text-[10px] text-text-3 font-bold uppercase tracking-wider">PROJECT METRICS</span>
            </div>
            {project.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col space-y-0.5">
                <span className="text-text-3 font-semibold uppercase">{metric.label}</span>
                <span className="text-text-2 font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>

          {/* Stack Card */}
          <div className="p-5 border border-border bg-surface rounded-lg space-y-3 font-mono text-[11px] shadow-panel">
            <div className="border-b border-border/50 pb-2 mb-2">
              <span className="text-[10px] text-text-3 font-bold uppercase tracking-wider">INFRA STACK</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-[9px] rounded bg-elevated border border-border/30 text-text-2">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links Card */}
          <div className="p-5 border border-border bg-surface rounded-lg space-y-3 font-mono text-[11px] shadow-panel">
            <div className="border-b border-border/50 pb-2 mb-2">
              <span className="text-[10px] text-text-3 font-bold uppercase tracking-wider">SOURCE CODE</span>
            </div>
            <div className="flex flex-col space-y-2 font-bold">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  LIVE SYSTEM ↗
                </a>
              )}
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:text-accent transition-colors"
              >
                GITHUB REPO ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
