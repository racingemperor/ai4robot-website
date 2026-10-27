/* One continuous Leaderboard: chart, task table, model details and report tools. */
window.Lab=(()=>{
 const q=(s,r=document)=>r.querySelector(s),h=esc;
 const query=new URLSearchParams(location.search);
 let source=Results.sourceFor(query.get('data')),imported=null,synthetic=false,message='',saved=false;
 let selectedModel=(query.get('model')||'').slice(0,160),taskCategory=query.get('taskCategory')||'all',expandedTask=(query.get('replayTask')||'');
 let tableSort=query.get('tableSort')||'overall',tableDirection=query.get('tableOrder')==='asc'?1:-1,scopeOpen=false,view;
 const scope={category:'all',group:'all',robot:'all',track:'all'},hiddenModels=new Set();
 for(const key of Object.keys(scope))scope[key]=query.get(key)||'all';
 if(!['all',...CATEGORIES.map(c=>c.id)].includes(scope.category))scope.category='all';
 if(!['all',...GROUPS.map(g=>g.id)].includes(scope.group))scope.group='all';
 if(!['all',...TASKS.map(t=>t.robot)].includes(scope.robot))scope.robot='all';
 if(!['all','A','B','C'].includes(scope.track))scope.track='all';
 if(!['overall',...TASKS.map(t=>t.id)].includes(tableSort))tableSort='overall';
 try{const stored=Results.readSaved(sessionStorage);if(stored){imported=stored.report;synthetic=stored.synthetic;saved=true;}}catch{message='Saved results are unavailable. Import the report again.';}
 if(query.get('data')==='imported'){if(imported)source='imported';else message='No local report is available in this tab. Import it again.';}
 const report=()=>source==='demo'?Results.demo:source==='imported'?imported:Results.official;
 const provenance=()=>source==='imported'?'Local report':'Model results';
 const tasks=()=>TASKS.filter(t=>Object.entries(scope).every(([key,value])=>value==='all'||t[key]===value));
 const dialog=q('#model-focus'),modelWindow=Motion.taskWindow(dialog,()=>{TaskReplay.unmount();expandedTask='';const url=new URL(location.href);url.searchParams.delete('replayTask');url.searchParams.delete('detail');history.replaceState({},'',url);},{title:'#model-breakdown-title',preview:false});
 function syncURL(){
  const url=new URL(location.href);for(const key of ['section','sort','order','models','task','episodeTask','episodeModel','episode','modelQuery'])url.searchParams.delete(key);
  for(const [key,value]of Object.entries({...scope,data:source,model:selectedModel,taskCategory,replayTask:expandedTask,tableSort,tableOrder:tableDirection===1?'asc':'desc'}))value&&value!=='all'?url.searchParams.set(key,value):url.searchParams.delete(key);
  history.replaceState({},'',url);Site.refreshLinks();
 }
 const option=(v,label,active)=>`<option value="${h(v)}"${v===active?' selected':''}>${h(label)}</option>`;
 function filters(){return `<details class="leaderboard-scope"${scopeOpen?' open':''}><summary>Evaluation scope · ${tasks().length} / 22 tasks</summary><div class="lab-filters">${[
  ['category','Task category',CATEGORIES.map(c=>[c.id,c.name])],['group','Capability facet',GROUPS.map(g=>[g.id,g.name])],['robot','Embodiment / scene',[...new Set(TASKS.map(t=>t.robot))].map(v=>[v,v])],['track','Delivery mode',[['A','Control program'],['B','Training'],['C','Artifact construction']]]
 ].map(([key,label,entries])=>`<label>${label}<select data-lab-filter="${key}">${option('all','All',scope[key])}${entries.map(([v,name])=>option(v,name,scope[key])).join('')}</select></label>`).join('')}<button type="button" class="lab-button" data-lab-action="reset">Reset filters</button></div></details>`;}
 function tools(){return `<div class="lab-source"><details class="leaderboard-data-tools"><summary>Data &amp; exports</summary><div class="lab-actions"><button class="lab-button" data-lab-action="import">Import JSON</button>${imported?'<button class="lab-button" data-lab-action="stored">View imported report</button><button class="lab-button" data-lab-action="clear-import">Clear import</button>':''}<button class="lab-button" data-lab-action="share">Copy view link</button><button class="lab-button" data-lab-action="csv">Export CSV</button><button class="lab-button" data-lab-action="json">Download report</button><button class="lab-button" data-lab-action="template">Report template</button></div></details></div>`;}
 function board(){
  view=Leaderboard.render({report:report(),rows:Results.summarize(report(),tasks().map(t=>t.id)),tasks:tasks(),source,selectedModel,taskCategory,hiddenModels:[...hiddenModels],tableSort,tableDirection,href:Site.href});
  selectedModel=view.selectedModel;taskCategory=view.taskCategory;
  return view.html;
 }
 function draw(){
  const scroll=q('.task-comparison-scroll')?.scrollLeft||0;
  q('#leaderboard-tools').innerHTML=tools();q('#lab-filters').innerHTML=filters();q('#lab-panel').innerHTML=board();q('#lab-message').textContent=message;
  if(q('.task-comparison-scroll'))q('.task-comparison-scroll').scrollLeft=scroll;
  if(dialog.open)renderDetails();
  syncURL();
 }
 function renderDetails(){
  TaskReplay.unmount();q('#model-focus-content').innerHTML=view.detailHTML;
  if(expandedTask)showTaskRecording(expandedTask);
 }
 function showTaskRecording(id){
  TaskReplay.unmount();
  dialog.querySelectorAll('[data-board-task-replay]').forEach(host=>{host.innerHTML='';});
  dialog.querySelectorAll('[data-model-task-toggle]').forEach(button=>button.setAttribute('aria-expanded',String(button.dataset.modelTaskToggle===id)));
  dialog.querySelectorAll('.model-task-recording-row').forEach(row=>row.hidden=row.id!==`model-task-panel-${id}`);
  dialog.querySelectorAll('[data-model-task]').forEach(row=>row.classList.toggle('is-expanded',row.dataset.modelTask===id));
  const host=q(`[data-board-task-replay="${CSS.escape(id)}"]`,dialog),task=tasks().find(t=>t.id===id);
  expandedTask=host&&task?id:'';
  if(expandedTask){TaskReplay.mountRecording(host,task,{modelId:selectedModel,report:report(),source});q('.model-task-scroll',dialog).scrollLeft=0;}
 }
 function toggleTask(id){
  showTaskRecording(expandedTask===id?'':id);syncURL();
  q(`[data-model-task-toggle="${CSS.escape(id)}"]`,dialog)?.focus({preventScroll:true});
 }
 function openModel(target){
  const id=target.dataset.boardModel;
  expandedTask=target.dataset.focusTask||(id===selectedModel?expandedTask:'');
  if(target.dataset.focusTask)taskCategory='all';selectedModel=id;board();
  if(!view.detailHTML)return;renderDetails();modelWindow.open(target);
  const url=new URL(location.href);url.searchParams.set('detail','1');history.replaceState({},'',url);syncURL();
  if(target.dataset.focusTask){const row=q(`[data-model-task="${CSS.escape(target.dataset.focusTask)}"]`,dialog);row?.scrollIntoView({block:'start',behavior:'instant'});}
 }
 function download(name,text,type='application/json'){
  const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 async function share(){try{await navigator.clipboard.writeText(location.href);message='View link copied. Local files are not included.';}catch{message='Copy the current address from your browser to share this view.';}q('#lab-message').textContent=message;}
 function render(){
  q('#page-content').innerHTML=Site.news('leaderboard-news')+'<section class="research page-workspace" id="research"><div id="leaderboard-tools"></div><input id="result-upload" type="file" accept=".json,application/json" hidden><p id="lab-message" role="status"></p><div id="lab-filters"></div><div id="lab-panel"></div></section>';
  draw();const root=q('#research');
  root.addEventListener('click',e=>{
   const model=e.target.closest('[data-board-model]');if(model){openModel(model);return;}
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.chartSelect){hiddenModels.clear();if(b.dataset.chartSelect==='none')root.querySelectorAll('[data-chart-model]').forEach(el=>hiddenModels.add(el.dataset.chartModel));draw();q(`[data-chart-select="${b.dataset.chartSelect}"]`)?.focus({preventScroll:true});return;}
   if(b.dataset.tableSort){tableDirection=tableSort===b.dataset.tableSort?-tableDirection:-1;tableSort=b.dataset.tableSort;draw();q(`[data-table-sort="${tableSort}"]`)?.focus({preventScroll:true});return;}
   const action=b.dataset.labAction;
   if(action==='import')q('#result-upload').click();
   if(action==='stored'&&imported){source='imported';hiddenModels.clear();draw();}
   if(action==='reset'){for(const k of Object.keys(scope))scope[k]='all';draw();}
   if(action==='clear-import'){TaskReplay.unmount();TaskReplay.clearImportedRecordings();let cleared=true;try{sessionStorage.removeItem(Results.storageKey);}catch{cleared=false;}imported=null;synthetic=false;saved=false;if(source==='imported')source=Results.defaultSource();message=cleared?'Local report cleared.':'Cleared from this page. Close the tab to end its storage session.';draw();}
   if(action==='share'){syncURL();share();}
   if(action==='json')download(`ai4robot-${source}-report.json`,JSON.stringify({...report(),website_data_source:source==='imported'&&synthetic?'demo':source},null,2));
   if(action==='template')download('ai4robot-report-template.json',JSON.stringify({...Results.official,models:[{id:'your-model',name:'Your model',version:'Exact version',agent:'Exact harness'}],results:[],episodes:[]},null,2));
   if(action==='csv')download(`ai4robot-${source}-results.csv`,Results.csv([['source','protocol','model','coverage','success_rate','pooled_success','wilson_low','wilson_high','progress_0_100','mean_simulation_s'],...Results.summarize(report(),tasks().map(t=>t.id)).map(m=>[provenance(),report().protocol,m.name,m.coverage,m.score,m.pooled,m.ci?.[0],m.ci?.[1],m.progress==null?null:m.progress*100,m.duration])]),'text/csv;charset=utf-8');
  });
  root.addEventListener('keydown',e=>{const model=e.target.closest('.model-curve,.curve-label');if(model&&['Enter',' '].includes(e.key)){e.preventDefault();openModel(model);}});
  root.addEventListener('toggle',e=>{if(e.target.matches('.leaderboard-scope'))scopeOpen=e.target.open;},true);
  root.addEventListener('change',async e=>{
   const el=e.target;
   if(el.dataset.chartModel){el.checked?hiddenModels.delete(el.dataset.chartModel):hiddenModels.add(el.dataset.chartModel);const id=el.dataset.chartModel;draw();q(`[data-chart-model="${CSS.escape(id)}"]`)?.focus({preventScroll:true});}
   if(el.dataset.labFilter){scope[el.dataset.labFilter]=el.value;const key=el.dataset.labFilter;draw();q(`[data-lab-filter="${key}"]`)?.focus({preventScroll:true});}
   if(el.id==='result-upload'&&el.files[0]){
    try{
     const file=el.files[0];if(file.size>5*1024*1024)throw new Error('The report exceeds 5 MB.');const raw=JSON.parse(await file.text()),checked=Results.validate(raw);
     TaskReplay.unmount();TaskReplay.clearImportedRecordings();imported=checked;synthetic=raw.website_data_source==='demo';source='imported';saved=false;hiddenModels.clear();
     try{sessionStorage.setItem(Results.storageKey,JSON.stringify({report:checked,synthetic}));saved=true;}catch{try{sessionStorage.removeItem(Results.storageKey);}catch{}}
     message=`Validated ${checked.models.length} models and ${checked.episodes.length} recordings.`;draw();
    }catch(error){message=`Import failed: ${error.message}`;q('#lab-message').textContent=message;}finally{el.value='';}
   }
  });
  if(query.get('detail')==='1'){const target=q(`[data-board-model="${CSS.escape(selectedModel)}"]`);if(target)openModel(target);}
 }
 dialog.addEventListener('change',e=>{if(e.target.id==='leaderboard-model-select')selectedModel=e.target.value;else if(e.target.id==='leaderboard-task-category')taskCategory=e.target.value;else return;const id=e.target.id;board();renderDetails();syncURL();q('#'+id)?.focus({preventScroll:true});});
 dialog.addEventListener('click',e=>{const row=e.target.closest('[data-model-task]');if(row){toggleTask(row.dataset.modelTask);return;}if(e.target.closest('a[href]'))modelWindow.close(true);});
 return {render};
})();
Lab.render();
