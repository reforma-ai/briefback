# Briefback

**Website:** [briefback.reforma.run](https://briefback.reforma.run)

Just describe what you want to build or change. Briefback guides your coding agent from research to reviewable code, choosing the next step as the task unfolds.

Grill is the core: the agent investigates the code, challenges assumptions, and works through open decisions with you until you share a clear understanding of the task. After you confirm the decisions, it plans when needed, then implements and reviews one coherent stage at a time.

<p align="left">
  <a href="https://www.npmjs.com/package/@reforma/briefback"><img src="https://img.shields.io/npm/v/@reforma/briefback.svg" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@reforma/briefback.svg" alt="MIT License"></a>
  <a href="https://www.skills.sh/reforma-ai/briefback"><img src="https://skills.sh/b/reforma-ai/briefback" alt="skills.sh"></a>
</p>

<p align="center">
  <img src="assets/banner.png" alt="Briefback — an opinionated workflow for coding agents" width="100%">
</p>

```text
Research → Grill → Plan → Stage → Review → Commit
                          ↑                   │
                          └───── Repeat ─────┘
```

```bash
npx @reforma/briefback init
```

During setup, choose your coding agent (Codex, Claude Code, Cursor, or another supported agent) and whether to add project workflow docs. Then give the agent a task in ordinary language.

## Why

An open-ended prompt is enough for a tiny change. On larger work, scope and decisions can disappear into chat history. The agent may miss edge cases or keep building on a wrong assumption, especially after a fresh chat.

Briefback combines the best of Grill and spec-driven development. Six months of shipping real PRs with agents shaped three constraints:

- **Reach a shared understanding before coding.** Grill makes the agent explain its reading of the task, challenge assumptions, and surface decisions you may not have considered. You can correct the approach before it becomes an implementation.
- **Start with the task.** Describe what you need in ordinary language. The agent chooses the relevant phases and carries the workflow, including research and clarification when needed.
- **Keep each stage reviewable.** A plan preserves the sequence when work needs durable coordination. The agent implements and reviews one coherent stage before moving on, keeping scope manageable across long tasks and fresh chats.

## One skill, seven modes

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

## 🔄 The loop

You can skip research. Plan is for work whose sequence needs a durable artifact; obvious work can go from Grill straight to implementation.

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

### 🔍 1. Learn how the area works

The agent can inspect the code without creating a research artifact. A prompt such as "Find out how authentication works in this project" may be enough before implementation.

When findings need to survive the chat, the agent investigates in a subagent and writes them to `.briefback/<feature>/research/`. The findings can then be attached after context compaction or in a new chat.

If you skip research, Grill can still surface missing context.

### 🔥 2. Sharpen the idea with Grill

The agent starts Grill after research, or immediately when the area is already familiar.

The agent explains its reading of the task, lists the assumptions and open decisions, and recommends an answer for each one. You confirm or correct the list. If an answer creates another important question, Grill keeps going.

Once you confirm the settled decisions, the agent chooses the next phase.

### 🗂️ 3. Plan implementation stages

Planning follows Grill when the work needs durable coordination across several stages, non-obvious dependencies, or a likely context handoff. Work that fits one or two compact stages skips Plan, even when it touches backend and frontend. The confirmed reading stays in the chat, and the agent offers to implement it next.

In a normal chat, Plan writes `.briefback/<slug>/plan.md`. In Native Plan mode, the agent uses the client's planning flow and native plan artifact instead.

The plan keeps the settled Grill decisions and divides the feature into coherent implementation stages. A stage has one clear outcome and a practical check; it is not a quota of files or lines, and it does not need to be an independently deployable release. One real pull request may contain several stages. Each stage records why it exists, its outcome, and which files it expects to change, so a fresh chat can pick it up without replaying the Grill conversation.

Lower-level work often comes first: behavior-preserving refactoring, shared types, backend work, then the interface that uses them. That is a common sequence, not a template. Substantial backend and frontend changes normally stay in separate stages; a small, tightly coupled vertical change can stay together. Feature-local wiring should remain with the interface that first needs it.

The agent keeps the plan current as the work changes.

### 🛠️ 4. Implement one stage

The agent implements and verifies the first unchecked stage, then sends it through review. Without a plan, it uses the confirmed reading and keeps the current stage small enough to review. The saved plan and handoff let work resume in a fresh chat. For test-first work, the agent follows the TDD mode.

The agent loads relevant skills named in `AGENTS.md`. If implementation spills into a later stage, it updates the plan when one exists instead of quietly expanding the current one.

Before review, the agent updates `plan.md` when one exists. It checks off the stage only after its checks pass, then records any scope changes that affect later work.

### 🤖 5. Run an agent review

Review normally runs in a subagent with the context of what changed and why. If the client cannot launch one, the main agent reviews the stage. The reviewer fixes defects and makes behavior-preserving refactors when the structure needs them. That may include coordinated changes across several files. If the code is already well-shaped, the assessment says so instead of manufacturing a refactor. Concrete improvements outside the safe review scope return as follow-ups; product and contract calls return as decisions.

### ✅ 6. Review and commit

The agent checks the final diff and commits the stage through the project's normal workflow.

### 🔄 7. Refresh the context

When unfinished work moves to a fresh chat, the agent saves a handoff with what shipped, what changed, and which stage comes next.

The saved plan, when present, and the handoff let the agent resume implementation in the new chat.

### 📚 8. Archive or document the result

When requested, the agent turns research, a plan, or shipped work into a durable project page. It updates an existing page for that domain when one exists; otherwise it writes to the project's docs tree or `.briefback/docs/<domain>/`. It then removes the packaged `.briefback/<slug>/` working files.

Skip this step when the work does not need a page.

## 📦 Install

### CLI

```bash
npx @reforma/briefback init
```

`init` installs the Briefback skill through the `skills` CLI, which asks for the target agents, scope, and installation method. Briefback then asks whether to set up project docs. If you choose yes, it writes `BRIEFBACK.md` and adds this pointer to `AGENTS.md`:

```text
Larger than a quick fix: follow @BRIEFBACK.md.
```

Do not edit `BRIEFBACK.md` by hand. `init` and `update` replace it.

Update the installed workflow:

```bash
npx @reforma/briefback@latest update
```

After setup, `update` runs without prompts and refreshes only the parts selected during initialization. If Briefback is not installed yet, it starts the same setup as `init`.

Other useful forms:

```bash
npx @reforma/briefback init --global --agent cursor
npx @reforma/briefback init --yes
npx skills add reforma-ai/briefback --skill briefback
```

### Agent plugin

The portable Agent Plugin installs the same skill as one package. It reads it directly from `skills/`; there is no generated copy or separate plugin build. Use the CLI above when Briefback should also configure project docs and `BRIEFBACK.md`.

For Claude Code:

```bash
claude plugin marketplace add reforma-ai/briefback
claude plugin install briefback@briefback
```

For Codex and ChatGPT:

```bash
codex plugin marketplace add reforma-ai/briefback
```

Then install **Briefback** from the Plugins Directory. If your Codex CLI does not recognize `codex plugin`, update Codex or use the CLI installation.

Cursor supports the portable root manifest. Install Briefback from **Customize** when it is available in your marketplace; until then, use the CLI installation to add the same skill to Cursor.

Direct skill installs expose `/briefback` or `$briefback`, depending on the
agent. Claude Code namespaces the plugin copy as `/briefback:briefback`.

## ⚖️ How it compares

[OpenSpec](https://github.com/Fission-AI/OpenSpec) keeps a proposal, specs, design, and tasks under each proposed change. Briefback uses Grill to settle decisions and writes a plan when the work needs durable coordination.

[Spec Kit](https://github.com/github/spec-kit) has a spec-driven feature flow through a project constitution, specification, plan, tasks, implementation, and convergence. Briefback starts from an ordinary task and selects phases as needed.

An unstructured chat is still the shortest path for a small fix. Briefback starts to pay for itself when a change spans decisions, reviewable slices, or more than one context window.

## 🔗 Related project

Need better prose alongside the development workflow? [Prosecraft](https://github.com/reforma-ai/prosecraft) provides skills for humanizing drafts, writing technical documentation and UI copy, and creating agent skills.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for packaging and release steps.

## 📄 License

Briefback is available under the [MIT License](LICENSE).

## 👤 Maintainer

Maintained by [@kachurun](https://github.com/kachurun).
