# Video production brief

## Purpose

Show what the agent receives, which physical action matters and how completion is judged. No real media is embedded in this preview. Keep reference-solver footage separate from evaluated model episodes. Third-party demonstrations in the research notebook motivate tasks; they are not AI4Robot results.

## First capture batch

| Task | Show | Prove |
|---|---|---|
| T06 semantic pick & place | All candidate baguettes, basket, head/wrist view and settled end state | Correct selection, basket placement and other-object displacement |
| T02 plug insertion | Full scene and socket-side contact close-up | Orientation, seating and stability after release within force limits |
| T19 pouring | Target line, liquid surface, cup and pitcher return | Stopping, settled level and limited spillage |
| T21 object search | Head view, route and five target reports | Active search, visible targets near each report and final STOP |

Use existing complete reference records first. These demonstrate task feasibility, not model ability. For full-suite promotion, add T16 or T17 training and T14 reconstruction once verified recordings exist. T08 and T11 are valuable close-contact follow-ups when complete evidence is ready.

## Four formats

1. Overview film: 25–35 seconds. A short instruction → observation → action → outcome sequence, then scope across categories.
2. Task clip: 12–25 seconds per task. One instruction and initial state, decisive action, clearly held final state. Long tasks may be accelerated only with labels.
3. Matched comparison: 30–60 seconds per pair. Same task version, seed/layout, observations and budgets. Show both successes and failures, including recovery.
4. Complete episode: uncut evidence for each published result, with synchronized observations, commands, events and judge output.

## T06 storyboard

| Shot | Required framing | Interpretation |
|---|---|---|
| Goal | All candidates and basket, exact instruction | Select the longest and preserve the rest |
| Observation | Agent head/wrist RGB beside a labeled external view | Separate model-visible inputs from presentation cameras |
| Action | Continuous approach, grasp, lift and transfer | Neighbor displacement remains visible |
| Outcome | Settled target, basket and all neighbors, actual judge output | Distinguish hovering, disturbed neighbors and full completion |

The home page's 0 / approximately 60 / 70 / 100 values illustrate scoring rules. Never label those illustrations as observed model results.

## Capture and comparison rules

- Keep camera streams and timestamps synchronized. Specify whether events use simulation seconds or wall-clock seconds.
- Record wall time, simulation time and edit playback speed separately.
- Show the real task version, seed/layout, exact model, agent, tool and judge versions.
- Label cuts, speed changes, external views and privileged reference baselines.
- Never splice multiple runs into an apparent uninterrupted success.
- Preserve the original observation stream and full judgment; a model calling done is not success by itself.
- For training, separate development curves from fixed held-out evaluation episodes.
- For reconstruction, pair source views with synchronized artifact tests: loading, stepping, dimensions, articulation and contact.

## Per-task requirements

Every task dossier on tasks.html and footage.html has a shot list, physical criterion and current scope. The downloadable task JSON contains the same English metadata. T18 is excluded. T04 must disclose pre-segmented cutting; T07 starts with one rotating layer; T20 starts with a single knot; T23 must disclose capsule proxies versus animated humans.

## Delivery package

Clean original; short web edit; poster frame; full episode; judge record; event timestamps; task/model/agent versions; seed/layout; outcome; time scales; capture permission. Target 1080p or above, retain readable contact details and avoid baked-in music or captions in the clean master. Export web video only after the evidence is checked.
