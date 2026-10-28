# MEGA.dev S01E03 · Support KB

Local working copy for [what it shows](https://hq.mega.dev/challenges/what-it-shows).
The supplied KB is executable documentation: MDsveX pages embed Svelte components
that classify and count the supplied reports.

## Current stage

Source and rendered output are published in this repository. Tracking is split
into [parser issue #1](https://github.com/AdamGugala/MEGA.dev.S01E03/issues/1) and
[hint issue #2](https://github.com/AdamGugala/MEGA.dev.S01E03/issues/2).
The review is agent-authored; publishing it is not proof of course acceptance or
of the support desk approving a replacement decision.

[Read the published review](https://adamgugala.github.io/MEGA.dev.S01E03/kb/incidents/4471-review/).

The course accepted the two cause tickets and then released an engineering update
for 2026-10-05: parser **fixed** (`fix(dates): parse dd/mm for eu locales`), hint
**won't fix** (`booking-v3 form retired`). Issue #1 closes as completed; issue #2
closes as not planned. The KB preserves the export's historical counts while
recording these distinct outcomes. This update is not yet final course acceptance.

## Source and rendered page

- New source: [`src/routes/kb/incidents/4471-review/+page.svx`](src/routes/kb/incidents/4471-review/+page.svx).
- Generated HTML after building: `build/kb/incidents/4471-review/index.html`.
- Keep the **whole `build/` directory**, including `_app/` assets, for a working
  rendered site. The HTML is prerendered; JavaScript enables the explorer.
- `build/` is generated and included in Git so the repository contains both the
  source and the rendered page. Rebuild it before publishing source changes.

## Run locally

Node.js 22.17+ (Node 22 or 24 LTS recommended).

```sh
npm ci
npm test
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/kb/incidents/4471-review/`.
For development, use `npm run dev`.

## GitHub Pages

This repository's project site needs the base path `/MEGA.dev.S01E03`.
Build and preview that exact layout locally:

```sh
BASE_PATH=/MEGA.dev.S01E03 npm run build
BASE_PATH=/MEGA.dev.S01E03 npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/MEGA.dev.S01E03/kb/incidents/4471-review/`.
The preview command stays local. After an approved push to `master`,
[the Pages workflow](.github/workflows/pages.yml) publishes the committed `build/`
directory. It does not rebuild sources: run the base-path build above and commit
the updated output with source changes before pushing.

## Provenance and preserved history

The source export is `kb-export-267efc5e.zip`, exported on 2026-10-04.
SHA-256: `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`.
The archive's `support-kb/src/` is copied to `src/`; its original README is
preserved verbatim as [`EXPORT-README.md`](EXPORT-README.md).

Original data, classification code, `.svx` pages, and accepted decision 0001 are
preserved. The existing index and shared layout only gain base-aware navigation;
the layout footer also acknowledges agent authorship. A build-time Markdown-link
transform prefixes the base path without changing historical page sources.
The new review uses the original classifiers, explorer, timeline, and RenderStamp.

This is a snapshot, not a live connection to the desk. The course's exact answer
object and acceptance checks are not documented in the material inspected so far;
a working local render alone is not challenge acceptance.

Dependency audit at installation reported four low-severity findings along one
build-tool dependency chain (`deepmerge`). No forced dependency downgrades or
automatic fixes were applied.
