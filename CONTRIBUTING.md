# Contributing

## Plugin packaging

The root `plugin.json` and `skills/` directory are the source of truth. `.claude-plugin`, `.agents/plugins`, and `.cursor-plugin` contain client-specific distribution metadata. On release, keep the npm package, portable plugin, and Claude plugin versions in sync. Marketplace entries inherit the plugin version instead of duplicating it.

## Release

Add a changeset for every publishable change:

```bash
bun run changeset
```

When the changeset reaches `main`, the publish workflow tests the package, updates its version and changelog, publishes to npm through trusted publishing, and commits the release files back to `main`. A separate job publishes the same version as an Agent Skills release on GitHub.

Validate a release without publishing it:

```bash
gh skill publish --dry-run
bun run test
bun publish --dry-run
```
