/* Curated manuscript content. No publication metadata or measured results are inferred. */
window.Paper = (() => {
 const title='Embodied Generalist Exam';
 const overview=[
  'Foundation models are increasingly used to control robots, construct simulations, reconstruct interactions and develop policies. Much of the evidence comes from isolated demonstrations, making it difficult to compare models or distinguish a successful attempt from reliable performance.',
  'The Embodied Generalist Exam (EGE) is designed to evaluate this broader range of embodied capabilities through tasks with explicit objectives and verifiable outcomes. Models can plan, invoke tools, generate control programs or develop robot policies within task-specific constraints, without additional training or fine-tuning of the foundation model being evaluated.',
  'A common evaluation framework pairs task instructions, environments and interaction tools with independent evaluation functions. Three independent trials per task and model, including failures and timeouts, characterize both capability and reliability. Average task scores, total elapsed time and token consumption capture complementary aspects of performance.'
 ];
 const stages=[
  ['Design','Define the objective, inputs, deliverable, physical constraints and success criteria.'],
  ['Review','Cross-check the specification, required capabilities and physical feasibility.'],
  ['Development','Implement the environment, interaction tools and independent evaluation functions.'],
  ['Evaluation','Check feasibility with reference solutions and validate success and progress measures.'],
  ['Final review','Recheck task validity, physical behavior and evaluation integrity.'],
  ['Submission','Prepare the task package, instructions and evaluation configuration.']
 ];
 const packageParts=[
  ['Task instructions','A concrete objective and a required deliverable.'],
  ['Environment','Robot and scene assets with initialization settings.'],
  ['Interaction interface','Task-specific observations, tools, actions and execution constraints.'],
  ['Independent evaluation','Success criteria and intermediate progress measured by trusted functions.']
 ];
 const metrics=[
  ['Average score','Each trial receives a task-specific score out of 100. Task scores average all valid trials, including failures and timeouts; category and Overall scores average their task scores equally.'],
  ['Total elapsed time','The complete solving process: model inference, environment interaction, execution and permitted retries. This is wall-clock time, separate from simulation time.'],
  ['Token consumption','Tokens consumed by the evaluated model during the solving process, recorded with the model, agent and evaluation protocol.']
 ];
 function summary(){return `<section id="paper-summary" class="paper-summary" aria-labelledby="paper-summary-title">
  <div class="paper-summary-heading"><div><p class="eyebrow">MANUSCRIPT OVERVIEW</p><h2 id="paper-summary-title">${title}</h2><p class="paper-summary-subtitle">Evaluating the breadth, reliability and efficiency of embodied foundation models.</p></div><span>Research in progress</span></div>
  <div class="paper-summary-text">${overview.map(text=>`<p>${text}</p>`).join('')}</div>
  <div class="paper-summary-links"><a class="text-link" href="${Site.href('method')}#benchmark-design">Explore the benchmark design ↗</a><a class="text-link" href="${Site.href('tasks')}">Browse the current task catalog ↗</a></div>
  <p class="source-note">Adapted from the current manuscript’s abstract, Introduction and Dataset sections. The public catalog contains 23 tasks in the six categories defined in the current EGE manuscript. The paper PDF, author list and empirical findings will accompany a future release.</p>
 </section>`;}
 function design(){return `<section id="benchmark-design" aria-labelledby="benchmark-design-title"><h2 id="benchmark-design-title">One framework. Many ways to solve.</h2><p>EGE studies the capabilities of existing foundation models across embodied problems. The evaluated foundation model is not additionally trained or fine-tuned; a policy-development task can still require it to train a separate robot policy.</p><p>The benchmark spans 23 tasks, six task categories and five classes of robot embodiments, using NVIDIA Isaac Sim 5.1 and Isaac Lab. A modular design separates simulation, robot embodiments and task logic, so tasks can define different observations and actions on a shared physical foundation.</p><div class="paper-package-grid">${packageParts.map(([heading,text])=>`<article><h3>${heading}</h3><p>${text}</p></article>`).join('')}</div></section>`;}
 function creation(){return `<section id="task-creation" class="document-section"><h2>From demonstrations to evaluation tasks.</h2><p>The manuscript describes collecting demonstrations from research projects, open-source repositories and online platforms, retaining their sources for traceability. Candidates are grouped by task type, embodiment and required capabilities, then screened and deduplicated.</p><p>Selection favors distinct capability requirements, clear objectives, physical feasibility and verifiable outcomes. Reference demonstrations motivate a task; they are separate from evaluation evidence produced by a tested model.</p><h3 class="paper-stage-heading">A six-stage construction process</h3><ol class="paper-stage-grid">${stages.map(([heading,text])=>`<li><h4>${heading}</h4><p>${text}</p></li>`).join('')}</ol><p class="source-note">The manuscript specifies cross-checks by at least three authors at each stage. This describes the task-creation process; current task implementation status remains visible in each task dossier.</p></section>`;}
 function setting(){return `<section id="fair-evaluation" class="document-section"><h2>Flexible strategies. Matched conditions.</h2><p>Models may interact with the environment, invoke tools, plan, write control programs or develop policies according to each task. Comparisons hold task-specific initial settings, available tools, time limits and attempt budgets constant.</p><p>A lightweight integration interface is intended to minimize model-specific adaptation. Predefined evaluation functions judge the outcome independently of the strategy used. Trusted functions can access simulator ground truth while that privileged state remains isolated from model observations.</p><div class="paper-metric-grid">${metrics.map(([heading,text])=>`<article><h3>${heading}</h3><p>${text}</p></article>`).join('')}</div><p class="paper-report-note">The current website reports average scores, coverage and simulation time. Full-process wall-clock time and token consumption are manuscript reporting goals; measured values are not connected here yet.</p></section>`;}
 function taskPackage(t){return `<details class="task-package"><summary>What belongs in this evaluation package?</summary><p>The manuscript defines a task package around four components. For ${t.id}, the required deliverable is <strong>${tracks[t.track].output}</strong>; implementation readiness is described above.</p><dl>${packageParts.map(([heading,text])=>`<div><dt>${heading}</dt><dd>${text}</dd></div>`).join('')}</dl></details>`;}
 return {title,summary,design,creation,setting,taskPackage};
})();
