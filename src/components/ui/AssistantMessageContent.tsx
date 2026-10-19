import Link from "next/link"

// Render a small, text-only subset of Markdown without accepting model HTML.
export function AssistantMessageContent({ content }: { content: string }) {
  return content.split(/(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\((?:https?:\/\/|\/work\/)[^)\s]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]\n]+)\]\(((?:https?:\/\/|\/work\/)[^)\s]+)\)$/)
    if (link) {
      const [, label, href] = link
      const className = "text-accent underline underline-offset-2 hover:text-text focus-visible:outline focus-visible:outline-accent"
      return href.startsWith("/work/")
        ? <Link key={index} href={href} className={className}>{label}</Link>
        : <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>
    }
    return part.startsWith("**") && part.endsWith("**")
      ? <strong key={index} className="font-semibold text-text">{part.slice(2, -2)}</strong>
      : part
  })
}
