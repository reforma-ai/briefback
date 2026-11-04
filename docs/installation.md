# Installation and updates

[Back to the README](../README.md) · [Workflow](workflow.md)

## CLI

Requires Node.js 22.20+ and access to npm and GitHub. Run inside the target project:

```bash
npx @reforma/briefback init
```

`init` installs the Briefback skill through the `skills` CLI, which asks for the target agents, scope, and installation method. Choose project scope to configure this repo. Briefback then asks whether to set up project docs. If you choose yes, it writes `BRIEFBACK.md` and adds this pointer to `AGENTS.md`:

```text
Larger than a quick fix: follow @BRIEFBACK.md.
```

Accepting also records the selected components in `.briefback/config.json`.
Declining installs the skill without adding the project workflow docs. The
skill itself requests automatic use for substantial work; project docs make
that instruction explicit for this repo.

Do not edit `BRIEFBACK.md` by hand. `init` and `update` replace it. Put your
project conventions in `AGENTS.md` instead.

After setup, describe your task in ordinary language. Briefback activates for
substantial work without being named. For example:

> Research how authentication works in this project.

Or ask for a change, such as “Add CSV export to the customer list.” Use a task
that fits your repo. Confirm the agent's settled understanding before it
implements. See the [README example](../README.md#a-request-that-can-go-wrong)
and [workflow reference](workflow.md) for what happens next.

## Update

Update the installed workflow:

```bash
npx @reforma/briefback@latest update
```

After setup, `update` runs without prompts and refreshes only the parts selected during initialization. If Briefback is not installed yet, it starts the same setup as `init`.

## CLI options

Examples:

```bash
npx @reforma/briefback init --global --agent cursor
npx @reforma/briefback init --yes
npx skills add reforma-ai/briefback --skill briefback
```

| Option | Applies to | Effect |
| --- | --- | --- |
| `--agent <name>`, `-a` | `init` | Selects a target agent for the skills CLI |
| `--global`, `-g` | `init`, `update` | Targets a global skill installation |
| `--project`, `-p` | `update` | Targets the project skill installation |
| `--yes`, `-y` | `init`, `update` | Uses skills CLI defaults; during setup, also accepts project docs |

`--global` controls the skill installation scope. Project workflow docs and
`.briefback/config.json` are still written in the current directory when
selected; run from the project you intend to configure.

The direct `skills add` command installs only the skill. It does not create
`BRIEFBACK.md`, modify `AGENTS.md`, or record Briefback CLI setup state.

For CLI help, run `npx @reforma/briefback --help`.

## Agent plugin

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

