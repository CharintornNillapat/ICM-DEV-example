# Slugify: the ICM-DEV example

A zero-dependency Node module that turns a title into a URL slug. It is the worked example of [ICM-DEV](https://github.com/CharintornNillapat/ICM-DEV), a template for delivering software with AI agents through spec, build and review stages. This repository was made from that template ("Use this template") and filled with Slugify's values, so `AGENTS.md`, `docs/contexts/slugify.md` and `docs/audit/` show what each part looks like in a real project.

Filled from ICM-DEV commit [`363c13d`](https://github.com/CharintornNillapat/ICM-DEV/commit/363c13d) (the template after its fixes 1).

```js
import { slugify } from './src/slugify.js';
slugify('Hello, World!'); // 'hello-world'
```

```
node bin/slugify.js Hello World   # hello-world
```

## Limits

A slug is at most 80 characters. A longer one is cut at its last hyphen at or before the 80th character, so no word is split; if the first word alone is longer than 80 characters, it is cut at 80.

## Run the tests

Node 22 or newer. There is nothing to install.

```
npm run lint
npm test
npm run test:e2e
node --test scripts/git-hooks/pre-push.test.mjs
```

## The recorded history

Phase 001 (T001, accented letters) and Phase 002 (T002 and T003, the 80-character cap) are recorded in `docs/audit/task-ledger.md` and `docs/audit/refactor-log.md`. Each task's spec, build report and review are in `workflow/stages/*/output/`, and the ADRs are `docs/audit/decisions/0001-*` to `0003-*`.

- The task outputs are copied unchanged from the original runs, which ran before this repository existed, on an earlier version of the template. A command in them that names a commit (`git show df83222:...`) cannot be re-run here.
- In the ledger and the log, `n/a (worked example)` means the commit does not exist anywhere you can read; `n/a (worked example; ran in ICM-DEV at <sha>)` means it is a commit in ICM-DEV's history. Nothing here was merged through this repository.
- How T001 ran: the three stage files and `MASTER.md` were followed in order, the spec went to the strict reviewer (`src/slugify.js` is a critical path), the build was a failing-test-first run and the review re-ran every gate itself. The agents were stand-in sub-agents, because the session had started before `.claude/agents/` existed, and the pause after the spec was waived. Release, auto-merge and the deploy record were not exercised for it.

The next phase is 003: start Claude Code in this folder, run `/master`, then `phase 3: <slug>`.
