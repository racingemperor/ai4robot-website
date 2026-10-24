# Website design and content architecture

## Research story

The site asks whether a general-purpose language model or coding agent can turn an instruction into a physical outcome. The home page establishes the question, lets visitors inspect the program-submission and direct-policy routes, and uses T06 to explain why visible progress can still fail the full instruction.

The visual language is paper, dark ink and rust red, with editorial typography and original technical SVG diagrams. Diagrams are labeled concept illustrations. No external experimental media is embedded.

## Distinct pages

Tasks uses a narrow searchable directory and a wide task brief. Each task explains its objective, three capabilities, completion checks, input, execution stages and current scope. A per-task table reads the same report as the matrix, showing success, progress, trials, simulation time and matching episode evidence. Official results remain empty until reviewed reports exist; synthetic and local sources are labeled. Leaderboard contains rankings and model comparison on common tasks. Episodes inspects evidence in time. Documents brings together the evaluation method, run configuration and project resources. Home introduces the research. These five main pages have distinct document URLs and one H1 each.

The fixed header has exactly four categories: Tasks, Leaderboard, Episodes and Documents. Home is reached through the logo. Ranking / Model comparison are local Leaderboard views; Task catalog / Results matrix are local Tasks views; Method / Run / Resources are local Documents views. Native buttons with pressed states and labeled regions switch content in the same document, keeping the parent header current. The section query parameter supports direct links, refresh and browser back/forward.

Catalog and matrix share category/capability scope; catalog search, selected task and active report source are preserved. The task selector folds into a native disclosure on smaller screens. Previous/next controls follow the filtered task selection. Report imports rebuild only the report host. Documents mounts the method separately from configuration and resource tools; imports and section switches never overwrite the method. The run configuration stays in memory between Documents views. Regular links between these sections are intercepted for local switching, while modified clicks retain native browser behavior.

The leaderboard ranking table stays focused on metrics without comparison action columns. Explicit task evidence links remain regular document links. The header switches to a menu at 1100 px and below. Old compare.html and matrix.html URLs redirect to their parent sections; method.html, run.html and about.html redirect to Documents. The retired footage.html URL redirects to Documents. Legacy index.html?lab= bookmarks also remain supported. Media plan is removed from navigation and public flows; task dossiers retain evidence requirements. No Environment category has been added.

## Three separate concepts

- Evaluation categories: manipulation (14), navigation (3), training (2), construction (3).
- Delivery modes: control program (17), training code/weights (2), scene/motion artifact (3).
- Capability facets: objects/contact, dexterity, body/control, spatial reasoning, world construction.

These are separate axes. T12 includes a mobile base but is evaluated as manipulation. T11 submits a control program and belongs to manipulation, not policy training.

## Sources and research maturity

The research README, docs/TASKS.md, docs/AGENT_EVAL.md and task designs were reviewed on October 23, 2026. The project Notion notebook supplies task motivation and references. GitHub defines the current implementation; the user explicitly selected its crowd-navigation definition for T23 over the notebook's trajectory-collection alternative.

The catalog states implementation limits: pre-segmented cutting, a single rotating cube layer, initial single-knot tying, standing G1 scope, frozen Go2 navigation and separately trained locomotion. Direct-policy support currently covers the ARX tools; replay checks exist for T02/T06/T19. None of these facts implies a completed 22-task model evaluation.

T06 outcome examples explain documented judge rules (0, approximately 60, 70 and 100), not observed model performance. References may use privileged state and are always distinct from evaluated agents.

## Reference websites

Earlier public-page observations of RoboDojo and Embodied First Exam informed the independent task/results/method/reproduction page roles. This site does not copy their branding, media or distinctive visual presentation. It uses detailed task briefs, a scoring case study and linked evidence tools to express this research's structure.

## Accessibility and responsive behavior

English metadata, lang=en, one H1 per document, sequential heading hierarchy, a skip link, labeled native controls, visible focus, aria-current navigation and reduced-motion support. Filter and selection state has textual labels and pressed states. Data tables scroll within labeled regions. Small screens use a menu and stacked narrative sections; the fixed header has matching document inset.
