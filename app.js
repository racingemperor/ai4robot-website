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
function home(){return homeHero()+HomeOverview.introduction()+HomeOverview.shell();}
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
function detail() {
 const t=task(state.selected),ts=filteredTasks(),index=ts.findIndex(item=>item.id===t.id);
 TaskReplay.suspend();
 $('#task-window-label').textContent=`${t.id} / ${category(t.category).name.toUpperCase()}`;
 $('#task-detail').innerHTML=`<header class="task-article-header"><div class="task-identity"><span>${t.id}</span><span>${category(t.category).name}</span></div>
  <h2 id="task-title" tabindex="-1">${t.name}</h2><p class="task-objective">${t.goal}</p>
  <dl class="task-facts"><div><dt>Embodiment / scene</dt><dd>${t.robot}</dd></div><div><dt>Model deliverable</dt><dd>${tracks[t.track].output}</dd></div><div><dt>Capability facet</dt><dd>${group(t.group).name}</dd></div></dl></header>
 <section id="task-replay" class="task-integrated-replay" aria-label="Model performance and synchronized task demonstrations"></section>
 <section class="task-article-section task-completion" aria-labelledby="task-completion-title"><h3 id="task-completion-title">What counts as completion?</h3><p>${t.proof}</p><ul>${t.checks.map(check=>`<li>${check}</li>`).join('')}</ul></section>
 <section class="task-abilities task-article-section" aria-labelledby="task-abilities-title"><h3 id="task-abilities-title">What does this task test?</h3><div class="task-ability-grid">${t.capabilities.map(([name,description])=>`<div><h4>${name}</h4><p>${description}</p></div>`).join('')}</div></section>
 <section class="task-procedure task-article-section" aria-labelledby="task-procedure-title"><h3 id="task-procedure-title">From input to verification</h3><div class="task-input"><h4>Task input</h4><p>${t.input}</p></div><ol class="task-sequence">${t.beats.map(beat=>`<li>${beat}</li>`).join('')}</ol><div class="task-current-scope"><h4>Current scope</h4><p>${t.note}</p></div></section>
 <section class="task-evidence-details task-article-section" aria-labelledby="task-evidence-title"><h3 id="task-evidence-title">Task evidence and deliverable</h3><div class="task-evidence-grid">${Evidence.slot('IMAGE','Initial observation',t.input)}${Evidence.slot('IMAGE / RESULT','Final state and judgment',t.proof)}${Evidence.slot('OUTPUT',tracks[t.track].output,'The submitted artifact and validation report')}</div></section>
 <nav class="task-pagination" aria-label="Previous and next task"><button data-select="${ts[index-1]?.id||''}" ${index<=0?'disabled':''}><span>Previous task</span><strong>${ts[index-1]?`${ts[index-1].id} · ${ts[index-1].name}`:'Start of selection'}</strong></button><span>${index+1} / ${ts.length}</span><button data-select="${ts[index+1]?.id||''}" ${index===ts.length-1?'disabled':''}><span>Next task</span><strong>${ts[index+1]?`${ts[index+1].id} · ${ts[index+1].name}`:'End of selection'}</strong></button></nav>`;
 TaskReplay.mount($('#task-replay'),t);
}
function saveTaskView(){const p=new URLSearchParams(location.search);for(const [key,value]of Object.entries({task:state.taskOpen?state.selected:'',category:state.category,group:state.group,q:state.search}))if(value&&value!=='all')p.set(key,value);else p.delete(key);p.delete('view');if(!state.taskOpen){p.delete('episode');p.delete('episodeModel');}history.replaceState({},'',location.pathname+(p.size?'?'+p:'')+location.hash);Site.refreshLinks();}
function syncFilters(){if($('#task-category'))$('#task-category').value=state.category;if($('#task-group'))$('#task-group').value=state.group;}
const infoPage=document.body.dataset.page;
let taskWindow;
state.taskOpen=false;
if(infoPage==='home'){$('#page-content').innerHTML=home();Motion.revealHome($('#page-content'));Motion.videoWall($('.hero-cinema'));HomeOverview.mount();}
if(infoPage==='tasks'){
 $('#page-content').innerHTML=explorer();
 taskWindow=Motion.taskWindow($('#task-focus'),()=>{TaskReplay.unmount();state.taskOpen=false;saveTaskView();});
 const loadSelection=()=>{
  const p=new URLSearchParams(location.search);
  state.category=CATEGORIES.some(c=>c.id===p.get('category'))?p.get('category'):'all';
  state.group=GROUPS.some(g=>g.id===p.get('group'))?p.get('group'):'all';state.search=(p.get('q')||'').slice(0,160);
  let linked=TASKS.some(t=>t.id===p.get('task'))?p.get('task'):null;
  if(!linked&&p.has('episode')){
   let activeReport=Results.official;try{activeReport=p.get('data')==='demo'?Results.demo:p.get('data')==='imported'?Results.readSaved(sessionStorage)?.report||Results.official:Results.official;}catch{}
   linked=activeReport.episodes.find(e=>e.id===p.get('episode'))?.task_id||'T06';
  }
  if(linked){state.selected=linked;if(!filteredTasks().some(t=>t.id===linked)){state.category=state.group='all';state.search='';}}
  collection();syncFilters();$('#task-search').value=state.search;
  if(linked){state.taskOpen=true;detail();taskWindow.open();}else taskWindow.close(true);
 };
 loadSelection();window.addEventListener('popstate',loadSelection);
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.select){
  TaskReplay.suspend();const source=b.closest('.task-card');state.selected=b.dataset.select;state.taskOpen=true;
  const url=new URL(location.href);for(const key of ['episode','episodeModel'])url.searchParams.delete(key);history.replaceState({},'',url);
  saveTaskView();detail();$('#task-selection-status').textContent=`${state.selected}: ${task(state.selected).name}`;
  if(source)taskWindow.open(source);else{$('.task-focus-scroll').scrollTop=0;$('#task-title').focus({preventScroll:true});}
 }
 if(b.dataset.action==='reset-search'){state.search='';state.group=state.category='all';$('#task-search').value='';collection();syncFilters();saveTaskView();}
});
document.addEventListener('input',e=>{if(e.target.id==='task-search'){state.search=e.target.value;collection();saveTaskView();}});
document.addEventListener('change',e=>{if(e.target.id==='task-category'){state.category=e.target.value;collection();saveTaskView();}if(e.target.id==='task-group'){state.group=e.target.value;collection();saveTaskView();}});
