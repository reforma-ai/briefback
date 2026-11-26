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
| TDD | Works through one red-green slice at a time, including cases that try to break the code | `/briefback tdd` |
| Review | Reviews and refactors a stage, then fixes defects | `/briefback review` |
| Handoff | Saves the context needed to continue in another chat | `/briefback handoff` |
| Document | Turns research, a plan, or a shipped change into a project page | `/briefback document` |

Requests such as “Research authentication first,” “Review the changes,” or “Save a handoff for a fresh chat” select the same modes. “Continue” resumes unfinished work with completed dependencies from the current plan or handoff, within your authorized scope.

## The loop

Use the loop for work larger than a quick fix. Skip research when the area is already understood. Plan is for work whose dependencies and progress need a durable artifact; obvious work can go from Grill straight to implementation. Settle decisions before implementation, then verify, review, and commit each stage before its dependents start.

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

If the agent must work autonomously, it resolves the same questions itself or
delegates decisions to a subagent. Once settled, it chooses the next phase.

### 3. Plan implementation stages

Planning follows Grill when the work needs durable coordination across several stages, non-obvious dependencies, or a likely context handoff. Work that fits one or two compact stages skips Plan, even when it touches backend and frontend. The settled reading stays in the chat. The agent offers implementation, or continues directly when autonomous and authorized.

In a normal chat, Plan writes `.briefback/<slug>/plan.md`. In Native Plan mode, the agent uses the client's planning flow and native plan artifact instead.

The plan keeps the settled Grill decisions and divides the feature into coherent implementation stages. A stage has one clear outcome and a practical check; it is not a quota of files or lines, and it does not need to be an independently deployable release. One real pull request may contain several stages. Each stage records why it exists, its outcome, which files it expects to change, and its prerequisites in `Depends on`, so another agent can pick it up without replaying the Grill conversation.

Dependencies expose independent work. A shared-contract stage might unblock parallel backend and frontend stages, followed by integration that depends on both. A complex stage can also contain independent assignments with a combined check. Risky repetitive work starts with one verified and reviewed pilot before the rest can run in parallel.

Lower-level work often comes first: behavior-preserving refactoring, shared types, backend work, then the interface that uses them. That is a common sequence, not a template. Substantial backend and frontend changes normally stay in separate stages; a small, tightly coupled vertical change can stay together. Feature-local wiring should remain with the interface that first needs it.

### 4. Execute authorized stages

“Implement it” covers the agreed plan unless you specify a narrower limit, such as “only Stage 1.” The agent selects ready stages and chooses direct, delegated, or parallel execution under the skill's rules. Without a plan, it uses the settled reading. Independent work runs concurrently when it saves time or context. The parent integrates and checks results and starts newly ready work without waiting for unrelated stages.

The agent loads relevant skills named in `AGENTS.md`. If implementation spills into a later stage, it updates the plan when one exists instead of quietly expanding the current one.

The parent keeps `plan.md` current as tasks finish or scope changes. A stage becomes Complete after verification, review, and commit (or staging per project rules). When several chats share a plan, one coordinator assigns the stages.

### 5. Run an agent review

Review normally runs in a subagent with the context of what changed and why. If the client cannot launch one, the main agent reviews the stage. The reviewer fixes defects and makes behavior-preserving refactors when the structure needs them. That may include coordinated changes across several files. If the code is already well-shaped, the assessment says so instead of manufacturing a refactor. Concrete improvements outside the safe review scope return as follow-ups; product and contract calls return as decisions.

### 6. Review and commit

The parent commits each stage separately and records each commit, its checks and material gaps on one line in the plan, when present. Newly ready work can start without waiting for unrelated stages.

### 7. Refresh the context

The handoff records what shipped, what remains, approaches tried and dropped, authorized next work, and any active worker ownership. Attach it with the plan when present so the next chat can resume without duplicating assignments.

### 8. Archive or document the result

When requested, the agent turns research, a plan, or shipped work into a durable project page. It updates an existing page for that domain when one exists; otherwise it writes to the project's docs tree or `.briefback/docs/<domain>/`. It removes the packaged `.briefback/<slug>/` working files when no other chat or worker still uses them.

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
