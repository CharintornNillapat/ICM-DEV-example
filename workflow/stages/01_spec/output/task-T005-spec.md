# Task T005 spec: spell the letters with no decomposition in ASCII

Phase 003 (branch `phase-003-translit`, cut from `main` at `e79d24e`). Strict reviewer, 2026-11-04. T005 is the phase's last task, so it ships Phase 003.

## 1. Goal

`slugify` turns the six Latin letters that have no accent decomposition into ASCII instead of hyphens: `ß` to `ss`, `æ` to `ae`, `œ` to `oe`, `ø` to `o`, `ł` to `l`, `đ` to `d` (ADR 0002 D2 left them out on purpose). The decision goes in a new ADR first, with the alternatives "keep the hyphens" and "drop the letters".

**Calls taken for the owner (check them at the pause):**

- **Capitals are covered too.** `ẞ`, `Æ`, `Œ`, `Ø`, `Ł`, `Đ` lowercase onto the six letters (measured below), so the table runs after `toLowerCase` and holds lowercase keys only. `'Søren'` and `'SØREN'` both give `soren`.
- **Only these six.** `ð`, `þ`, `ı` and other letters with no decomposition still turn into hyphens (ADR 0004 Not done).
- **ADR 0002 is not edited.** ADR 0004 says it replaces 0002's D2 for the six letters; 0002 stays as the record of its phase.

## 2. Target files

```
docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md
test/slugify.test.js
src/slugify.js
docs/contexts/slugify.md
docs/audit/refactor-log.md
```

Order of work: the ADR first (edit 1), then the test and its red run (edit 3), then the code (edit 2), then the context file (edit 4), then the ledger row, then the refactor-log entry (edit 5), then the ADR's Status line (edit 6). Bookkeeping (`docs/audit/task-ledger.md`, `workflow/stages/02_build/output/*`) is allowed as usual.

Why `docs/audit/refactor-log.md` and edit 6: T005 is Phase 003's last task, so it ships the phase (`AGENTS.md` Workflow). The ADR's Status line after edit 6 is exactly:

```
**Status:** Accepted. Implemented in Phase 003 (T004 to T005): code `<sha>`, merged `<sha>`.
```

Both `<sha>` placeholders stay; the deploy record fills them.

## 3. Context to read

- `docs/contexts/slugify.md`: the task changes `src/slugify.js` and its tests. The Invariants (lines 11 to 14) must still hold; edit 4 rewrites the Traps line (line 18), which today says these letters turn into hyphens.

## 4. Current behaviour

- `src/slugify.js:5-10` builds the slug in one chain: `String`, `normalize('NFD')` (line 6), drop U+0300 to U+036F (line 7), `toLowerCase` (line 8), every run outside `[a-z0-9]` to one `-` (line 9), trim hyphens (line 10). Lines 11 to 13 cap it at `MAX_LENGTH` 80 (`src/slugify.js:1`).
- None of `ß` (U+00DF), `æ` (U+00E6), `œ` (U+0153), `ø` (U+00F8), `ł` (U+0142), `đ` (U+0111) changes under `normalize('NFD')`, so line 7 leaves them and line 9 turns each into a hyphen. Their capitals `ẞ` (U+1E9E), `Æ`, `Œ`, `Ø`, `Ł`, `Đ` lowercase onto them at line 8 (`'ẞ'.toLowerCase()` is `'ß'`).
- Measured on `da13c91` with Node v24.19.0:
  - `slugify('Straße GROẞ')` is `'stra-e-gro'`.
  - `slugify('Æsir Œuvre')` is `'sir-uvre'`.
  - `slugify('Søren Łódź')` is `'s-ren-odz'`.
  - `slugify('Đorđe')` is `'or-e'`.
  - `slugify('Ð ð þ ı')` is `''` (and stays so after the change).
- `test/slugify.test.js:5-71` holds ten tests; none uses one of the six letters or their capitals, so none changes result.
- `bin/slugify.js:4` prints `slugify` of its joined arguments, so the CLI inherits the change with no edit.
- `docs/contexts/slugify.md:18` says `ø`, `ł`, `ß` and `æ` still turn into hyphens.
- `docs/audit/decisions/` holds ADRs 0000 (template) to 0003, so the next is 0004.
- `git ls-files --eol` shows `src/slugify.js`, `test/slugify.test.js`, `docs/contexts/slugify.md`, `docs/audit/refactor-log.md` and `docs/audit/task-ledger.md` as `i/lf w/crlf`; `core.autocrlf` is `true`. Keep each file's existing line endings.

