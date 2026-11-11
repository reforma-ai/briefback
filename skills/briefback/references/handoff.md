# Handoff

Use this when unfinished work will continue in a fresh chat. Write a file the
next chat can attach. The handoff, plus the plan when one exists, is the durable
source of truth.

Loop: [Briefback](../SKILL.md), plus repo-root `BRIEFBACK.md` when present.

## Steps

1. **Find the context.** Use the plan the user named, the last handoff, or the
   confirmed reading in this thread. A plan is optional.
2. **Current work.** Record changed or active stages, shipped paths and commits,
   pending checks, and remaining work. Include active workers' ownership,
   workspaces, and how to collect results. Collect or stop workers that cannot
   continue, preserving unfinished changes before transferring ownership.
3. **Bleed.** Work that belongs to a later stage but landed, or should have.
   Update the plan's tasks, dependencies, and completion to match reality.
4. **Next work.** List ready work within the authorized scope, its done-when,
   and existing assignments. Include blockers on remaining work.
5. **Write** `.briefback/<slug>/handoff.md` (create dirs). Reuse the same slug
   for the feature so the next chat overwrites this file. Not OS temp.
6. **Print** the path and what the fresh chat should attach.

Redact secrets. Do not paste diffs or long spec bodies — point at paths.

Use any user-specified focus within the authorized scope. Resume under the
skill's dependency and execution rules.

## File

```markdown
# Handoff: <slug>

> Next chat: read this file and the plan when present. Resume within the
> authorized scope, respecting dependencies and existing worker ownership.
> Do not resurrect discarded approaches from a chat summary.

## Plan

path: <file the next chat can open | none>
sync: updated | unchanged | not used
scope: <authorized plan/stages; confirmed reading when path is none>

## Current work

<repeat for changed or active stages>
stage: <title and progress>
shipped: <paths, commit hashes if any>
remaining: <work, pending checks, and blockers | none>
worker: <active owner, workspace/branch, and how to collect results | none>

## Bleed

<what leaked into / out of later stages, and how the plan changed>
none

## Next work

<repeat per ready stage>
stage: <title>
done when: <criterion>
assignment: <resume existing worker | unassigned>
suggested: Briefback tdd / review, plus project craft skills for the next slice
```

## Done

Print the handoff path once the plan is current and scope, active ownership,
and next work are clear.
