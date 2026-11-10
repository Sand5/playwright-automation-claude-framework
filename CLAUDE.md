# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Playwright Test project (TypeScript, CommonJS) testing the Demoblaze demo store (`https://demoblaze.com`; `baseURL` comes from `BASE_URL` in `env/.env.qa`, and the config throws if it is unset). It currently has two specs, `tests/homepage.spec.ts` and `tests/login.spec.ts`, built on a page object model. No `webServer` is configured.

## Commands

Prefer the npm scripts; use `npx` for anything else.

- Chromium headed: `npm run test:chrome:headed`
- Chromium headless: `npm run test:chrome:headless`
- WebKit headless: `npm run test:webkit:headless`
- Login spec (Chromium): `npm run test:login` / `npm run test:login:headed`
- Smoke tests (`@smoke`): `npm run test:smoke` (Chromium) / `npm run test:smoke:all` (all browsers)
- Any tag (Chromium): `npm run test:tag -- @login`
- Run all tests (all 3 browsers): `npx playwright test`
- Single file: `npx playwright test tests/homepage.spec.ts`
- Single test by title: `npx playwright test -g "test title"`
- Ordered log output (no interleaving between tests): add `--workers=1`
- UI mode / debug / codegen: `npx playwright test --ui`, `npx playwright test --debug`, `npx playwright codegen <url>`
- Open last HTML report: `npx playwright show-report`
- Type-check: `npm run typecheck`
- Lint: `npm run lint` / `npm run lint:fix`
- Format check: `npm run format:check`; write with `npx prettier --write <paths>`
- Full QA gate (typecheck + lint + format check): `npm run qa:check` — run before finishing any change
- (Re)install browsers: `npx playwright install`

## Project structure

- `tests/` — specs (`*.spec.ts`). Assertions live here, not in page objects. Each spec logs the running test title in `beforeEach`. Tag tests with `{ tag: ['@smoke', '@login'] }` so they can be run with `--grep`. Specs that log in must log out in an `afterEach`.
- `pages/` — page objects, named `<name>.page.ts` (lowercase file, PascalCase class). `base.page.ts` has the abstract `BasePage` (holds `page`, provides `navigate(url)` which logs). Page objects extend it, expose locators as `readonly` properties, and log their actions with the logger. Use relative paths in `navigate()`/`goto()`; the host comes from `baseURL`.
- `test-data/` — expected values (titles, headings, product lists) as `as const` objects, e.g. `home.data.ts`, `login-data.ts` (credentials and expected welcome text). Don't hardcode expected strings in specs.
- `logger/logger.ts` — shared winston logger (coloured console output, Europe/London timestamps). Level comes from `LOG_LEVEL`, loaded via `config/load-env.ts` from `env/.env.<TEST_ENV>` (default `qa`) (paths resolve from that file, not the working directory; Playwright itself still needs to run from the project root to find its config).

## Configuration notes

- `playwright.config.ts` defines three projects: chromium, firefox, webkit (desktop devices). `fullyParallel` is on; on CI (`CI` env var) it uses 1 worker, 2 retries, and fails on stray `test.only`. The `chromium` project is Playwright's bundled Chromium, not branded Chrome.
- Reporter is `html`; output goes to `playwright-report/` and `test-results/` (both git-ignored).
- `tsconfig.json` uses `module`/`moduleResolution: nodenext` (not `node10`, which is deprecated in TS 6+) and explicitly loads `types: ["node"]`. Its `include` covers `playwright.config.ts`, `config/`, `tests/`, `pages/`, `logger/` and `test-data/` — add any new source directory there or the editor will lose type info for it.
- Prettier is configured in `.prettierrc` (`singleQuote: true`, `semi: true`). `format:check` covers `tests/`, `pages/`, `logger/`, `test-data/`, `config/` and `playwright.config.ts`.
- ESLint is configured in `eslint.config.mjs` (flat config: typescript-eslint type-checked rules + `eslint-plugin-playwright` for `tests/`). Notable rules: no floating promises, no `console` (use the logger), no `waitForTimeout`/`force`/`test.only`, and no `expect` in `pages/`. Lint only covers `.ts` files.
- Environments: `TEST_ENV` (default `qa`) selects `env/.env.<TEST_ENV>`; the loader throws if that file is missing. To add staging, create `env/.env.staging` with its own `BASE_URL` and run `TEST_ENV=staging npx playwright test`. Real environment variables (e.g. `BASE_URL` set in the shell or CI) override the files.
- Credentials: `test-data/login-data.ts` reads `TEST_USERNAME`/`TEST_PASSWORD` from the environment. `config/load-env.ts` (imported by `playwright.config.ts`, `logger/logger.ts` and `login-data.ts`; the only place that calls dotenv — import it for its side effect in any new file that reads env vars) loads `env/.env.secrets` (git-ignored; template in `env/.env.secrets.example`) then `env/.env.qa` (committed, non-secret only). In CI they come from GitHub secrets. The `test`/`test` fallback is a **demo-only** default for Demoblaze's public account — never add default credentials for a real environment, and never put secrets in `env/.env.qa`.
- CI is `.github/workflows/ci.yml`: a `qa` job (`npm run qa:check`) gates an `e2e` job that runs each browser project in a matrix and uploads the HTML report. Triggers: push to `main`, pull requests, manual dispatch.
- Project skill `verify-test-outcomes` (`.claude/skills/verify-test-outcomes/SKILL.md`, invoke with `/verify-test-outcomes` or `npm run review:tests`, which runs `claude -p "/verify-test-outcomes"`; keep it out of `qa:check` and CI) reviews specs to confirm each test asserts a meaningful outcome, not just presence. Use it when writing or changing specs and before pushing; it reports first and only edits if asked. It complements the `playwright/expect-expect` lint rule, which only checks that an `expect` exists.
- The tests must run without Claude Code or MCP (see `CLAUDE_SETUP.md`).
