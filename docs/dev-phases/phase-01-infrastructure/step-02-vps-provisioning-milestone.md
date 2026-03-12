# Step 2: VPS Provisioning - Milestone

**Phase:** 1 - Infrastructure Provisioning
**Step:** 2 of 5

---

## Definition of Done

A Hetzner CX32 VPS is running Ubuntu 22.04, SSH-hardened, firewalled, Docker-ready, and has AWS CLI credentials configured. The VPS public IP is known and registered in the RDS security group.

---

## Code Review Criteria

- [ ] Provisioning script `/infra/scripts/provision-vps.sh` exists and is documented
- [ ] Verification script `/infra/scripts/test-vps.sh` exists
- [ ] Scripts do not contain hardcoded secrets or IP addresses
- [ ] Scripts use `set -euo pipefail` for safety
- [ ] `.gitignore` excludes Terraform state and tfvars files
- [ ] SSH port, username, and other configurable values are parameterized in scripts

---

## Test Requirements

### SSH Access

- [ ] `ssh -p 2222 deploy@<VPS_IP>` succeeds with key authentication
- [ ] `ssh -p 2222 root@<VPS_IP>` is denied ("Permission denied")
- [ ] `ssh -p 22 deploy@<VPS_IP>` times out or is refused (default port disabled)
- [ ] Password authentication attempt is rejected

### Firewall

- [ ] `sudo ufw status` shows active with rules for 2222, 80, 443 only
- [ ] Port scan from external machine confirms only 2222, 80, 443 are open
- [ ] All other ports are blocked (test with `nc -zv <VPS_IP> 3000` from external -- should fail)

### Docker

- [ ] `docker --version` outputs Docker Engine 24+ or 27+
- [ ] `docker compose version` outputs Compose v2.x
- [ ] `docker run hello-world` succeeds (as deploy user, no sudo)
- [ ] `docker info` shows `overlay2` storage driver
- [ ] Docker service is enabled and running: `systemctl is-active docker`
- [ ] Docker log rotation is configured: `cat /etc/docker/daemon.json`

### AWS Access

- [ ] `aws sts get-caller-identity` returns the `gblockparty-vps` IAM user
- [ ] `aws s3 ls s3://gblockparty-builds` succeeds (bucket accessible)
- [ ] `aws s3 cp /tmp/test.txt s3://gblockparty-builds/test.txt` succeeds (write access)
- [ ] `aws s3 rm s3://gblockparty-builds/test.txt` succeeds (delete access)
- [ ] `aws secretsmanager get-secret-value --secret-id gblockparty/jwt-secret` succeeds or returns a "not set" response (secret exists but may have no value yet)
- [ ] AWS credentials file permissions are 600: `stat -c %a ~/.aws/credentials`

### System Health

- [ ] Disk usage under 20%: `df -h /`
- [ ] Memory usage reasonable: `free -h`
- [ ] System timezone is UTC: `timedatectl`
- [ ] Automatic security updates enabled: `systemctl is-active unattended-upgrades`
- [ ] PostgreSQL client installed: `psql --version`

### RDS Connectivity (after Terraform SG update)

- [ ] Terraform re-applied with VPS IP in `allowed_cidr_blocks`
- [ ] `psql "postgresql://gblockparty:<password>@<rds-endpoint>:5432/gblockparty?sslmode=require" -c "SELECT 1"` returns 1
- [ ] Connection with `sslmode=disable` fails (SSL enforced)

---

## Artifacts

| File | Action |
|------|--------|
| `/infra/scripts/provision-vps.sh` | Create |
| `/infra/scripts/test-vps.sh` | Create |
| `.gitignore` | Modify (if needed) |
| `/infra/terraform/environments/prod/terraform.tfvars` | Modify (add VPS IP) |

---

## Information to Record

The following values are produced by this step and needed by subsequent steps:

| Value | Where to Store | Used By |
|-------|---------------|---------|
| VPS public IPv4 address | Terraform tfvars, Cloudflare DNS | Steps 1 (SG update), 4, 5 |
| SSH port | Runbook / notes | Ongoing SSH access |
| deploy user name | Runbook / notes | All VPS operations |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| SSH lockout after hardening | Test new SSH config in separate terminal before closing existing session |
| Hetzner CX32 unavailable in Ashburn | Fall back to CX22 (lower spec) or Hillsboro datacenter |
| Docker install fails on Ubuntu 22.04 | Use official Docker install script as fallback |
| RDS SG update requires VPS IP known first | Apply Terraform twice: once without VPS IP (dev IP only), once after VPS created |