## 5. Parity map

- Row "The exports of `src/slugify.js` / The usage example in `README.md` and the CLI in `bin/slugify.js`": touched but unchanged. The export stays one function, `slugify(title)`, with the same signature (the new `LETTERS` constant is not exported); `README.md`'s examples (`'hello-world'`, `hello-world`) use none of the six letters and still hold; `bin/slugify.js` needs no edit. Guarded by `test/slugify.test.js` and `e2e/cli.test.js`, both in the gates.

## 6. Tests to add

One test in `test/slugify.test.js`, appended after line 71 (the end of the idempotence test), one blank line before it, the file ending in a single newline (edit 3). It fails today because `src/slugify.js:9` turns each of the six letters into a hyphen.

1. `spells letters with no decomposition in ASCII`: one assertion per letter pair, the capitals `ẞ`, `Æ`, `Œ`, `Ł`, `Đ` included, and `Łódź` mixing a table letter with two that decompose. Fails today on its first assertion: actual `'stra-e-gro'`, expected `'strasse-gross'`.

Red run (stage 02 step 4): after adding the test and before edit 2, run `node --test test/slugify.test.js` and save it to `workflow/stages/02_build/output/logs/T005-red.log`. It must show `tests 11`, `pass 10`, `fail 1`, the failure above. After edit 2 the same command shows `tests 11`, `pass 11`, `fail 0`. Both counts were checked on a scratch copy while writing this spec.

Note for the reviewer (stage 03 step 6): `src/slugify.js` is `w/crlf`, so step 6.2's `git stash push -- src/slugify.js` applies; the new test depends only on that file. The expected red run is the one above.

## 7. Gates

Run in Git Bash from the repository root (it is the project folder, so a `git show <rev>:` path is written `<path>`), after all edits, with `NO_COLOR=1`, saving each full-suite run to the stage's `output/logs/T005-<suite>.log` as the stage files say.

From the `src/`, `test/` row, and the critical-path row (red run above):

```
npm run lint
```

```
node --test test/slugify.test.js
```

```
npm test
```

From the code-tier rule (the affected end-to-end spec: the CLI imports `src/slugify.js`), fast form for the builder, then full form for the reviewer:

```
node --test e2e/cli.test.js
```

```
npm run test:e2e
```

Expected: lint exits 0; `node --test test/slugify.test.js` and `npm test` show `tests 11`, `pass 11`, `fail 0`; both end-to-end forms show `tests 1`, `pass 1`, `fail 0`.

Text landed (stage 02 step 5): reads edits 1 to 6 from this spec's fenced blocks; it must print nine `ok` lines and exit 0. The `ADR` line checks the whole ADR equals edit 1's text with edit 6 applied.

```
node -e "const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const spec=rd('workflow/stages/01_spec/output/task-T005-spec.md');const blk=l=>{const i=spec.indexOf('\n'+l+'\n');if(i<0)throw new Error('no label '+l);return spec.slice(i).match(/\n([\x60~]{3,})[a-z]*\n([\s\S]*?)\n\1\n/)[2]};const adr='docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md';const want=[['Edit 2 old text:','src/slugify.js',0],['Edit 2 new text:','src/slugify.js',1],['Edit 3 new text:','test/slugify.test.js',1],['Edit 4 old text:','docs/contexts/slugify.md',0],['Edit 4 new text:','docs/contexts/slugify.md',1],['Edit 5 new text:','docs/audit/refactor-log.md',1],['Edit 6 old text:',adr,0],['Edit 6 new text:',adr,1]];let bad=0;for(const [l,f,n] of want){const k=rd(f).split(blk(l)).length-1;console.log(k===n?'ok ':'BAD',l,f,'count='+k,'want='+n);if(k!==n)bad=1}const full=blk('Edit 1 new text:').replace(blk('Edit 6 old text:'),blk('Edit 6 new text:'))+'\n';const same=rd(adr)===full;console.log(same?'ok ':'BAD','ADR',adr,'equals edit 1 with edit 6');if(!same)bad=1;process.exit(bad)"
```

