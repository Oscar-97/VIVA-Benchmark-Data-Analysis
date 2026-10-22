---
name: pr
description: Run the checks, push the current branch and open a draft pull request against main using the repo's PR template. Use only when the user asks to open a PR.
disable-model-invocation: true
---

# Open a draft PR

Run these steps in order. Stop and report if a step fails; never skip or work around a failing check.

1. **Branch.** Run `git branch --show-current`. If it is `main`, stop and ask for a branch name (`feat/…`, `fix/…`, `chore/…`), then create it with `git switch -c`.
2. **Clean tree.** Run `git status --short`. If files are uncommitted, list them and ask whether to commit them. Never commit `build_errors.txt`.
3. **Checks.** Run `npm run lint` and `npm run test:functions`. If `Src/` changed against `main`, also run `npm run build` and make sure `Dist/` and `service-worker.js` are committed. Run `npm run test:ui` only if the change touches the UI and a build exists.
4. **Push.** Run `git push -u origin <branch>`. Never force push, and never push to `main`.
5. **Describe.** Read `git log main..HEAD --oneline` and `git diff main...HEAD --stat`. Write the PR body from `.github/PULL_REQUEST_TEMPLATE.md`:
   - Short summary grouped by theme, not one line per commit.
   - Tick a checkbox only if that check ran in this session and passed. Leave the others unticked and say why in the notes.
   - Mention that generated files (`Dist/`, `Docs/`, pages, lockfile) make up most of the diff, if true.
   - End the body with the attribution line given in the session's system-reminder.
6. **Create.** Write the body to a temp file in the scratchpad directory, then run `gh pr create --draft --base main --title "<conventional-commit style title>" --body-file <file>`. If `gh` is missing, print the title and body and give the compare URL instead.
7. **Report.** Give the PR URL and list any unticked checklist items.

## Never

- Mark the PR ready for review, merge it, close it, or enable auto-merge.
- Use `gh api`, force flags, or `--no-verify`.
- Open a PR for a branch with no commits ahead of `main`.
