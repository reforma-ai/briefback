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
Read the current plan and latest handoff when present; otherwise use the
confirmed reading in chat. Proceed through the agreed plan unless the user
limits the scope, for example to Stage 1. Start unfinished stages with completed
dependencies; preserve written order when dependencies are absent unless
independence is established. Load [references/tdd.md](references/tdd.md) only
when the user or project requires test-first work.

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
  record landed commit hashes with a short description and what was checked
  under the relevant stage.
- Settle decisions before implementation. Use Plan only when sequencing, scope
  tracking, or handoff needs a durable artifact. A stage is a verification,
  review, and commit boundary, not necessarily a pull request or release. Mark
  Complete after those checks and its separate commit (or staging per project
  rules), excluding unfinished changes from other stages.
- Existing docs and old `.briefback/` notes are claims, not facts. Check what
  the work depends on against code, config, or a command. A claim about what
  exists loses to the code. A plan, settled decision, or requirement says what
  should exist: code that lacks it is work to do, not a wrong note; tell the
  user if that changes the work. Mark a claim you could not check as unverified;
  do not present it as true or discard it as false. A check result holds only
  for the state it ran on: after later edits, rerun it or call it stale.
- Your closing report says what you ran and saw, what stayed unchecked, and
  anything skipped or deferred. A review's return keeps its own format.
- A settled decision that will keep shaping work in other areas after this one
  ends is a durable decision: keep its reason and when to revisit it with the
  decision.
- A stage that writes or changes tests follows
  [references/testing.md](references/testing.md), test-first or not. Tell any
  worker that writes tests to read it.
- A phase may route to the next phase when its own completion rules say so.
  Read the next reference at that point, not earlier.

## Coordinate execution

The parent owns scope, assignments, integration, plan updates, and commits.
Choose direct work or subagents, sequentially or concurrently, when gains in
speed, quality, or token use outweigh coordination costs. Follow mode-specific
isolation rules; work directly when subagents are unavailable. Do not split work
just to distribute it.

Give workers the outcome, relevant decisions, owned changes, and checks; collect
concise results and blockers without duplicating their work. Parallelize ready
stages or independent tasks within a stage only with compatible edits and shared
contracts. Separate concurrent writers' ownership or workspaces, and sequence
overlapping edits, including review fixes. Integrate and verify a stage's combined
result before review.

A worker writes only the files its assignment names. A shared file (the plan, a
project page, an index) has one owner, usually the parent. Before editing a
shared file, re-read it and change it in place, keeping other people's text; if
it changed meanwhile, re-read and redo the edit. When several chats share one
plan file, re-read it and mark the stage you take (who or which branch)
before starting; clear the mark at Complete. The mark is visible only within
one checkout: across worktrees or branches, the parent or the user assigns
stages.

Resolve routine blockers. Retry a stalled or failed worker once with the reason,
then change the approach, reassign, or report it. Start newly ready work without
waiting for unrelated workers. Return scope or product decisions to the user
while continuing unaffected authorized work; stop when that scope is complete
or further progress needs user input.
