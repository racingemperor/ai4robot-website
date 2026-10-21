# AI4Robot website demo

Live demo: https://racingemperor.github.io/ai4robot-website/

Single-route visual prototype. Its 22 task definitions come from the source repository; T18 is omitted by user confirmation. Three directions are provided for design review. This is a prototype rather than a production website.

## Run

Open index.html directly, or run the following in PowerShell if the browser blocks local navigation:

    python -m http.server 4173 --bind 127.0.0.1

Run this in the directory containing index.html, then visit http://127.0.0.1:4173/. In the original research workspace, run from its root and visit /website-prototype/. Choose a direction with ?variant=A, ?variant=B, or ?variant=C; use the desktop floating switcher, mobile footer switcher or left/right keys. The switcher works locally and on GitHub Pages. The demo has no external media or runtime packages.

## Directions

- A: asymmetrical editorial hero and capability atlas with a task dossier.
- B: long-form story that links three physical-world questions to representative tasks.
- C: dark observation workspace with a left index and task-focused work area.

Filtering, search, atlas/list views, task dossiers, a four-beat storyboard, protocol and video-brief dialogs are interactive. Visual frames are original CSS/SVG concept diagrams, not experiment footage. Model comparisons have no results data.

See DESIGN-NOTES.md for comparative research and the concept. See VIDEO-BRIEF.md for footage requirements and what the shots should show.

## Publish

Repository: https://github.com/racingemperor/ai4robot-website

GitHub Pages serves the root of the codex/website-publication branch. The .nojekyll marker preserves static files without Jekyll processing. Push changes to that branch to update the site.

Only website files belong in this repository. Robot implementation, experiment records, local progress files and credentials are outside its scope.
