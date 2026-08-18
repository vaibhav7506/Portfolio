"use client"

import { useSyncExternalStore } from "react"
import { BootSequence } from "@/components/hero/BootSequence"
import { HeroSection } from "@/components/hero/HeroSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { TechStackSection } from "@/components/sections/TechStackSection"
import { PositioningSection } from "@/components/sections/PositioningSection"
import { SystemBlueprint } from "@/components/sections/SystemBlueprint"
import { EngineeringDashboard } from "@/components/sections/EngineeringDashboard"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { UnifiedArchitectureSection } from "@/components/sections/UnifiedArchitectureSection"
// NEW IMPORTS — add these 3 files to src/components/ui/
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { EasterEggTerminal } from "@/components/ui/EasterEggTerminal"
import { DebugOverlay } from "@/components/ui/DebugOverlay"
import { RecruiterNudge } from "@/components/ui/RecruiterNudge"

// Reads "has the boot sequence already played this session" straight from
// sessionStorage via useSyncExternalStore — the React-idiomatic way to read
// a browser-only store safely: getServerSnapshot keeps SSR markup showing
// the boot sequence (sessionStorage doesn't exist on the server), and the
// client re-syncs to the real value right after hydration. No effect, no
// setState-in-effect, and no extra render-then-flip flash.
let bootListeners: Array<() => void> = []
function notifyBootListeners() {
  bootListeners.forEach((listener) => listener())
}
function subscribeBoot(callback: () => void) {
  bootListeners.push(callback)
  return () => {
    bootListeners = bootListeners.filter((listener) => listener !== callback)
  }
}
function getBootSnapshot() {
  return sessionStorage.getItem("loopos_booted") === "true"
}
function getBootServerSnapshot() {
  return false
}

export default function Home() {
  const hasBooted = useSyncExternalStore(subscribeBoot, getBootSnapshot, getBootServerSnapshot)

  const handleBootComplete = () => {
    sessionStorage.setItem("loopos_booted", "true")
    notifyBootListeners()
  }

  if (!hasBooted) return <BootSequence onComplete={handleBootComplete} />

  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <PositioningSection />
      <ProjectsSection />
      <TechStackSection />
      <UnifiedArchitectureSection />
      <SystemBlueprint />
      <EngineeringDashboard />
      <AboutSection />
      <ContactSection />
      <RecruiterNudge />
      {/* Global UI overlays */}
      <ScrollProgress />
      <EasterEggTerminal />
      <DebugOverlay />
    </div>
  )
}