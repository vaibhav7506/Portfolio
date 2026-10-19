"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { ArrowLeft, ArrowRight, Check, ExternalLink, Pause, Play, RotateCcw, Shield, TriangleAlert } from "lucide-react"
import { GUARD_COVERAGE, GUARD_STAGES as stages, LLM_GUARD_SOURCE, guardLog, guardPreview, type GuardScenario } from "./llmGuardWalkthrough"
import styles from "./LLMGuardSection.module.css"

const paths = ["M160 126V234", "M160 234H285Q305 234 305 214V180H500", "M500 180H695V106Q695 86 715 86H840", "M840 86V180", "M840 180V274"]
const scenarios: { id: GuardScenario; label: string }[] = [{ id: "report", label: "Demo report" }, { id: "blocked", label: "Blocked host" }, { id: "timeouts", label: "All tests time out" }]

export function LLMGuardSection() {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [inspected, setInspected] = useState<number | null>(null)
  const [scenario, setScenario] = useState<GuardScenario>("report")
  const [playing, setPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const lastStep = scenario === "blocked" ? 1 : stages.length - 1
  const finished = step === lastStep
  const blocked = scenario === "blocked" && step >= 1
  const timedOut = scenario === "timeouts" && step >= 2
  const running = playing && inView && pageVisible && !reducedMotion && !finished
  const viewed = inspected ?? step
  const stage = stages[viewed]

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    const visibility = () => setPageVisible(!document.hidden)
    visibility()
    document.addEventListener("visibilitychange", visibility)
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility) }
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setStep((current) => Math.min(current + 1, lastStep)), 2700)
    return () => clearTimeout(timer)
  }, [running, step, lastStep, scenario])

  const restart = (nextScenario = scenario) => {
    setScenario(nextScenario)
    setStep(0)
    setInspected(null)
    setPlaying(true)
  }
  const advance = (direction: number) => {
    setPlaying(false)
    setInspected(null)
    setStep((current) => Math.max(0, Math.min(current + direction, lastStep)))
  }
  const inspect = (index: number) => {
    setInspected(index)
    setPlaying(false)
    if (window.matchMedia("(max-width: 900px)").matches) detailsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
  }
  const nodeState = (index: number) => blocked && index === 1 ? "blocked" : timedOut && index === 2 ? "error" : index < step ? "complete" : index === step ? "active" : "pending"
  const stageButton = (index: number) => <button type="button" className={styles.node} data-state={nodeState(index)} aria-current={index === step ? "step" : undefined}
    aria-pressed={viewed === index} aria-label={`Inspect ${stages[index].label.toLowerCase()} stage`} aria-controls="llmguard-stage-details" onClick={() => inspect(index)}>
    <span className={styles.nodeMeta}><span>0{index + 1}</span>{(blocked && index === 1) || (timedOut && index === 2) ? <TriangleAlert size={12} aria-hidden="true" /> : index < step ? <Check size={12} aria-hidden="true" /> : <span className={styles.light} />}</span>
    <strong>{stages[index].label}</strong><small>{stages[index].caption}</small>
  </button>

  return (
    <section ref={sectionRef} id="llmguard-walkthrough" aria-labelledby="llmguard-walkthrough-title" className={styles.section} data-step={step} data-running={running} data-scenario={scenario}>
      <div className={styles.intro}>
        <div><p className={styles.eyebrow}>INTERACTIVE WALKTHROUGH / LLMGUARD LAB</p>
          <h2 id="llmguard-walkthrough-title">Trace the scan.<br />Inspect the evidence.</h2>
          <p className={styles.summary}>An authorized endpoint enters. Bounded checks fan out. Observable signals become a redacted, reviewable report.</p>
        </div>
        <div className={styles.limits} aria-label="Scanner limits from the source"><div><strong>10<span> / 12</span></strong><span>DEFAULT / MAX TESTS</span></div><div><strong>8<span>s</span></strong><span>TIMEOUT PER TEST</span></div></div>
      </div>

      <div className={styles.console}>
        <div className={styles.toolbar}>
          <div className={styles.consoleTitle}><Shield size={14} aria-hidden="true" />ENDPOINT SCAN TRACE <span className={styles.demo}>DEMO</span></div>
          <div className={styles.controls}>
            <button type="button" aria-label="Previous scan walkthrough step" onClick={() => advance(-1)} disabled={step === 0}><ArrowLeft size={14} aria-hidden="true" /></button>
            <button type="button" className={styles.play} onClick={() => {
              if (finished) restart()
              else if (reducedMotion) advance(1)
              else { setInspected(null); setPlaying((current) => !current) }
            }}>
              {finished ? <RotateCcw size={13} aria-hidden="true" /> : playing && !reducedMotion ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
              {finished ? "Replay" : reducedMotion ? "Next step" : playing ? "Pause" : "Play"}
            </button>
            <button type="button" aria-label="Next scan walkthrough step" onClick={() => advance(1)} disabled={finished}><ArrowRight size={14} aria-hidden="true" /></button>
          </div>
        </div>

        <fieldset className={styles.scenarios}><legend>EXAMPLE SCENARIO</legend><div>{scenarios.map((item) => <button key={item.id} type="button" aria-pressed={scenario === item.id} onClick={() => restart(item.id)}>{item.label}</button>)}</div></fieldset>

        <div ref={graphRef} className={styles.graph}>
          <svg viewBox="0 0 1000 360" preserveAspectRatio="none" className={styles.connections} aria-hidden="true">
            {paths.map((path, index) => <g key={path}><path d={path} className={styles.edge} data-complete={index < step} data-blocked={blocked && index === 0} />
              {index === step - 1 && !blocked && <path d={path} className={styles.packet} style={{ animationPlayState: running ? "running" : "paused" }} />}</g>)}
          </svg>
          <div className={styles.intake}>{stageButton(0)}{stageButton(1)}</div>
          <div className={styles.suite} data-state={nodeState(2)}>
            <button type="button" className={styles.suiteHeader} onClick={() => inspect(2)} aria-label="Inspect test suite stage" aria-pressed={viewed === 2} aria-current={step === 2 ? "step" : undefined} aria-controls="llmguard-stage-details">
              <span>03 / TEST SUITE</span><small>Promise.allSettled<ArrowRight size={12} aria-hidden="true" /></small>
            </button>
            <div className={styles.coverage}>{GUARD_COVERAGE.map((item, index) => <div key={item.id} className={styles.test} data-state={blocked ? "pending" : timedOut ? "error" : step > 2 ? "complete" : step === 2 ? "active" : "pending"} style={{ animationDelay: `${index * 120}ms`, animationPlayState: running ? "running" : "paused" }}>
              <span>{item.id}<span className={styles.light} /></span><strong>{item.label}</strong>
            </div>)}</div>
            <div className={styles.suiteCaption}>OWASP 2025 / SIX IN-SCOPE RISK GROUPS</div>
          </div>
          <div className={styles.evidence}>{stageButton(3)}{stageButton(4)}{stageButton(5)}</div>
        </div>

        <div className={styles.runStatus}><span role="status">{blocked ? "HOST REJECTED / NO ENDPOINT REQUEST" : finished ? "EXAMPLE COMPLETE / MANUAL REVIEW" : inspected !== null ? "INSPECTING STAGE / PAUSED" : running ? "PLAYING SCAN EXAMPLE" : "PAUSED / SELECT A STAGE"}</span><span>0{step + 1} / 06</span></div>

        <div className={styles.lower}>
          <div ref={detailsRef} id="llmguard-stage-details" className={styles.inspector} role="region" aria-label="LLMGuard stage details">
            <button type="button" className={styles.back} onClick={() => graphRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })}><ArrowLeft size={12} aria-hidden="true" />Back to scan flow</button>
            <div className={styles.inspectorCaption}>STAGE INSPECTOR <span>0{viewed + 1}</span></div>
            <AnimatePresence mode="wait" initial={false}><motion.div key={`${viewed}-${scenario}`} initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.12 }}>
              <h3>{stage.title}</h3><p className={styles.description}>{stage.description}</p>
              <dl className={styles.io}><div><dt>INPUT</dt><dd>{stage.input}</dd></div><div><dt>OUTPUT</dt><dd>{stage.output}</dd></div></dl>
              <div className={styles.preview}><div>ILLUSTRATIVE OUTPUT / {stage.artifact}</div><pre>{guardPreview(viewed, scenario)}</pre></div>
              <a className={styles.source} href={`${LLM_GUARD_SOURCE}${stage.source}`} target="_blank" rel="noopener noreferrer">View stage implementation<ExternalLink size={12} aria-hidden="true" /></a>
            </motion.div></AnimatePresence>
          </div>

          <div className={styles.report} aria-label="Illustrative scan result">
            <div className={styles.inspectorCaption}>EXAMPLE REPORT <span>DEMO</span></div>
            <div className={styles.score} data-outcome={blocked || (finished && timedOut) ? "error" : finished ? "result" : "pending"}>
              <Shield size={28} aria-hidden="true" />
              {blocked ? <><strong>Host blocked</strong><p>Localhost is rejected before endpoint traffic.</p></> : finished && timedOut ? <><strong>Not Scored</strong><p>All requests failed. No response evidence is available for a meaningful score.</p></> : finished ? <><strong>77<span>/100</span></strong><p>Good / repository demo fixture</p></> : <><strong>Report pending</strong><p>Follow the flow from configuration to findings.</p></>}
            </div>
            {finished && !timedOut && !blocked && <div className={styles.deductions}><div><span>Critical / warning</span><strong>−12</strong></div><div><span>High / warning</span><strong>−8</strong></div><div><span>Low / vulnerable</span><strong>−3</strong></div><p>100 − 12 − 8 − 3 = 77. Errors receive no deduction; an all-error scan is Not Scored.</p></div>}
            <p className={styles.reviewNote}>Findings are heuristic security signals. Passing checks do not prove an endpoint is secure; findings need manual verification.</p>
            <div className={styles.reportLinks}><a href={`${LLM_GUARD_SOURCE}src/lib/storage/demoScan.ts`} target="_blank" rel="noopener noreferrer">Demo fixture<ExternalLink size={11} aria-hidden="true" /></a><a href={`${LLM_GUARD_SOURCE}src/lib/export/markdown.ts`} target="_blank" rel="noopener noreferrer">Redacted export<ExternalLink size={11} aria-hidden="true" /></a></div>
          </div>
        </div>

        <div className={styles.log} aria-label="Illustrative scan execution log"><div className={styles.logTitle}>EXAMPLE EVENT LOG / NO LIVE REQUESTS</div>
          {stages.slice(0, step + 1).map((item, index) => <div key={item.label}><span className={styles.logIndex}>0{index + 1}</span><span className={styles.logTag}>{item.label}</span><span>{guardLog(index, scenario)}</span></div>)}
        </div>
        <p className={styles.disclaimer}>Source-based animation, not a live security scan. Scenarios use illustrative inputs; 77/100 comes from the repository’s demo fixture. This walkthrough sends no endpoint requests and stores no scan data.</p>
      </div>
    </section>
  )
}
