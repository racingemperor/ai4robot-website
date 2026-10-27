# Website design and content architecture

## Page roles

Home introduces Embodied Generalist Exam: flowing task wall, identity and three scale figures, paper metadata, News, overview video, introduction, Overall bar board and shared footer. It ends there.

Task is the task collection. Clicking a card animates into a centered floating window. It contains the task objective, model performance, model/episode recording, synchronized video/input/output/code, capabilities, completion checks, execution scope and evidence in one continuous document. No inner tabs or standalone episode/matrix workspace remain. Each model has a compact row with a proportional success bar, numeric score and supporting metrics. Clicking it reveals the synchronized player directly beneath that row, within the same model item. Only one row expands at a time; collapsing pauses its recording and preserves its position. Specific model/episode links open the corresponding row, while ordinary task visits start collapsed. No detached task-recording heading or model selector remains. Step history stays available as an inline disclosure. The per-task success summary covers all valid aggregate trials, independently of the selected video sample.

Leaderboard compares models using five manuscript categories plus Overall in a line chart, then the complete 22-task table. Curves, model identities and task scores open a model result window. Model colors, labels and numeric alternatives supplement one another. Missing values are not drawn as zero. Sorting does not change overall eligibility. Report provenance is explicit. Optional data controls and scope disclosures do not create separate subpages.

Report follows LIBERO-Pro 2.0’s publication-entry style and contains only publications, project announcements and coverage. The forthcoming EGE paper uses its own confirmed title; unprovided author/venue/PDF details are marked pending. The site announcement describes what is available. External coverage has an empty state until real links arrive. No methods/configurator/FAQ or embedded documentation report is shown. Contribute remains a single page explaining contribution types, criteria and proposal preparation.

The fixed header has five direct destinations: Home, Task, Leaderboard, Report and Contribute. No secondary page bars, side index or hidden section panels are mounted. The logo is static. Existing section URLs canonicalize to the parent; Episodes links select their task/model directly. All current links work with native modified clicks and browser navigation.

## Visual and accessibility rules

Use a white canvas, neutral surfaces, dark ink and restrained blue controls, with a complete dark palette. Lato comes from the LIBERO-Pro 2.0 font assets under the included SIL OFL license. Use 16 px body, 18 px introduction and 15 px / 700 navigation, matching the existing site. Code and trace snapshots use monospace. Copy uses available column width and wraps naturally; do not insert decorative line breaks.

Controls and media frames retain soft corners. Keep native labels, visible focus, one H1 per page, a skip link and aria-current on the active primary navigation link. Tables scroll within labeled regions. Small screens stack replay media and traces, retaining a usable range input and 44 px controls. Task windows leave surrounding context visible and return focus to the opening card. Reduced motion skips animated card transforms and scroll entry effects.

Home tiles are original labeled concepts until reviewed footage is supplied. Duplicate wall cycles have distinct SVG IDs and are hidden from keyboard/accessibility output. Videos decode only while visible; page visibility, focus and reduced motion pause the wall. The theme transition fades page snapshots without replacing live recording elements.

## Data and media boundaries

Results.validate is the single normalized-report contract. Official reviewed reports, synthetic examples and local unreviewed imports stay visibly separate. The planned eight-model roster is presentation only; it never fabricates scores or enters exports. Synthetic examples use generic model names. Task layout previews are separate from episode results.

TaskReplay owns active task/model/episode and the per-episode media/playhead maps. Local files survive changes of model, episode and task while the page remains open; they are not persistent uploads. Closing/hiding suspends playback. Each report episode can supply a hosted video/poster and timestamped observation images. Only content at or before the playhead appears. Invalid/missing video and clock mismatches are explicit. No robot code is executed.

The five paper categories remain manipulation, navigation, scene generation, reconstruction and policy development. T18 is deferred; T23 follows GitHub’s dynamic crowd-navigation definition. The older seven editorial capability dimensions remain retained source annotations, not manuscript taxonomy or measured difficulty. No raw internal manuscript, template author list, unsupported empirical claim or invented press item is published.

## Sources and compatibility

The current EGE manuscript supplied the research framing and five categories. Task definitions follow https://github.com/ALEXander22568/AI4Robot and the project notebook. LIBERO-Pro 2.0 informed typography, whitespace, theme and publication layout; First Exam informed the compact Overall rows and synchronized recording presentation. The site retains its own branding, text and task concepts.

Legacy Episodes opens Task, Compare/Matrix open Leaderboard, and Documents/Method/Run/About/Footage open Report. Earlier paper/exploration modules remain unmounted source references. Progress records, QA captures and private research materials are not published.
