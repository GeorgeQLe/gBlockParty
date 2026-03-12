# Step 1 Milestone: Framework Detection

**Phase:** 4 | **Step:** 1 of 5
**Type:** Code implementation

---

## Checklist

### detectFramework()

- [ ] Checks for `next.config.js` in repo root
- [ ] Checks for `next.config.ts` in repo root
- [ ] Checks for `next.config.mjs` in repo root
- [ ] Reads Next.js config file content and searches for `output: 'export'` pattern
- [ ] Returns `{ framework: "nextjs", nextMode: "server" }` when Next.js config has no export output
- [ ] Returns `{ framework: "nextjs", nextMode: "static" }` when Next.js config has `output: 'export'`
- [ ] Returns correct `buildCommand` for Next.js projects (using detected package manager)
- [ ] Returns correct `outputDir` (`".next"` for server, `"out"` for static)
- [ ] Falls through to check for `Dockerfile` if no Next.js config found
- [ ] Returns `{ framework: "dockerfile" }` when `Dockerfile` exists
- [ ] Falls through to check for `index.html` if no Dockerfile found
- [ ] Returns `{ framework: "static" }` when `index.html` exists
- [ ] Throws descriptive error when no framework detected

### detectPackageManager()

- [ ] Checks for `pnpm-lock.yaml` and returns `"pnpm"`
- [ ] Checks for `package-lock.json` and returns `"npm"`
- [ ] Checks for `yarn.lock` and returns `"yarn"`
- [ ] Checks for `bun.lockb` and returns `"bun"`
- [ ] Returns `"pnpm"` as default when no lockfile found
- [ ] Checks lockfiles in the correct priority order (pnpm first)

### Code Quality

- [ ] `pnpm typecheck` passes with no errors
- [ ] No hardcoded paths (uses `path.join(repoPath, filename)`)
- [ ] Async file reading for Next.js config (not blocking the event loop with large files)
- [ ] Synchronous existence checks are acceptable for `detectPackageManager()` (quick operation)
- [ ] Uses types from `@gblockparty/shared/types` (`Framework`, `NextMode`)

---

## Test Cases

| Input | Expected Output |
|-------|----------------|
| Directory with `next.config.js` containing `output: 'export'` | `{ framework: "nextjs", nextMode: "static", buildCommand: "pnpm build", outputDir: "out" }` |
| Directory with `next.config.ts` without export output | `{ framework: "nextjs", nextMode: "server", buildCommand: "pnpm build", outputDir: ".next" }` |
| Directory with `next.config.mjs` | `{ framework: "nextjs", ... }` (correct mode detected) |
| Directory with only `Dockerfile` | `{ framework: "dockerfile", buildCommand: "", outputDir: "." }` |
| Directory with only `index.html` | `{ framework: "static", buildCommand: "", outputDir: "." }` |
| Directory with both `next.config.js` and `Dockerfile` | `{ framework: "nextjs", ... }` (Next.js takes priority) |
| Empty directory | Throws `"Could not detect framework..."` |
| Directory with `pnpm-lock.yaml` | `detectPackageManager()` returns `"pnpm"` |
| Directory with `yarn.lock` | `detectPackageManager()` returns `"yarn"` |
| Directory with no lockfile | `detectPackageManager()` returns `"pnpm"` |
