# Spec T004: pin the idempotence rule with a test

Phase 003 (branch `phase-003-translit`). Light reviewer.

## Goal

Add one test to `test/slugify.test.js` that pins the invariant in `docs/contexts/slugify.md:14`, `slugify(slugify(x))` equals `slugify(x)`, over every title the existing tests use plus one new title longer than 80 characters. Test only: no file under `src/` or `bin/` changes.

## Target files

- `test/slugify.test.js`
- `docs/audit/task-ledger.md` (bookkeeping: add the Phase 003 block and the T004 row, see Tests to add, step 5)

No ADR: the test pins a rule that already exists and is already documented, so there is no decision to record. No `docs/contexts/slugify.md` edit: line 14 already states the rule.

## Context to read

`docs/contexts/slugify.md`, for the invariants (lines 9 to 14) and the test list (lines 20 to 23).

## Current behaviour

- `slugify` (`src/slugify.js:4-14`) is pure: NFD-normalise and strip U+0300 to U+036F (lines 6-7), lowercase (8), collapse non-`[a-z0-9]` runs to one hyphen (9), trim hyphens (10), then cap at `MAX_LENGTH` 80 by cutting at the last hyphen at or before index 80, or at 80 when there is none (lines 11-13).
- Idempotence holds today for every title below (its output is already `[a-z0-9]` and hyphens, at most 80 characters, with no leading or trailing hyphen, so a second pass changes nothing). Only one assertion pins it: `test/slugify.test.js:36`, for the 20-word title alone. The accent, punctuation, trim, empty and exact-80 cases are not checked for it.
- The titles the existing tests use: `test/slugify.test.js:6` `'Hello World'`; `:10` `'Hello,   World!!'`; `:14` `'  --Hello--  '`; `:18` `'!!!'`; `:22` `'Café au lait'`; `:23` `'Crème Brûlée'`; `:24` `'ÉCOLE Ñandú'`; `:28` `'Phở Việt'`; `:29` `'Résumé'`; `:33` the 20-word title `Array.from({ length: 20 }, (_, i) => `Word${i % 10}`).join(' ')`; `:40` `` `${'x'.repeat(39)} ${'y'.repeat(40)} z` ``; `:41` `'a'.repeat(80)`; `:45` `'a'.repeat(100)`.
- The new long title, checked by running it: `'The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly'` is 86 characters; its slug is cut at the hyphen at index 78 and is `the-quick-brown-fox-jumps-over-the-lazy-dog-while-the-five-boxing-wizards-jump` (78 characters); `slugify` of that slug returns it unchanged.

## Parity map

none. No export of `src/slugify.js` changes, so the README and the CLI are untouched.

## Tests to add

This task only adds a test over behaviour that already holds, so no unchanged code exists to fail against: the new test passes on the current `src/slugify.js` by design. Per stage 01's rule for a test-only task, the red run happens inside the test file.

1. **Order.** Add the test below with the red form of its assertion (step 3), run `node --test test/slugify.test.js`, save the output to `workflow/stages/02_build/output/logs/T004-red.log`, then change the assertion to its final form (step 2) and run the gates.
2. **The test** (append at the end of `test/slugify.test.js`, after the last test, one blank line before it, keeping the file's existing line endings). This is the final text:

```js
test('slugify is idempotent: slugify(slugify(x)) equals slugify(x)', () => {
  const longTitle = 'The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly';
  assert.ok(longTitle.length > 80);
  const titles = [
    'Hello World',
    'Hello,   World!!',
    '  --Hello--  ',
    '!!!',
    'Café au lait',
    'Crème Brûlée',
    'ÉCOLE Ñandú',
    'Phở Việt',
    'Résumé',
    Array.from({ length: 20 }, (_, i) => `Word${i % 10}`).join(' '),
    `${'x'.repeat(39)} ${'y'.repeat(40)} z`,
    'a'.repeat(80),
    'a'.repeat(100),
    longTitle,
  ];
  for (const title of titles) {
    const once = slugify(title);
    assert.equal(slugify(once), once, title);
  }
});
```

3. **Red state.** The temporary edit that takes the finished test back to red: in the `for` loop, replace the line

```js
    assert.equal(slugify(once), once, title);
```

with

```js
    assert.notEqual(slugify(once), once, title);
```

Expected failure: `node --test test/slugify.test.js` reports `fail 1` for this test, an `AssertionError` whose message is the first title, `Hello World` (the loop stops at the first title). Put the final line back before the gates and confirm with `git diff` that the red form is gone. The reviewer repeats this edit in stage 03 step 6 and restores it.
4. **What the test catches.** A change to `src/slugify.js` that makes a second pass alter a slug: for example a cap that cuts at a place that leaves a trailing hyphen, a transliteration that emits a non-`[a-z0-9]` character, or a normalisation that is not stable. It must not change `src/`.
5. **Ledger.** Above `## Backlog` in `docs/audit/task-ledger.md`, add the Phase 003 block from the Phase template: heading `## Phase 003 - translit`, branch `phase-003-translit`, cut from `main` at `e79d24e`, "No production touch point.", with a T004 row: task "Pin slugify(slugify(x)) equals slugify(x) with a test", files `` `test/slugify.test.js`, `docs/audit/task-ledger.md` ``, Status `in-progress` while building then `done`, Commit empty, Gate result filled with the commands and results. No Backlog row is named by this order, so none changes. Do not write `refactor-log.md` (this task does not ship the phase).

## Gates

The changed path is `test/` (tier row `src/`, `test/`). The critical-path row does not apply, since `src/slugify.js` is not changed; the red run above stands in for it.

Builder (stage 02):

```
npm run lint
node --test test/slugify.test.js
npm test
```

Reviewer (stage 03), the same three plus a check that nothing outside the Target files changed and that no em dash was added:

```
npm run lint
node --test test/slugify.test.js
npm test
git diff --stat
git status --porcelain
```

No end-to-end gate: no `bin/` or `e2e/` path changes.

## Production touch points

none.

## Out of scope

- Any change to `src/slugify.js`, `bin/slugify.js`, `README.md`, `e2e/`, `package.json` or `docs/contexts/slugify.md`.
- Editing or merging the existing assertion at `test/slugify.test.js:36`; leave it as is.
- Adding a transliteration feature, a helper, a fixture file or a table-driven refactor of the other tests, even though the phase is named `translit`.
- Adding an ADR or a `refactor-log.md` entry.
- An em dash (U+2014) anywhere in the files touched.
