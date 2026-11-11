# Workflow and modes

[Back to the README](../README.md) · [Installation](installation.md)

Briefback installs as one skill. Describe your task in ordinary language; the agent selects the relevant mode and follows the workflow from there. You do not need to name Briefback to activate it for substantial work.

For work larger than a quick fix, it starts at the earliest necessary phase. Research gathers missing context, Grill settles open decisions, and a plan preserves the sequence when the work needs several stages.

You can also request a specific mode directly, in ordinary language or with an explicit command.

| Mode | What it does | Optional command |
| --- | --- | --- |
| Research | Saves findings that should survive the current chat | `/briefback research` |
| Grill | Works through assumptions and open decisions with you | `/briefback grill` |
| Plan | Records implementation stages, dependencies, and work boundaries | `/briefback plan` |
| TDD | Works through one red-green slice at a time | `/briefback tdd` |
| Review | Reviews and refactors a stage, then fixes defects | `/briefback review` |
| Handoff | Saves the context needed to continue in another chat | `/briefback handoff` |
| Document | Turns research, a plan, or a shipped change into a project page | `/briefback document` |

Requests such as “Research authentication first,” “Review the changes,” or “Save a handoff for a fresh chat” select the same modes. “Continue” resumes unfinished work with completed dependencies from the current plan or handoff, within your authorized scope.

## The loop

Use the loop for work larger than a quick fix. Skip research when the area is already understood. Plan is for work whose dependencies and progress need a durable artifact; obvious work can go from Grill straight to implementation. Settle decisions before implementation, then verify, review, and commit each stage before its dependents start.

1. The agent learns how the area works, if needed.
2. Grill sharpens the task with you.
3. The agent plans stages when the sequence needs a durable artifact.
4. The agent executes ready stages within the authorized scope.
5. The agent reviews that stage, usually in a subagent.
6. The agent checks the final diff and commits the stage.
7. The agent saves a handoff when work moves to a fresh chat.
8. The agent documents the result when requested.

The agent repeats implementation, review, and commit until the authorized scope is complete. Independent work may overlap; each stage keeps its own checks and commit.

> [!TIP]
> Briefback keeps research, plans, handoffs, and local setup state under `.briefback/`.
> Ignore the directory for a private workflow, commit artifacts when the team should share them, or remove working artifacts after the PR. Git and pull requests remain the record of shipped changes.

### 1. Learn how the area works

The agent can inspect the code without creating a research artifact. A prompt such as "Find out how authentication works in this project" may be enough before implementation.

When findings need to survive the chat, the agent investigates in a subagent and writes them to `.briefback/<feature>/research/`. The findings can then be attached after context compaction or in a new chat.

If you skip research, Grill can still surface missing context.

### 2. Sharpen the idea with Grill

The agent starts Grill after research, or immediately when the area is already familiar.

The agent explains its reading of the task, lists the assumptions and open decisions, and recommends an answer for each one. You confirm or correct the list. If an answer creates another important question, Grill keeps going.

Once you confirm the settled decisions, the agent chooses the next phase.

### 3. Plan implementation stages

Planning follows Grill when the work needs durable coordination across several stages, non-obvious dependencies, or a likely context handoff. Work that fits one or two compact stages skips Plan, even when it touches backend and frontend. The confirmed reading stays in the chat, and the agent offers to implement it next.

In a normal chat, Plan writes `.briefback/<slug>/plan.md`. In Native Plan mode, the agent uses the client's planning flow and native plan artifact instead.

The plan keeps the settled Grill decisions and divides the feature into coherent implementation stages. A stage has one clear outcome and a practical check; it is not a quota of files or lines, and it does not need to be an independently deployable release. One real pull request may contain several stages. Each stage records why it exists, its outcome, which files it expects to change, and its prerequisites in `Depends on`, so another agent can pick it up without replaying the Grill conversation.

Dependencies describe actual prerequisites. For example, a shared-contract stage can unblock separate backend and frontend stages, followed by an integration stage that depends on both. Independent stages may run concurrently when their edits and shared contracts are compatible. Within a complex stage, the plan can identify independent task assignments and how to verify their combined result. It does not add stages or temporary scaffolding merely to create parallel work.

