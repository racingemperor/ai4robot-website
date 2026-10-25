# Embodied Generalist Exam — research website

Live: https://racingemperor.github.io/ai4robot-website/

An English static research website with five main pages and six compatibility redirects, a fixed header and 22 task dossiers. T18 is excluded. The current EGE manuscript supplies the research motivation, benchmark design, task-creation process and evaluation goals. Implementation sources: https://github.com/ALEXander22568/AI4Robot and the project Notion notebook linked from Documents → Resources. Current task definitions follow GitHub; the user confirmed T23 is navigation among people.

## Documents

| Page | Purpose |
|---|---|
| index.html | Flowing clickable task-video wall, top-five category charts, seven-dimension task capability constellation, interactive evaluation routes, T06 scoring case and four categories |
| tasks.html | Searchable visual task gallery, card-to-center floating task details, capabilities, evidence and model results, plus a task/model results matrix |
| leaderboard.html | Ranking with balanced/pooled success, progress, coverage and exports, plus up to three-model comparison |
| compare.html | Compatibility redirect to leaderboard.html?section=comparison |
| matrix.html | Compatibility redirect to tasks.html?section=matrix |
| episodes.html | Shared video/trace/code timeline, filters, local video and episode export |
| documents.html | Manuscript overview, benchmark design, task sourcing, six-stage construction, fair evaluation and metrics, research CLI, resources and FAQ |
| method.html / run.html / about.html | Compatibility redirects to the corresponding Documents section |
| footage.html | Retired media-plan URL; redirects to Documents |

The fixed header has exactly four categories: Tasks, Leaderboard, Episodes and Documents. The logo opens Home. Leaderboard contains Ranking / Model comparison; Tasks contains Task catalog / Results matrix; Documents contains Method / Run / Resources. These are local button-controlled views: the document and highlighted header stay the same. The section query parameter supports sharing, reload and browser back/forward. Gallery search and report source are retained; category/capability filters are shared between catalog and matrix. Documents keeps the current run configuration when switching sections; links between its sections stay in the same document. Media plan is no longer part of the public site. No framework, build or package installation is required.

## Serve and verify

From this directory:

    python -m http.server 4174 --bind 127.0.0.1
    node --test tests/*.test.cjs

Open http://127.0.0.1:4174/. When serving the workspace root instead, use /website-prototype/.

## Appearance

The header’s sun/moon button switches every page between light and dark themes. The choice persists across navigation and reload; without a saved choice it follows the system. Unavailable browser storage falls back to an in-memory choice. Complete page snapshots fade over 500 ms where supported, with a 650 ms semantic-color fallback and immediate updates for reduced motion. The hero fades into the same page canvas as the following sections. Main sections and the footer use space rather than full-width divider lines; tables and controls retain their boundaries.

Typography follows [LIBERO-Pro 2.0](https://racingemperor.github.io/LIBERO-Pro2.0/): locally hosted Lato, 16 px body text, 18 px research introduction, 15 px / 700 navigation and a shared heading hierarchy. Buttons, cards, captions, tables and form fields use the same family; literal commands and trace/code snapshots retain the reference's system monospace stack. `typography.css` owns these roles and responsive adjustments. Lato font files are distributed unmodified under the [SIL Open Font License](fonts/OFL-Lato.txt); the files and license originate from the reference site's `assets/fonts/` directory.

## Data contract

Home selects up to five models with complete coverage of all 22 tasks, ordered by category-balanced success; switching to progress retains that cohort. Category charts use the same aggregation as the Leaderboard. The official chart reserves five positions while results are empty. The optional synthetic report contains five example models; local saved reports are explicitly unreviewed.

The capability constellation contains one point per task and seven named directions. Each existing capability description maps explicitly to one or more dimensions. Counts of those descriptions form the task vector; the point is a weighted average of the anchors. Orbit uses perspective, a shaded sphere, front/back wireframe arcs and depth-scaled markers; Flat keeps a radial 2D view. Marker size and shading express camera distance only. Rotation controls interpolate smoothly unless reduced motion is requested. Overlapping markers are slightly separated. They are not measured difficulty, model scores or a claim that projected distance equals capability similarity. Category/capability filters, task selection, rotation buttons, an accessible selector, per-task explanations and a complete annotation table provide alternatives to inspecting points alone.

Official results are empty until reviewed reports are connected. Synthetic examples use generic names and never assign scores to real models. Imports are validated, local, unreviewed and stored in this tab's sessionStorage; a storage failure falls back to page memory. Video is page-memory only. Shared URLs contain view parameters, not file contents.

Grid placeholders reserve media and output positions across Home, Tasks and Documents. The empty official Leaderboard displays ten layout-only model slots with no scores. Episodes offers a separate, explicitly labeled 90-second layout preview until official records exist. These slots are never report models or exported results. Optional event input, output and code snapshots follow the same clock as local video; real recordings need matching timestamps. No public footage or observation frames are connected yet. Home shows explicitly labeled concept previews in its flowing wall. Add reviewed clips to HOME_VIDEOS in app.js as task-ID entries with src and optional poster; use the same task footage for Home and Tasks. Wall clips play silently in a loop when visible; focus, offscreen/tab suspension and reduced-motion preferences pause them automatically. Every tile opens its task dossier.

Scoring follows the current research plan: average task rates within each category, then average categories. Pooled success and its Wilson interval are separate. See FEATURES.md for the normalized report format and limitations.

The site does not execute robot commands or request provider credentials. Its run configurator covers check/solve/play and direct-policy eval for T02/T06/T19. Other tasks have varying readiness. Program submission and direct-policy evaluation must retain distinct protocol labels.

## Modules and publication

theme.js applies the saved/system appearance before styles load and mounts the header switch; theme.css interpolates shared light/dark colors and softens section joins. site.js owns navigation and shared dialogs; app.js owns narrative pages; lab.js owns result/configuration tools; tasks.js owns the reviewed task catalog; results.js owns validation, aggregation and the shared saved-report contract; illustrations.js supplies task visuals; evidence.js owns grid placeholders, playback symbols, separate preview events and time-based trace selection; motion.js owns scroll reveals, video-wall playback and the card-to-window transition; paper.js owns curated manuscript text and its presentation in Documents. insights.js derives complete-coverage top-five category summaries and maps task capability annotations into seven dimensions; home-insights.js owns the Home charts and capability-map interaction; insights.css styles those Home views. Task images are original conceptual illustrations reserved for future experiment frames. Task detail windows use native modal focus handling, Escape/backdrop dismissal and reduced-motion alternatives.

Publish only this website directory to the website repository. GitHub Pages serves the root of codex/website-publication. Research source code, operational setup, credentials and progress records are outside publication scope. See DESIGN-NOTES.md. The internal VIDEO-BRIEF.md is excluded from publication.

## Manuscript content

The site uses the confirmed title Embodied Generalist Exam (EGE). The abstract, Introduction and Dataset sections inform the public overview. Draft name variants are normalized to EGE; the confirmed 22-task/four-category catalog and six concrete robot platforms are preserved. Raw manuscript sources, template PDFs, example authors, template references and unfinished results are excluded from publication. The manuscript describes a six-stage construction process with cross-checks by at least three authors per stage; this does not imply that every listed task has completed that process.

Manuscript reporting goals include success, intermediate progress, total elapsed wall-clock time and token consumption. The existing report schema supports simulation duration; it does not yet store end-to-end wall-clock time or tokens. The site explains this distinction rather than inferring efficiency results. Foundation-model weights remain unchanged during evaluation; a policy-development task may train a separate robot policy.
