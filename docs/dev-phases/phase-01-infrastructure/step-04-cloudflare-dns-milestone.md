# Step 4: Cloudflare DNS Configuration - Milestone

**Phase:** 1 - Infrastructure Provisioning
**Step:** 4 of 5

---

## Definition of Done

Cloudflare DNS is configured with wildcard and root A records pointing to the VPS (proxied). SSL/TLS is set to Full (Strict). DNS resolves correctly for all subdomains. Cache rules are configured for static assets and API bypass.

---

## Code Review Criteria

- [ ] DNS setup script `/infra/scripts/setup-cloudflare-dns.sh` exists and uses environment variables (no hardcoded tokens or IPs)
- [ ] Script does not commit any API tokens or zone IDs
- [ ] Cloudflare API token stored in Caddy env file and optionally in Secrets Manager

---

## Test Requirements

### DNS Resolution

- [ ] `dig +short A platform.yourdomain.dev` returns Cloudflare proxy IPs (not VPS IP)
- [ ] `dig +short A anything.yourdomain.dev` returns Cloudflare proxy IPs (wildcard works)
- [ ] `dig +short A yourdomain.dev` returns Cloudflare proxy IPs (root record works)
- [ ] `dig +short A pr-42--myapp.yourdomain.dev` returns Cloudflare proxy IPs (double-dash subdomain works)
- [ ] VPS real IP does NOT appear in any DNS response

### SSL/TLS

- [ ] Cloudflare SSL/TLS mode is "Full (Strict)" (verify in dashboard)
- [ ] `curl -v https://platform.yourdomain.dev 2>&1 | grep "issuer"` shows Cloudflare certificate
- [ ] TLS 1.2+ is enforced (verify in Cloudflare dashboard: **SSL/TLS > Edge Certificates > Minimum TLS Version**)
- [ ] "Always Use HTTPS" is enabled (verify in dashboard)

### Cloudflare Proxy

- [ ] Response headers include `cf-ray` (confirms proxy is active)
- [ ] Response headers include `server: cloudflare`
- [ ] VPS IP is not discoverable via response headers

### Caching

- [ ] Cache rules configured: static assets cached, API routes bypassed
- [ ] `curl -sI https://platform.yourdomain.dev/api/health` does NOT have `cf-cache-status: HIT` (API not cached)

### End-to-End (VPS Running)

- [ ] `curl https://platform.yourdomain.dev` reaches Caddy on VPS (returns 503 "Service not found" or Caddy default -- dashboard not yet deployed)
- [ ] If Caddy cert issuance is complete: Full (Strict) mode works end-to-end without SSL errors
- [ ] If Caddy cert issuance is pending: Cloudflare returns 502/526 but TLS handshake with Cloudflare edge succeeds

---

## Cloudflare Dashboard Verification

| Setting | Expected Value | Location in Dashboard | Verified |
|---------|---------------|----------------------|----------|
| SSL/TLS Mode | Full (Strict) | SSL/TLS > Overview | [ ] |
| Minimum TLS Version | TLS 1.2 | SSL/TLS > Edge Certificates | [ ] |
| Always Use HTTPS | On | SSL/TLS > Edge Certificates | [ ] |
| Wildcard A record | `*` -> VPS IP, Proxied | DNS > Records | [ ] |
| Root A record | `@` -> VPS IP, Proxied | DNS > Records | [ ] |
| Bot Fight Mode | On | Security > Bots | [ ] |
| Browser Cache TTL | Respect Existing Headers | Caching > Configuration | [ ] |

---

## Artifacts

| File | Action |
|------|--------|
| `/infra/scripts/setup-cloudflare-dns.sh` | Create |

---

## Information to Record

| Value | Where to Store | Used By |
|-------|---------------|---------|
| Cloudflare Zone ID | Secrets Manager or notes | DNS management |
| Cloudflare API Token | `/etc/caddy/caddy.env` on VPS + Secrets Manager | Caddy DNS challenge |
| Domain name (yourdomain.dev) | `/etc/caddy/caddy.env` on VPS | Caddy, deployment engine |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| Domain not yet registered or transferred to Cloudflare | Must be done before this step; domain must use Cloudflare nameservers |
| Cloudflare free plan limitations | Free plan supports wildcard DNS proxying and basic WAF; sufficient for MVP |
| DNS propagation delay | Cloudflare DNS typically propagates in seconds; wait up to 5 minutes |
| Caddy cert not yet issued when testing Full (Strict) | Expected; Caddy issues cert after first request triggers DNS challenge. May see temporary 526 errors |
