# Step 6 Milestone: Project Detail Page UI

**Phase:** 6, Step 6
**Status:** Not Started

---

## Checklist

### Layout (`apps/dashboard/src/app/projects/[id]/layout.tsx`)
- [ ] Converted to client component (`"use client"`)
- [ ] Uses `useParams()` to extract project ID
- [ ] Uses `useSWR` to fetch project details from `GET /api/projects/${id}`
- [ ] Displays project name in header
- [ ] Displays latest deployment status badge next to project name
- [ ] Displays GitHub repo full name as external link
- [ ] Tab navigation uses `<Link>` components (not static `<span>`)
- [ ] Tabs: Overview, Deployments, Environment, Settings
- [ ] Active tab detection works correctly:
  - [ ] Overview active only on exact path `/projects/:id`
  - [ ] Other tabs active on path prefix match (e.g., `/projects/:id/deployments/*`)
- [ ] Active tab styled with bottom border and dark text
- [ ] Inactive tabs styled with gray text and hover state
- [ ] Loading skeleton shown while project data loads
- [ ] 404 state shown when project is not found

### Overview Page (`apps/dashboard/src/app/projects/[id]/page.tsx`)
- [ ] Converted to client component
- [ ] Shows production URL section:
  - [ ] URL displayed as clickable link (opens new tab)
  - [ ] "No production deployment yet" message when no URL
- [ ] Shows quick actions section:
  - [ ] Deploy button triggers POST to deployments API
  - [ ] Deploy button shows confirmation dialog before triggering
  - [ ] Deploy button shows loading state while request is in flight
  - [ ] Navigates to new deployment detail page on success
  - [ ] Shows error toast on failure
  - [ ] View Logs button links to latest deployment detail
  - [ ] View Logs button disabled when no deployments exist
- [ ] Shows recent deployments section:
  - [ ] Displays up to 5 most recent deployments
  - [ ] Each row shows: status badge, commit SHA (7 chars), branch, relative time, duration
  - [ ] Each row is clickable (navigates to deployment detail)
  - [ ] "View all deployments" link at bottom

### Components Created
- [ ] `apps/dashboard/src/components/projects/production-url.tsx` -- production URL display
- [ ] `apps/dashboard/src/components/projects/quick-actions.tsx` -- deploy and view logs buttons
- [ ] `apps/dashboard/src/components/deployments/deployment-row.tsx` -- reusable deployment row
- [ ] `apps/dashboard/src/components/projects/project-layout-skeleton.tsx` -- layout loading skeleton
- [ ] `apps/dashboard/src/components/projects/project-not-found.tsx` -- 404 state

### Formatting Utilities
- [ ] `formatCommitSha()` added to `apps/dashboard/src/lib/format.ts` (truncates to 7 chars)
- [ ] `formatDuration()` added to `apps/dashboard/src/lib/format.ts` (ms to "34s" or "2m 15s")

---

## Sign-Off

| Item | Done | Notes |
|------|------|-------|
| Layout with tab navigation | [ ] | |
| Tab active state detection | [ ] | |
| Overview page sections | [ ] | |
| Deploy button flow | [ ] | |
| Recent deployments list | [ ] | |
| Loading/error/404 states | [ ] | |
| Components created | [ ] | |
| Visual testing complete | [ ] | |
| **Step 6 Complete** | [ ] | |
