# Embodied Generalist Exam — research website

Live: https://racingemperor.github.io/ai4robot-website/

An English static website for 23 embodied tasks (T01–T23), aligned with the EGE manuscript supplied on October 28, 2026. T18 is unfamiliar robot adaptation and T23 is training trajectory collection; this supersedes the older research-repository catalog for those entries. No framework, package installation or build step is required.

## Pages

| Main page | Content |
|---|---|
| Home | Flowing task wall, title and benchmark scale, paper metadata, News, overview-video placeholder, introduction, compact Overall bar leaderboard, copyable BibTeX Citation and shared footer |
| Task | Illustrated searchable task gallery; each floating task window contains its objective, model results, synchronized model recordings, paper categories, completion checks and evidence |
| Leaderboard | News, six manuscript categories plus Overall in a model-colored line chart, sortable 23-task table, inline task recordings within model result windows and report data tools |
| Report | Publications, project announcements and external coverage; no methods, CLI configurator or nested documentation views |
| Contribute | Short invitations for new tasks, methods and models, with email proposals and a contact link |
| Community | WeChat and QQ group QR areas and a GitHub contact link |

The fixed header groups the Imported Gallery List Exam identity, Code, Datasets and Community on the left. GitHub and Hugging Face icons identify the resource entries; Datasets remains inactive until its URL is supplied. Home, Task, Leaderboard, Report and Contribute form the right navigation. Community is a separate contact page. The header has no logo artwork; its text matches the Home hero title. The paper retains its manuscript title. Each page contains continuous content without secondary tabs or side indexes. On phones the resource row stays visible and Menu opens the five page links.

Eight legacy HTML URLs remain usable. Episodes opens its concrete Task recording, Compare and Matrix open Leaderboard, and Documents / Method / Run / About / Footage open Report. Old section parameters are discarded. The task, model, episode and result source remain shareable; a recording link clears task-category filters that could exclude its target.

