# 0004: spell the letters with no decomposition in ASCII

**Status:** Accepted. Implemented in Phase 003 (T004 to T005): code `<sha>`, merged `<sha>`.

**Date:** 2026-11-04

## Context

ADR 0002 keeps the base letter of an accented Latin letter: `slugify` decomposes its input with `normalize('NFD')` and drops U+0300 to U+036F (`src/slugify.js:6-7` at `da13c91`). Its D2 left out the letters Unicode does not decompose, so the step that turns every run outside `[a-z0-9]` into a hyphen (`src/slugify.js:9`) turns each of them into one: `slugify('Straße')` returns `'stra-e'`, `slugify('Søren Łódź')` returns `'s-ren-odz'` and `slugify('Æsir Œuvre')` returns `'sir-uvre'`. The owner wants six of them spelled in ASCII: `ß` to `ss`, `æ` to `ae`, `œ` to `oe`, `ø` to `o`, `ł` to `l`, `đ` to `d`.

## Decision

- **D1: A six-letter table, applied after lowercasing.** `slugify` replaces each of `ß`, `æ`, `œ`, `ø`, `ł`, `đ` with `ss`, `ae`, `oe`, `o`, `l`, `d` from the module constant `LETTERS`, right after `toLowerCase` and before the runs outside `[a-z0-9]` become hyphens. This replaces ADR 0002 D2 for these six letters.
- **D2: Capitals go through the lowercasing.** `toLowerCase` turns `ẞ`, `Æ`, `Œ`, `Ø`, `Ł`, `Đ` into the six lowercase letters, so the table holds lowercase keys only. A letter built on one of them with a mark, such as `ǿ`, loses the mark under ADR 0002 and then maps too (`o`).
- **D3: The cap comes after.** `ß` grows to two characters, so the table runs before the 80-character cap of ADR 0003, which still applies to the finished slug.

## Alternatives

- **Keep the hyphens, as today (rejected).** No code to add, but `'Straße'` stays `'stra-e'`: one word split in two and a letter lost. This is the gap the owner asked to close.
- **Drop the letters (rejected).** Adding them to the strip at `src/slugify.js:7` would keep words whole, but `'Straße'` becomes `'strae'` and `'Søren'` becomes `'sren'`, which reads worse than the ASCII spelling for about the same code.
- **A wider table (not now).** `ð`, `þ`, `ı`, `ħ` and other letters with no decomposition could join it, but the owner named six; add a letter when a title needs it.
- **Per-language spelling (rejected).** German writes `ä` as `ae`, which conflicts with ADR 0002's `a` and needs a language parameter no caller has.
- **A slug library from npm (rejected).** `AGENTS.md` forbids dependencies.

## Consequences

- Every title with one of the six letters or their capitals gets a new slug (`stra-e` becomes `strasse`). This package stores no slugs, but a caller that stored old ones and recomputes them to look them up will miss.
- The slug invariants in `docs/contexts/slugify.md` still hold: the table emits only `a` to `z`, so the output is still ASCII and `slugify(slugify(x))` equals `slugify(x)`.
- `src/slugify.js` now holds non-ASCII characters (the table's keys and its character class).

## Not done

- No other letter with no decomposition: `ð`, `þ`, `ı` and the like still turn into hyphens.
- No per-language rules and no non-Latin scripts.
- ADR 0002 is left as written; this ADR replaces its D2 for the six letters.
- No README example and no `version` change in `package.json`.

## Release

One pull request. No production touch point. `src/slugify.js` is a critical path on the pause list, so the owner merges it. No owner action after the merge.