Escapes kept (edit 2): `src/slugify.js` must still hold the ASCII escapes `\u0300` and `\u036f`, not literal combining marks; this prints `true`:

```
node -e "const s=require('fs').readFileSync('src/slugify.js','utf8');console.log(s.includes('[\\\\u0300-\\\\u036f]')&&!/[\u0300-\u036f]/.test(s))"
```

Docs rows (the ADR cites lines): the ADR cites `src/slugify.js:6-9` at `da13c91`; this must print the four lines from `.normalize('NFD')` to `.replace(/[^a-z0-9]+/g, '-')`:

```
git show da13c91:src/slugify.js | sed -n '6,9p'
```

Ledger and log: `docs/audit/task-ledger.md` has the heading `## Phase 003 - translit (ADR 0004)` and a T005 row with Status `done`; the refactor-log's Phase 003 entry sits above the Phase 002 entry and names both T004 and T005.

No em dash (U+2014), in the added lines of tracked files and in the new or written files; every count must be 0:

```
node -e "const o=require('child_process').execSync('git diff -U0 HEAD',{encoding:'utf8',maxBuffer:1<<28});console.log(o.split('\n').filter(l=>l.startsWith('+')&&!l.startsWith('+++')).join('\n').split('\u2014').length-1)"
```

```
node -e "for(const f of process.argv.slice(1))console.log(f,require('fs').readFileSync(f,'utf8').split('\u2014').length-1)" docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md workflow/stages/01_spec/output/task-T005-spec.md
```

The build report and the review are checked the same way by the stage that writes each one, after writing it.

## 8. Production touch points

