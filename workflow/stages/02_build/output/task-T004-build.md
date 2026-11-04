# Build report T004: pin the idempotence rule with a test

Phase 003 (branch `phase-003-translit`). Spec: `workflow/stages/01_spec/output/task-T004-spec.md`.

## Files changed (2)

1. `test/slugify.test.js`: one test appended after the last test (25 lines added, CRLF kept).
2. `docs/audit/task-ledger.md`: Phase 003 block (`## Phase 003 - translit`) above `## Backlog`, with the T004 row. Status `done`, Commit empty, Gate result filled.

No file under `src/`, `bin/`, `e2e/`, `README.md`, `package.json` or `docs/contexts/` changed. No ADR and no `refactor-log.md` entry (spec says none for this task). The Backlog table is unchanged.

## Test added

`slugify is idempotent: slugify(slugify(x)) equals slugify(x)`, text taken verbatim from the spec's fenced block and checked by script after CRLF normalisation (`test block present verbatim: true`). It loops over the 14 titles in the spec (the existing test titles plus the 86-character long title) and asserts `slugify(once) === once`.

## Fail-then-pass evidence

Red run, before the final assertion was restored: the assertion in the loop was temporarily `assert.notEqual(slugify(once), once, title);`.

Command: `node --test test/slugify.test.js`, saved to `workflow/stages/02_build/output/logs/T004-red.log`.

Result lines:
- `ℹ tests 10`, `ℹ pass 9`, `ℹ fail 1`
- `✖ slugify is idempotent: slugify(slugify(x)) equals slugify(x)`
- `AssertionError [ERR_ASSERTION]: Hello World`, with `actual: 'hello-world'`, `expected: 'hello-world'`, `operator: 'notStrictEqual'`

This matches the spec's expected failure (the loop stops at the first title). The red form was then restored to `assert.equal(slugify(once), once, title);`, and a `git diff` check confirmed no `notEqual` remains.

Green: the same test passes on the unchanged `src/slugify.js` (gates below).

## Gates (run once, after all edits)

| Command | Exact result | Log |
|---|---|---|
| `npm run lint` | exit 0 (`node --check src/slugify.js && node --check bin/slugify.js`) | `workflow/stages/02_build/output/logs/T004-lint.log` |
| `node --test test/slugify.test.js` | tests 10, pass 10, fail 0 | `workflow/stages/02_build/output/logs/T004-unit-file.log` |
| `npm test` | tests 10, pass 10, fail 0 (exit 0) | `workflow/stages/02_build/output/logs/T004-npm-test.log` |

Tier: `test/` row (lint, file test, full unit suite). The critical-path row does not apply since `src/slugify.js` is unchanged.

Other checks: em dash count 0 in `test/slugify.test.js` and `docs/audit/task-ledger.md`.

## Left to the reviewer

- None of the gates are end-to-end. No `bin/` or `e2e/` path changed, so no e2e gate applies.
- The reviewer's stage 03 red-state repeat (spec step 6) and the `git diff --stat` / `git status --porcelain` checks.

## Not done

- Nothing in the spec was skipped. Commit cell in the ledger left empty, as the rules require.
- Note: `workflow/stages/01_spec/output/task-T004-spec.md` was already untracked before this build. It was not modified.