Lower-level work often comes first: behavior-preserving refactoring, shared types, backend work, then the interface that uses them. That is a common sequence, not a template. Substantial backend and frontend changes normally stay in separate stages; a small, tightly coupled vertical change can stay together. Feature-local wiring should remain with the interface that first needs it.

The agent keeps the plan current as the work changes.

### 4. Execute authorized stages

When you say “implement it,” the agent works through the agreed plan unless you set a narrower limit, such as “only Stage 1.” It selects unfinished stages whose dependencies are complete. For older plans without explicit dependencies, it preserves their written order unless independence is established. Without a plan, it uses the confirmed reading and keeps the work reviewable. For test-first work, it follows the TDD mode.

The parent agent coordinates scope, assignments, integration, plan updates, and commits. It chooses direct execution, one subagent, or several, sequentially or concurrently. Independent work can improve speed; focused investigation and fresh reviews can improve quality; narrow contexts and concise worker returns can reduce token use. The agent weighs those gains against briefing, duplicated investigation, and integration costs. Parallelism is optional, and delegation can help even when work stays sequential.

Each assignment includes its outcome, relevant decisions, owned changes, dependencies, and checks. Concurrent writers need separate ownership or isolated workspaces, with coordination for shared contracts. Overlapping edits and review fixes are sequenced. The parent integrates and verifies task results together before stage review, without duplicating the workers' implementation.

The agent loads relevant skills named in `AGENTS.md`. If implementation spills into a later stage, it updates the plan when one exists instead of quietly expanding the current one.

The parent updates `plan.md` as tasks finish or scope changes. Workers report progress rather than editing the plan concurrently. A stage's Complete box is checked only after its verification, review, and commit finish (or staging per project rules).

### 5. Run an agent review

Review normally runs in a subagent with the context of what changed and why. If the client cannot launch one, the main agent reviews the stage. The reviewer fixes defects and makes behavior-preserving refactors when the structure needs them. That may include coordinated changes across several files. If the code is already well-shaped, the assessment says so instead of manufacturing a refactor. Concrete improvements outside the safe review scope return as follow-ups; product and contract calls return as decisions.

When subagents are available, the reviewer is separate from the implementer. During concurrent work, the parent provides a stage-specific diff and coordinates fixes that reach another worker's area or change a shared contract.

### 6. Review and commit

The parent checks the final diff and commits each stage separately through the project's normal workflow, excluding unfinished work from other stages. It records each commit's hash and a short description under the stage's `Commits` field when a plan exists, including partial stage commits. Once the stage is complete, newly ready work can start without waiting for unrelated stages.

### 7. Refresh the context

When unfinished work moves to a fresh chat, the agent saves a handoff with what shipped, what remains, the authorized scope, and which stages are ready next. It records active worker ownership and workspaces so the next chat can collect results without duplicating assignments. Workers that cannot continue across the handoff are collected or stopped, with unfinished changes recorded before ownership transfers.

The saved plan, when present, and the handoff let the agent resume implementation in the new chat.

### 8. Archive or document the result

When requested, the agent turns research, a plan, or shipped work into a durable project page. It updates an existing page for that domain when one exists; otherwise it writes to the project's docs tree or `.briefback/docs/<domain>/`. It then removes the packaged `.briefback/<slug>/` working files.

Skip this step when the work does not need a page.

## Artifacts and fresh chats

Keep related work under one feature slug:

```text
.briefback/<feature>/
├── research/
│   └── index.md
├── plan.md
└── handoff.md
```

Create only the artifacts the task needs. Attach the research, plan, or handoff
when moving to a fresh chat, then ask the agent to continue. It resumes the
ready unfinished work within the authorized scope rather than restarting the
feature. Local CLI setup state lives separately at `.briefback/config.json`.

The installed skill's [mode references](../skills/briefback/references/) define
the agent instructions. [BRIEFBACK.md](../BRIEFBACK.md) sequences the project
workflow; it is managed by the CLI in consuming projects.
