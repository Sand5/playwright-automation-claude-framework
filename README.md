# Playwright Automation Claude Framework

[![CI](https://github.com/Sand5/playwright-automation-claude-framework/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Sand5/playwright-automation-claude-framework/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/node-22.x-brightgreen?logo=node.js)
![Playwright](https://img.shields.io/badge/tested%20with-playwright-45ba4b?logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/lint-eslint-4b32c3?logo=eslint)
![Prettier](https://img.shields.io/badge/format-prettier-f7b93e?logo=prettier&logoColor=black)
![Last Commit](https://img.shields.io/github/last-commit/Sand5/playwright-automation-claude-framework)
![Repo Size](https://img.shields.io/github/repo-size/Sand5/playwright-automation-claude-framework)

End-to-end UI test framework for the [Demoblaze](https://demoblaze.com) demo store, built with **Playwright** and **TypeScript** using the **Page Object Model**.

## Features

- Page Object Model with a shared `BasePage`
- Test data kept separate from specs (`test-data/`)
- Tagged tests (`@smoke`, `@login`) for targeted runs
- Cross-browser: Chromium, Firefox and WebKit
- Shared coloured `winston` logger with a configurable `LOG_LEVEL`
- Per-environment config (`qa`, `staging`) selected with `TEST_ENV`, with `BASE_URL` kept in the env files
- QA gate: TypeScript type-check, ESLint (Playwright rules) and Prettier
- GitHub Actions CI with an HTML report per browser and a manual environment picker

## Table of contents

- [Getting started](#getting-started)
- [Running tests](#running-tests)
- [Code quality](#code-quality)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Continuous integration](#continuous-integration)

## Getting started

**Prerequisites:** Node.js 22 or later and npm.

```bash
git clone https://github.com/Sand5/playwright-automation-claude-framework.git
cd playwright-automation-claude-framework
npm install
npx playwright install
```

Run Playwright commands from the project root, where it finds `playwright.config.ts`. Env files are loaded by [`config/load-env.ts`](config/load-env.ts) using paths relative to that file, so they load correctly even if you point at the config from elsewhere (`-c`).

## Running tests

| Command                        | What it does                          |
| ------------------------------ | ------------------------------------- |
| `npm run test:chrome:headless` | All tests on Chromium (headless)      |
| `npm run test:chrome:headed`   | All tests on Chromium (visible)       |
| `npm run test:webkit:headless` | All tests on WebKit (headless)        |
| `npm run test:login`           | Login spec on Chromium                |
| `npm run test:login:headed`    | Login spec on Chromium (visible)      |
| `npm run test:smoke`           | Tests tagged `@smoke` on Chromium     |
| `npm run test:smoke:all`       | Tests tagged `@smoke` on all browsers |
| `npm run test:tag -- @login`   | Tests with any tag you pass, Chromium |
| `npx playwright test`          | Everything, on all three browsers     |

Handy extras:

```bash
npx playwright test --ui              # UI mode
npx playwright test --debug           # step-through debugger
npx playwright test --workers=1       # ordered log output
npx playwright show-report            # open the last HTML report
```

Run against another environment with `TEST_ENV` (see [Environments](#environments)):

```bash
TEST_ENV=staging npx playwright test
```

Log verbosity is controlled with `LOG_LEVEL`:

```bash
LOG_LEVEL=debug npx playwright test
```

## Code quality

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run typecheck`    | TypeScript type-check (`tsc --noEmit`)      |
| `npm run lint`         | ESLint with type-aware and Playwright rules |
| `npm run lint:fix`     | ESLint with automatic fixes                 |
| `npm run format:check` | Prettier check                              |
| `npm run qa:check`     | Typecheck, lint and format check in one go  |

Run `npm run qa:check` before opening a pull request. Notable lint rules: no floating promises, no `console` (use the logger), no `waitForTimeout`, `force` or `test.only`, and no `expect` inside page objects.

### Claude Code skill: verify test outcomes

If you use [Claude Code](https://claude.com/claude-code), the repo includes a project skill, `verify-test-outcomes`, in [`.claude/skills/verify-test-outcomes/SKILL.md`](.claude/skills/verify-test-outcomes/SKILL.md). It reviews your specs and checks that each test asserts a meaningful outcome of what its title claims, not just that elements are present. It flags things like actions with no result check, presence-only assertions, assertions that cannot fail, and hardcoded expected values.

Run it from the command line with:

```bash
claude -p "/verify-test-outcomes"
```

or use the npm shortcut, `npm run review:tests`. Inside an interactive `claude` session you can also type `/verify-test-outcomes`. It reports first and only changes code if you ask. The tests themselves run without Claude Code, and `review:tests` is not part of `qa:check` or CI.

To read the report in a nicely rendered view, save it to a file and open it in the VS Code Markdown preview:

```bash
npm run review:tests --silent > review.md
```

Then open `review.md` and press `Cmd+Shift+V` (`Ctrl+Shift+V` on Windows/Linux), or `Cmd+K` then `V` for source and preview side by side. `--silent` leaves out npm's own header lines. Don't commit the generated `review.md`.

## Project structure

```text
.
├── .claude/skills/            # Claude Code project skills (verify-test-outcomes)
├── .github/workflows/ci.yml   # GitHub Actions: QA gate, then browser matrix
├── env/                       # Environment files
│   ├── .env.qa                #   BASE_URL, LOG_LEVEL (default environment)
│   ├── .env.staging           #   Same keys for staging
│   └── .env.secrets.example   #   Template for git-ignored credentials
├── config/load-env.ts         # Loads env/.env.secrets and env/.env.<TEST_ENV> (one place)
├── logger/logger.ts           # Shared winston logger
├── pages/                     # Page objects (<name>.page.ts)
│   ├── base.page.ts           #   Abstract BasePage with navigate()
│   ├── home.page.ts
│   └── login.page.ts
├── test-data/                 # Expected values and credentials
│   ├── home.data.ts
│   └── login-data.ts
├── tests/                     # Specs; assertions live here
│   ├── homepage.spec.ts
│   └── login.spec.ts
├── eslint.config.mjs          # ESLint flat config
├── playwright.config.ts       # Projects, retries, reporter
└── tsconfig.json
```

### Conventions

- Page objects extend `BasePage`, expose locators as `readonly` properties and log their actions. **No assertions in page objects.**
- Specs log the running test title in `beforeEach`.
- Expected strings and credentials come from `test-data/`, never hardcoded in specs.
- Specs that log in must log out in an `afterEach`.

## Configuration

- **Base URL:** read from `BASE_URL` in the env file (`https://demoblaze.com` in `env/.env.qa`) and passed to `baseURL` in `playwright.config.ts`. The config throws if it is missing. Use relative paths such as `/index.html` in page objects.
- **Browsers:** `chromium`, `firefox` and `webkit` projects. On CI the config uses 1 worker, 2 retries and fails on a stray `test.only`.
- **Reports:** HTML report in `playwright-report/`, artifacts in `test-results/` (both git-ignored).
- **Logging:** `LOG_LEVEL` is read from the env file (default `info`). A real environment variable overrides the file.

### Environments

`TEST_ENV` picks the env file, `env/.env.<TEST_ENV>`, and defaults to `qa`. Each file holds the non-secret settings for that environment (`BASE_URL`, `LOG_LEVEL`).

```bash
npx playwright test                    # qa (default)
TEST_ENV=staging npx playwright test   # env/.env.staging
```

To add an environment, create `env/.env.<name>` with its own `BASE_URL`. If the file does not exist, or `BASE_URL` is empty, the run stops with an error rather than falling back to a default. A real environment variable such as `BASE_URL=... npx playwright test` overrides the file.

### Credentials and secrets

Login credentials are read from the environment in [`test-data/login-data.ts`](test-data/login-data.ts), so specs never contain them.

| Where   | How                                                                                    |
| ------- | -------------------------------------------------------------------------------------- |
| Locally | Copy `env/.env.secrets.example` to `env/.env.secrets` (git-ignored) and set the values |
| CI      | Add `TEST_USERNAME` and `TEST_PASSWORD` as GitHub repository secrets                   |
| One-off | `TEST_USERNAME=... TEST_PASSWORD=... npx playwright test`                              |

The `env/.env.<name>` files are committed, so they hold only non-secret settings such as `BASE_URL` and `LOG_LEVEL`. Real environment variables override the files.

> **Demo-only fallback:** Demoblaze's public demo account (`test` / `test`) is used when `TEST_USERNAME` and `TEST_PASSWORD` are not set, so the repo runs out of the box. This is done for demo reasons only. In a real project there must be **no default credentials in code**: keep them in a secrets file or a secrets manager, and make the tests fail fast when they are missing.

## Continuous integration

[`ci.yml`](.github/workflows/ci.yml) runs on pushes to `main`, pull requests and manual dispatch. Pushes and pull requests test `qa`. To test another environment, open **Actions > CI > Run workflow** and pick it from the **Environment to test** dropdown (or run `gh workflow run ci.yml -f test_env=staging`).

1. **`qa`** runs `npm run qa:check`.
2. **`e2e`** runs only if `qa` passes. It runs the full suite once per browser (Chromium, Firefox, WebKit) in parallel and uploads each HTML report as an artifact.

The tests run against the live demo site, so an outage there can fail a build even when the code is fine.
