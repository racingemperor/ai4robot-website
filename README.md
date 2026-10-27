# Embodied Generalist Exam — research website

Live: https://racingemperor.github.io/ai4robot-website/

An English static research website with five main pages and eight compatibility redirects, a fixed header and 22 task dossiers. T18 is excluded. The current EGE manuscript supplies the research motivation, benchmark design, task-creation process and evaluation goals. Implementation sources: https://github.com/ALEXander22568/AI4Robot and the project Notion notebook linked from Report → Resources. Current task definitions follow GitHub; the user confirmed T23 is navigation among people.

## Pages

| Page | Purpose |
|---|---|
| index.html | LIBERO-style hero, paper information, news, overview-video placeholder and introduction, a compact Overall bar leaderboard, top-five category charts, seven-capability task-demand rings, interactive evaluation routes, T06 scoring case and five manuscript task categories |
| tasks.html | Searchable visual task gallery, card-to-center floating task details, capabilities, evidence and model results, plus a task/model results matrix and synchronized episode replay |
| leaderboard.html | Category + Overall line chart, selectable model curves, a sortable 22-task score matrix and centered model result windows, plus report tools |
| contribute.html | Four contribution routes, quality criteria, review workflow and an interactive material checklist with downloadable/GitHub proposal drafts |
| compare.html | Compatibility redirect to leaderboard.html?section=comparison |
| matrix.html | Compatibility redirect to tasks.html?section=matrix |
| episodes.html | Compatibility redirect to tasks.html?section=episodes |
| report.html | Manuscript overview, benchmark design, task sourcing, six-stage construction, fair evaluation and metrics, research CLI, resources and FAQ |
| documents.html | Compatibility redirect to report.html, preserving its selected section |
| method.html / run.html / about.html | Compatibility redirects to the corresponding Report section |
| footage.html | Retired media-plan URL; redirects to Report |

The fixed header has five destinations: Home, Task, Leaderboard, Report and Contribute. The logo is a static brand mark. Leaderboard contains Ranking / Model comparison; Task contains Task catalog / Results matrix / Episode replay; Report contains Method / Run / Resources. These are local button-controlled views: the document and highlighted header stay the same. The section query parameter supports sharing, reload and browser back/forward. Gallery search and report source are retained; category/capability filters are shared between catalog and matrix. Report keeps the current run configuration when switching sections; links between its sections stay in the same document. Media plan is no longer part of the public site. No framework, build or package installation is required.

## Serve and verify

