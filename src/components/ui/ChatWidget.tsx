"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_QUESTIONS = [
  "What's your experience with Cloudflare Workers?",
  "Tell me about LoopOS",
  "Are you available for full-time roles?",
  "What makes you different from other candidates?",
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Vaibhav's portfolio assistant. Ask me anything about his projects, stack, or availability.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hasDragged, setHasDragged] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = dragRef.current
    if (!el) return

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      setHasDragged(false)
      dragOffset.current = {
        x: e.clientX - el.getBoundingClientRect().left,
        y: e.clientY - el.getBoundingClientRect().top,
      }
      e.preventDefault()
    }

    const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.current) return
  setHasDragged(true)

  const buttonSize = 48 // w-12 = 48px
  const newX = Math.min(
    Math.max(0, e.clientX - dragOffset.current.x),
    window.innerWidth - buttonSize
  )
  const newY = Math.min(
    Math.max(0, e.clientY - dragOffset.current.y),
    window.innerHeight - buttonSize
  )

  setPos({ x: newX, y: newY })
}

    const onMouseUp = () => {
      isDragging.current = false
    }

    el.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      el.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [isOpen, messages])

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return
    setShowSuggestions(false)

    const userMessage: Message = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong." },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Try again or email vs7977722@gmail.com" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Draggable trigger button */}
      <div
        ref={dragRef}
        style={
          pos.x || pos.y
            ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 200 }
            : { position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 200 }
        }
        className="cursor-grab active:cursor-grabbing"
      >
        <button
          onClick={() => {
            if (!hasDragged) setIsOpen((v) => !v)
          }}
          aria-label={isOpen ? "Close chat" : "Ask Vaibhav anything"}
          className="w-12 h-12 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-150 font-mono text-sm font-bold"
        >
          {isOpen ? "✕" : "AI"}
        </button>
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-[199] w-[340px] max-h-[520px] flex flex-col border border-border bg-[#0F1318] rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-text font-bold text-[11px] uppercase tracking-wider">
                Ask Vaibhav Anything
              </span>
            </div>
            
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-[11px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-bg font-semibold"
                      : "bg-elevated border border-border/50 text-text-2"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggested questions */}
            {showSuggestions && messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-border/50 bg-surface text-text-3 hover:border-accent/40 hover:text-text-2 transition-all duration-150 text-[10px] leading-relaxed cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-elevated border border-border/50 px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-2.5 flex items-center gap-2 bg-surface">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about projects, stack, availability..."
              className="flex-grow bg-transparent text-text placeholder:text-text-3 text-[11px] outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => send(input)}
              disabled={isLoading || !input.trim()}
              className="text-accent hover:text-accent/80 disabled:text-text-3 transition-colors text-[11px] font-bold cursor-pointer disabled:cursor-not-allowed"
            >
              SEND
            </button>
          </div>
        </div>
      )}
    </>
  )
}