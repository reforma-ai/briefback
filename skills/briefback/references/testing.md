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
- One logical assertion per test

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

**Tautological** — expected value restates the implementation.

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

Find elements by role or test id, and build any text query from the translation
key, not a literal. Assert state, or the code or type an error carries, not its
wording. Assert exact text or markup only when it is the contract (a documented
API message, CLI output, legal text, generated HTML), and take it from the spec,
never from the locale file or the current output. Whole-tree snapshots belong
here too: they fail on every harmless tweak and get approved unread.

**Low-value mapping tests** — asserting `.map` / array shape with no behavior.
Skip or drop them rather than warping production code so a test can reach
inside.

## Hostile cases

Tests that try to break the code. Choose them from the brief and the contract of
the interface under test, not from the implementation, so they probe what the
code must survive rather than what it happens to do. Ask what a careless or
hostile caller or environment could do to that interface. Take the few that apply
and could really hurt, and skip categories it cannot meet (a pure formatter has
no authority or concurrency):

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

Keep a test only when both hold:

1. **Fails on wrong behavior.** Break the production behavior it covers (wrong
   branch, missing side effect, empty return, no-op) and it goes red.
2. **Survives harmless change.** Rewording copy, switching locale, renaming a
   class, reshaping markup, or refactoring internals leaves it green. Text or
   markup that is the contract is not a harmless change.

Failing the first means it asserts nothing or restates the code. Failing the
second means it is coupled to copy or implementation. Rewrite it at a stable
handle, or delete it. A missing test is better than one that passes for the wrong
reason.
