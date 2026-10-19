"use client"

import { useSyncExternalStore } from "react"

export const resumes = {
  swe: { label: "SWE", path: "/Vaibhav_resume.pdf", filename: "Vaibhav_resume.pdf" },
  aiml: { label: "AI/ML", path: "/Vaibhav_AIML_resume.pdf", filename: "Vaibhav_AIML_resume.pdf" },
} as const
export type ResumeId = keyof typeof resumes
type DownloadState = {
  phase: "idle" | "transferring" | "complete" | "error" | "cancelled"
  progress: number | null
  origin: "contact" | "palette"
  dismissed: boolean
}
const initial: DownloadState = { phase: "idle", progress: null, origin: "contact", dismissed: false }
const states: Record<ResumeId, DownloadState> = { swe: initial, aiml: initial }
const listeners = new Set<() => void>()
const transfers = new Map<ResumeId, AbortController>()
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
const update = (id: ResumeId, next: Partial<DownloadState>) => {
  states[id] = { ...states[id], ...next }
  listeners.forEach((listener) => listener())
}

export function useResumeDownload(id: ResumeId) {
  return useSyncExternalStore(subscribe, () => states[id], () => initial)
}
export function cancelResumeDownload(id: ResumeId) { transfers.get(id)?.abort() }
export function dismissResumeDownload(id: ResumeId) { update(id, { dismissed: true }) }

// Root-level UI owns this transfer, so navigating away from Contact does not cancel it.
export async function startResumeDownload(id: ResumeId, origin: DownloadState["origin"] = "contact") {
  if (transfers.has(id)) return
  const controller = new AbortController()
  transfers.set(id, controller)
  update(id, { phase: "transferring", progress: null, origin, dismissed: false })
  try {
    const response = await fetch(resumes[id].path, { signal: controller.signal, cache: "no-store" })
    if (!response.ok) throw new Error("PDF request failed")
    const contentLength = Number(response.headers.get("content-length"))
    const total = Number.isFinite(contentLength) && contentLength > 0 && !response.headers.get("content-encoding") ? contentLength : null
    let blob: Blob
    if (response.body) {
      const reader = response.body.getReader()
      const chunks: ArrayBuffer[] = []
      let received = 0
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          chunks.push(value.slice().buffer)
          received += value.byteLength
          if (total) update(id, { progress: Math.min(99, Math.floor(received / total * 100)) })
        }
      } finally { reader.releaseLock() }
      blob = new Blob(chunks, { type: "application/pdf" })
    } else {
      blob = await response.blob()
    }
    if (controller.signal.aborted) throw new DOMException("Cancelled", "AbortError")
    if (blob.size === 0 || !(await blob.slice(0, 1024).text()).includes("%PDF-")) throw new Error("Invalid PDF response")
    if (controller.signal.aborted) throw new DOMException("Cancelled", "AbortError")
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = resumes[id].filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Give the browser time to consume the object URL before releasing it.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
    update(id, { phase: "complete", progress: 100 })
  } catch {
    update(id, { phase: controller.signal.aborted ? "cancelled" : "error", progress: null })
  } finally {
    transfers.delete(id)
  }
}
