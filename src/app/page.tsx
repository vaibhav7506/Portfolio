import { PortraitHero } from "@/components/hero/PortraitHero"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { TechStackSection } from "@/components/sections/TechStackSection"
import { PositioningSection } from "@/components/sections/PositioningSection"
import { EngineeringDashboard } from "@/components/sections/EngineeringDashboard"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { EasterEggTerminal } from "@/components/ui/EasterEggTerminal"
import { RecruiterNudge } from "@/components/ui/RecruiterNudge"

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <PortraitHero />
      <PositioningSection headingLevel="h2" />
      <ProjectsSection />
      <TechStackSection />
      <EngineeringDashboard />
      <AboutSection />
      <ContactSection />
      <RecruiterNudge />
      <EasterEggTerminal />
    </div>
  )
}
