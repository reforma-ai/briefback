# @reforma/briefback

## 2.1.0

### Minor Changes

- be85a34: Treat implementation stages as review boundaries rather than independently
  deployable pull requests, and let obvious work spanning one or two compact
  stages proceed from the confirmed reading without a plan artifact. Let review
  perform verifiable behavior-preserving refactors across the affected stage
  instead of limiting fixes to small local edits.

## 2.0.2

### Patch Changes

- 4205a94: Activate Briefback automatically for software work larger than a quick fix and expose the ordered delivery loop in the skill description.

## 2.0.1

### Patch Changes

- 778cf44: Keep the public README examples entirely in English.

## 2.0.0

### Major Changes

- fc3bad8: Replace the separate workflow skills with one `briefback` skill that routes research, grill, plan, TDD, review, handoff, and documentation requests to focused references.

### Minor Changes

- b2382a7: Ship the repo as an Agent Plugins package, with a Claude Code overlay on the same skills tree.

### Patch Changes

- 0da77d7: Restore the README banner, badges, and visual section markers, and include the banner asset in the published npm package.
- 268cac9: Link Briefback and Prosecraft from their READMEs so users can discover the companion writing skills.
- b2382a7: Run `/code-review` in one subagent that fixes locally and returns what it changed versus what needs a decision.
- 444ce96: Rename GH Org
- c43464a: Smooth an overly segmented paragraph in the README.
- c4b3b50: Ask grill rounds as ordinary chat text. Skip a second host questionnaire that re-asks the same questions.
- b2382a7: Run `/research` in a subagent so the parent chat keeps the takeaway, not the search trail.

## 1.2.3

### Patch Changes

- 5aefd0a: Grill lists discrete options one per line and restates the settled list.
  The plan keeps that list; each PR includes a briefing an outsider can implement from.

## 1.2.2

### Patch Changes

- 7181b3d: Write research notes and document pages in the project's language (default English), not the chat or `.briefback/` files.

## 1.2.1

### Patch Changes

- a3d0e8c: Make code-review reply with what it fixed and leftover problems in plain language, not a keep/shrink/burn form.

## 1.2.0

### Minor Changes

- 476576d: Add `/document` to turn research, a plan, or a shipped change into a project
  page, then remove the packaged `.briefback/` working files.

### Patch Changes

- fe9149a: Disclose a reuse-hunt prompt from code-review when an existing API may live outside the parent read.

## 1.1.5

### Patch Changes

- 1a2ecfe: Drop the repeated Grill confirmation line, and say optional steps can be skipped so review stays in the loop.

## 1.1.4

### Patch Changes

- e1b02d9: After Grill confirmation, continue the loop: plan when the work needs more than one slice, otherwise implement. Do not wait for the user to pick the next skill.
- b3c630d: Fix the README skill table: research saves notes for a later chat, and tdd is one red-green slice, not one PR.

## 1.1.3

### Patch Changes

- f6be225: Rewrite the code-review skill as a parent-led review: unfixed findings are a
  problem heading plus the change to make, not a keep / shrink / burn label.
  Strip vendor-specific jargon from the other skills so they read the same in
  any project.

## 1.1.2

### Patch Changes

- 33bf112: Replace BRIEFBACK.md on init and update instead of failing when a copy already exists.
- 33bf112: Bugfixes

## 1.1.1

### Patch Changes

- 9cfa7c2: Install all skills first with `--skill '*'`, then ask about BRIEFBACK.md and the
  AGENTS.md pointer.
- 9cfa7c2: Sharpen skill descriptions for model invocation and align handoff and
  code-review with the Briefback loop.

## 1.1.0

### Minor Changes

- 2638741: Add interactive first-time setup, delegate skill installation choices to the
  skills CLI, install a concise workflow reference for coding agents, and leave
  `.briefback/` version control policy to each project.

### Patch Changes

- 2638741: Let `briefback update` initialize projects that do not have Briefback yet.

## 1.0.0

### Major Changes

- ee821e8: Briefback 1.0.0

### Minor Changes

- ee821e8: Publish the first Briefback CLI and reusable skill collection.
