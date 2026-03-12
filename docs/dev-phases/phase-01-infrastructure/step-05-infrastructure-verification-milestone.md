# Step 5: Infrastructure Verification - Milestone

**Phase:** 1 - Infrastructure Provisioning
**Step:** 5 of 5

---

## Definition of Done

All infrastructure verification scripts run to completion with zero failures. Every component (AWS, VPS, Docker, Caddy, DNS, TLS) is verified as connected, functional, and secure. The Phase 1 milestone summary can be confidently filled out.

---

## Code Review Criteria

- [ ] `/infra/scripts/verify-infrastructure.sh` exists and is executable
- [ ] `/infra/scripts/verify-dns.sh` exists and is executable
- [ ] `/infra/scripts/verify-security.sh` exists and is executable
- [ ] Scripts use color-coded output (PASS/FAIL/WARN) for readability
- [ ] Scripts exit with non-zero code if any test fails
- [ ] Scripts do not require interactive input
- [ ] Scripts do not modify infrastructure (read-only verification)
- [ ] No hardcoded IPs, domains, or credentials in scripts

---

## Test Requirements

### Verification Script Execution

- [ ] `verify-infrastructure.sh` runs on VPS and reports all PASS (zero FAIL)
- [ ] `verify-dns.sh <domain>` runs from any machine and shows correct DNS resolution
- [ ] `verify-security.sh <VPS_IP>` runs from external machine and confirms all security measures

### Full Test Matrix

All 33 tests from the step spec must pass:

#### AWS Resources (Tests 1-9)

- [ ] 1: S3 bucket exists
- [ ] 2: S3 write access
- [ ] 3: S3 read access
- [ ] 4: S3 delete access
- [ ] 5: S3 public access blocked
- [ ] 6: Secrets Manager read
- [ ] 7: Secrets Manager list (5 secrets)
- [ ] 8: RDS connect with SSL
- [ ] 9: RDS SSL enforced

#### VPS Health (Tests 10-16)

- [ ] 10: Docker Engine version 24+ or 27+
- [ ] 11: Docker Compose v2.x
- [ ] 12: Docker hello-world runs
- [ ] 13: Docker network `gblockparty` exists
- [ ] 14: UFW active with correct rules
- [ ] 15: Disk usage under 50%
- [ ] 16: Memory available 6000+ MB

#### Caddy (Tests 17-21)

- [ ] 17: Caddy service active
- [ ] 18: Caddy service enabled
- [ ] 19: Caddyfile valid
- [ ] 20: Admin API responding
- [ ] 21: HTTP response on port 80

#### DNS & TLS (Tests 22-27)

- [ ] 22: Root DNS resolves
- [ ] 23: Wildcard DNS resolves
- [ ] 24: Platform subdomain resolves
- [ ] 25: Preview subdomain resolves
- [ ] 26: HTTPS TLS handshake succeeds
- [ ] 27: Cloudflare headers present

#### Security (Tests 28-33)

- [ ] 28: Port 22 closed externally
- [ ] 29: Port 2019 closed externally
- [ ] 30: Port 3000 closed externally
- [ ] 31: Root SSH denied
- [ ] 32: Password SSH denied
- [ ] 33: VPS IP hidden behind Cloudflare

### End-to-End Smoke Test

- [ ] `curl https://platform.yourdomain.dev` completes full request path: DNS -> Cloudflare -> VPS -> Caddy -> response
- [ ] Response includes `cf-ray` header
- [ ] Response body is "Service not found" (503) from Caddy catch-all (expected -- dashboard not deployed yet)
- [ ] Same test works for arbitrary subdomain: `curl https://test.yourdomain.dev`

---

## Artifacts

| File | Action |
|------|--------|
| `/infra/scripts/verify-infrastructure.sh` | Create |
| `/infra/scripts/verify-dns.sh` | Create |
| `/infra/scripts/verify-security.sh` | Create |

---

## Post-Verification Actions

Once all tests pass:

1. Fill out the Phase 1 `milestone-summary.md` with actual results
2. Record all infrastructure values (VPS IP, RDS endpoint, S3 bucket name, etc.) in a secure location
3. Take a snapshot of the Hetzner VPS as a baseline backup
4. Confirm Terraform state is committed (if using S3 backend) or backed up (if local)
5. Proceed to Phase 2 (Database & Migrations)

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| One component fails, blocking Phase 1 completion | Fix in the relevant step (1-4), re-run verification |
| Intermittent connectivity failures | Retry tests; check for transient issues vs. configuration problems |
| Caddy wildcard cert not yet issued | May take a few minutes after initial DNS setup; check Caddy logs for challenge status |
| Let's Encrypt rate limits hit during testing | Use staging CA during repeated testing, switch to production for final verification |
