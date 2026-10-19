export const GITHUB_USERNAME = "vaibhav7506"
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
export const GITHUB_REFRESH_MS = 15 * 60 * 1000

export interface GitHubProfile {
  login: string
  name: string
  url: string
  publicRepos: number
  followers: number
}
export interface GitHubCommit {
  sha: string
  repo: string
  message: string
  committedAt: string
  url: string
}
export interface ContributionDay {
  date: string
  count: number
  level: number
}
export interface GitHubCalendar {
  days: ContributionDay[]
  total: number
  from: string
  to: string
  currentStreak: number
  streakReachesStart: boolean
}
export interface GitHubActivity {
  username: string
  profile: GitHubProfile | null
  commits: GitHubCommit[] | null
  calendar: GitHubCalendar | null
  errors: string[]
  checkedAt: string
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid GitHub data")
  return value as Record<string, unknown>
}
function text(value: unknown): string {
  if (typeof value !== "string" || !value) throw new Error("Invalid GitHub text")
  return value
}
function integer(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid GitHub count")
  return value
}
function githubUrl(value: unknown): string {
  const url = new URL(text(value))
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password) throw new Error("Invalid GitHub link")
  return url.href
}

export function parseGitHubProfile(value: unknown): GitHubProfile {
  const data = record(value)
  const login = text(data.login)
  if (login.toLowerCase() !== GITHUB_USERNAME.toLowerCase()) throw new Error("Unexpected GitHub user")
  return { login, name: typeof data.name === "string" && data.name ? data.name : login, url: githubUrl(data.html_url), publicRepos: integer(data.public_repos), followers: integer(data.followers) }
}

export function parseGitHubCommits(value: unknown): GitHubCommit[] {
  const data = record(value)
  if (!Array.isArray(data.items) || data.incomplete_results !== false) throw new Error("Incomplete GitHub search")
  const commits = data.items.map((value) => {
    const item = record(value), commit = record(item.commit), repo = record(item.repository)
    const author = record(item.author)
    if (text(author.login).toLowerCase() !== GITHUB_USERNAME.toLowerCase() || repo.private === true) throw new Error("Unexpected commit author or visibility")
    const committedAt = text(record(commit.committer).date)
    if (!Number.isFinite(Date.parse(committedAt))) throw new Error("Invalid commit date")
    const sha = text(item.sha)
    if (!/^[a-f0-9]{40,64}$/i.test(sha)) throw new Error("Invalid commit SHA")
    return { sha, repo: text(repo.full_name), message: text(commit.message).split(/\r?\n/)[0].slice(0, 300), committedAt, url: githubUrl(item.html_url) }
  })
  return [...new Map(commits.map((commit) => [`${commit.repo}:${commit.sha}`, commit])).values()].slice(0, 5)
}

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3]]))
}
export function utcDate(date: Date): string { return date.toISOString().slice(0, 10) }
export function shiftDay(date: string, amount: number): string {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + amount)
  return utcDate(value)
}

// GitHub exposes its public profile calendar as HTML, not an unauthenticated REST endpoint.
// Match cells by their tooltip IDs, since markup is ordered by weekday rather than date.
// Fail closed if that public markup changes instead of substituting fabricated activity.
export function parseGitHubCalendar(html: string, today = utcDate(new Date())): GitHubCalendar {
  const counts = new Map<string, number>()
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attributes(match[1]).for
    const label = match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    const count = /^(No|[\d,]+)\s+contributions?\b/i.exec(label)
    if (id && count) counts.set(id, count[1].toLowerCase() === "no" ? 0 : Number(count[1].replaceAll(",", "")))
  }
  const byDate = new Map<string, ContributionDay>()
  for (const match of html.matchAll(/<(?:td|rect)\b[^>]*\bdata-date\s*=[^>]*>/g)) {
    const attr = attributes(match[0]), date = attr["data-date"]
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || utcDate(new Date(`${date}T00:00:00Z`)) !== date) throw new Error("Invalid calendar date")
    if (date > today) continue
    const count = attr["data-count"] !== undefined ? Number(attr["data-count"]) : counts.get(attr.id)
    const level = Number(attr["data-level"])
    if (count === undefined || !Number.isSafeInteger(count) || count < 0 || !Number.isInteger(level) || level < 0 || level > 4) throw new Error("GitHub calendar markup changed")
    byDate.set(date, { date, count, level })
  }
  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
  if (days.length < 350 || days.length > 372) throw new Error("Incomplete GitHub calendar")
  for (let i = 1; i < days.length; i++) {
    if (days[i].date !== shiftDay(days[i - 1].date, 1)) throw new Error("Calendar has missing days")
  }
  if (days[days.length - 1].date !== today) throw new Error("Calendar is not current")
  let date = (byDate.get(today)?.count ?? 0) > 0 ? today : shiftDay(today, -1)
  let currentStreak = 0
  while ((byDate.get(date)?.count ?? 0) > 0) { currentStreak++; date = shiftDay(date, -1) }
  return { days, total: days.reduce((sum, day) => sum + day.count, 0), from: days[0].date, to: days[days.length - 1].date, currentStreak, streakReachesStart: currentStreak > 0 && date < days[0].date }
}

export function recentContributionWeeks(calendar: GitHubCalendar): (ContributionDay | { date: string; count: null; level: null })[] {
  const last = new Date(`${calendar.to}T00:00:00Z`)
  const start = shiftDay(calendar.to, -last.getUTCDay() - 14 * 7)
  const byDate = new Map(calendar.days.map((day) => [day.date, day]))
  return Array.from({ length: 15 * 7 }, (_, index) => {
    const date = shiftDay(start, index)
    const day = byDate.get(date)
    if (date <= calendar.to && !day) throw new Error("Missing heatmap date")
    return day ?? { date, count: null, level: null }
  })
}
