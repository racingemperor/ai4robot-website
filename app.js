/* Research narrative, catalog and evaluation method. */
const params=new URLSearchParams(location.search);
const state={group:GROUPS.some(g=>g.id===params.get('group'))?params.get('group'):'all',category:CATEGORIES.some(c=>c.id===params.get('category'))?params.get('category'):'all',search:(params.get('q')||'').slice(0,160),selected:TASKS.some(t=>t.id===params.get('task'))?params.get('task'):'T06'};
// Add reviewed task clips here; the same task ID supplies the wall destination.
// Example entry: T06: {src:'media/T06.mp4', poster:'media/T06.jpg'}.
const HOME_VIDEOS=Object.freeze({});
const HOME_WALL_COLUMNS=[
 ['T01','T07','T13','T20'],
 ['T02','T08','T14','T21'],
 ['T03','T09','T15','T22'],
 ['T04','T10','T16','T23'],
 ['T05','T11','T17'],
 ['T06','T12','T19']
];
function homeWallTile(id,copy) {
 const t=task(id),clip=HOME_VIDEOS[id];
 return `<a class="wall-tile" data-wall-task="${id}" href="${Site.href('tasks',{task:id})}" aria-label="Open ${id}: ${esc(t.name)}" ${copy?'tabindex="-1" aria-hidden="true"':''} style="--task-color:${group(t.group).color}">
  ${thumbnail(t,`wall-${id}-${copy}`)}${clip?`<video data-home-video src="${esc(clip.src)}" ${clip.poster?`poster="${esc(clip.poster)}"`:''} muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true"></video>`:''}
  <span class="wall-tile-top"><span>${id} / ${esc(t.robot)}</span><span class="wall-tile-arrow" aria-hidden="true">↗</span></span>
  <span class="wall-tile-caption"><strong>${esc(t.name)}</strong><span data-wall-media-label>${clip?'TASK VIDEO':'CONCEPT PREVIEW'}</span></span>
 </a>`;
}
function homeHero(){return `<section class="hero hero-cinema" aria-labelledby="hero-title" data-motion="paused">
 <div class="hero-wall" aria-label="Task previews: open any tile to explore its task"><div class="wall-plane">${HOME_WALL_COLUMNS.map(ids=>`<div class="wall-column"><div class="wall-track">${[0,1].map(copy=>`<div class="wall-cycle" ${copy?'aria-hidden="true"':''}>${ids.map(id=>homeWallTile(id,copy)).join('')}</div>`).join('')}</div></div>`).join('')}</div></div>
 <div class="hero-shade" aria-hidden="true"></div>
 <div class="hero-copy"><h1 id="hero-title">Embodied Generalist Exam</h1><p class="hero-question">Evaluating General-Purpose Models in the Physical World</p><dl class="home-hero-statistics" aria-label="Benchmark scale"><div><dt>Tasks</dt><dd>22</dd></div><div><dt>Task categories</dt><dd>5</dd></div><div><dt>Robot platforms</dt><dd>6</dd></div></dl></div>
 </section>`;}
function home(){return homeHero()+HomeOverview.introduction();}
function taskCard(t) {
 const traits=t.capabilities.map(([name])=>name);
 return `<button class="task-card" data-select="${t.id}" aria-haspopup="dialog" aria-controls="task-focus" aria-label="Open ${t.id}: ${t.name}" style="--task-color:${group(t.group).color}">
  <span class="task-card-image">${thumbnail(t)}<span class="task-card-id">${t.id}</span><span class="task-card-open" aria-hidden="true">↗</span><span class="task-image-note">CONCEPT PREVIEW / IMAGE RESERVED</span></span>
  <span class="task-card-body"><span class="task-card-category">${category(t.category).name} <span>${t.robot}</span></span><strong class="task-card-title">${t.name}</strong><span class="task-card-goal">${t.goal}</span>
  <span class="task-trait-cells" aria-label="Task characteristics">${traits.map(name=>`<span><i aria-hidden="true"></i>${name}</span>`).join('')}</span><span class="task-card-bottom"><span>${tracks[t.track].output}</span><span>Explore task <b aria-hidden="true">↗</b></span></span></span>
 </button>`;
}
function explorer() {
 return `<section class="task-gallery" aria-label="Task explorer">
  <div class="task-gallery-tools"><label>Find a task<input id="task-search" type="search" placeholder="Task, skill or robot" autocomplete="off" value="${esc(state.search)}"></label><label>Category<select id="task-category"><option value="all">All categories</option>${CATEGORIES.map(c=>`<option value="${c.id}">${c.name} · ${c.count}</option>`).join('')}</select></label><label>Capability<select id="task-group"><option value="all">All capabilities</option>${GROUPS.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></label><div id="result-count" role="status" aria-live="polite">22 tasks</div></div>
  <p class="task-gallery-note">Each task connects an instruction to a verifiable outcome. Explore its goal, capabilities, evaluation package and model evidence. The small cells describe capabilities, not measured difficulty.</p>
  <div id="task-collection" class="task-card-grid"></div>
  <dialog id="task-focus" class="task-focus" aria-labelledby="task-title"><div class="task-window-bar"><span id="task-window-label">TASK EXPLORER</span><button type="button" data-close-task aria-label="Close task" title="Close task"><span aria-hidden="true">×</span></button></div><div class="task-focus-scroll"><article id="task-detail" class="task-article" aria-labelledby="task-title"></article></div></dialog>
  <span id="task-selection-status" class="sr-only" role="status" aria-live="polite"></span>
 </section>`;
}
function filteredTasks() {
 const query=state.search.toLowerCase().trim();
 return TASKS.filter(t=>(state.group==='all'||t.group===state.group)&&
  (state.category==='all'||t.category===state.category)&&
  `${t.id} ${t.name} ${t.robot} ${t.goal} ${t.capabilities.flat().join(' ')}`.toLowerCase().includes(query));
}
function collection() {
 const ts=filteredTasks();
 $('#result-count').textContent=`${ts.length} of ${TASKS.length} tasks`;
 $('#task-collection').innerHTML=ts.length?ts.map(taskCard).join(''):'<div class="task-gallery-empty"><h2>No matching tasks.</h2><p>Try a task ID, a skill such as “contact”, or a robot such as “Go2”.</p><button class="button" data-action="reset-search">Clear filters</button></div>';
 if(ts.length&&!ts.some(t=>t.id===state.selected))state.selected=ts[0].id;
}
function refreshTaskDestinations() {
 $$('[data-task-destination]').forEach(link=>{link.href=Site.href(link.dataset.taskDestination,link.dataset.taskDestination==='run'?{task:state.selected}:{episodeTask:state.selected});});
 $$('.task-evidence-link').forEach(link=>{link.href=Site.href('episodes',{episodeTask:state.selected,episodeModel:link.dataset.taskModel});});
}
function renderTaskPerformance() {
 const host=$('#task-performance');
 if(!host||!window.Lab)return;
 const report=Lab.taskPerformance(state.selected);
 const percentage=value=>value===null?'—':`${(value*100).toFixed(1)}%`;
 host.innerHTML=`<div class="task-section-heading"><div><h3 id="task-results-title" tabindex="-1">Model performance</h3><p>How models perform on this task under the same report protocol.</p></div><span class="task-data-source" data-source="${report.source}">${esc(report.label)}</span></div>
  ${report.source!=='official'?`<p class="task-report-context">${esc(report.protocol)} · ${esc(report.version)}${report.synthetic?' · These values are synthetic interface examples.':' · Locally imported results have not been reviewed.'}</p>`:''}
  ${report.rows.length?`<div class="table-scroll task-results-scroll" role="region" aria-label="Model performance for ${state.selected}; horizontally scrollable" tabindex="0"><table class="results-table task-results-table"><caption class="sr-only">${state.selected} · ${esc(report.label)} · ${esc(report.protocol)}</caption><thead><tr><th scope="col">Model / agent</th><th scope="col">Success rate</th><th scope="col">Progress / 100</th><th scope="col">Trials</th><th scope="col">Mean sim. time</th><th scope="col">Evidence</th></tr></thead><tbody>${report.rows.map(m=>`<tr><th scope="row"><strong>${esc(m.name)}</strong><small>${esc(m.version)} · ${esc(m.agent)}</small></th><td><strong>${percentage(m.score)}</strong>${m.ci?`<small>95% CI ${percentage(m.ci[0])}–${percentage(m.ci[1])}</small>`:'<small>No evaluation</small>'}</td><td>${m.progress===null?'—':(m.progress*100).toFixed(1)}</td><td>${m.trials||'—'}</td><td>${m.duration===null?'—':`${m.duration.toFixed(1)} s`}</td><td>${m.episodeCount?`<a class="task-evidence-link" data-task-model="${esc(m.id)}" href="${esc(Site.href('episodes',{episodeTask:state.selected,episodeModel:m.id}))}">${m.episodeCount} episode${m.episodeCount===1?'':'s'} ↗</a>`:'<span class="task-unavailable">Not attached</span>'}</td></tr>`).join('')}</tbody></table></div><p class="task-metric-note">Success and progress use all valid trials for this task. The 95% interval describes success-rate uncertainty; a dash means no evaluation.</p>`:`<div class="task-results-empty"><div><h4>No reviewed model results yet.</h4><p>Success rate, progress, trial count and episode evidence will appear here when evaluation reports are connected.</p></div><button class="button" data-task-source="demo">Preview example results</button></div>`}
  <div class="task-results-actions">${report.source!=='official'?'<button class="text-link" data-task-source="official">View official results</button>':''}<button class="text-link" data-section="matrix">${report.rows.length?'Open the full results matrix':'Import a report in the results matrix'} ↗</button></div>`;
 refreshTaskDestinations();
}
function detail() {
 const ts=filteredTasks();
 if(!ts.length)return;
 const t=task(state.selected),index=ts.findIndex(item=>item.id===t.id);
 $('#task-window-label').textContent=`${t.id} / ${category(t.category).name.toUpperCase()}`;
 $('#task-detail').innerHTML=`<header class="task-article-header">
  <div class="task-identity"><span>${t.id}</span><span>${category(t.category).name}</span></div>
  <h2 id="task-title" tabindex="-1">${t.name}</h2><p class="task-objective">${t.goal}</p>
  <dl class="task-facts"><div><dt>Embodiment / scene</dt><dd>${t.robot}</dd></div><div><dt>Model deliverable</dt><dd>${tracks[t.track].output}</dd></div><div><dt>Capability facet</dt><dd>${group(t.group).name}</dd></div></dl>
 <a class="text-link task-replay-link" data-task-destination="episodes" href="${Site.href('episodes',{episodeTask:t.id})}">Replay this task · video, responses &amp; code ↗</a>
 <div class="task-detail-tabs" role="group" aria-label="Task detail views">${[['overview','Overview'],['abilities','Capabilities'],['results','Model results'],['evidence','Evidence']].map(([id,label])=>`<button data-task-view="${id}" aria-pressed="${id===state.taskView}" aria-controls="task-${id}-view">${label}</button>`).join('')}</div>
 </header>
 <div id="task-overview-view" data-task-view-panel="overview"><section class="task-overview" aria-label="Task demonstration and completion criteria">
  <figure class="task-demonstration">${Evidence.slot('VIDEO','Task demonstration video',`${t.id} · One representative model episode · 16:9`,'task-video-slot')}<figcaption><strong>Task demonstration</strong><span>One representative episode showing the task from start to finish</span></figcaption></figure>
  <div class="task-completion"><h3>What counts as completion?</h3><p>${t.proof}</p><ul>${t.checks.map(check=>`<li>${check}</li>`).join('')}</ul></div>
 </section>
 </div><div id="task-evidence-view" data-task-view-panel="evidence"><section class="task-evidence-details task-article-section" aria-labelledby="task-evidence-title"><div class="task-section-heading"><div><h3 id="task-evidence-title">See the task in detail</h3><p>Initial observations, a key interaction and the final evidence.</p></div></div><div class="task-evidence-grid">${Evidence.slot('IMAGE','Initial observation',t.input)}${Evidence.slot('IMAGE / CLIP','Key interaction',t.beats[1])}${Evidence.slot('IMAGE / RESULT','Final state and judgment',t.proof)}</div></section>
 </div><div id="task-abilities-view" data-task-view-panel="abilities"><section class="task-abilities task-article-section" aria-labelledby="task-abilities-title"><div class="task-section-heading"><div><h3 id="task-abilities-title">What does this task test?</h3><p>The capabilities a model needs to turn the instruction into a physical result.</p></div></div><div class="task-ability-grid">${t.capabilities.map(([name,description])=>`<div><h4>${name}</h4><p>${description}</p></div>`).join('')}</div></section>
 </div><div id="task-results-view" data-task-view-panel="results"><section id="task-performance" class="task-article-section" aria-labelledby="task-results-title"></section>
 </div><div data-task-view-panel="overview"><section class="task-procedure task-article-section" aria-labelledby="task-procedure-title"><h3 id="task-procedure-title">From input to verification</h3><div class="task-input"><h4>Task input</h4><p>${t.input}</p></div><ol class="task-sequence">${t.beats.map(beat=>`<li>${beat}</li>`).join('')}</ol><div class="task-current-scope"><h4>Current scope</h4><p>${t.note}</p></div>${Paper.taskPackage(t)}<div class="task-detail-links"><a class="text-link" data-task-destination="run" href="${Site.href('run',{task:t.id})}">Configure this task ↗</a><a class="text-link" data-task-destination="episodes" href="${Site.href('episodes',{episodeTask:t.id})}">Browse task episodes ↗</a></div></section>
 </div><div data-task-view-panel="evidence"><section class="task-article-section task-artifact" aria-labelledby="task-artifact-title"><h3 id="task-artifact-title">What the model submits</h3>${Evidence.slot('OUTPUT',tracks[t.track].output,t.track==='A'?'Submitted policy file and execution feedback':t.track==='B'?'Training curves, learned weights and held-out evaluation':'Generated scene or motion artifact and validation report')}</section>
 </div><nav class="task-pagination" aria-label="Previous and next task"><button data-select="${ts[index-1]?.id||''}" ${index===0?'disabled':''}><span>Previous task</span><strong>${ts[index-1]?`${ts[index-1].id} · ${ts[index-1].name}`:'Start of selection'}</strong></button><span>${index+1} / ${ts.length}</span><button data-select="${ts[index+1]?.id||''}" ${index===ts.length-1?'disabled':''}><span>Next task</span><strong>${ts[index+1]?`${ts[index+1].id} · ${ts[index+1].name}`:'End of selection'}</strong></button></nav>`;
 setTaskDetailView(state.taskView);
 renderTaskPerformance();
}
function methodPage(){return `<div class="document-layout"><aside class="document-index"><span class="mono">METHOD CONTENTS</span>${[['benchmark-design','Benchmark design'],['task-creation','Task creation'],['fair-evaluation','Fairness & metrics'],['routes','Evaluation routes'],['visibility','Information boundary'],['categories','Five task categories'],['execution','Hidden evaluation'],['judgement','Scoring & reporting'],['boundaries','Current scope']].map(([id,title])=>`<a href="#${id}">${title}</a>`).join('')}<a class="text-link" data-site-page="run" href="${Site.href('run')}">Configure a run ↗</a></aside><div class="document-body">${Paper.design()}${Paper.creation()}${Paper.setting()}<section id="routes" class="document-section"><h2>Separate the evaluation routes.</h2><p>A coding agent writes a program that controls the robot. A direct-policy model chooses each action itself. Both face physical consequences, but their compute, interaction and tool access differ. Report them under distinct protocols.</p>${Evidence.slot('FIGURE','Evaluation pipeline','Instruction → model or coding agent → simulator → judge','document-figure')}<div class="method-routes"><article><h3>Program submission</h3><p>The agent develops <code>policy.py</code> through the SDK. A hidden evaluator runs the submitted program. Policy-development tasks instead submit weights and code; scene generation and scene and interaction reconstruction tasks submit scene or motion files.</p></article><article><h3>Direct LLM-as-Policy</h3><p>The model receives an observation and emits one tool action. The current ARX tools provide end-effector motion, wait, done and give_up. Non-learning execution code validates and translates commands.</p></article></div></section><section id="visibility" class="document-section"><h2>The agent sees observations. The judge sees state.</h2>${Evidence.slot('IMAGE','Permitted observations','Camera views, measured state and calibration examples','document-figure')}<div class="visibility-grid"><article><h3>Current ARX direct-policy inputs</h3><ul><li>Task instruction and robot manual</li><li>Head and wrist RGB images</li><li>Measured TCP poses and gripper state</li><li>Camera intrinsics and extrinsics</li><li>Execution feedback and remaining budget</li></ul></article><article><h3>Withheld from that agent</h3><ul><li>Depth images</li><li>Object poses and privileged layout metadata</li><li>Hidden seeds and evaluation instances</li><li>Judge internals and intermediate scoring state</li><li>Task-specific solutions or action recipes</li></ul></article></div><p>T12 is an explicit in-context learning task: demonstrations are supplied as part of its input. Reconstruction tasks also receive their specified observations. Input permissions must be stated per task and protocol.</p></section><section id="categories" class="document-section"><h2>Five categories from the EGE abstract.</h2><p>Robotic manipulation, navigation, scene generation, scene and interaction reconstruction, and policy development are separate task categories. Each has its own deliverable and verification requirements.</p><div class="category-method">${CATEGORIES.map(c=>`<article><span>${c.count} TASK${c.count===1?'':'S'}</span><h3>${c.name}</h3><p><strong>Submit:</strong> ${c.output}</p><p><strong>Hidden:</strong> ${c.hidden}</p><p>${{manipulation:'Judge the final physical state against task-specific constraints.',navigation:'Judge goal reports or arrival and any required safety constraints.','policy-development':'Run submitted weights under a fixed evaluator and held-out conditions.','scene-generation':'Load and step the generated scene, then verify text constraints and physical interactions.',reconstruction:'Compare the reconstructed scene or motion with reference observations and verify geometry, articulation and contact.'}[c.id]}</p></article>`).join('')}</div></section><section id="execution" class="document-section"><h2>Development proves feasibility. Evaluation measures the agent.</h2><ol class="protocol-flow"><li><strong>Freeze the interface and budget</strong><p>Record task, simulator, model, agent, tool and protocol versions. Declare the permitted observations and limits on commands, control steps and time.</p></li><li><strong>Check solvability separately</strong><p>A scripted reference solver may read privileged state but uses the same embodiment commands. A null solver checks that inactivity does not pass. Neither supplies a model score.</p></li><li><strong>Evaluate on held-out conditions</strong><p>The current manipulation/navigation plan uses three layouts generated from a hidden seed, with ten repeats per layout. Policy development uses a fixed hidden evaluator; scene generation and scene and interaction reconstruction use ten instances. Final releases must record the actual counts and task-specific exceptions.</p></li><li><strong>Judge and retain the evidence</strong><p>The direct-policy route settles the physical state before judging. Calling done does not itself imply success. Infrastructure failures are invalid trials requiring reruns, not valid robot failures.</p></li></ol></section><section id="judgement" class="document-section"><h2>Balance the categories. Keep the evidence.</h2>${Evidence.slot('FIGURE / OUTPUT','Scoring example','A final-state frame beside its judge report','document-figure')}<div class="definition-list"><article><h3>Success</h3><p>Compute each task’s success rate. Average tasks within each category, then average the categories represented in the selected scope. This prevents the larger manipulation set from dominating the overall score.</p></article><article><h3>Progress</h3><p>Task judges define a 0–100 score: success is 100 and inactivity is 0. The website report stores normalized progress sums in 0–1 units, converts to points for display and uses the same category averaging.</p></article><article><h3>Coverage</h3><p>Missing evaluation is distinct from failure. Only complete coverage of the current selected scope earns a rank. Partial summaries are marked; category scores remain unavailable if any selected category has no data.</p></article><article><h3>Uncertainty</h3><p>The pooled success rate is shown separately with a Wilson 95% interval. That interval describes pooled trials, not the category-balanced score, and does not account for task or seed correlations.</p></article><article><h3>Time & provenance</h3><p>Mean simulation time uses total simulation seconds divided by all valid trials. Keep wall-clock and model latency separate. Never mix protocols, real and simulated environments, or synthetic and observed data.</p></article></div><a class="text-link" data-site-page="leaderboard" href="${Site.href('leaderboard')}">Inspect the reporting interface ↗</a></section><section id="boundaries" class="document-section"><h2>A research suite in development.</h2><p>The catalog has 22 tasks, excluding the deferred T18. Definitions, reference implementations and model evaluation coverage are different stages. This website currently publishes no reviewed model leaderboard.</p><ul class="boundary-list"><li>Direct-policy support is currently ARX X5. T02/T06/T19 have verified replay checks; T01 unlocking remains unresolved.</li><li>T04 uses pre-segmented cutting. T07 begins with one rotating cube layer. T20 begins with a single knot.</li><li>G1 begins with standing upper-body control; locomotion-dependent tasks need additional integration.</li><li>T21 uses a frozen Go2 locomotion controller; T16 evaluates policy training separately.</li><li>The shared container layout is a planned packaging architecture. Do not infer that every task is released as a ready-to-run package.</li></ul><p class="source-note">Benchmark motivation and design are adapted from the current EGE manuscript, reviewed October 24, 2026. Task definitions, implementation limits and direct-policy details follow the research repository reviewed October 23, 2026. Follow the repository for current changes.</p><a class="text-link" href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository · access required ↗</a></section></div></div>`;}
function setTaskDetailView(view) {
 state.taskView=view;
 $$('[data-task-view-panel]').forEach(panel=>panel.hidden=panel.dataset.taskViewPanel!==view);
 $$('[data-task-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.taskView===view)));
}
function saveTaskView(){const p=new URLSearchParams(location.search);for(const [key,value]of Object.entries({task:state.taskOpen?state.selected:'',category:state.category,group:state.group,q:state.search}))if(value&&value!=='all')p.set(key,value);else p.delete(key);p.delete('view');history.replaceState({},'',location.pathname+(p.size?'?'+p:'')+location.hash);Site.refreshLinks();refreshTaskDestinations();}
function syncFilters(){if($('#task-category'))$('#task-category').value=state.category;if($('#task-group'))$('#task-group').value=state.group;}
const infoPage=document.body.dataset.page;
let taskWindow;
state.taskView='overview';state.taskOpen=false;
if(infoPage==='home'){$('#page-content').innerHTML=home();Motion.revealHome($('#page-content'));Motion.videoWall($('.hero-cinema'));}
if(infoPage==='tasks'){
 $('#tasks-catalog-panel').innerHTML=explorer();collection();syncFilters();
 taskWindow=Motion.taskWindow($('#task-focus'),()=>{state.taskOpen=false;if(Site.section==='catalog')saveTaskView();});
 const openLinkedTask=()=>{if(Site.section==='catalog'&&new URLSearchParams(location.search).has('task')){state.taskOpen=true;detail();taskWindow.open();}};
 openLinkedTask();
 document.addEventListener('site:sectionchange',()=>{
  if(Site.section!=='catalog'){const wasOpen=state.taskOpen;taskWindow.close(true);if(wasOpen)$(`[data-section="${Site.section}"]`)?.focus();return;}
  const p=new URLSearchParams(location.search);
  state.category=CATEGORIES.some(c=>c.id===p.get('category'))?p.get('category'):'all';
  state.group=GROUPS.some(g=>g.id===p.get('group'))?p.get('group'):'all';
  state.search=(p.get('q')||'').slice(0,160);
  state.selected=TASKS.some(t=>t.id===p.get('task'))?p.get('task'):'T06';
  $('#task-category').value=state.category;$('#task-search').value=state.search;collection();syncFilters();openLinkedTask();
 });
 window.addEventListener('popstate',()=>{if(!new URLSearchParams(location.search).has('task'))taskWindow.close(true);});
}
if(infoPage==='report')$('#report-method-panel').innerHTML=methodPage();
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.select){const source=b.closest('.task-card');state.selected=b.dataset.select;state.taskView='overview';state.taskOpen=true;detail();saveTaskView();$('#task-selection-status').textContent=`${state.selected}: ${task(state.selected).name}`;if(source)taskWindow.open(source);else{$('.task-focus-scroll').scrollTop=0;$('#task-title').focus({preventScroll:true});}}if(b.dataset.taskView){setTaskDetailView(b.dataset.taskView);}if(b.dataset.taskSource&&window.Lab){setTaskDetailView('results');Lab.useTaskSource(b.dataset.taskSource);$('#task-results-title')?.focus({preventScroll:true});}if(b.dataset.action==='reset-search'){state.search='';state.group=state.category='all';$('#task-search').value='';$('#task-category').value='all';collection();syncFilters();saveTaskView();}});
document.addEventListener('input',e=>{if(e.target.id==='task-search'){state.search=e.target.value;collection();saveTaskView();}});
document.addEventListener('change',e=>{if(e.target.id==='task-category'){state.category=e.target.value;collection();saveTaskView();}if(e.target.id==='task-group'){state.group=e.target.value;collection();saveTaskView();}});

document.addEventListener('lab:reportchange',renderTaskPerformance);
