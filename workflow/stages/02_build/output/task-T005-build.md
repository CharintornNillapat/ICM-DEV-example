# Build report T005: spell the letters with no decomposition in ASCII

Spec: `workflow/stages/01_spec/output/task-T005-spec.md`. Branch `phase-003-translit`. Nothing committed or pushed. This task ships Phase 003, so it also wrote the refactor-log entry and the ADR Status line.

## Files changed (6)

Spec targets (5):

1. `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md` (new ADR; Edit 1, then Status line by Edit 6)
2. `test/slugify.test.js` (Edit 3: one test appended after line 71, CRLF kept)
3. `src/slugify.js` (Edit 2: `LETTERS` constant and one `replace` after `toLowerCase`, CRLF kept, ASCII escapes kept)
4. `docs/contexts/slugify.md` (Edit 4: Traps line, CRLF kept)
5. `docs/audit/refactor-log.md` (Edit 5: Phase 003 entry above Phase 002, CRLF kept)

Bookkeeping (1):

6. `docs/audit/task-ledger.md` (Phase 003 heading now `(ADR 0004)`; T005 row added; CRLF kept; Commit cell empty)

Not changed: `bin/slugify.js`, `e2e/cli.test.js`, `README.md`, `package.json`, `docs/audit/decisions/0002-*.md`. Ignored, written under `output/`: `logs/T005-*.log`.

## Tests added and fail-then-pass evidence

- Added `spells letters with no decomposition in ASCII` (four assertions: `Straße GROẞ`, `Æsir Œuvre`, `Søren Łódź`, `Đorđe`).
- Red run, command `node --test test/slugify.test.js`, after edit 3 and before edit 2. Log: `workflow/stages/02_build/output/logs/T005-red.log`. Result: `tests 11`, `pass 10`, `fail 1`. Failure: `actual 'stra-e-gro'`, `expected 'strasse-gross'` at `test/slugify.test.js:74`, as the spec predicted.
- Green run after edit 2: `tests 11`, `pass 11`, `fail 0`.

## Gates (run once, after all code edits)

Shell: Git Bash, `NO_COLOR=1`, from the repository root.

| Command | Result | Log |
|---|---|---|
| `npm run lint` | exit 0 | `workflow/stages/02_build/output/logs/T005-lint.log` |
| `node --test test/slugify.test.js` | tests 11, pass 11, fail 0 | `workflow/stages/02_build/output/logs/T005-unit-file.log` |
| `npm test` | tests 11, pass 11, fail 0 | `workflow/stages/02_build/output/logs/T005-test.log` |
| `node --test e2e/cli.test.js` (fast form) | tests 1, pass 1, fail 0 | `workflow/stages/02_build/output/logs/T005-e2e.log` |
| `npm run test:e2e` (full form) | Left to the reviewer | none |

Text-landed check (spec, stage 02 step 5): run from a script file, not inline, so the escapes reach Node intact. Nine `ok` lines (the 8 edit checks plus the ADR equality check), exit 0. The ADR equals edit 1 with edit 6 applied.

Escapes check (spec, edit 2): prints `true` when run from a script file. The same check typed inline in a double-quoted shell command printed `false` because the shell mangled the backslashes; the file itself is correct (`[̀-ͯ]` as ASCII escapes, no literal combining marks, confirmed with a char-code check).

Docs row: `git show da13c91:src/slugify.js | sed -n '6,9p'` prints the four lines from `.normalize('NFD')` to `.replace(/[^a-z0-9]+/g, '-')`, as the ADR cites.

Em dash (U+2014): 0 in the added lines of `git diff -U0 HEAD`; 0 in each touched or new file (ADR, test, src, context, refactor-log, ledger) and in the spec.

Line endings: `src/slugify.js`, `test/slugify.test.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md` and `docs/audit/task-ledger.md` are all `w/crlf` after the edits, as before. The new ADR is `w/lf`, matching ADRs 0002 and 0003.

Spot checks through the module: `SØREN` gives `soren`; `Straße GROẞ` gives `strasse-gross`; `ǿ` gives `o`; `Łódź` gives `lodz`; `ßßß` gives `ssssss`; `Ð ð þ ı` gives `''`.

## Order of work and deviations

- Followed the spec's order: ADR (edit 1), test, red run, code (edit 2), tests, context (edit 4), then ledger and refactor-log (edit 5), then ADR Status (edit 6).
- The T005 ledger Gate result and the refactor-log `Verified` lines quote the gate results, so the code gates ran before those bookkeeping cells were written. No code file changed after the gates.
- The ledger row's Status went straight to `done`; I did not write `in-progress` first.
- The refactor-log entry's `Surprises` names the shell escape quirk above, because this report names it.

## Not done

- Full-form e2e (`npm run test:e2e`): Left to the reviewer.
- Commit cell left empty, as the rules require. Nothing committed, pushed or merged.
- `<sha>` placeholders in the ADR Status line and the refactor-log header are kept for the deploy record.
- No version bump, no README change, no CLI test for the new letters (spec, section 9).
