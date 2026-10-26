/* Small, independent Home views over the shared report and task catalog. */
window.HomeInsights = (() => {
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const categories=CATEGORIES;
 const pct=value=>value===null?'—':`${(value*100).toFixed(1)}%`;
 function render(){return `<section id="home-performance" class="section home-performance" aria-labelledby="home-performance-title">
  <div class="insight-heading"><div><h2 id="home-performance-title">Leading models. Five task categories.</h2><p>The top five models by overall category-balanced success, shown across the five task categories defined in the EGE abstract.</p></div><a class="text-link" id="home-leaderboard-link" href="${Site.href('leaderboard')}">Full leaderboard ↗</a></div>
  <div class="home-results-panel"><div class="insight-toolbar"><label>Results<select id="home-result-source" aria-label="Results"><option value="official">Official results</option><option value="demo">Synthetic preview</option></select></label><label>Show<select id="home-result-metric" aria-label="Show"><option value="score">Success rate</option><option value="progress">Progress / 100</option></select></label><p id="home-chart-status" role="status"></p></div>
  <div id="home-category-chart"></div>
  </div>
 </section>
 <section id="home-capabilities" class="section home-capabilities" aria-labelledby="home-capabilities-title">
  <div class="insight-heading"><div><h2 id="home-capabilities-title">Every task has its own rhythm.</h2><p>Seven capabilities. Twenty-two tasks. Switch a capability to see where the task demands rise.</p></div><a class="text-link" href="${Site.href('tasks')}">Explore all tasks ↗</a></div>
  <div class="capability-tabs" role="group" aria-label="Choose a capability">${Insights.dimensions.map((d,i)=>`<button type="button" data-capability="${d.id}" aria-pressed="${i===0}" aria-controls="capability-ring capability-description"><span class="capability-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${d.name}</span></button>`).join('')}</div>
  <div class="ring-layout"><div class="ring-visual"><p id="capability-description" class="ring-description"></p><div id="capability-ring"></div><div class="ring-scale" aria-label="Task demand scale">${Insights.levels.map((level,i)=>`<span><i style="--demand-level:${i}" aria-hidden="true"></i>${i} · ${level.name}</span>`).join('')}</div><p class="insight-note">Higher peaks mean stronger demand for the selected capability. Each task keeps its place clockwise; T18 is excluded. Select a task marker or use the task menu.</p></div>
   <aside class="ring-task-panel" aria-label="Selected task demands"><label>Inspect a task<select id="ring-task" aria-label="Inspect a task">${TASKS.map(t=>`<option value="${t.id}">${t.id} · ${h(t.name)}</option>`).join('')}</select></label><div id="ring-task-detail" aria-live="polite"></div></aside></div>
  <details class="ring-method"><summary>How the demand levels are assigned</summary><p>These seven capabilities are an editorial grouping of the task requirements, not a taxonomy defined in the paper. Each task is annotated from its goal, capability descriptions and completion checks: 0 = not a focus, 1 = supporting, 2 = important, 3 = central. All seven rings use the same ordinal height scale. Heights describe intended task demands, not measured difficulty, model ability or benchmark results. The marks between tasks simply shape the waveform; the labeled peak is the annotation.</p><div class="table-scroll" role="region" tabindex="0" aria-label="All task demand annotations; horizontally scrollable"><table class="atlas-annotation-table"><caption>Editorial task-demand annotations · 0–3 ordinal scale · Select a task to read the rationale for each capability</caption><thead><tr><th scope="col">Task</th>${Insights.dimensions.map(d=>`<th scope="col">${d.name}</th>`).join('')}</tr></thead><tbody>${TASKS.map(t=>`<tr><th scope="row"><a href="${Site.href('tasks',{task:t.id})}">${t.id} · ${h(t.name)}</a></th>${Insights.profile(t).map(d=>`<td title="${h(d.reason)}">${d.value} · ${d.level}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>
 </section>`;}
 function mount(){
  const source=document.querySelector('#home-result-source');
  if(!source)return;
  const metric=document.querySelector('#home-result-metric');
  let imported=null,synthetic=false;
  try{
   const saved=Results.readSaved(sessionStorage);
   if(saved){imported=saved.report;synthetic=saved.synthetic;}
  }catch{/* An unavailable or invalid local report never becomes public results. */}
  if(imported)source.insertAdjacentHTML('beforeend','<option value="imported">Local report · unreviewed</option>');
  const initial=new URLSearchParams(location.search).get('data');
  source.value=initial==='demo'?'demo':initial==='imported'&&imported?'imported':'official';
  function drawChart(){
   const report=source.value==='demo'?Results.demo:source.value==='imported'?imported:Results.official;
   const rows=Insights.topModels(report,metric.value),empty=!rows.length;
   const label=source.value==='demo'?'Synthetic preview · Not measured':source.value==='imported'?`Local report · ${synthetic?'Synthetic · ':''}Unreviewed`:'Official results';
   const models=empty?Array.from({length:5},(_,i)=>({name:`Model slot ${String(i+1).padStart(2,'0')}`,categories:[]})):rows;
   const progress=metric.value==='progress';
   document.querySelector('#home-chart-status').textContent=`${label}${empty?' · Awaiting complete 22-task results':` · ${rows.length} models · 22 / 22 tasks`}`;
   document.querySelector('#home-leaderboard-link').href=Site.href('leaderboard',{data:source.value==='official'?null:source.value,category:null,group:null,robot:null,track:null});
   const url=new URL(location.href);if(source.value==='official')url.searchParams.delete('data');else url.searchParams.set('data',source.value);history.replaceState({},'',url);Site.refreshLinks();
   document.querySelector('#home-category-chart').innerHTML=`<div class="model-legend">${models.map((m,i)=>`<span><i style="--model-color:var(--model-${i})" aria-hidden="true">${String.fromCharCode(65+i)}</i>${h(m.name)}</span>`).join('')}</div><div class="category-bar-grid">${CATEGORIES.map((c,ci)=>{
    const barWidth=30,gap=13,start=48,baseline=223,scale=1.8;
    return `<figure><figcaption><strong>${c.name}</strong><span>${c.count} task${c.count===1?'':'s'} · ${progress?'Progress / 100':'Success rate'}</span></figcaption><svg class="category-bar-chart" viewBox="0 0 270 260" role="img" aria-label="${h(c.name)}: ${empty?'five model positions awaiting results':`${label}; ${progress?'progress':'success rate'} for the top ${rows.length} models`}">
     ${[0,50,100].map(t=>`<line x1="35" x2="265" y1="${baseline-t*scale}" y2="${baseline-t*scale}" class="chart-grid"/><text x="29" y="${baseline-t*scale+4}" text-anchor="end" class="chart-axis">${t}</text>`).join('')}
     ${models.map((m,i)=>{const value=m.categories[ci]?.value??null,x=start+i*(barWidth+gap),height=value===null?0:value*100*scale;return `<g><title>${h(m.name)}: ${value===null?'Awaiting results':progress?(value*100).toFixed(1)+' / 100':pct(value)}</title>${value===null?`<rect x="${x}" y="43" width="${barWidth}" height="180" rx="5" class="chart-empty-bar"/><text x="${x+barWidth/2}" y="130" text-anchor="middle" class="chart-value">—</text>`:`<rect x="${x}" y="${baseline-height}" width="${barWidth}" height="${height}" rx="4" fill="var(--model-${i})"/><text x="${x+barWidth/2}" y="${baseline-height-9}" text-anchor="middle" class="chart-value">${(value*100).toFixed(1)}</text>`}<text x="${x+barWidth/2}" y="246" text-anchor="middle" class="chart-model-key">${String.fromCharCode(65+i)}</text></g>`;}).join('')}</svg></figure>`;
   }).join('')}</div><p class="insight-note">${empty?'Five model series are reserved. No rankings or scores have been published. Choose Synthetic preview to inspect the chart layout.':`Models are selected by overall balanced success; the same five appear in every category. Each category averages its task ${progress?'progress':'success rates'} equally. ${source.value==='demo'?'All values are synthetic examples and make no claim about real models.':source.value==='imported'?'Local imports have not been reviewed.':''}`}</p>
    ${empty?'':`<details class="home-chart-table"><summary>View chart values</summary><p class="insight-note">${h(report.benchmark_version)} · ${h(report.protocol)} · ${label}</p><div class="table-scroll" role="region" tabindex="0" aria-label="Model category results; horizontally scrollable"><table class="atlas-annotation-table"><caption>${label} · ${progress?'Progress / 100':'Success rate'} · Complete catalog coverage</caption><thead><tr><th scope="col">Model / agent</th><th scope="col">Overall success</th>${CATEGORIES.map(c=>`<th scope="col">${c.name}</th>`).join('')}</tr></thead><tbody>${rows.map(m=>`<tr><th scope="row">${h(m.name)}<small>${h(m.version)} · ${h(m.agent)}</small></th><td>${pct(m.score)}</td>${m.categories.map(c=>`<td>${progress?(c.value*100).toFixed(1):pct(c.value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`}`;
  }
  source.addEventListener('change',drawChart);metric.addEventListener('change',drawChart);drawChart();
  mountRing();
 }
 function mountRing(){
  const plot=document.querySelector('#capability-ring'),taskSelect=document.querySelector('#ring-task');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const base=155,step=29,center=310,angleStep=2*Math.PI/TASKS.length;
  let dimensionId=Insights.dimensions[0].id,selected='T06',animation=0;
  let displayed=Insights.waveform(dimensionId).map(d=>d.value);
  const point=(angle,radius)=>[center+Math.sin(angle)*radius,center-Math.cos(angle)*radius];
  const xy=p=>p.map(n=>n.toFixed(2)).join(' ');
  plot.innerHTML=`<svg class="capability-ring" viewBox="0 0 620 620" role="group" aria-labelledby="ring-svg-title" aria-describedby="ring-svg-desc"><title id="ring-svg-title">Task demands for Perception &amp; grounding</title><desc id="ring-svg-desc">22 fixed task positions. Higher radial peaks indicate stronger qualitative demand on a shared zero-to-three scale. Use the task menu for an alternative to the diagram.</desc>
   <g class="ring-guides" aria-hidden="true">${[0,1,2,3].map(level=>`<circle cx="310" cy="310" r="${base+7+level*step}"/>`).join('')}</g>
   <circle class="ring-disc" cx="310" cy="310" r="135" aria-hidden="true"/><circle class="ring-groove" cx="310" cy="310" r="126" aria-hidden="true"/>
   <g class="ring-notes">${TASKS.map((t,i)=>{
    const angle=i*angleStep,label=point(angle,275);
    return `<g class="ring-note" data-ring-task="${t.id}" role="button" tabindex="${t.id===selected?0:-1}" aria-pressed="${t.id===selected}"><title></title><path class="ring-note-target" d="M${xy(point(angle-.065,base-10))}L${xy(point(angle-.065,base+106))}A261 261 0 0 1 ${xy(point(angle+.065,base+106))}L${xy(point(angle+.065,base-10))}Z"/>${[-3,-2,-1,0,1,2,3].map(j=>`<line class="ring-wave ${j===0?'ring-peak':''}" data-wave-offset="${j}"/>`).join('')}<circle class="ring-note-dot" r="4.5"/><text class="ring-task-label" x="${label[0]}" y="${label[1]}" text-anchor="middle" dominant-baseline="middle">${t.id}</text></g>`;
   }).join('')}</g>
   <g class="ring-center" aria-hidden="true"><text x="310" y="262" class="ring-center-kicker" text-anchor="middle">CAPABILITY <tspan id="ring-center-index">01 / 07</tspan></text><text x="310" y="301" class="ring-center-title" text-anchor="middle"><tspan id="ring-center-line1" x="310"></tspan><tspan id="ring-center-line2" x="310" dy="32"></tspan></text><text x="310" y="369" class="ring-center-count" text-anchor="middle">22 TASKS · SAME POSITIONS</text></g>
  </svg>`;
  const notes=Array.from(plot.querySelectorAll('[data-ring-task]')).map((node,i)=>({node,angle:i*angleStep,lines:Array.from(node.querySelectorAll('[data-wave-offset]')),dot:node.querySelector('circle')}));
  function draw(){
   notes.forEach(({node,angle,lines,dot},i)=>{
    const height=7+displayed[i]*step;
    lines.forEach((line,j)=>{
     const offset=j-3,envelope=[.16,.43,.77,1,.77,.43,.16][j],a=angle+offset*.027;
     const start=point(a,base),end=point(a,base+height*envelope);
     line.setAttribute('x1',start[0]);line.setAttribute('y1',start[1]);line.setAttribute('x2',end[0]);line.setAttribute('y2',end[1]);
    });
    const end=point(angle,base+height);dot.setAttribute('cx',end[0]);dot.setAttribute('cy',end[1]);
    node.classList.toggle('is-selected',TASKS[i].id===selected);
    node.setAttribute('aria-pressed',String(TASKS[i].id===selected));
    node.setAttribute('tabindex',TASKS[i].id===selected?'0':'-1');
   });
  }
  function showTask(){
   const task=TASKS.find(t=>t.id===selected),profile=Insights.profile(task),current=profile.find(d=>d.id===dimensionId);
   taskSelect.value=selected;
   document.querySelector('#ring-task-detail').innerHTML=`<p class="ring-task-id">${task.id} · ${h(categories.find(c=>c.id===task.category).name)}</p><h3>${h(task.name)}</h3><p>${h(task.goal)}</p><div class="ring-demand-detail"><span>${current.name}</span><strong>${current.value} / 3 · ${current.level}</strong><p>${h(current.reason)}</p></div><details class="ring-task-demands"><summary>All seven capability demands</summary><ul>${profile.map(d=>`<li><div><span>${d.name}</span><b>${d.value} · ${d.level}</b></div><p>${h(d.reason)}</p></li>`).join('')}</ul></details><a class="text-link" href="${Site.href('tasks',{task:task.id})}">Open ${task.id} task details ↗</a>`;
  }
  function updateMeaning(){
   const dimension=Insights.dimensions.find(d=>d.id===dimensionId),index=Insights.dimensions.indexOf(dimension);
   document.querySelectorAll('[data-capability]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.capability===dimensionId)));
   document.querySelector('#capability-description').textContent=dimension.description;
   plot.querySelector('#ring-svg-title').textContent=`Task demands for ${dimension.name}`;
   plot.querySelector('#ring-center-index').textContent=`${String(index+1).padStart(2,'0')} / 07`;
   plot.querySelector('#ring-center-line1').textContent=dimension.lines[0];plot.querySelector('#ring-center-line2').textContent=dimension.lines[1];
   Insights.waveform(dimensionId).forEach((d,i)=>{
    const label=`${d.task.id}: ${d.task.name}. ${dimension.name}: ${d.value} of 3, ${d.level}.`;
    notes[i].node.setAttribute('aria-label',label);notes[i].node.querySelector('title').textContent=label;
   });
   showTask();
  }
  function settle(){if(animation)cancelAnimationFrame(animation);animation=0;displayed=Insights.waveform(dimensionId).map(d=>d.value);draw();}
  function switchCapability(id){
   if(id===dimensionId)return;
   if(animation)cancelAnimationFrame(animation);
   animation=0;dimensionId=id;updateMeaning();
   if(reducedMotion.matches){settle();return;}
   const from=displayed.slice(),to=Insights.waveform(id).map(d=>d.value),start=performance.now();
   function frame(now){
    let complete=true;
    displayed=from.map((value,i)=>{
     const t=Math.max(0,Math.min(1,(now-start-i*9)/580));
     if(t<1)complete=false;
     // Smoothstep keeps both ends still; interruption starts at displayed values.
     const ease=t*t*(3-2*t);return value+(to[i]-value)*ease;
    });
    draw();animation=complete?0:requestAnimationFrame(frame);
   }
   animation=requestAnimationFrame(frame);
  }
  function choose(id){selected=id;showTask();draw();}
  document.querySelectorAll('[data-capability]').forEach(button=>button.addEventListener('click',()=>switchCapability(button.dataset.capability)));
  taskSelect.addEventListener('change',()=>choose(taskSelect.value));
  plot.addEventListener('click',event=>{const note=event.target.closest('[data-ring-task]');if(note)choose(note.dataset.ringTask);});
  plot.addEventListener('keydown',event=>{
   const note=event.target.closest('[data-ring-task]');if(!note)return;
   if(['Enter',' '].includes(event.key)){event.preventDefault();choose(note.dataset.ringTask);return;}
   const i=TASKS.findIndex(t=>t.id===note.dataset.ringTask);
   const next={ArrowRight:(i+1)%TASKS.length,ArrowDown:(i+1)%TASKS.length,ArrowLeft:(i+TASKS.length-1)%TASKS.length,ArrowUp:(i+TASKS.length-1)%TASKS.length,Home:0,End:TASKS.length-1}[event.key];
   if(next!==undefined){event.preventDefault();choose(TASKS[next].id);notes[next].node.focus({preventScroll:true});}
  });
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)settle();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
  updateMeaning();draw();
 }
 return {render,mount};
})();
