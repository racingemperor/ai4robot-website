# Website design and content architecture

## Research story

The site asks whether a general-purpose language model or coding agent can turn an instruction into a physical outcome. The home page establishes the question, lets visitors inspect the program-submission and direct-policy routes, and uses T06 to explain why visible progress can still fail the full instruction.

The visual language is paper, dark ink and rust red, with editorial typography and original technical SVG diagrams. Diagrams are labeled concept illustrations. No external experimental media is embedded.

## Distinct pages

The task atlas describes what is tested. Method describes how the test is controlled. Leaderboard ranks complete reports, Compare shows capability differences on common tasks, Matrix exposes per-task gaps, and Episodes inspects evidence in time. Run generates commands; Resources explains access and reporting; Media plan specifies future evidence. All have real document URLs and their own H1.

The fixed header is the only page-category navigation. Tasks, Leaderboard, Compare, Task matrix, Episodes, Method, Run, Resources and Media plan are independent top-level destinations. There is no secondary result-page navigation. Leaderboard contains ranking, filters, metric explanations and exports; it has no comparison action column. Page-local controls keep the current document and its active header item. The header switches to a menu at 1100 px and below so every destination remains available. Explicit evidence and resource links remain regular document links. Cross-page links carry relevant task/model/source filters only. Legacy lab bookmarks redirect to the corresponding document.

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

Earlier public-page observations of RoboDojo and Embodied First Exam informed the independent task/results/method/reproduction page roles. This site does not copy their branding, media or distinctive visual presentation. It uses an atlas, a scoring case study and linked evidence tools to express this research's structure.

## Accessibility and responsive behavior

English metadata, lang=en, one H1 per document, sequential heading hierarchy, a skip link, labeled native controls, visible focus, aria-current navigation and reduced-motion support. Filter and selection state has textual labels and pressed states. Data tables scroll within labeled regions. Small screens use a menu and stacked narrative sections; the fixed header has matching document inset.
