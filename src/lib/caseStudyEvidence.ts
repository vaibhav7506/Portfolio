export interface CaseStudyEvidence {
  problem: string
  contribution: string
  /** Add the owner's actual build duration when supplied; never infer it from commits. */
  duration?: string
  ongoing?: boolean
  result: string
  resultLabel: string
  proof: { label: string; url: string }[]
  limitations: string
  walkthroughId: string
  media: {
    src: string
    alt: string
    kind: string
    caption: string
    origin: string
  }
}

const source = (repository: string, revision: string, path: string, lines: string) =>
  `https://github.com/vaibhav7506/${repository}/blob/${revision}/${path}#${lines}`

// Source references are pinned to the public revisions reviewed for this summary.
// Screenshots document the interface; sample reports do not establish real-world
// usage, benchmark results, or a production security/performance guarantee.
export const caseStudyEvidence: Record<string, CaseStudyEvidence> = {
  runbookos: {
    problem: "Incident responders need useful AI recommendations without giving a model or workflow engine unchecked authority over remediation.",
    contribution: "I built the Spring Boot control plane, Next.js response workspace, evidence-linked analysis, risk-based approval flow, and signed n8n dispatch with persisted audit records.",
    ongoing: true,
    resultLabel: "Implementation + test evidence",
    result: "The policy engine denies prohibited actions regardless of the configured rule, blocks high-risk actions in Demo Mode, and requires approval for reversible actions. Focused repository tests cover these decisions.",
    proof: [
      { label: "Inspect policy enforcement", url: source("Runbookos", "189f6222d929e66aac83b2312b9180012d4406a6", "services/control-plane/src/main/java/com/vaibhav/runbookos/policy/PolicyEngine.java", "L91-L117") },
      { label: "Inspect policy tests", url: source("Runbookos", "189f6222d929e66aac83b2312b9180012d4406a6", "services/control-plane/src/test/java/com/vaibhav/runbookos/policy/PolicyEngineTest.java", "L15-L60") },
      { label: "Inspect citation validation", url: source("Runbookos", "189f6222d929e66aac83b2312b9180012d4406a6", "services/control-plane/src/main/java/com/vaibhav/runbookos/analysis/AnalysisQualityValidator.java", "L10-L48") },
    ],
    limitations: "Demo Mode uses deterministic analysis and simulated safe actions. Live integrations require credentials and activated n8n workflows. The public workspace requires sign-in; the capture shows its guided landing-page preview, not a live incident run.",
    walkthroughId: "runbookos-walkthrough",
    media: {
      src: "/projects/evidence/runbookos-product.png",
      alt: "RunbookOS deployed landing page showing its human-governed incident response flow and a guided checkout-latency incident preview.",
      kind: "Deployed product · guided preview",
      caption: "Actual deployed landing page with an illustrative incident preview. The incident workspace requires sign-in.",
      origin: "https://runbookos-ten.vercel.app/",
    },
  },
  loopos: {
    problem: "AI iteration loops can repeat poor outputs or spend their budget without a clear record of what happened.",
    contribution: "I built the loop configurator, generator/evaluator execution, weighted scoring, and persisted iteration records around Cloudflare Durable Objects and D1.",
    resultLabel: "Source-backed result",
    result: "Duplicate outputs and unusually expensive iterations are flagged as anomalies, and the executor records and stops the affected run.",
    proof: [
      { label: "Inspect anomaly checks", url: source("LoopOS", "d23ee9101aec7882e45c5fcc5665354360abc106", "apps/api/src/lib/anomaly.ts", "L52-L113") },
      { label: "Inspect executor", url: source("LoopOS", "d23ee9101aec7882e45c5fcc5665354360abc106", "apps/api/src/durable-objects/loop-executor.ts", "L287-L390") },
    ],
    limitations: "Anomaly detection uses word-set similarity and cost thresholds. Semantic drift detection and a production load benchmark are not demonstrated here.",
    walkthroughId: "loopos-introduction",
    media: {
      src: "/projects/evidence/loopos-builder.webp",
      alt: "LoopOS engine configurator with task, score threshold, and evaluation criteria controls.",
      kind: "Deployed product",
      caption: "Live task and score-threshold controls in the loop builder.",
      origin: "https://loopos-web.pages.dev/",
    },
  },
  "codeshift-ai": {
    problem: "A JavaScript-to-TypeScript migration needs a reviewable patch and validation evidence before changes are published.",
    contribution: "I built the review workspace and local CLI for repository analysis, scoped migration plans, conservative patches, validation artifacts, and separately approved Git operations.",
    resultLabel: "Public migration artifact",
    result: "A JavaScript-to-TypeScript utility migration is preserved in public demo PR #1, with an inspectable code diff and review history.",
    proof: [
      { label: "Review demo PR #1", url: "https://github.com/vaibhav7506/codeshift-ai-demo-legacy-js/pull/1" },
      { label: "Inspect validation tests", url: source("codeshift-ai", "e4952bb675c1346726b2d50b76ddff7eae0b0c2d", "apps/cli/src/validation.test.ts", "L135-L175") },
    ],
    limitations: "The supported migration path is deliberately conservative. Unsupported recipes and difficult refactors still need manual work; missing validation scripts are marked SKIPPED.",
    walkthroughId: "codeshift-walkthrough",
    media: {
      src: "/projects/evidence/codeshift-ai-product.webp",
      alt: "CodeShift AI's deployed interface with a migration explorer, diff summary, validation preview, and terminal.",
      kind: "Deployed product · sample preview",
      caption: "Deployed interface with illustrative migration data. Inspect demo PR #1 below for the actual patch.",
      origin: "https://codeshiftweb.vercel.app/",
    },
  },
  llmguard: {
    problem: "LLM endpoint reviews need bounded checks, readable findings, and redacted evidence that developers can investigate.",
    contribution: "I built the scan workflow, bounded concurrent runner, response detectors, secret redaction, scoring, and report interface.",
    resultLabel: "Source-backed result",
    result: "A failed test becomes an explicit error finding while other results remain in the report. Evidence is passed through redaction before presentation.",
    proof: [
      { label: "Inspect scan runner", url: source("LLMGuard", "fc14f004f3a16bea83326c726578716c0574112c", "src/lib/scanner/runScan.ts", "L63-L102") },
      { label: "Inspect redaction", url: source("LLMGuard", "fc14f004f3a16bea83326c726578716c0574112c", "src/lib/scanner/redaction.ts", "L1-L80") },
    ],
    limitations: "Findings are heuristic signals from endpoint behavior, not a security certification. Architecture risks and ambiguous findings require manual review.",
    walkthroughId: "llmguard-walkthrough",
    media: {
      src: "/projects/evidence/llmguard-report.webp",
      alt: "LLMGuard's public sample report showing a security score and the heuristic-review notice.",
      kind: "Product sample report",
      caption: "Public sample report with seeded findings and scores.",
      origin: "https://llmguardweb.vercel.app/scan/demo",
    },
  },
  gitblamed: {
    problem: "A GitHub activity app should remain useful when an AI provider fails, while avoiding repeated generation for the same user.",
    contribution: "I built the username-to-calendar flow, contribution parsing, model-provider fallback, KV cache, and per-user share-card route.",
    resultLabel: "Source-backed result",
    result: "If every configured model provider fails or is absent, generation falls back to a deterministic roast based on contribution statistics.",
    proof: [
      { label: "Inspect provider fallback", url: source("GitBlamed", "e56ebb7db54098cd5f7957289040a6366d59d057", "apps/worker/src/services/ai.ts", "L4-L39") },
      { label: "Inspect cache", url: source("GitBlamed", "e56ebb7db54098cd5f7957289040a6366d59d057", "apps/worker/src/services/cache.ts", "L1-L40") },
    ],
    limitations: "Contribution retrieval still depends on GitHub availability. This case study does not establish a latency target or performance under viral traffic.",
    walkthroughId: "gitblamed-walkthrough",
    media: {
      src: "/projects/evidence/gitblamed-product.webp",
      alt: "GitBlamed's deployed GitHub username form and roast action.",
      kind: "Deployed product",
      caption: "Live GitHub username form and roast entry point.",
      origin: "https://git-blamed-web.vercel.app/",
    },
  },
  sentientwallet: {
    problem: "An AI treasury proposal needs an explicit validation boundary before it can be treated as an executable action.",
    contribution: "I built the perception and proposal flow, protocol/gas/confidence checks, and a dashboard for inspecting the agent's decisions.",
    resultLabel: "Source-backed result",
    result: "In the linked public agent, high-gas actions become WAIT and low-confidence proposals require approval instead of continuing unchecked.",
    proof: [
      { label: "Inspect proposal validation", url: source("SentientWallet", "c7d102765496763b815057862a7e63f039e68217", "ai-engine/src/agents/sentient_agent.py", "L317-L367") },
      { label: "Inspect execution boundary", url: source("SentientWallet", "c7d102765496763b815057862a7e63f039e68217", "ai-engine/src/agents/sentient_agent.py", "L411-L435") },
    ],
    limitations: "The linked public agent's blockchain execution is a simulation stub. The local UI shown here has no connected wallet or agent; no mainnet execution is claimed.",
    walkthroughId: "sentientwallet-walkthrough",
    media: {
      src: "/projects/evidence/sentientwallet-product.webp",
      alt: "SentientWallet local development interface with an empty decision ledger, disconnected wallet, and guardrail panel.",
      kind: "Local development interface",
      caption: "Current local decision ledger with the wallet and agent disconnected.",
      origin: "Local development build",
    },
  },
  "automation-platform": {
    problem: "Webhook redelivery can repeat external side effects unless each action's execution state is tracked.",
    contribution: "I built workflow intake, transactional run/outbox records, signed QStash processing, ordered action adapters, and per-action completion tracking.",
    resultLabel: "Source-backed result",
    result: "A redelivered action already marked COMPLETED skips its adapter. An ambiguous in-progress non-Solana action is held for manual review.",
    proof: [
      { label: "Inspect redelivery handling", url: source("zapier-project", "608f093ed88d9e110477f6d4b0db7badf49f6872", "frontend/app/api/internal/qstash/process-zap/route.ts", "L61-L108") },
    ],
    limitations: "Actions run in an ordered sequence. Provider credentials are required, and uncertain in-progress states may need manual reconciliation.",
    walkthroughId: "automation-platform-walkthrough",
    media: {
      src: "/projects/evidence/automation-product.webp",
      alt: "Automation Platform's deployed Zapier-style landing page with sign-in and workflow onboarding links.",
      kind: "Deployed landing page",
      caption: "Public landing page. Workflow execution requires sign-in and provider setup.",
      origin: "https://zapier-project.vercel.app/",
    },
  },
  examforge: {
    problem: "Anonymous exam practice needs trustworthy scoring, timing, and question provenance without requiring a personal account.",
    contribution: "I built the exam-selection interface, browser-scoped identity, attempt flow, server scoring, and practice-generation and question-review paths.",
    resultLabel: "Implementation + test evidence",
    result: "The scoring implementation handles correct, incorrect, and unanswered questions, including negative marking and section/topic breakdowns; the repository includes focused tests for these cases.",
    proof: [
      { label: "Inspect scoring tests", url: source("ILovePadhai", "4a13b23ce3a6dadddfb708a8190dae2b0c43a45a", "tests/unit/attempt-engine.test.ts", "L91-L168") },
      { label: "Inspect scoring implementation", url: source("ILovePadhai", "4a13b23ce3a6dadddfb708a8190dae2b0c43a45a", "src/shared/scoring.ts", "L55-L132") },
    ],
    limitations: "Official papers depend on source and answer-key review. Anonymous history belongs to the browser, and AI practice depends on a configured provider.",
    walkthroughId: "examforge-walkthrough",
    media: {
      src: "/projects/evidence/examforge-product.jpg",
      alt: "ExamForge's local client preview showing its examination desk and practice entry screen.",
      kind: "Local interface preview",
      caption: "Local client preview. Production APIs and AI generation are not connected.",
      origin: "Local client preview",
    },
  },
  tracepilot: {
    problem: "Browser QA needs a readable trace and reproducible regression tests, even when AI enrichment is unavailable.",
    contribution: "I built the Playwright journey runner, evidence/report interface, deterministic test exporter, and optional provider gateway with encrypted user keys.",
    ongoing: true,
    resultLabel: "Source-backed result",
    result: "The fallback generator produces Playwright test files from captured run data without an AI call. A credential-free sample report demonstrates the report interface.",
    proof: [
      { label: "Inspect fallback exporter", url: source("TracePilot", "660fd08515662e7332327a4c8f120399d8fbeb84", "src/lib/test-generation/fallback.ts", "L36-L98") },
      { label: "Inspect sample report", url: source("TracePilot", "660fd08515662e7332327a4c8f120399d8fbeb84", "src/app/demo/report/page.tsx", "L1-L13") },
    ],
    limitations: "Currently a local development project. The sample run uses fixture data; production browser execution still needs an isolated worker and shared artifact storage.",
    walkthroughId: "tracepilot-walkthrough",
    media: {
      src: "/projects/evidence/tracepilot-report.webp",
      alt: "TracePilot local sample QA report with a failed checkout journey, findings, evidence, and generated-test tabs.",
      kind: "Local product · sample report",
      caption: "Local recruiter demo with fixture findings, scores, and run duration.",
      origin: "Local development build · /demo/report",
    },
  },
}
