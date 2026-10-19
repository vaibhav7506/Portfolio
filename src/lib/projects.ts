// src/lib/projects.ts

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  role: string
  status: 'active' | 'in-development' | 'prototype' | 'live'
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

export const projectStatusLabels: Record<Project['status'], string> = {
  active: 'Active',
  live: 'Live demo',
  prototype: 'Prototype',
  'in-development': 'In development',
}

export const projects: Project[] = [
  // ─── PROJECT 1: RunbookOS ────────────────────────────────────────
  {
    slug: 'runbookos',
    title: 'RunbookOS',
    tagline: 'Human-governed AI incident response',
    description: 'An incident-response platform that collects diagnostic evidence, validates AI recommendations, and gates runbook actions through Java policy and human approval. Spring Boot owns authorization and state; signed n8n workflows handle bounded orchestration. Demo Mode uses deterministic analysis and simulated safe actions.',
    role: 'Full-Stack Engineer',
    status: 'active',
    year: 2026,
    featured: true,
    order: 1,
    tags: ['Incident Response', 'AI Engineering', 'Human Approval'],
    techStack: ['Java 21', 'Spring Boot', 'Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'n8n', 'Resilience4j', 'Docker', 'OpenTelemetry'],
    links: {
      live: 'https://runbookos-ten.vercel.app/',
      github: 'https://github.com/vaibhav7506/Runbookos',
    },
    media: { thumbnail: '/projects/evidence/runbookos-product.png', hero: '/projects/evidence/runbookos-product.png' },
    metrics: [
      { label: 'Control Plane', value: 'Java policy + human approval' },
      { label: 'Orchestration', value: 'Signed n8n dispatch' },
      { label: 'AI Evidence', value: 'Citation validation + provider fallback' },
      { label: 'Demo Boundary', value: 'Simulated safe actions' },
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

  // ─── PROJECT 3: LoopOS ───────────────────────────────────────────
  {
    slug: 'loopos',
    title: 'LoopOS',
    tagline: 'The Operating System for Self-Improving AI Systems',
    description: 'A loop observability platform with generator→evaluator architecture, weighted criterion scoring, 2-check anomaly detection, and alarm-based Durable Object execution.',
    role: 'Sole Architect & Engineer',
    status: 'live',
    year: 2025,
    featured: true,
    order: 3,
    tags: ['Observability', 'AI Infrastructure', 'Autonomous Agents'],
    techStack: ['TypeScript', 'Cloudflare Workers', 'Durable Objects', 'Cloudflare AI Gateway', 'Hono.js', 'Cloudflare D1'],
    links: {
      live: 'https://loopos-web.pages.dev/',
      github: 'https://github.com/vaibhav7506/LoopOS',
    },
    media: { thumbnail: '/projects/loopos-thumb.png', hero: '/projects/loopos-hero.png' },
    metrics: [
      { label: 'Architecture', value: 'Generator → Evaluator Loop' },
      { label: 'Anomaly Detection', value: 'Duplicate output + budget spike' },
      { label: 'Cost Tracking', value: 'Cloudflare AI Gateway' },
      { label: 'Failure Classification', value: 'INFRA vs BUSINESS' },
    ],
  },

  // ─── PROJECT 4: GitBlamed ────────────────────────────────────────
  {
    slug: 'gitblamed',
    title: 'GitBlamed',
    tagline: 'GitHub activity roasts with caching and provider fallback',
    description: 'A GitHub activity app with a sequential Groq → Gemini → Claude fallback chain, deterministic local roasts when providers are unavailable, a 24-hour KV cache, and per-user SVG share cards.',
    role: 'Full-Stack Developer',
    status: 'live',
    year: 2024,
    featured: true,
    order: 4,
    tags: ['Full-Stack', 'AI API Integration', 'Edge Computing'],
    techStack: ['React 19', 'TypeScript', 'Cloudflare Workers', 'Hono.js', 'Groq', 'Gemini', 'Claude', 'Cloudflare KV'],
    links: {
      live: 'https://git-blamed-web.vercel.app/',
      github: 'https://github.com/vaibhav7506/gitblamed',
    },
    media: { thumbnail: '/projects/gitblamed-thumb.png', hero: '/projects/gitblamed-hero.png' },
    metrics: [
      { label: 'AI Fallback Chain', value: 'Groq → Gemini → Claude' },
      { label: 'Provider Outage', value: 'Deterministic local fallback' },
      { label: 'Cache TTL',         value: '24h KV per username' },
      { label: 'Share Cards',       value: 'Per-user SVG OG images' },
    ],
  },

  // ─── PROJECT 5: SentientWallet ───────────────────────────────────
  {
    slug: 'sentientwallet',
    title: 'SentientWallet',
    tagline: 'Treasury proposal and validation prototype',
    description: 'A treasury-agent prototype that gathers balances, yields, and market sentiment, then asks Gemini for a structured action proposal. Implemented validation checks protocol, gas, and confidence before a simulation handoff. Blockchain execution remains a stub.',
    role: 'AI Engineer',
    status: 'prototype',
    year: 2025,
    featured: true,
    order: 5,
    tags: ['Autonomous Agents', 'LLM Decision Engine', 'DeFi', 'Risk Systems'],
    techStack: ['Python', 'Gemini', 'NestJS', 'Next.js', 'Prisma', 'Web3', 'Action Validation'],
    links: { github: 'https://github.com/vaibhav7506/SentientWallet' },
    media: { thumbnail: '/projects/sentientwallet-thumb.png', hero: '/projects/sentientwallet-hero.png' },
    metrics: [
      { label: 'Agent Flow', value: 'Perceive → Propose → Validate' },
      { label: 'Gas Check', value: 'Above 60 Gwei → WAIT' },
      { label: 'Confidence Check', value: 'Below 0.80 → approval required' },
      { label: 'Execution Boundary', value: 'Blockchain execution is simulated' },
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
  order: 6,
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
  // ─── PROJECT 7: Automation Platform ─────────────────────────────
  {
    slug: 'automation-platform',
    title: 'Automation Platform',
    tagline: 'Webhook-triggered workflows with ordered, durable action execution',
    description: 'A no-code automation platform with transactional webhook intake, signed QStash delivery, and ordered service adapters. Per-action execution records skip completed side effects on redelivery and flag ambiguous processing states for review.',
    role: 'Full-Stack Developer',
    status: 'live',
    year: 2024,
    featured: true,
    order: 7,
    tags: ['Full-Stack', 'Workflow Engine', 'API Architecture'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Upstash QStash'],
    links: { 
      live  :  'https://zapier-project.vercel.app/',
      github: 'https://github.com/vaibhav7506/zapier-project'
     },
    media: { thumbnail: '/projects/automation-thumb.png', hero: '/projects/automation-hero.png' },
    metrics: [
      { label: 'Service Adapters', value: 'Email, Discord, Slack, Telegram, SMS, Sheets, Solana' },
      { label: 'Execution Model', value: 'Ordered QStash stages' },
      { label: 'Intake', value: 'Run + outbox in one transaction' },
      { label: 'Redelivery', value: 'Per-action claims and completion records' },
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
  order: 8,
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
  order: 9,
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
