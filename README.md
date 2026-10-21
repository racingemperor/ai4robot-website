# AI4Robot website demo

Live: https://racingemperor.github.io/ai4robot-website/

A static research website with **10 separate documents**, based on 22 task definitions. T18 is excluded. Navigation loads a new document with its own URL, title and content; browser back, refresh and open-in-new-tab work without server routing or a framework.

## Pages

| Document | Responsibility |
|---|---|
| index.html | Research introduction and representative questions |
| tasks.html | 22-task atlas, search, directory and dossiers |
| leaderboard.html | Rankings, statistics, coverage and exports |
| compare.html | Up to three models, shared-task capability comparison |
| matrix.html | Task × model results, links to relevant episodes |
| episodes.html | Episode directory, events, timeline and local video |
| method.html | Evaluation procedure, deliverables, metrics and boundaries |
| run.html | Existing research CLI command configurator |
| about.html | Report template, participation, FAQ, updates and citation |
| footage.html | Filming brief, storyboard and per-task shot requirements |

The fixed header and results navigation use real document links. The former three-direction switcher and six-tool panel switching have been removed. Old `?lab=board&data=demo#research` bookmarks redirect to their corresponding documents.

## Run and check

No build or package installation is required. Serve the directory containing these files:

    python -m http.server 4173 --bind 127.0.0.1

Visit http://127.0.0.1:4173/. When serving from the research workspace root, use `/website-prototype/`.

    node --test tests/results.test.cjs

Example leaderboard: `leaderboard.html?data=demo`. Official results are empty until reviewed reports are published. Synthetic values never assign scores to real models. CSS/SVG drawings are concept diagrams, not experiment footage.

## Data and privacy

Validated imported reports are stored in **sessionStorage for the current tab**, enabling cross-page browsing and refresh. They remain local and unreviewed, can be cleared, and are not uploaded or included in shared URLs. Stored reports are validated again when a document loads. If browser storage is blocked/full, import remains usable on the current page and the interface explains the limitation. Local video is held only in the episode page's memory; leaving or refreshing requires reattachment.

`tasks.js` defines the task catalog. `results.js` owns validation/statistics. `site.js` owns shared navigation, document shell and dialogs. `app.js` mounts only the current information page; `lab.js` mounts only the current research tool. `illustrations.js` contains the concept diagrams.

See FEATURES.md for reporting/metrics, DESIGN-NOTES.md for the page architecture and reference evidence, and VIDEO-BRIEF.md for filming requirements.

## Publish

Repository: https://github.com/racingemperor/ai4robot-website

GitHub Pages serves the root of `codex/website-publication`; `.nojekyll` enables direct static serving. Push website files to update. Robot code, experiments, progress records and credentials are outside this repository's scope.
