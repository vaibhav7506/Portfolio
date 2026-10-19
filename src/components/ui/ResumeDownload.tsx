"use client"

import type { CSSProperties } from "react"
import { ArrowDown, Check, FileText, RotateCcw, X } from "lucide-react"
import { cancelResumeDownload, dismissResumeDownload, resumes, startResumeDownload, useResumeDownload, type ResumeId } from "@/lib/resumeDownloads"
import styles from "./ResumeDownload.module.css"

function DownloadIcon({ phase }: { phase: string }) {
  return <span className={styles.icon} aria-hidden="true"><FileText className={styles.file} size={15} /><span className={styles.arrow}>{phase === "complete" ? <Check size={17} /> : phase === "error" || phase === "cancelled" ? <RotateCcw size={15} /> : <ArrowDown size={17} />}</span><span className={styles.tray} /></span>
}

export function ResumeDownloadButton({ id }: { id: ResumeId }) {
  const state = useResumeDownload(id)
  const busy = state.phase === "transferring"
  const retry = state.phase === "error" || state.phase === "cancelled"
  const status = busy ? `Downloading${state.progress === null ? "…" : ` ${state.progress}%`}` : state.phase === "complete" ? "Download started" : state.phase === "error" ? "Couldn't download. Retry or use Direct PDF." : state.phase === "cancelled" ? "Cancelled. Ready to retry." : "PDF résumé"
  return <div className={styles.wrapper} data-phase={state.phase}>
    <a href={resumes[id].path} download={resumes[id].filename} className={styles.button} aria-disabled={busy} aria-describedby={`${id}-download-status`} onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
      event.preventDefault()
      if (!busy) void startResumeDownload(id)
    }} style={{ "--download-progress": `${state.progress ?? 0}%` } as CSSProperties}>
      <span className={styles.fill} data-indeterminate={busy && state.progress === null} />
      <span className={styles.label}>{retry ? "RETRY" : "RESUME"} ({resumes[id].label})</span><DownloadIcon phase={state.phase} />
      <span className={styles.spark} />
    </a>
    <div className={styles.caption}>
      <span id={`${id}-download-status`} role="status" aria-live="polite" aria-atomic="true">{status}</span>
      {busy && <button type="button" onClick={() => cancelResumeDownload(id)} aria-label={`Cancel ${resumes[id].label} résumé download`}>Cancel</button>}
      {retry && <a href={resumes[id].path} download={resumes[id].filename}>Direct PDF ↗</a>}
    </div>
  </div>
}

function ResumeDownloadNotice({ id }: { id: ResumeId }) {
  const state = useResumeDownload(id)
  if (state.phase === "idle" || state.origin !== "palette" || state.dismissed) return null
  const busy = state.phase === "transferring"
  return <div className={styles.notice} data-phase={state.phase}>
    <DownloadIcon phase={state.phase} />
    <div role="status" aria-live="polite"><strong>Résumé ({resumes[id].label})</strong><p>{busy ? `Downloading${state.progress === null ? "…" : ` ${state.progress}%`}` : state.phase === "complete" ? "Download started" : state.phase === "cancelled" ? "Download cancelled" : "Couldn't download PDF"}</p></div>
    {busy ? <button type="button" onClick={() => cancelResumeDownload(id)} aria-label={`Cancel ${resumes[id].label} résumé download`}><X size={15} /></button> : <>
      {state.phase !== "complete" && <a href={resumes[id].path} download={resumes[id].filename}>Direct PDF</a>}
      <button type="button" onClick={() => dismissResumeDownload(id)} aria-label={`Dismiss ${resumes[id].label} download status`}><X size={15} /></button>
    </>}
  </div>
}

export function ResumeDownloadNotifications() {
  return <div className={styles.notifications}><ResumeDownloadNotice id="swe" /><ResumeDownloadNotice id="aiml" /></div>
}
