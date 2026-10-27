# Tools and report format

## Available tools

- Five main pages with fixed header destinations: Home, Task, Leaderboard, Report and Contribute. The logo is a static brand mark; small screens use a menu. Model comparison is a local Leaderboard view; the results matrix and episode replay are local Task views; Method, Run and Resources are local Report views. Switching preserves the parent document and header highlight, with shareable section links and browser history. Eight legacy URLs redirect to the current structure.
- Twenty-two detailed task briefs with goals, three capability explanations, completion checks, embodiment, deliverable, input, execution stages and current scope. A searchable illustrated card gallery replaces the directory. Each card has three capability cells and a hover lift. Clicking moves and enlarges the card into a centered floating window with Overview, Capabilities, Model results and Evidence views. The window supports Escape, backdrop/close dismissal, focus return and reduced motion; it remains smaller than the screen.
- Home presents the task wall, title and benchmark scale, paper metadata, News, an overview-video placeholder and the research introduction. It ends after the introduction, without a footer. Remaining sections retain once-per-section scroll reveals; reduced motion presents content immediately.
- LIBERO-Pro-style chart of the five manuscript categories plus Overall. Model-colored curves, direct labels, visibility checkboxes and a raw category table support inspection. Click a curve, model name or task score to open a centered floating result window. The task comparison matrix uses 22 task columns plus Overall; headings sort the table while preserving global Overall ranks. Model selection and the detail category filter are shareable. Search, scope filters, imports, exports and replay links preserve provenance and the parent navigation.
- Up to three-model comparison on common capability-task coverage.
- Numeric task/model matrix within Tasks, linked to matching episode records. Catalog and matrix share category/capability scope; switching preserves catalog search/selection. Importing or clearing a report leaves the catalog intact.
- Grid placeholders for the Home overview video, per-task video/detail frames/deliverables and Report figures/output/publication material.
- Eight planned model/harness pairs in the empty official Overall view: gpt6-astra/codex, opus5.5/claude code, gemini 4/argon, Grok 4.7/Grok Build, deepseek v4.1 flash/dsh, glm 5.3 flash/zcode, kimi k3.1 pro/kimi code, and MiniMax-M3.1-Flash/MiniMax Code. They have no scores or ranks, and never enter reports or exports. Synthetic reports retain generic model names. Comparison retains reserved positions until results exist.
- Episode filters, shared video/event timeline, symbol-only play/pause with accessible labels, keyboard seeking, playback speed, model input/output, time-stamped code revisions, local video and JSON export. The empty official archive provides a clearly separate layout preview; preview episodes cannot be exported as results.
- Existing check/solve/play and bounded direct-policy eval command configuration.
- Local report validation, session-tab persistence, clear control and storage fallback.
- CSV/JSON downloads, shareable view links, research sources, FAQ and website citation.
- Each task includes success rate, progress, trial count, mean simulation time and matching episode links from the active report. Official, synthetic and local sources remain distinct. The standalone media plan has been retired.

These cover the main research-site capabilities observed in earlier public-page reviews of RoboDojo and Embodied First Exam. They are not an exhaustive claim about those websites.

## Research scope

Five categories from the EGE abstract: Robotic manipulation 14, Navigation 3, Scene generation 1 (T13), Scene and interaction reconstruction 2 (T14/T15), and Policy development 2 (T16/T17). T18 is excluded. Task scope follows the research repository snapshot reviewed October 23, 2026; T23 is navigation among people. Current implementation and future targets are identified per task.

## Result provenance

The default official report contains no models or scores. The synthetic walkthrough contains five generic example models, 110 aggregates and 110 episodes. It is not evidence about actual models.

Only one report is active at a time. Imports replace the report and remain local and unreviewed. Known synthetic provenance persists through navigation and report export. Reports are revalidated on sessionStorage reload. No video URLs are accepted from imported reports; local attached video is held only in page memory. Files and provider credentials are not uploaded.

Limits: 5 MB per import, 30 models, 660 aggregates, 500 episodes and 200 events per episode. Only allowlisted fields survive validation. Text is escaped before display, CSV strings guard spreadsheet formula execution, and reports do not execute code.

## Website report schema v1

This format is separate from the research CLI's summary.json. Convert research aggregates explicitly; the website does not automatically certify experiment authenticity or protocol comparability.

```json
{
  "schema_version": 1,
  "benchmark_version": "your-frozen-release",
  "protocol": "your-frozen-route-interface-budget-and-judge-version",
  "environment": "simulation",
  "models": [
    {"id": "your-model", "name": "Model name", "version": "Exact version", "agent": "Exact agent and harness version"}
  ],
  "results": [],
  "episodes": []
}
```

Each result: model_id, task_id, trials (positive integer), successes (0 to trials), progress_sum (successes to trials), duration_sum_s (nonnegative simulation seconds). Normalize each task's 0–100 progress to 0–1 before summing. A successful trial has progress 1. Merge multiple seeds/layouts outside the website into one aggregate per model/task. Include all valid outcomes; rerun infrastructure-invalid trials rather than silently counting them as robot failures.

