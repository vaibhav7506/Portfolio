import type { NextRequest } from "next/server"
import { getPortfolioAssistantPrompt } from "@/lib/portfolioKnowledge"

export async function POST(req: NextRequest) {
  try {
    const { messages, currentProjectSlug } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0 || messages.some((message) =>
      !message || (message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string"
    ) || messages.at(-1)?.role !== "user") {
      return new Response(JSON.stringify({ error: "Invalid messages" }), { status: 400 })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 700,
        temperature: 0.2,
        messages: [
          { role: "system", content: getPortfolioAssistantPrompt(currentProjectSlug, messages) },
          ...messages.slice(-6),
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Groq API error:", err)
      return new Response(JSON.stringify({ error: "API error" }), { status: 500 })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? "I couldn't generate a response."

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Chat route error:", err)
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}
