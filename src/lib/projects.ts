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
    status: 'in-development',
    year: 2025,
    featured: true,
    order: 1,
    tags: ['Observability', 'AI Infrastructure', 'Autonomous Agents'],
    techStack: ['TypeScript', 'Cloudflare Workers', 'Durable Objects', 'Cloudflare AI Gateway', 'Hono.js', 'Cloudflare D1'],
    links: { github: 'https://github.com/vaibhav7506/LoopOS' },
    media: { thumbnail: '/projects/loopos-thumb.png', hero: '/projects/loopos-hero.png' },
    metrics: [
      { label: 'Architecture',         value: 'Generator → Evaluator Loop' },
      { label: 'Anomaly Detection',    value: '2-Check Sequential' },
      { label: 'Cost Tracking',        value: 'Cloudflare AI Gateway' },
      { label: 'Failure Classification',value: 'INFRA vs BUSINESS' },
    ],
  },

  // ─── PROJECT 2: GitBlamed ────────────────────────────────────────
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

  // ─── PROJECT 3: SentientWallet ───────────────────────────────────
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

  // ─── PROJECT 4: Automation Platform ─────────────────────────────
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
    links: { github: 'https://github.com/vaibhav7506' },
    media: { thumbnail: '/projects/automation-thumb.png', hero: '/projects/automation-hero.png' },
    metrics: [
      { label: 'Integrations',      value: '15+ APIs (Gmail, Slack, Stripe...)' },
      { label: 'Execution Model',   value: 'DAG with topological sort' },
      { label: 'Credential Storage',value: 'AES-256 per-workspace encryption' },
      { label: 'Failure Handling',  value: 'Per-node configurable policy' },
    ],
  },
]
