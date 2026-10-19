import Link from "next/link"
import { notFound as nextNotFound } from "next/navigation"
import { projects } from "@/lib/projects"
import { LoopOSSection } from "@/components/sections/LoopOSSection"
import { HeroSection } from "@/components/hero/HeroSection"
import { BootSequence } from "@/components/hero/BootSequence"
import { SystemBlueprint } from "@/components/sections/SystemBlueprint"
import { CodeShiftSection } from "@/components/sections/CodeShiftSection"
import { LLMGuardSection } from "@/components/sections/LLMGuardSection"
import { ProjectWalkthrough } from "@/components/sections/ProjectWalkthrough"
import { projectWalkthroughs } from "@/components/sections/projectWalkthroughs"
import { CaseStudySummary } from "@/components/projects/CaseStudySummary"
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge"
import { caseStudyEvidence } from "@/lib/caseStudyEvidence"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
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
  runbookos: {
    centralAngle: "How do you use AI during an incident while keeping remediation under human control?",
    problem: "An incident response tool connects untrusted signals, diagnostic evidence, model recommendations, and operational actions. Letting a model response or a successful workflow authorize remediation would collapse those boundaries. RunbookOS separates advisory analysis from the Java control plane that owns tenant access, policy, approval validity, execution state, and audit records.",
    decisions: [
      {
        title: "Key Decision 1 — Java authorizes; AI recommends",
        options: "Allow a model to choose and execute tools, rely on frontend confirmation, or enforce action policy in the backend.",
        chose: "Spring Boot evaluates the actor's role, organization, environment, and risk classification. Reversible actions require approval, elevated actions require two distinct eligible approvers, and prohibited actions are denied. Demo Mode additionally blocks high-risk actions.",
        tradeoff: "Responders have an explicit approval step. That friction keeps a model recommendation separate from permission to act."
      },
      {
        title: "Key Decision 2 — Validate evidence references",
        options: "Display unconstrained model prose, ask for citations in a prompt, or validate structured recommendations against the evidence supplied.",
        chose: "The analysis validator checks summary, confidence, recommendations, and citation references. A claim without evidence must be marked as a hypothesis, and references outside the available evidence set are rejected. Demo Mode offers deterministic analysis without a paid provider.",
        tradeoff: "Valid citations establish a traceable reference, not that a model's diagnosis is correct. Responders still need to review the evidence and proposed action."
      },
      {
        title: "Key Decision 3 — Bound the n8n orchestration worker",
        options: "Let n8n own authorization, send a generic webhook, or dispatch only named actions through a scoped signed request.",
        chose: "Java commits execution intent and an outbox event, then dispatches to n8n with HMAC headers and a short-lived token scoped to the organization, execution, nonce, and allowed action identifiers. Retries, circuit breakers, and bulkheads wrap dispatch; callbacks are revalidated by the control plane.",
        tradeoff: "The live path needs PostgreSQL, Redis, configured n8n workflows, and integration credentials. An outbox and retry policy do not establish an exactly-once delivery guarantee."
      },
      {
        title: "Key Decision 4 — Keep denial records after rollback",
        options: "Log failures only, write audit rows in the action transaction, or persist audit events in an independent transaction.",
        chose: "The audit service uses a separate transaction so a rejected operation can roll back without losing its denial record. Records include organization, actor, outcome, resource, and request correlation context.",
        tradeoff: "Audit retention, access, storage, and recovery need operational ownership. The repository demonstrates the implementation; no production traffic or response-time benchmark is claimed."
      }
    ],
    rebuild: "The next iteration would verify more live integration paths beyond the demo adapters, add organization invitations and SSO, and strengthen long-term audit retention and managed deployment guidance. Those are follow-up goals rather than capabilities demonstrated by the public preview."
  },
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
        title: "Key Decision 2 — Explicit output and cost anomaly checks",
        options: "Semantic analysis of every iteration, or deterministic checks on output similarity and per-iteration spend.",
        chose: "The implementation checks for near-duplicate outputs using word-set similarity and for iteration costs above twice the configured per-iteration budget share. An anomaly is recorded and the run stops.",
        tradeoff: "These checks cover repetition and cost spikes. They do not establish semantic drift detection or a general reliability guarantee."
      },
      {
        title: "Key Decision 3 — INFRA_FAILURE vs BUSINESS_FAILURE classification",
        options: "one alarm channel, severity levels (P1/P2/P3), or origin classification.",
        chose: "Chose origin because infra and business failures need completely different responders. A Cloudflare timeout goes to the platform team. A score of 4.2/10 goes to the product team. Mixing them means the wrong team responds, or nobody does."
      },
      {
        title: "Key Decision 4 — Alarm-based Durable Object execution",
        options: "polling, webhooks, or Cloudflare Durable Object alarms.",
        chose: "Use Durable Object alarms to schedule iteration work and persist run and iteration records. The executor records failures so the next step can be inspected.",
        tradeoff: "This couples execution to Cloudflare and still requires retry and recovery handling. No exactly-once execution or loss-free operation is claimed."
      }
    ],
    rebuild: "I would make rubric validation easier to inspect before a run starts, add focused tests for configuration and recovery paths, and publish reproducible execution benchmarks. These are follow-up improvements; no production load or latency target is claimed here."
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
    centralAngle: "A GitHub activity app with caching and explicit provider fallback.",
    problem: "GitBlamed turns a GitHub contribution calendar into a shareable activity summary and roast. It caches responses by username, tries configured model providers in sequence, and provides a deterministic local response when model providers are unavailable. The linked implementation supports these behaviors; this case study does not present a production latency or load benchmark.",
    decisions: [
      {
        title: "Key Decision 1 — Workers API with KV response caching",
        options: "Generate a new response for every request, or reuse a cached response for the same GitHub username.",
        chose: "The Workers API reads and writes a KV cache with a 24-hour TTL. Fresh cached responses bypass contribution fetching and model generation.",
        tradeoff: "Caching delays activity updates until the entry expires. No measured response-time or cold-start figure is provided."
      },
      {
        title: "Key Decision 2 — Sequential fallback over parallel AI requests",
        options: "Request all providers concurrently, or attempt the next provider only after an earlier attempt fails.",
        chose: "Try configured providers in order: Groq, Gemini, then Claude. A successful response stops the cascade. If all providers fail or are absent, a deterministic local roast keeps the response available. Sequential attempts avoid sending every request to every provider.",
        tradeoff: "Fallback adds the time spent in earlier failed attempts. The reviewed provider functions do not enforce a fixed five-second timeout."
      },
      {
        title: "Key Decision 3 — SVG over PNG for the shareable card",
        options: "Render a raster image through a browser, or construct the share image as SVG markup.",
        chose: "The share route constructs a per-user SVG from the response data without launching a browser renderer.",
        tradeoff: "The implementation provides an SVG artifact; cross-platform preview compatibility and render speed have not been benchmarked here."
      },
      {
        title: "Key Decision 4 — Per-user share metadata",
        options: "Static OG image = every share looks identical.",
        chose: "A username-specific page supplies social metadata and a link to the user's share image, so different handles can reference different artifacts. No click-through improvement is claimed."
      }
    ],
    rebuild: "Add explicit per-provider deadlines and structured failure categories. Rate limits, timeouts, and malformed provider output should remain distinguishable while preserving the deterministic local fallback."
  },
  sentientwallet: {
    centralAngle: "How do you turn market context into a reviewable treasury proposal?",
    problem: "Treasury decisions combine wallet balances, available yields, and market conditions. SentientWallet explores a Python perception and proposal loop, with Gemini producing structured actions and application code validating them. The reviewed execution method is a simulation stub, so the case study ends at a validated proposal or WAIT action.",
    decisions: [
      {
        title: "Key Decision 1 — Structured perception before proposal generation",
        options: "Send a free-form request, or assemble explicit market and wallet context.",
        chose: "Gather balances, yield opportunities, and market sentiment. The agent includes the top five yields and a timestamp in the context sent to Gemini. A structured context makes each proposal easier to inspect."
      },
      {
        title: "Key Decision 2 — Validate generated actions in application code",
        options: "Trust the generated action, or check it against explicit conditions.",
        chose: "The validator checks the protocol whitelist, changes non-WAIT actions to WAIT above 60 Gwei gas, and requires approval below 0.80 confidence.",
        tradeoff: "The 15% swap limit appears in configuration and prompting but is not enforced by this validator. Prompt instructions alone do not provide that guarantee."
      },
      {
        title: "Key Decision 3 — Conservative fallback for invalid model output",
        options: "Retry indefinitely, guess an action, or return an explicit held state.",
        chose: "Parsing accepts plain or fenced JSON. A generation or parsing failure produces WAIT with zero confidence and approval required, preserving a visible boundary when the model does not return usable data."
      },
      {
        title: "Key Decision 4 — Explicit simulation boundary",
        options: "Claim a transaction from a proposal, or keep the execution status explicit.",
        chose: "The reviewed execute_action method simulates execution with a sleep and leaves actual blockchain execution as a TODO. A successful simulation is not proof of a signed or broadcast transaction."
      }
    ],
    rebuild: "Enforce amount and slippage constraints in deterministic validation, then implement signing and execution behind explicit approval, independent simulation, and transaction-status checks. Add tests for each rejection path before connecting real funds."
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
    centralAngle: "How do you continue a workflow without repeating an external side effect?",
    problem: "Webhook delivery, queue retries, and external API calls can each fail independently. The current implementation creates a durable run and outbox record at intake, dispatches ordered stages through QStash, and records each action's processing and completion state.",
    decisions: [
      {
        title: "Key Decision 1 — Transactional intake before queue delivery",
        options: "Publish directly from the webhook, or persist the run and dispatch intent together.",
        chose: "Create zapRun and zapRunOutbox in one Prisma transaction. The route publishes stage zero and deletes the outbox entry after publishing succeeds. Disabled workflows are ignored before creating a run."
      },
      {
        title: "Key Decision 2 — Signed, ordered queue stages",
        options: "Run the whole workflow inside the webhook request, or dispatch one stage at a time.",
        chose: "QStash publishes the run ID and stage with five configured retries. The callback verifies the signature and loads actions in sortingOrder, then continues to the next stage after completion.",
        tradeoff: "The current executor is ordered. It does not demonstrate a parallel DAG executor."
      },
      {
        title: "Key Decision 3 — Per-action claims for redelivery",
        options: "Repeat every side effect on retry, or inspect a durable execution record first.",
        chose: "A unique run/action-order record tracks execution. Completed actions skip the side effect, while ambiguous in-progress non-Solana actions return a manual-review error. Stage publication is tracked separately.",
        tradeoff: "A failure between an external side effect and its completion record still needs careful reconciliation. The implementation should not be described as blanket exactly-once execution."
      },
      {
        title: "Key Decision 4 — Service-specific adapters",
        options: "One generic payload for every provider, or resolve each action's metadata and service call.",
        chose: "The processor routes email, Discord, Slack, Telegram, SMS, Sheets, and Solana actions to their respective services. Solana preparation persists transaction details before delivery, while other ambiguous processing states require review."
      }
    ],
    rebuild: "Add explicit outbox recovery and reconciliation tooling for interrupted external actions. Expose queue delivery, execution claims, and next-stage publication as separate events so operators can diagnose retries without guessing whether a side effect happened."
  },
  "examforge": {
  centralAngle: "How do you make AI-generated exam questions trustworthy enough that a learner can rely on their score to gauge real readiness?",

  problem:
    "ExamForge is a mobile-first, no-login mock test platform for Indian government exams (SSC MTS, SSC CGL, SSC GD Constable, SSC CHSL, SSC CPO, RRB NTPC). The core risk with AI-generated questions isn't availability — Groq can generate fast — it's trust: repeated questions, ambiguous phrasing, or client-side-editable scores would make every result meaningless. The system had to generate fresh questions per attempt while keeping timing, scoring, negative marking, and history fully server-authoritative.",

  decisions: [
    {
      title: "Key Decision 1 — Fingerprint-based deduplication instead of trusting prompt wording",
      options:
        "Rely on prompt instructions alone to avoid repeats, cache and reuse a fixed question bank, or generate fresh candidates and explicitly fingerprint-check them against prior history before serving.",
      chose:
        "Chose an explicit validation pipeline: generate candidates → validate structure → create fingerprints → check against the current test, the learner's own history, recently generated questions, and verified content → regenerate on any match. Prompt wording alone was proven unreliable at preventing repetition, so deduplication was moved into deterministic application logic.",
      tradeoff:
        "Adds a regeneration loop and extra Groq calls per test versus a naive single-pass generation, but it's the difference between a demo and a system learners can actually trust across repeat attempts."
    },
    {
      title: "Key Decision 2 — No accounts, anonymous browser-scoped identity instead of a login system",
      options:
        "Require account creation to track progress, allow fully anonymous use with no persistence at all, or issue a random anonymous per-browser identifier that persists attempts, history, and rankings without registration.",
      chose:
        "Chose anonymous browser-scoped identifiers. Every learner gets instant practice with zero signup friction, while still retaining attempt history, weak-topic tracking, and an optional leaderboard nickname — without storing any personal data.",
      tradeoff:
        "Clearing browser data or switching devices creates a new anonymous learner with no cross-device recovery — an explicit, documented limitation rather than a hidden one, in exchange for removing all registration friction."
    },
    {
      title: "Key Decision 3 — Server-authoritative timing, scoring, and answers instead of client-side state",
      options:
        "Trust the client to enforce the timer and compute scores, or keep the timer, correct answers, and scoring logic entirely server-side with only signed state sent to the client.",
      chose:
        "Chose full server authority: the client cannot extend the attempt window, correct options are withheld until final submission, and attempt state is cryptographically signed so it can safely recover after a refresh without exposing answers or allowing tampering.",
      tradeoff:
        "More server round-trips than a client-scored quiz app, but it's the only way a competitive, rank-bearing exam platform can claim its scores mean anything."
    },
    {
      title: "Key Decision 4 — Fully serverless edge stack (Workers + D1 + KV + R2) instead of a traditional backend",
      options:
        "Run a conventional Node server with managed Postgres, or commit to Cloudflare's edge stack — Hono on Workers, D1 with Drizzle for relational data, KV for caching, R2 for document storage.",
      chose:
        "Chose the edge-native stack for low-latency global delivery to a mobile-first, no-login user base where fast first-attempt load matters more than complex backend infrastructure. Hono handles routing on Workers, Drizzle provides type-safe D1 access, KV caches public/read-heavy data, R2 stores documents.",
      tradeoff:
        "Edge tooling (Wrangler, D1 migrations, binding configuration) is younger and less forgiving than a mature server stack — this surfaced directly as config-drift bugs (stale/truncated binding IDs in wrangler.jsonc, stray bindings, a failing D1 migration) that had to be debugged separately from application logic."
    },
    {
      title: "Key Decision 5 — Understanding-gated study plans instead of checkbox completion",
      options:
        "Mark a topic complete when a learner opens or scrolls through it, or require a passing quiz score before marking any topic complete, with spaced revision after.",
      chose:
        "Chose to gate completion behind a short quiz per topic — skipped topics don't count as progress, failed checks return a different question set, and completed topics resurface later through spaced revision instead of disappearing.",
      tradeoff:
        "Higher friction than a simple 'mark as read' UX, but it directly targets the actual problem the product exists to solve: making self-reported progress reflect real understanding."
    }
  ],

  rebuild:
    "The next version should add optional cross-device account linking without breaking the zero-friction anonymous default, and an automated pre-deploy check that diffs wrangler.jsonc against live Cloudflare bindings — the exact class of config drift (stale binding IDs, a failing D1 migration) that cost real debugging time in this build. I'd also strengthen the similarity checker beyond fingerprint matching to catch semantically-equivalent-but-differently-worded duplicates."
},
"tracepilot": {
  centralAngle: "How do you make an AI-assisted QA tool trustworthy when the AI provider is optional, unreliable, or absent?",

  problem:
    "Most QA automation either requires a human to write test scripts by hand, or blindly trusts an LLM to generate them with no fallback. TracePilot was built as a browser QA agent that explores a real user journey, records durable evidence (steps, console errors, network failures, screenshots), and produces both a human-readable bug report and exportable Playwright regression tests — with the deterministic runner staying fully usable even when no AI provider is configured.",

  decisions: [
    {
      title: "Key Decision 1 — Deterministic core with AI as enrichment, not a dependency",
      options:
        "Make AI mandatory for analysis and test generation, run a purely rule-based scanner with no AI at all, or build a deterministic runner where AI only enriches results when available.",
      chose:
        "Chose a deterministic-first architecture. Findings (broken flows, console errors, network failures) are captured and saved before any AI call happens. The AI gateway can plan coverage, enrich bug analysis, and generate structured Playwright files — but if AI is absent, invalid, or times out, deterministic test generation still completes and the run is still useful.",
      tradeoff:
        "AI-enriched reports are noticeably richer than the deterministic baseline, but the product never becomes unusable or misleading just because a provider key is missing or a request fails."
    },
    {
      title: "Key Decision 2 — Provider-agnostic AI gateway instead of locking to one vendor",
      options:
        "Hard-code one LLM provider, let users paste raw API calls, or build a single gateway abstraction supporting multiple providers with bring-your-own-key.",
      chose:
        "Chose a provider-agnostic gateway supporting OpenAI, Groq, Anthropic, and Gemini through one interface. Authenticated users can connect their own encrypted API key (BYOK); the public demo report works with zero AI dependency at all. All provider-specific fetch logic is isolated so adding a new provider doesn't touch product code.",
      tradeoff:
        "More integration surface to maintain than a single-vendor approach, but it avoids vendor lock-in and lets users control their own AI cost and provider choice."
    },
    {
      title: "Key Decision 3 — Encrypted BYOK instead of storing plaintext keys or forcing a platform key",
      options:
        "Store user-provided API keys in plaintext, require every user to rely on a shared platform key, or encrypt user keys with authenticated encryption and decrypt only at request time.",
      chose:
        "Chose AES-256-GCM encryption for BYOK credentials, with the encryption key supplied only via an environment variable, never persisted in the database. Decryption happens only in server code immediately before a provider request; raw and encrypted keys are excluded from every client response, and keys are never logged, sent to the browser runner, or included in generated tests.",
      tradeoff:
        "No key-recovery mechanism exists by design — losing the encryption key means saved keys are unrecoverable, which is an intentional fail-closed security posture rather than a convenience gap."
    },
    {
      title: "Key Decision 4 — Explicit runner safety policy instead of an unrestricted browser agent",
      options:
        "Let the agent navigate and act freely across any target, or scope it to same-domain, time-bounded, step-bounded exploration with destructive-action detection.",
      chose:
        "Chose a tightly scoped runner: same-domain navigation only, bounded step count and runtime, and a text-based classifier that refuses controls containing destructive or transactional language (delete, checkout, purchase, transfer, etc). Targets on localhost or private IP ranges are blocked outside explicit development mode.",
      tradeoff:
        "This makes the agent unsuitable as a general-purpose browser automation tool or pentesting tool by design — which is the correct tradeoff, since an unscoped browser agent against arbitrary targets is a real liability, not a feature."
    },
    {
      title: "Key Decision 5 — Inline execution now, worker-based execution planned",
      options:
        "Run Playwright inline inside a short-timeout serverless function, defer browser execution entirely until a queue system exists, or run inline for the portfolio build while documenting the production path.",
      chose:
        "Chose inline execution from the Node route for the current build, since Playwright launches a real Chromium process that can take tens of seconds — incompatible with short-timeout serverless functions. The README explicitly documents that a production topology should enqueue runs to an isolated worker with persisted progress instead.",
      tradeoff:
        "Inline execution is a known limitation, not a hidden one — the project is honest about what's a portfolio simplification versus what's production-ready, which matters more to a technical interviewer than pretending it's already fully scaled."
    }
  ],

  rebuild:
    "The next version should move browser execution to a queue-backed worker so runs survive longer than a single request lifecycle, add shared artifact storage for screenshots to support horizontal scaling, and extend the safety classifier beyond text pattern matching. I'd also add scheduled/recurring runs and Cypress support alongside Playwright."
},
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  const study = CASE_STUDY_CONTENT[slug]
  const evidence = caseStudyEvidence[slug]

  if (!project || !study || !evidence) {
    nextNotFound()
  }

  return (
    <article className="min-h-screen bg-bg text-text pb-20 select-text">
      {/* Dynamic Header */}
      <div className="border-b border-border bg-surface/50 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center text-xs font-mono font-bold text-text-3 hover:text-accent transition-colors duration-150 mb-4 uppercase tracking-wider"
          >
            ← Back to Mission Control
          </Link>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <ProjectStatusBadge status={project.status} />
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

      <CaseStudySummary project={project} evidence={evidence} />

      {slug === "loopos" && (
        <>
          <BootSequence />
          <HeroSection />
        </>
      )}
      {slug === "codeshift-ai" && <CodeShiftSection />}
      {slug === "llmguard" && <LLMGuardSection />}
      {projectWalkthroughs[slug] && <ProjectWalkthrough key={slug} data={projectWalkthroughs[slug]} />}

      {/* Main Content Area */}
      <div id="case-study" className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-12 scroll-mt-[100px]">
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
              <span className="text-[10px] text-text-3 font-bold uppercase tracking-wider">IMPLEMENTATION DETAILS</span>
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
                  OPEN LIVE DEMO ↗
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

      {/* Scrollytelling deep-dive — LoopOS only */}
      {slug === "loopos" && (
        <>
          <LoopOSSection />
          <SystemBlueprint />
        </>
      )}
    </article>
  )
}
