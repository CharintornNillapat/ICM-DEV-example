# Review T005: spell the letters with no decomposition in ASCII

## Round 1

### Metadata

- Task: T005 (Phase 003, branch `phase-003-translit`; ships the phase)
- Date: 2026-11-04
- Round: 1
- Verdict: APPROVED
- Target files: `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md`, `test/slugify.test.js`, `src/slugify.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md` (plus bookkeeping `docs/audit/task-ledger.md`). `git check-ignore -v` on the five targets: none ignored (exit 1).

### Summary

`src/slugify.js` gains a module constant `LETTERS` and one `replace` right after `toLowerCase`, so `ß`, `æ`, `œ`, `ø`, `ł`, `đ` (and their capitals, through the lowercasing) become `ss`, `ae`, `oe`, `o`, `l`, `d` instead of hyphens. A new unit test pins the four title cases, ADR 0004 records the decision, the context file's Traps line states the new rule, and the phase-shipping bookkeeping (refactor-log Phase 003 entry, ADR Status line, ledger heading and T005 row) is in place.

### Invariants and parity

- Parity row "exports of `src/slugify.js` / README usage and `bin/slugify.js`": holds. The only export is still `slugify(title)`; `LETTERS` is not exported. `README.md:8-13` uses `'Hello, World!'` / `Hello World`, unaffected. `bin/slugify.js` and `README.md` unchanged (not in `git status`). Guarded by `test/slugify.test.js` and `e2e/cli.test.js`, both green below.
- Pure function: the new line is a pure `replace` with a lookup into a frozen-in-practice constant; no I/O, no state.
- Slug regex `/^[a-z0-9]+(-[a-z0-9]+)*$/` or empty: the table emits only `a` to `z`. Spot checks (all match the regex, all idempotent): `SØREN` and `Søren` to `soren`, `ǿ` to `o`, `ßßß` to `ssssss`, `ẞ` to `ss`, `Ǣ` and `ǽ` to `ae`, `Œ-Æ ł Đ` to `oe-ae-l-d`, `Ð ð þ ı` to `''`, `x` plus 45 `ß` to 80 characters (cap applies after growth, ADR 0004 D3).
- Full text of the changed function `slugify` (`src/slugify.js:5-16`) read: order is NFD, strip U+0300 to U+036F, lowercase, table, hyphenate, trim, cap. Matches spec edit 2 exactly.
- No dependency added; relative ESM import unchanged.
- ASCII escapes kept: `src/slugify.js` holds `[̀-ͯ]` as ASCII and no literal combining mark (script check: `true`). No BOM; file ends `}\r\n`.
- Line endings: `src/slugify.js`, `test/slugify.test.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md`, `docs/audit/task-ledger.md` are still `i/lf w/crlf` with 0 LF-only lines; the new ADR is LF, like 0002 and 0003.
- Phase ADR Status (step 5): `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md:3` reads exactly `**Status:** Accepted. Implemented in Phase 003 (T004 to T005): code `<sha>`, merged `<sha>`.`, both placeholders in. The whole ADR equals edit 1 with edit 6 applied.
- ADR citation: `git show da13c91:src/slugify.js | sed -n '6,9p'` prints `.normalize('NFD')` to `.replace(/[^a-z0-9]+/g, '-')`; line 7 is the strip and line 9 the hyphenation, as the ADR cites.
- Ledger: heading `## Phase 003 - translit (ADR 0004)`; T005 row below T004 with Status `done`, Commit empty. Refactor-log Phase 003 entry sits above Phase 002, names T004 and T005, keeps all three `<sha>` placeholders and the four headings; Changed matches `git show --stat da13c91` (ledger, test) plus T005's status, `workflow/stages/*/output/` left out; Verified copies both Gate result cells word for word; Deliberately not done names every item the spec requires.
- Scope: `git diff --stat` shows 5 tracked files (22 insertions, 2 deletions); `git status --porcelain` adds the new ADR, the spec and the build report. Every file is a spec target, bookkeeping or a stage output. No unannounced change.

### Gates run

Git Bash, repository root, `NO_COLOR=1`. Logs in `workflow/stages/03_review/output/logs/`.

| Command | Result | Log |
|---|---|---|
| `npm run lint` | exit 0 | `T005-lint.log` |
| `node --test test/slugify.test.js` | tests 11, suites 0, pass 11, fail 0, skipped 0 | `T005-unit-file.log` |
| `npm test` | tests 11, pass 11, fail 0, skipped 0 | `T005-test.log` |
| `npm run test:e2e` (full form; covers `e2e/cli.test.js`, so the fast form was not rerun) | tests 1, pass 1, fail 0, skipped 0 | `T005-e2e.log` |
| Text-landed check (spec section 7, run from a script file) | nine `ok` lines, exit 0 | `T005-text.log` |
| Escapes kept (script file) | `true` | `T005-text.log` |
| Docs row `git show da13c91:src/slugify.js \| sed -n '6,9p'` | the four expected lines | (inline above) |
| Em dash: added lines of `git diff -U0 HEAD`; new ADR; spec; build report; each touched file | 0 in every one | `T005-text.log` |

Red run (step 6, method 1, worktree): `git worktree add --detach workflow/stages/03_review/output/logs/T005-red HEAD` (HEAD `da13c91`), copied in only `test/slugify.test.js`, ran `node --test test/slugify.test.js` inside it: tests 11, pass 10, fail 1; the failing test is `spells letters with no decomposition in ASCII` at `test/slugify.test.js:74`, actual `'stra-e-gro'`, expected `'strasse-gross'`, the failure the spec gives (an assertion failure, not an import or syntax error). Log: `T005-red.log`. Cleanup: `git worktree remove --force`, then `git worktree list` shows one entry, and `git status --porcelain` after is identical to the record before (diffed: identical).

### Not verified

- Red run used method 1 (worktree), the stage file's default; it applied, so the spec's suggested stash (method 3) was not needed and no tracked file was touched.
- The spec's "Escapes kept" and text-landed gates were run from a script file, not inline. Typed inline in this Bash tool as the spec writes it, the escapes gate printed `false`, because the backslashes reach Node already collapsed (`'[\\\\u0300-\\\\u036f]'` evaluates to the literal marks); the builder saw the same. The file itself is correct, checked from the script.
- The fast-form e2e (`node --test e2e/cli.test.js`) was not rerun: the full form covers the same file (stage 03 step 4).

### Blocking

None.

### Non-blocking

- [follow-up] `workflow/stages/01_spec/output/task-T005-spec.md:108` - the inline `node -e "..."` escapes gate gives a false `false` in Git Bash under this tool, so as written it cannot pass; future specs should ship such checks as a script or use `String.fromCharCode(92)` instead of backslash escapes inside a double-quoted shell string.
- [nit] `docs/audit/refactor-log.md` Phase 003 Surprises - "the ADR-0004 escape gate" is the spec's escape gate, not the ADR's; wording only, and the deploy record must not rewrite it.
- [nit] `docs/audit/task-ledger.md` T005 row - Status went straight to `done` without an `in-progress` step; the build report announces it and the end state is right.

### Rule candidates

- [generic] A gate that checks for backslash escapes (`̀`) in a source file is written as a script file or builds the backslash with `String.fromCharCode(92)`, never as escapes inside a double-quoted `node -e` string: Git Bash and the tool layer collapse the backslashes, so the inline check reports `false` on a correct file.
