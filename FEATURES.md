# Website features and report contract

## Public structure

The header groups the Embodied Generalist Exam title, Code, Datasets and Community on the left, and Home, Task, Leaderboard, Report and Contribute on the right. Community remains a distinct contact page. Code opens the research repository; Datasets is inactive until its URL is supplied. GitHub/Hugging Face icons are local, attributed assets. Mobile keeps resources visible and opens the five page links through Menu. Each page is continuous without secondary tabs or side navigation. Task details are continuous floating windows. Model/episode selectors and normal disclosure controls update content in place.

Task and Leaderboard use the same always-visible Evaluation scope panel. Paper category, embodiment/scene and delivery mode are intersecting filters; Task also retains search. Selections restore from the URL and carry between those pages, while task recording links recover from conflicting filters. Reset clears all filters, including Task search. Selects retain visible keyboard focus and the panel leaves a clear gap before cards/charts.

Task displays eight compact cards per page: four columns and two rows on desktop, with two columns on tablets and one on small phones. Numbered pages and previous/next controls are centered beneath the grid, without a range caption. All 23 tasks occupy three pages (8 / 8 / 7). Search, filter changes and reset start at page one; URL reload and task/episode deep links restore the appropriate page. The shared Reset filters control has an enclosing border and visible keyboard focus.

Home retains the flowing task wall, Embodied Generalist Exam title and benchmark scale, paper metadata, News, overview-video placeholder, introduction, compact Overall bar chart, Citation and shared footer. Citation is the final content section, with selectable BibTeX, a copy button, success feedback and manual-copy fallback when clipboard access fails. It cites the project repository until confirmed paper metadata is supplied. Other former exploration sections remain removed.

Task presents 23 illustrated task cards. Each task opens with its title and objective, followed by a representative demonstration video before its facts and model performance. TASK_VIDEOS in app.js supplies both the Task demonstration and the Home wall; without a supplied clip the video frame remains reserved. Demonstration clips use native controls, do not autoplay, and pause on close, task changes or leaving the page. Each task also shows its embodiment, deliverable, completion checks, paper category, execution stages and evidence placeholders. Its model rows combine success bars and recordings. The whole row expands a recording directly below its score, one model at a time, with a second click collapsing and pausing it. A 60% success rate fills 60% of the bar; measured zero and missing scores remain distinct. Initial task visits start collapsed; direct model/episode links open the matching row. Model buttons expose aria-expanded and retain keyboard focus after expansion. The episode selector remains inside each expanded row; the separate recording heading/model picker is removed. Full step history is a disclosure to keep the player compact. Videos, input/output, code and observations share one timeline, with symbol-only playback, speed, range seeking and timestamped step buttons. Playback positions are kept separately for each source/model/episode while the page remains open. Closing the window, hiding the document and changing recordings pause playback. Interrupted playback requests cannot overwrite another recording or reopen a closed task.

Leaderboard presents News, category/Overall model-colored curves, visibility controls, an accessible source table and a sortable table with all 23 tasks. The chart’s model labels, logos and checkboxes only toggle visibility. Curves and table scores open a model result window. Each task row expands its video/input/output/code player in that window; only one task expands at a time. This fixed-model player leaves Leaderboard URL ownership with Lab and pauses when collapsed, switched or closed. Incomplete models are unranked; ties share ranks. Data & exports contains a report template, CSV/JSON downloads and share controls; no separate comparison page or ranking-methodology section is mounted. Scope filters do not navigate away.

Report contains one EGE research-paper entry with its cover placeholder, title, short summary and repository link. Dates, project updates, website announcements, external coverage and unprovided publication metadata are omitted. Research method, CLI configurator, package-design narrative and FAQ are not mounted there. Contribute keeps only invitations for new tasks/methods/models, email proposal links to racingemperor@outlook.com and contact. Community reserves separate WeChat/QQ QR image areas, supports opening supplied images at full size and links to the research repository for contact. Actual QR images remain unfilled until provided.