Each episode: unique id, model_id, task_id, status (success/failure/incomplete), positive duration_s, nonnegative integer seed/layout and events. Each event has time_s, type and text. Times are ordered and within the duration. Optional input and output fields preserve multiline text (up to 16,000 characters each). Optional code is an object containing filename (up to 160 characters) and content (multiline, up to 64,000 characters). Newlines and tabs are allowed in these multiline fields; other control characters are rejected. The viewer retains the latest supplied input, output and code at or before the current time. Before the first event, all remain absent. Missing fields show placeholders; code is never executed. Episode outcomes must be consistent with the corresponding aggregate. Displayed episodes may be a subset; do not infer population success from selected videos.

Use one frozen benchmark/protocol/environment for all models in a report. Do not combine program submission, direct-policy and privileged solver runs under one protocol. Current imports support simulation only.

For example, an event can include:

```json
{
  "time_s": 22,
  "type": "Code revision",
  "text": "First submitted revision",
  "input": "Instruction and permitted observation description",
  "output": "Recorded response at this time",
  "code": {"filename": "policy.py", "content": "# Exact submitted file snapshot\n# Additional lines"}
}
```

Attach local footage with the same time origin as the event log. The video position drives the shared timeline and timeline seeking updates the video. Video attachments are page-memory only. Camera-frame slots remain reserved; imported reports do not load images or remote media. The 90-second layout preview is illustrative, separate from official/synthetic/local reports, and has no measured outcome.

## Metrics

1. Per task: successes / trials; normalized progress_sum / trials.
2. Per category: average the available task values equally.
3. Balanced score and progress: average represented selected categories equally. The full catalog uses five separate category means from the EGE abstract; generation and reconstruction each receive their own weight. Earlier four-category balanced scores are not directly comparable. Progress is displayed in points out of 100.
4. A selected category with no data makes the balanced summary unavailable. Partial task coverage is labeled and receives no rank. Missing tasks are never zero-filled.
5. Pooled success is separately total successes / total trials. Its Wilson 95% interval is not an interval for the balanced score and does not model task/seed correlations.
6. Mean simulation time is total simulation seconds / valid trials, including unsuccessful outcomes. Wall time and model latency are different measures.
7. Only complete coverage earns an Overall rank, with ties sharing rank. Task table headers sort by task success or Overall, with missing values last; task sorting does not change Overall ranks. Legacy comparison/export metrics remain available.
8. Capability bars use only tasks covered by every selected model; summary cards show individual coverage. Do not treat different coverage as directly comparable.

CSV success fields are fractions, progress_0_100 is points, and duration_s is simulation seconds. Leaderboard exports include pooled_success_rate and pooled_wilson_95_low/high separately from balanced_success_rate. Exports retain source and protocol.

## CLI configuration

- check: first seed, all selected layouts.
- solve: all seeds × layouts, optional --video head.
- play: first seed and layout.
- eval: all seeds × layouts, explicit GPU, vlm/null/replay agent; this UI enables T02/T06/T19. mock exercises the pipeline offline. null/replay are controls, not model performance.

Defaults: seed 0 and layouts 0,1,2. Commands are generated as text, never executed by the website. Model identifiers are restricted and shell-quoted. Agent/model controls are disabled when irrelevant. Downloaded configurations contain the effective mode parameters.

## Verification

Run node --test tests/*.test.cjs and syntax-check the changed JS files. The reporting, Home-insight, Home-interaction and navigation suites contain 26 tests. Validate desktop/mobile document navigation, local section switching/history/legacy redirects, shared category filters, task details, score/progress displays, exports, import/reload/clear, Report method anchors, retained run configuration, direct-policy guards and episode video controls. Publish only the website allowlist; verify Pages files after deployment.

## Manuscript integration

paper.js curates the EGE research overview, four package components, six construction stages and four evaluation goals. Report → Resources provides the adapted overview; Report → Method explains design, sourcing, creation and fairness. Home ends after the research introduction; research explanations stay in Report. Task details expose the package definition without expanding the gallery. The report schema remains unchanged; scores are computed from task aggregates using the five manuscript categories. Wall-clock elapsed time and token consumption are not inferred from simulation seconds. The site publishes no manuscript source archive, template PDF, invented author identities or empirical results. Home reserves explicitly labeled slots for the forthcoming author list and affiliations.

## Home task wall

Six flowing columns (four on small screens) link to the 22 task dossiers. The hero, three scale figures, paper metadata, news, overview-video placeholder and centered introduction follow LIBERO-Pro 2.0’s upper Home layout. Tiles use original, labeled concept previews until reviewed footage is mapped in HOME_VIDEOS. Optional videos loop muted and inline, with visible-tile playback, page/hero suspension, automatic focus suspension and a paused reduced-motion default. Keyboard focus exposes the original tiles as a static scrollable grid; duplicate cycles are hidden from the accessibility tree.

## Appearance

A shared header sun/moon control switches all five pages, task windows, evidence frames, result tables, trace/code blocks and the run configurator. Saved preference is applied before styles, with system fallback and storage-error handling. Page snapshots fade for 280 ms without remounting content or resetting a timeline, scroll position or form. Browsers without View Transitions apply the final palette immediately. Rapid repeated switches honor the latest choice; failed or interrupted transitions settle on that choice. Reduced motion disables the color/icon transition. Home fades its media wall into the page background; main sections and the footer share that canvas and use spacing in place of hard horizontal dividers.

## Retained exploration source

The earlier category-chart, task-demand ring and evaluation-route modules remain in the repository, but Home no longer loads or initializes them. Their isolated module tests remain available. The compact Home Overall board and its dedicated tests have been removed. Rankings and model details remain in Leaderboard; task results and synchronized replay remain in Task.
