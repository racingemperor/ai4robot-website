/* The planned roster is presentation only. Measured values come from Results. */
window.Leaderboard = (() => {
 const roster=[
  ['gpt6-astra','gpt6-astra','codex','G6'],
  ['opus5-5','opus5.5','claude code','OP'],
  ['gemini-4','gemini 4','argon','G4'],
  ['grok-4-7','Grok 4.7','Grok Build','GK'],
  ['deepseek-v4-1-flash','deepseek v4.1 flash','dsh','DS'],
  ['glm-5-3-flash','glm 5.3 flash','zcode','GL'],
  ['kimi-k3-1-pro','kimi k3.1 pro','kimi code','KM'],
  ['minimax-m3-1-flash','MiniMax-M3.1-Flash','MiniMax Code','MM']
 ].map(([id,name,agent,mark])=>({id,name,agent,mark,version:'Version pending',scheduled:true,score:null,progress:null,pooled:null,duration:null,trials:0,coverage:0,complete:false}));
 const colors=['#2676bc','#a95435','#258477','#7855b5','#4773a8','#9a5875','#9a6c25','#a54d5e'];
 const colorFor=model=>colors[(roster.some(m=>m.id===model.id)?roster.findIndex(m=>m.id===model.id):[...model.id].reduce((sum,c)=>sum+c.charCodeAt(0),0))%colors.length];
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const percent=value=>value==null?'—':`${(value*100).toFixed(1)}%`;
 const points=value=>value==null?'—':(value*100).toFixed(1);
 const bar=value=>`<span class="overall-track${value==null?' is-pending':''}" aria-hidden="true">${value==null?'':`<i style="width:${Math.max(0,Math.min(100,value*100))}%"></i>`}</span>`;
 const mark=model=>model.mark||model.name.trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
 const identity=model=>`<span class="model-monogram" aria-hidden="true">${h(mark(model))}</span><span class="overall-identity"><strong>${h(model.name)}</strong><span>${h(model.agent)}</span></span>`;

 function render({report,rows,tasks,source,synthetic=false,modelQuery='',selectedModel='',taskCategory='all',sort='score',direction=-1,href}){
  const scheduled=source==='official'&&!report.models.length;
  const allModels=scheduled?roster:rows;
  const models=allModels.filter(m=>`${m.name} ${m.agent} ${m.version}`.toLowerCase().includes(modelQuery.toLowerCase()));
  const chosen=models.find(m=>m.id===selectedModel)||models[0];
  const categories=CATEGORIES.filter(c=>tasks.some(t=>t.category===c.id));
  if(!categories.some(c=>c.id===taskCategory))taskCategory='all';
  let rank=0,position=0,previous;const ranks=new Map();
  allModels.forEach(model=>{
   if(model.complete){position++;if(position===1||previous!==model[sort])rank=position;previous=model[sort];}
   if(model.complete)ranks.set(model.id,rank);
  });
  const rankings=models.map(model=>{
   const description=`${model.name}, harness ${model.agent}. ${model.complete?`Rank ${ranks.get(model.id)}.`:'Unranked.'} Overall success ${model.score==null?'not evaluated':percent(model.score)}. Progress ${model.progress==null?'not evaluated':points(model.progress)+' of 100'}. ${model.coverage} of ${tasks.length} tasks evaluated. Show task-level performance.`;
   return `<li><button type="button" class="overall-model" data-board-model="${h(model.id)}" aria-label="${h(description)}" aria-pressed="${model.id===chosen?.id}" aria-controls="model-breakdown" style="--model-color:${colorFor(model)}">
    <span class="overall-rank">${model.complete?String(ranks.get(model.id)).padStart(2,'0'):'—'}</span>
    <span class="overall-model-name">${identity(model)}</span>
    <span class="overall-score">${bar(model.score)}<strong>${percent(model.score)}</strong></span>
    <span class="overall-progress"><span class="mobile-metric-label">Progress</span>${points(model.progress)}</span>
    <span class="overall-coverage">${model.scheduled?'Awaiting results':`${model.coverage} / ${tasks.length}`}<small>${model.scheduled?'Not ranked':model.complete?'Complete':model.coverage?'Incomplete · unranked':'No trials · unranked'}</small></span>
    <span class="overall-chevron" aria-hidden="true">↗</span>
   </button></li>`;
  }).join('');
  const html=`<section class="overall-section" aria-labelledby="overall-title">
   <div class="overall-heading"><div><h2 id="overall-title">Overall</h2><p>One benchmark. ${tasks.length} tasks. Select a model to inspect its performance below.</p></div></div>
   <div class="overall-tools"><label class="model-search">Find a model or harness<input id="model-search" type="search" placeholder="Model or harness" value="${h(modelQuery)}"></label><label>Sort by<select id="leaderboard-sort">${[['score','Overall success'],['progress','Progress'],['pooled','Pooled success'],['duration','Mean simulation time'],['trials','Trial count'],['coverage','Task coverage']].map(([value,label])=>`<option value="${value}"${value===sort?' selected':''}>${label}</option>`).join('')}</select></label><button class="lab-button sort-direction" data-lab-action="board-direction" aria-label="${direction===1?'Sort descending':'Sort ascending'}" title="${direction===1?'Sort descending':'Sort ascending'}">${direction===1?'↑':'↓'}</button></div>
   <div class="overall-board"><div class="overall-column-head" aria-hidden="true"><span>#</span><span>Model / Harness</span><span>Overall success <span class="overall-axis"><i>0</i><i>50</i><i>100%</i></span></span><span>Progress / 100</span><span>Task coverage</span><span></span></div>
   <ul class="overall-models" aria-label="Overall model ranking">${rankings||'<li class="overall-no-match">No matching models. Try another name or harness.</li>'}</ul>
   <p class="overall-footnote">${scheduled?'Planned evaluation roster · Scores and ranks are pending. Row order follows the model list.':'Overall success averages task rates within each category, then weights the selected categories equally. Complete task coverage is required for a rank.'} <span>Click any row to see task-level results ↓</span></p></div>
  </section>${chosen?breakdown(chosen,models,report,tasks,categories,taskCategory,href,source,synthetic||source==='demo'):'<section id="model-breakdown" class="model-breakdown-empty"><h2>Model performance</h2><p>No model matches the current search.</p></section>'}`;
  return {html,selectedModel:chosen?.id||'',taskCategory};
 }

 function breakdown(model,models,report,tasks,categories,taskCategory,href,source,synthetic){
  const provenance=[synthetic?'Synthetic example':null,source==='imported'?'Local report · unreviewed':null].filter(Boolean).join(' · ');
  const forCategory=c=>tasks.filter(t=>t.category===c.id);
  const categoryStats=categories.map(c=>{
   const ids=forCategory(c).map(t=>t.id),summary=Results.summarize(report,ids).find(m=>m.id===model.id);
   return `<article><h4>${h(c.name)}</h4><strong>${percent(summary?.score)}</strong><span>${summary?.coverage||0} / ${ids.length} tasks evaluated</span></article>`;
  }).join('');
  const taskGroups=categories.filter(c=>taskCategory==='all'||c.id===taskCategory).map(c=>`<tbody><tr class="model-task-group"><th colspan="6" scope="rowgroup">${h(c.name)}<span>${forCategory(c).length} task${forCategory(c).length===1?'':'s'}</span></th></tr>${forCategory(c).map(t=>{
   const result=report.results.find(r=>r.model_id===model.id&&r.task_id===t.id);
   const success=result?result.successes/result.trials:null;
   const episodes=report.episodes.filter(e=>e.model_id===model.id&&e.task_id===t.id);
   return `<tr data-model-task="${t.id}"><th scope="row"><a class="model-task-name" href="${h(href('tasks',{task:t.id}))}"><span>${t.id}</span><strong>${h(t.name)}</strong><span aria-hidden="true">↗</span></a><small>${h(t.robot)}</small></th><td><div class="task-score-bar">${bar(success)}<strong>${percent(success)}</strong></div></td><td>${result?points(result.progress_sum/result.trials):'—'}</td><td>${result?`${result.successes} / ${result.trials}`:'—'}</td><td>${result?`${(result.duration_sum_s/result.trials).toFixed(1)} s`:'—'}</td><td>${episodes.length?`<a class="model-episode-link" href="${h(href('episodes',{episodeTask:t.id,episodeModel:model.id}))}">${episodes.length} replay${episodes.length===1?'':'s'} ↗</a>`:'<span class="task-result-pending">Awaiting evidence</span>'}</td></tr>`;
  }).join('')}</tbody>`).join('');
  return `<section id="model-breakdown" class="model-breakdown" aria-labelledby="model-breakdown-title">
   <div class="model-breakdown-heading"><div><p class="model-detail-kicker">MODEL PERFORMANCE</p><h2 id="model-breakdown-title" tabindex="-1">${h(model.name)}</h2><p>${h(model.agent)} · ${h(model.version)}</p></div><label>Selected model<select id="leaderboard-model-select">${models.map(m=>`<option value="${h(m.id)}"${m.id===model.id?' selected':''}>${h(m.name)}</option>`).join('')}</select></label></div>
   <p class="model-detail-status" role="status">${model.scheduled?'Evaluation pending. Task positions below are reserved for this model; no measured results are connected.':`${provenance?provenance+' · ':''}${model.coverage} of ${tasks.length} tasks evaluated. ${model.complete?'Complete task coverage.':'Incomplete coverage; this model is unranked.'}`}</p>
   <div class="model-summary"><div><span>Overall success</span><strong>${percent(model.score)}</strong></div><div><span>Progress / 100</span><strong>${points(model.progress)}</strong></div><div><span>Evaluated tasks</span><strong>${model.coverage}<small> / ${tasks.length}</small></strong></div><div><span>Valid trials</span><strong>${model.scheduled?'—':model.trials||'—'}</strong></div></div>
   <div class="model-category-heading"><h3>Across task categories</h3><span>Five categories defined by the manuscript</span></div><div class="model-category-grid">${categoryStats}</div>
   <div class="model-tasks-heading"><div><h3>Task by task</h3><p>Success, intermediate progress and evidence for the selected model.</p></div><label>Task category<select id="leaderboard-task-category"><option value="all">All categories</option>${categories.map(c=>`<option value="${c.id}"${taskCategory===c.id?' selected':''}>${h(c.name)}</option>`).join('')}</select></label></div>
   <div class="table-scroll model-task-scroll" role="region" aria-label="${h(model.name)} task performance; horizontally scrollable" tabindex="0"><table class="results-table model-task-table"><caption>${h(model.name)} · ${model.scheduled?'Evaluation pending':`${provenance?provenance+' · ':''}${h(report.protocol)}`} · A dash means no result, not zero.</caption><thead><tr><th scope="col">Task / Embodiment</th><th scope="col">Success rate</th><th scope="col">Progress / 100</th><th scope="col">Success / trials</th><th scope="col">Mean sim. time</th><th scope="col">Evidence</th></tr></thead>${taskGroups||'<tbody><tr><td colspan="6">No tasks match the selected scope.</td></tr></tbody>'}</table></div>
  </section>`;
 }
 return {render};
})();
