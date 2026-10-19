"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { ArrowLeft, ArrowRight, Check, ExternalLink, Pause, Play, RotateCcw, Workflow, TriangleAlert } from "lucide-react"
import type { ProjectWalkthroughData } from "./projectWalkthroughs"
import styles from "./ProjectWalkthrough.module.css"

export function ProjectWalkthrough({ data }: { data: ProjectWalkthroughData }) {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [inspected, setInspected] = useState<number | null>(null)
  const [playing, setPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const scenario = data.scenarios[scenarioIndex]
  const frame = scenario.frames[step]
  const lastStep = scenario.frames.length - 1
  const finished = step === lastStep
  const running = playing && inView && pageVisible && !reducedMotion && !finished
  const viewed = inspected ?? frame.node
  const stage = data.nodes[viewed]
  const preview = viewed === frame.node && frame.preview ? frame.preview : stage.preview
  const visited = new Set(scenario.frames.slice(0, step).map((item) => item.node))
  const detailsId = `${data.slug}-stage-details`

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
    const timer = window.setTimeout(() => setStep((current) => Math.min(current + 1, lastStep)), 2600)
    return () => window.clearTimeout(timer)
  }, [running, step, lastStep, scenarioIndex])

  const restart = (nextScenario = scenarioIndex) => {
    setScenarioIndex(nextScenario)
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
    if (window.matchMedia("(max-width: 800px)").matches) detailsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
  }

  return (
    <section ref={sectionRef} className={styles.section} id={`${data.slug}-walkthrough`} aria-labelledby={`${data.slug}-walkthrough-title`} data-walkthrough={data.slug} data-step={step} data-running={running} data-scenario={scenarioIndex}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>INTERACTIVE WALKTHROUGH / {data.title.toUpperCase()}</p>
        <h2 id={`${data.slug}-walkthrough-title`}>{data.heading}</h2>
        <p>{data.summary}</p>
      </div>
      <div className={styles.console}>
        <div className={styles.toolbar}>
          <span className={styles.consoleTitle}><Workflow size={15} aria-hidden="true" /> EXECUTION TRACE <small>DEMO</small></span>
          <div className={styles.controls}>
            <button type="button" onClick={() => advance(-1)} disabled={step === 0} aria-label="Previous walkthrough step"><ArrowLeft size={14} /></button>
            <button type="button" className={styles.play} onClick={() => {
              if (finished) restart()
              else if (reducedMotion) advance(1)
              else { setInspected(null); setPlaying((value) => !value) }
            }}>
              {finished ? <RotateCcw size={13} /> : playing && !reducedMotion ? <Pause size={13} /> : <Play size={13} />}
              {finished ? "Replay" : reducedMotion ? "Next step" : playing ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={() => advance(1)} disabled={finished} aria-label="Next walkthrough step"><ArrowRight size={14} /></button>
          </div>
        </div>
        <fieldset className={styles.scenarios}>
          <legend>EXAMPLE SCENARIO</legend>
          {data.scenarios.map((item, index) => <button type="button" key={item.label} aria-pressed={index === scenarioIndex} onClick={() => restart(index)}>{item.label}</button>)}
        </fieldset>

        <div ref={graphRef} className={styles.graph} tabIndex={-1} aria-label={`${data.title} processing stages`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.connections} aria-hidden="true">
            {data.edges.map(([from, to]) => {
              const a = data.nodes[from], b = data.nodes[to]
              const path = `M${a.x} ${a.y}L${b.x} ${b.y}`
              const previous = scenario.frames[step - 1]?.node
              const active = previous === from && frame.node === to
              const complete = scenario.frames.slice(1, step + 1).some((item, i) => scenario.frames[i].node === from && item.node === to)
              return <g key={`${from}-${to}`}><path d={path} className={styles.edge} data-complete={complete} />{active && <path d={path} pathLength="100" className={styles.packet} style={{ animationPlayState: running ? "running" : "paused" }} />}</g>
            })}
          </svg>
          {data.nodes.map((node, index) => {
            const state = index === frame.node ? frame.tone ?? "active" : visited.has(index) ? "complete" : "pending"
            return <button key={node.label} type="button" className={styles.node} style={{ "--node-x": `${node.x}%`, "--node-y": `${node.y}%` } as CSSProperties} data-state={state} aria-current={index === frame.node ? "step" : undefined} aria-pressed={viewed === index} aria-label={`Inspect ${node.label.toLowerCase()} stage`} aria-controls={detailsId} onClick={() => inspect(index)}>
              <span className={styles.nodeMeta}><span>{String(index + 1).padStart(2, "0")}</span>{state === "error" || state === "warning" ? <TriangleAlert size={12} /> : state === "complete" ? <Check size={12} /> : <span className={styles.light} />}</span>
              <strong>{node.label}</strong><small>{node.caption}</small>
            </button>
          })}
        </div>

        <div className={styles.lower}>
          <div ref={detailsRef} id={detailsId} className={styles.details}>
            <div className={styles.detailHeading}><span>STAGE {String(viewed + 1).padStart(2, "0")} / INSPECTOR</span><a href={`${data.repository}/blob/main/${stage.source}`} target="_blank" rel="noopener noreferrer">Source <ExternalLink size={12} /></a></div>
            <h3>{stage.label}</h3><p>{stage.description}</p>
            <dl className={styles.io}><div><dt>INPUT</dt><dd>{stage.input}</dd></div><div><dt>OUTPUT</dt><dd>{stage.output}</dd></div></dl>
            <div className={styles.preview} aria-label="Illustrative stage preview">{preview.map((line, index) => <div key={`${viewed}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><code>{line}</code></div>)}</div>
            <button type="button" className={styles.backToGraph} onClick={() => graphRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })}>Back to stages ↑</button>
          </div>
          <div className={styles.trace}>
            <div className={styles.traceHeading}><span className={styles.light} data-running={running} />{finished ? "TRACE COMPLETE" : running ? "TRACE RUNNING" : "TRACE PAUSED"}<span>{step + 1}/{scenario.frames.length}</span></div>
            <ol>{scenario.frames.slice(Math.max(0, step - 4), step + 1).map((item, index) => <li key={`${scenarioIndex}-${step - 4 + index}`} data-tone={item.tone} data-latest={index === Math.min(4, step)}><span>{data.nodes[item.node].label}</span>{item.log}</li>)}</ol>
            <div className={styles.outcome} aria-live="polite" aria-atomic="true">{finished ? <><strong><Check size={14} />{scenario.outcome}</strong><p>{scenario.result}</p></> : <p>Follow the trace or select a stage to inspect its input, output, and implementation.</p>}</div>
          </div>
        </div>
        <div className={styles.footnote}><span>{data.boundary}</span><a href={data.repository} target="_blank" rel="noopener noreferrer">View repository <ExternalLink size={12} /></a></div>
      </div>
    </section>
  )
}
