# Website design and content architecture

## Research story

The site asks whether a general-purpose language model or coding agent can turn an instruction into a physical outcome. The home page adapts the EGE manuscript’s motivation and three contributions, establishes the question, lets visitors inspect the program-submission and direct-policy routes, and uses T06 to explain why visible progress can still fail the full instruction.

The visual language is paper, dark ink and rust red, with Lato typography aligned to LIBERO-Pro 2.0. Dashed grid placeholders reserve video, observation, figure, document and output positions. Home has a theme-aware, full-width hero with four tilted, continuously flowing columns of rounded task tiles, a reusable task-video strip and scoring evidence; each task has one demonstration video, three detail frames and a deliverable. Documents reserves method figures, execution output and publication material. No experimental media is published. Controls use a shared 10 px corner radius; video, image, output and task presentation frames use 14 px corners, with their contents following the frame. Task characteristic cells use 6 px corners.

## Typography

`typography.css` loads the reference site's unmodified Lato regular, medium, semibold, bold, extra-bold and italic files with `font-display: swap`; the regular and bold weights are preloaded. The SIL OFL notice accompanies them in `fonts/OFL-Lato.txt`. Body text is 16 px / 1.65 (base 1.6), the Home research introduction is 18 px / 1.85, and navigation is 15 px / 24 px at weight 700. Headings use the reference's 650 weight, 1.2 line height and −.035 em spacing; the responsive Home title uses weight 800 / 1.06 / −.055 em, capped at 96 px. Interface metadata uses Lato too. Only literal code, command output and trace snapshots use the reference's system monospace stack. Text roles remain the same in both themes. Mobile form fields stay at 16 px, long copy stays readable and narrow camera/previous-next layouts stack to fit the larger type.

## Distinct pages

Tasks uses a searchable gallery of illustrated cards. Each card has three capability cells, a robot label and a deliverable; these describe task characteristics, not measured difficulty. Hover raises the card and slightly enlarges its visual. Clicking animates it from its original position into a centered floating window, leaving the gallery visible behind a scrim. The window is smaller than the viewport and has Overview, Capabilities, Model results and Evidence views. Each task explains its objective, three capabilities, completion checks, input, execution stages and current scope. A per-task table reads the same report as the matrix, showing success, progress, trials, simulation time and matching episode evidence. Official results remain empty until reviewed reports exist; synthetic and local sources are labeled. Leaderboard contains rankings and model comparison on common tasks. Episodes inspects evidence in time. Documents brings together the evaluation method, run configuration and project resources. Home introduces the research. These five main pages have distinct document URLs and one H1 each.

The fixed header has exactly four categories: Tasks, Leaderboard, Episodes and Documents. Home is reached through the logo. Ranking / Model comparison are local Leaderboard views; Task catalog / Results matrix are local Tasks views; Method / Run / Resources are local Documents views. Native buttons with pressed states and labeled regions switch content in the same document, keeping the parent header current. The section query parameter supports direct links, refresh and browser back/forward.

Gallery and matrix share category/capability scope; gallery search and active report source are preserved. The gallery becomes two columns on tablets and one on phones. The floating window has a scrollable interior, a persistent close control and a two-column view switch on phones. Previous/next controls follow the filtered task selection. Report imports rebuild only the report host. Documents mounts the method separately from configuration and resource tools; imports and section switches never overwrite the method. The run configuration stays in memory between Documents views. Regular links between these sections are intercepted for local switching, while modified clicks retain native browser behavior.

The leaderboard ranking table stays focused on metrics without comparison action columns. Explicit task evidence links remain regular document links. The header switches to a menu at 1100 px and below. Old compare.html and matrix.html URLs redirect to their parent sections; method.html, run.html and about.html redirect to Documents. The retired footage.html URL redirects to Documents. Legacy index.html?lab= bookmarks also remain supported. Media plan is removed from navigation and public flows; task dossiers retain evidence requirements. No Environment category has been added.

