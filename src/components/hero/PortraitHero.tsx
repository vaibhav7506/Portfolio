"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react"
import { resumeLinks } from "@/lib/resumeLinks"
import type { ParticleScene } from "./particles/particle-scene"
import styles from "./PortraitHero.module.css"

export function PortraitHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<ParticleScene | null>(null)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [form, setForm] = useState({ name: "Portrait", index: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const controller = new AbortController()
    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sceneRef.current?.setVisible(visible)
    }, { threshold: 0.05 })
    observer.observe(canvas)
    const fail = () => {
      if (controller.signal.aborted) return
      setReady(false)
    }
    void import("./particles/particle-scene").then(async ({ createParticleScene }) => {
      if (controller.signal.aborted) return
      const scene = await createParticleScene(canvas, {
        signal: controller.signal,
        onReady: () => { if (!controller.signal.aborted) setReady(true) },
        onError: fail,
        onFormChange: (name, index) => setForm({ name, index }),
      })
      if (controller.signal.aborted) { scene.destroy(); return }
      sceneRef.current = scene
      scene.setVisible(visible)
    }).catch(fail)
    return () => {
      controller.abort()
      observer.disconnect()
      sceneRef.current?.destroy()
      sceneRef.current = null
    }
  }, [])

  return (
    <section className={styles.hero} aria-labelledby="portrait-introduction">
      <div className={styles.copy}>
        <p className={styles.availability}><span aria-hidden="true" /> Available for opportunities</p>
        <p className={styles.eyebrow}>FULL-STACK ENGINEER · AI AGENT SYSTEMS</p>
        <h1 id="portrait-introduction" className={styles.name}>Vaibhav<br /><span>Sharma.</span></h1>
        <p className={styles.lead}>I build AI systems <br />with recovery built in.</p>
        <p className={styles.description}>From governed incident response to observable agent workflows — I turn complex ideas into full-stack applications you can inspect, test, and use.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#work">
            <span className={styles.projectLabel}><span>View projects</span><span aria-hidden="true">View projects</span></span>
            <span className={styles.projectArrow} aria-hidden="true"><ArrowDown size={16} /><ArrowDown size={16} /></span>
          </a>
          <a className={styles.secondary} href={resumeLinks.sde.url} target="_blank" rel="noopener noreferrer">
            <span className={styles.resumeLabel}>Résumé</span><ArrowUpRight className={styles.resumeArrow} size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className={styles.selectedWork}>
          <span>SELECTED WORK</span>
          <div>
            <a href="/work/runbookos">RunbookOS <ArrowUpRight size={11} aria-hidden="true" /></a>
            <a href="/work/codeshift-ai">CodeShift AI <ArrowUpRight size={11} aria-hidden="true" /></a>
            <a href="/work/loopos">LoopOS <ArrowUpRight size={11} aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className={styles.portrait}>
        <div className={styles.sceneHeader}>
          <span><i aria-hidden="true" /> A LITTLE OF ME, IN MOTION</span>
          {ready && <button type="button" className={styles.pause} aria-label={paused ? "Resume animation" : "Pause animation"} aria-pressed={paused} onClick={() => {
            sceneRef.current?.setPaused(!paused)
            setPaused(!paused)
          }}>{paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}</button>}
        </div>
        <div className={styles.viewport}>
          <div className={styles.halo} aria-hidden="true" />
          <Image src="/portrait/fallback.png" alt="Vaibhav Sharma" aria-hidden={ready} fill sizes="(max-width: 760px) 100vw, 55vw" preload className={styles.fallback} style={{ opacity: ready ? 0 : 1 }} />
          <canvas ref={canvasRef} className={styles.canvas} style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }} tabIndex={ready ? 0 : -1} aria-hidden={!ready} aria-label="Interactive particle portrait of Vaibhav Sharma. Click or press Space for a gentle scatter. Scroll, swipe vertically, or use arrow keys to change form. Escape restores the portrait." />
          <div className={styles.platform} aria-hidden="true"><span /><span /><span /></div>
          <span className={styles.sceneIndex} aria-hidden="true">VS / 001</span>
        </div>
        <div className={styles.sceneFooter}>
          {ready && <span className={styles.formCaption} role="status" aria-live="polite" aria-atomic="true">{String(form.index + 1).padStart(2, "0")} / 08 · {form.name}</span>}
        </div>
      </div>
    </section>
  )
}
