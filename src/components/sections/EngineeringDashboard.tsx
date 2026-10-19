"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink, GitBranch, RefreshCw } from "lucide-react"
import { GITHUB_PROFILE_URL, GITHUB_REFRESH_MS, GITHUB_USERNAME, recentContributionWeeks, type GitHubActivity } from "@/lib/githubActivity"
import styles from "./EngineeringDashboard.module.css"

const commitDate = (date: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(date))
const calendarDate = (date: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))

async function readActivity(signal: AbortSignal): Promise<GitHubActivity> {
  const response = await fetch("/api/github", { signal })
  if (!response.ok) throw new Error("GitHub unavailable")
  const result: GitHubActivity = await response.json()
  if (result.username !== GITHUB_USERNAME || !Array.isArray(result.errors)) throw new Error("Unexpected activity response")
  return result
}

function Metric({ label, value, detail, suffix = "" }: { label: string; value: number | null; detail: string; suffix?: string }) {
  return <div className={styles.metric}><span>{label}</span><strong key={value === null ? "unknown" : value}>{value === null ? "—" : `${value.toLocaleString("en-IN")}${suffix}`}</strong><small>{detail}</small></div>
}

export function EngineeringDashboard() {
  const [activity, setActivity] = useState<GitHubActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const requestRef = useRef<AbortController | null>(null)
  const lastCheckRef = useRef(0)

  const load = useCallback(() => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    void readActivity(controller.signal).then((result) => {
      if (controller.signal.aborted) return
      setActivity(result)
      setFailed(false)
      lastCheckRef.current = Date.now()
    }).catch(() => {
      if (!controller.signal.aborted) setFailed(true)
    }).finally(() => {
      if (requestRef.current === controller) {
        requestRef.current = null
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    void load()
    const refresh = () => {
      if (!document.hidden && Date.now() - lastCheckRef.current >= GITHUB_REFRESH_MS) { setLoading(true); void load() }
    }
    const timer = window.setInterval(refresh, GITHUB_REFRESH_MS)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", refresh)
      const pendingRequest = requestRef.current
      requestRef.current = null
      pendingRequest?.abort()
    }
  }, [load])

  const calendar = activity?.calendar
  const cells = calendar ? recentContributionWeeks(calendar) : []
  const visibleTotal = cells.reduce((sum, day) => sum + (day.count ?? 0), 0)
  const commits = activity?.commits
  const notices = failed ? [activity ? "GitHub could not be refreshed. Showing the last successful response." : "GitHub is temporarily unavailable. Try again or open the profile directly."] : activity?.errors ?? []

  return (
    <section id="proof" className={`w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50 scroll-mt-24 ${styles.section}`} aria-labelledby="proof-title" data-github-status={loading ? "loading" : failed ? "unavailable" : activity?.errors.length ? "partial" : "connected"}>
      <div className={styles.header}>
        <div>
          <p className="font-mono text-xs font-bold text-accent tracking-widest uppercase mb-3">ENGINEERING SNAPSHOT</p>
          <h2 id="proof-title" className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">Proof of Active Competence</h2>
          <p className={styles.description}>Actual public GitHub activity: recent commits, profile statistics, and the contribution calendar visible on my profile.</p>
        </div>
        <a className={styles.profile} href={activity?.profile?.url ?? GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer"><GitBranch size={15} aria-hidden="true" />@{activity?.profile?.login ?? GITHUB_USERNAME}<ExternalLink size={12} aria-hidden="true" /></a>
      </div>

      {notices.length > 0 && <div className={styles.notice} role="status">{notices.join(" ")}</div>}
      <div className={styles.layout} aria-busy={loading}>
        <div className={`${styles.card} ${styles.feed}`}>
          <div className={styles.cardHeading}><h3>Recent public commits</h3><span className={styles.badge}>GITHUB</span></div>
          {commits ? commits.length ? <ol className={styles.commits}>
            {commits.map((commit) => <li key={`${commit.repo}:${commit.sha}`}><a href={commit.url} target="_blank" rel="noopener noreferrer" className={styles.commit}>
              <div className={styles.commitMeta}><strong>{commit.repo}</strong><time dateTime={commit.committedAt}>{commitDate(commit.committedAt)}</time></div>
              <p>{commit.message}</p><span className={styles.sha}>{commit.sha.slice(0, 7)}<ExternalLink size={10} aria-hidden="true" /></span>
            </a></li>)}
          </ol> : <p className={styles.empty}>No public commits were returned by GitHub.</p> : loading ? <div aria-label="Loading recent commits">{Array.from({ length: 5 }, (_, index) => <div key={index} className={styles.skeleton} />)}</div> : <p className={styles.empty}>Recent commits are unavailable. You can still view the profile on GitHub.</p>}
          <p className={styles.feedNote}>Commit messages and dates come from GitHub search. Public repositories only; newly pushed commits may take time to appear in its search index.</p>
        </div>

        <div className={styles.right}>
          <div className={`${styles.card} ${styles.metrics}`}>
            <Metric label="Public repositories" value={activity?.profile?.publicRepos ?? null} detail="From the GitHub profile" />
            <Metric label="Followers" value={activity?.profile?.followers ?? null} detail="Public GitHub followers" />
            <Metric label="Contributions" value={calendar?.total ?? null} detail="Past year · profile calendar" />
            <Metric label="Current streak" value={calendar?.currentStreak ?? null} suffix={calendar?.streakReachesStart ? "+" : ""} detail="Consecutive active days · UTC" />
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeading}><h3>Contribution activity</h3><span className={styles.badge}>15 WEEKS</span></div>
            {calendar ? <>
              <div className={styles.heatmap} role="img" aria-label={`${visibleTotal} contributions from ${cells[0].date} through ${calendar.to}, from the public GitHub profile calendar.`}>
                {cells.map((day) => <span key={day.date} className={styles.day} data-level={day.level ?? undefined} data-future={day.count === null} title={day.count === null ? undefined : `${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`} />)}
              </div>
              <div className={styles.calendarFooter}><span>{calendarDate(cells[0].date)} – {calendarDate(calendar.to)} · UTC</span><div className={styles.legend} aria-hidden="true"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <span className={styles.day} key={level} data-level={level} />)}<span>More</span></div></div>
              <p className={`${styles.feedNote} mt-4`}>Matches activity visible on the public profile, including any anonymized private contributions enabled there. Contribution totals include more than commits.</p>
            </> : <p className={styles.empty}>{loading ? "Loading the contribution calendar…" : "The contribution calendar is unavailable. No activity has been estimated."}</p>}
          </div>
        </div>
      </div>
      <div className={styles.status}>
        <span role="status" aria-live="polite">{loading ? "Checking GitHub…" : activity ? `Last checked ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(activity.checkedAt))} IST · cached for up to 15 minutes` : "No GitHub data loaded"}</span>
        <button className={styles.refresh} type="button" disabled={loading} onClick={() => { setLoading(true); void load() }}><RefreshCw size={12} aria-hidden="true" />{loading ? "Checking…" : failed ? "Try again" : "Refresh"}</button>
      </div>
    </section>
  )
}
