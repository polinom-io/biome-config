# @polinom-io/biome-config

Polinom.io shared [Biome](https://biomejs.dev) configuration for formatting and linting JavaScript and TypeScript.

It replaces the legacy `@polinom.io/eslint-config` and `@polinom.io/prettier-config` packages.

## Style

Biome defaults, with one override:

- Single quotes in JS/TS (JSX attributes keep double quotes).
- Tabs, 80-column lines, semicolons, trailing commas on multiline lists, arrow parens always.
- Linter: Biome `recommended` preset.
- Respects `.gitignore` (VCS integration enabled).
- Ignores `.ai/` (synced context) and the files release-please writes (`CHANGELOG.md`, `.release-please-manifest.json`).

## Install

The package is published to GitHub Packages, which requires authentication even to read.

1. Create a GitHub token with the `read:packages` scope (a classic personal access token, or `gh auth refresh -s read:packages` and `gh auth token`).
2. Map the `@polinom-io` scope and the token once in your user `~/.npmrc` (never in the repo; pnpm 12 only reads credentials from the user config):

   ```ini
   @polinom-io:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=<token with read:packages>
   ```

3. Install it with Biome pinned to an exact version (peer range `>=2.6.8 <3`):

   ```sh
   pnpm add -D -E @biomejs/biome @polinom-io/biome-config
   ```

### In GitHub Actions

The workflow's `GITHUB_TOKEN` can read the package: grant the job `packages: read` and write the scope and token to the user `~/.npmrc` before installing.

```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: read
    steps:
      # checkout, pnpm/action-setup and actions/setup-node go here
      - name: Authenticate to GitHub Packages
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          echo "@polinom-io:registry=https://npm.pkg.github.com" >> ~/.npmrc
          echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
      - run: pnpm install --frozen-lockfile
      - run: pnpm biome ci .
```

## Use

`biome.json`:

```json
{
	"$schema": "https://biomejs.dev/schemas/2.6.8/schema.json",
	"extends": ["@polinom-io/biome-config/biome"]
}
```

`package.json` scripts:

```json
{
	"scripts": {
		"check": "biome check .",
		"check:fix": "biome check --write ."
	}
}
```

In CI, run `pnpm biome ci .`.

## Development

```sh
pnpm install
pnpm typecheck
pnpm test    # verifies the config through a consumer project
pnpm check   # lints and formats this repo with its own config
```
