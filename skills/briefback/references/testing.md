# Good and Bad Tests

## Good tests

Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: observable behavior
it("should confirm checkout for a valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

- Behavior callers care about
- Public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One scenario per test: one action under test, its whole outcome asserted
  together (result and side effects, one expected value) rather than a run of
  field checks. Leave wording out of that value (see Copy-coupled). Different
  actions or inputs with different outcomes are different tests
- Plain: the values that matter are literal in the test. Helpers build setup,
  not the expected value. No loops or conditionals in the body; one test per row
  of a case table (`it.each`) is fine

## Bad tests

**Implementation-detail** — coupled to internal structure.

```typescript
// BAD
it("should call paymentService.process", async () => {
  const process = vi.fn();
  await checkout(cart, { process });
  expect(process).toHaveBeenCalledWith(cart.total);
});
```

Red flags: mocking internal collaborators, private methods, call counts/order, test name describes HOW, verifying through a side channel instead of the interface.

```typescript
// BAD: bypasses interface
it("should save the user to the database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: verifies through interface
it("should make a created user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Tautological** — expected value restates the implementation, or is pasted from
what the code returned when you ran it. Take expected values from the brief, the
contract, or a worked example.

```typescript
// BAD
it("should sum line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: independent literal
it("should sum line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

**Asserts nothing** — passes for a wrong result. No assertion, or only "did not
throw", "returned something", `toBeDefined()`, "rendered", "was called".

```typescript
// BAD: a wrong total still passes
it("should calculate the total", () => {
  expect(calculateTotal(items)).toBeDefined();
});
```

Pin the value or state change that a wrong implementation would get wrong.

**Copy-coupled** — asserts text, markup, or styling that product, design, or
localization can change without changing behavior: labels, captions, messages,
translations, class names, DOM structure, snapshots of rendered trees. The tell:
the test fails when someone edits a locale file or switches the language.

```typescript
// BAD: fails when the copy or locale changes
expect(screen.getByText("Save changes")).toBeDisabled();
expect(await submit(form)).toEqual({ error: "Email is not valid" });

// GOOD: stable handles, behavior asserted
expect(screen.getByTestId("save")).toBeDisabled();
expect(await submit(form)).toMatchObject({ error: { code: "invalid_email" } });
```

Find elements by role or test id. Where text must be queried, have the test's
translate function return the key and query by the key; if it cannot, build the
query from the key, not a literal. Assert state, or the code or type an error
carries, not its wording. Assert exact text or markup only when it is the
contract (a documented API message, CLI output, legal text, generated HTML), and
take it from the spec, never from the locale file or the current output.
Snapshots belong here too unless they are small (a few dozen lines) and every
line is contract you checked against the spec: larger ones fail on every
harmless tweak and get approved unread.

**Duplicate** — walks a path another test already walks and asserts the same kind
of outcome. Merge its assertion into that test or delete it: nothing that could
realistically break goes unnoticed. Typical forms:

- One test per field of a single result, each repeating the same setup. Assert
  the whole outcome in one test.
- Several inputs that reach the same branch and get the same outcome (`null`,
  `undefined`, a number where a string belongs). Keep one.
- A test whose breaks another test at the same seam already catches. Keep the
  one that states the whole outcome.

Inputs that land on different outcomes are not duplicates: each side of a limit
(7 and 8 characters) stays.

**Low-value mapping tests** — asserting `.map` / array shape with no behavior.
Skip or drop them rather than warping production code so a test can reach
inside.

## Hostile cases

Tests that try to break the code. Choose them from the brief and the contract of
the interface under test, not from the implementation, so they probe what the
code must survive rather than what it happens to do. Ask what a careless or
hostile caller or environment could do to that interface. Take the few that apply
and could really hurt, and skip categories it cannot meet (a pure formatter has
no authority or concurrency). Inputs that fail the same way are one case (see
Duplicate). Categories:

- **Input** — empty, missing, wrong type, at and past a limit, duplicated,
  malformed.
- **Order and repeat** — the same request twice, a retry after partial failure,
  steps out of order, a stale or already-processed target.
- **Concurrency** — two callers on the same state at once.
- **Dependency failure** — a boundary that times out, errors, or returns
  malformed data.
- **Authority** — a caller without permission, or someone else's data.

Each hostile test asserts the safe outcome the contract promises: rejected with a
specific error, data unchanged, one side effect at the system boundary and not
two. "Did not throw" is not an outcome. A hostile test that fails against code
you believed correct is a bug when the contract promises that outcome: fix the
code, not the test.

## Keep or drop

Keep a test only when all three hold:

1. **Fails on wrong behavior.** Break the production behavior it covers (wrong
   branch, missing side effect, empty return, no-op) and it goes red.
2. **Survives harmless change.** Rewording copy, switching locale, renaming a
   class, reshaping markup, or refactoring internals leaves it green. Text or
   markup that is the contract is not a harmless change.
3. **Catches something no other test does.** First fold tests that repeat one
   scenario's setup into one whole-outcome test. Then some realistic break must
   turn it red and leave every other test at the same seam green. If every break
   that fails it also fails another test, delete it; of two that overlap fully,
   keep one. When unsure, apply the break, run the tests, and undo exactly that
   edit. Covered lines do not decide this: the same lines can carry different
   outcomes.

Failing the first means it asserts nothing or restates the code. Failing the
second means it is coupled to copy or implementation. Failing the third means it
duplicates another test. Rewrite it at a stable handle, merge it, or delete it.
A missing test is better than one that passes for the wrong reason.
