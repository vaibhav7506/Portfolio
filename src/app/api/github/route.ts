import { GITHUB_REFRESH_MS, GITHUB_USERNAME, parseGitHubCalendar, parseGitHubCommits, parseGitHubProfile, type GitHubActivity } from "@/lib/githubActivity"

let cached: { value: GitHubActivity; expires: number } | null = null
let pending: Promise<GitHubActivity> | null = null

async function request(url: string, html = false): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Vaibhav-Portfolio", Accept: html ? "text/html" : "application/vnd.github+json" },
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: GITHUB_REFRESH_MS / 1000 },
  })
  if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`)
  return html ? response.text() : response.json()
}

async function loadActivity(): Promise<GitHubActivity> {
  const [profile, commits, calendar] = await Promise.allSettled([
    request(`https://api.github.com/users/${GITHUB_USERNAME}`).then(parseGitHubProfile),
    request(`https://api.github.com/search/commits?q=author%3A${GITHUB_USERNAME}&sort=committer-date&order=desc&per_page=5`).then(parseGitHubCommits),
    request(`https://github.com/users/${GITHUB_USERNAME}/contributions`, true).then((html) => parseGitHubCalendar(String(html))),
  ])
  const errors: string[] = []
  if (profile.status === "rejected") errors.push("Profile statistics are temporarily unavailable.")
  if (commits.status === "rejected") errors.push("Recent public commits are temporarily unavailable.")
  if (calendar.status === "rejected") errors.push("The GitHub contribution calendar is temporarily unavailable.")
  return { username: GITHUB_USERNAME, profile: profile.status === "fulfilled" ? profile.value : null, commits: commits.status === "fulfilled" ? commits.value : null, calendar: calendar.status === "fulfilled" ? calendar.value : null, errors, checkedAt: new Date().toISOString() }
}

export async function GET() {
  if (!cached || cached.expires <= Date.now()) {
    if (!pending) pending = loadActivity()
    const current = pending
    try {
      const value = await current
      // Retry partial/unavailable responses sooner while coalescing concurrent requests.
      cached = { value, expires: Date.now() + (value.errors.length ? 60_000 : GITHUB_REFRESH_MS) }
    } finally { if (pending === current) pending = null }
  }
  const value = cached!.value
  const unavailable = !value.profile && !value.commits && !value.calendar
  return Response.json(value, {
    status: unavailable ? 503 : 200,
    headers: { "Cache-Control": value.errors.length ? "no-store" : "public, max-age=60, s-maxage=900, stale-while-revalidate=60" },
  })
}
