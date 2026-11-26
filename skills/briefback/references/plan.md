# Plan

Write **one** plan another developer or agent can pick up without this chat.

Open decisions → read [grill.md](grill.md), then resume once settled.
When Plan was selected automatically, obvious work that fits one or two compact
stages can keep the settled reading in chat and follow Grill's next-step rules.
An explicit Plan request still writes a plan. Do not implement.

## Where

- **Native planner** (built-in plan UI): plan artifact / reply only. No
  `.briefback/` files.
- **Otherwise:** `.briefback/<slug>/plan.md` (kebab-case from the feature;
  reuse the slug). Print the path.
- A plan file already on the branch: update that file.

## Shape

```markdown
# <Feature>

> Keep this plan current during implementation.
> Check off tasks as their outcomes are completed.
> Check a stage only after done-when, verification, review, and commit
> (or staging per project rules).
> Record scope changes before leaving the stage.
> Record landed commits and their checks under the stage they implement.

**Goal:** one sentence
**Approach:** 2–3 sentences — how the pieces fit

**Decisions**

- <settled grill answer>
- <settled grill answer>

**Reuse:** existing APIs this plan calls (`path`)

## Out of scope

- <settled no>

## Stage 1 — <title>

**Depends on:** None.

**This stage:** 2–4 sentences for someone who was not in this chat. Why this
stage exists, what coherent outcome it reaches, and which settled decisions it
encodes. Not a file list.

- [ ] Complete
  - [ ] <outcome>
  - [ ] <outcome>

**Files**

- `path` — `symbol`: what changes
- `path` — create: cannot live in `existing` because <reason>

**Done when:** <one observable sentence>
**Verify:** `<command>`
**Commits:** None yet.

## Stage 2 — <title>

**Depends on:** Stage 1.

**This stage:** …

- [ ] Complete
  - [ ] <outcome>

**Files**

- `path` — `symbol`: what changes

**Done when:** …
**Verify:** `<command>`
**Commits:** None yet.
```

Nested tasks are progress; a checked child does not complete the stage.

## Dependencies and delegation

**Depends on** lists actual prerequisite stages or `None`, without cycles.
Number prerequisites before dependents. Expose independent stages; do not chain
them by default. Define shared contracts and ownership in **Files** and tasks.
Within a stage, identify useful
parallel assignments and their combined verification. Keep tightly coupled work
together; no extra stages or scaffolding just for parallelism.

## Keep current

Keep the plan current as workers report. Under **Commits**, record each landed
or partial commit on one line: hash, summary, `checked:` commands and results
(or `none`), plus `not checked:` for material gaps. Do not copy logs. Keep
`None yet.` until a commit exists.

## Stage boundaries

Each stage has one coherent, verifiable outcome and leaves the repo internally
consistent. It need not be independently shippable or a separate PR. Do not add
temporary production mocks, adapters, paths or scaffolding just to ship an
intermediate stage.

## Slicing

- Slice by outcome, dependency, and reviewability — not by file count.
- Substantial changes in distinct areas such as backend and frontend normally
  get separate stages when each has a clear review boundary.
- Combine areas only when the cross-area work is minor relative to the feature,
  tightly coupled, and clearer to review together, or when splitting would
  require disposable production scaffolding.
- Give a foundation its own stage only when it is independently useful,
  reusable by another consumer, meaningfully reduces risk, or needs separate
  verification.
- Split work when it contains distinct outcomes, independent architectural
  decisions, substantially different verification, or too much context for one
  reliable implementation pass.
- Task count is a warning that a stage may be too large, not an automatic reason
  to split it.
- For risky repetitive work, verify and review one pilot before starting the
  rest. Parallelize independent targets.

## Rules

- Ground every stage in the files listed under it. A cited path exists, or it is
  `create`.
- One approach. No menu, no TBD, no “handle edge cases”, no “similar to Stage n”.
- **Decisions** is one bullet per settled grill answer: what we will do.
  Keep durable decisions with their reason and revisit condition. **Out of
  scope** is the settled nos; discard other options.
- **This stage** applies the decisions that bind this stage. An agent who never
  saw the grill should understand the job from **Decisions** plus this
  paragraph, the tasks, and the files.
- **Reuse** names the APIs to call. Tasks name outcomes, not a procedure.
  **Files** name the `symbol` in `path`.
- Files are edits. A `create` line names the existing file it cannot join.
  A one-call helper, pass-through, barrel, or mapping-only test belongs at the
  call site.
- **Done when** is one observable sentence. **Verify** is the command to run.

## Self-check

Check the rules above. Every settled answer maps to a stage or **Out of scope**.
A new agent can complete each stage from the plan alone.

## Output

Print the path. Implementation starts only when authorized and follows the
skill's execution rules.
