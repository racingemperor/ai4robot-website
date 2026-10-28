/* Research narrative, catalog and evaluation method. */
const params=new URLSearchParams(location.search);
const state={...TaskFilters.normalize(Object.fromEntries(params)),search:(params.get('q')||'').slice(0,160),selected:TASKS.some(t=>t.id===params.get('task'))?params.get('task'):'T06'};
// Add representative task clips here; Home and task demonstrations share them.
// Example entry: T06: {src:'media/T06.mp4', poster:'media/T06.jpg'}.
const TASK_VIDEOS=Object.freeze({});
const HOME_WALL_COLUMNS=[
 ['T01','T07','T13','T20'],
 ['T02','T08','T14','T21'],
 ['T03','T09','T15','T22'],
 ['T04','T10','T16','T23'],
 ['T05','T11','T17'],
 ['T06','T12','T18','T19']
];
function homeWallTile(id,copy) {
 const t=task(id),clip=TASK_VIDEOS[id];
 return `<a class="wall-tile" data-wall-task="${id}" href="${Site.href('tasks',{task:id})}" aria-label="Open ${id}: ${esc(t.name)}" ${copy?'tabindex="-1" aria-hidden="true"':''} style="--task-color:${group(t.group).color}">
  ${thumbnail(t,`wall-${id}-${copy}`)}${clip?`<video data-home-video src="${esc(clip.src)}" ${clip.poster?`poster="${esc(clip.poster)}"`:''} muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true"></video>`:''}
  <span class="wall-tile-top"><span>${id} / ${esc(t.robot)}</span><span class="wall-tile-arrow" aria-hidden="true">↗</span></span>
  <span class="wall-tile-caption"><strong>${esc(t.name)}</strong><span data-wall-media-label>${clip?'TASK VIDEO':'TASK'}</span></span>
 </a>`;
}
function homeHero(){return `<section class="hero hero-cinema" aria-labelledby="hero-title" data-motion="paused">
 <div class="hero-wall" aria-label="Task previews: open any tile to explore its task"><div class="wall-plane">${HOME_WALL_COLUMNS.map(ids=>`<div class="wall-column"><div class="wall-track">${[0,1].map(copy=>`<div class="wall-cycle" ${copy?'aria-hidden="true"':''}>${ids.map(id=>homeWallTile(id,copy)).join('')}</div>`).join('')}</div></div>`).join('')}</div></div>
 <div class="hero-shade" aria-hidden="true"></div>
 <div class="hero-copy"><h1 id="hero-title">Imported Gallery List Exam</h1><p class="hero-question">Evaluating Embodied Generalists Beyond Robot Control</p><dl class="home-hero-statistics" aria-label="Benchmark scale"><div><dt>Tasks</dt><dd>${TASKS.length}</dd></div><div><dt>Task categories</dt><dd>${CATEGORIES.length}</dd></div><div><dt>Embodiment classes</dt><dd>5</dd></div></dl></div>
 </section>`;}
function home(){return homeHero()+HomeOverview.introduction()+HomeOverview.shell()+HomeOverview.citation();}
function taskCard(t) {

 return `<button class="task-card" data-select="${t.id}" aria-haspopup="dialog" aria-controls="task-focus" aria-label="Open ${t.id}: ${t.name}" style="--task-color:${group(t.group).color}">
  <span class="task-card-image">${thumbnail(t)}<span class="task-card-id">${t.id}</span><span class="task-card-open" aria-hidden="true">↗</span></span>
  <span class="task-card-body"><span class="task-card-category">${t.robot}</span><strong class="task-card-title">${t.name}</strong><span class="task-card-goal">${t.goal}</span>
  <span class="task-trait-cells" aria-label="Paper category"><span>${category(t.category).name}</span></span><span class="task-card-bottom"><span>${tracks[t.track].output}</span><span>Explore task <b aria-hidden="true">↗</b></span></span></span>
 </button>`;
}
function explorer() {
 return `<section class="task-gallery" aria-label="Task explorer">
  ${TaskFilters.render({id:'task',values:state,count:TASKS.length,search:state.search})}
  <div id="task-collection" class="task-card-grid"></div>
  <div id="task-pages"></div>
  <dialog id="task-focus" class="task-focus" aria-labelledby="task-title"><div class="task-window-bar"><span id="task-window-label">TASK EXPLORER</span><button type="button" data-close-task aria-label="Close task" title="Close task"><span aria-hidden="true">×</span></button></div><div class="task-focus-scroll"><article id="task-detail" class="task-article" aria-labelledby="task-title"></article></div></dialog>
  <span id="task-selection-status" class="sr-only" role="status" aria-live="polite"></span>
 </section>`;
}
function filteredTasks() {
 const query=state.search.toLowerCase().trim();
 return TASKS.filter(t=>TaskFilters.matches(t,state)&&
  `${t.id} ${t.name} ${t.robot} ${t.goal} ${category(t.category).name} ${tracks[t.track].output}`.toLowerCase().includes(query));
}
function collection() {
 const ts=filteredTasks();
 const page=TaskPagination.select(ts,state.page);state.page=page.page;
 $('#task-scope-count').textContent=`${ts.length} / ${TASKS.length} tasks`;
 $('#task-collection').innerHTML=ts.length?page.items.map(taskCard).join(''):'<div class="task-gallery-empty"><h2>No matching tasks.</h2><p>Try a task ID, a paper category or a robot such as “Go2”.</p><button class="button" data-action="reset-search">Clear filters</button></div>';
 $('#task-pages').innerHTML=page.pages>1?`<nav class="task-page-controls" aria-label="Task pages"><div><button type="button" data-task-page="${page.page-1}"${page.page===1?' disabled':''} aria-label="Previous page">←</button>${Array.from({length:page.pages},(_,i)=>`<button type="button" data-task-page="${i+1}" aria-label="Page ${i+1}"${page.page===i+1?' aria-current="page"':''}>${i+1}</button>`).join('')}<button type="button" data-task-page="${page.page+1}"${page.page===page.pages?' disabled':''} aria-label="Next page">→</button></div></nav>`:'';
 if(ts.length&&!ts.some(t=>t.id===state.selected))state.selected=ts[0].id;
}
function taskDemonstration(t) {
 const clip=TASK_VIDEOS[t.id];
 return `<figure class="task-demo" aria-label="${esc(t.id)} task demonstration"><div class="task-demo-stage">${clip?`<video id="task-demo-video" src="${esc(clip.src)}"${clip.poster?` poster="${esc(clip.poster)}"`:''} controls playsinline preload="metadata" aria-label="${esc(t.name)} demonstration"></video>`:Evidence.slot('VIDEO','Task demonstration','')}</div><figcaption class="sr-only">${esc(t.name)} task demonstration</figcaption></figure>`;
}
function pauseTaskDemonstration(){ $('#task-demo-video')?.pause(); }
function detail() {
 const t=task(state.selected),ts=filteredTasks(),index=ts.findIndex(item=>item.id===t.id);
 pauseTaskDemonstration();TaskReplay.suspend();
 $('#task-window-label').textContent=`${t.id} / ${category(t.category).name.toUpperCase()}`;
 $('#task-detail').innerHTML=`<header class="task-article-header"><div class="task-identity"><span>${t.id}</span><span>${category(t.category).name}</span></div>
  <h2 id="task-title" tabindex="-1">${t.name}</h2><p class="task-objective">${t.goal}</p></header>
 ${taskDemonstration(t)}
 <dl class="task-facts"><div><dt>Embodiment / scene</dt><dd>${t.robot}</dd></div><div><dt>Model deliverable</dt><dd>${tracks[t.track].output}</dd></div><div><dt>Task category</dt><dd>${category(t.category).name}</dd></div></dl>
 <section id="task-replay" class="task-integrated-replay" aria-label="Model performance and synchronized task demonstrations"></section>
 <section class="task-article-section task-completion" aria-labelledby="task-completion-title"><h3 id="task-completion-title">What counts as completion?</h3><p>${t.proof}</p><ul>${t.checks.map(check=>`<li>${check}</li>`).join('')}</ul></section>
 <section class="task-procedure task-article-section" aria-labelledby="task-procedure-title"><h3 id="task-procedure-title">From input to verification</h3><div class="task-input"><h4>Task input</h4><p>${t.input}</p></div><ol class="task-sequence">${t.beats.map(beat=>`<li>${beat}</li>`).join('')}</ol></section>
 <section class="task-evidence-details task-article-section" aria-labelledby="task-evidence-title"><h3 id="task-evidence-title">Task evidence and deliverable</h3><div class="task-evidence-grid">${Evidence.slot('IMAGE','Initial observation',t.input)}${Evidence.slot('IMAGE / RESULT','Final state and judgment',t.proof)}${Evidence.slot('OUTPUT',tracks[t.track].output,'The submitted artifact and validation report')}</div></section>
 <nav class="task-pagination" aria-label="Previous and next task"><button data-select="${ts[index-1]?.id||''}" ${index<=0?'disabled':''}><span>Previous task</span><strong>${ts[index-1]?`${ts[index-1].id} · ${ts[index-1].name}`:'Start of selection'}</strong></button><span>${index+1} / ${ts.length}</span><button data-select="${ts[index+1]?.id||''}" ${index===ts.length-1?'disabled':''}><span>Next task</span><strong>${ts[index+1]?`${ts[index+1].id} · ${ts[index+1].name}`:'End of selection'}</strong></button></nav>`;
 TaskReplay.mount($('#task-replay'),t);
}
function saveTaskView(){const p=new URLSearchParams(location.search);for(const [key,value]of Object.entries({task:state.taskOpen?state.selected:'',...TaskFilters.normalize(state),q:state.search,page:state.page>1?state.page:''}))if(value&&value!=='all')p.set(key,value);else p.delete(key);p.delete('view');p.delete('group');if(!state.taskOpen){p.delete('episode');p.delete('episodeModel');}history.replaceState({},'',location.pathname+(p.size?'?'+p:'')+location.hash);Site.refreshLinks();}
function syncFilters(){for(const key of ['category','robot','track'])if($('#task-'+key))$('#task-'+key).value=state[key];}
const infoPage=document.body.dataset.page;
let taskWindow;
state.taskOpen=false;
if(infoPage==='home'){$('#page-content').innerHTML=home();Motion.revealHome($('#page-content'));Motion.videoWall($('.hero-cinema'));HomeOverview.mount();}
if(infoPage==='tasks'){
 $('#page-content').innerHTML=explorer();
 taskWindow=Motion.taskWindow($('#task-focus'),()=>{pauseTaskDemonstration();TaskReplay.unmount();state.taskOpen=false;saveTaskView();$('#task-collection [data-select="'+state.selected+'"]')?.focus({preventScroll:true});});
 const loadSelection=()=>{
  const p=new URLSearchParams(location.search);
  Object.assign(state,TaskFilters.normalize(Object.fromEntries(p)));
  state.search=(p.get('q')||'').slice(0,160);
  state.page=p.get('page')||1;
  let linked=TASKS.some(t=>t.id===p.get('task'))?p.get('task'):null;
  if(!linked&&p.has('episode')){
   const activeReport=Results[Results.sourceFor(p.get('data'))];
   linked=activeReport.episodes.find(e=>e.id===p.get('episode'))?.task_id||'T06';
  }
  if(linked){state.selected=linked;if(!filteredTasks().some(t=>t.id===linked)){Object.assign(state,TaskFilters.normalize({}));state.search='';}state.page=Math.floor(filteredTasks().findIndex(t=>t.id===linked)/TaskPagination.size)+1;}
  collection();syncFilters();$('#task-search').value=state.search;
  if(linked){state.taskOpen=true;detail();taskWindow.open();}else taskWindow.close(true);
  saveTaskView();
 };
 loadSelection();window.addEventListener('popstate',loadSelection);
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.select){
  TaskReplay.suspend();const source=b.closest('.task-card');state.selected=b.dataset.select;state.taskOpen=true;
  const selectedPage=Math.floor(filteredTasks().findIndex(t=>t.id===state.selected)/TaskPagination.size)+1;
  if(selectedPage!==state.page){state.page=selectedPage;collection();}
  const url=new URL(location.href);for(const key of ['episode','episodeModel'])url.searchParams.delete(key);history.replaceState({},'',url);
  saveTaskView();detail();$('#task-selection-status').textContent=`${state.selected}: ${task(state.selected).name}`;
  if(source)taskWindow.open(source);else{$('.task-focus-scroll').scrollTop=0;$('#task-title').focus({preventScroll:true});}
 }
 if(b.hasAttribute('data-task-page')){state.page=Number(b.dataset.taskPage);collection();saveTaskView();const first=$('#task-collection .task-card');first?.focus({preventScroll:true});first?.scrollIntoView({block:'start',behavior:'instant'});}
 if(b.dataset.action==='reset-search'||b.hasAttribute('data-scope-reset')){state.search='';state.page=1;Object.assign(state,TaskFilters.normalize({}));$('#task-search').value='';collection();syncFilters();saveTaskView();}
});
document.addEventListener('input',e=>{if(e.target.id==='task-search'){state.search=e.target.value;state.page=1;collection();saveTaskView();}});
document.addEventListener('change',e=>{if(e.target.dataset.scopeFilter){state[e.target.dataset.scopeFilter]=e.target.value;state.page=1;collection();saveTaskView();}});

document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseTaskDemonstration();});
window.addEventListener('pagehide',pauseTaskDemonstration);
