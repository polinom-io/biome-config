# @polinom-io/biome-config

Polinom.io shared [Biome](https://biomejs.dev) configuration for formatting and linting JavaScript and TypeScript.

It replaces the legacy `@polinom.io/eslint-config` and `@polinom.io/prettier-config` packages.

## Style

Biome defaults, with one override:

- Single quotes in JS/TS (JSX attributes keep double quotes).
- Tabs, 80-column lines, semicolons, trailing commas on multiline lists, arrow parens always.
- Linter: Biome `recommended` preset.
- Respects `.gitignore` (VCS integration enabled).

## Install

The package is published to GitHub Packages. Point the `@polinom-io` scope at it in `.npmrc`:

```ini
@polinom-io:registry=https://npm.pkg.github.com
```

Then install it with Biome pinned to an exact version:

```sh
pnpm add -D -E @biomejs/biome @polinom-io/biome-config
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