Home’s flowing wall links every tile to its task dossier. The title and primary links sit in the foreground; the scrim passes pointer events through to the task tiles. All 22 tasks have original concept previews, visibly labeled until reviewed clips are supplied through HOME_VIDEOS in app.js. Duplicate wall cycles have distinct SVG IDs and are excluded from keyboard order and accessibility output. Muted inline looping video is decoded only while its tile and hero are visible. The wall and videos pause automatically offscreen, in a hidden tab or on focus; reduced-motion preferences keep them paused. Keyboard focus pauses the wall and reveals a static, scrollable grid so clipped tiles can be reached.

Home sections fade in and move upward as they enter the viewport, once per load, without controlling page scroll. Reduced motion shows the final readable state immediately. Native dialog behavior traps focus; closing returns focus to the opening card. Play and pause use symbols with accessible labels.

## Evidence preview

The official empty Leaderboard has ten model slots without ranks or scores; comparison has three model positions and a capability-chart slot. Episodes has a narrow index, a shared scrubber with event markers, video and observation positions, model input/output, the latest code snapshot and an indexed step directory. Clicking steps or dragging backward restores the trace at that time, including the latest earlier code revision. Layout events are explicitly illustrative and never enter the report or exports. Real imported records may supply input/output/code; code is escaped text and never executed. A locally attached video drives the same clock. Observation image positions remain placeholders; original footage and a public asset mapping are future work.

## Three separate concepts

- Evaluation categories: manipulation (14), navigation (3), training (2), construction (3).
- Delivery modes: control program (17), training code/weights (2), scene/motion artifact (3).
- Capability facets: objects/contact, dexterity, body/control, spatial reasoning, world construction.

These are separate axes. T12 includes a mobile base but is evaluated as manipulation. T11 submits a control program and belongs to manipulation, not policy training.

## Sources and research maturity

The research README, docs/TASKS.md, docs/AGENT_EVAL.md and task designs were reviewed on October 23, 2026. The project Notion notebook supplies task motivation and references. GitHub defines the current implementation; the user explicitly selected its crowd-navigation definition for T23 over the notebook's trajectory-collection alternative.

The manuscript archive reviewed October 24, 2026 supplies the abstract, Introduction and Dataset sections. Home presents the research framing; Documents separates the manuscript overview in Resources from benchmark design, source selection, six-stage construction and fair evaluation in Method. Task details have an expandable package definition. The confirmed title remains Embodied Generalist Exam. Draft task totals and naming variants do not override the user-confirmed catalog. No template PDF, placeholder authors, sample references, unsupported model claims or empirical findings are published. Wall-clock time and token usage are described as manuscript reporting goals, distinct from currently supported simulation time.

The catalog states implementation limits: pre-segmented cutting, a single rotating cube layer, initial single-knot tying, standing G1 scope, frozen Go2 navigation and separately trained locomotion. Direct-policy support currently covers the ARX tools; replay checks exist for T02/T06/T19. None of these facts implies a completed 22-task model evaluation.

T06 outcome examples explain documented judge rules (0, approximately 60, 70 and 100), not observed model performance. References may use privileged state and are always distinct from evaluated agents.

## Reference websites

LIBERO-Pro 2.0 (https://racingemperor.github.io/LIBERO-Pro2.0/) informs the shared light/dark canvas, soft media-to-content fade and whitespace between sections. Its layout and assets are not reused.

Earlier public-page observations of RoboDojo and Embodied First Exam informed the independent task/results/method/reproduction page roles. This site uses its own branding, media and research presentation. The user’s First Exam reference informs the flowing, clickable Home video wall; the copy, task concepts, colors and implementation remain independent. It uses detailed task briefs, a scoring case study and linked evidence tools to express this research's structure.

## Accessibility and responsive behavior

English metadata, lang=en, one H1 per document, sequential heading hierarchy, a skip link, labeled native controls, visible focus, aria-current navigation and reduced-motion support. Filter and selection state has textual labels and pressed states. Data tables scroll within labeled regions. Small screens use a menu and stacked narrative sections; the fixed header has matching document inset.
