# Workflow and modes

[Back to the README](../README.md) · [Installation](installation.md)

Briefback installs as one skill. Describe your task in ordinary language; the agent selects the relevant mode and follows the workflow from there.

For work larger than a quick fix, it starts at the earliest necessary phase. Research gathers missing context, Grill settles open decisions, and a plan preserves the sequence when the work needs several stages.

You can also request a specific mode directly, in ordinary language or with an explicit command.

| Mode | What it does | Optional command |
| --- | --- | --- |
| Research | Saves findings that should survive the current chat | `/briefback research` |
| Grill | Works through assumptions and open decisions with you | `/briefback grill` |
| Plan | Records an ordered sequence of implementation stages | `/briefback plan` |
| TDD | Works through one red-green slice at a time | `/briefback tdd` |
| Review | Reviews and refactors a stage, then fixes defects | `/briefback review` |
| Handoff | Saves the context needed to continue in another chat | `/briefback handoff` |
| Document | Turns research, a plan, or a shipped change into a project page | `/briefback document` |

Requests such as “Research authentication first,” “Review the changes,” or “Save a handoff for a fresh chat” select the same modes. “Continue” resumes the first unfinished stage from the current plan or handoff.

## The loop

Use the loop for work larger than a quick fix. Skip research when the area is already understood. Plan is for work whose sequence needs a durable artifact; obvious work can go from Grill straight to implementation. Settle decisions before implementation, then review each completed stage before moving on.

1. The agent learns how the area works, if needed.
2. Grill sharpens the task with you.
3. The agent plans stages when the sequence needs a durable artifact.
4. The agent implements one stage.
5. The agent reviews that stage, usually in a subagent.
6. The agent checks the final diff and commits the stage.
7. The agent saves a handoff when work moves to a fresh chat.
8. The agent documents the result when requested.

The agent repeats implementation, review, and commit until the confirmed scope is complete.

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

The plan keeps the settled Grill decisions and divides the feature into coherent implementation stages. A stage has one clear outcome and a practical check; it is not a quota of files or lines, and it does not need to be an independently deployable release. One real pull request may contain several stages. Each stage records why it exists, its outcome, and which files it expects to change, so a fresh chat can pick it up without replaying the Grill conversation.

Lower-level work often comes first: behavior-preserving refactoring, shared types, backend work, then the interface that uses them. That is a common sequence, not a template. Substantial backend and frontend changes normally stay in separate stages; a small, tightly coupled vertical change can stay together. Feature-local wiring should remain with the interface that first needs it.

The agent keeps the plan current as the work changes.

### 4. Implement one stage

The agent implements and verifies the first unchecked stage, then sends it through review. Without a plan, it uses the confirmed reading and keeps the current stage small enough to review. The saved plan and handoff let work resume in a fresh chat. For test-first work, the agent follows the TDD mode.

The agent loads relevant skills named in `AGENTS.md`. If implementation spills into a later stage, it updates the plan when one exists instead of quietly expanding the current one.

Before review, the agent updates `plan.md` when one exists. It checks off the stage only after its checks pass, then records any scope changes that affect later work.

### 5. Run an agent review

Review normally runs in a subagent with the context of what changed and why. If the client cannot launch one, the main agent reviews the stage. The reviewer fixes defects and makes behavior-preserving refactors when the structure needs them. That may include coordinated changes across several files. If the code is already well-shaped, the assessment says so instead of manufacturing a refactor. Concrete improvements outside the safe review scope return as follow-ups; product and contract calls return as decisions.

### 6. Review and commit

The agent checks the final diff and commits the stage through the project's normal workflow.

### 7. Refresh the context

When unfinished work moves to a fresh chat, the agent saves a handoff with what shipped, what changed, and which stage comes next.

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
first unfinished stage rather than restarting the feature. Local CLI setup
state lives separately at `.briefback/config.json`.

The installed skill's [mode references](../skills/briefback/references/) define
the agent instructions. [BRIEFBACK.md](../BRIEFBACK.md) sequences the project
workflow; it is managed by the CLI in consuming projects.
