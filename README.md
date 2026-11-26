# Briefback

<p align="left">
  <a href="https://www.npmjs.com/package/@reforma/briefback"><img src="https://img.shields.io/npm/v/@reforma/briefback.svg" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@reforma/briefback.svg" alt="MIT License"></a>
  <a href="https://www.skills.sh/reforma-ai/briefback"><img src="https://skills.sh/b/reforma-ai/briefback" alt="skills.sh"></a>
</p>

**Stop coding the wrong thing.**

Briefback is a skill for your coding agent. It challenges assumptions and
works through open decisions with you before implementation starts.

An agent can build working code from a wrong assumption. Briefback brings
the decisions into the conversation before you have an implementation to
undo, then keeps the agreed work small enough to review.

Works with Claude Code, Codex, Cursor, and other agents supported by the
[skills CLI](https://github.com/vercel-labs/skills).

## Install and try it

With Node.js 22.20+, run this inside your project:

```bash
npx @reforma/briefback init
```

Choose your agent and project scope. Accept **Set up Briefback docs?** to add
`BRIEFBACK.md` and a pointer in `AGENTS.md`, giving the project an explicit
instruction to use Briefback for work larger than a quick fix.

Then talk to your agent normally. Briefback activates for substantial tasks
without you naming it. For example:

> Research how authentication works in this project.

The agent chooses the relevant mode from your request. For a change, it
checks the repo, recommends answers to open questions, and waits for you to
confirm what to build. There are no mode commands to memorize.

[Other installation options and updates](docs/installation.md)

## A request that can go wrong

Illustrative example:

**You:** “Add CSV export to the customer list.”

**Without clarification:** The agent might export only the current page and
include every customer field. Tests can pass while the feature misses your
intent.

**With Briefback:** The agent reads the existing list, filters, and permissions.
It asks which rows, columns, and users the export should cover, with
recommendations based on what it found.

**You:** “All filtered rows, including later pages. Visible columns only. Use
the existing list permission.”

**Agent:** “I'll export all matching rows with the current filters and visible
columns, keeping the existing permissions. Does that match what you want?”

**You:** “Yes, build that.”

The agent implements and checks the agreed change, then reviews it.

## What the skill adds

A good prompt can ask for questions too. Briefback makes that discipline
reusable across tasks: inspect the code, recommend answers, wait for agreement,
then build and review the confirmed change.

- **Decisions stay yours.** The agent looks up facts and challenges assumptions;
  you settle product and design choices.
- **Scope stays reviewable.** Each coherent stage is verified, reviewed, and
  committed separately. Independent work can run in parallel within your agreed
  scope. Plans and handoffs preserve context across stages or chats.
- **Process follows the task.** Research and a written plan are used when
  needed. A typo or one-line fix does not need the loop.

## 🔄 The loop

```text
Research → Grill → Plan → Stage → Review → Commit
                          ↑                   │
                          └── Ready stages ─┘
```

Grill is where you settle decisions with the agent. Each stage is implemented,
checked, reviewed, and committed before its dependent stages start. Research is
for unfamiliar areas; a written plan coordinates work across stages or chats.

[Full workflow and modes](docs/workflow.md)

## Documentation

- [Installation reference](docs/installation.md): CLI options, plugins, and
  updates.
- [Website](https://briefback.dev) · [npm](https://www.npmjs.com/package/@reforma/briefback)
  · [Contributing](https://github.com/reforma-ai/briefback/blob/main/CONTRIBUTING.md)

## 🔗 Related project

[Prosecraft](https://github.com/reforma-ai/prosecraft) provides skills for
humanizing drafts, writing documentation and UI copy, and creating agent skills.

## 🙏 Credits

Briefback builds on other people's work. Where its text follows or adapts a
source, the source is named here.

- **[Matt Pocock's skills](https://github.com/mattpocock/skills)** (MIT). Grill
  follows his `grilling` skill: the design tree, rounds of questions with a
  recommended answer, and an ending when no open branch is left. The test-first
  guidance in `tdd`, `testing`, and `mocking` adapts parts of his `tdd` skill.
  His notice is in [LICENSE](LICENSE).
- **[Superpowers](https://github.com/obra/superpowers)** by Jesse Vincent (MIT).
  The Review rule that no pass or done claim stands without a command you ran
  this turn echoes its `verification-before-completion` skill.
- **[Diátaxis](https://diataxis.fr/)** by Daniele Procida. Document writes one
  page per job: tutorial, how-to, reference, or explanation.
- **Anthropic.** The rules for parallel work and checks draw on
  [dynamic workflows in Claude Code](https://www.claude.com/blog/introducing-dynamic-workflows-in-claude-code)
  and its [documentation](https://code.claude.com/docs/en/workflows) (the
  unverified outcome and the pilot target),
  [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/research/building-c-compiler)
  (claiming work in shared files),
  [Harness design for long-running application development](https://www.anthropic.com/research/harness-design-long-running-apps)
  (agreeing on done before the work starts), and
  [How the Claude Code team thinks about verification](https://claude.dev/blog/how-the-claude-code-team-thinks-about-verification)
  (recording how each change was checked).

## 📄 License

Briefback is available under the [MIT License](LICENSE).

## 👤 Maintainer

Maintained by [@kachurun](https://github.com/kachurun).
