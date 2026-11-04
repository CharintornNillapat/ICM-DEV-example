# Task ledger

Every task edits this file; only the task that ships a phase also writes `refactor-log.md`. Flip `Status` to `in-progress` when a task starts and fill `Gate result` when it lands. Leave `Commit` empty: the owner-approved deploy record fills every task's `Commit` cell once per phase, after the merge.

Status values: `todo`, `in-progress`, `done`, `dropped` (with a one-line reason).

## Phase template

Copy this block above the Backlog, with the branch's phase number, when the first task of a phase starts. Keep this section.

```
## Phase NNN - <title> (ADR NNNN)

Branch `phase-NNN-<slug>`, cut from `main` at `<sha>`. No production touch point.

| # | Task | Files | Status | Commit | Gate result |
|---|---|---|---|---|---|
| T001 | <one line> | `<path>`, `docs/audit/task-ledger.md` | in-progress | | |
```

## Phase 001 - accents (ADR 0002)

Branch `phase-001-accents`, cut from `main` at `n/a (worked example)`. No production touch point.

| # | Task | Files | Status | Commit | Gate result |
|---|---|---|---|---|---|
| T001 | Keep the base letter of accented Latin letters | `docs/audit/decisions/0002-keep-accent-base-letters.md`, `test/slugify.test.js`, `src/slugify.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md`, `docs/audit/task-ledger.md` | done | n/a (worked example) | npm run lint exit 0; node --test test/slugify.test.js tests 6 pass 6 fail 0; npm test tests 6 pass 6 fail 0; node --test e2e/cli.test.js tests 1 pass 1 fail 0; npm run test:e2e left to the reviewer |

## Phase 002 - slug-limit (ADR 0003)

Branch `phase-002-slug-limit`, cut from `main` at `n/a (worked example; ran in ICM-DEV at 6d98d6e)`. No production touch point.

| # | Task | Files | Status | Commit | Gate result |
|---|---|---|---|---|---|
| T002 | Cap a slug at 80 characters, cut at the last hyphen | `docs/audit/decisions/0003-cap-slug-length.md`, `test/slugify.test.js`, `src/slugify.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md`, `docs/audit/task-ledger.md` | done | n/a (worked example; ran in ICM-DEV at 7b69497) | npm run lint exit 0; node --test test/slugify.test.js tests 9 pass 9 fail 0; npm test tests 9 pass 9 fail 0; node --test e2e/cli.test.js tests 1 pass 1 fail 0; npm run test:e2e left to the reviewer |
| T003 | Add a Limits section to the README for the 80-character cap | `README.md`, `docs/audit/refactor-log.md`, `docs/audit/task-ledger.md` | done | n/a (worked example; ran in ICM-DEV at 50d4e37) | docs only, no code tier: README edit 1 text present once and MAX_LENGTH 80 (ok, ok, exit 0); README eol i/lf w/crlf; cap check 77 80 80 and true; log names Phase 002 and README.md; em dash 0 in diff and in spec |

## Phase 003 - translit (ADR 0004)

Branch `phase-003-translit`, cut from `main` at `e79d24e`. No production touch point.

| # | Task | Files | Status | Commit | Gate result |
|---|---|---|---|---|---|
| T004 | Pin slugify(slugify(x)) equals slugify(x) with a test | `test/slugify.test.js`, `docs/audit/task-ledger.md` | done | `da13c91` | npm run lint exit 0; node --test test/slugify.test.js tests 10 pass 10 fail 0; npm test tests 10 pass 10 fail 0; red run before the final assertion: tests 10 pass 9 fail 1 (output/logs/T004-red.log); e2e not run (no bin/ or e2e/ path); em dash 0 in touched files |
| T005 | Spell ß, æ, œ, ø, ł, đ in ASCII instead of hyphens | `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md`, `test/slugify.test.js`, `src/slugify.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md`, `docs/audit/task-ledger.md` | done | `1bed1ab` | npm run lint exit 0; node --test test/slugify.test.js tests 11 pass 11 fail 0 (red run before edit 2: tests 11 pass 10 fail 1, output/logs/T005-red.log); npm test tests 11 pass 11 fail 0; node --test e2e/cli.test.js tests 1 pass 1 fail 0; npm run test:e2e left to the reviewer |

## Backlog

Items not yet in a phase, numbered `B001`, `B002` and so on. The deploy record adds a row for each `[follow-up]` note a review left open. A spec that names a row sets its Status to `done in Phase NNN (<id>)`.

| # | Item | Status |
|---|---|---|
| B001 | Ship spec gates that check backslash escapes as a script file, or build the backslash with `String.fromCharCode(92)`: an inline `node -e "..."` check prints a false `false` in Git Bash (T005 review, `workflow/stages/01_spec/output/task-T005-spec.md:108`) | todo |
