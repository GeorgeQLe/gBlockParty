# Step 7 Milestone: Deployment Detail & Build Logs Page UI

**Phase:** 6, Step 7
**Status:** Not Started

---

## Checklist

### Deployments List Page (`apps/dashboard/src/app/projects/[id]/deployments/page.tsx`)
- [ ] Converted to client component with SWR data fetching
- [ ] Fetches paginated deployments from `GET /api/projects/:id/deployments`
- [ ] Displays deployments as a list of rows with:
  - [ ] Status badge (reuses StatusBadge component)
  - [ ] Commit SHA (7 chars, monospace)
  - [ ] Branch name
  - [ ] Deployment type (production, preview, rollback)
  - [ ] Relative timestamp
  - [ ] Build duration
- [ ] Active deployment (current production) has "Active" indicator
- [ ] Type filter buttons: All, Production, Preview, Rollback
- [ ] Filter updates URL search params and triggers re-fetch
- [ ] Pagination controls at bottom (Previous, "Page X of Y", Next)
- [ ] Pagination buttons disabled when at first/last page
- [ ] Empty state shown when no deployments exist
- [ ] Loading state shown while fetching
- [ ] Each row clickable, navigates to deployment detail page

### Deployment Detail Page (`apps/dashboard/src/app/projects/[id]/deployments/[deploymentId]/page.tsx`)
- [ ] File created (new page)
- [ ] Client component with SWR data fetching
- [ ] Fetches deployment detail from `GET /api/projects/:id/deployments/:did`
- [ ] Displays deployment metadata:
  - [ ] Status (StatusBadge component)
  - [ ] Type (capitalized)
  - [ ] Commit SHA (linked to GitHub commit)
  - [ ] Branch name
  - [ ] PR number (linked to GitHub PR, only for preview type)
  - [ ] Build duration (formatted)
  - [ ] URL (clickable link, opens new tab)
  - [ ] Created timestamp (full date/time)
- [ ] Status timeline shows deployment progression (queued -> building -> deploying -> ready)
- [ ] Error message displayed for failed deployments
- [ ] 404 state when deployment not found
- [ ] Loading state while fetching

### Build Log Viewer
- [ ] `apps/dashboard/src/components/deployments/build-log-viewer.tsx` created
- [ ] Fetches build logs from `buildLogUrl` via SWR
- [ ] ANSI escape codes converted to HTML with colors (using `ansi-to-html`)
- [ ] Log viewer has dark background (`bg-gray-900`), monospace font
- [ ] Log viewer is scrollable (`overflow-auto`, `max-h-[600px]`)
- [ ] Auto-scroll to bottom for active builds
- [ ] Loading state: "Loading build logs..." with spinner
- [ ] Empty state for queued builds: "Build has not started yet."
- [ ] Error state: "Failed to load build logs."
- [ ] `escapeXML: true` prevents XSS from build output

### Build Logs API Route
- [ ] File created at `apps/dashboard/src/app/api/projects/[id]/deployments/[deploymentId]/logs/route.ts`
- [ ] Uses `withAuth` middleware
- [ ] Verifies deployment exists and belongs to project
- [ ] Returns 404 if deployment not found
- [ ] Returns 404 with message if `buildLogS3Key` is null
- [ ] Fetches log content from S3 (or returns 501 placeholder)
- [ ] Returns log as `text/plain` content type

### Components Created
- [ ] `apps/dashboard/src/components/deployments/deployment-list.tsx`
- [ ] `apps/dashboard/src/components/deployments/deployment-type-filter.tsx`
- [ ] `apps/dashboard/src/components/deployments/pagination.tsx`
- [ ] `apps/dashboard/src/components/deployments/deployment-metadata.tsx`
- [ ] `apps/dashboard/src/components/deployments/build-log-viewer.tsx`
- [ ] `apps/dashboard/src/components/deployments/deployment-status-timeline.tsx`

### Dependencies
- [ ] `ansi-to-html` package installed in dashboard workspace

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Deployments list page | [ ] | |
| Type filter | [ ] | |
| Pagination | [ ] | |
| Deployment detail page | [ ] | |
| Deployment metadata | [ ] | |
| Status timeline | [ ] | |
| Build log viewer | [ ] | |
| ANSI color rendering | [ ] | |
| Build logs API route | [ ] | |
| Loading/error/empty states | [ ] | |
| Visual testing complete | [ ] | |
| **Step 7 Complete** | [ ] | |