none. (The orchestrator still pauses after this spec: `src/slugify.js` is a critical path on the pause list. No version bump, no publish. The phase's PR is not auto-merged for the same reason; the owner merges it.)

## 9. Out of scope

- `bin/slugify.js`, `e2e/cli.test.js`, `README.md`, `package.json`: no edit; the parity row holds unchanged (section 5). No CLI test for the new letters.
- `docs/audit/decisions/0002-keep-accent-base-letters.md` and the Phase 001 and Phase 002 entries of `docs/audit/refactor-log.md`: history, not edited, though they say these letters become hyphens.
- The ten existing tests in `test/slugify.test.js:5-71`, the T004 idempotence test's title list included: not changed.
- The JSDoc line `src/slugify.js:3`: unchanged (it is still true).
- Any letter beyond the six (`ð`, `þ`, `ı`, `ħ` and the like), any per-language rule (German `ä` to `ae`), non-Latin scripts, an option to turn the table off, exporting `LETTERS`.
- `AGENTS.md`, any dependency.

## Edits

### Edit 1: new file `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md`

The whole file, ending in a single newline. Write it first, before any test or code; edit 6 changes its Status line when the phase ships.

Edit 1 new text:

```markdown
# 0004: spell the letters with no decomposition in ASCII

**Status:** Accepted. To be implemented in Phase 003 (T005).

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
```

### Edit 2: `src/slugify.js`, the whole file

Replace the whole file (lines 1 to 14; this text occurs once):

Edit 2 old text:

```js
const MAX_LENGTH = 80;

/** Turn a title into a URL slug: lowercase ASCII letters and digits joined by single hyphens, at most 80 characters, cut at a hyphen. */
export function slugify(title) {
  const slug = String(title)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= MAX_LENGTH) return slug;
  const cut = slug.lastIndexOf('-', MAX_LENGTH);
  return cut === -1 ? slug.slice(0, MAX_LENGTH) : slug.slice(0, cut);
}
```

with this text, the file ending in a single newline (two lines added: `LETTERS` at line 2 and the table's `replace` at line 10):

Edit 2 new text:

```js
const MAX_LENGTH = 80;
const LETTERS = { ß: 'ss', æ: 'ae', œ: 'oe', ø: 'o', ł: 'l', đ: 'd' };

/** Turn a title into a URL slug: lowercase ASCII letters and digits joined by single hyphens, at most 80 characters, cut at a hyphen. */
export function slugify(title) {
  const slug = String(title)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[ßæœøłđ]/g, (letter) => LETTERS[letter])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= MAX_LENGTH) return slug;
  const cut = slug.lastIndexOf('-', MAX_LENGTH);
  return cut === -1 ? slug.slice(0, MAX_LENGTH) : slug.slice(0, cut);
}
```

Keep the escapes `\u0300` and `\u036f` as written (ASCII in the source; the "Escapes kept" gate checks it). Writing this spec, both the file tool and the shell tool turned such escapes into literal marks; if that happens, rebuild them from char codes (`String.fromCharCode(92)` plus `u0300`) rather than retyping them. The six letters in `LETTERS` and in the character class are literal characters, saved as UTF-8 with no byte order mark.

### Edit 3: `test/slugify.test.js`, append after line 71

One blank line after line 71, then this text, then a single final newline.

Edit 3 new text:

```js
test('spells letters with no decomposition in ASCII', () => {
  assert.equal(slugify('Straße GROẞ'), 'strasse-gross');
  assert.equal(slugify('Æsir Œuvre'), 'aesir-oeuvre');
  assert.equal(slugify('Søren Łódź'), 'soren-lodz');
  assert.equal(slugify('Đorđe'), 'dorde');
});
```

### Edit 4: `docs/contexts/slugify.md`, replace line 18 (Traps)

Edit 4 old text:

```markdown
- Accented Latin letters keep their base letter: `slugify` decomposes its input with `normalize('NFD')` and drops the marks in U+0300 to U+036F before it lowercases (ADR 0002). A letter with no decomposition, such as `ø`, `ł`, `ß` or `æ`, still turns into a hyphen. Any change to how non-ASCII letters are handled changes the output for every title that has one.
```

Edit 4 new text:

```markdown
- Accented Latin letters keep their base letter: `slugify` decomposes its input with `normalize('NFD')` and drops the marks in U+0300 to U+036F before it lowercases (ADR 0002). Right after it lowercases, the six letters with no decomposition are spelled in ASCII from `LETTERS`: `ß` to `ss`, `æ` to `ae`, `œ` to `oe`, `ø` to `o`, `ł` to `l`, `đ` to `d`; their capitals reach the table through the lowercasing (ADR 0004). Any other letter outside `[a-z0-9]`, such as `ð`, `þ` or `ı`, still turns into a hyphen. Any change to how non-ASCII letters are handled changes the output for every title that has one.
```

### Edit 5: `docs/audit/refactor-log.md`, the Phase 003 entry

Add the entry above the Phase 002 entry and below the template block, newest first, following stage 02's Outputs rules: Changed from `git show --stat da13c91` (T004) and T005's `git status --porcelain`, leaving out `workflow/stages/*/output/`; Verified copied word for word from the T004 and T005 Gate result cells, T004's first, T005's on its own line starting `T005: ` (as the Phase 002 entry does for T003); Surprises only from a review or build report; the header keeping its `<sha>` placeholders. Header and brief:

Edit 5 new text:

```markdown
## Phase 003 - translit: T004, T005 (2026-11-04, code `<sha>`, docs `<sha>`, merged `<sha>`)

ADR `0004`. `slugify` spells `ß`, `æ`, `œ`, `ø`, `ł` and `đ`, and their capitals, in ASCII instead of turning them into hyphens: `'Straße'` becomes `'strasse'`. A test now pins `slugify(slugify(x))` equals `slugify(x)` (T004).
```

**Deliberately not done** names at least: no letter beyond the six (`ð`, `þ`, `ı`); no per-language rules; no non-Latin scripts; ADR 0002 left as written; no version bump.

### Edit 6: the ADR's Status line, when the phase ships

After the refactor-log entry, in `docs/audit/decisions/0004-spell-undecomposed-letters-in-ascii.md`, replace this line (it occurs once):

Edit 6 old text:

```markdown
**Status:** Accepted. To be implemented in Phase 003 (T005).
```

with this line:

Edit 6 new text:

```markdown
**Status:** Accepted. Implemented in Phase 003 (T004 to T005): code `<sha>`, merged `<sha>`.
```

### Ledger row

In `docs/audit/task-ledger.md`, change the heading `## Phase 003 - translit` to `## Phase 003 - translit (ADR 0004)`, leave the branch line and the T004 row as they are, and add row T005 below T004: Task `Spell ß, æ, œ, ø, ł, đ in ASCII instead of hyphens`, Files the five target files and `docs/audit/task-ledger.md`, Status `in-progress`, then `done` with the Gate result. No Backlog row is named by this order, so none changes.
