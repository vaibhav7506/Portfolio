"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { ArrowLeft, ArrowRight, Check, ExternalLink, LockKeyhole, Pause, Play, RotateCcw, TriangleAlert } from "lucide-react"
import { CODE_SHIFT_SOURCE, CODE_SHIFT_STAGES as stages } from "./codeshiftWalkthrough"
import styles from "./CodeShiftSection.module.css"

const edges = ["M100 60H300", "M300 60H500", "M500 60V180", "M500 180H300", "M300 180H100"]
const positions = [{ col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }, { col: 3, row: 2 }, { col: 2, row: 2 }, { col: 1, row: 2 }]

export function CodeShiftSection() {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const inspectorRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [inspected, setInspected] = useState<number | null>(null)
  const [playing, setPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [failedExample, setFailedExample] = useState(false)
  const failed = failedExample && step >= 3
  const finished = step === stages.length - 1
  const running = playing && inView && pageVisible && !reducedMotion && !failed && !finished
  const viewed = inspected ?? step
  const stage = stages[viewed]

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    const section = sectionRef.current
    if (section) observer.observe(section)
    const visibility = () => setPageVisible(!document.hidden)
    visibility()
    document.addEventListener("visibilitychange", visibility)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", visibility)
    }
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setStep((current) => Math.min(current + 1, stages.length - 1)), 2800)
    return () => clearTimeout(timer)
  }, [running, step])

  const replay = () => {
    setStep(0)
    setInspected(null)
    setFailedExample(false)
    setPlaying(true)
  }

  const advance = (direction: number) => {
    setPlaying(false)
    setInspected(null)
    setStep((current) => Math.max(0, Math.min(current + direction, failedExample ? 3 : stages.length - 1)))
  }

  return (
    <section ref={sectionRef} id="codeshift-walkthrough" aria-labelledby="codeshift-walkthrough-title" className={styles.section} data-step={step} data-running={running} data-scenario={failedExample ? "failed-check" : "clean"}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>INTERACTIVE WALKTHROUGH / CODESHIFT AI</p>
          <h2 id="codeshift-walkthrough-title">From legacy JavaScript<br />to a reviewable migration.</h2>
          <p className={styles.summary}>Follow the repository analysis, scoped local transforms, and validation evidence. Every Git operation stays behind its own developer decision.</p>
        </div>
        <div className={styles.boundaries}>
          <span><span className={styles.dot} />WEB: ANALYZE + PLAN</span>
          <span><span className={styles.dot} />CLI: MIGRATE + VALIDATE</span>
          <span><LockKeyhole size={12} aria-hidden="true" />HUMAN: APPROVE EACH GIT STEP</span>
        </div>
      </div>

      <div className={styles.console}>
        <div className={styles.toolbar}>
          <div className={styles.consoleTitle}><span className={styles.dot} />MIGRATION TRACE <span className={styles.demo}>DEMO</span></div>
          <div className={styles.controls}>
            <button type="button" onClick={() => advance(-1)} disabled={step === 0} aria-label="Previous walkthrough step"><ArrowLeft size={14} aria-hidden="true" /></button>
            <button type="button" className={styles.play} onClick={() => {
              if (failed || finished) replay()
              else if (reducedMotion) advance(1)
              else { setInspected(null); setPlaying((current) => !current) }
            }}>
              {failed || finished ? <RotateCcw size={13} aria-hidden="true" /> : playing && !reducedMotion ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
              {failed || finished ? "Replay" : reducedMotion ? "Next step" : playing ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={() => advance(1)} disabled={finished || failed} aria-label="Next walkthrough step"><ArrowRight size={14} aria-hidden="true" /></button>
          </div>
        </div>

        <div className={styles.traceLayout}>
          <div className={styles.trace}>
            <div className={styles.traceCaption}><span>JS → TS / SCOPE: src/utils</span><span>{String(step + 1).padStart(2, "0")} / 06</span></div>
            <div ref={graphRef} className={styles.graph}>
              <svg viewBox="0 0 600 240" preserveAspectRatio="none" className={styles.connectors} aria-hidden="true">
                {edges.map((path, index) => <g key={path}>
                  <path d={path} className={styles.edge} data-complete={index < step} />
                  {index === step - 1 && <path d={path} className={styles.packet} style={{ animationPlayState: running ? "running" : "paused" }} />}
                </g>)}
              </svg>
              {stages.map((item, index) => {
                const error = failedExample && index === 3 && step >= 3
                const state = error ? "error" : index < step ? "complete" : index === step ? "active" : "pending"
                return <button key={item.label} type="button" className={styles.node} data-state={state}
                  aria-label={`Inspect ${item.label.toLowerCase()} stage`} aria-pressed={viewed === index} aria-controls="codeshift-stage-inspector"
                  style={{ gridColumn: positions[index].col, gridRow: positions[index].row }}
                  onClick={() => {
                    setInspected(index)
                    setPlaying(false)
                    if (window.matchMedia("(max-width: 1050px)").matches) {
                      inspectorRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
                    }
                  }}>
                  <span className={styles.nodeMeta}><span>0{index + 1}</span>{error ? <TriangleAlert size={12} aria-hidden="true" /> : index < step ? <Check size={12} aria-hidden="true" /> : index === 5 ? <LockKeyhole size={12} aria-hidden="true" /> : <span className={styles.nodeLight} />}</span>
                  <strong>{item.label}</strong><small>{item.lane}</small>
                </button>
              })}
            </div>
            <div className={styles.traceFooter}>
              <span role="status">{failed ? "CHECK FAILED / PAUSED" : finished ? "AWAITING DEVELOPER APPROVAL" : inspected !== null ? "INSPECTING STAGE / PAUSED" : running ? "PLAYING EXAMPLE" : "PAUSED / SELECT A STAGE"}</span>
              <button type="button" aria-pressed={failedExample} onClick={() => {
                if (failedExample) replay()
                else { setFailedExample(true); setStep(3); setInspected(null); setPlaying(false) }
              }}><TriangleAlert size={12} aria-hidden="true" />{failedExample ? "Reset example" : "Simulate failed check"}</button>
            </div>
            <div className={styles.log} aria-label="Illustrative execution log">
              <div className={styles.logTitle}>EXAMPLE EXECUTION LOG</div>
              {stages.slice(0, step + 1).map((item, index) => <div key={item.label} className={styles.logLine}>
                <span className={styles.logIndex}>0{index + 1}</span><span className={styles.logTag}>{item.label}</span>
                <span>{failed && index === 3 ? "Example typecheck failed. Inspect the diagnostics before proceeding." : item.log}</span>
              </div>)}
            </div>
          </div>

          <div ref={inspectorRef} id="codeshift-stage-inspector" className={styles.inspector} role="region" aria-label="CodeShift stage details">
            <button type="button" className={styles.backToFlow} onClick={() => graphRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })}><ArrowLeft size={12} aria-hidden="true" />Back to flow</button>
            <div className={styles.inspectorCaption}>STAGE INSPECTOR <span>0{viewed + 1}</span></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={viewed} initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.12 }}>
                <h3>{stage.title}</h3><p className={styles.description}>{stage.description}</p>
                <dl className={styles.io}><div><dt>INPUT</dt><dd>{stage.input}</dd></div><div><dt>OUTPUT</dt><dd>{stage.output}</dd></div></dl>
                <div className={styles.command}><span>$</span><code>{stage.command}</code></div>
                <div className={styles.preview}>
                  <div className={styles.previewTitle}>{viewed === 5 ? "SEPARATE CLI APPROVALS" : "ILLUSTRATIVE OUTPUT"}</div>
                  {viewed === 3 ? <div className={styles.checks}>
                    {["test", "build", "typecheck", "lint"].map((script) => <div key={script}><code>{script}</code><span data-result={script === "lint" ? "skip" : failedExample && script === "typecheck" ? "fail" : "pass"}>{script === "lint" ? "SKIPPED" : failedExample && script === "typecheck" ? "FAILED" : "PASS"}</span></div>)}
                    <p>{failedExample ? "Example diagnostic: TS2322 — type mismatch. Review and fix locally, then validate again." : "Example results only. In a real run, outcomes depend on the repository. Missing scripts are skipped."}</p>
                  </div> : viewed === 5 ? <div className={styles.approvals}>
                    {["Create branch", "Commit migration files", "Push branch", "Open pull request"].map((label) => <div key={label}><LockKeyhole size={12} aria-hidden="true" /><span>{label}</span><small>ASK</small></div>)}
                    <p>This walkthrough stops at review. These controls do not perform Git operations.</p>
                  </div> : <pre>{stage.preview.map((line, index) => <span key={index} className={line.startsWith("+") ? styles.added : line.startsWith("-") ? styles.removed : undefined}>{line}{"\n"}</span>)}</pre>}
                </div>
                <div className={styles.artifact}><span>ARTIFACT</span><code>{stage.artifact}</code></div>
                <a className={styles.source} href={`${CODE_SHIFT_SOURCE}${stage.source}`} target="_blank" rel="noopener noreferrer">View stage implementation<ExternalLink size={12} aria-hidden="true" /></a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className={styles.disclaimer}>Source-based demonstration with illustrative code and results. No repository is analyzed or modified by this animation. Optional AI provides advisory notes; the core migration remains deterministic.</div>
      </div>
    </section>
  )
}
