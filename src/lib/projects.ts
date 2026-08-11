// src/lib/projects.ts

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  role: string
  status: 'in-development' | 'live'
  year: number
  featured: boolean
  order: number
  tags: string[]
  techStack: string[]
  links: {
    github: string
    live?: string
  }
  media: {
    thumbnail: string
    hero: string
  }
  metrics: {
    label: string
    value: string
  }[]
}

export const projects: Project[] = [
  // ─── PROJECT 1: LoopOS ───────────────────────────────────────────
  {
    slug: 'loopos',
    title: 'LoopOS',
    tagline: 'The Operating System for Self-Improving AI Systems',
    description: 'A loop observability platform with generator→evaluator architecture, weighted criterion scoring, 2-check anomaly detection, and alarm-based Durable Object execution.',
    role: 'Sole Architect & Engineer',
    status: 'live',
    year: 2025,
    featured: true,
    order: 1,
    tags: ['Observability', 'AI Infrastructure', 'Autonomous Agents'],
    techStack: ['TypeScript', 'Cloudflare Workers', 'Durable Objects', 'Cloudflare AI Gateway', 'Hono.js', 'Cloudflare D1'],
    links: {
      live: 'https://loopos-web.pages.dev/ ',
       github: 'https://github.com/vaibhav7506/LoopOS'
       },
    media: { thumbnail: '/projects/loopos-thumb.png', hero: '/projects/loopos-hero.png' },
    metrics: [
      { label: 'Architecture',         value: 'Generator → Evaluator Loop' },
      { label: 'Anomaly Detection',    value: '2-Check Sequential' },
      { label: 'Cost Tracking',        value: 'Cloudflare AI Gateway' },
      { label: 'Failure Classification',value: 'INFRA vs BUSINESS' },
    ],
  },

  // ─── PROJECT 2: CodeShift AI ─────────────────────────────────────
{
  slug: 'codeshift-ai',
  title: 'CodeShift AI',
  tagline: 'Review-first JavaScript-to-TypeScript migration workspace',
  description:
    'A developer tool that analyzes legacy JavaScript repositories, generates scoped TypeScript migration plans, applies conservative refactors through a local CLI, runs validation, and opens GitHub pull requests only after explicit human approval.',
  role: 'Sole Architect & Engineer',
  status: 'live',
  year: 2026,
  featured: true,
  order: 2,
  tags: ['Developer Tools', 'Code Migration', 'AI Engineering'],
  techStack: [
    'Next.js',
    'React',
    'TypeScript',
    'TailwindCSS',
    'Node.js',
    'npm Workspaces',
    'GitHub API',
    'OpenAI BYOK',
    'Vercel',
  ],
  links: {
    live: 'https://codeshiftweb.vercel.app/',
    github: 'https://github.com/vaibhav7506/codeshift-ai',
  },
  media: {
    thumbnail: '/projects/codeshift-ai-thumb.png',
    hero: '/projects/codeshift-ai-hero.png',
  },
  metrics: [
    { label: 'Migration Flow', value: 'Analyze → Plan → Patch → Validate → PR' },
    { label: 'Safety Model', value: 'Human approval before every Git mutation' },
    { label: 'Execution Mode', value: 'Local CLI, no unsafe server-side code execution' },
    { label: 'Validation', value: 'Tests, lint, typecheck, build gates' },
    { label: 'Demo Proof', value: 'Reviewable GitHub PR generated end-to-end' },
  ],
},

  // ─── PROJECT 3: GitBlamed ────────────────────────────────────────
  {
    slug: 'gitblamed',
    title: 'GitBlamed',
    tagline: 'AI-powered GitHub activity roaster built for virality',
    description: 'Full-stack app built to survive viral traffic. 3-provider AI fallback chain (Groq → Gemini → Claude), edge KV caching, zero cold starts on Cloudflare Workers, and per-user OG cards for Twitter shareability.',
    role: 'Full-Stack Developer',
    status: 'live',
    year: 2024,
    featured: true,
    order: 2,
    tags: ['Full-Stack', 'AI API Integration', 'Edge Computing'],
    techStack: ['React 19', 'TypeScript', 'Cloudflare Workers', 'Hono.js', 'Groq', 'Gemini', 'Claude', 'Cloudflare KV'],
    links: {
      live: 'https://git-blamed-web.vercel.app/',
      github: 'https://github.com/vaibhav7506/gitblamed',
    },
    media: { thumbnail: '/projects/gitblamed-thumb.png', hero: '/projects/gitblamed-hero.png' },
    metrics: [
      { label: 'Response Time',    value: '<200ms median (Cloudflare edge)' },
      { label: 'AI Fallback Chain', value: 'Groq → Gemini → Claude' },
      { label: 'Cold Starts',       value: '0 (Cloudflare Workers edge)' },
        { label: 'Resilience',       value: '3-provider cascade, 0 cold starts' },
  { label: 'Share Architecture',value: 'Per-user SVG OG cards for virality' },
      { label: 'Cache TTL',         value: '24h KV per username' },
      { label: 'Share Cards',       value: 'Per-user SVG OG images' },
    ],
  },

  // ─── PROJECT 4: SentientWallet ───────────────────────────────────
  {
    slug: 'sentientwallet',
    title: 'SentientWallet',
    tagline: 'Autonomous AI Agent CFO for DAO Treasury Management',
    description: 'An autonomous agent that monitors crypto markets 24/7 and executes treasury decisions in under 3 seconds. LLM decision engine operates inside a hard rule-based guardrail layer — the LLM cannot bypass constraints. 5 named risk scenarios, full plain-language audit log.',
    role: 'AI Engineer',
    status: 'live',
    year: 2025,
    featured: true,
    order: 3,
    tags: ['Autonomous Agents', 'LLM Decision Engine', 'DeFi', 'Risk Systems'],
    techStack: ['Python', 'LangChain', 'OpenAI API', 'Web3', 'Rule-based Guardrails', 'Real-time Market Data'],
    links: { github: 'https://github.com/vaibhav7506/SentientWallet' },
    media: { thumbnail: '/projects/sentientwallet-thumb.png', hero: '/projects/sentientwallet-hero.png' },
    metrics: [
      { label: 'Decision Latency', value: '< 3 seconds end-to-end' },
      { label: 'Risk Scenarios',   value: '5 named (no catch-all)' },
      { label: 'Guardrail Layer',  value: 'Rule-based BEFORE LLM' },
      { label: 'Audit Coverage',   value: '100% actions logged in plain English' },
    ],
  },
 {
  slug: 'llmguard',
  title: 'LLMGuard',
  tagline: 'Black-box AI Security Scanner for LLM App Endpoints',
  description:
    'A defensive AI security scanner that tests authorized LLM/chat API endpoints against OWASP-mapped risks like prompt injection, system prompt leakage, sensitive data disclosure, unsafe agency, improper output handling, and unbounded consumption. Includes SSRF protection, secret redaction, concurrent scan execution, Supabase persistence, and audit-ready reports.',
  role: 'Full Stack AI Security Engineer',
  status: 'live',
  year: 2026,
  featured: true,
  order: 1,
  tags: ['AI Security', 'LLM Security', 'OWASP', 'Full Stack', 'Security Tooling'],
  techStack: [
    'Next.js',
    'TypeScript',
    'Supabase',
    'Vercel',
    'Tailwind CSS',
    'Zod',
    'Recharts',
    'OWASP LLM Top 10',
    'SSRF Protection',
  ],
  links: {
    live: 'https://llmguardweb.vercel.app/',
    github: 'https://github.com/vaibhav7506/LLMGuard',
  },
  media: {
    thumbnail: '/projects/llmguard-thumb.png',
    hero: '/projects/llmguard-hero.png',
  },
  metrics: [
    { label: 'Scan Execution', value: 'Concurrent test runner with Promise.allSettled' },
    { label: 'Security Controls', value: 'SSRF blocking, rate limiting, and consent logging' },
    { label: 'Risk Coverage', value: '6 OWASP-mapped LLM risk categories' },
    { label: 'Evidence Handling', value: 'Secrets redacted before display and storage' },
  ],
},
  // ─── PROJECT 5: Automation Platform ─────────────────────────────
  {
    slug: 'automation-platform',
    title: 'Automation Platform',
    tagline: 'Workflows are graph traversal problems disguised as UI products',
    description: 'Zapier-style no-code automation platform for 15+ APIs. The real engineering is in the execution engine: a DAG executor with topological sort, parallel execution of independent nodes, typed API adapters for heterogeneous response schemas, and per-workspace AES-256 credential encryption.',
    role: 'Full-Stack Developer',
    status: 'live',
    year: 2024,
    featured: true,
    order: 4,
    tags: ['Full-Stack', 'Workflow Engine', 'API Architecture'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    links: { 
      live  :  'https://zapier-project.vercel.app/',
      github: 'https://github.com/vaibhav7506'
     },
    media: { thumbnail: '/projects/automation-thumb.png', hero: '/projects/automation-hero.png' },
    metrics: [
      { label: 'Integrations',      value: '15+ APIs (Gmail, Slack, Stripe...)' },
      { label: 'Execution Model',   value: 'DAG with topological sort' },
      { label: 'Credential Storage',value: 'AES-256 per-workspace encryption' },
      { label: 'Failure Handling',  value: 'Per-node configurable policy' },
    ],
  },

  {
  slug: 'examforge',
  title: 'ExamForge',
  tagline: 'AI-Powered Mock Test Platform for Indian Government Exams',
  description:
    'A mobile-first, no-login practice platform for SSC and RRB exams that generates fresh, deduplicated mock tests on demand via Groq, while keeping timing, scoring, negative marking, and rankings fully server-authoritative. Runs on a fully serverless Cloudflare edge stack — Hono on Workers, D1 with Drizzle, KV, and R2 — with a fingerprint-based pipeline to detect and regenerate repeated or near-duplicate questions.',
  role: 'Full Stack Developer',
  status: 'live',
  year: 2026,
  featured: false,
  order: 3,
  tags: ['EdTech', 'AI Generation', 'Cloudflare Workers', 'Full Stack', 'Edge Computing'],
  techStack: [
    'React 19',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'React Router',
    'Hono',
    'Cloudflare Workers',
    'Cloudflare D1',
    'Drizzle ORM',
    'Cloudflare KV',
    'Cloudflare R2',
    'Groq',
    'Zod',
    'Cloudflare Turnstile',
    'Vitest',
    'Playwright',
  ],
  links: {
    live: 'https://examforge.vaibhav7506.workers.dev/',
    github: 'https://github.com/vaibhav7506/ILovePadhai',
  },
  media: {
    thumbnail: '/projects/examforge-thumb.png',
    hero: '/projects/examforge-hero.png',
  },
  metrics: [
    { label: 'Question Integrity', value: 'Fingerprint-based dedup across test, history, and content' },
    { label: 'Scoring', value: 'Server-authoritative timing, answers, and negative marking' },
    { label: 'Access', value: 'Zero-login, anonymous browser-scoped identity' },
    { label: 'Exam Catalogue', value: 'SSC MTS, CGL, GD Constable, CHSL, CPO, RRB NTPC' },
  ],
},
{
  slug: 'tracepilot',
  title: 'TracePilot',
  tagline: 'Autonomous Browser QA Agent with AI-Enriched Bug Reports',
  description:
    'A browser QA agent that explores a focused user journey with Playwright, records durable evidence (steps, console errors, network failures, screenshots), and turns failures into an evidence-backed report with exportable regression tests. The deterministic runner works standalone; a provider-agnostic AI gateway (OpenAI, Groq, Anthropic, Gemini) with encrypted BYOK optionally enriches analysis and test generation. Currently in active development — full app (auth, dashboard, runner, AI gateway, test export) is built and running locally, not yet deployed.',
  role: 'Full Stack QA Automation Engineer',
  status: 'in-development',
  year: 2026,
  featured: true,
  order: 2,
  tags: ['QA Automation', 'Playwright', 'AI Gateway', 'Full Stack', 'Security'],
  techStack: [
    'Next.js 15',
    'React 18',
    'TypeScript',
    'PostgreSQL',
    'Prisma',
    'Playwright',
    'Zod',
    'AES-256-GCM',
    'Three.js',
    'GSAP',
  ],
  links: {
    // live: not yet deployed
    github: 'https://github.com/vaibhav7506/TracePilot',
  },
  media: {
    thumbnail: '/projects/tracepilot-thumb.png',
    hero: '/projects/tracepilot-hero.png',
  },
  metrics: [
    { label: 'Evidence Capture', value: 'Steps, console errors, network failures, screenshots' },
    { label: 'AI Providers', value: '4-provider gateway with encrypted BYOK' },
    { label: 'Fallback Behavior', value: 'Deterministic test generation with zero AI dependency' },
    { label: 'Safety Policy', value: 'Same-domain, step-bounded, destructive-action blocked' },
    { label: 'Data Model', value: '8 Prisma migrations across auth, runs, AI analysis, BYOK' },
  ],
},
]
