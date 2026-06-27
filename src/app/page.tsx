"use client"

import { useState, useEffect } from "react"
import { BootSequence } from "@/components/hero/BootSequence"
import { HeroSection } from "@/components/hero/HeroSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { PositioningSection } from "@/components/sections/PositioningSection"
import { SystemBlueprint } from "@/components/sections/SystemBlueprint"
import { EngineeringDashboard } from "@/components/sections/EngineeringDashboard"
import { LoopOSSection } from "@/components/sections/LoopOSSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { UnifiedArchitectureSection } from "@/components/sections/UnifiedArchitectureSection"
// NEW IMPORTS — add these 3 files to src/components/ui/
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { EasterEggTerminal } from "@/components/ui/EasterEggTerminal"
import { DebugOverlay } from "@/components/ui/DebugOverlay"
import { RecruiterNudge } from "@/components/ui/RecruiterNudge"
export default function Home() {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("loopos_booted")
    if (hasBooted) setIsBooting(false)
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem("loopos_booted", "true")
    setIsBooting(false)
  }

  if (isBooting) return <BootSequence onComplete={handleBootComplete} />

  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <PositioningSection />
      <ProjectsSection />
      <UnifiedArchitectureSection />
      <SystemBlueprint />
      <EngineeringDashboard />
      <LoopOSSection />
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