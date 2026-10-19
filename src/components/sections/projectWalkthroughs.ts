export interface WalkthroughNode {
  label: string
  caption: string
  x: number
  y: number
  description: string
  input: string
  output: string
  source: string
  preview: string[]
}
export interface WalkthroughFrame {
  node: number
  log: string
  tone?: "warning" | "error"
  preview?: string[]
}
export interface WalkthroughScenario {
  label: string
  outcome: string
  result: string
  frames: WalkthroughFrame[]
}
export interface ProjectWalkthroughData {
  slug: string
  title: string
  heading: string
  summary: string
  repository: string
  boundary: string
  nodes: WalkthroughNode[]
  edges: [number, number][]
  scenarios: WalkthroughScenario[]
}

// Descriptions checked against public implementation files. All displayed runs are illustrations.
export const projectWalkthroughs: Record<string, ProjectWalkthroughData> = {
  runbookos: {
    slug: "runbookos", title: "RunbookOS", heading: "Detect. Investigate. Approve before acting.",
    summary: "Follow an incident from verified intake to evidence-linked analysis, Java policy, human approval, and bounded n8n orchestration. Try an approved action, a read-only diagnostic, or a blocked request.",
    repository: "https://github.com/vaibhav7506/Runbookos",
    boundary: "Illustrative execution trace based on the public implementation. This walkthrough sends no requests and performs no remediation. RunbookOS Demo Mode uses deterministic analysis and simulated safe actions.",
    nodes: [
      {
        label: "SIGNAL", caption: "Verify + normalize", x: 12, y: 24,
        description: "Signed incident sources are validated, redacted, normalized, and grouped using delivery idempotency and event fingerprints. A received signal supplies context rather than permission to execute an action.",
        input: "Sentry, GitHub, health-check, or custom signal", output: "Normalized incident + source context", source: "README.md#incident-data-flow",
        preview: ["verify signature / timestamp / nonce", "redact secrets + normalize payload", "deduplicate delivery + group incident"],
      },
      {
        label: "EVIDENCE", caption: "Collect bounded diagnostics", x: 37, y: 24,
        description: "The control plane requests bounded diagnostic workflows. n8n collects evidence such as deployment changes, logs, and health checks; Java retains authority over tenant access and execution state.",
        input: "Incident + authorized diagnostic context", output: "Diagnostic evidence for analysis", source: "docs/architecture/workflow-boundaries.md",
        preview: ["deployment changes + health checks", "bounded workflow steps", "n8n cannot authorize remediation"],
      },
      {
        label: "ANALYSIS", caption: "Validate cited recommendations", x: 62, y: 24,
        description: "Structured analysis must have a summary, valid confidence, and recommendations. Non-hypothesis claims need citations, and cited evidence identifiers must belong to the available evidence set. Passing validation does not prove a diagnosis is correct.",
        input: "Sanitized evidence + provider or demo analyzer", output: "Validated recommendations or rejected output", source: "services/control-plane/src/main/java/com/vaibhav/runbookos/analysis/AnalysisQualityValidator.java",
        preview: ["unknown evidence ID → reject", "uncited claim → hypothesis required", "AI output remains advisory"],
      },
      {
        label: "POLICY", caption: "Java decides action risk", x: 87, y: 24,
        description: "The Java policy engine checks actor role, environment, action risk, and Demo Mode. It denies prohibited actions regardless of configuration and denies high-risk actions in Demo Mode. Default reversible actions require human approval.",
        input: "Named action + actor + risk classification", output: "Allow / require approval / deny", source: "services/control-plane/src/main/java/com/vaibhav/runbookos/policy/PolicyEngine.java",
        preview: ["READ_ONLY → validated allow", "REVERSIBLE → human approval", "HIGH_RISK in demo → deny", "PROHIBITED → always deny"],
      },
      {
        label: "APPROVAL", caption: "Eligible human decision", x: 87, y: 76,
        description: "Approval requests have an expiry and eligibility rules. Decisions are recorded per approver; duplicate decisions are rejected. Elevated actions require distinct eligible approvers and cannot be self-approved by the requester.",
        input: "Pending approval + eligible responder", output: "Approved, denied, or expired request", source: "services/control-plane/src/main/java/com/vaibhav/runbookos/approval/ApprovalService.java",
        preview: ["check eligibility + expiry", "duplicate approver → reject", "elevated request → two distinct users"],
      },
      {
        label: "DISPATCH", caption: "Outbox → signed n8n request", x: 50, y: 76,
        description: "The outbox processor signs workflow dispatches and issues an execution token scoped to the organization, execution, nonce, and allowed action identifiers. Resilience4j retry, circuit breaker, and bulkhead policies wrap the network operation.",
        input: "Authorized execution intent + outbox event", output: "Bounded workflow dispatch or dispatch failure", source: "services/control-plane/src/main/java/com/vaibhav/runbookos/workflow/OutboxProcessor.java",
        preview: ["HMAC headers + scoped execution token", "only allowed action identifiers", "retry / circuit breaker / bulkhead"],
      },
      {
        label: "AUDIT", caption: "Persist decisions + outcomes", x: 12, y: 76,
        description: "Audit events capture the organization, actor, resource, outcome, and correlation context. The service uses a separate transaction so a rejected operation can roll back while its denial record survives.",
        input: "Decision or execution event", output: "Persisted, tenant-scoped audit record", source: "services/control-plane/src/main/java/com/vaibhav/runbookos/audit/AuditService.java",
        preview: ["actor + resource + outcome", "request correlation context", "denial record survives action rollback"],
      },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[3,5],[5,6],[3,6]],
    scenarios: [
      {
        label: "Reversible action", outcome: "Approved demo action recorded",
        result: "The illustrative reversible action waits for an eligible responder before the simulated workflow handoff. No real deployment is changed.",
        frames: [
          {node:0,log:"Example checkout signal validated and grouped into an incident."},
          {node:1,log:"Sample deployment and health evidence collected."},
          {node:2,log:"Cited recommendation passes structural and reference checks."},
          {node:3,log:"Reversible action requires human approval.",tone:"warning"},
          {node:4,log:"Pending: wait for an eligible responder.",tone:"warning",preview:["risk: REVERSIBLE","status: PENDING","execution: held"]},
          {node:4,log:"Example responder approval recorded; required approval count met.",preview:["eligible responder: approved","status: APPROVED","simulated handoff may continue"]},
          {node:5,log:"Illustrative signed dispatch carries only the approved action identifier."},
          {node:6,log:"Demo outcome and approval history retained in the audit trail."},
        ],
      },
      {
        label: "Read-only diagnostic", outcome: "Read-only demo path complete",
        result: "A permitted read-only diagnostic bypasses the approval inbox after Java policy validation. The example retains its dispatch and audit boundaries.",
        frames: [
          {node:0,log:"Example health-check signal accepted."},
          {node:1,log:"Sample diagnostic context collected."},
          {node:2,log:"Cited recommendation requests a read-only check."},
          {node:3,log:"Actor role and read-only policy allow the named diagnostic.",preview:["risk: READ_ONLY","decision: ALLOW","approval inbox: bypassed"]},
          {node:5,log:"Illustrative diagnostic dispatched with its scoped token."},
          {node:6,log:"Read-only outcome recorded; no remediation performed."},
        ],
      },
      {
        label: "Blocked in Demo Mode", outcome: "Denied before dispatch",
        result: "The example high-risk action is rejected in Demo Mode. Approval and n8n dispatch are skipped, while the denial remains auditable. Prohibited actions are always denied.",
        frames: [
          {node:0,log:"Example incident accepted for investigation."},
          {node:1,log:"Sample evidence prepared."},
          {node:2,log:"An illustrative recommendation requests a high-risk action.",tone:"warning"},
          {node:3,log:"Demo Mode blocks HIGH_RISK: decision is DENY.",tone:"error",preview:["demoMode: true","risk: HIGH_RISK","decision: DENY","dispatch: blocked"]},
          {node:6,log:"Denial recorded without an approval request or action dispatch."},
        ],
      },
    ],
  },
  gitblamed: {
    slug: "gitblamed", title: "GitBlamed", heading: "One handle. A heatmap. A resilient roast.",
    summary: "Follow a GitHub handle through the cache, contribution analysis, provider fallback, and share-card route.",
    repository: "https://github.com/vaibhav7506/GitBlamed", boundary: "Illustrative activity only. No GitHub account or model API is queried by this walkthrough.",
    nodes: [
      { label: "HANDLE", caption: "Validate username", x: 12, y: 24, description: "The roast route trims and validates the GitHub username before looking up any cached result.", input: "GitHub handle", output: "Validated username or HTTP 400", source: "apps/worker/src/routes/roast.ts", preview: ["example handle: octocat", "username format: validated", "invalid handle → 400"] },
      { label: "KV CACHE", caption: "24-hour freshness", x: 37, y: 24, description: "Read a lowercase username cache key. A fresh cached roast returns immediately; a read failure or stale entry falls through to generation.", input: "roast:<lowercase username>", output: "Fresh response or cache miss", source: "apps/worker/src/services/cache.ts", preview: ["TTL: 86,400 seconds", "fresh result → cached: true", "read failure → cache miss"] },
      { label: "GITHUB", caption: "Contribution calendar", x: 62, y: 24, description: "On a cache miss, fetch the contribution calendar before generating a roast. Fetch failures return an error rather than invented activity.", input: "Validated handle + GitHub token", output: "Contribution calendar", source: "apps/worker/src/routes/roast.ts", preview: ["fetchContributionCalendar(username)", "source: GitHub calendar", "no calendar → error response"] },
      { label: "PARSE", caption: "Calendar → statistics", x: 87, y: 24, description: "Parse the calendar into heatmap days and contribution statistics. Those statistics become the model prompt's input.", input: "Calendar data", output: "Heatmap days + contribution statistics", source: "apps/worker/src/routes/roast.ts", preview: ["parseCalendar(calendar)", "days + stats", "statistics → generation prompt"] },
      { label: "GENERATE", caption: "Groq → Gemini → Claude", x: 87, y: 76, description: "Try configured providers sequentially. If all fail or are absent, generate a deterministic local roast. Zero contributions have a dedicated response.", input: "Contribution statistics", output: "Generated or deterministic roast", source: "apps/worker/src/services/ai.ts", preview: ["Groq → Gemini → Claude", "all unavailable → localRoast(stats)", "zero contributions → fixed response"] },
      { label: "STORE", caption: "Best-effort KV write", x: 62, y: 76, description: "Store the completed response with a one-day TTL. KV write failures do not discard the response already generated for the user.", input: "Roast + heatmap + statistics", output: "Response + best-effort cache", source: "apps/worker/src/services/cache.ts", preview: ["expirationTtl: 86,400", "KV write error → response retained"] },
      { label: "SHARE", caption: "Per-user SVG route", x: 23, y: 76, description: "The share route renders an image from cached or generated data. The username page supplies per-user social metadata and redirects to the app.", input: "Roast response", output: "SVG share image + social metadata", source: "apps/worker/src/routes/roast.ts", preview: ["/api/share/<username>.svg", "/u/<username> → OG metadata", "no post is published automatically"] },
    ], edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[1,6]],
    scenarios: [
      { label: "Cache miss", outcome: "Roast ready", result: "The example passes through contribution analysis and generation before caching the response.", frames: [{node:0,log:"Username accepted."},{node:1,log:"Example cache miss; inspect GitHub next."},{node:2,log:"Illustrative contribution calendar received."},{node:3,log:"Calendar parsed into days and statistics."},{node:4,log:"Configured primary provider returns roast text."},{node:5,log:"Response queued for best-effort KV storage."},{node:6,log:"Share image can be rendered from the response."}] },
      { label: "Cache hit", outcome: "Cached response", result: "A fresh cached result bypasses contribution fetching and model generation.", frames: [{node:0,log:"Username accepted."},{node:1,log:"Fresh cached roast found.",preview:["cache age: within 24 hours","cached: true","GitHub + AI requests: bypassed"]},{node:6,log:"Cached data is available to the SVG share route."}] },
      { label: "Providers unavailable", outcome: "Local fallback", result: "All model attempts failed in this example; a deterministic stats-based roast still returns.", frames: [{node:0,log:"Username accepted."},{node:1,log:"Example cache miss."},{node:2,log:"Calendar received."},{node:3,log:"Statistics prepared."},{node:4,log:"Example Groq request fails; try Gemini.",tone:"warning"},{node:4,log:"Example Gemini request fails; try Claude.",tone:"warning"},{node:4,log:"Example Claude request fails; use localRoast.",tone:"warning",preview:["Groq: failed","Gemini: failed","Claude: failed","localRoast(stats): available"]},{node:5,log:"Fallback response is still eligible for caching."},{node:6,log:"Result remains available without a model provider."}] },
    ],
  },
  sentientwallet: {
    slug: "sentientwallet", title: "SentientWallet", heading: "Observe. Propose. Validate before acting.",
    summary: "Trace the Python agent's perception loop, Gemini proposal, and explicit validation boundaries.",
    repository: "https://github.com/vaibhav7506/SentientWallet", boundary: "Blockchain execution is a simulation stub in the reviewed source. This demo never connects a wallet, signs, or sends a transaction.",
    nodes: [
      { label: "PERCEIVE", caption: "Balances + yields + sentiment", x: 16, y: 24, description: "The perception cycle gathers wallet balance, yield opportunities, and market sentiment for an active user.", input: "User + wallet or Safe address", output: "Balance, yield, and sentiment data", source: "ai-engine/src/agents/sentient_agent.py", preview: ["get_wallet_balance(...) ","get_yields()","get_market_sentiment()"] },
      { label: "CONTEXT", caption: "Top five opportunities", x: 50, y: 24, description: "Build a context object with the user, balance, top five yields, sentiment, and timestamp.", input: "Perception data", output: "Structured model context", source: "ai-engine/src/agents/sentient_agent.py", preview: ["wallet_balance + sentiment", "yields: top 5", "timestamp attached"] },
      { label: "GEMINI", caption: "Generate action proposal", x: 84, y: 24, description: "Gemini generates a JSON action proposal. Prompt constraints guide the model; they should not be confused with enforced validation rules.", input: "Market context + prompt", output: "Proposed action JSON", source: "ai-engine/src/agents/sentient_agent.py", preview: ["action_type: REBALANCE", "protocol: aave", "confidence_score: 0.92", "illustrative values only"] },
      { label: "PARSE", caption: "Recover JSON or WAIT", x: 84, y: 76, description: "Extract JSON from a plain or fenced model response. Parse or generation failures return a WAIT action with approval required.", input: "Model response text", output: "Parsed action or conservative WAIT", source: "ai-engine/src/agents/sentient_agent.py", preview: ["json.loads(response_text)", "invalid JSON → WAIT", "requires_approval: true"] },
      { label: "VALIDATE", caption: "Whitelist + gas + confidence", x: 50, y: 76, description: "The perception path checks the protocol whitelist, rejects non-WAIT actions above 60 Gwei, and requires approval below 0.80 confidence. The 15% swap limit is present in configuration and prompts, but not enforced by this validator.", input: "Action + market context", output: "Validated proposal, approval request, or WAIT", source: "ai-engine/src/agents/sentient_agent.py", preview: ["whitelist: aave / uniswap / curve / lido", "gas > 60 Gwei → WAIT", "confidence < 0.80 → approval required"] },
      { label: "HANDOFF", caption: "Execution is simulated", x: 16, y: 76, description: "The current execute_action implementation sleeps to simulate execution and contains a TODO for actual blockchain execution. This view ends at the proposal boundary.", input: "Validated or held action", output: "Simulation / approval handoff", source: "ai-engine/src/agents/sentient_agent.py", preview: ["execute_action: simulation stub", "actual blockchain execution: TODO", "no transaction broadcast in this demo"] },
    ], edges: [[0,1],[1,2],[2,3],[3,4],[4,5]],
    scenarios: [
      { label: "Proposal flow", outcome: "Simulation handoff", result: "The illustrative proposal reaches the execution stub. This is not evidence of an on-chain transaction.", frames: [{node:0,log:"Gather sample balance, yields, and sentiment."},{node:1,log:"Context assembled with top five opportunities."},{node:2,log:"Illustrative Gemini proposal generated."},{node:3,log:"Action JSON parsed."},{node:4,log:"Example proposal passes implemented checks."},{node:5,log:"Stop at simulation; blockchain execution remains a TODO."}] },
      { label: "High gas", outcome: "WAIT / approval required", result: "The implemented gas check replaces the proposed action with WAIT and requires approval.", frames: [{node:0,log:"Example market context has gas at 75 Gwei."},{node:1,log:"Context retains the high-gas reading."},{node:2,log:"Model proposes a non-WAIT action."},{node:3,log:"Proposal JSON parsed."},{node:4,log:"75 Gwei exceeds 60 Gwei; action becomes WAIT.",tone:"error",preview:["gas_price_gwei: 75","max_gas_price: 60","action_type: WAIT","requires_approval: true"]},{node:5,log:"No execution claimed; proposal held for review.",tone:"warning"}] },
      { label: "Invalid model output", outcome: "Conservative WAIT", result: "Malformed model output returns a WAIT action with zero confidence and approval required.", frames: [{node:0,log:"Perception inputs gathered."},{node:1,log:"Model context assembled."},{node:2,log:"Example provider output is malformed."},{node:3,log:"JSON decoding fails; create_wait_action is used.",tone:"error",preview:["action_type: WAIT","confidence_score: 0.0","requires_approval: true"]},{node:5,log:"Conservative fallback preserves a review boundary.",tone:"warning"}] },
    ],
  },
  "automation-platform": {
    slug: "automation-platform", title: "Automation Platform", heading: "A webhook becomes a durable sequence of actions.",
    summary: "Follow the current Next.js and QStash path: transactional intake, signed delivery, action execution records, and ordered continuation.",
    repository: "https://github.com/vaibhav7506/zapier-project", boundary: "This animation follows the current QStash route, not the older Kafka README diagram. No external action or transfer is performed.",
    nodes: [
      { label: "WEBHOOK", caption: "Check active workflow", x: 16, y: 24, description: "Find the workflow by ID. Missing workflows return 404, while disabled workflows are ignored.", input: "Webhook JSON + workflow ID", output: "Accepted metadata or ignored request", source: "frontend/app/hooks/catch/[userId]/[zapId]/route.ts", preview: ["zap not found → 404", "isActive: false → ignored", "active workflow → create run"] },
      { label: "RUN + OUTBOX", caption: "Prisma transaction", x: 50, y: 24, description: "Create the run and outbox record in one database transaction. Publish stage zero, then delete the outbox record after publishing succeeds.", input: "Accepted webhook metadata", output: "Run record + dispatch intent", source: "frontend/app/hooks/catch/[userId]/[zapId]/route.ts", preview: ["transaction: zapRun + zapRunOutbox", "publish { zapRunId, stage: 0 }", "delete outbox after publish"] },
      { label: "QSTASH", caption: "Signed queue delivery", x: 84, y: 24, description: "Publish JSON with five configured retries. The processor verifies the Upstash signature with current and next signing keys before processing the message.", input: "Run ID + stage index", output: "Verified processor request", source: "frontend/lib/server/qstash.ts", preview: ["publishJSON(...)", "retries: 5", "callback: /api/internal/qstash/process-zap"] },
      { label: "CLAIM", caption: "Per-action execution record", x: 84, y: 76, description: "Load actions ordered by sortingOrder and inspect the run/action execution record. Completed actions skip their side effect; ambiguous in-progress non-Solana actions request manual review.", input: "Verified run ID + stage", output: "Execution claim or duplicate handling", source: "frontend/app/api/internal/qstash/process-zap/route.ts", preview: ["unique: zapRunId + actionOrder", "COMPLETED → already-completed", "ambiguous PROCESSING → manual review"] },
      { label: "ADAPTER", caption: "Resolve data + invoke service", x: 50, y: 76, description: "Use the action type to resolve metadata and invoke its service adapter. The route includes email, Discord, Slack, Telegram, SMS, Sheets, and prepared Solana transfers.", input: "Action metadata + run data", output: "Service response or action failure", source: "frontend/app/api/internal/qstash/process-zap/route.ts", preview: ["action.type.id selects adapter", "metadata templates use run input", "provider failure → error"] },
      { label: "NEXT STAGE", caption: "Complete then publish", x: 16, y: 76, description: "Mark the action complete and publish the next ordered stage unless it was already published or this was the last action. This code path is a sequence, not parallel DAG scheduling.", input: "Completed action execution", output: "Next stage or end of run", source: "frontend/app/api/internal/qstash/process-zap/route.ts", preview: ["status: COMPLETED", "nextStagePublishedAt checked", "stage + 1 or end"] },
    ], edges: [[0,1],[1,2],[2,3],[3,4],[4,5]],
    scenarios: [
      { label: "Ordered run", outcome: "Stage completed", result: "The example action completes and the processor publishes the next ordered action.", frames: [{node:0,log:"Active workflow accepts an example webhook."},{node:1,log:"Run and outbox are created atomically."},{node:2,log:"Queue delivery reaches the verified processor."},{node:3,log:"Action execution record is claimed."},{node:4,log:"Example adapter completes; no actual service is called."},{node:5,log:"Completion recorded; next ordered stage is published in the real code path."}] },
      { label: "Duplicate delivery", outcome: "Side effect skipped", result: "An already-completed action is not executed again. The processor checks whether continuation needs publishing.", frames: [{node:0,log:"Webhook run already exists in this illustration."},{node:1,log:"Same run ID remains attached to delivery."},{node:2,log:"A queue message is delivered again."},{node:3,log:"Execution is already COMPLETED; adapter is skipped.",tone:"warning",preview:["existing status: COMPLETED","response: already-completed","do not repeat adapter side effect"]},{node:5,log:"Continuation is checked using nextStagePublishedAt."}] },
      { label: "Ambiguous processing", outcome: "Manual review required", result: "A pre-existing PROCESSING non-Solana action is held for review rather than blindly repeated.", frames: [{node:0,log:"Example webhook metadata accepted."},{node:1,log:"Run has an existing execution record."},{node:2,log:"Signed delivery verified."},{node:3,log:"Existing PROCESSING action cannot be safely claimed.",tone:"error",preview:["status: PROCESSING","action type: email","response: manual-review-required","HTTP status: 500"]}] },
    ],
  },
  examforge: {
    slug: "examforge", title: "ExamForge", heading: "Fresh questions. A score the server can defend.",
    summary: "Watch a practice request become generated, deduplicated, verified questions and a server-scored attempt.",
    repository: "https://github.com/vaibhav7506/ILovePadhai", boundary: "Questions, timings, and results here are illustrative. This walkthrough neither calls Groq nor creates a learner attempt.",
    nodes: [
      { label: "CONFIGURE", caption: "Exam + topic + difficulty", x: 12, y: 24, description: "The learner selects an exam, scope, language, difficulty, question count, and session settings without needing an account.", input: "Practice configuration", output: "Requested assessment scope", source: "README.md", preview: ["exam: SSC / RRB catalogue", "scope: subject + topic", "anonymous browser identity"] },
      { label: "GENERATE", caption: "Groq model gateway", x: 37, y: 24, description: "The assessment route requests structured batches through Groq, validates the response schema, and manages model availability and provider cooldowns.", input: "Assessment configuration + prompt", output: "Candidate question batch", source: "src/server/ai-assessment-routes.ts", preview: ["generation → structured response", "schema validation", "provider gates + cooldowns"] },
      { label: "DEDUP", caption: "Fingerprints + similarity", x: 62, y: 24, description: "Compare question fingerprints and normalized token similarity with existing and candidate questions. A duplicate candidate is excluded before publishing.", input: "Candidate questions + history", output: "Distinct candidates or regeneration", source: "src/server/ai-assessment-routes.ts", preview: ["exact / stem / option-order hashes", "token similarity threshold: 0.78", "duplicate → exclude candidate"] },
      { label: "VERIFY", caption: "Check answers before publish", x: 87, y: 24, description: "Candidates pass deterministic or independent model verification before being inserted as published questions with verification metadata.", input: "Distinct candidate questions", output: "Verified published question set", source: "src/server/ai-assessment-routes.ts", preview: ["verification method recorded", "verified candidates → published", "question fingerprints persisted"] },
      { label: "ATTEMPT", caption: "Signed, timed session", x: 84, y: 76, description: "The attempt route stores start and expiry times and issues a signed attempt token. Server checks enforce the attempt window when answers are saved or submitted.", input: "Published questions + visitor", output: "Timed attempt + saved answers", source: "src/server/attempt-routes.ts", preview: ["startedAt + expiresAt", "signAttemptToken(...) ", "expired attempt → submit on server"] },
      { label: "SCORE", caption: "Server-side marking", x: 50, y: 76, description: "The server calculates marks and negative marking from the saved attempt and authoritative answers rather than trusting a client-supplied score.", input: "Saved attempt + server answer key", output: "Final score + accuracy + time", source: "src/server/attempt-routes.ts", preview: ["submitAttempt(...) ", "score.finalScore", "score.accuracy", "score.completionTimeSeconds"] },
      { label: "IMPROVE", caption: "History + weak topics", x: 16, y: 76, description: "Submission updates result records and practice signals used for topic mastery and learner progress. Anonymous identity keeps the flow accessible without account creation.", input: "Server-scored attempt", output: "Result history + mastery signals", source: "src/server/attempt-routes.ts", preview: ["result row recorded", "topic mastery updated", "history belongs to browser identity"] },
    ], edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[2,1]],
    scenarios: [
      { label: "Practice flow", outcome: "Attempt scored", result: "The sample illustrates a generated and verified test followed by authoritative server-side submission.", frames: [{node:0,log:"Learner chooses the practice scope."},{node:1,log:"Illustrative Groq question batch generated."},{node:2,log:"Candidate fingerprints and history checked."},{node:3,log:"Accepted candidates verified before publication."},{node:4,log:"Signed attempt starts with a server expiry."},{node:5,log:"Saved answers scored on the server."},{node:6,log:"Result and mastery signals recorded in the real workflow."}] },
      { label: "Duplicate question", outcome: "Fresh candidate retained", result: "The repeated candidate is discarded and a replacement passes deduplication and verification.", frames: [{node:0,log:"Practice scope selected."},{node:1,log:"Batch contains an example repeated question."},{node:2,log:"Duplicate fingerprint found; candidate excluded.",tone:"warning",preview:["candidate: already seen","dedup decision: reject","replacement still needs verification"]},{node:1,log:"A replacement batch is generated."},{node:2,log:"Replacement passes duplicate checks."},{node:3,log:"Replacement verified before publication."},{node:4,log:"Distinct set enters the attempt."},{node:5,log:"Answers scored on submission."},{node:6,log:"History retains the reviewed result."}] },
      { label: "Time expires", outcome: "Timed out / submitted", result: "The server finalizes an expired attempt instead of accepting unlimited extra answer time.", frames: [{node:0,log:"Timed session configured."},{node:1,log:"Question candidates generated."},{node:2,log:"Duplicate checks complete."},{node:3,log:"Questions verified."},{node:4,log:"Server expiry reached; late answer save is rejected.",tone:"warning",preview:["Date.now() >= expiresAt","submitAttempt on server","status: timed_out"]},{node:5,log:"Stored answers scored under the attempt deadline."},{node:6,log:"Timed-out result is available for review."}] },
    ],
  },
  tracepilot: {
    slug: "tracepilot", title: "TracePilot", heading: "A browser journey becomes reproducible evidence.",
    summary: "Follow a bounded Playwright run through evidence capture, optional AI analysis, and regression-test generation.",
    repository: "https://github.com/vaibhav7506/TracePilot", boundary: "A local-development product walkthrough. No browser job, provider call, or generated test is executed by this animation.",
    nodes: [
      { label: "POLICY", caption: "Target + run boundaries", x: 16, y: 24, description: "The runner uses configured navigation, step, runtime, same-domain, evidence, and destructive-action limits. Text-based action checks are a safety boundary, not a guarantee against all side effects.", input: "Target URL + user goal + policy", output: "Bounded browser-run context", source: "src/lib/runner/safety.ts", preview: ["same-domain navigation", "runtime + step limits", "destructive controls refused"] },
      { label: "EXPLORE", caption: "Playwright Chromium", x: 50, y: 24, description: "Launch Chromium and explore a focused user journey. The reviewed build executes inline for local development; the source recommends a long-lived worker for production browser jobs.", input: "Bounded run context", output: "Observed browser steps", source: "src/lib/runner/browser-runner.ts", preview: ["executeRun(input)", "deadline-aware timeouts", "inline local execution"] },
      { label: "EVIDENCE", caption: "Steps, errors + screenshots", x: 84, y: 24, description: "Persist browser steps and findings as execution proceeds, capturing console errors, network failures, URLs, and screenshot references. Request-scoped login credentials are redacted.", input: "Browser observations", output: "Durable trace + deterministic findings", source: "src/lib/runner/browser-runner.ts", preview: ["BrowserStep + Finding records", "console / network errors", "credential-safe summary"] },
      { label: "AI ANALYSIS", caption: "Optional provider gateway", x: 84, y: 76, description: "Optional planning and analysis go through the provider gateway. Evidence and deterministic QA findings are retained when enrichment is absent or fails.", input: "Credential-free run evidence", output: "Optional enrichment or safe fallback", source: "src/lib/runner/browser-runner.ts", preview: ["resolveAiConfig(userId)", "AI analysis: optional", "evidence exists before enrichment"] },
      { label: "TESTS", caption: "Validate AI / fallback", x: 50, y: 76, description: "Filter unsafe steps and findings. Accept AI-generated tests only if safety checks pass; otherwise produce deterministic fallback tests from observed routes and findings.", input: "Safe routes + findings + generation settings", output: "Reviewed .spec.ts candidates", source: "src/lib/test-generation/generate-run-tests.ts", preview: ["generatedTestIsSafe(...) ", "invalid or missing AI → FALLBACK", "filenames normalized"] },
      { label: "EXPORT", caption: "Reviewable Playwright specs", x: 16, y: 76, description: "Save generated test records for preview and export. Test files use runtime environment variables for credentials and must be reviewed before use.", input: "Safe generated test files", output: "Preview / file download / ZIP", source: "src/lib/test-generation/fallback.ts", preview: ["generated .spec.ts files", "TEST_BASE_URL", "TEST_EMAIL / TEST_PASSWORD", "review before running in CI"] },
    ], edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[2,4]],
    scenarios: [
      { label: "QA journey", outcome: "Evidence + test candidates", result: "The sample ends with reviewable regression-test candidates backed by observed browser evidence.", frames: [{node:0,log:"Goal and runner limits configured."},{node:1,log:"Illustrative browser journey explored."},{node:2,log:"Steps, errors, and screenshot references persisted."},{node:3,log:"Example optional enrichment accepted."},{node:4,log:"Generated test candidates pass safety checks."},{node:5,log:"Specs are available for review and export."}] },
      { label: "AI unavailable", outcome: "Deterministic fallback", result: "Missing or failed AI does not erase the browser trace; deterministic test generation remains available.", frames: [{node:0,log:"Run policy configured."},{node:1,log:"Browser observations captured."},{node:2,log:"Deterministic findings saved."},{node:3,log:"Example provider unavailable; enrichment skipped.",tone:"warning",preview:["AI unavailable / timed out","deterministic evidence retained"]},{node:4,log:"generateFallbackTests builds safe candidates.",preview:["generationMode: FALLBACK","routes + findings → specs","no AI dependency"]},{node:5,log:"Fallback specs remain reviewable and exportable."}] },
      { label: "Unsafe test rejected", outcome: "Safe fallback candidates", result: "Unsafe or invented AI test content is rejected and the deterministic generator supplies bounded alternatives.", frames: [{node:0,log:"Policy boundaries established."},{node:1,log:"Safe journey explored."},{node:2,log:"Observed routes and findings retained."},{node:3,log:"AI returns example test content."},{node:4,log:"generatedTestIsSafe rejects the candidate.",tone:"error"},{node:4,log:"Fallback generation uses observed safe evidence.",preview:["unsafe AI content: rejected","generationMode: FALLBACK","safety filter applied again"]},{node:5,log:"Only retained safe candidates are prepared for review."}] },
    ],
  },
}
