import Link from "next/link"
import { notFound as nextNotFound } from "next/navigation"
import { projects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [
    { slug: "loopos" },
    { slug: "codeshift-ai" },
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
   "codeshift-ai": {
    centralAngle: "How do you let AI migrate code without trusting it blindly?",
    problem:
      "Most AI coding tools try to rewrite too much at once. That creates a trust problem: developers get a large diff, unclear reasoning, no validation path, and no confidence that the changes are safe. CodeShift AI was built around the opposite principle — review first, automation second. It analyzes a repository, recommends a small migration scope, creates a deterministic JavaScript-to-TypeScript plan, applies conservative local transforms, runs validation, and opens a pull request only after explicit human approval.",

    decisions: [
      {
        title: "Key Decision 1 — CLI-first execution instead of web-based code execution",
        options:
          "Run migrations directly on the hosted web server, use a remote sandbox, or execute locally through a CLI.",
        chose:
          "Chose CLI-first execution because running unknown repositories on a hosted backend is unsafe. A package can contain malicious install scripts, long-running test commands, or filesystem/network behavior that should never execute inside the product server. The web app handles analysis and planning; the CLI performs file edits, validation, Git commits, and PR creation locally where the repository already lives.",
        tradeoff:
          "The web flow is not fully one-click yet. The payoff is a much safer architecture: no arbitrary repo code runs on the hosted backend."
      },
      {
        title: "Key Decision 2 — Deterministic migration plan before any AI enhancement",
        options:
          "Let the LLM rewrite files immediately, generate a migration plan first, or rely only on codemods.",
        chose:
          "Chose deterministic planning first. CodeShift AI analyzes the repo, detects framework/package manager/module system, scores migration readiness, and recommends safe scopes before changing anything. This makes the migration explainable and prevents the product from feeling like a black-box AI rewrite tool.",
        tradeoff:
          "The first version supports a narrower JS-to-TS workflow, but the behavior is predictable and reviewable."
      },
      {
        title: "Key Decision 3 — Scope-bounded migration instead of full-repo rewrite",
        options:
          "Migrate the entire repository, migrate one user-selected scope, or only generate suggestions.",
        chose:
          "Chose scope-bounded migration. The user selects a path like src/utils, and CodeShift AI only modifies files inside that scope plus tsconfig.json when needed. This keeps the diff small enough for a developer to actually review and makes the PR suitable for real-world workflows.",
        tradeoff:
          "Large migrations require multiple runs, but each run produces a clean, understandable pull request."
      },
      {
        title: "Key Decision 4 — Human approval before every Git mutation",
        options:
          "Automatically commit and push after migration, ask once at the end, or require confirmation at every Git step.",
        chose:
          "Chose separate confirmations before branch creation, commit, push, and pull request creation. Code migration is high-impact, so automation should never silently mutate Git history or publish a branch. The PR command shows the migration target, selected scope, changed files, validation result, warnings, and proposed branch before asking for approval.",
        tradeoff:
          "The flow is slightly slower, but it is much safer and more trustworthy."
      },
      {
        title: "Key Decision 5 — BYOK AI as an optional layer",
        options:
          "Bundle a paid AI key, require AI for all migrations, or make AI optional through bring-your-own-key.",
        chose:
          "Chose BYOK because the deterministic migrator should work without AI costs. Users can optionally provide an OpenAI key for patch explanations and PR summaries, but AI output is advisory and cannot expand the selected migration scope. This keeps the product usable, cost-controlled, and safer by default.",
        tradeoff:
          "The AI experience depends on the user's provider key, but the core migration flow remains independent."
      }
    ],

    rebuild:
      "The next version should use GitHub Actions as a safe remote execution layer. The web app could trigger a workflow inside the user's repository, let GitHub run the migration and validation, then return artifacts to the dashboard. That would preserve the current safety model while making the product feel closer to a full web workflow."
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
  "llmguard": {
  centralAngle: "How do you test an LLM app’s security without overclaiming certainty?",

  problem:
    "Most students build AI apps, but very few build tools that test whether those AI apps are safe. LLMGuard was built as a defensive black-box security scanner for authorized LLM/chat endpoints. The goal was not to pretend that heuristic checks can prove security, but to create a practical audit workflow: submit an endpoint, run safe OWASP-mapped tests, detect risky response patterns, redact secrets, score the scan, and generate a report that clearly separates observed behavior from confirmed vulnerabilities.",

  decisions: [
    {
      title: "Key Decision 1 — Black-box endpoint scanning instead of source-code analysis",
      options:
        "Analyze the source code, inspect model prompts directly, or test the deployed LLM endpoint as a black-box API.",
      chose:
        "Chose black-box endpoint scanning because most developers can easily provide an API endpoint, but may not want to upload source code, internal prompts, or infrastructure details. LLMGuard sends safe test prompts to an authorized POST endpoint and evaluates the responses for security signals like prompt injection, system prompt leakage, sensitive information disclosure, unsafe agency, improper output handling, and unbounded consumption.",
      tradeoff:
        "Black-box testing cannot fully verify risks like supply chain security, data poisoning, vector database weaknesses, or misinformation. The payoff is a simpler, safer, and more deployable scanner that works against real hosted endpoints."
    },
    {
      title: "Key Decision 2 — Heuristic detection instead of mandatory LLM judging",
      options:
        "Use a paid LLM judge for every finding, rely only on static regex checks, or combine safe test cases with heuristic response analysis.",
      chose:
        "Chose static safe test cases plus heuristic detectors so the app works without paid AI APIs. The scanner uses deterministic checks for leakage patterns, dangerous HTML, external-action claims, excessive response length, and secret-like data. Findings include severity, status, confidence, evidence, detector rationale, and remediation advice instead of pretending every result is a confirmed vulnerability.",
      tradeoff:
        "Heuristics can produce false positives and false negatives. The product handles this honestly by using confidence labels, warning statuses, and manual-review messaging."
    },
    {
      title: "Key Decision 3 — Concurrent scanning for Vercel free-tier compatibility",
      options:
        "Run test cases sequentially, move scans to a background worker, or run bounded tests concurrently inside the API route.",
      chose:
        "Chose bounded concurrent execution using Promise.allSettled. Sequential scans could exceed Vercel Hobby function limits because each test has a timeout. LLMGuard caps the number of tests, runs them concurrently, converts individual failures into error findings, and keeps the overall scan responsive enough for a free-tier deployment.",
      tradeoff:
        "This avoids long-running scan jobs, but it limits the scanner to a small, carefully selected test suite. Larger enterprise-style scans would need a queue or worker system."
    },
    {
      title: "Key Decision 4 — SSRF protection before sending user-controlled requests",
      options:
        "Trust the user-provided endpoint, block only localhost strings, or perform URL, hostname, header, and DNS-based safety checks.",
      chose:
        "Chose explicit SSRF protection because the scanner accepts arbitrary endpoint URLs. LLMGuard blocks localhost, private IP ranges, link-local addresses, metadata service IPs, unsafe protocols, and dangerous forwarded headers. It also resolves hostnames before requests so the scanner is not accidentally turned into a server-side request tool against internal infrastructure.",
      tradeoff:
        "Some edge-case endpoints may be rejected even if they are safe, but the scanner’s security boundary is more important than accepting every possible URL."
    },
    {
      title: "Key Decision 5 — Supabase persistence with local demo fallback",
      options:
        "Store scans only in memory, require a database from the start, or support both database persistence and local demo mode.",
      chose:
        "Chose Supabase persistence with a local in-memory fallback. Locally, the app can run without any external setup. In production, Supabase stores scans, findings, and consent logs so history works reliably across serverless requests. This keeps onboarding simple while still supporting a real deployed product.",
      tradeoff:
        "The local/demo mode is not persistent across server restarts, but the production version behaves like a real audit system once Supabase environment variables are configured."
    }
  ],

  rebuild:
    "The next version should add a queued scan architecture using a background worker or Vercel-compatible job system. That would allow deeper scan suites, scheduled scans, authenticated scan profiles, and optional LLM-as-judge verification without risking API route timeouts. I would also add a CI/CD mode so teams can run LLMGuard automatically before deploying changes to an AI endpoint."
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
