"use client"

import { useSyncExternalStore } from "react"

const query = "(prefers-reduced-motion: reduce)"
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener("change", notify)
  return () => media.removeEventListener("change", notify)
}
const getSnapshot = () => window.matchMedia(query).matches
const getServerSnapshot = () => false

// Keep the first hydrated render identical to the server, then read the preference.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
