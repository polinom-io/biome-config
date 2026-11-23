# Business rules

- Formatter: Biome defaults, with one override: single quotes in JS/TS. JSX attributes keep double quotes.
- Linter: Biome `recommended` preset. A rule is turned off only when it clashes with real code, and the PR says why.
- No pragma gate: every file in a consumer repo is formatted.
- Consumers must have a `.gitignore`, because the config enables Biome's VCS ignore-file integration.
- A change that reformats existing consumer code is a breaking change (`feat!:`), released as a new major version.
- Context files synced into `.ai/` from px-context are never formatted or linted.
