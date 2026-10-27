# Website features and report contract

## Public structure

Five main links open Home, Task, Leaderboard, Report and Contribute. Each is a single continuous page without secondary tabs, side navigation or nested page views. Task details are continuous floating windows. Model/source/episode selectors and normal disclosure controls change the current content, rather than navigating to another section page.

Home retains the flowing task wall, benchmark identity/scale, paper metadata, News, overview-video placeholder, introduction, compact Overall bar chart and shared footer. Other former exploration sections remain removed.

Task presents 22 illustrated task cards. Each task shows its goal, embodiment, deliverable, completion checks, capability explanations, execution stages, scope and evidence placeholders. Its model rows combine success bars and recordings. The whole row expands a recording directly below its score, one model at a time, with a second click collapsing and pausing it. A 60% success rate fills 60% of the bar; measured zero and missing scores remain distinct. Initial task visits start collapsed; direct model/episode links open the matching row. Model buttons expose aria-expanded and retain keyboard focus after expansion. The episode selector remains inside each expanded row; the separate recording heading/model picker is removed. Full step history is a disclosure to keep the player compact. Videos, input/output, code and observations share one timeline, with symbol-only playback, speed, range seeking and timestamped step buttons. Local attachments and positions are kept separately for each source/model/episode until leaving or reloading the page. Closing the window, hiding the document and changing recordings pause playback. Closing or replacing a task cancels its pending import; late file reads and interrupted playback requests cannot overwrite another recording or reopen a closed task.

Leaderboard presents category/Overall model-colored curves, visibility controls, an accessible source table and a sortable table with all 22 tasks. Every model curve/name/task score opens its result window. Incomplete models are unranked; ties share ranks. Data & exports contains validated import, template, CSV/JSON export and share controls; no separate comparison page is mounted. Scope filters do not navigate away.

Report contains publication entries, project announcements and external coverage only. Research method, CLI configurator, package-design narrative and FAQ are not mounted there. Public paper/press details are explicitly forthcoming. Contribute retains criteria, proposal preparation, checklists and downloads.

Legacy Episodes links open a concrete task recording. Compare/Matrix redirect to Leaderboard. Documents/Method/Run/About/Footage redirect to the single Report page, without secondary query state.

## Normalized JSON report

A report has schema_version: 1, benchmark_version, protocol, environment: simulation, models, results and optional episodes. Keep evaluation routes, model versions, environments and protocol budgets separate. Website validation checks structure and consistency, not experimental authenticity. Raw research summary.json needs explicit conversion.

Each model has unique id (letters, numbers, underscore or hyphen), name, version and agent. Import 1–30 models, at most 660 unique task/model aggregates and at most 500 episodes. T18 is excluded. Reports are limited to 5 MB. Unknown fields are removed.

Each aggregate has model_id, task_id, trials (positive integer), successes (0 to trials), progress_sum (successes to trials) and duration_sum_s (nonnegative simulation seconds). Normalize task progress to 0–1 before summing; successful trials contribute 1. Merge seeds/layouts into one aggregate per task/model. Include all valid outcomes and rerun infrastructure-invalid trials.

Each episode has a unique id, model_id, task_id, status (success/failure/incomplete), positive duration_s, nonnegative integer seed/layout and 1–200 ordered events. The task/model aggregate must exist; selected episode counts and outcomes cannot contradict it. Displayed recordings may be a subset of trials, so their success fraction is not the model’s benchmark score.

Optional episode video is an object with src and optional poster. URLs must use HTTP(S) or be relative media paths; script/data/protocol-relative URLs are rejected. For example:

    "video": {"src": "media/T06/model-a/episode-01.mp4", "poster": "media/T06/model-a/poster.jpg"}

Each event has time_s within episode duration, type and text. Optional input/output preserve multiline text up to 16,000 characters. Optional code contains filename (up to 160 characters) and content (up to 64,000 characters). Code is displayed only. Optional images contains up to four observation objects with src and descriptive alt text. For example:

    "images": [{"src": "media/T06/model-a/frame-008.jpg", "alt": "Head camera supplied to the model"}]

The playhead retains the latest supplied input, output, code and images at or before the current time. Before their first event these remain absent. Video starts on the same original clock as event timestamps. A local recording attachment overrides the hosted video for only that episode. Each local attachment must be reselected after reload/navigation; videos are never uploaded. A duration mismatch is explicitly shown.

Imports remain local and unreviewed in sessionStorage for the current tab. Storage failure uses page memory. Synthetic imports retain their label through navigation and export. Shared links contain view state, not uploaded files. The official empty report and layout placeholders never enter exports as model results.

## Scoring

The manuscript defines five distinct categories: manipulation (14 tasks), navigation (3), scene generation (1), scene and interaction reconstruction (2), policy development (2). Overall first averages task success rates within each selected category, then averages those category means equally. Progress follows the same aggregation on 0–100 points. Complete selected-task coverage is required for a rank. Missing data stays missing and genuine zero remains zero.

Pooled success divides all successes by all trials; its Wilson 95% interval is distinct from the category-balanced score and does not account for task/seed correlations. Mean simulation time divides total simulation seconds by valid trials, including unsuccessful outcomes. Wall-clock elapsed time and tokens remain future reporting goals.

## Verification and publication

Run node --test tests/*.test.cjs, syntax-check JavaScript, verify hashes and git diff --check. Browser checks cover direct and legacy navigation, model/episode isolation, replay retention, video/range/trace synchronization, imports/exports, keyboard and reduced motion, mobile layout, theme persistence and Home regression. Publish only website assets and verify the Pages deployment and files.
