# Plan

Write **one** plan another developer or agent can pick up without this chat.

Open decisions → read [grill.md](grill.md), then resume after the user confirms
the reading.
When Plan was selected automatically, obvious work that fits one or two compact
stages can keep the confirmed reading in chat and offer implementation instead.
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
> Record landed commits under the stage they implement.

**Goal:** one sentence
**Approach:** 2–3 sentences — how the pieces fit

**Decisions**

- <confirmed grill answer>
- <confirmed grill answer>

**Reuse:** existing APIs this plan calls (`path`)

## Out of scope

- <confirmed no>

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

**Decisions** is the grill, durable. **This stage** is the briefing for one
implementation and review boundary. Tasks are outcomes. **Files** are the map.

Nested tasks are progress; a checked child does not complete the stage.

## Dependencies and delegation

**Depends on** lists actual prerequisite stages or `None`, without cycles.
Number prerequisites before their dependents. Make ownership and shared contracts
clear through **Files** and tasks so independent stages can run concurrently.
Within a complex stage, identify useful independent assignments and their combined
verification. Keep tightly coupled work together; do not add stages or scaffolding
merely to create parallel work. Execution follows the skill's shared rules.

## Keep current

The coordinator updates the plan as workers report results: check completed
tasks, reopen invalidated work, and revise remaining tasks and dependencies.
Record each landed commit's hash and short description under its stage's
**Commits**, including partial commits. Keep `None yet.` until a commit exists.

## Stage boundaries

Each stage is the smallest coherent, reviewable implementation step with one
clear outcome and a practical way to verify it. A stage is not necessarily a
standalone pull request or independently deployable release. One real pull
request may contain several stages.

Dependencies determine stage order; they do not require each stage to be an
independently deployable release. Do not add temporary mocks, adapters, feature
paths, or scaffolding only to make an intermediate stage shippable. A completed
stage leaves the repository internally consistent and passes verification
relevant to its scope; the overall feature may still need later stages.

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

## Rules

- Ground every stage in the files listed under it. A cited path exists, or it is
  `create`.
- One approach. No menu, no TBD, no “handle edge cases”, no “similar to Stage n”.
- **Decisions** is one bullet per confirmed grill answer: what we will do.
  Discarded options stay out. **Out of scope** is the confirmed nos. Every
  confirmed grill answer lands in one of those two lists.
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

1. Every confirmed grill answer is in **Decisions** or **Out of scope**,
   and has a stage or is named out of scope.
2. Every path exists, or `create` names the existing home it cannot join.
3. A person can open Stage 1, read **Decisions** plus **This stage**, tasks, and
   files, and complete it without this conversation.
4. Each stage boundary makes implementation or review meaningfully clearer; no
   stages are separate only because they touch different layers or many files.
5. A stage that crosses areas keeps the cross-area work minor and tightly
   coupled. Substantial areas with clear review boundaries stay separate.
6. No stage adds temporary production code that a later stage removes only to
   make the intermediate state independently shippable.
7. Every stage leaves the repository internally consistent and passes its
   scoped verification. It need not complete or independently ship the whole
   feature.
8. Dependencies name real prerequisites without cycles. Any concurrent work has
   compatible ownership and contracts, and a way to verify its combined result.

## Output

Print the path. Implementation starts only when authorized and follows the
skill's execution rules.
