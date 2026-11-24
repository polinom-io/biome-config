<!-- Template for PUBLIC repos: imports public context only. -->
# biome-config

`@polinom-io/biome-config`: the shared Biome formatter and linter configuration for Polinom.io JavaScript and TypeScript repos.

## Shared context

Polinom.io rules are synced into `.ai/` from px-context; edit them there. If your harness has not already loaded them, read these files before any task:

- `.ai/global.md`
- `.ai/company-public.md`
- `.ai/engineering/engineering.md`
- `.ai/engineering/tech-stacks/tech-stacks.md`
- `.ai/engineering/tech-stacks/node-typescript.md`

Project context: `.ai/project-overview.md` and `.ai/business-rules.md`.

## Commands

- Install: `pnpm install --frozen-lockfile`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test`
- Lint and format check: `pnpm check`

## Architecture

- `biome.json`: the published config, exported as `@polinom-io/biome-config/biome`.
- `test/`: builds a throwaway consumer project that extends the config from `node_modules` and asserts formatter output and lint results.

## Rules

- Every style change is a breaking change for consumers: add or update a test, and mark it `feat!:` when it reformats existing code.
- Keep the config close to Biome defaults; each override needs a reason in the PR.
