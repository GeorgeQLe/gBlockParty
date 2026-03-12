# Step 4 Milestone: Connection String & Credential Management

**Phase:** 10 | **Step:** 4 of 4
**Type:** Cross-cutting (backend encryption + frontend UX)

---

## Checklist

### Encryption
- [ ] Password encrypted with `encrypt()` before storage in `managed_databases.db_password_encrypted`
- [ ] Encrypted format is `{iv_hex}:{auth_tag_hex}:{ciphertext_hex}`
- [ ] Password decrypted with `decrypt()` in GET API route (server-side only)
- [ ] Encryption key sourced from `ENCRYPTION_KEY` env var (AWS Secrets Manager)
- [ ] Round-trip test: `decrypt(encrypt(password)) === password`

### Connection String Construction
- [ ] Format: `postgresql://{user}:{password}@{rdsEndpoint}:5432/{dbname}?sslmode=require`
- [ ] Password URL-encoded with `encodeURIComponent()` as safety measure
- [ ] `buildConnectionString()` helper used by both `provision()` and `getDatabaseInfo()`
- [ ] RDS endpoint sourced from `RDS_ENDPOINT` env var
- [ ] Connection string is valid: connects successfully when pasted into `psql`

### Frontend: ConnectionString Component
- [ ] Component created at `apps/dashboard/src/components/database/connection-string.tsx`
- [ ] Displays connection string in monospace font
- [ ] Password masked by default (replaced with `********`)
- [ ] Eye icon toggles password visibility
- [ ] Masked display does not reveal password length
- [ ] Copy button copies FULL connection string (with real password)
- [ ] Copy uses `navigator.clipboard.writeText()` with fallback for insecure contexts
- [ ] "Copied!" feedback with checkmark icon displayed for 2 seconds after copy
- [ ] Connection string text wraps properly (no horizontal scroll)

### Security
- [ ] Encrypted credentials in database (never plaintext)
- [ ] Decryption happens server-side only (API route handler)
- [ ] API endpoint behind `withAuth`
- [ ] No `Cache-Control` headers that would cache the connection string
- [ ] No passwords in server log output (verified by searching logs)
- [ ] Masked display always shows `********` regardless of actual password length

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/database/provisioner.ts` | Verify encryption integration |
| `apps/dashboard/src/components/database/connection-string.tsx` | Create |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| `ENCRYPTION_KEY` not set in development | Add to `.env.local` and document in setup guide; generate with `openssl rand -hex 32` |
| `navigator.clipboard` blocked in HTTP contexts | Fallback to `document.execCommand('copy')` for local development |
| Password with special characters breaks URL parsing | `base64url` encoding produces only URL-safe chars; `encodeURIComponent()` as extra safety |
