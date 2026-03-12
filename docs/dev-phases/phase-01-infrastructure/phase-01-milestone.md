# Phase 1: Infrastructure Provisioning - Milestone Criteria

**Phase:** 1 of 12
**Prerequisite Milestones:** None

---

## Definition of Done

Phase 1 is complete when all cloud infrastructure is provisioned, connected, secure, and verified. Every deployed app in subsequent phases depends on this foundation being solid.

---

## Code Review Criteria

### Terraform

- [ ] All Terraform resources use consistent naming: `gblockparty` prefix
- [ ] Sensitive variables marked with `sensitive = true`
- [ ] No hardcoded secrets in `.tf` files or committed `.tfvars`
- [ ] `terraform.tfvars` is `.gitignore`d; only `terraform.tfvars.example` is committed
- [ ] Terraform plan produces no warnings or errors
- [ ] State file is either stored in S3 backend or `.gitignore`d if local
- [ ] Security group rules are scoped to specific IPs (not `0.0.0.0/0` for RDS)
- [ ] IAM policies follow least-privilege principle
- [ ] All resources tagged with `Project = "gblockparty"`

### VPS Configuration

- [ ] Provisioning steps are documented in a runbook or script
- [ ] SSH config changes are tested before disabling fallbacks
- [ ] Firewall rules match the expected ports: SSH (custom), 80, 443
- [ ] Docker version is pinned or documented
- [ ] AWS CLI credentials are stored securely (not in shell history or world-readable files)

### Docker & Caddy

- [ ] Docker network name matches convention: `gblockparty`
- [ ] Caddyfile syntax is valid (`caddy validate`)
- [ ] Caddy admin API is bound to `localhost:2019` (not externally accessible)
- [ ] systemd service files have correct `Restart=` policies
- [ ] No exposed ports that should be internal

### Cloudflare

- [ ] DNS records verified via `dig` or `nslookup`
- [ ] SSL/TLS mode is "Full (Strict)" (not "Flexible" or "Full")
- [ ] Proxy is enabled (orange cloud) on wildcard and root records

---

## Test Requirements

### Automated Checks

There are no automated test suites for infrastructure in this phase. Verification is manual and script-based.

### Manual Verification Checklist

#### AWS Resources

- [ ] `terraform plan` shows no changes (all resources exist and match config)
- [ ] `terraform output database_url` returns a valid PostgreSQL connection string
- [ ] `terraform output s3_bucket_name` returns `gblockparty-builds`
- [ ] `terraform output secret_arns` returns ARNs for all 5 secrets
- [ ] RDS instance is reachable from VPS: `psql "postgresql://...?sslmode=require" -c "SELECT 1"`
- [ ] RDS instance is NOT reachable from arbitrary IPs (test from a non-whitelisted IP)
- [ ] S3 bucket has public access blocked (test with anonymous `curl` to bucket URL)
- [ ] S3 lifecycle rule exists (7-day expiration)

#### VPS

- [ ] SSH login works with key authentication on the custom port
- [ ] SSH login fails with password authentication
- [ ] SSH login as root is denied
- [ ] `docker --version` returns Docker Engine 24+ or 27+
- [ ] `docker compose version` returns v2.x
- [ ] `ufw status` shows: SSH (custom port) ALLOW, 80 ALLOW, 443 ALLOW, default deny
- [ ] `aws s3 ls s3://gblockparty-builds` succeeds from VPS
- [ ] `aws secretsmanager get-secret-value --secret-id gblockparty/jwt-secret` succeeds from VPS
- [ ] Disk usage is under 20% after initial setup

#### Docker & Caddy

- [ ] `docker network ls` shows `gblockparty` network
- [ ] `systemctl status caddy` shows active (running)
- [ ] `caddy validate --config /etc/caddy/Caddyfile` passes
- [ ] `curl -s http://localhost:2019/config/` returns Caddy admin API response
- [ ] `curl -s http://localhost:80` returns a Caddy response (redirect or default page)
- [ ] Caddy can reload config via admin API: `curl -X POST http://localhost:2019/load -H "Content-Type: application/json" -d @config.json`

#### Cloudflare DNS

- [ ] `dig +short A *.yourdomain.dev` returns Cloudflare proxy IPs
- [ ] `dig +short A yourdomain.dev` returns Cloudflare proxy IPs
- [ ] `curl -I https://platform.yourdomain.dev` returns a valid HTTP response (may be 502 if no backend yet, but TLS handshake succeeds)
- [ ] SSL certificate is valid and issued by Cloudflare
- [ ] Cloudflare dashboard shows SSL/TLS mode as "Full (Strict)"

#### End-to-End Smoke Test

- [ ] From local machine: `curl -v https://platform.yourdomain.dev` completes TLS handshake and reaches Caddy on VPS
- [ ] From VPS: `psql` to RDS succeeds with SSL
- [ ] From VPS: upload a test file to S3, download it, delete it
- [ ] From VPS: read a secret from Secrets Manager
- [ ] All of the above work without manual intervention (credentials are pre-configured)

---

## Infrastructure Cost Verification

| Resource | Expected Monthly Cost | Verified |
|----------|----------------------|----------|
| Hetzner CX32 | ~$7/mo | [ ] |
| AWS RDS db.t4g.micro | ~$13/mo | [ ] |
| AWS S3 (minimal usage) | ~$2/mo | [ ] |
| AWS Secrets Manager (5 secrets) | ~$5/mo | [ ] |
| Cloudflare DNS + CDN | $0 (free tier) | [ ] |
| **Total** | **~$27/mo** | [ ] |

---

## Security Verification

- [ ] No secrets committed to version control (scan with `git log --all --diff-filter=A -- '*.tfvars' '*.env' '*.pem'`)
- [ ] RDS security group allows only VPS IP and dev IP
- [ ] RDS requires SSL (`sslmode=require` enforced)
- [ ] VPS SSH hardened (key-only, non-default port, no root)
- [ ] VPS firewall blocks all unnecessary ports
- [ ] Caddy admin API not exposed externally (localhost only)
- [ ] AWS IAM credentials on VPS have minimal permissions
- [ ] Cloudflare proxy enabled (VPS real IP hidden)

---

## Documentation Deliverables

- [ ] Terraform README in `/infra/terraform/` explaining how to plan and apply
- [ ] VPS provisioning runbook (step-by-step commands)
- [ ] Secrets rotation procedure documented
- [ ] Network diagram showing all connections and ports
- [ ] `.env.example` or equivalent for all required environment variables

---

## Sign-Off Criteria

All of the following must be true:

1. Every checkbox in "Manual Verification Checklist" is checked
2. Every checkbox in "Security Verification" is checked
3. Terraform state is clean (`terraform plan` shows no changes)
4. VPS has been running stable for at least 1 hour after setup
5. All 5 step milestones within this phase are individually complete
6. No known issues or workarounds documented without a follow-up plan
