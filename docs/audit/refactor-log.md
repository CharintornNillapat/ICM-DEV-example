# Refactor log

Append-only, newest entry first. One entry per **shipped phase**, never per commit.

Every entry keeps these headings, even when one is "none":

```
## Phase NNN - <title>: T001-T003 (<date>, code `<sha>`, docs `<sha>`, merged `<sha>`)

ADR `NNNN`. <the brief, one or two sentences>

**Changed:** <files and what changed>
**Verified:** <gate commands and their results>
**Surprises:** <or none>
**Deliberately not done:** <or none>
```

## Phase 003 - translit: T004, T005 (2026-11-04, code `1bed1ab`, docs `1bed1ab`, merged `e12b266`)

ADR `0004`. `slugify` spells `ß`, `æ`, `œ`, `ø`, `ł` and `đ`, and their capitals, in ASCII instead of turning them into hyphens: `'Straße'` becomes `'strasse'`. A test now pins `slugify(slugify(x))` equals `slugify(x)` (T004).

**Changed:** `docs/audit/task-ledger.md` and `test/slugify.test.js` (T004: the idempotence test and its ledger row); `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md` (new ADR, T005); `src/slugify.js` (`LETTERS` table and its replace after lowercasing, T005); `test/slugify.test.js` (spelling test, T005); `docs/contexts/slugify.md` (Traps line, T005); `docs/audit/refactor-log.md` (this entry); `docs/audit/task-ledger.md` (Phase 003 heading and T005 row).
**Verified:** npm run lint exit 0; node --test test/slugify.test.js tests 10 pass 10 fail 0; npm test tests 10 pass 10 fail 0; red run before the final assertion: tests 10 pass 9 fail 1 (output/logs/T004-red.log); e2e not run (no bin/ or e2e/ path); em dash 0 in touched files
T005: npm run lint exit 0; node --test test/slugify.test.js tests 11 pass 11 fail 0 (red run before edit 2: tests 11 pass 10 fail 1, output/logs/T005-red.log); npm test tests 11 pass 11 fail 0; node --test e2e/cli.test.js tests 1 pass 1 fail 0; npm run test:e2e left to the reviewer
Post-merge (PR #2, merge commit `e12b266`, a merge commit and not a squash; main checked out at it): npm run lint exit 0; npm test tests 11 pass 11 fail 0; npm run test:e2e tests 1 pass 1 fail 0. The repo has no CI workflow and no deployment, so no check ran on the PR and there is no production result (CI: none).
**Surprises:** the ADR-0004 escape gate typed inside a double-quoted shell command printed `false`; read from a script file it prints `true` (the file is unchanged, and the escapes are as the spec requires).
**Deliberately not done:** no letter beyond the six (`ð`, `þ`, `ı`); no per-language rules; no non-Latin scripts; ADR 0002 left as written; no version bump.

## Phase 002 - slug-limit: T002, T003 (2026-10-30, code `n/a (worked example; ran in ICM-DEV at 7b69497)`, docs `n/a (worked example; ran in ICM-DEV at 50d4e37)`, merged `n/a (worked example; ran in ICM-DEV at 9c33b67)`)

ADR `0003`. `slugify` returns at most 80 characters, cut at the last hyphen at or before the limit so no word is split; a first word longer than 80 is cut at 80.

**Changed:** `docs/audit/decisions/0003-cap-slug-length.md` (new ADR); `src/slugify.js` (MAX_LENGTH 80, cut at the last hyphen at or before index 80 after the slug is built); `test/slugify.test.js` (three tests for the 80-character cap); `docs/contexts/slugify.md` (Invariants line for the length rule); `README.md` (Limits section for the 80-character cap, T003); `docs/audit/refactor-log.md` (this entry, amended by T003); `docs/audit/task-ledger.md` (Phase 002 section and T002 and T003 rows).
**Verified:** npm run lint exit 0; node --test test/slugify.test.js tests 9 pass 9 fail 0; npm test tests 9 pass 9 fail 0; node --test e2e/cli.test.js tests 1 pass 1 fail 0; npm run test:e2e left to the reviewer
T003: docs only, no code tier: README edit 1 text present once and MAX_LENGTH 80 (ok, ok, exit 0); README eol i/lf w/crlf; cap check 77 80 80 and true; log names Phase 002 and README.md; em dash 0 in diff and in spec
Post-merge (ICM-DEV PR #2, merge commit `9c33b67`, a merge commit and not a squash; main checked out at it): npm run lint exit 0; npm test tests 9 pass 9 fail 0; npm run test:e2e tests 1 pass 1 fail 0. The repo has no CI workflow and no deployment, so no checks ran on the PR and there is no production result.
**Surprises:** none.
**Deliberately not done:** no option or CLI flag for the limit; no ellipsis or marker on a cut slug; no version bump; no `MAX_LENGTH` export.

## Phase 001 - accents: T001 (2026-10-30, code `n/a (worked example)`, docs `n/a (worked example)`, merged `n/a (worked example)`)

ADR `0002`. `slugify` keeps the base letter of accented Latin letters instead of turning them into hyphens: `'Café au lait'` becomes `'cafe-au-lait'`.

**Changed:** `docs/audit/decisions/0002-keep-accent-base-letters.md` (new ADR); `src/slugify.js` (NFD normalize and drop U+0300 to U+036F before lowercasing); `test/slugify.test.js` (two tests for accented Latin letters); `docs/contexts/slugify.md` (Traps line now states the accent rule); `docs/audit/refactor-log.md` (this entry); `docs/audit/task-ledger.md` (Phase 001 section and T001 row).
**Verified:** npm run lint exit 0; node --test test/slugify.test.js tests 6 pass 6 fail 0; npm test tests 6 pass 6 fail 0; node --test e2e/cli.test.js tests 1 pass 1 fail 0; npm run test:e2e left to the reviewer
**Surprises:** none.
**Deliberately not done:** no transliteration of `ø`, `ł`, `đ`, `ß`, `æ`, `œ`; no non-Latin scripts; no version bump.