Legacy Episodes links open a concrete task recording. Compare/Matrix redirect to Leaderboard. Documents/Method/Run/About/Footage redirect to the single Report page, without secondary query state.

## Normalized JSON report

A report has schema_version: 1, benchmark_version, protocol, environment: simulation, models, results and optional episodes. Keep evaluation routes, model versions, environments and protocol budgets separate. Website validation checks structure and consistency, not experimental authenticity. Raw research summary.json needs explicit conversion.

Each model has unique id (letters, numbers, underscore or hyphen), name, version and agent. Reports contain 1–30 models, at most 690 unique task/model aggregates and at most 500 episodes. All T01–T23 tasks are supported. Unknown fields are removed.

Each aggregate has model_id, task_id, trials (positive integer), successes (0 to trials), progress_sum (successes to trials) and duration_sum_s (nonnegative simulation seconds). Normalize task progress to 0–1 before summing; successful trials contribute 1. Merge seeds/layouts into one aggregate per task/model. Include all valid outcomes and rerun infrastructure-invalid trials.

Each episode has a unique id, model_id, task_id, status (success/failure/incomplete), positive duration_s, nonnegative integer seed/layout and 1–2000 ordered events. The task/model aggregate must exist; selected episode counts and outcomes cannot contradict it. Displayed recordings may be a subset of trials, so their success fraction is not the model’s benchmark score.

Optional episode video is an object with src and optional poster. URLs must use HTTP(S) or be relative media paths; script/data/protocol-relative URLs are rejected. For example:

    "video": {"src": "media/T06/model-a/episode-01.mp4", "poster": "media/T06/model-a/poster.jpg"}

Each event has time_s within episode duration, type and text. Optional input/output preserve multiline text up to 64,000 characters. Optional code contains filename (up to 160 characters) and content (up to 64,000 characters). Code is displayed only. Optional images contains up to four observation objects with src and descriptive alt text. For example:

    "images": [{"src": "media/T06/model-a/frame-008.jpg", "alt": "Head camera supplied to the model"}]

The playhead retains the latest supplied input, output, code and images at or before the current time. Before their first event these remain absent. Video starts on the same original clock as event timestamps.  A duration mismatch is explicitly shown.

Public pages render the website report and hosted media; prior local reports do not change these views. Internal source metadata survives navigation and export; the public UI omits provenance and release-wait labels. The eight-model roster and official brand assets are shared by Home, Task and Leaderboard. Card tags and task filters use only the paper taxonomy. Leaderboard has no model-search field or modelQuery filtering. Shared links contain view state. Published exports contain the GPT-6 measurements; no layout results are included. Older data=demo links resolve to the published report when it is available.

## Scoring

The six manuscript categories are Robotic manipulation (13), Navigation (2), Scene generation and interaction reconstruction (3), Policy development and training (2), Training data collection (1), and In-context learning (2). Overall first averages task success rates within each selected category, then averages those category means equally. Progress follows the same aggregation on 0–100 points. Complete selected-task coverage is required for a rank. Missing data stays missing and genuine zero remains zero.

Pooled success divides all successes by all trials; its Wilson 95% interval is distinct from the category-balanced score and does not account for task/seed correlations. Mean simulation time divides total simulation seconds by valid trials, including unsuccessful outcomes. Wall-clock elapsed time and tokens remain future reporting goals.

## Verification and publication

Run node --test tests/*.test.cjs, syntax-check JavaScript, verify hashes and git diff --check. Browser checks cover direct and legacy navigation, model/episode isolation, replay retention, video/range/trace synchronization, downloads, absence of import controls, keyboard and reduced motion, mobile layout, theme persistence and Home regression. Publish only website assets and verify the Pages deployment and files.

Published GPT-6 episodes include optional event.recorded_at UTC timestamps. Dense timelines show up to seven markers while the complete history scrolls within 320 px. Selecting one of several steps at the same simulation time inspects that particular record without exposing later output or code. The supplied 12-task report leaves incomplete Overall and all unavailable task/model values empty.
