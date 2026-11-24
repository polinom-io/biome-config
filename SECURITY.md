# Security policy

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability** ([direct link](https://github.com/polinom-io/biome-config/security/advisories/new)).

Do not open a public issue, pull request or discussion for a suspected vulnerability.

Include what you found, how to reproduce it, and the affected version. We will acknowledge the report, keep you updated in the advisory, and credit you when the fix is published unless you prefer otherwise.

## Supported versions

Only the latest release of `@polinom-io/biome-config` receives security fixes.

## Scope

This package ships a Biome configuration file (`biome.json`) and no runtime code. Relevant reports include a configuration that disables checks consumers rely on, or problems in this repository's release and publish workflows. Vulnerabilities in Biome itself belong to the [Biome project](https://github.com/biomejs/biome/security).