From this directory:

    python -m http.server 4174 --bind 127.0.0.1
    node --test tests/*.test.cjs

Open http://127.0.0.1:4174/. When serving the workspace root instead, use /website-prototype/.

## Appearance

The header’s sun/moon button switches every page between light and dark themes. Light mode uses a pure-white background with neutral reading surfaces. The choice persists across navigation and reload; without a saved choice it follows the system. Unavailable browser storage falls back to an in-memory choice. Complete page snapshots fade over 280 ms where supported; reduced motion and browsers without View Transitions apply the final palette immediately. Switching themes preserves live content, playback and scroll position. The hero fades into the same page canvas as the following sections; tables and controls retain their boundaries.

Typography follows [LIBERO-Pro 2.0](https://racingemperor.github.io/LIBERO-Pro2.0/): locally hosted Lato, 16 px body text, 18 px research introduction, 15 px / 700 navigation and a shared heading hierarchy. Buttons, cards, captions, tables and form fields use the same family; literal commands and trace/code snapshots retain the reference's system monospace stack. `typography.css` owns these roles and responsive adjustments. Lato font files are distributed unmodified under the [SIL Open Font License](fonts/OFL-Lato.txt); the files and license originate from the reference site's `assets/fonts/` directory.

## Data contract

Home selects up to five models with complete coverage of all 22 tasks, ordered by category-balanced success; switching to progress retains that cohort. Category charts use the same aggregation as the Leaderboard. The EGE abstract defines five categories: Robotic manipulation (14), Navigation (3), Scene generation (1; T13), Scene and interaction reconstruction (2; T14/T15), and Policy development (2; T16/T17). Scene generation and reconstruction are never merged. Full-scope scores give each of these five category means equal weight; previous four-category aggregate scores are not directly comparable. The category chart reserves five positions while results are empty. Immediately after the Home introduction, a separate compact Overall board shows every report model, sorted by category-balanced success with complete-coverage ranking and shared ranks for ties. Its empty official state reserves the eight planned models without scores or ranks. Click a row to open that model’s detailed results in Leaderboard; report provenance and full-catalog scope are preserved. Its source selector stays synchronized with the category charts. The optional synthetic report contains five example models; local saved reports are explicitly unreviewed.

The capability rings keep all 22 tasks in fixed clockwise positions, excluding T18. Seven editorial dimensions describe intended task requirements; they are not a taxonomy defined by the paper. Each task has explicit 0–3 ordinal annotations and rationales based on its goal, capability descriptions and checks. The common scale is Not a focus / Supporting / Important / Central. Higher radial peaks mean stronger demand; intermediate waveform strokes are decorative. These annotations never represent model performance or measured difficulty. A task selector, arrow-key marker navigation, per-task rationales and the complete table provide alternatives to reading the diagram.

Official results are empty until reviewed reports are connected. Synthetic examples use generic names and never assign scores to real models. Imports are validated, local, unreviewed and stored in this tab's sessionStorage; a storage failure falls back to page memory. Video is page-memory only. Shared URLs contain view parameters, not file contents.

Grid placeholders reserve media and output positions across Home, Tasks and Report. The empty official Leaderboard displays the eight planned model/harness pairs with no scores or ranks. Selecting a model opens its category summary and task-by-task results in a centered floating window. The roster is presentation only and never enters result reports or exports. Episodes offers a separate, explicitly labeled 90-second layout preview until official records exist. These slots are never report models or exported results. Optional event input, output and code snapshots follow the same clock as local video; real recordings need matching timestamps. No public footage or observation frames are connected yet. Home shows explicitly labeled concept previews in its flowing wall. Add reviewed clips to HOME_VIDEOS in app.js as task-ID entries with src and optional poster; use the same task footage for Home and Tasks. Wall clips play silently in a loop when visible; focus, offscreen/tab suspension and reduced-motion preferences pause them automatically. Every tile opens its task dossier.

Scoring follows the current research plan: average task rates within each category, then average categories. Pooled success and its Wilson interval are separate. See FEATURES.md for the normalized report format and limitations.

The site does not execute robot commands or request provider credentials. Its run configurator covers check/solve/play and direct-policy eval for T02/T06/T19. Other tasks have varying readiness. Program submission and direct-policy evaluation must retain distinct protocol labels.

## Modules and publication

theme.js applies the saved/system appearance before styles load and mounts the header switch; theme.css supplies neutral light/dark palettes, the rounded floating header and a compositor fade that keeps the live content intact. home-overview.js/css own the Home paper-information layout, introduction and compact Overall board. leaderboard.js shares the planned roster and renders the category/Overall chart, sortable task matrix and model dossier; leaderboard.css owns their responsive presentation. contribute.js/css provide contribution routes, material checklists and proposal drafts. site.js owns navigation and shared dialogs; app.js owns narrative pages; lab.js owns result/configuration tools; tasks.js owns the reviewed task catalog; results.js owns validation, aggregation and the shared saved-report contract; illustrations.js supplies task visuals; evidence.js owns grid placeholders, playback symbols, separate preview events and time-based trace selection; motion.js owns scroll reveals, video-wall playback and the card-to-window transition; paper.js owns curated manuscript text and its presentation in Report. insights.js derives complete-coverage top-five category summaries and stores explained task-demand annotations for seven dimensions; home-insights.js owns the linked Home category/model explorer and capability-ring interaction; home-flow.js renders the selectable stages of both evaluation routes; insights.css styles those Home views. Task images are original conceptual illustrations reserved for future experiment frames. Task detail windows use native modal focus handling, Escape/backdrop dismissal and reduced-motion alternatives.

Publish only this website directory to the website repository. GitHub Pages serves the root of codex/website-publication. Research source code, operational setup, credentials and progress records are outside publication scope. See DESIGN-NOTES.md. The internal VIDEO-BRIEF.md is excluded from publication.

## Manuscript content

The site uses the confirmed title Embodied Generalist Exam (EGE). The abstract, Introduction and Dataset sections inform the public overview. Draft name variants are normalized to EGE; the confirmed 22-task/five-category catalog and six concrete robot platforms are preserved. Raw manuscript sources, template PDFs, example authors, template references and unfinished results are excluded from publication. The manuscript describes a six-stage construction process with cross-checks by at least three authors per stage; this does not imply that every listed task has completed that process.

Manuscript reporting goals include success, intermediate progress, total elapsed wall-clock time and token consumption. The existing report schema supports simulation duration; it does not yet store end-to-end wall-clock time or tokens. The site explains this distinction rather than inferring efficiency results. Foundation-model weights remain unchanged during evaluation; a policy-development task may train a separate robot policy.

## Leaderboard interaction

The opening chart follows LIBERO-Pro 2.0: distinct model colors, visibility controls, direct line labels and success-rate axes for the five manuscript categories plus category-balanced Overall. Click or press Enter on a curve or label to open the same centered floating result window used by task cards. Official empty reports show the planned eight models and no invented lines; the opt-in synthetic report uses generic model names.

The table below puts models in rows and all 22 concrete tasks in columns, with Overall and fixed model identities. Column headings sort success rates, missing values stay last and Overall ranks retain complete-coverage eligibility. A score opens model details and locates that task. The horizontal scroll position is retained when sorting. The model window includes category summaries, success/progress/trials/time and replay links; its model and category selectors update in place. Model, detail and table-sort parameters are shareable. Data & exports contains imports, downloads, view sharing and the legacy comparison view; evaluation scope is collapsed by default.

## Contributing

Contribute is a separate page inspired by First Exam's contribution flow: evaluate a model, integrate a harness, propose a task, or contribute tools/evidence/analysis. It explains six quality criteria and a five-step review workflow. Selecting a contribution type updates its material checklist. Visitors can download a Markdown proposal or open a prefilled issue in the website repository; no issue is sent automatically. Research-repository access remains separate. These are proposed contribution guidelines, not a claim that every current task meets every criterion.
