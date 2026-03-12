# Step 1: Terraform AWS Resources - Milestone

**Phase:** 1 - Infrastructure Provisioning
**Step:** 1 of 5

---

## Definition of Done

All AWS resources are provisioned via Terraform, Terraform state is clean, and all outputs are retrievable.

---

## Code Review Criteria

- [ ] Security group module exists at `/infra/terraform/modules/security-group/`
- [ ] IAM module exists at `/infra/terraform/modules/iam/`
- [ ] RDS module updated: `publicly_accessible = true`, `storage_encrypted = true`, SSL enforced via parameter group
- [ ] Production `main.tf` calls all 5 modules: rds, s3, secrets, security-group, iam
- [ ] All sensitive variables marked with `sensitive = true`
- [ ] `terraform.tfvars` is NOT committed (only `.example` file)
- [ ] IAM policies follow least-privilege (only specific S3 and Secrets Manager actions)
- [ ] Security group ingress limited to specific CIDR blocks (not `0.0.0.0/0`)
- [ ] All resources tagged with `Project = "gblockparty"`
- [ ] No deprecated Terraform syntax (compatible with Terraform >= 1.5)
- [ ] Outputs include all values needed by subsequent steps (database_url, bucket_name, IAM credentials, SG ID)

---

## Test Requirements

### Terraform Validation

- [ ] `terraform fmt -check` passes (no formatting issues)
- [ ] `terraform validate` passes (no syntax errors)
- [ ] `terraform plan` completes without errors

### Post-Apply Verification

- [ ] `terraform plan` shows "No changes" after apply
- [ ] `terraform output database_url` returns a valid PostgreSQL connection string
- [ ] `terraform output s3_bucket_name` returns `gblockparty-builds`
- [ ] `terraform output secret_arns` returns all 5 secret ARNs
- [ ] `terraform output vps_iam_access_key_id` returns a value
- [ ] `terraform output vps_iam_secret_access_key` returns a value

### AWS Console Verification

- [ ] RDS instance visible in AWS Console, status "available"
- [ ] RDS instance type is `db.t4g.micro`
- [ ] RDS storage encryption is enabled
- [ ] RDS automated backups are configured (7-day retention)
- [ ] RDS parameter group has `rds.force_ssl = 1`
- [ ] S3 bucket exists with correct lifecycle rule
- [ ] S3 bucket has SSE-S3 encryption enabled
- [ ] S3 bucket blocks all public access
- [ ] All 5 Secrets Manager secrets exist
- [ ] Security group has expected ingress rules
- [ ] IAM user exists with correct policies attached

---

## Manual Verification

```bash
# From any machine with AWS CLI configured:

# Check RDS
aws rds describe-db-instances --db-instance-identifier gblockparty \
  --query 'DBInstances[0].[DBInstanceStatus,Engine,EngineVersion,DBInstanceClass,StorageEncrypted]'
# Expected: ["available", "postgres", "16.x", "db.t4g.micro", true]

# Check S3
aws s3api head-bucket --bucket gblockparty-builds
# Expected: no error (bucket exists)

aws s3api get-bucket-lifecycle-configuration --bucket gblockparty-builds
# Expected: rule with 7-day expiration

# Check Secrets
aws secretsmanager list-secrets --filters Key=name,Values=gblockparty/ \
  --query 'SecretList[].Name'
# Expected: 5 secret names

# Check Security Group
aws ec2 describe-security-groups --filters Name=group-name,Values=gblockparty-rds \
  --query 'SecurityGroups[0].IpPermissions'
# Expected: port 5432, specific CIDR blocks

# Check IAM
aws iam get-user --user-name gblockparty-vps
# Expected: user exists
aws iam list-user-policies --user-name gblockparty-vps
# Expected: s3-access, secrets-access policies
```

---

## Artifacts

| File | Action |
|------|--------|
| `/infra/terraform/modules/security-group/main.tf` | Create |
| `/infra/terraform/modules/security-group/variables.tf` | Create |
| `/infra/terraform/modules/security-group/outputs.tf` | Create |
| `/infra/terraform/modules/iam/main.tf` | Create |
| `/infra/terraform/modules/iam/variables.tf` | Create |
| `/infra/terraform/modules/iam/outputs.tf` | Create |
| `/infra/terraform/modules/rds/main.tf` | Modify |
| `/infra/terraform/environments/prod/main.tf` | Modify |
| `/infra/terraform/environments/prod/variables.tf` | Modify |
| `/infra/terraform/environments/prod/outputs.tf` | Modify |
| `/infra/terraform/environments/prod/terraform.tfvars.example` | Modify |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| Need existing VPC ID and subnet group for RDS | Use the existing Bismarck VPC or create a new default VPC |
| RDS provisioning takes 5-15 minutes | Plan ahead; no workaround |
| VPS IP not yet known (Step 2) | Apply SG with dev IP first; update with VPS IP after Step 2 |
