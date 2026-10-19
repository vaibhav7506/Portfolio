// Workflow checked against vaibhav7506/LLMGuard. Examples never issue requests.
export const LLM_GUARD_SOURCE = "https://github.com/vaibhav7506/LLMGuard/blob/main/"
export type GuardScenario = "report" | "blocked" | "timeouts"

export const GUARD_STAGES = [
  {
    label: "CONFIGURE", caption: "Authorized POST endpoint", title: "Validate the request before any endpoint traffic.",
    description: "Zod normalizes the endpoint, POST method, JSON headers, request template, selected categories, and authorization confirmation. The body template must include the prompt placeholder.",
    input: "Endpoint URL + JSON template + consent", output: "Normalized scan configuration or validation errors",
    source: "src/lib/validators/scan.ts", artifact: "NormalizedScanInput",
    preview: ['endpoint: https://api.example.com/chat', 'method: POST', 'body: { "prompt": "{{prompt}}" }', 'authorizationAccepted: true'],
    log: "Example endpoint configuration is valid; authorization is confirmed.",
  },
  {
    label: "SSRF GATE", caption: "URL, IP, DNS + headers", title: "Keep private networks outside the request boundary.",
    description: "Check the protocol, hostname, literal IP, and resolved addresses before each request. Resolve twice, reject unsafe destinations, restrict request headers, and reject redirects. The source documents a remaining DNS race; native fetch is not IP-pinned.",
    input: "Normalized endpoint + allowed headers", output: "Checked destination or an error finding",
    source: "src/lib/scanner/ssrf.ts", artifact: "EndpointSafetyCheck",
    preview: ["protocol: http / https only", "localhost / private / link-local: blocked", "DNS: initial check → final check", "redirects: rejected by safeFetch", "native fetch: not IP-pinned"],
    log: "Destination checks precede each request; redirects are rejected.",
  },
  {
    label: "TEST SUITE", caption: "Bounded parallel execution", title: "Fan out the checks without losing partial results.",
    description: "Select safe static tests from the chosen categories. The default limit is 10, the hard maximum is 12, and each request has an 8-second timeout. Promise.allSettled keeps individual failures from discarding the remaining findings.",
    input: "Selected categories + safe test cases", output: "Response text or a per-test execution error",
    source: "src/lib/scanner/runScan.ts", artifact: "Settled per-test findings",
    preview: ["default test limit: 10", "hard maximum: 12", "timeout per request: 8,000 ms", "execution: Promise.allSettled", "one failed request ≠ lost scan"],
    log: "Bounded test requests run concurrently using Promise.allSettled.",
  },
  {
    label: "DETECT", caption: "Deterministic heuristics", title: "Describe the signal, including its uncertainty.",
    description: "Inspect response text for boundary failures, leakage, sensitive patterns, unsafe action claims, output handling, and consumption signals. Findings carry status, severity, confidence, and rationale. This version does not use an LLM judge.",
    input: "Response text + test expectations or errors", output: "passed / warning / vulnerable / error findings",
    source: "src/lib/scanner/detectors.ts", artifact: "DetectorResult",
    preview: ["status + confidence", "detector rationale", "expected safe behavior", "execution failure → error finding", "manual verification still required"],
    log: "Detectors classify observable signals and preserve confidence and rationale.",
  },
  {
    label: "REDACT", caption: "Evidence hygiene", title: "Keep sensitive patterns out of the displayed evidence.",
    description: "Mask recognized credentials, authorization values, JWTs, private keys, database URLs, email addresses, and phone numbers. Findings retain redacted evidence; report exports apply redaction again.",
    input: "Evidence text + request / response metadata", output: "Redacted evidence for review, storage, and export",
    source: "src/lib/scanner/redaction.ts", artifact: "redactedEvidence",
    preview: ["// Synthetic example", "email: demo@example.com", "                 ↓", "email: [REDACTED_EMAIL]", "Authorization: [REDACTED_AUTHORIZATION]"],
    log: "Evidence is redacted before presentation; exports redact it again.",
  },
  {
    label: "REPORT", caption: "Score, persist + export", title: "Turn findings into evidence a developer can review.",
    description: "Start at 100 and deduct points by finding status and severity. All-error scans are Not Scored. Store scans and consent logs in Supabase when configured, with an in-memory fallback, and provide redacted JSON / Markdown exports.",
    input: "Scored findings + redacted evidence", output: "Review-ready report with scope and limitations",
    source: "src/lib/scanner/scoring.ts", artifact: "ScanResult + scoreBreakdown",
    preview: ["// Repository demo fixture", "critical warning: −12", "high warning:      −8", "low vulnerable:    −3", "100 − 12 − 8 − 3 = 77 / Good"],
    log: "Report assembled with score impacts, redacted evidence, and review guidance.",
  },
] as const

export const GUARD_COVERAGE = [
  { id: "LLM01", label: "Prompt injection" },
  { id: "LLM02", label: "Sensitive disclosure" },
  { id: "LLM05", label: "Output handling" },
  { id: "LLM06", label: "Excessive agency" },
  { id: "LLM07", label: "Prompt leakage" },
  { id: "LLM10", label: "Unbounded consumption" },
] as const

export function guardPreview(index: number, scenario: GuardScenario): string {
  if (scenario === "blocked" && index === 0) {
    return "endpoint: http://localhost/api/chat\nmethod: POST\nauthorizationAccepted: true\nnetwork safety check still required"
  }
  if (scenario === "blocked" && index === 1) {
    return "example host: localhost\nSSRF policy: reject\nendpoint requests sent: 0\nerror findings → Not Scored"
  }
  if (scenario === "timeouts" && index === 2) {
    return "request limit: bounded\nper-test timeout: 8,000 ms\nall example requests: error\nsettled error results are retained"
  }
  if (scenario !== "report" && index === 5) {
    return "all findings: error\nscan status: failed\nscore label: Not Scored\nno evidence-based score available"
  }
  return GUARD_STAGES[index].preview.join("\n")
}

export function guardLog(index: number, scenario: GuardScenario): string {
  if (scenario === "blocked" && index === 1) return "Localhost rejected. No test requests are sent in this example."
  if (scenario === "timeouts") {
    if (index === 2) return "Every example request times out; error findings are retained."
    if (index === 3) return "Execution errors become error findings without evaluating response heuristics."
    if (index === 5) return "Scan status: failed. Report label: Not Scored."
  }
  return GUARD_STAGES[index].log
}
