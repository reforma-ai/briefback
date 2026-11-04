# Briefback

**Stop coding the wrong thing.**

Briefback is a skill for your coding agent. It challenges assumptions and
settles missing decisions with you before implementation starts.

A request like “add CSV export” leaves rows, fields, and permissions undecided.
An agent can build a working export that you never wanted. Briefback brings
those decisions into the conversation while changing the approach is still
cheap, then carries the agreed scope through implementation and review.

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

Then give your agent a real task. For a project with a customer list, try:

> Use Briefback to clarify this request before coding: add CSV export to the
> customer list.

The agent investigates facts it can read from the repo, asks you to settle
open decisions, and recommends answers. Confirm or correct its reading before
it implements. You can describe tasks in ordinary language; there are no mode
commands to memorize.

[Other installation options and updates](docs/installation.md)

## A request that can go wrong

A condensed illustration, not a recorded agent comparison:

**You:** “Add CSV export to the customer list.”

**Without clarification:** The agent might export only the current page and
include every customer field. Tests can pass while the feature misses your
intent.

**With Briefback:** The agent reads the existing list, filters, and permissions.
It asks which rows, columns, and users the export should cover, with
recommendations based on what it found.

**You:** “All filtered rows, including later pages. Visible columns only. Use
the existing list permission.”

**Agent:** “The export will preserve the filters, include matching rows beyond
this page, use the visible columns, and keep the existing access rules.
Confirm?”

**You:** “Yes, build that.”

The agent implements and checks that scope, then reviews the change. The
missing decisions were settled before they became code to undo.

## Why install a skill for this?

A good prompt can ask for questions too. Briefback makes that discipline
reusable across tasks: inspect the code, recommend answers, wait for agreement,
then build and review the confirmed change.

- **Decisions stay yours.** The agent looks up facts and challenges assumptions;
  you settle product and design choices.
- **Scope stays reviewable.** It implements, verifies, and reviews one coherent
  stage before starting the next. Plans and handoffs preserve context when work
  spans stages or chats.
- **Process follows the task.** Research and a written plan are used when
  needed. A typo or one-line fix does not need the loop.

Briefback works inside the coding agent you already use. You start with a task;
a separate specification process is not a prerequisite.

## Go deeper

- [Workflow and modes](docs/workflow.md): ordering, review, artifacts, and
  continuing in a fresh chat.
- [Installation reference](docs/installation.md): CLI options, plugins, and
  updates.
- [Website](https://briefback.dev) · [npm](https://www.npmjs.com/package/@reforma/briefback)
  · [Contributing](https://github.com/reforma-ai/briefback/blob/main/CONTRIBUTING.md)
- [Prosecraft](https://github.com/reforma-ai/prosecraft): a related project for
  writing and documentation.

MIT licensed. Maintained by [@kachurun](https://github.com/kachurun).
