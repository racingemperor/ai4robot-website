# Tools and report format

## Available tools

- Eight main pages with seven fixed header categories, a Home logo and a menu at 1100 px and below. Model comparison is a local Leaderboard view; the results matrix is a local Tasks view. View switches preserve the parent document and header highlight, with shareable section links and browser history. Two old document URLs redirect to the combined pages.
- Twenty-two task dossiers with evaluation category, capability facets, embodiment, deliverable, current scope and filming requirements.
- Home route switch and interactive T06 judge examples.
- Leaderboard ranking view with sorting, model search, category/delivery/capability/embodiment filters, coverage and exports. No cross-page comparison action is embedded in its table.
- Up to three-model comparison on common capability-task coverage.
- Numeric task/model matrix within Tasks, linked to matching episode records. Catalog and matrix share category/capability scope; switching preserves catalog search/selection/layout. Importing or clearing a report leaves the catalog intact.
- Episode filters, events, seeking, playback speed, local video and JSON export.
- Existing check/solve/play and bounded direct-policy eval command configuration.
- Local report validation, session-tab persistence, clear control and storage fallback.
- CSV/JSON downloads, shareable view links, research sources, FAQ and website citation.
- Video production formats, T06 storyboard and per-task shot lists.

These cover the main research-site capabilities observed in earlier public-page reviews of RoboDojo and Embodied First Exam. They are not an exhaustive claim about those websites.

## Research scope

Four categories: manipulation 14, navigation 3, training 2, construction 3. T18 is excluded. Task scope follows the research repository snapshot reviewed October 23, 2026; T23 is navigation among people. Current implementation and future targets are identified per task.

## Result provenance

The default official report contains no models or scores. The synthetic walkthrough contains four generic example models, 88 aggregates and 88 episodes. It is not evidence about actual models.

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

Each episode: unique id, model_id, task_id, status (success/failure/incomplete), positive duration_s, nonnegative integer seed/layout and events. Each event has time_s, type and text. Times are ordered and within the duration. Episode outcomes must be consistent with the corresponding aggregate. Displayed episodes may be a subset; do not infer population success from selected videos.

Use one frozen benchmark/protocol/environment for all models in a report. Do not combine program submission, direct-policy and privileged solver runs under one protocol. Current imports support simulation only.

## Metrics

1. Per task: successes / trials; normalized progress_sum / trials.
2. Per category: average the available task values equally.
3. Balanced score and progress: average represented selected categories equally. Progress is displayed in points out of 100.
4. A selected category with no data makes the balanced summary unavailable. Partial task coverage is labeled and receives no rank. Missing tasks are never zero-filled.
5. Pooled success is separately total successes / total trials. Its Wilson 95% interval is not an interval for the balanced score and does not model task/seed correlations.
6. Mean simulation time is total simulation seconds / valid trials, including unsuccessful outcomes. Wall time and model latency are different measures.
7. Complete coverage sorts first. The selected metric controls ranking, with ties sharing rank; mean time sorts ascending by default.
8. Capability bars use only tasks covered by every selected model; summary cards show individual coverage. Do not treat different coverage as directly comparable.

CSV success fields are fractions, progress_0_100 is points, and duration_s is simulation seconds. Leaderboard exports include pooled_success_rate and pooled_wilson_95_low/high separately from balanced_success_rate. Exports retain source and protocol.

## CLI configuration

- check: first seed, all selected layouts.
- solve: all seeds × layouts, optional --video head.
- play: first seed and layout.
- eval: all seeds × layouts, explicit GPU, vlm/null/replay agent; this UI enables T02/T06/T19. mock exercises the pipeline offline. null/replay are controls, not model performance.

Defaults: seed 0 and layouts 0,1,2. Commands are generated as text, never executed by the website. Model identifiers are restricted and shell-quoted. Agent/model controls are disabled when irrelevant. Downloaded configurations contain the effective mode parameters.

## Verification

Run node --test tests/results.test.cjs and syntax-check all six JS files. Validate desktop/mobile document navigation, local section switching/history/legacy redirects, shared category filters, task details, score/progress displays, exports, import/reload/clear, direct-policy guards and video controls. Publish only the website allowlist; verify Pages files after deployment.
