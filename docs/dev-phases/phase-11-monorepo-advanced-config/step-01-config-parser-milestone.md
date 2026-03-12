# Step 1 Milestone: deploy.yaml Parser & Validator

**Phase:** 11 | **Step:** 1 of 4
**Type:** Backend implementation

---

## Checklist

### parseConfig(repoPath)
- [ ] Checks for `deploy.yaml` then `deploy.yml` in repo root
- [ ] Returns `null` when neither file exists
- [ ] Parses YAML with `yaml` npm package
- [ ] Validates against `deployYamlSchema` from `@gblockparty/shared/validation`
- [ ] Normalizes single-service config (`type` field) to `DeployConfig` with one service
- [ ] Normalizes multi-service config (`services` map) to `DeployConfig` with multiple services
- [ ] Applies Zod defaults: `port: 3000`, `healthCheck.path: "/"`
- [ ] Throws `ConfigParseError` for malformed YAML
- [ ] Throws `ConfigValidationError` for schema violations with field details
- [ ] Throws `ConfigValidationError` when neither `type` nor `services` present

### getServiceConfig(repoPath, serviceName?)
- [ ] Returns specific service by name from multi-service config
- [ ] Returns single service from single-service config
- [ ] Falls back to `detectFramework()` when no deploy.yaml
- [ ] Throws for unknown service name in multi-service config
- [ ] Throws when multi-service config is used without service name

### Error Classes
- [ ] `ConfigParseError` includes YAML error details
- [ ] `ConfigValidationError` includes Zod error details

### Types
- [ ] `ServiceConfig` interface exported
- [ ] `DeployConfig` interface exported
- [ ] Types match Zod schema structure

### Tests
- [ ] Valid single-service deploy.yaml -> correct DeployConfig
- [ ] Valid multi-service deploy.yaml -> correct DeployConfig
- [ ] Missing deploy.yaml -> null
- [ ] Invalid YAML syntax -> ConfigParseError
- [ ] Invalid schema -> ConfigValidationError with details
- [ ] Default values applied correctly
- [ ] getServiceConfig fallback to auto-detection

---

## Artifacts

| File | Action |
|------|--------|
| `packages/core/src/build/config-parser.ts` | Create |
| `packages/core/src/build/index.ts` | Modify (add exports) |
| `packages/core/package.json` | Modify (add `yaml` dependency) |

---

## Blockers / Risks

| Risk | Mitigation |
|------|------------|
| `yaml` package not installed in `packages/core` | Run `pnpm add yaml --filter @gblockparty/core` |
| `deployYamlSchema` may need updates for new fields | Schema is already comprehensive; only extend if needed |
| YAML parsing of complex values (anchors, aliases) | The `yaml` package handles standard YAML features; no custom extensions needed |
