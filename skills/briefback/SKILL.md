---
name: briefback
description: >-
  Always use for software work larger than a quick fix, even when the user does
  not mention Briefback. Follow the ordered delivery loop: Research → Grill →
  Plan → Stage → Review → Commit, skipping only phases whose entry conditions
  are already satisfied and repeating Stage → Review → Commit until the work is
  done.
  Also use when the user invokes Briefback, requests one of its modes, or project
  guidance requires it. Route natural-language requests to the matching mode and
  load only that mode's reference. Do not use for ordinary quick fixes.
license: MIT
---

# Briefback

One entrypoint for an ordered development loop:

```text
Research → Grill → Plan → Stage → Review → Commit
                          ↑                   │
                          └── Ready stages ─┘
```

## Default behavior

Do not wait for an explicit `/briefback` invocation. For any software change
larger than a quick fix, load Briefback, identify the earliest necessary phase,
and follow the loop from there. The task itself is enough to activate the skill.

The user's words choose the mode; exact command syntax is optional. A request
to “research this first” routes to Research, and “let's grill it” routes to
Grill. Read only the selected reference before acting. Do not preload every
mode.

## Modes

| Mode | Use when | Read |
| --- | --- | --- |
| `research` | An unfamiliar area needs a durable map | [references/research.md](references/research.md) |
| `grill` | Product, scope, or architecture decisions are still open | [references/grill.md](references/grill.md) |
| `plan` | Decisions are settled and work needs a durable sequence of stages | [references/plan.md](references/plan.md) |
| `tdd` | One implementation slice should proceed test-first | [references/tdd.md](references/tdd.md) |
| `review` | A completed stage needs review, refactoring, and fixes | [references/review.md](references/review.md) |
| `handoff` | Unfinished work is moving to a fresh context | [references/handoff.md](references/handoff.md) |
| `document` | Finished work should become durable project documentation | [references/document.md](references/document.md) |

Accept `code-review` as an alias for `review`. Commands may include a target or
brief in the same request, such as `$briefback research authentication` or
`/briefback review the current diff`.

`continue` and `implement` resume delivery rather than load another playbook.
Read the current plan and latest handoff when they exist, then implement only
the authorized scope. An instruction to proceed covers the agreed plan unless
the user limits it, for example to Stage 1. Select unfinished stages whose
dependencies are complete; independent stages may run concurrently. For older
plans without explicit dependencies, preserve their written order unless
independence is established from the work. Without a plan, use the confirmed
reading from the conversation or handoff. Load
[references/tdd.md](references/tdd.md) only when the user or project requires
test-first work.

## Routing

- An explicit mode wins. Read its reference and follow it.
- A clearly implied mode is equivalent to an explicit one. Do not ask the user
  to repeat the request as a command.
- A request to run the whole workflow starts at the earliest necessary phase.
  Skip Research when the area is already understood. Skip Plan when the work is
  obvious enough to hold in the conversation, including one or two compact
  stages across multiple areas. Load later references only when their phase
  begins.
- With no mode or actionable request, inspect the conversation and existing
  `.briefback/` artifacts, then recommend the next mode. Do not begin a
  substantial phase merely because it might be useful.
- If two modes genuinely fit and lead to different immediate work, ask one
  short question. Otherwise choose the narrower mode.

## Shared rules

- Follow the nearest project guide (`AGENTS.md` or equivalent).
- Preserve the user's scope and authority. A mode changes the method, not what
  actions are authorized.
- Keep research, plans, and handoffs under one
  `.briefback/<feature>/` slug so later phases can find them.
- Keep an existing plan current throughout implementation: check off tasks as
  their outcomes are completed, reopen or revise them when work changes, and
  record landed commit hashes with a short description under the relevant stage.
- Settle decisions before implementation. Use Plan only when sequencing, scope
  tracking, or handoff needs a durable artifact. Each stage keeps its own
  verification, review, and commit boundary, including when stages overlap in
  time. A stage is not necessarily a pull request or release.
- A phase may route to the next phase when its own completion rules say so.
  Read the next reference at that point, not earlier.

## Coordinate execution

The parent agent owns the agreed scope, dependencies, plan updates, integration,
and commits. Choose direct execution, one subagent, or several subagents based
on the task. Delegate or parallelize when it can improve speed through
independent work, quality through focused investigation or a fresh review, or
token use through narrow contexts and concise returns. Weigh those gains
against briefing, duplicated investigation, and integration costs. Sequential
delegation can help too. Do not split work merely to create more agents; use
direct execution when coordination adds no value. Follow each mode's isolation
rules and use direct execution when the client cannot launch subagents.

For each assignment, provide the intended outcome, relevant settled decisions,
owned changes, dependencies, and verification. Ask for changed paths, check
results, and blockers. Keep the parent's context focused on decisions and
results rather than copying each worker's investigation. Do not duplicate a
worker's implementation while it is assigned.

Run independent ready stages, or independent tasks within a complex stage,
concurrently only when their edits and shared contracts are compatible. Give
concurrent writers separate ownership or isolated workspaces; serialize
overlapping edits, including review fixes. Within a stage, integrate all task
results and verify the combined result before stage review.

Accept results against the assignment and resolve routine blockers. Revise or
reassign work when the approach stalls; return product decisions or changes to
the agreed scope to the user. As each stage passes verification and review,
commit it separately, excluding unfinished work from other stages, then record
its hash and a short description in the plan when present. Mark Complete only
after that cycle (or staging per project rules). Dependencies become ready at
that point. Start newly ready work without waiting for unrelated workers. When
a branch needs user input, continue other authorized work that does not depend
on that decision. Stop when the authorized scope is complete or no further
progress is possible without user input.
