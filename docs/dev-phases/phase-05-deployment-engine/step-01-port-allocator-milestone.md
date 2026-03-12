# Step 1: Port Allocator -- Milestone Tracker

**Phase:** 5 -- Deployment Engine
**Step:** 1 of 5
**Status:** Not Started
**Started:** --
**Completed:** --

---

## Checklist

### Implementation

- [ ] Import Drizzle schema (`portAllocations`), ORM operators (`eq`, `and`, `gte`, `lte`), and `PORT_RANGES` constants
- [ ] Add logger: `createLogger("port-allocator")`
- [ ] Implement `allocate(deploymentId, type)`:
  - [ ] Determine min/max from `PORT_RANGES` based on type
  - [ ] Query used ports in range from `port_allocations` table
  - [ ] Find lowest available port not in the used set
  - [ ] Throw descriptive error if no ports available
  - [ ] Insert into `port_allocations` table
  - [ ] Log successful allocation
  - [ ] Return the allocated port number
- [ ] Implement `release(port)`:
  - [ ] Delete from `port_allocations` where port matches
  - [ ] No-op if port was not allocated (no throw)
  - [ ] Log the release
- [ ] Implement `getUsedPorts()`:
  - [ ] Select all ports from `port_allocations` ordered ascending
  - [ ] Return as `number[]`

### Type Safety

- [ ] `type` parameter is union `"production" | "preview"` (already in stub)
- [ ] Return type of `allocate()` is `Promise<number>` (already in stub)
- [ ] `pnpm typecheck` passes with no errors

### Edge Cases

- [ ] Port 3000 is never allocated (outside both ranges)
- [ ] Concurrent allocation prevented by DB unique constraint on `port` PK
- [ ] Empty `port_allocations` table: first allocation returns range minimum (3001 or 4000)
- [ ] All ports allocated: throws with clear error message including range and type

---

## Verification

- [ ] Manual test: allocate a production port, verify DB row exists
- [ ] Manual test: allocate a preview port, verify DB row exists
- [ ] Manual test: release a port, verify DB row is deleted
- [ ] Manual test: allocate after release, verify freed port can be reused
- [ ] Manual test: `getUsedPorts()` returns correct list
- [ ] `pnpm typecheck` passes

---

## Notes

_Record any decisions or issues during implementation._
