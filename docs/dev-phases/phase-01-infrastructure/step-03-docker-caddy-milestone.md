# Step 3: Docker & Caddy Setup - Milestone

**Phase:** 1 - Infrastructure Provisioning
**Step:** 3 of 5

---

## Definition of Done

Docker network is created, Caddy is installed with the Cloudflare DNS plugin, the production Caddyfile is deployed, Caddy is running as a systemd service with wildcard TLS certificate provisioned, and the Docker cleanup timer is active.

---

## Code Review Criteria

- [ ] Caddyfile uses environment variables for domain and Cloudflare token (no hardcoded values)
- [ ] Caddy admin API bound to `localhost:2019` only
- [ ] Caddyfile includes wildcard catch-all returning 503
- [ ] systemd service file has appropriate restart policy (`Restart=on-failure`)
- [ ] systemd service file runs Caddy as `caddy` user, not root
- [ ] `caddy.env.example` exists (no real credentials committed)
- [ ] Docker cleanup timer configured for weekly execution
- [ ] Setup script is documented and reproducible
- [ ] Docker compose file updated with `gblockparty` network for local dev consistency

---

## Test Requirements

### Caddy Installation

- [ ] `caddy version` outputs a version string
- [ ] `caddy list-modules | grep cloudflare` confirms Cloudflare DNS module is loaded
- [ ] Caddy binary is at `/usr/bin/caddy`

### Caddy Configuration

- [ ] `caddy validate --config /etc/caddy/Caddyfile` passes
- [ ] Environment variables are loaded from `/etc/caddy/caddy.env`
- [ ] Caddyfile references `{$PLATFORM_DOMAIN}` (not a hardcoded domain)

### Caddy Service

- [ ] `systemctl status caddy` shows `active (running)`
- [ ] `systemctl is-enabled caddy` shows `enabled`
- [ ] Caddy survives a reboot: `sudo reboot` then check `systemctl status caddy`
- [ ] Caddy restarts after crash: `sudo kill -9 $(pgrep caddy)` then wait 5s, check status
- [ ] `journalctl -u caddy --no-pager -n 20` shows no errors

### Caddy Admin API

- [ ] `curl -s http://localhost:2019/config/` returns valid JSON
- [ ] Admin API is not accessible from external IP: `curl -s http://<VPS_IP>:2019/config/` times out or is refused
- [ ] Config reload works: `curl -X POST http://localhost:2019/load -H "Content-Type: application/json" -d '{"admin":{"listen":"localhost:2019"}}'`

### TLS Certificate

- [ ] Caddy logs show successful certificate issuance for `*.yourdomain.dev`
- [ ] `curl -v https://platform.yourdomain.dev` shows a valid TLS certificate (after DNS is configured in Step 4)
- [ ] Certificate is from Let's Encrypt (or ZeroSSL, Caddy's default CA)

### Docker Network

- [ ] `docker network ls | grep gblockparty` shows the network exists
- [ ] `docker network inspect gblockparty` shows correct configuration (bridge driver)
- [ ] A test container can join the network: `docker run --rm --network gblockparty alpine ping -c 1 host.docker.internal` (or equivalent)

### Docker Cleanup Timer

- [ ] `systemctl list-timers | grep docker-cleanup` shows the timer
- [ ] `systemctl status docker-cleanup.timer` shows active
- [ ] Manual trigger works: `systemctl start docker-cleanup.service` (runs prune)

### Local Development

- [ ] `docker compose -f infra/docker/docker-compose.yml config` validates (with network config)
- [ ] Local `docker compose up` still works after docker-compose.yml modifications

---

## Artifacts

| File | Action |
|------|--------|
| `/infra/docker/Caddyfile` | Modify |
| `/infra/docker/docker-compose.yml` | Modify |
| `/infra/systemd/caddy.service` | Create |
| `/infra/systemd/caddy.env.example` | Create |
| `/infra/systemd/docker-cleanup.service` | Create |
| `/infra/systemd/docker-cleanup.timer` | Create |
| `/infra/scripts/setup-caddy.sh` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| xcaddy build fails on VPS | Pre-build the binary locally and SCP it to the VPS |
| Cloudflare DNS challenge fails | Verify API token permissions; check Caddy logs for specific error |
| Let's Encrypt rate limits | Use staging CA for testing (`acme_ca https://acme-staging-v02.api.letsencrypt.org/directory`) |
| Caddy can't bind port 80/443 | Ensure `CAP_NET_BIND_SERVICE` in systemd unit; check no other service on those ports |
| TLS cert not issued until DNS is configured | Expected; cert issuance happens after Step 4 completes |
