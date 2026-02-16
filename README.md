# dhanutech

## Codex PR troubleshooting

If you see this message in Codex:

> "Codex does not currently support updating PRs that are updated outside of Codex. For now, please create a new PR."

Use this workflow:

1. Commit your latest changes on the current branch.
2. Create a **new** PR entry from Codex (do not reuse or update an older PR).
3. Continue follow-up fixes as new commits and create a new Codex PR record each time if needed.

This repository follows a "new PR record per Codex run" approach to avoid that error.
