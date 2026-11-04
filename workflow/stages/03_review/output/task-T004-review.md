# Review T004: pin the idempotence rule with a test

## Round 1

### Metadata

- Task: T004. Date: 2026-11-04. Round: 1. Verdict: APPROVED.
- Target files: `test/slugify.test.js`, `docs/audit/task-ledger.md`.
- `git check-ignore -v` on both targets: no output (neither is ignored).

### Summary

One test is appended to `test/slugify.test.js`. It loops over 14 titles (the 13 existing-test titles plus the 86-character long title) and asserts `slugify(slugify(x)) === slugify(x)`. The text matches the spec's block. The ledger gets the Phase 003 block and the T004 row. No file under `src/` or `bin/` changed.

### Invariants and parity

- Parity map: no export of `src/slugify.js` changed, so the README/CLI row is not touched.
- Scope: `git diff --stat` shows only `docs/audit/task-ledger.md` (8 lines) and `test/slugify.test.js` (25 lines). `git status --porcelain` adds only the untracked spec and build report (bookkeeping). Nothing unannounced.
- Ledger: Phase 003 heading, branch, base `e79d24e`, "No production touch point", T004 row with the spec's task text, files and gate result. Commit cell empty, Backlog unchanged, no `refactor-log.md` or ADR (as the spec says).
- Non-negotiables: em dash count 0 in both touched files; no dependency; the test file keeps CRLF (`w/crlf`, index `lf`, same as before the task, `attr/text=auto`).
- Existing assertion at `test/slugify.test.js:36` untouched.

### Gates run

| Command | Result | Log |
|---|---|---|
| `npm run lint` | exit 0 | `workflow/stages/03_review/output/logs/T004-lint.log` |
| `node --test test/slugify.test.js` | tests 10, pass 10, fail 0, skipped 0 | `workflow/stages/03_review/output/logs/T004-unit-file.log` |
| `npm test` | tests 10, pass 10, fail 0, skipped 0 | `workflow/stages/03_review/output/logs/T004-npm-test.log` |
| `git diff --stat`, `git status --porcelain` | as under Scope above | n/a |

No end-to-end gate: no `bin/` or `e2e/` path changed.

Red run (spec step 3, the test-only method of stage 03 step 6): the task changes no non-test file, so no worktree or stash applies.
- Recorded before: `git status --porcelain` (`T004-status-before.txt`) and `git diff -- test/slugify.test.js` (md5 `880a5641...`).
- Edited the loop line to `assert.notEqual(slugify(once), once, title);` and ran `node --test test/slugify.test.js`: tests 10, pass 9, fail 1; `AssertionError [ERR_ASSERTION]: Hello World`, actual and expected both `'hello-world'`. This is the failure the spec gives (log: `workflow/stages/03_review/output/logs/T004-red.log`).
- Put the line back by hand. After: `git status --porcelain` identical to before, the test-file diff md5 identical (`880a5641...`), `notEqual` count 0, `git worktree list` one entry, green run tests 10 pass 10 fail 0.

### Not verified

- Whether the test catches a real regression in `src/slugify.js`: the spec forbids touching `src/`, so only the inverted-assertion red run was done, as the spec and stage 03 prescribe.
- I did not recompute that the long title's slug is 78 characters; the green run over it passes, which is the property pinned.

### Blocking

None.

### Non-blocking

- [nit] `test/slugify.test.js:46-70` - the title list repeats literals from the other tests rather than sharing them; the spec asked for this and forbids a refactor, so leave it.

### Rule candidates

- [local] A test-only task's reviewer red run via the inverted assertion can compare `git diff` md5 before and after to prove the restore; worth keeping as the stage 03 step 6 wording if it recurs.
