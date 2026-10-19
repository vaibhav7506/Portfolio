// Stage descriptions checked against the CodeShift AI source, not runtime telemetry.
export const CODE_SHIFT_SOURCE = "https://github.com/vaibhav7506/codeshift-ai/blob/main/"

export const CODE_SHIFT_STAGES = [
  {
    label: "ANALYZE", lane: "Repository intelligence", title: "Understand the repository before editing it.",
    description: "Detect framework, package manager, module system, scripts, and migration risks. Recommend a contained first scope without executing repository code.",
    command: "codeshift-ai analyze", input: "Repository files + package.json", output: "Readiness assessment + recommended scopes",
    artifact: "analysis.json", source: "packages/analyzer/src/index.ts",
    log: "Repository signals inspected; a utility scope is recommended.",
    preview: ["// Illustrative repository", "framework: express", "package manager: npm", "module system: commonjs", "recommended scope: src/utils"],
  },
  {
    label: "PLAN", lane: "Deterministic planning", title: "Make the migration small enough to review.",
    description: "Choose a repository-relative scope and build a deterministic JavaScript-to-TypeScript plan. Planning records the proposed steps; source files stay unchanged.",
    command: "codeshift-ai plan --target js-to-ts --path src/utils", input: "Analysis + selected scope", output: "Scoped migration plan + detected validation commands",
    artifact: "migration-plan.json", source: "packages/migrator/src/index.ts",
    log: "Plan targets src/utils; no source files have changed.",
    preview: ["target: JS_TO_TS", "selectedScope: src/utils", "inspect → configure → rename", "convert → validate → review", "source edits at this stage: none"],
  },
  {
    label: "MIGRATE", lane: "Local CLI", title: "Transform the selected scope locally.",
    description: "Rename eligible JS/JSX files, convert straightforward CommonJS syntax, and prepare tsconfig.json. Complex CommonJS stays unchanged with warnings. Optional AI adds advisory notes after the deterministic migration.",
    command: "codeshift-ai migrate --target js-to-ts --path src/utils", input: "Selected local source files", output: "Scoped edits + patch + migration summary",
    artifact: "patch.diff + migration-summary.json", source: "packages/migrator/src/migrate.ts",
    log: "Local transforms prepare a patch; Git history is unchanged.",
    preview: ["// Illustrative .js → .ts module", '- const path = require("node:path");', '+ import path from "node:path";', "- module.exports = path;", "+ export default path;"],
  },
  {
    label: "VALIDATE", lane: "Local CLI", title: "Record evidence from the repository’s own scripts.",
    description: "Run existing test, build, typecheck, and lint scripts. Record missing scripts as SKIPPED, capture failures, and save structured results alongside the command logs.",
    command: "codeshift-ai validate", input: "Migrated repository + existing package scripts", output: "Validation results + captured logs",
    artifact: "validation-result.json + validation-logs.txt", source: "apps/cli/src/validation.ts",
    log: "Existing scripts are evaluated; missing lint is shown as SKIPPED in this example.",
    preview: [],
  },
  {
    label: "REVIEW", lane: "Developer workspace", title: "Put the patch and its evidence side by side.",
    description: "Inspect the diff, warnings, and validation artifacts before choosing the PR workflow. The migration command itself never commits, pushes, or opens a pull request.",
    command: "git diff", input: "Patch + migration summary + validation results", output: "Developer review before any publishing decision",
    artifact: ".codeshift-ai/", source: "apps/cli/src/github-pr.ts",
    log: "Diff and validation artifacts are ready for developer review.",
    preview: [".codeshift-ai/", "├─ analysis.json", "├─ migration-plan.json", "├─ migration-summary.json", "├─ patch.diff", "├─ validation-result.json", "└─ validation-logs.txt"],
  },
  {
    label: "APPROVAL", lane: "Human-controlled Git", title: "Four decisions. No silent publishing.",
    description: "The PR command previews the migration, then asks separately before creating a branch, committing migration files, pushing, and opening a GitHub pull request. Declining a later step preserves earlier approved local work.",
    command: "codeshift-ai pr", input: "Reviewed migration artifacts + Git repository", output: "Only the operations explicitly approved by the developer",
    artifact: "Separate approval at each Git step", source: "apps/cli/src/github-pr.ts",
    log: "Awaiting developer approval. The walkthrough stops here.",
    preview: [],
  },
] as const
