# Embodied Generalist Exam — research website

Live: https://racingemperor.github.io/ai4robot-website/

An English static website for 22 embodied tasks (T01–T23 excluding T18). Task definitions follow https://github.com/ALEXander22568/AI4Robot. T23 is dynamic crowd navigation. No framework, package installation or build step is required.

## Pages

| Main page | Content |
|---|---|
| Home | Flowing task wall, title and benchmark scale, paper metadata, News, overview-video placeholder, introduction, compact Overall bar leaderboard and shared footer |
| Task | Illustrated searchable task gallery; each floating task window contains its objective, model results, synchronized model recordings, paper categories, completion checks and evidence |
| Leaderboard | Five manuscript categories plus Overall in a model-colored line chart, sortable 22-task table, model result windows and report data tools |
| Report | Publications, project announcements and external coverage; no methods, CLI configurator or nested documentation views |
| Contribute | Contribution guidelines, material checklists and downloadable or GitHub proposal drafts |

The fixed header has five links: Home, Task, Leaderboard, Report and Contribute. The logo is static. Each link opens one page with continuous content; there are no secondary page tabs, side indexes or hidden subpages. Expandable model rows and episode selectors change data in place. Task windows have no internal content tabs.

Eight legacy HTML URLs remain usable. Episodes opens its concrete Task recording, Compare and Matrix open Leaderboard, and Documents / Method / Run / About / Footage open Report. Old section parameters are discarded. The task, model, episode and result source remain shareable; a recording link clears task-category filters that could exclude its target.

## Serve and verify

    python -m http.server 4174 --bind 127.0.0.1
    node --test tests/*.test.cjs

Open http://127.0.0.1:4174/. Syntax-check changed JavaScript files and verify desktop/mobile navigation, model recordings, timestamp seeking, playback, imports and exports before publication.

## Appearance and interaction

The site follows LIBERO-Pro 2.0's white canvas, local Lato typography and restrained reading layout. The header sun/moon button switches all pages and floating windows; the preference persists across navigation/reload. Page snapshots fade for 280 ms where supported, while reduced motion applies the final palette immediately. Switching does not remount recordings or reset their playhead.

The Lato files originate from the reference site's assets/fonts/ directory and are distributed unmodified under fonts/OFL-Lato.txt. Body text is 16 px, the introduction 18 px, and navigation 15 px / 700. Commands and recorded code use monospace. Cards animate from their clicked position into a centered window. Escape/backdrop/close dismisses the window and pauses playback; keyboard focus returns to its card. Home scroll reveals and the video wall respect reduced motion and page visibility.

## Results and recordings

The five manuscript categories are Robotic manipulation (14), Navigation (3), Scene generation (1), Scene and interaction reconstruction (2), and Policy development (2). Overall averages task success rates within each category and then category means equally. Complete selected-task coverage is required for a rank; missing values are never zero-filled. Ties share a rank. Pooled trial success and its Wilson interval are separate from category-balanced success.

Results.roster defines the same eight model/harness identities for every page. Brand logos are local official assets; assets/model-logos/SOURCES.md records their origins. Results.defaultSource uses the layout dataset until Results.official contains models. Replace the layout aggregates and episode content with experiment records before interpreting the displayed rates as measurements. The official report remains a separate dataset. The public UI omits data-provenance and release-wait notices as requested. Imports are validated, stored only in the current tab and never uploaded. Storage failure keeps the report in page memory. Shared URLs carry selection parameters, never local file contents.

Each task presents compact model rows with proportional success bars: 60% fills 60% of the track, measured zero stays zero, and missing scores show a dash with an unfilled dashed track. Click a model row to expand its video, exact model input/output, observation frames, code revisions and feedback directly beneath that row. Only one model expands at a time; click again to collapse and pause it. Task visits start collapsed, while links to a specific model or episode expand that row. The episode selector and timeline live inside the model; there is no separate model-recording section or model picker. Full step history is available through an inline disclosure. Each model/episode keeps its own local video attachment and playback position across model and task changes while the page remains open. Closing the task window pauses playback. Reload/navigation requires reattaching local files. A report can supply an HTTP(S) or relative video URL and poster for each episode, plus timestamped observation images; these are retained by validation. Recording duration mismatches and unavailable files are shown explicitly. See FEATURES.md for the schema.

No official footage or reviewed results are currently connected. The empty official task viewer provides a 90-second media layout for each planned model; these are presentation placeholders and are never exported as measured records. A model with results but no episode shows its scores and a recording empty state. Only recorded input/output/code at or before the playhead is displayed.

Home retains its compact Overall board and original footer. Its model rows open the matching model details in Leaderboard. Map real wall clips in HOME_VIDEOS in app.js. Task filtering and card labels use the five paper categories; custom capability filters and model-search controls have been removed.

## Publications and contributions

Report follows a simple publication-entry layout inspired by LIBERO-Pro 2.0. It lists the EGE paper and website announcement. Unfilled publication metadata and press announcements are omitted. Public paper links, authors, venue and press links are added when supplied. No reference-site papers, invented publication claims or raw manuscript archives are published.

Contribute explains evaluation, harness, task and research-tool contributions. Its selector updates the material checklist; downloading a proposal or opening a prefilled GitHub issue does not submit anything automatically.

## Modules and publication

site.js owns direct navigation and compatibility routing. app.js renders Home and the task gallery/details. task-replay.js/css own model performance and per-episode playback/media state. leaderboard.js/css render the chart, task table and model dossier; lab.js controls that single Leaderboard view and imports/exports. report.js/css own publication entries. results.js validates and summarizes reports; evidence.js selects timestamped snapshots. motion.js controls the task-window transition, wall and reveals. theme.js/css and typography.css provide shared appearance. contribute.js/css own proposals. tasks.js defines the reviewed catalog; illustrations.js provides original task concepts.

Earlier exploration modules (paper.js, insights.js, home-insights.js, home-flow.js and insights.css) remain source references and are not loaded by current public pages. The website never executes robot programs or requests provider credentials. Simulation mean time is supported; end-to-end wall-clock time and token consumption are not yet stored.

Publish only this website directory to its repository. GitHub Pages serves the root of codex/website-publication. Research sources, operational setup, credentials and progress records stay outside publication scope.
