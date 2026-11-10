---
name: verify-test-outcomes
description: Review the Gherkin scenarios in features/ and their step definitions in step-definitions/ to confirm every scenario asserts a meaningful outcome of the behaviour it claims, not just that it ran. Use when asked to review test quality, check assertions, or before pushing new or changed features or steps.
---

# Verify test outcomes

The tests are BDD scenarios (`playwright-bdd`): the claim is written in a `.feature` file and the assertions live in the matching step definitions. ESLint cannot tell whether a `Then` step proves anything, and `expect-expect` does not apply to steps. This skill covers that: whether the assertions behind each scenario actually prove its claim.

## Scope

Review `features/**/*.feature`. For every step, find its definition in `step-definitions/**/*.ts` (match the step text to the `Given`/`When`/`Then` string or Cucumber expression) and read it, plus `hooks.ts` and `fixtures.ts`. If the user names files, or there are uncommitted changes, review only those scenarios and the steps they use. Read the page objects in `pages/` and data in `test-data/` so you know what each locator and value means. Ignore `.features-gen/` (generated). Do not edit anything unless asked; report first.

Review each `Scenario` once. For a `Scenario Outline`, review it once and consider whether every `Examples` row is really checked (the step must use the row's value, not a fixed one).

## For each scenario, answer

1. **What does the scenario title claim?** (e.g. "Logs in with valid credentials")
2. **What user action do the `When` steps perform?** (clicks, fills, navigation)
3. **What observable result proves the claim?** The page, URL, text or element state that is only true if the behaviour worked.
4. **Does a `Then` step check that result?** Name the step text and the exact `expect` line in its definition.

## Flag as WEAK when

- **No outcome step:** the scenario has no `Then`, or its `Then` steps assert nothing meaningful (or the step body has no `expect`).
- **Step text promises more than the code checks:** the wording says "is logged in" or "products are listed" but the definition only checks something weaker, like visibility.
- **Action without result:** the test clicks, submits or navigates and never asserts what changed.
- **Presence-only:** the only assertions are `toBeVisible()` / `toBeAttached()` on elements that exist before the action, so the test would pass even if the feature were broken.
- **Setup treated as outcome:** the assertion proves the arrange step (page loaded, modal opened) rather than the behaviour under test.
- **Cannot fail:** tautologies (`expect(true).toBe(true)`), asserting a value the test just set, or comparing a locator to itself.
- **Wrong subject:** asserts something unrelated to the title (e.g. a "login" test that only checks the footer).
- **Hardcoded expectation:** expected strings are inline in the feature file or the step definition instead of coming from `test-data/`.
- **Outline ignores its data:** a `Scenario Outline` step that does not use the `<placeholder>` value, so every row asserts the same thing.
- **Swallowed failure:** assertions inside a `try/catch`, `.catch(() => {})`, or an `if` that can skip them.
- **Non-retrying checks:** `expect(await locator.textContent())` style instead of web-first `await expect(locator).toHaveText(...)`.
- **Weak match:** `toContainText` / regex used where exact text from `test-data/` is known, or `toHaveCount(n)` where the content matters.

A page-load or element-presence test is acceptable when its title says so (e.g. "displays the core homepage elements"), but it should also check at least one concrete value such as title or heading text.

Note that `Before`/`After` hooks (for example the `@login` logout) are cleanup, not an assertion target. Do not count them as proof of the outcome.

## Output

The report is often read as plain text in a terminal (`claude -p`), where wide Markdown tables wrap and become unreadable. Do **not** use a table. Use one short block per scenario, separated by a blank line, with each field on its own line:

```text
homepage.feature > Displays the core homepage elements
  Outcome:  title equals homeData.title; categories heading text matches
  Verdict:  OK (presence scenario that also checks two concrete values)
  Fix:      none
```

- Keep every line under about 100 characters; shorten rather than wrap.
- **Verdict:** `OK` or `WEAK`, with the reason in one short phrase.
- **Fix:** for each WEAK scenario, the specific step or assertion to add or change, using `test-data/` values. Write `none` for OK scenarios.
- After the blocks, list any non-blocking observations (e.g. cleanup hooks, coverage gaps) as short bullets under a `Notes` heading.

Finish with a one-line summary (`N scenarios reviewed, M weak`). Offer to apply the fixes. If you apply them, run `npm run qa:check` and the affected scenarios (`npm run test:feature -- <file>.feature` or `npm run test:tag -- @tag`) afterwards.
