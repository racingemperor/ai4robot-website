/* Research tools: validated aggregate reports, synthetic walkthroughs, local-only files. */
window.Lab = (() => {
  const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q=(s,r=document)=>r.querySelector(s);
  const currentPage=document.body.dataset.page;
  const reportPages=['board','compare','matrix','episodes'];
  const storageKey='ai4robot-imported-report-v1';
  const query=new URLSearchParams(location.search);
  const L={tab:currentPage==='leaderboard'?(Site.section==='comparison'?'compare':'board'):currentPage==='tasks'?'matrix':currentPage,source:query.get('data')==='demo'?'demo':'official',imported:null,importedSynthetic:false,importedSaved:false,track:'all',category:'all',group:'all',robot:'all',sort:'score',direction:-1,modelQuery:'',compare:[],episode:'',episodeTask:'all',episodeModel:'all',status:'all',time:0,playing:false,raf:0,last:0,videoURL:'',videoEpisode:'',message:'',runTask:'T06',runMode:'solve',runAgent:'vlm',runModel:'mock',gpu:'0',seeds:'0',layouts:'0,1,2',camera:'head'};
  for(const key of ['track','category','group','robot','sort','modelQuery','episodeTask','episodeModel','status','episode']){const value=query.get(key);if(value&&value.length<160)L[key]=value;}
  if(!['all','A','B','C'].includes(L.track))L.track='all';
  if(!['all',...CATEGORIES.map(c=>c.id)].includes(L.category))L.category='all';
  if(!['all',...GROUPS.map(g=>g.id)].includes(L.group))L.group='all';
  if(!['all',...TASKS.map(t=>t.robot)].includes(L.robot))L.robot='all';
  if(!['score','pooled','progress','duration','trials','coverage'].includes(L.sort))L.sort='score';
  if(query.get('order')==='asc')L.direction=1;
  L.compare=(query.get('models')||'').split(',').filter(Boolean).slice(0,3);
  if(TASKS.some(t=>t.id===query.get('task')))L.runTask=query.get('task');
  try{
    const saved=sessionStorage.getItem(storageKey);
    if(saved){if(saved.length>5*1024*1024)throw new Error('The saved report exceeds 5 MB.');const parsed=JSON.parse(saved);L.imported=Results.validate(parsed.report||parsed);L.importedSynthetic=parsed.synthetic===true||parsed.website_data_source==='demo';L.importedSaved=true;}
  }catch(error){L.message='The saved report could not be read. Please import it again.';}
  if(query.get('data')==='imported'){
    if(L.imported)L.source='imported';
    else L.message='No imported report is available in this tab. Select the JSON file again.';
  }
  const data=()=>L.source==='demo'?Results.demo:L.source==='imported'?L.imported:Results.official;
  const sourceLabel=()=>({official:'Official results · forthcoming',demo:'Synthetic example · not measured',imported:L.importedSynthetic?'Local import · synthetic · unreviewed':'Local import · unreviewed'})[L.source];
  const points=v=>v===null||v===undefined?'—':(v*100).toFixed(1);
  const pct=v=>v===null||v===undefined?'—':`${(v*100).toFixed(1)}%`;
  const fmt=v=>v===null||v===undefined?'—':`${v.toFixed(1)} s`;
  function selectedTasks(){return TASKS.filter(t=>(L.category==='all'||t.category===L.category)&&(L.track==='all'||t.track===L.track)&&(L.group==='all'||t.group===L.group)&&(L.robot==='all'||t.robot===L.robot));}
  function summary(ids=selectedTasks().map(t=>t.id)){return Results.summarize(data(),ids);}
  function orderedRows(){return summary().filter(m=>`${m.name} ${m.agent} ${m.version}`.toLowerCase().includes(L.modelQuery.toLowerCase())).sort((a,b)=>Number(b.complete)-Number(a.complete)||((a[L.sort]??-Infinity)-(b[L.sort]??-Infinity))*L.direction||a.id.localeCompare(b.id));}
  function syncURL(){
    if(currentPage==='tasks'&&Site.section!=='matrix')return;
    const p=new URLSearchParams(location.search);
    const resultKeys=['track','category','group','robot'];
    const pageKeys={board:[...resultKeys,'sort','modelQuery'],compare:[...resultKeys,'sort','modelQuery'],matrix:resultKeys,episodes:[...resultKeys,'episodeTask','episodeModel','status','episode'],run:[],about:[]};
    for(const key of ['lab','variant','track','category','group','robot','sort','modelQuery','episodeTask','episodeModel','status','episode','models','order'])p.delete(key);
    L.source!=='official'?p.set('data',L.source):p.delete('data');
    for(const key of pageKeys[L.tab]){const v=L[key];if(v&&v!=='all')p.set(key,v);}
    if(currentPage==='leaderboard')p.set('order',L.direction===1?'asc':'desc');
    if(currentPage==='leaderboard'&&L.compare.length)p.set('models',L.compare.join(','));
    if(L.tab==='run')p.set('task',L.runTask);else if(currentPage!=='tasks')p.delete('task');
    history.replaceState({},'',location.pathname+(p.size?'?'+p:'')+location.hash);Site.refreshLinks();
  }
  function pageLink(page,extra){return h(Site.href(page,extra));}
  const option=(value,text,active)=>`<option value="${h(value)}"${value===active?' selected':''}>${h(text)}</option>`;
  function html(){return `<section class="research page-workspace" id="research">${reportPages.includes(L.tab)?`<div class="lab-source"><div><strong id="source-label">${sourceLabel()}</strong><span id="source-description"></span></div><div class="lab-actions"><button class="lab-button" data-lab-action="demo">${L.source==='demo'?'View official results':'Load synthetic example'}</button><button class="lab-button" data-lab-action="import">Import JSON</button>${L.imported?'<button class="lab-button" data-lab-action="stored">View imported report</button><button class="lab-button" data-lab-action="clear-import">Clear import</button>':''}<button class="lab-button" data-lab-action="share">Copy view link</button></div></div>`:''}<input id="result-upload" type="file" accept=".json,application/json" hidden><p id="lab-message" class="lab-message" role="status" aria-live="polite">${h(L.message)}</p><div id="lab-filters"></div><div id="lab-panel"></div></section>`;}
  function filters(){return `<div class="lab-filters"><label>Evaluation category<select data-lab-filter="category">${option('all','All categories',L.category)}${CATEGORIES.map(c=>option(c.id,c.name,L.category)).join('')}</select></label><label>Delivery mode<select data-lab-filter="track">${option('all','All delivery modes',L.track)}${[['A','A · Control program'],['B','B · Training'],['C','C · Artifact construction']].map(([v,t])=>option(v,t,L.track)).join('')}</select></label><label>Capability facet<select data-lab-filter="group">${option('all','All capabilities',L.group)}${GROUPS.map(g=>option(g.id,g.name,L.group)).join('')}</select></label><label>Embodiment / scene<select data-lab-filter="robot">${option('all','All embodiments & scenes',L.robot)}${[...new Set(TASKS.map(t=>t.robot))].map(r=>option(r,r,L.robot)).join('')}</select></label><button class="lab-button" data-lab-action="reset">Reset filters</button><p>${selectedTasks().length} / 22 tasks<br><span>Simulation · Single report protocol</span></p></div>`;}
  function empty(text='Reviewed evaluation reports are forthcoming.',kind=L.tab){
    const descriptions={board:'This table will show category-balanced success, progress, pooled trial intervals and task coverage.',compare:'Compare up to three models across five capability facets using common task coverage.',matrix:'Inspect per-task success rates and follow each result into its episode evidence.',episodes:'Explore task/model filters, event seeking and attached video after a report is loaded.'};
    return `<div class="lab-empty empty-${kind}"><h3>${text}</h3><p>${descriptions[kind]||''}</p><p>Load synthetic data to explore this page, or import a report. Examples do not represent real model performance.</p><button class="lab-button solid" data-lab-action="load-demo">Explore synthetic example</button><button class="lab-button" data-lab-action="template">Download report template</button>${kind==='compare'?'<div class="empty-comparison"><span>Model A<br>Awaiting a report</span><span>Model B<br>Awaiting a report</span><span>Common tasks<br>Awaiting results</span></div>':''}</div>`;
  }
  function board(){
    const rows=orderedRows();
    const ids=selectedTasks().map(t=>t.id);
    let rank=0,previous=null,position=0;
    const sortButton=(key,text)=>`<button data-sort="${key}">${text} <span aria-hidden="true">${L.sort===key?(L.direction===-1?'↓':'↑'):'↕'}</span></button>`;
    return `<div class="panel-heading"><div><h2>Leaderboard</h2><p>Compare one protocol and task scope. Incomplete coverage receives no rank.</p></div><div class="lab-actions"><button class="lab-button" data-lab-action="csv">Export table CSV</button><button class="lab-button" data-lab-action="json">Download active report</button></div></div><label class="model-search">Search model or agent<input id="model-search" type="search" placeholder="Name / version / agent" value="${h(L.modelQuery)}"></label>${data().models.length?`<div class="table-scroll" tabindex="0" role="region" aria-label="Leaderboard; horizontally scrollable"><table class="results-table"><caption>${sourceLabel()} · ${h(data().benchmark_version)} · ${h(data().protocol)}</caption><thead><tr><th scope="col">Rank</th><th scope="col">Model / agent</th>${[['score','Balanced success'],['pooled','Pooled success'],['progress','Progress / 100'],['duration','Mean sim. time'],['trials','Trials'],['coverage','Task coverage']].map(([k,n])=>`<th scope="col" aria-sort="${L.sort===k?(L.direction===-1?'descending':'ascending'):'none'}">${sortButton(k,n)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(m=>{if(m.complete){position++;if(previous!==m[L.sort])rank=position;previous=m[L.sort];}return `<tr><td class="rank">${m.complete?String(rank).padStart(2,'0'):'—'}</td><th scope="row"><strong>${h(m.name)}</strong><small>${h(m.version)} · ${h(m.agent)}</small></th><td><strong>${pct(m.score)}</strong></td><td><strong>${pct(m.pooled)}</strong><small>${m.ci?`95% CI ${pct(m.ci[0])}–${pct(m.ci[1])}`:'No trials'}</small></td><td>${points(m.progress)}</td><td>${fmt(m.duration)}</td><td>${m.trials}</td><td>${m.coverage} / ${ids.length}<small>${m.complete?'Complete':'Incomplete · unranked'}</small></td></tr>`;}).join(''):'<tr><td colspan="8">No matching models.</td></tr>'}</tbody></table></div>`:empty()}<details class="metric-notes"><summary>Ranking and aggregation</summary><p>Balanced success = mean of task success rates within each selected category, then mean of those category values. Progress uses the same aggregation, displayed in 0–100 points. Pooled success = total successes / total valid trials, shown separately with a Wilson 95% interval; that interval is not uncertainty for the balanced score. Mean simulation time = total simulation seconds / trials. Full selected-task coverage is required for ranking; missing results are not zero-filled. Partial balanced summaries are unavailable if a selected category has no data. Ties share a rank. Time sorts ascending by default. Only one report and protocol are active; final release settings must be frozen and recorded.</p></details>`;
  }
  function compare(){
    const models=data().models;
    if(!models.length)return empty('No model reports to compare yet.','compare');
    L.compare=L.compare.filter(id=>models.some(m=>m.id===id));if(!L.compare.length)L.compare=models.slice(0,Math.min(2,models.length)).map(m=>m.id);
    const chosen=models.filter(m=>L.compare.includes(m.id));
    return `<div class="panel-heading"><div><h2>Compare on common ground.</h2><p>Select up to three models. Capability bars use tasks covered by every selected model.</p></div><button class="lab-button" data-lab-action="compare-csv">Export comparison CSV</button></div><fieldset class="model-choices"><legend>Select models (up to three)</legend>${models.map(m=>`<label><input type="checkbox" data-compare-choice="${h(m.id)}" ${L.compare.includes(m.id)?'checked':''}>${h(m.name)}</label>`).join('')}</fieldset><div class="compare-metrics">${chosen.map(m=>{const s=summary().find(s=>s.id===m.id);return `<article><span>${h(m.name)}</span><strong>${pct(s.score)}</strong><small>Category-balanced success</small><p>${s.coverage}/${selectedTasks().length} tasks · ${s.trials} trials</p><small>${sourceLabel()}</small></article>`;}).join('')}</div><div class="capability-bars">${GROUPS.map(g=>{
      const ts=selectedTasks().filter(t=>t.group===g.id),ids=ts.filter(t=>chosen.every(m=>data().results.some(r=>r.task_id===t.id&&r.model_id===m.id))).map(t=>t.id);
      const summaries=Results.summarize(data(),ids);return `<article><div><h3>${g.name}</h3><span>Common coverage ${ids.length} / ${ts.length} tasks</span></div>${chosen.map((m,i)=>{const s=summaries.find(s=>s.id===m.id);return `<div class="capability-row"><span>${h(m.name)}</span><div class="capability-track"><i class="series-${i}" style="width:${(s.score??0)*100}%"></i></div><strong>${pct(s.score)}</strong></div>`;}).join('')}</article>`;
    }).join('')}</div><p class="lab-note">Summary cards use each model’s available coverage. Capability bars use common tasks only. Labels and values accompany every color; inspect missing data in the task matrix.</p>`;
  }
  function matrix(){
    const models=data().models;
    if(!models.length)return `<div class="panel-heading"><div><h2>22 tasks × forthcoming models</h2><p>The catalog is ready. Result cells will show success rate and trial count when reports are connected.</p></div></div><div class="matrix-empty-layout">${empty('Task results await evaluation reports.','matrix')}<div class="matrix-task-preview">${selectedTasks().map(t=>`<a href="${pageLink('tasks',{task:t.id})}"><span>${t.id}</span>${t.name}<small>—</small></a>`).join('')}</div></div>`;
    return `<div class="panel-heading"><div><h2>22 tasks × models</h2><p>Each cell shows success rate and trials. Open a cell for episode evidence. A dash means no result.</p></div><button class="lab-button" data-lab-action="matrix-csv">Export matrix CSV</button></div><div class="matrix-legend"><span>Low</span>${[0,25,50,75,100].map(n=>`<i style="--intensity:${n/100}">${n}%</i>`).join('')}<span>High · ${sourceLabel()}</span></div><div class="table-scroll" tabindex="0" role="region" aria-label="Task/model matrix; horizontally scrollable"><table class="results-table matrix-table"><caption>${h(data().protocol)} · Values remain readable independently of color</caption><thead><tr><th scope="col">Task</th>${models.map(m=>`<th scope="col">${h(m.name)}</th>`).join('')}</tr></thead><tbody>${selectedTasks().map(t=>`<tr><th scope="row"><button data-task="${t.id}">${t.id} <strong>${t.name}</strong><small>${t.robot} · ${t.track}</small></button></th>${models.map(m=>{const r=data().results.find(r=>r.task_id===t.id&&r.model_id===m.id);return `<td>${r?`<a class="matrix-cell" style="--intensity:${r.successes/r.trials}" href="${pageLink('episodes',{episodeTask:t.id,episodeModel:m.id})}" aria-label="${h(m.name)} · ${t.id} · success rate ${pct(r.successes/r.trials)} · ${r.trials} trials; open episodes">${pct(r.successes/r.trials)}<small>n=${r.trials}</small></a>`:'—'}</td>`;}).join('')}</tr>`).join('')||`<tr><td colspan="${models.length+1}">No tasks match this scope.</td></tr>`}</tbody></table></div>`;
  }
  const statusName=s=>({success:'Success',failure:'Failure',incomplete:'Incomplete'})[s];
  function clearVideo(){stop();if(L.videoURL)URL.revokeObjectURL(L.videoURL);L.videoURL='';L.videoEpisode='';}
  function episodeRows(){return data().episodes.filter(e=>selectedTasks().some(t=>t.id===e.task_id)&&(L.episodeTask==='all'||e.task_id===L.episodeTask)&&(L.episodeModel==='all'||e.model_id===L.episodeModel)&&(L.status==='all'||e.status===L.status));}
  function currentEpisode(){const rows=episodeRows();return rows.find(e=>e.id===L.episode)||rows[0];}
  function episodes(){
    const rows=episodeRows(),e=currentEpisode();if(e)L.episode=e.id;
    return `<div class="panel-heading"><div><h2>Episode browser</h2><p>${L.source==='demo'?'Synthetic event timeline. The concept diagram is not a recorded robot state.':'Follow events, time and judgments; attach matching video locally.'}</p></div><button class="lab-button" data-lab-action="episode-json" ${e?'':'disabled'}>Download episode</button></div><div class="episode-filters"><label>Task<select data-episode-filter="episodeTask">${option('all','All tasks',L.episodeTask)}${selectedTasks().map(t=>option(t.id,`${t.id} ${t.name}`,L.episodeTask)).join('')}</select></label><label>Model<select data-episode-filter="episodeModel">${option('all','All models',L.episodeModel)}${data().models.map(m=>option(m.id,m.name,L.episodeModel)).join('')}</select></label><label>Status<select data-episode-filter="status">${option('all','All statuses',L.status)}${['success','failure','incomplete'].map(s=>option(s,statusName(s),L.status)).join('')}</select></label></div>${e?`<div class="episode-layout"><div class="episode-index" role="group" aria-label="Episode list">${rows.map(r=>`<button data-episode="${h(r.id)}" aria-pressed="${r.id===e.id}"><strong>${r.task_id} · ${h(data().models.find(m=>m.id===r.model_id).name)}</strong><span>${statusName(r.status)} · ${r.duration_s}s</span><small>${h(r.id)}</small></button>`).join('')}</div><div class="episode-view"><div class="episode-caption"><strong>${e.task_id} / ${h(e.id)}</strong><span>${statusName(e.status)} · ${sourceLabel()}</span></div><div class="episode-stage">${L.videoURL&&L.videoEpisode===e.id?`<video id="episode-video" src="${h(L.videoURL)}" controls preload="metadata" playsinline></video>`:`<div class="episode-concept"><span>EVENT RECORD · NO EXPERIMENTAL VIDEO</span>${typeof drawing==='function'?drawing(e.task_id):''}<strong>${TASKS.find(t=>t.id===e.task_id).name}</strong></div>`}</div><div class="playback"><button class="lab-button" data-lab-action="play">Play events</button><input id="episode-seek" type="range" min="0" max="${e.duration_s}" value="${Math.min(L.time,e.duration_s)}" step="0.1" aria-label="Episode time"><output id="episode-clock">0.0 / ${e.duration_s}s</output><label>Speed<select id="episode-speed"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div><div id="episode-event" class="current-event" aria-live="off"></div><div class="event-list">${e.events.map((event,i)=>`<button data-event-index="${i}"><time>${event.time_s.toFixed(1)}s</time><strong>${h(event.type)}</strong><span>${h(event.text)}</span></button>`).join('')}</div><div class="episode-meta"><span>seed ${e.seed} · layout ${e.layout}</span><span>${h(data().benchmark_version)} · ${h(data().protocol)}</span></div><label class="lab-button video-upload">Attach local video<input id="episode-video-upload" type="file" accept="video/*"></label>${L.videoURL&&L.videoEpisode===e.id?'<button class="lab-button" data-lab-action="remove-video">Remove video</button>':''}<p class="lab-note">Video stays in page memory and is never uploaded. Reattach after navigation or reload. Video playback replaces the event clock using original seconds; ensure both use the same clock.${L.source==='demo'?'Synthetic outcomes are only interface examples.':''}</p></div></div>`:empty(data().models.length?'No episodes match these filters.':'Episode records are forthcoming.')}`;
  }
  function run(){return `<div class="panel-heading"><div><h2>Configure the current research CLI.</h2><p>Requires authorized repository access, Isaac Sim 5.1 and the task assets. Commands run in your configured environment.</p></div><button class="lab-button" data-lab-action="run-json">Download configuration</button></div><div class="run-layout"><form id="run-form" class="run-form"><label>Task<select name="task">${TASKS.map(t=>option(t.id,`${t.id} · ${t.name}`,L.runTask)).join('')}</select></label><label>Mode<select name="mode">${[['check','Check scene and judge'],['solve','Run reference solver'],['play','Inspect scene interactively'],['eval','Direct LLM-as-Policy']].map(([v,t])=>option(v,t,L.runMode)).join('')}</select></label><label>GPU index<input name="gpu" type="number" min="0" max="15" value="${h(L.gpu)}" required></label><label>Seeds<input name="seeds" value="${h(L.seeds)}" pattern="[0-9]+(,[0-9]+)*" required></label><label>Layouts (0–2)<input name="layouts" value="${h(L.layouts)}" pattern="[0-2](,[0-2])*" required></label><label>Video camera<select name="camera">${option('head','head (if available)',L.camera)}${option('none','No recording',L.camera)}</select></label><label>Evaluation agent<select name="agent">${[['vlm','vlm · model chooses actions'],['null','null · inactivity control'],['replay','replay · privileged reference']].map(([v,t])=>option(v,t,L.runAgent)).join('')}</select></label><label>Model identifier<input name="model" value="${h(L.runModel)}" placeholder="Exact configured model ID" autocomplete="off"></label></form><div class="command-box"><div><span>RESEARCH CLI · OCT 2026</span><button class="lab-button" data-lab-action="copy-command">Copy command</button></div><pre id="run-command"></pre><p id="run-feedback" role="status"></p><p>Direct-policy commands are enabled here for T02, T06 and T19. Other tasks may be specifications or require additional tools. Provider credentials belong in your local environment; this page never requests them.</p></div></div><p class="run-task-note">${h(TASKS.find(t=>t.id===L.runTask).note)}</p><div class="run-steps"><article><strong>Prepare</strong><p>Use the research environment and licensed assets. Check the task implementation and freeze versions before recording a run.</p></article><article><strong>Evaluate</strong><p>Default layouts are 0,1,2. Reference solvers may use privileged state. Direct models use filtered observations and bounded tools; results need separate protocol labels.</p></article><article><strong>Archive</strong><p>Retain summary.json, trace.jsonl, observations, video and judgments. The website uses a separate normalized report format; convert aggregates explicitly before importing.</p></article></div>`;}
  function about(){return `<section class="research-resources"><div class="panel-heading"><div><h2>Start with the source material.</h2><p>Research content and website implementation are separate repositories.</p></div></div><div class="source-grid"><a href="${RESEARCH_REPO}" target="_blank" rel="noopener"><span>RESEARCH CODE & TASK DEFINITIONS</span><h3>AI4Robot on GitHub ↗</h3><p>Task requirements, interfaces, reference implementations and the direct-policy protocol. Repository access is currently required.</p></a><a href="${RESEARCH_NOTES}" target="_blank" rel="noopener"><span>PROJECT NOTES</span><h3>Research notebook ↗</h3><p>Task motivations and reference demonstrations from the project notebook. These references are distinct from AI4Robot evaluation evidence.</p></a></div><p class="source-note">Sources reviewed: research repository and project notebook, October 23, 2026. Current implementation details follow GitHub; notebook demonstrations provide task motivation.</p></section><div class="participate-grid"><article><h3>Inspect a result report</h3><p>Download a JSON template with exact model, agent and protocol versions. Imports are validated and stored only in this tab for navigation and reload; nothing is uploaded. You can clear them at any time.</p><div class="lab-actions"><button class="lab-button" data-lab-action="template">Report template</button><button class="lab-button" data-lab-action="import">Import & validate</button>${L.imported?'<a class="lab-button" href="leaderboard.html?data=imported">View imported report ↗</a><button class="lab-button" data-lab-action="clear-import">Clear import</button>':''}</div></article><article><h3>Contribute research evidence</h3><p>Discuss task designs, reproducibility and result submissions with the research maintainers through the research repository. Include the task version, evaluation protocol and full episode evidence.</p><a class="text-link" href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository ↗</a></article><article><h3>Improve the website</h3><p>Report interface issues or propose site changes in the website repository. Media can be prepared from the task-specific production brief.</p><a class="text-link" href="https://github.com/racingemperor/ai4robot-website" target="_blank" rel="noopener">Website source ↗</a><a class="text-link" href="footage.html">Video requirements ↗</a></article></div><div class="research-updates"><h2>Release status</h2><div><span>Available</span><p>22-task catalog, documented method, configuration tools, report import, comparison, matrix and episode timeline.</p></div><div><span>In development</span><p>Task implementations and evaluation coverage vary. T06 is the complete reference example; direct-policy tooling currently covers ARX X5.</p></div><div><span>Forthcoming</span><p>Reviewed model rankings, original footage, a finalized release protocol and publication details.</p></div></div><div class="faq"><h2>Frequently asked questions</h2>${[
 ['Why are there no Codex or Claude ranks yet?','No reviewed model report has been connected to this website. Synthetic examples demonstrate the interface and make no claim about real models.'],
 ['Why 22 tasks?','The research catalog lists T01–T23. T18, unseen-embodiment adaptation, is deferred and excluded from this website.'],
 ['Is every task ready to evaluate?','No. The catalog separates the research scope from implementation and model coverage. Each dossier describes the current scope and relevant dependencies.'],
 ['How is the overall score balanced?','Task success rates are averaged within each of four evaluation categories, then the represented categories are averaged equally. A model needs full selected-task coverage to receive a rank.'],
 ['Are missing tasks treated as failures?','No. Coverage is explicit. Comparison bars use common task coverage; incomplete reports are not assigned a rank.'],
 ['Can result sources or evaluation routes be mixed?','No. One report and one declared protocol are active at a time. Program submission, direct-policy evaluation and privileged references must have distinct protocols. Validation checks structure, not experiment authenticity.'],
 ['Does the episode viewer run a simulation?','It displays event records and optional local video. The diagram is a concept illustration. Local video stays in page memory and must be reattached after navigation or reload.'],
 ['Can I import raw research summary.json?','Not directly. Use the website schema: one model/task aggregate, normalized progress_sum, total valid trials and simulation duration. Preserve the protocol and provenance; do not relabel a reference solver as a model.']
 ].map(([a,b])=>`<details><summary>${a}</summary><p>${b}</p></details>`).join('')}</div><div class="downloads"><h2>Reporting materials</h2><button class="lab-button" data-lab-action="tasks-json">Download 22-task catalog</button><button class="lab-button" data-lab-action="demo-json">Synthetic report example</button><button class="lab-button" data-lab-action="citation">Copy website citation</button><a class="lab-button" href="FEATURES.md">Report format & tools ↗</a><p class="lab-note">The citation is for this website preview, not a benchmark paper. Paper title and authors will be added with the research release.</p></div>`;}
  function renderPanel(){
    stop();const root=q('#research');if(!root)return;
    const focused=document.activeElement;
    const focusKey=focused?.id?`#${CSS.escape(focused.id)}`:focused?.dataset.labFilter?`[data-lab-filter="${focused.dataset.labFilter}"]`:focused?.dataset.sort?`[data-sort="${focused.dataset.sort}"]`:focused?.dataset.compareChoice?`[data-compare-choice="${CSS.escape(focused.dataset.compareChoice)}"]`:null;
    if(q('#source-label')){
      q('#source-label').textContent=sourceLabel();
      q('#source-description').textContent=L.source==='demo'?'All values and events are synthetic; they make no model performance claim.':L.source==='imported'?`${L.importedSaved?'Stored only in this tab for navigation and reload':'Storage unavailable; current page only'}; never uploaded; provenance and outcomes are unreviewed.${L.importedSynthetic?'This report originates from synthetic examples, not measurements.':''}`:'Reviewed results are forthcoming. Explore examples or import a local report.';
      q('[data-lab-action="demo"]',q('.lab-source')).textContent=L.source==='demo'?'View official results':'Load synthetic example';
    }
    root.dataset.source=L.source;
    q('#lab-filters').innerHTML=['board','compare','matrix'].includes(L.tab)?filters():L.tab==='episodes'&&[L.track,L.category,L.group,L.robot].some(v=>v!=='all')?`<div class="episode-scope"><span>Task scope carried from results: ${selectedTasks().length} / 22 tasks</span><button class="lab-button" data-lab-action="reset">Show all tasks</button></div>`:'';
    q('#lab-panel').innerHTML=({board,compare,matrix,episodes,run,about})[L.tab]();
    q('#lab-message').textContent=L.message;
    if(L.tab==='run')updateCommand();if(L.tab==='episodes'){updateTime();wireVideo();}
    if(focusKey)q(focusKey)?.focus({preventScroll:true});
    syncURL();
  }
  function stop(){L.playing=false;cancelAnimationFrame(L.raf);const v=q('#episode-video');if(v)v.pause();}
  function updateTime(){
    const e=currentEpisode();if(!e||!q('#episode-seek'))return;L.time=Math.min(Math.max(L.time,0),e.duration_s);
    q('#episode-seek').value=L.time;q('#episode-clock').textContent=`${L.time.toFixed(1)} / ${e.duration_s}s`;
    const i=Math.max(0,e.events.findLastIndex(event=>event.time_s<=L.time)),event=e.events[i];
    q('#episode-event').innerHTML=`<span>${event.time_s.toFixed(1)}s · ${h(event.type)}</span><p>${h(event.text)}</p>`;
    document.querySelectorAll('[data-event-index]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.eventIndex)===i)));
    const play=q('[data-lab-action="play"]');if(play)play.textContent=L.playing?'Pause':'Play events';
  }
  function wireVideo(){const video=q('#episode-video');if(!video)return;video.addEventListener('timeupdate',()=>{L.time=video.currentTime;updateTime();});video.addEventListener('play',()=>{L.playing=true;updateTime();});video.addEventListener('ended',()=>{L.playing=false;updateTime();});video.addEventListener('pause',()=>{L.playing=false;updateTime();});video.addEventListener('error',()=>message('Video could not be decoded. Use a supported MP4 or WebM file.'));}
  function play(){
    const e=currentEpisode();if(!e)return;
    const video=q('#episode-video');if(L.playing){stop();updateTime();return;}
    if(L.time>=e.duration_s)L.time=0;L.playing=true;
    if(video){video.currentTime=L.time;video.playbackRate=Number(q('#episode-speed').value);video.play().catch(()=>{L.playing=false;message('Video playback failed. Check the format or use the video controls.');updateTime();});updateTime();return;}
    L.last=performance.now();const step=now=>{if(!L.playing||!q('#episode-seek'))return;L.time+=(now-L.last)/1000*Number(q('#episode-speed').value);L.last=now;if(L.time>=e.duration_s){L.time=e.duration_s;L.playing=false;}updateTime();if(L.playing)L.raf=requestAnimationFrame(step);};L.raf=requestAnimationFrame(step);updateTime();
  }
  function runConfig(){return {task_id:L.runTask,mode:L.runMode,gpu:Number(L.gpu),seeds:L.seeds.split(',').map(Number).slice(0,['solve','eval'].includes(L.runMode)?undefined:1),layouts:L.layouts.split(',').map(Number).slice(0,L.runMode==='play'?1:undefined),video_camera:['solve','eval'].includes(L.runMode)&&L.camera!=='none'?L.camera:null,agent:L.runMode==='eval'?L.runAgent:null,model:L.runMode==='eval'&&L.runAgent==='vlm'?L.runModel:null,purpose:L.runMode==='eval'?'direct-policy protocol; not program submission':'development / privileged reference; not model performance'};}
  function command(){
    const valid=/^(0|[1-9]\d?)$/.test(L.gpu)&&Number(L.gpu)<=15&&/^\d+(,\d+)*$/.test(L.seeds)&&L.seeds.split(',').length<=30&&L.seeds.split(',').every(s=>Number(s)<=1000000)&&/^[0-2](,[0-2])*$/.test(L.layouts)&&L.layouts.split(',').length<=30;
    if(!valid)return null;
    if(L.runMode==='eval'&&(!['T02','T06','T19'].includes(L.runTask)||(L.runAgent==='vlm'&&!/^[a-zA-Z0-9][a-zA-Z0-9_./:-]{0,159}$/.test(L.runModel))))return null;
    let args=`./scripts/ai4robot ${L.runMode} ${L.runTask.toLowerCase()} --gpu ${L.gpu}`;
    args+=L.runMode==='play'?` --seed ${Number(L.seeds.split(',')[0])} --layout ${Number(L.layouts.split(',')[0])}`:L.runMode==='check'?` --seed ${Number(L.seeds.split(',')[0])} --layouts ${L.layouts}`:` --seeds ${L.seeds} --layouts ${L.layouts}`;
    if(L.runMode==='eval')args+=` --agent ${L.runAgent}`+(L.runAgent==='vlm'?` --model '${L.runModel}'`:'');
    if(['solve','eval'].includes(L.runMode)&&L.camera!=='none')args+=` --video ${L.camera}`;
    return args;
  }
  function updateCommand(){const c=command();q('#run-command').textContent=c||'Correct the configuration to generate a command.';q('#run-feedback').textContent=c?L.runMode==='play'?'Interactive mode uses the first seed and layout.':L.runMode==='check'?'Check mode uses the first seed and all selected layouts.':L.runMode==='eval'?(L.runAgent==='vlm'?(L.runModel==='mock'?'mock exercises the pipeline offline; it is not a real model.':'Configure the provider locally. This runs the direct-policy route, not a submitted program.'):'null and replay are validation controls, not model results.'):'Reference solvers can use privileged state. Check that the task is implemented.':'Use GPU 0–15, integer seeds 0–1000000, layouts 0–2 (up to 30 entries). Direct evaluation here supports T02/T06/T19; enter a plain model ID.';const direct=L.runMode==='eval';for(const name of ['agent','model']){const el=q(`[name="${name}"]`);el.disabled=!direct||(name==='model'&&L.runAgent!=='vlm');}q('.run-task-note').textContent=TASKS.find(t=>t.id===L.runTask).note;}
  function message(text){L.message=text;const host=q('#lab-message');if(host)host.textContent=text;}
  function download(name,content,type='application/json'){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message(`Downloaded ${name}`);}
  async function copy(text){try{await navigator.clipboard.writeText(text);message('Copied.');}catch{showDialog(`<h2 id="dialog-title">Copy text</h2><p>Clipboard access is unavailable. Select and copy the text below.</p><textarea class="copy-fallback" readonly>${h(text)}</textarea>`);q('.copy-fallback').select();}}
  function exportRows(kind){
    const d=data(),ids=selectedTasks().map(t=>t.id);let rows;
    if(kind==='matrix-csv')rows=[['source','protocol','task_id','task',...d.models.map(m=>m.name)],...selectedTasks().map(t=>[sourceLabel(),d.protocol,t.id,t.name,...d.models.map(m=>{const r=d.results.find(r=>r.model_id===m.id&&r.task_id===t.id);return r?r.successes/r.trials:'';})])];
    else if(kind==='compare-csv')rows=[['source','protocol','group','model','common_tasks','trials','success_rate'],...GROUPS.flatMap(g=>{const common=selectedTasks().filter(t=>t.group===g.id&&L.compare.every(id=>d.results.some(r=>r.task_id===t.id&&r.model_id===id))).map(t=>t.id);return Results.summarize(d,common).filter(m=>L.compare.includes(m.id)).map(m=>[sourceLabel(),d.protocol,g.name,m.name,common.join(' '),m.trials,m.score]);})];
    else rows=[['source','benchmark_version','protocol','model','model_version','agent','trials','balanced_success_rate','pooled_success_rate','pooled_wilson_95_low','pooled_wilson_95_high','progress_0_100','duration_s','task_coverage','eligible'],...orderedRows().map(m=>[sourceLabel(),d.benchmark_version,d.protocol,m.name,m.version,m.agent,m.trials,m.score,m.pooled,m.ci?.[0],m.ci?.[1],m.progress===null?null:m.progress*100,m.duration,`${m.coverage}/${ids.length}`,m.complete])];
    download(`ai4robot-${L.source}-${kind}.csv`,Results.csv(rows),'text/csv;charset=utf-8');
  }
  function mount(){
    const root=q('#research');if(!root)return;renderPanel();
    root.addEventListener('click',event=>{
      const b=event.target.closest('button');if(!b)return;
      if(b.dataset.sort){L.direction=L.sort===b.dataset.sort?-L.direction:b.dataset.sort==='duration'?1:-1;L.sort=b.dataset.sort;renderPanel();return;}
      if(b.dataset.episode){L.episode=b.dataset.episode;L.time=0;renderPanel();return;}
      if(b.dataset.eventIndex!==undefined){L.time=currentEpisode().events[Number(b.dataset.eventIndex)].time_s;const video=q('#episode-video');if(video)video.currentTime=L.time;updateTime();return;}
      const action=b.dataset.labAction;
      if(action==='demo'||action==='load-demo'){clearVideo();L.source=action==='load-demo'?'demo':L.source==='demo'?'official':'demo';L.episode='';L.compare=[];L.message='';syncURL();renderPanel();}
      if(action==='reset'){L.track=L.category=L.group=L.robot='all';L.episodeTask=L.episodeModel=L.status='all';renderPanel();}
      if(action==='import')q('#result-upload').click();
      if(action==='stored'&&L.imported){clearVideo();L.source='imported';L.compare=[];L.episode='';L.episodeTask=L.episodeModel=L.status='all';renderPanel();}
      if(action==='clear-import'){
        let cleared=true;try{sessionStorage.removeItem(storageKey);}catch{cleared=false;}
        clearVideo();L.imported=null;L.importedSynthetic=false;L.importedSaved=false;if(L.source==='imported')L.source='official';L.message=cleared?'Cleared the imported report from this tab.':'Cleared the current page import. Storage could not be accessed; close this tab to end the session.';syncURL();render();
      }
      if(action==='share'){syncURL();copy(location.href);if(L.source==='imported')message('Only view parameters are shared. Imported report data is not uploaded or included in the link.');}
      if(['csv','matrix-csv','compare-csv'].includes(action))exportRows(action);
      if(action==='json')download(`ai4robot-${L.source}-report.json`,JSON.stringify({...data(),website_data_source:L.importedSynthetic&&L.source==='imported'?'demo':L.source},null,2));
      if(action==='demo-json')download('ai4robot-SYNTHETIC-example.json',JSON.stringify({...Results.demo,website_data_source:'demo'},null,2));
      if(action==='tasks-json')download('ai4robot-22-tasks.json',JSON.stringify({scope:'T01–T23 excluding T18',tasks:TASKS},null,2));
      if(action==='template')download('ai4robot-report-template.json',JSON.stringify({...Results.official,models:[{id:'your-model',name:'Your model name',version:'Exact model version',agent:'Exact agent version'}],results:[],episodes:[]},null,2));
      if(action==='episode-json')download('ai4robot-episode.json',JSON.stringify({source:L.importedSynthetic&&L.source==='imported'?'demo':L.source,benchmark_version:data().benchmark_version,protocol:data().protocol,episode:currentEpisode()},null,2));
      if(action==='play')play();
      if(action==='remove-video'){stop();URL.revokeObjectURL(L.videoURL);L.videoURL='';L.videoEpisode='';renderPanel();}
      if(action==='copy-command'){const c=command();c?copy(c):message('Correct the run configuration first.');}
      if(action==='run-json'){command()?download('ai4robot-run-config.json',JSON.stringify(runConfig(),null,2)):message('Correct the run configuration first.');}
      if(action==='citation')copy('@misc{ai4robot_website_demo,\n  title = {AI4Robot Website Demo},\n  year = {2026},\n  url = {https://racingemperor.github.io/ai4robot-website/},\n  note = {Website prototype; not a published benchmark paper}\n}');
    });
    root.addEventListener('change',async event=>{
      const el=event.target;
      if(el.dataset.labFilter){L[el.dataset.labFilter]=el.value;renderPanel();}
      if(el.dataset.episodeFilter){L[el.dataset.episodeFilter]=el.value;L.time=0;renderPanel();}
      if(el.dataset.compareChoice){if(el.checked&&L.compare.length>=3){el.checked=false;message('Compare at most three models.');return;}L.compare=el.checked?[...L.compare,el.dataset.compareChoice]:L.compare.filter(id=>id!==el.dataset.compareChoice);if(!L.compare.length){L.compare=[el.dataset.compareChoice];message('Keep at least one model selected.');}renderPanel();}
      if(el.id==='result-upload'&&el.files[0]){
        const file=el.files[0];try{if(file.size>5*1024*1024)throw new Error('The report exceeds 5 MB.');const raw=JSON.parse(await file.text());const checked=Results.validate(raw);clearVideo();L.imported=checked;L.importedSynthetic=raw.website_data_source==='demo';L.source='imported';L.compare=[];L.episode='';L.episodeTask=L.episodeModel=L.status='all';L.message=`Validated: ${L.imported.models.length} models, ${L.imported.results.length} task aggregates, ${L.imported.episodes.length} episodes. Local and unreviewed. ${raw.website_data_source==='demo'?'The file is labeled synthetic and cannot support model performance claims. ':''}`;
        L.importedSaved=false;try{sessionStorage.setItem(storageKey,JSON.stringify({report:checked,synthetic:L.importedSynthetic}));L.importedSaved=true;L.message+='Saved in this tab for navigation and reload.';}
        catch{try{sessionStorage.removeItem(storageKey);}catch{}L.message+='Storage unavailable; this page only. Import again after navigation.';}
        syncURL();render();}catch(error){message(`Import failed: ${error.message}`);}finally{el.value='';}
      }
      if(el.id==='episode-video-upload'&&el.files[0]){const file=el.files[0];if(!file.type.startsWith('video/')){message('Select a video file.');return;}stop();if(L.videoURL)URL.revokeObjectURL(L.videoURL);L.videoURL=URL.createObjectURL(file);L.videoEpisode=currentEpisode().id;L.time=0;renderPanel();}
      if(el.id==='episode-speed'){const video=q('#episode-video');if(video)video.playbackRate=Number(el.value);}
    });
    root.addEventListener('input',event=>{
      const el=event.target;
      if(el.id==='model-search'){L.modelQuery=el.value;const start=el.selectionStart;const panel=q('#lab-panel');panel.innerHTML=board();const input=q('#model-search');input.focus();input.setSelectionRange(start,start);syncURL();}
      if(el.id==='episode-seek'){L.time=Number(el.value);const video=q('#episode-video');if(video)video.currentTime=L.time;updateTime();}
      if(el.closest('#run-form')){const keys={task:'runTask',mode:'runMode',gpu:'gpu',seeds:'seeds',layouts:'layouts',camera:'camera',agent:'runAgent',model:'runModel'};if(keys[el.name])L[keys[el.name]]=el.value;updateCommand();if(el.name==='task'){const p=new URLSearchParams(location.search);p.set('task',L.runTask);history.replaceState({},'',location.pathname+'?'+p);}}
    });
    root.addEventListener('submit',e=>{if(e.target.id==='run-form')e.preventDefault();});
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();updateTime();}});
  function render(){
    const host=currentPage==='tasks'?q('#tasks-matrix-panel'):currentPage==='leaderboard'?q(`#leaderboard-${Site.section}-panel`):q('#page-content');
    q('#research')?.remove();host.innerHTML=html();mount();
  }
  document.addEventListener('site:sectionchange',()=>{
    if(currentPage==='tasks'&&Site.section!=='matrix')return;
    const p=new URLSearchParams(location.search);
    L.category=CATEGORIES.some(c=>c.id===p.get('category'))?p.get('category'):'all';
    L.group=GROUPS.some(g=>g.id===p.get('group'))?p.get('group'):'all';
    L.track=['A','B','C'].includes(p.get('track'))?p.get('track'):'all';
    L.robot=TASKS.some(t=>t.robot===p.get('robot'))?p.get('robot'):'all';
    const source=p.get('data');L.source=source==='demo'?'demo':source==='imported'&&L.imported?'imported':'official';
    if(currentPage==='leaderboard'){
      L.tab=Site.section==='comparison'?'compare':'board';
      L.sort=['score','pooled','progress','duration','trials','coverage'].includes(p.get('sort'))?p.get('sort'):'score';
      L.direction=p.get('order')==='asc'?1:-1;L.modelQuery=(p.get('modelQuery')||'').slice(0,160);
      L.compare=(p.get('models')||'').split(',').filter(Boolean).slice(0,3);
    }
    render();
  });
  return {render,stop};
})();

Lab.render();
