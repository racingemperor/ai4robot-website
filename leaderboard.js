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
 const colors=['#2374cf','#d06135','#128f7d','#8757c7','#d34882','#6f8428','#b08212','#54838e'];
 const colorFor=model=>model.color||colors[(roster.some(m=>m.id===model.id)?roster.findIndex(m=>m.id===model.id):[...model.id].reduce((sum,c)=>sum+c.charCodeAt(0),0))%colors.length];
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const percent=value=>value==null?'—':`${(value*100).toFixed(1)}%`;
 const points=value=>value==null?'—':(value*100).toFixed(1);
 const bar=value=>`<span class="overall-track${value==null?' is-pending':''}" aria-hidden="true">${value==null?'':`<i style="width:${Math.max(0,Math.min(100,value*100))}%"></i>`}</span>`;
 const mark=model=>model.mark||model.name.trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
 const identity=model=>`<span class="model-monogram" aria-hidden="true">${h(mark(model))}</span><span class="overall-identity"><strong>${h(model.name)}</strong><span>${h(model.agent)}</span></span>`;

 function render({report,rows,tasks,source,synthetic=false,modelQuery='',selectedModel='',taskCategory='all',hiddenModels=[],tableSort='overall',tableDirection=-1,href}){
  const scheduled=source==='official'&&!report.models.length;
  const allModels=(scheduled?roster:rows).map(m=>{const index=report.models.findIndex(item=>item.id===m.id);return {...m,color:scheduled?colorFor(m):colors[index]||`hsl(${Math.round(index*137.5)%360} 55% 42%)`};});
  const models=allModels.filter(m=>`${m.name} ${m.agent} ${m.version}`.toLowerCase().includes(modelQuery.toLowerCase()));
  const chosen=models.find(m=>m.id===selectedModel)||models[0];
  const categories=CATEGORIES.filter(c=>tasks.some(t=>t.category===c.id));
  if(!categories.some(c=>c.id===taskCategory))taskCategory='all';
  const summaryByCategory=new Map(categories.map(c=>[c.id,Results.summarize(report,tasks.filter(t=>t.category===c.id).map(t=>t.id))]));
  const values=m=>[...categories.map(c=>summaryByCategory.get(c.id).find(r=>r.id===m.id)?.score??null),m.score];
  const hidden=new Set(hiddenModels),visible=models.filter(m=>!hidden.has(m.id));
  const provenance=[synthetic||source==='demo'?'Synthetic example · not measured':null,source==='imported'?'Local report · unreviewed':null,source==='official'?'Official results · forthcoming':null].filter(Boolean).join(' · ');
  const axes=[...categories.map(c=>({name:c.name,lines:({'manipulation':['Robotic','manipulation'],'navigation':['Navigation'],'scene-generation':['Scene','generation'],'reconstruction':['Scene and interaction','reconstruction'],'policy-development':['Policy','development']})[c.id]})),{name:'Overall',lines:['Overall']}];
  const x=i=>66+i*(710/Math.max(1,axes.length-1)),y=v=>368-v*310;
  const grid=[0,20,40,60,80,100].map(n=>`<line x1="66" x2="776" y1="${y(n/100)}" y2="${y(n/100)}"/><text x="53" y="${y(n/100)+4}" text-anchor="end">${n}${n===100?'%':''}</text>`).join('');
  const labels=axes.map((axis,i)=>`<g class="category-axis"><line x1="${x(i)}" x2="${x(i)}" y1="58" y2="368"/><text x="${x(i)}" y="396" text-anchor="middle">${axis.lines.map((line,k)=>`<tspan x="${x(i)}" dy="${k?17:0}">${h(line)}</tspan>`).join('')}</text></g>`).join('');
  const segments=vs=>{let d='',pen=false;vs.forEach((v,i)=>{if(v==null){pen=false;return;}d+=`${pen?'L':'M'}${x(i)},${y(v)} `;pen=true;});return d;};
  const chartLines=visible.filter(m=>values(m).some(v=>v!=null)).map(m=>{
   const vs=values(m),description=`${m.name}. ${axes.map((a,j)=>`${a.name}: ${percent(vs[j])}`).join('. ')}. Open model results.`;
   const style=report.models.findIndex(item=>item.id===m.id)%3;
   return `<g class="model-curve" data-board-model="${h(m.id)}" role="button" tabindex="0" aria-haspopup="dialog" aria-label="${h(description)}" style="--model-color:${m.color}"><title>${h(description)}</title><path class="curve-hit" d="${segments(vs)}"/><path class="curve-line" d="${segments(vs)}"${style?` stroke-dasharray="${style===1?'7 3':'2 4'}"`:''}/>${vs.map((v,j)=>v==null?'':`<circle cx="${x(j)}" cy="${y(v)}" r="4.5"><title>${h(m.name)} · ${h(axes[j].name)}: ${percent(v)}</title></circle>`).join('')}</g>`;
  }).join('');
  // Direct labels are spaced independently of the score to avoid overlaps.
  const last=visible.filter(m=>values(m).at(-1)!=null).sort((a,b)=>values(b).at(-1)-values(a).at(-1));
  const labelY=last.map((m,i)=>Math.max(y(values(m).at(-1)),i?0:58));
  for(let i=1;i<labelY.length;i++)labelY[i]=Math.max(labelY[i],labelY[i-1]+23);
  if(labelY.at(-1)>368){labelY[labelY.length-1]=368;for(let i=labelY.length-2;i>=0;i--)labelY[i]=Math.min(labelY[i],labelY[i+1]-23);}
  const endLabels=last.map((m,i)=>`<g class="curve-label" data-board-model="${h(m.id)}" role="button" tabindex="0" aria-haspopup="dialog" aria-label="${h(m.name)} · Overall ${percent(values(m).at(-1))}. Open model results" style="--model-color:${m.color}"><path d="M781,${y(values(m).at(-1))} L796,${labelY[i]} H805"/><text x="812" y="${labelY[i]+4}">${h(m.name)}</text></g>`).join('');
  const chip=m=>`<div class="chart-model-chip" style="--model-color:${m.color}" data-hidden="${hidden.has(m.id)}"><label title="${hidden.has(m.id)?'Show':'Hide'} ${h(m.name)}"><input type="checkbox" data-chart-model="${h(m.id)}" aria-label="Show ${h(m.name)} on chart" ${hidden.has(m.id)?'':'checked'}><span class="chip-swatch" aria-hidden="true"></span></label><button type="button" data-board-model="${h(m.id)}" aria-haspopup="dialog" title="Open ${h(m.name)} results">${h(m.name)}</button></div>`;
  const taskResult=(m,id)=>report.results.find(r=>r.model_id===m.id&&r.task_id===id);
  const metric=m=>tableSort==='overall'?m.score:((r)=>r?r.successes/r.trials:null)(taskResult(m,tableSort));
  const tableModels=[...models].sort((a,b)=>{const av=metric(a),bv=metric(b);return av==null?bv==null?0:1:bv==null?-1:(av-bv)*tableDirection;});
  let rank=0,previous;const ranks=new Map();
  [...allModels].filter(m=>m.complete).sort((a,b)=>b.score-a.score).forEach((m,i)=>{if(i===0||m.score!==previous)rank=i+1;previous=m.score;ranks.set(m.id,rank);});
  const sortHead=(id,label,title='')=>`<th scope="col"${tableSort===id?` aria-sort="${tableDirection===1?'ascending':'descending'}"`:''}><button type="button" data-table-sort="${id}"${title?` title="${h(title)}"`:''}>${h(label)}${tableSort===id?` <span aria-hidden="true">${tableDirection===1?'↑':'↓'}</span>`:''}</button></th>`;
  const html=`<section id="model-capabilities" class="board-section" aria-labelledby="capabilities-title"><h2 id="capabilities-title">Model capabilities</h2><div class="chart-controls"><span>Models <small>${visible.length} / ${models.length}</small></span><div><button type="button" class="lab-button" data-chart-select="all">Select all</button><button type="button" class="lab-button" data-chart-select="none">Clear</button></div></div><div class="chart-models" aria-label="Model visibility and details">${models.map(chip).join('')}</div><p class="chart-source">${provenance}</p><div class="capability-chart-scroll" role="region" aria-label="Model success rates by manuscript category; horizontally scrollable" tabindex="0"><svg class="category-chart" viewBox="0 0 1025 450" role="group" aria-labelledby="category-chart-title" aria-describedby="chart-help"><title id="category-chart-title">Success rate by manuscript task categories and Overall</title><text class="chart-axis-title" x="0" y="23">Success rate (%)</text><g class="chart-grid" aria-hidden="true">${grid}${labels}</g>${chartLines}${endLabels}</svg></div>${!chartLines?`<div class="chart-empty"><strong>${!models.length?'No matching models':!visible.length?'No models selected':'Reviewed results are forthcoming'}</strong><p>${!visible.length?'Use Select all or enable a model above.':'Model lines will appear when results are connected. Missing evaluations are never plotted as zero.'}</p>${scheduled&&models.length?'<button type="button" class="lab-button" data-lab-action="load-demo">Preview chart with example data</button>':''}</div>`:''}<p id="chart-help" class="chart-help">Hover or focus a line to highlight a model. Click or press Enter to open its results. Use the checkboxes to show or hide lines.</p><details class="chart-source-table"><summary>View source as a table</summary><div class="table-scroll" role="region" aria-label="Category success rates" tabindex="0"><table class="results-table"><caption>${provenance}. Category averages use available task results; see coverage in model details.</caption><thead><tr><th scope="col">Model</th>${axes.map(a=>`<th scope="col">${h(a.name)}</th>`).join('')}</tr></thead><tbody>${models.map(m=>`<tr><th scope="row">${h(m.name)}</th>${values(m).map(v=>`<td>${percent(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details></section>
  <section id="task-results" class="board-section" aria-labelledby="task-comparison-title"><div class="board-section-heading"><div><h2 id="task-comparison-title">Task comparison</h2><p>Success rate for each of the ${tasks.length} tasks. Select a heading to sort or a score to inspect the model.</p></div><label class="board-search">Find a model or harness<input id="model-search" type="search" placeholder="Model or harness" value="${h(modelQuery)}"></label></div><p class="table-scroll-hint">Scroll horizontally to explore all task columns →</p><div class="task-comparison-scroll" role="region" aria-label="Model success rates across ${tasks.length} tasks; horizontally scrollable" tabindex="0"><table class="task-comparison-table"><caption>${provenance} · A dash means no result, not zero. Overall weights the manuscript categories equally.</caption><thead><tr><th scope="col" class="rank-column">#</th><th scope="col" class="model-column">Model / Harness</th>${sortHead('overall','Overall')}${tasks.map(t=>sortHead(t.id,t.id,t.name)).join('')}<th scope="col">Details</th></tr></thead><tbody>${tableModels.map(m=>`<tr style="--model-color:${m.color}"><td class="rank-column">${ranks.has(m.id)?ranks.get(m.id):'—'}</td><th scope="row" class="model-column"><button type="button" class="table-model" data-board-model="${h(m.id)}" aria-haspopup="dialog">${identity(m)}</button></th><td class="overall-cell"><button type="button" data-board-model="${h(m.id)}" aria-haspopup="dialog" aria-label="${h(m.name)} Overall ${percent(m.score)}. Open model results">${percent(m.score)}</button></td>${tasks.map(t=>{const r=taskResult(m,t.id),value=r?r.successes/r.trials:null;return `<td><button type="button" data-board-model="${h(m.id)}" data-focus-task="${t.id}" aria-haspopup="dialog" aria-label="${h(m.name)} · ${t.id} ${h(t.name)} · ${percent(value)}. Open task results">${percent(value)}</button></td>`;}).join('')}<td><button type="button" data-board-model="${h(m.id)}" aria-label="Open ${h(m.name)} results" aria-haspopup="dialog">↗</button></td></tr>`).join('')||`<tr><td colspan="${tasks.length+4}">No matching models.</td></tr>`}</tbody></table></div><details class="task-column-key"><summary>Task column key · ${tasks.length} tasks</summary><div>${tasks.map(t=>`<a href="${h(href('tasks',{task:t.id}))}"><strong>${t.id}</strong><span>${h(t.name)}</span></a>`).join('')}</div></details></section>`;
  return {html,selectedModel:chosen?.id||'',taskCategory,detailHTML:chosen?breakdown(chosen,models,report,tasks,categories,taskCategory,href,source,synthetic||source==='demo'):''};
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
   <div class="model-category-heading"><h3>Across task categories</h3><span>${categories.length} manuscript categories in this scope</span></div><div class="model-category-grid">${categoryStats}</div>
   <div class="model-tasks-heading"><div><h3>Task by task</h3><p>Success, intermediate progress and evidence for the selected model.</p></div><label>Task category<select id="leaderboard-task-category"><option value="all">All categories</option>${categories.map(c=>`<option value="${c.id}"${taskCategory===c.id?' selected':''}>${h(c.name)}</option>`).join('')}</select></label></div>
   <div class="table-scroll model-task-scroll" role="region" aria-label="${h(model.name)} task performance; horizontally scrollable" tabindex="0"><table class="results-table model-task-table"><caption>${h(model.name)} · ${model.scheduled?'Evaluation pending':`${provenance?provenance+' · ':''}${h(report.protocol)}`} · A dash means no result, not zero.</caption><thead><tr><th scope="col">Task / Embodiment</th><th scope="col">Success rate</th><th scope="col">Progress / 100</th><th scope="col">Success / trials</th><th scope="col">Mean sim. time</th><th scope="col">Evidence</th></tr></thead>${taskGroups||'<tbody><tr><td colspan="6">No tasks match the selected scope.</td></tr></tbody>'}</table></div>
  </section>`;
 }
 return {render};
})();
