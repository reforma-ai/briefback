# Handoff

Use this when unfinished work will continue in a fresh chat. Write a file the
next chat can attach. The handoff, plus the plan when one exists, is the durable
source of truth.

Loop: [Briefback](../SKILL.md), plus repo-root `BRIEFBACK.md` when present.

## Steps

1. **Find the context.** Use the plan the user named, the last handoff, or the
   confirmed reading in this thread. A plan is optional.
2. **Current work.** For stages changed in this context or still active, record
   what shipped (paths, commit hashes), remaining work, and verification/review
   status. For active workers, record ownership, workspace or branch, and how to
   collect their results. If they cannot continue across the handoff, collect or
   stop them and record their unfinished changes before transferring ownership.
3. **Bleed.** Work that belongs to a later stage but landed, or should have.
   Fold it into the plan when one exists: update tasks, completion, and
   dependencies to match reality. Only mark stages Complete after verification,
   review, and commit (or staging per project rules). Do not leave the next chat
   to discover leftover files.
4. **Next work.** Preserve the user's authorized scope. List unfinished stages
   ready to resume or start, their done-when, dependencies, and any blockers.
   Distinguish active assignments from unassigned work to avoid duplicate workers.
5. **Write** `.briefback/<slug>/handoff.md` (create dirs). Reuse the same slug
   for the feature so the next chat overwrites this file. Not OS temp.
6. **Print** the path and what the fresh chat should attach.

Redact secrets. Do not paste diffs or long spec bodies — point at paths.

If the user passed a focus, use it to select the next work without widening the
authorized scope. Resume only work whose dependencies are complete; a handoff
does not authorize starting blocked or out-of-scope stages.

## File

```markdown
# Handoff: <slug>

> Next chat: read this file and the plan when present. Resume within the
> authorized scope, respecting dependencies and existing worker ownership.
> Do not resurrect discarded approaches from a chat summary.

## Plan

path: <file the next chat can open | none>
sync: updated | unchanged | not used
scope: <confirmed reading; required when path is none>

## Authorized scope

<agreed plan, or the user's narrower stage/task limit>

## Current work

<repeat per stage changed in this context or still active>
stage: <title>
status: <implementation, verification, review, and commit progress>
shipped: <paths, commit hashes if any>
remaining: <unfinished work and blockers | none>
worker: <active owner, workspace/branch, and how to collect results | none>

## Bleed

<what leaked into / out of later stages, and how the plan changed>
none

## Next work

<repeat per ready stage within the authorized scope>
stage: <title>
depends on: <completed prerequisites | none>
done when: <criterion>
assignment: <resume existing worker | unassigned>
suggested: Briefback tdd / review, plus project craft skills for the next slice
```

## Done

Handoff is complete when `.briefback/<slug>/handoff.md` exists, the plan matches
what shipped when one exists, active ownership and authorized next work are
clear, and the printed path is what the fresh chat should attach.
