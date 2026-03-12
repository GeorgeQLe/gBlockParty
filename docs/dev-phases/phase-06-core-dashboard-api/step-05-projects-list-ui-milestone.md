# Step 5 Milestone: Projects List Page UI

**Phase:** 6, Step 5
**Status:** Not Started

---

## Checklist

### Page (`apps/dashboard/src/app/page.tsx`)
- [ ] Converted to client component (`"use client"`)
- [ ] Uses `useSWR` to fetch `GET /api/projects`
- [ ] Displays loading skeleton while fetching
- [ ] Displays error banner on fetch failure
- [ ] Displays empty state when no projects exist
- [ ] Displays project cards in responsive grid when projects exist
- [ ] Header shows "Projects" title and "Connect Repo" button
- [ ] "Connect Repo" button links to `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL`

### Project Card Component
- [ ] Created at `apps/dashboard/src/components/projects/project-card.tsx`
- [ ] Displays project name
- [ ] Displays GitHub repo full name as external link (opens new tab)
- [ ] Displays latest deployment status badge (or no badge if no deployments)
- [ ] Displays production URL (clickable, truncated if long)
- [ ] Displays relative timestamp for latest deployment ("2h ago")
- [ ] Displays framework indicator pill (nextjs, dockerfile, static)
- [ ] Entire card is clickable, navigates to `/projects/{id}`
- [ ] Hover state: border darkens, subtle shadow

### Status Badge Component
- [ ] Created at `apps/dashboard/src/components/projects/status-badge.tsx`
- [ ] Correct colors for each status: queued (gray), building (yellow), deploying (blue), ready (green), failed (red), archived (gray)
- [ ] Animated pulse dot for in-progress statuses (building, deploying)
- [ ] Supports `sm` and `md` size variants
- [ ] Reusable across other pages (deployment list, detail)

### Empty State Component
- [ ] Created at `apps/dashboard/src/components/projects/projects-empty-state.tsx`
- [ ] Shows message: "No projects yet"
- [ ] Shows sub-text: "Connect a GitHub repository to get started."
- [ ] Includes "Connect Repo" button
- [ ] Dashed border container styling

### Loading Skeleton Component
- [ ] Created at `apps/dashboard/src/components/projects/projects-loading-skeleton.tsx`
- [ ] Shows 3 skeleton cards matching grid layout
- [ ] Uses `animate-pulse` for loading animation
- [ ] Skeleton shapes match real card content dimensions

### Error Banner Component
- [ ] Created at `apps/dashboard/src/components/ui/error-banner.tsx`
- [ ] Displays error message in red styling
- [ ] Optional retry button support

### Utilities
- [ ] SWR fetcher created at `apps/dashboard/src/lib/swr.ts` with error handling
- [ ] Relative time formatter created at `apps/dashboard/src/lib/format.ts`
- [ ] Formatter handles: just now, minutes, hours, days, and date fallback

### Responsive Layout
- [ ] 1 column on mobile (default)
- [ ] 2 columns on tablet (`sm:grid-cols-2`)
- [ ] 3 columns on desktop (`lg:grid-cols-3`)
- [ ] Gap between cards: `gap-4`

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Page component with SWR | [ ] | |
| Project card component | [ ] | |
| Status badge component | [ ] | |
| Empty state component | [ ] | |
| Loading skeleton component | [ ] | |
| Error banner component | [ ] | |
| SWR fetcher utility | [ ] | |
| Relative time utility | [ ] | |
| Responsive grid verified | [ ] | |
| Visual testing complete | [ ] | |
| **Step 5 Complete** | [ ] | |
