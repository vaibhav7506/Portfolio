"use client"

import { useState, useEffect, useRef, type MouseEvent } from "react"
import { useAnimatedNavigation } from "@/hooks/useAnimatedNavigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { CommandPaletteTrigger } from "@/components/ui/CommandPalette"
import { HireMeButton } from "@/components/ui/HireMeButton"
import { resumeLinks } from "@/lib/resumeLinks"
import styles from "./Navbar.module.css"

const links = [
  { label: 'Work', href: '/#work' },
  { label: 'Résumé', href: resumeLinks.sde.url, external: true },
  { label: 'About', href: '/#about' },
  { label: 'Now', href: '/now' },
  { label: 'GitHub', href: 'https://github.com/vaibhav7506', external: true },
  { label: 'Contact', href: '/#contact' },
  { label: 'Hire Me →', href: 'mailto:vs7977722@gmail.com?subject=Opportunity%20via%20Portfolio', accent: true },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const resumeNavigation = useAnimatedNavigation(550)

  const activateResume = (event: MouseEvent<HTMLAnchorElement>) => {
    const link = event.currentTarget
    resumeNavigation.activate(event, () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      link.animate([
        { boxShadow: "inset 0 -2px 0 transparent", color: "#94a3b8" },
        { boxShadow: "inset 0 -2px 0 #7dd3fc", color: "#e0f2fe", offset: 0.45 },
        { boxShadow: "inset 0 -2px 0 transparent", color: "#4da3ff" },
      ], { duration: 550, easing: "ease-out" })
    }, () => setMobileOpen(false))
  }

  const showHover = (link: HTMLAnchorElement) => {
    const indicator = indicatorRef.current
    const group = linksRef.current
    if (!indicator || !group) return
    const left = link.offsetLeft
    const right = group.clientWidth - left - link.offsetWidth
    const previousLeft = Number.parseFloat(indicator.style.left) || 0
    // The leading edge moves first; the trailing edge catches up.
    indicator.dataset.direction = left >= previousLeft ? "right" : "left"
    if (indicator.dataset.visible !== "true") {
      indicator.style.transition = "none"
      indicator.style.left = `${left}px`
      indicator.style.right = `${right}px`
      // Commit the initial position before fading in, avoiding a sweep from zero.
      indicator.getBoundingClientRect()
      indicator.style.removeProperty("transition")
    }
    indicator.style.left = `${left}px`
    indicator.style.right = `${right}px`
    indicator.dataset.visible = "true"
  }

  const hideHover = () => {
    if (indicatorRef.current) indicatorRef.current.dataset.visible = "false"
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", hideHover)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", hideHover)
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !mobileRef.current?.contains(event.target)) setMobileOpen(false)
    }
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    window.addEventListener("resize", closeOnDesktop)
    return () => {
      document.removeEventListener("pointerdown", closeOutside)
      window.removeEventListener("resize", closeOnDesktop)
    }
  }, [mobileOpen])

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-4 sm:px-6 border-b border-border transition-all duration-250 ease-out backdrop-blur-md ${
        scrolled ? "bg-[#0A0D12]/95" : "bg-[#0A0D12]/82"
      }`}
    >
      <div className="flex items-center">
        <Link href="/" className="font-mono text-sm tracking-wider font-bold text-text hover:text-accent transition-colors duration-150">
          VAIBHAV SHARMA
        </Link>
      </div>

      {/* Desktop Links */}
      <div ref={linksRef} className={`hidden lg:flex items-center gap-5 ${styles.links}`}
        onPointerOver={(event) => {
          const control = (event.target as HTMLElement).closest("a, button")
          if (control && !control.hasAttribute("data-nav-hover")) hideHover()
        }}
        onPointerLeave={() => {
          const focused = document.activeElement
          if (focused instanceof HTMLAnchorElement && linksRef.current?.contains(focused) && focused.hasAttribute("data-nav-hover")) showHover(focused)
          else hideHover()
        }}
        onBlur={(event) => {
          if (!(event.relatedTarget instanceof HTMLElement) || !event.relatedTarget.hasAttribute("data-nav-hover")) hideHover()
        }}>
        <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
         <CommandPaletteTrigger />
        {links.map((link) => {
          if (link.accent) {
            return (
              <HireMeButton key={link.label} href={link.href} />
            )
          }
          if (link.external) {
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label === "Résumé" ? "View SDE résumé in Google Drive (opens in a new tab)" : undefined}
                data-resume-nav={link.label === "Résumé" ? "desktop" : undefined}
                aria-busy={link.label === "Résumé" ? resumeNavigation.opening : undefined}
                onClick={link.label === "Résumé" ? activateResume : undefined}
                data-nav-hover
                onPointerEnter={(event) => { if (event.pointerType !== "touch") showHover(event.currentTarget) }}
                onFocus={(event) => showHover(event.currentTarget)}
                className={`text-xs font-mono text-text-2 hover:text-accent transition-colors duration-150 ${styles.link}`}
              >
                {link.label}
              </a>
            )
          }
          return (
            <Link
              key={link.label}
              href={link.href}
              data-nav-hover
              onPointerEnter={(event) => { if (event.pointerType !== "touch") showHover(event.currentTarget) }}
              onFocus={(event) => showHover(event.currentTarget)}
              className={`text-xs font-mono text-text-2 hover:text-accent transition-colors duration-150 ${styles.link}`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* A disclosure menu keeps essential destinations usable on small screens. */}
      <div ref={mobileRef} className="lg:hidden"
        onKeyDown={(event) => {
          if (event.key === "Escape" && mobileOpen) {
            event.preventDefault()
            setMobileOpen(false)
            menuButtonRef.current?.focus()
          }
        }}
        onBlur={(event) => {
          if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false)
        }}>
        <button ref={menuButtonRef} type="button" className={styles.menuToggle}
          aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((open) => !open)}>
          <span>Menu</span>{mobileOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
        </button>
        {mobileOpen && (
          <div id="mobile-navigation" className={styles.mobileMenu}>
            <div className={styles.mobilePrimary}>
              {links.filter((link) => ["Work", "Résumé", "Contact"].includes(link.label)).map((link) => (
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" title="View SDE résumé in Google Drive (opens in a new tab)" className={styles.mobileLink} data-resume-nav="mobile" aria-busy={resumeNavigation.opening} onClick={activateResume}>
                    <span>{link.label}</span><span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                    <span>{link.label}</span><span aria-hidden="true">↓</span>
                  </Link>
                )
              ))}
            </div>
            <div className={styles.mobileSecondary}>
              <Link href="/#about" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/now" onClick={() => setMobileOpen(false)}>Now</Link>
              <a href="https://github.com/vaibhav7506" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>GitHub ↗</a>
              <span onClick={() => setMobileOpen(false)}><HireMeButton href="https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C" target="_blank" /></span>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
