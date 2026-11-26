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

Accept `code-review` as an alias for `review`. A request may include a target or brief.

## Routing

- An explicit or clearly implied mode wins. Read only its reference.
- For substantial work, start at the earliest necessary phase without waiting
  for invocation. Skip Research when the area is understood. Skip Plan when
  one or two compact stages fit in chat, even across areas. Load later references
  only when their phase begins.
- `continue` and `implement` resume the current plan and latest handoff, or the
  settled reading in chat. Proceed within authorized scope. Start unfinished
  stages only when dependencies are complete. With no listed dependencies,
  preserve written order unless independence is established. Read
  [references/tdd.md](references/tdd.md) when test-first work is required.
- Neither actionable request nor mode → inspect the conversation and `.briefback/`
  artifacts, then recommend a mode without starting it.
- If two modes fit and change the immediate work, ask one question; otherwise
  choose the narrower mode.

## Shared rules

- Follow the nearest project guide and load relevant skills it names. A mode
  does not expand the user's authorized scope.
- Keep research, plans and handoffs under one `.briefback/<feature>/` slug.
- Settle decisions before implementation. A stage is a verification, review and
  commit boundary, not necessarily a release or PR. Verify and review each stage
  before its separate commit (or staging per project rules), excluding unfinished
  work from other stages. Only then mark Complete.
- Keep the plan current: check off completed outcomes, reopen or revise changed
  work, and record commit hashes, descriptions and checks under their stage.
- Verify relevant claims about existing behavior in docs and old notes against
  code, config or commands. Trust the code for current behavior; follow agreed
  requirements for intended behavior. Tell the user if divergence changes the
  work. Mark unchecked claims unverified. After edits, rerun affected checks or
  mark them stale.
- Closing report: outcome, check results and material gaps in a few lines. Do not
  repeat the plan, worker reports or logs. Review uses its own format.
- Keep durable decisions (those shaping other areas later), with why and when
  to revisit them.
- Read [references/testing.md](references/testing.md) before writing or changing
  tests, test-first or not. Tell workers writing tests to do the same.

## Coordinate execution

The parent owns scope, assignments, integration, plan updates and commits.
Prefer concurrent execution of ready independent work when it improves speed,
quality or context use. Work directly when delegation adds overhead or is unavailable.
Follow mode-specific isolation rules.

Settle shared contracts before launching compatible stages or assignments
together. Give workers a short brief: outcome, decisions, owned files and checks.
Collect only results, changed paths, checks and blockers. Do not redo their work.
While workers run, do independent work. As each stage's assignments finish,
integrate, verify, review and commit that stage, then start newly ready work.
Do not wait for unrelated workers.

One writer per file; separate overlapping work into workspaces or sequence it,
including review fixes. The parent owns shared files; reread before editing and
preserve concurrent changes. One parent or user assigns stages across chats and
worktrees. Workers edit only assigned files.

Resolve recoverable blockers; otherwise change approach, reassign or report.
Return scope or product decisions to the user while continuing unaffected work.
Stop when authorized scope is complete or further progress needs user input.
