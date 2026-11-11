# Briefback

Ordered loop for work larger than a quick fix. The `briefback` skill owns every
step and loads only the reference for the current mode. This file sequences the
modes and names artifact paths.

```text
Research → Grill → Plan → Stage → Review → Commit
                          ↑                     │
                          └──── Ready stages ───┘
```

Skip Research when the area is already clear. Use Plan only when sequencing,
scope tracking, or handoff needs a durable artifact. Obvious work that fits one
or two compact stages skips Plan, even when it crosses backend and frontend;
keep the confirmed reading in chat and offer implementation. Run Handoff only
when unfinished work moves to a fresh context. Run Document when the work
should become a project page.

## 1. Research (optional)

Explore the area before proposing the change. Run `briefback research` when
findings must survive this chat. The investigation runs in a subagent.

**Done when:** the agent can name what it will change, or the step was skipped
because that is already known.

Artifacts: `.briefback/<feature>/research/`.

## 2. Grill

Run `briefback grill`. Settle assumptions, scope, and how the result will be
checked.

**Done when:** the user confirmed the settled list and no open decision can
change how the work will be done.

## 3. Plan (larger work)

Run `briefback plan` when the confirmed work needs durable coordination across
several stages, non-obvious dependencies, or a likely context handoff. Compact,
obvious work continues at step 4 without a plan file.

**Done when:** `.briefback/<feature>/plan.md` exists with the settled list and
unchecked stages with explicit dependencies and clear work boundaries, or the
plan was skipped because the confirmed scope is compact and clear in the
conversation. Parallel work is optional; do not split work just to distribute it.

## 4. Execute authorized stages

An instruction to proceed covers the agreed plan unless the user limits it,
such as "only Stage 1". Select unfinished stages whose dependencies are complete
within that scope. Without explicit dependencies in an older plan, preserve its
written order unless independence is established. Without a plan, use the
confirmed reading and keep the work reviewable. Load project craft skills named
in `AGENTS.md`. Run `briefback tdd` for test-first work.

The parent coordinates scope, assignments, integration, plan updates, and commits.
Choose direct work or subagents, sequentially or concurrently, when the benefit
to speed, quality, or token use outweighs coordination costs. Parallelize ready
stages or independent tasks within a stage only with compatible work boundaries
and shared contracts. Integrate task results before verifying and reviewing the
whole stage. Follow the skill's execution rules; do not duplicate assigned work.

The coordinator keeps the plan current as work happens: check off completed
tasks, reopen tasks when needed, and revise remaining work as scope changes.

**Done when:** each implemented stage meets its verification checks and is ready
for review. Its Complete box stays unchecked until review and commit finish.

## 5. Review

Run `briefback review` on the completed stage. The review runs in a subagent
with what changed and why. It fixes defects and performs behavior-preserving
refactors across the affected stage, including multi-file changes. Anything
left unfixed needs a product decision, contract change, unrelated subsystem, or
cannot be verified safely.

Keep each review scoped to its stage. Coordinate review fixes with other active
work so reviewers and implementers do not make conflicting changes.

**Done when:** avoidable production structure is gone, defects are fixed, and
every unfixed problem is in front of the user with how to fix it.

## 6. Commit

Commit each stage separately with the project's normal workflow, excluding
unfinished changes from other stages. When a plan exists, record each landed
commit's hash and a short description under the stage it implements, including
partial stage commits. Mark the stage Complete after verification, review, and
commit (or staging per project rules). Return to step 4 for newly ready work
without waiting for unrelated stages. Continue within the authorized scope;
return to the user for decisions or blockers that need their input.

**Done when:** the stage is committed (or staged per project rules), landed
commits are recorded and Complete is checked in the plan when present, and newly
ready work is identified or the authorized scope is complete.

## 7. Handoff (fresh context)

Run `briefback handoff` before moving unfinished work to another chat. Attach
the plan when present and the handoff there, then resume at step 4.

**Done when:** `.briefback/<feature>/handoff.md` exists, or the current chat
continues without a context move.

## 8. Archive / document (optional)

Run `briefback document` when research, a plan, or a shipped change should
become a project page. It updates the existing domain page when one exists.
Otherwise it writes into the human docs tree, or
`.briefback/docs/<domain>/`, then removes the packaged
`.briefback/<slug>/` working files.

**Done when:** the domain page is current, or the step was skipped.
