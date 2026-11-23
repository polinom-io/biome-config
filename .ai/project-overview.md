# Project overview

`@polinom-io/biome-config` is the shared Biome configuration for Polinom.io JavaScript and TypeScript repos. It replaces the legacy `@polinom.io/eslint-config` and `@polinom.io/prettier-config` packages on npmjs.org.

- Consumers: every Polinom.io Node/TypeScript repo, through `"extends": ["@polinom-io/biome-config/biome"]` in `biome.json`.
- Distribution: GitHub Packages, scope `@polinom-io`, published from GitHub Actions.
- Peer dependency: `@biomejs/biome` 2.x.
