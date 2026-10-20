"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"

function followInDocument(context: Document, href: string) {
  const link = context.createElement("a")
  link.href = href
  link.target = "_self"
  link.rel = "noopener noreferrer"
  link.hidden = true
  context.body.append(link)
  link.click()
  link.remove()
}

function openDestination(href: string, target: string) {
  if (target === "_blank") {
    let tab: Window | null = null
    try {
      // Create the tab only after the animation, then detach it before loading.
      tab = window.open("", "_blank")
      if (tab) {
        tab.opener = null
        followInDocument(tab.document, href)
        return
      }
    } catch {
      tab?.close()
    }
  }
  // Keep the link usable when the browser blocks a delayed new tab.
  followInDocument(document, href)
}

export function useAnimatedNavigation(duration: number) {
  const [opening, setOpening] = useState(false)
  const pending = useRef<{ link: HTMLAnchorElement; href: string; target: string; onNavigate?: () => void } | null>(null)

  useEffect(() => {
    const destination = pending.current
    if (!opening || !destination) return
    let finished = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const complete = () => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      pending.current = null
      setOpening(false)
      if (!destination.link.isConnected) return
      destination.onNavigate?.()
      openDestination(destination.href, destination.target)
    }
    // React has committed the opening state before reading the CSS animations.
    const frame = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = setTimeout(complete, 120)
        return
      }
      const animations = destination.link.getAnimations({ subtree: true }).filter(animation => {
        const end = animation.effect?.getComputedTiming().endTime
        return typeof end === "number" && Number.isFinite(end) && end > 0 && animation.playState !== "finished"
      })
      // A bounded fallback also covers disabled or interrupted CSS animation.
      timer = setTimeout(complete, duration + 180)
      if (animations.length) void Promise.allSettled(animations.map(animation => animation.finished)).then(complete)
    })
    return () => {
      finished = true
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      pending.current = null
    }
  }, [opening, duration])

  const activate = (event: MouseEvent<HTMLAnchorElement>, animate: () => void, onNavigate?: () => void) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.hasAttribute("download")) return
    event.preventDefault()
    if (pending.current) return
    const link = event.currentTarget
    pending.current = { link, href: link.href, target: link.target, onNavigate }
    animate()
    setOpening(true)
  }

  return { opening, activate }
}
