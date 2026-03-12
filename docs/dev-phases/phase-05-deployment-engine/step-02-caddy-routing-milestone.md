# Step 2: Caddy Dynamic Routing Client -- Milestone Tracker

**Phase:** 5 -- Deployment Engine
**Step:** 2 of 5
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Checklist

### Implementation

- [ ] Define route JSON structure with `@id`, `match` (host), `handle` (reverse_proxy, upstreams)
- [ ] Implement `addRoute(hostname, upstreamPort)`:
  - [ ] Build route JSON with `@id: route-{hostname}`
  - [ ] DELETE existing route by ID (ignore 404)
  - [ ] POST new route to `/config/apps/http/servers/srv0/routes`
  - [ ] Verify 2xx response, throw on error
  - [ ] Log success with hostname, port, routeId
- [ ] Implement `removeRoute(hostname)`:
  - [ ] Compute routeId as `route-{hostname}`
  - [ ] DELETE `/id/{routeId}`
  - [ ] Handle 404 as no-op (log debug, do not throw)
  - [ ] Throw on non-2xx, non-404 responses
  - [ ] Log removal
- [ ] Implement `reloadConfig()`:
  - [ ] GET current config from `/config/`
  - [ ] POST config to `/load`
  - [ ] Log reload
- [ ] Implement retry logic:
  - [ ] Retry up to 3 times on 5xx or connection errors
  - [ ] Exponential backoff: 1s, 2s, 4s
  - [ ] Log each retry attempt
  - [ ] Throw after all retries exhausted

### HTTP Client

- [ ] Use Node.js built-in `fetch` for Caddy admin API calls
- [ ] Set `Content-Type: application/json` header on POST requests
- [ ] Parse error response body for debugging info in thrown errors

### Type Safety

- [ ] `hostname` is `string`, `upstreamPort` is `number`
- [ ] `adminUrl` defaults to `process.env.CADDY_ADMIN_URL` or `http://localhost:2019`
- [ ] `pnpm typecheck` passes with no errors

### Edge Cases

- [ ] `addRoute` for existing hostname works (idempotent upsert via delete-then-add)
- [ ] `removeRoute` for non-existent hostname does not throw
- [ ] Caddy admin API down: retries, then throws clear error
- [ ] Preview hostnames with `--` separator handled correctly in route IDs

---

## Verification

- [ ] Manual test: add a route via `CaddyClient`, verify `curl` to hostname reaches upstream
- [ ] Manual test: remove a route, verify hostname no longer resolves to upstream
- [ ] Manual test: add route for same hostname twice, verify second call updates upstream
- [ ] Manual test: remove non-existent route, verify no error
- [ ] Verify Caddy admin API shows route via `GET /config/apps/http/servers/srv0/routes`
- [ ] `pnpm typecheck` passes

---

## Notes

_Record any decisions or issues during implementation._
