/* One continuous Leaderboard: chart, task table, model details and report tools. */
window.Lab=(()=>{
 const q=(s,r=document)=>r.querySelector(s),h=esc;
 const query=new URLSearchParams(location.search);
 const source=Results.sourceFor(query.get('data'));
 let message='';
 let selectedModel=(query.get('model')||'').slice(0,160),taskCategory=query.get('taskCategory')||'all',expandedTask=(query.get('replayTask')||'');
 let tableSort=query.get('tableSort')||'overall',tableDirection=query.get('tableOrder')==='asc'?1:-1,view;
 const scope=TaskFilters.normalize(Object.fromEntries(query)),hiddenModels=new Set();
 if(!['overall',...TASKS.map(t=>t.id)].includes(tableSort))tableSort='overall';
 const report=()=>Results[source];
 const tasks=()=>TASKS.filter(t=>TaskFilters.matches(t,scope));
 const dialog=q('#model-focus'),modelWindow=Motion.taskWindow(dialog,()=>{TaskReplay.unmount();expandedTask='';const url=new URL(location.href);url.searchParams.delete('replayTask');url.searchParams.delete('detail');history.replaceState({},'',url);},{title:'#model-breakdown-title',preview:false});
 function syncURL(){
  const url=new URL(location.href);for(const key of ['section','sort','order','models','task','episodeTask','episodeModel','episode','modelQuery','group'])url.searchParams.delete(key);
  for(const [key,value]of Object.entries({...scope,data:source,model:selectedModel,taskCategory,replayTask:expandedTask,tableSort,tableOrder:tableDirection===1?'asc':'desc'}))value&&value!=='all'?url.searchParams.set(key,value):url.searchParams.delete(key);
  history.replaceState({},'',url);Site.refreshLinks();
 }
 function filters(){return TaskFilters.render({id:'leaderboard',values:scope,count:tasks().length});}
 function tools(){return `<div class="lab-source"><details class="leaderboard-data-tools"><summary>Data &amp; exports</summary><div class="lab-actions"><button class="lab-button" data-lab-action="share">Copy view link</button><button class="lab-button" data-lab-action="csv">Export CSV</button><button class="lab-button" data-lab-action="json">Download report</button><button class="lab-button" data-lab-action="template">Report template</button></div></details></div>`;}
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
 async function share(){try{await navigator.clipboard.writeText(location.href);message='View link copied.';}catch{message='Copy the current address from your browser to share this view.';}q('#lab-message').textContent=message;}
 function render(){
  q('#page-content').innerHTML=Site.news('leaderboard-news')+'<section class="research page-workspace" id="research"><div id="leaderboard-tools"></div><p id="lab-message" role="status"></p><div id="lab-filters"></div><div id="lab-panel"></div></section>';
  draw();const root=q('#research');
  root.addEventListener('click',e=>{
   const model=e.target.closest('[data-board-model]');if(model){openModel(model);return;}
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.chartSelect){hiddenModels.clear();if(b.dataset.chartSelect==='none')root.querySelectorAll('[data-chart-model]').forEach(el=>hiddenModels.add(el.dataset.chartModel));draw();q(`[data-chart-select="${b.dataset.chartSelect}"]`)?.focus({preventScroll:true});return;}
   if(b.dataset.tableSort){tableDirection=tableSort===b.dataset.tableSort?-tableDirection:-1;tableSort=b.dataset.tableSort;draw();q(`[data-table-sort="${tableSort}"]`)?.focus({preventScroll:true});return;}
   const action=b.dataset.labAction;
   if(b.hasAttribute('data-scope-reset')){Object.assign(scope,TaskFilters.normalize({}));draw();q('[data-scope-reset]')?.focus({preventScroll:true});}
   if(action==='share'){syncURL();share();}
   if(action==='json')download(`ai4robot-${source}-report.json`,JSON.stringify({...report(),website_data_source:source},null,2));
   if(action==='template')download('ai4robot-report-template.json',JSON.stringify({...Results.official,models:[{id:'your-model',name:'Your model',version:'Exact version',agent:'Exact harness'}],results:[],episodes:[]},null,2));
   if(action==='csv')download(`ai4robot-${source}-results.csv`,Results.csv([['source','protocol','model','coverage','average_score_0_100','mean_simulation_s'],...Results.summarize(report(),tasks().map(t=>t.id)).map(m=>['Model results',report().protocol,m.name,m.coverage,m.score==null?null:m.score*100,m.duration])]),'text/csv;charset=utf-8');
  });
  root.addEventListener('keydown',e=>{const model=e.target.closest('.model-curve,.curve-label');if(model&&['Enter',' '].includes(e.key)){e.preventDefault();openModel(model);}});
  root.addEventListener('change',e=>{
   const el=e.target;
   if(el.dataset.chartModel){el.checked?hiddenModels.delete(el.dataset.chartModel):hiddenModels.add(el.dataset.chartModel);const id=el.dataset.chartModel;draw();q(`[data-chart-model="${CSS.escape(id)}"]`)?.focus({preventScroll:true});}
   if(el.dataset.scopeFilter){scope[el.dataset.scopeFilter]=el.value;const key=el.dataset.scopeFilter;draw();q(`[data-scope-filter="${key}"]`)?.focus({preventScroll:true});}
  });
  if(query.get('detail')==='1'){const target=q(`[data-board-model="${CSS.escape(selectedModel)}"]`);if(target)openModel(target);}
 }
 dialog.addEventListener('change',e=>{if(e.target.id==='leaderboard-model-select')selectedModel=e.target.value;else if(e.target.id==='leaderboard-task-category')taskCategory=e.target.value;else return;const id=e.target.id;board();renderDetails();syncURL();q('#'+id)?.focus({preventScroll:true});});
 dialog.addEventListener('click',e=>{const row=e.target.closest('[data-model-task]');if(row){toggleTask(row.dataset.modelTask);return;}if(e.target.closest('a[href]'))modelWindow.close(true);});
 return {render};
})();
Lab.render();
