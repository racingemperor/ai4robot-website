# AI4Robot research website

Live: https://racingemperor.github.io/ai4robot-website/

An English static research website with ten independent documents, a fixed header and 22 task dossiers. T18 is excluded. Research sources: https://github.com/ALEXander22568/AI4Robot and the project Notion notebook linked from Resources. Current task definitions follow GitHub; the user confirmed T23 is navigation among people.

## Documents

| Page | Purpose |
|---|---|
| index.html | Research question, interactive evaluation routes, T06 scoring case and four categories |
| tasks.html | Category/capability filters, atlas/list, search, task scope and evidence requirements |
| leaderboard.html | Balanced success, pooled success/intervals, progress, coverage and exports |
| compare.html | Up to three models and common-task capability profiles |
| matrix.html | Task/model outcomes and links to episode evidence |
| episodes.html | Events, filters, timeline, local video and episode export |
| method.html | Routes, information boundary, hidden evaluation and reporting rules |
| run.html | Current development CLI and supported direct-policy evaluation commands |
| about.html | Research sources, release status, reporting tools, contributions and FAQ |
| footage.html | Video formats, T06 storyboard and all task shot lists |

Navigation uses document links, with independent titles and browser back/reload support. No framework, build or package installation is required.

## Serve and verify

From this directory:

    python -m http.server 4174 --bind 127.0.0.1
    node --test tests/results.test.cjs

Open http://127.0.0.1:4174/. When serving the workspace root instead, use /website-prototype/.

## Data contract

Official results are empty until reviewed reports are connected. Synthetic examples use generic names and never assign scores to real models. Imports are validated, local, unreviewed and stored in this tab's sessionStorage; a storage failure falls back to page memory. Video is page-memory only. Shared URLs contain view parameters, not file contents.

Scoring follows the current research plan: average task rates within each category, then average categories. Pooled success and its Wilson interval are separate. See FEATURES.md for the normalized report format and limitations.

The site does not execute robot commands or request provider credentials. Its run configurator covers check/solve/play and direct-policy eval for T02/T06/T19. Other tasks have varying readiness. Program submission and direct-policy evaluation must retain distinct protocol labels.

## Modules and publication

site.js owns navigation and shared dialogs; app.js owns narrative pages; lab.js owns result/configuration tools; tasks.js owns the reviewed task catalog; results.js owns validation and aggregation; illustrations.js owns original SVG concept diagrams.

Publish only this website directory to the website repository. GitHub Pages serves the root of codex/website-publication. Research source code, operational setup, credentials and progress records are outside publication scope. See DESIGN-NOTES.md and VIDEO-BRIEF.md.
