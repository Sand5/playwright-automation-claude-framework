---
name: verify-test-outcomes
description: Review Playwright specs in tests/ to confirm every test asserts a meaningful outcome of the behaviour it claims to test, not just that it ran. Use when asked to review test quality, check assertions, or before pushing new or changed specs.
---

# Verify test outcomes

ESLint (`playwright/expect-expect`) already fails a test with no `expect` at all. This skill covers what lint cannot: whether the assertions actually prove the test's claim.

## Scope

Review `tests/**/*.spec.ts`. If the user names files, or there are uncommitted changes, review only those. Read the matching page objects in `pages/` and data in `test-data/` so you know what each locator and value means. Do not edit anything unless asked; report first.

## For each test, answer

1. **What does the title claim?** (e.g. "logs in with valid credentials")
2. **What user action does the test perform?** (clicks, fills, navigation)
3. **What observable result proves the claim?** The page, URL, text or element state that is only true if the behaviour worked.
4. **Does an assertion check that result?** Name the exact `expect` line.

## Flag as WEAK when

- **Action without result:** the test clicks, submits or navigates and never asserts what changed.
- **Presence-only:** the only assertions are `toBeVisible()` / `toBeAttached()` on elements that exist before the action, so the test would pass even if the feature were broken.
- **Setup treated as outcome:** the assertion proves the arrange step (page loaded, modal opened) rather than the behaviour under test.
- **Cannot fail:** tautologies (`expect(true).toBe(true)`), asserting a value the test just set, or comparing a locator to itself.
- **Wrong subject:** asserts something unrelated to the title (e.g. a "login" test that only checks the footer).
- **Hardcoded expectation:** expected strings are inline in the spec instead of coming from `test-data/`.
- **Swallowed failure:** assertions inside a `try/catch`, `.catch(() => {})`, or an `if` that can skip them.
- **Non-retrying checks:** `expect(await locator.textContent())` style instead of web-first `await expect(locator).toHaveText(...)`.
- **Weak match:** `toContainText` / regex used where exact text from `test-data/` is known, or `toHaveCount(n)` where the content matters.

A page-load or element-presence test is acceptable when its title says so (e.g. "displays the core homepage elements"), but it should also check at least one concrete value such as title or heading text.

Note the `afterEach` logout hook is cleanup, not an assertion target. Do not count it as proof of the outcome.

## Output

The report is often read as plain text in a terminal (`claude -p`), where wide Markdown tables wrap and become unreadable. Do **not** use a table. Use one short block per test, separated by a blank line, with each field on its own line:

```text
homepage.spec.ts > displays the core homepage elements
  Outcome:  title equals homeData.title; categories heading text matches
  Verdict:  OK (presence test that also checks two concrete values)
  Fix:      none
```

- Keep every line under about 100 characters; shorten rather than wrap.
- **Verdict:** `OK` or `WEAK`, with the reason in one short phrase.
- **Fix:** for each WEAK test, the specific assertion to add or change, using `test-data/` values. Write `none` for OK tests.
- After the blocks, list any non-blocking observations (e.g. cleanup hooks, coverage gaps) as short bullets under a `Notes` heading.

Finish with a one-line summary (`N tests reviewed, M weak`). Offer to apply the fixes. If you apply them, run `npm run qa:check` and the affected tests afterwards.
