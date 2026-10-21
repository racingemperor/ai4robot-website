# AI4Robot website demo

Live demo: https://racingemperor.github.io/ai4robot-website/

Single-route visual prototype. Its 22 task definitions come from the source repository; T18 is omitted by user confirmation. Three directions are provided for design review. This is a prototype rather than a production website.

## Run

Open index.html directly, or run the following in PowerShell if the browser blocks local navigation:

    python -m http.server 4173 --bind 127.0.0.1

Run this in the directory containing index.html, then visit http://127.0.0.1:4173/. In the original research workspace, run from its root and visit /website-prototype/. Choose a direction with ?variant=A, ?variant=B, or ?variant=C; use the footer switcher or left/right keys. The switcher works locally and on GitHub Pages. A permanent top navigation provides access to tasks and research tools. The demo has no external media or runtime packages.

## Directions

- A: asymmetrical editorial hero and capability atlas with a task dossier.
- B: long-form story that links three physical-world questions to representative tasks.
- C: dark observation workspace with a left index and task-focused work area.

Filtering, search, atlas/list views, task dossiers, a four-beat storyboard, protocol and video-brief dialogs are interactive. Visual frames are original CSS/SVG concept diagrams, not experiment footage. Model comparisons have no published measured data; the separate example mode uses synthetic values.

## Research tools

Six panels provide sortable/filterable rankings, up to three-model comparison, a task-by-model matrix, episode event browsing with optional local video, existing-CLI command generation, and participation/resources. Default official results are empty. Select “加载交互示例” to try synthetic values; real models are never assigned fabricated scores. Reports and videos remain in the current browser session.

Use ?lab=board&data=demo#research to open the example leaderboard. Reports, tasks, comparison/matrix CSV, episode JSON and run configuration can be downloaded. JSON report import validates structure, ranges, references and episode consistency. See FEATURES.md for the reference-function comparison, reporting format and metric definitions.

Run the meaningful data checks with `node --test tests/results.test.cjs` (no dependencies required).

See DESIGN-NOTES.md for comparative research and the concept. See VIDEO-BRIEF.md for footage requirements and what the shots should show.

## Publish

Repository: https://github.com/racingemperor/ai4robot-website

GitHub Pages serves the root of the codex/website-publication branch. The .nojekyll marker preserves static files without Jekyll processing. Push changes to that branch to update the site.

Only website files belong in this repository. Robot implementation, experiment records, local progress files and credentials are outside its scope.
