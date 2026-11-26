# Document

Write the human page from work already done in this chat. Distill. Do not copy
`.briefback/` notes into the docs tree. After the page exists, remove the
working files that were the source.

UI strings and agent guides are out of scope.

[Diátaxis](https://diataxis.fr/): one page, one job. A how-to that lectures, or
a reference that walks a tutorial, is the wrong page — split and link.

## 1. Source

User-named files win. Else this chat's `.briefback/<slug>` research or plan, shipped change and grill reading here.

## 2. Where

User-named path wins.

Else find the existing human page that already owns this **domain** — the
system or topic, not this PR. Search the docs tree named in project rules,
repo-root `docs/`, neighboring pages, and `.briefback/docs/`. Update that
file. Ten PRs on integrations are one integrations page.

No page owns this domain → create one page in that tree, named for the
domain. No human docs tree → write `.briefback/docs/<domain>/`. Do not
create a repo-root `docs/`.

When `.briefback/docs/` holds about five pages or more, keep one `index.md`
there: a link and what each page answers. In a project docs tree, add the page
to its existing navigation instead.

Read that page (or neighbors in the docs tree) for tone and terms.

Write in the **project's** language. Read it from the page you are updating,
README, `AGENTS.md`, or other human docs. Missing, mixed, or English → English.
The chat language and `.briefback/` files do not decide this.

A different Diátaxis job already covered nearby → link it. Do not add a
second page of the same job for the same domain.

## 3. Job

Infer from the request. Name the pick in one line. Don't interview when the
goal is already in the prompt.

| Reader wants        | Quadrant        | Typical artifact          |
| ------------------- | --------------- | ------------------------- |
| to learn by doing   | **Tutorial**    | onboarding, first success |
| to get a thing done | **How-to**      | runbook, "how do I"       |
| to look up a fact   | **Reference**   | API, CLI, config, flags   |
| to understand why   | **Explanation** | architecture, design      |

"Document this" with no type: a procedure → how-to; a surface → reference; a
system → explanation.

README is a landing page, not a fifth quadrant. What + why, a short path to
first success, then links to the other three.

## 4. Write

Ground claims in files you read. A path you cite exists, or mark it planned;
treat a plan's unbuilt items the same way, or leave them out. When updating a
page, re-check the claims your change touches against the code, and mark any you
could not check as unverified in the sentence, not in a new section.

Carry forward durable decisions: what was chosen, why, and when to revisit it.
Put them under a short Decisions heading on the domain's explanation page, or
where the project already keeps decision records. Leave out decisions that mattered only to this
work.

Lead with the thing the reader came for. Show commands, requests, and paths.
Don't wait for outline approval unless the user asked for a structure, or the
work is a multi-page set of **different jobs**. Redact secrets.

Write with the picked job's shape in
[document-shapes.md](document-shapes.md).

## 5. Remove

Delete `.briefback/<slug>/` working files that were packaged (research, plan,
handoff). Leave `.briefback/docs/`, `.briefback/config.json`, and other slugs.
Nothing to delete when the source was only this chat. Keep the files while
another chat or worker still uses the slug.

Print the page path and what was removed.

## Done

A reader with that goal can finish without another page of the same type.
The domain page is current. The packaged `.briefback/<slug>/` working files
are gone, or kept because another chat or worker still uses the slug, and the
output says so. A page with no project docs tree lives under
`.briefback/docs/<domain>/`.
