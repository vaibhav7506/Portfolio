import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-bg text-text">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-xs font-bold text-error tracking-widest uppercase">
          ERROR 404
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text font-mono">
          NODE NOT FOUND
        </h1>
        <p className="text-sm text-text-2 leading-relaxed font-sans">
          The node you&apos;re looking for doesn&apos;t exist in this network. It may have been decommissioned or moved to a different cluster.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 font-mono text-xs font-bold tracking-wider rounded-md border border-border bg-surface hover:bg-hover hover:text-accent transition-all duration-150"
          >
            ← RETURN TO MISSION CONTROL
          </Link>
        </div>
      </div>
    </div>
  )
}
