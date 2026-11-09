# Claude Code and Playwright MCP Setup (macOS)

This guide documents how Claude Code and the Playwright MCP plugin were set up for this project on macOS.

> **Important:** Claude Code and Playwright MCP are **development tools** that assist with writing and exploring tests. The Playwright automation framework in this repository must remain **independently executable without Claude**. Tests run with `npx playwright test` and must never depend on Claude Code or MCP being installed or running (for example, locally or in CI).

## Prerequisites

- macOS with the Terminal (zsh)
- [Visual Studio Code](https://code.visualstudio.com/) with the `code` shell command installed
- A Claude account for authentication

## Setup Steps

### 1. Create the project directory

```bash
mkdir playwright-automation-claude-framework
```

### 2. Navigate into the directory

```bash
cd playwright-automation-claude-framework
```

### 3. Open the directory in VS Code

```bash
code .
```

### 4. Install Claude Code

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### 5. Fix the macOS PATH issue

The installer places the `claude` binary in `~/.local/bin`, which may not be on your `PATH`. Add it to your zsh profile and reload it:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

### 6. Verify the installation

```bash
claude --version
```

### 7. Launch Claude Code

From the project directory:

```bash
claude
```

### 8. Complete the first-run configuration

On first launch, Claude Code prompts you to:

1. Select a terminal theme.
2. Authenticate with your Claude account.
3. Choose a Claude model (can be changed later with `/model`).
4. Configure the effort level (can be changed later with `/effort`).

### 9. Install the Playwright MCP plugin

Inside Claude Code, open the plugin manager:

```
/plugin
```

Find the Microsoft **Playwright** plugin in the Anthropic Directory and install it, selecting **local scope** so it applies to this repository only.

### 10. Verify the MCP connection

```
/mcp
```

The `playwright` server should be listed as connected.

## Example: Using Playwright MCP

With the plugin connected, ask Claude Code in plain language:

```
Use Playwright to navigate to https://example.com and tell me the page title.
```

Claude drives a browser through the MCP tools (such as navigating to the URL and reading the page), and should report the title as **"Example Domain"**.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `claude: command not found` | Re-run step 5, or open a new terminal. Confirm `~/.local/bin` is on `PATH` with `echo $PATH`. |
| `code: command not found` | In VS Code, open the Command Palette and run **Shell Command: Install 'code' command in PATH**. |
| Playwright server missing or failed in `/mcp` | Restart Claude Code, then re-check `/mcp`. If it persists, reinstall the plugin via `/plugin`. |
| MCP browser fails to launch | Install the browsers with `npx playwright install`. |
| Authentication problems | Run `/login` inside Claude Code to sign in again. |

## Running the Framework Without Claude

The test suite does not require Claude Code or MCP:

```bash
npm install
npx playwright install
npx playwright test
```
