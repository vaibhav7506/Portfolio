<div align="center">

# Vaibhav Sharma — Portfolio

### AI Agent Infrastructure & Full-Stack Systems Engineer

I build autonomous developer tools, observable AI systems, security tooling, and production-focused full-stack applications.

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-Visit_Site-111111?style=for-the-badge&logo=vercel&logoColor=white)](https://vaibhav7506portfolio.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-vaibhav7506-181717?style=for-the-badge&logo=github)](https://github.com/vaibhav7506)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Vaibhav_Sharma-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vaibhav-sharma-996aa8249/)

</div>

---

## About the Portfolio

This repository contains my personal engineering portfolio, designed as an interactive **Mission Control interface** rather than a traditional resume-style website.

The portfolio focuses on the engineering decisions behind my work: system architecture, execution models, safety boundaries, observability, failure handling, and measurable technical outcomes.

It presents projects through detailed case studies instead of simple screenshots or feature lists.

### What the experience includes

- Interactive Mission Control-inspired interface
- Particle portrait homepage hero with scroll-driven shapes, bounded scatter, and distinct mobile tap feedback
- Keyboard-accessible command palette
- Detailed project case-study routes
- Project capabilities, source evidence, and public GitHub activity
- Dedicated `/now` page for current work and learning
- Motion-driven transitions and scroll interactions
- Three.js-powered visual elements
- Responsive layouts for desktop and mobile
- Direct links to live deployments, source code, resumes, and contact information

---

## Project Catalog

| Project | What it does | Core technologies | Links |
|---|---|---|---|
| **RunbookOS — Active** | Human-governed incident response with evidence-linked AI analysis, Java policy enforcement, human approvals, and signed n8n orchestration. Demo Mode uses simulated safe actions. | Java 21, Spring Boot, Next.js, PostgreSQL, Redis, n8n, Docker | [Live demo](https://runbookos-ten.vercel.app/) · [Source](https://github.com/vaibhav7506/Runbookos) |
| **CodeShift AI** | Review-first JavaScript-to-TypeScript migration workspace that analyzes repositories, creates scoped migration plans, performs conservative local transformations, validates changes, and opens pull requests only after human approval. | Next.js, TypeScript, Node.js, npm Workspaces, GitHub API, BYOK AI | [Live](https://codeshiftweb.vercel.app/) · [Source](https://github.com/vaibhav7506/codeshift-ai) |
| **LoopOS** | Observability-first platform for generator-evaluator loops with weighted scoring, anomaly detection, cost telemetry, and Durable Object-based execution. | Cloudflare Workers, Durable Objects, Hono, D1, AI Gateway, TypeScript | [Live](https://loopos-web.pages.dev/) · [Source](https://github.com/vaibhav7506/LoopOS) |
| **GitBlamed** | Edge-native GitHub activity analyzer that generates AI-powered roasts using a multi-provider fallback chain and cached, shareable OG cards. | React, TypeScript, Cloudflare Workers, Hono, Groq, Gemini, Claude, KV | [Live](https://git-blamed-web.vercel.app/) · [Source](https://github.com/vaibhav7506/gitblamed) |
| **SentientWallet — Prototype** | Treasury proposals with Gemini and application-level protocol, gas, and confidence checks. The public execution method is simulated. | Python, Gemini, Next.js, Prisma, Web3 | [Source](https://github.com/vaibhav7506/SentientWallet) |
| **LLMGuard Lab** | Defensive black-box security scanner for authorized LLM endpoints with OWASP-mapped checks, SSRF protection, evidence redaction, consent logging, and audit-ready reports. | Next.js, TypeScript, Supabase, Zod, Recharts, OWASP LLM Top 10 | [Live](https://llmguardweb.vercel.app/) · [Source](https://github.com/vaibhav7506/LLMGuard) |
| **Automation Platform** | Webhook-triggered workflows with transactional run/outbox intake, signed QStash delivery, ordered actions, and per-action completion records. | Next.js, TypeScript, Prisma, PostgreSQL, QStash | [Live demo](https://zapier-project.vercel.app/) · [Source](https://github.com/vaibhav7506/zapier-project) |
| **ExamForge** | Anonymous exam practice with server-side scoring, question review, and configurable AI practice. | React, TypeScript, Cloudflare Workers, Hono, D1, Drizzle | [Live demo](https://examforge.vaibhav7506.workers.dev/) · [Source](https://github.com/vaibhav7506/ILovePadhai) |
| **TracePilot — In development** | A local browser QA project with captured run evidence, optional AI enrichment, and Playwright test export. | Next.js, TypeScript, Playwright, Prisma, PostgreSQL | [Source](https://github.com/vaibhav7506/TracePilot) |

---

## Portfolio Tech Stack

| Area | Technologies |
|---|---|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, CSS |
| **Animation** | GSAP, `@gsap/react`, Framer Motion |
| **3D and Graphics** | Three.js, React Three Fiber, Drei |
| **Content** | MDX, `next-mdx-remote`, Gray Matter |
| **UI Utilities** | Lucide React, CVA, `clsx`, `tailwind-merge` |
| **Deployment** | Vercel, OpenNext, Cloudflare Workers |
| **Tooling** | ESLint, TypeScript, Wrangler |

---

## Architecture

```text
Portfolio/
├── public/
│   ├── resumes
│   └── static assets
├── src/
│   ├── app/
│   │   ├── api/              # Route handlers
│   │   ├── now/              # Current focus page
│   │   ├── work/[slug]/      # Dynamic project case studies
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # Interface, navigation and visual sections
│   └── lib/
│       └── projects.ts       # Project metadata and metrics
├── next.config.ts
├── wrangler.jsonc
├── wrangler.toml
└── package.json
```

Project information is maintained in a centralized typed data model. Each project contains its description, role, status, stack, links, media, and engineering metrics, allowing the same source of truth to power project cards and detailed case-study pages.

---

## Getting Started

### Prerequisites

- A modern Node.js LTS release
- npm

### Local development

```bash
git clone https://github.com/vaibhav7506/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm run start
```

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run preview` | Build and preview through OpenNext for Cloudflare |
| `npm run deploy` | Build and deploy through OpenNext and Wrangler |
| `npm run cf-typegen` | Generate Cloudflare environment types |

---

## Deployment

The live portfolio is deployed on Vercel:

**[vaibhav7506portfolio.vercel.app](https://vaibhav7506portfolio.vercel.app/)**

The repository also contains OpenNext and Wrangler configuration for Cloudflare-compatible builds.

For Vercel, import the repository and deploy using the default Next.js settings.

For Cloudflare:

```bash
npm run preview
npm run deploy
```

---

## Design Philosophy

This portfolio follows a few principles:

1. **Show engineering depth, not only visual polish.**
2. **Explain why architectural decisions were made.**
3. **Treat safety, failure handling and observability as product features.**
4. **Present projects as working systems rather than isolated demos.**
5. **Make important information discoverable without overwhelming the visitor.**

---

## Contact

I am interested in full-stack engineering, AI infrastructure, autonomous developer tools, agentic systems, and production AI roles.

- **Portfolio:** [vaibhav7506portfolio.vercel.app](https://vaibhav7506portfolio.vercel.app/)
- **GitHub:** [github.com/vaibhav7506](https://github.com/vaibhav7506)
- **LinkedIn:** [Vaibhav Sharma](https://www.linkedin.com/in/vaibhav-sharma-996aa8249/)
- **Email:** [vs7977722@gmail.com](mailto:vs7977722@gmail.com)

---

<div align="center">

Built and maintained by **Vaibhav Sharma**.

</div>