## Serve and verify

    python -m http.server 4174 --bind 127.0.0.1
    node --test tests/*.test.cjs

Open http://127.0.0.1:4174/. Syntax-check changed JavaScript files and verify desktop/mobile navigation, model recordings, timestamp seeking, playback and downloads before publication.

## Appearance and interaction

The site follows LIBERO-Pro 2.0's white canvas, local Lato typography and restrained reading layout. The header sun/moon button switches all pages and floating windows; the preference persists across navigation/reload. Page snapshots fade for 280 ms where supported, while reduced motion applies the final palette immediately. Switching does not remount recordings or reset their playhead.

The Lato files originate from the reference site's assets/fonts/ directory and are distributed unmodified under fonts/OFL-Lato.txt. Body text is 16 px, the introduction 18 px, and navigation 15 px / 700. Commands and recorded code use monospace. Cards animate from their clicked position into a centered window. Escape/backdrop/close dismisses the window and pauses playback; keyboard focus returns to its card. Home scroll reveals and the video wall respect reduced motion and page visibility.

## Results and recordings

The six manuscript categories are Robotic manipulation (13), Navigation (2), Scene generation and interaction reconstruction (3), Policy development and training (2), Training data collection (1), and In-context learning (2). Overall averages task success rates within each category and then category means equally. Complete selected-task coverage is required for a rank; missing values are never zero-filled. Ties share a rank. Pooled trial success and its Wilson interval are separate from category-balanced success.

Results.roster defines the same eight model/harness identities for every page. Brand logos are local official assets; assets/model-logos/SOURCES.md records their origins. Results.defaultSource uses the layout dataset until Results.official contains models. Replace the layout aggregates and episode content with experiment records before interpreting the displayed rates as measurements. The official report remains a separate dataset. The public UI omits data-provenance and release-wait notices as requested. Public views use the website report and hosted media. Shared URLs carry view selections.

Each task opens with its title and objective, a representative task-demonstration video, and brief task facts before the model rows. The demonstration shares the TASK_VIDEOS entry with the Home wall and uses a reserved video frame when no clip is supplied. Connected clips have native playback controls and pause on close, task changes or leaving the page. Each task presents compact model rows with proportional success bars: 60% fills 60% of the track, measured zero stays zero, and missing scores show a dash with an unfilled dashed track. Click a model row to expand its video, exact model input/output, observation frames, code revisions and feedback directly beneath that row. Only one model expands at a time; click again to collapse and pause it. Task visits start collapsed, while links to a specific model or episode expand that row. The episode selector and timeline live inside the model; there is no separate model-recording section or model picker. Full step history is available through an inline disclosure. Each model/episode keeps its playback position across model and task changes while the page remains open. Closing the task window pauses playback. A report can supply an HTTP(S) or relative video URL and poster for each episode, plus timestamped observation images; these are retained by validation. Recording duration mismatches and unavailable files are shown explicitly. See FEATURES.md for the schema.

The recording workspace keeps a stable height across timestamp updates. Video and model input/output sit side by side above a full-width code panel and execution feedback, using the space beneath both columns. Input, output, submitted code and execution feedback scroll within their own areas when long, including on phones, where these areas stack vertically. Observation images also use reserved space, so loading a frame or revealing the first code submission does not push the rest of the task window down. Text areas support keyboard scrolling.

No official footage or reviewed results are currently connected. The empty official task viewer provides a 90-second media layout for each planned model; these are presentation placeholders and are never exported as measured records. A model with results but no episode shows its scores and a recording empty state. Only recorded input/output/code at or before the playhead is displayed.

Home retains its compact Overall board and original footer, without the subtitle or scoring footnote beneath the board. Its model rows open the matching model details in Leaderboard. Citation follows LIBERO-Pro2.0's bordered code panel and copy control, using the confirmed project title, year and repository rather than unprovided paper metadata. Map representative task clips in TASK_VIDEOS in app.js; Task demonstrations and the Home wall reuse the same video. Task and Leaderboard share an always-visible Evaluation scope panel for paper category, embodiment/scene and delivery mode, with a bordered Reset filters button. Task also includes text search, compact four-column desktop cards and centered page controls without a range caption. There are eight tasks per page: the full catalog occupies three pages (8 / 8 / 7). Page numbers restore from the URL; search, filters and reset return to page one. Task/episode links open their matching page, including navigation between tasks inside the recording window. Filters intersect, persist in the URL and carry between the pages; recording links clear conflicting filters. The scope has its own padding and spacing above cards/charts. Custom capability filters and model-search controls have been removed.

Leaderboard model checkboxes, logos and names only toggle curve visibility. Click a curve or table score to open a model’s results. Each task row in that window expands the shared synchronized player, without navigating to Task. Only one recording panel opens at a time; closing or switching pauses playback and retains the episode’s position. News appears above the chart. Ranking methodology is not rendered below the table.

## Publications and contributions

Report follows a simple publication-entry layout inspired by LIBERO-Pro 2.0. It lists the EGE paper and website announcement. Unfilled publication metadata and press announcements are omitted. Public paper links, authors, venue and press links are added when supplied. No reference-site papers, invented publication claims or raw manuscript archives are published.

Contribute presents three short invitations: new tasks, new methods and new models. Each opens an email draft addressed to racingemperor@outlook.com with the corresponding contribution subject; nothing is sent automatically. Community provides WeChat and QQ group areas and a GitHub contact link. Add the project’s actual QR image paths to channels in community.js; supplied images open at full size. Other projects’ QR codes and unprovided contact details are not used.

## Modules and publication

site.js owns direct navigation, shared News and compatibility routing. app.js renders Home and the task gallery/details. task-replay.js/css own model performance and per-episode playback/media state, including fixed-model recordings for Leaderboard. leaderboard.js/css render the chart, task table and model dossier; lab.js controls that single Leaderboard view and CSV/JSON downloads. report.js/css own publication entries. results.js validates and summarizes reports; evidence.js selects timestamped snapshots. motion.js controls the task-window transition, wall and reveals. theme.js/css and typography.css provide shared appearance. contribute.js/css own proposals; community.js/css own contact cards. tasks.js defines the reviewed catalog; illustrations.js provides original task concepts.

Earlier exploration modules (paper.js, insights.js, home-insights.js, home-flow.js and insights.css) remain source references and are not loaded by current public pages. The website never executes robot programs or requests provider credentials. Simulation mean time is supported; end-to-end wall-clock time and token consumption are not yet stored.

Publish only this website directory to its repository. GitHub Pages serves the root of codex/website-publication. Research sources, operational setup, credentials and progress records stay outside publication scope.
