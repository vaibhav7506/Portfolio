import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { TechStackSection } from "@/components/sections/TechStackSection"
import { PositioningSection } from "@/components/sections/PositioningSection"
import { EngineeringDashboard } from "@/components/sections/EngineeringDashboard"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { EasterEggTerminal } from "@/components/ui/EasterEggTerminal"
import { DebugOverlay } from "@/components/ui/DebugOverlay"
import { RecruiterNudge } from "@/components/ui/RecruiterNudge"

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <PositioningSection />
      <ProjectsSection />
      <TechStackSection />
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
