"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CommandPalette } from "@/components/ui/CommandPalette"

const links = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Now', href: '/now' },
  { label: 'GitHub', href: 'https://github.com/vaibhav7506', external: true },
  { label: 'Hire Me →', href: 'mailto:vs7977722@gmail.com?subject=Opportunity%20via%20Portfolio', accent: true },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-6 border-b border-border transition-all duration-250 ease-out backdrop-blur-md ${
        scrolled ? "bg-[#0A0D12]/95" : "bg-[#0A0D12]/82"
      }`}
    >
      <div className="flex items-center">
        <Link href="/" className="font-mono text-sm tracking-wider font-bold text-text hover:text-accent transition-colors duration-150">
          VAIBHAV SHARMA
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
         <CommandPalette /> 
        {links.map((link) => {
          if (link.accent) {
            return (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1 text-xs font-mono font-semibold rounded-md border border-accent bg-accent-dim hover:bg-accent hover:text-bg transition-all duration-150"
              >
                {link.label}
              </a>
            )
          }
          if (link.external) {
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-text-2 hover:text-accent transition-colors duration-150"
              >
                {link.label}
              </a>
            )
          }
          return (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-mono text-text-2 hover:text-accent transition-colors duration-150"
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Mobile view showing only Hire Me */}
      <div className="flex md:hidden">
        
        <a href="https://mail.google.com/mail/?view=cm&to=vs7977722@gmail.com&subject=Opportunity%20via%20Portfolio&body=Hi%20Vaibhav%2C"
         target="_blank"
          className="px-3 py-1 text-xs font-mono font-semibold rounded-md border border-accent bg-accent-dim hover:bg-accent hover:text-bg transition-all duration-150"
        >
          Hire Me →
        </a>
      </div>
    </nav>
  )
}
