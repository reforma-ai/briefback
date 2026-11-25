# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the slices that try to break the code, the anti-patterns, and the rules of the loop. Every section applies on every cycle — consult them before and during the loop, not after.

When exploring the codebase, read the nearest project guide (`AGENTS.md` or
equivalent) so test names and interface vocabulary match the area's language.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification — "user can checkout with valid cart" tells you exactly what capability exists — and survives refactors because it doesn't care about internal structure.

See [testing.md](testing.md) for examples and [mocking.md](mocking.md) for
mocking guidelines.

## Seams — where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything — agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?"

The project's own guide wins: do not add a file, port, or wrapper so a test
can reach inside. One real adapter is not a seam — two (production + test, or
two backends) is. Don't invent `IFooService` for an in-process collaborator
you own.

## Hostile slices

A passing happy path proves little. After the first slice at a seam, add slices
that try to break it. Choose the cases from the brief and the seam's contract
before you look at your implementation, using
[testing.md](testing.md#hostile-cases): a short list of what is most likely to
hurt, not a matrix.

Each hostile case is its own slice at the already confirmed seam. A case that
needs a new seam, or whose safe outcome the contract does not state, goes back to
the user instead of getting an invented answer.

- **Red first when the behavior is missing.** Fix the code in the green step,
  not the test.
- **Passes at once.** Legitimate when existing code already guards the case, but
  unproven. Name the break, apply it to the production path the test protects,
  and watch it go red. Then undo exactly that edit, not other uncommitted work.
  Drop a test you cannot turn red.

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological** — the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth — a known-good literal, a worked example, the spec.
- **Horizontal slicing** — writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead — one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Watch the color.** Red is not “wrote a test”. Run it. Confirm it fails because the behavior is missing — not a typo, import error, or existing pass. Passes immediately → you tested existing behavior; fix the test, except for a hostile slice (see Hostile slices). Errors → fix the harness until it fails correctly, then implement. Green: run the same command; claim pass only from that output.
- **Name the break.** Before the test body, name the production change that should make it fail. Cannot name one → wrong seam.
- **Keep or drop.** Before the next slice, apply [Keep or drop](testing.md#keep-or-drop) to the test you just wrote. Rewrite or delete a failing test in this cycle, not in review.
- **Refactoring is not part of the loop.** It belongs to the review stage (see
  [review.md](review.md)), not the red → green implementation cycle.

## Done

One cycle is complete when:

1. Seams under test are confirmed with the user.
2. The new test was run red for the missing behavior (not a harness error). A
   hostile test that passed at once instead went red under a named break.
3. The same command was run green after the minimal production change (or, for
   that hostile test, after the break was undone).
4. No speculative features or bulk test suites were added in that cycle.
5. The test passes Keep or drop.

A seam is done when its hostile cases, chosen from the contract, each completed
a cycle.
