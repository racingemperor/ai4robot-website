/* Small, independent Home views over the shared report and task catalog. */
window.HomeInsights = (() => {
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const categories=CATEGORIES.map((c,i)=>({...c,color:['var(--chart-rust)','var(--chart-blue)','var(--chart-green)','var(--chart-purple)'][i]}));
 const pct=value=>value===null?'—':`${(value*100).toFixed(1)}%`;
 function render(){return `<section id="home-performance" class="section home-performance" aria-labelledby="home-performance-title">
  <div class="insight-heading"><div><h2 id="home-performance-title">Leading models. Four kinds of work.</h2><p>The top five models by overall category-balanced success, with their performance in each task category.</p></div><a class="text-link" id="home-leaderboard-link" href="${Site.href('leaderboard')}">Full leaderboard ↗</a></div>
  <div class="insight-toolbar"><label>Results<select id="home-result-source" aria-label="Results"><option value="official">Official results</option><option value="demo">Synthetic preview</option></select></label><label>Show<select id="home-result-metric" aria-label="Show"><option value="score">Success rate</option><option value="progress">Progress / 100</option></select></label><p id="home-chart-status" role="status"></p></div>
  <div id="home-category-chart"></div>
 </section>
 <section id="home-capabilities" class="section home-capabilities" aria-labelledby="home-capabilities-title">
  <div class="insight-heading"><div><h2 id="home-capabilities-title">A constellation of capabilities.</h2><p>One point per task. Seven directions reveal the mix of abilities each task asks for.</p></div><a class="text-link" href="${Site.href('tasks')}">Explore all tasks ↗</a></div>
  <div class="insight-toolbar atlas-toolbar"><label>Category<select id="atlas-category" aria-label="Category"><option value="all">All categories</option>${CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></label><label>Capability<select id="atlas-dimension" aria-label="Capability"><option value="all">All capabilities</option>${Insights.dimensions.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></label><div class="atlas-view-switch" role="group" aria-label="Capability map view"><button type="button" data-atlas-view="orbit" aria-pressed="true">Orbit</button><button type="button" data-atlas-view="flat" aria-pressed="false">Flat</button></div></div>
  <div class="atlas-layout"><div class="atlas-visual"><div id="atlas-plot"></div><div class="atlas-rotation" role="group" aria-label="Rotate capability map"><span>Rotate</span><button type="button" data-atlas-turn="left" aria-label="Rotate left">←</button><button type="button" data-atlas-turn="right" aria-label="Rotate right">→</button><button type="button" data-atlas-turn="up" aria-label="Rotate up">↑</button><button type="button" data-atlas-turn="down" aria-label="Rotate down">↓</button><button type="button" id="atlas-reset">Reset</button></div><div class="atlas-mobile-dimensions" aria-label="Capability direction key">${Insights.dimensions.map((d,i)=>`<span><b>${i+1}</b>${d.short}</span>`).join('')}</div><div class="atlas-legend">${categories.map(c=>`<span><i class="atlas-key key-${c.id}" style="--series-color:${c.color}" aria-hidden="true"></i>${c.name}</span>`).join('')}</div><p class="insight-note">Drag the orbit or use the rotation buttons. Select a point to inspect its task. Flat view keeps all seven directions in one plane.</p></div>
   <aside class="atlas-task-panel" aria-label="Selected task capabilities"><label>Inspect a task<select id="atlas-task" aria-label="Inspect a task"></select></label><div id="atlas-task-detail" aria-live="polite"></div></aside></div>
  <details class="atlas-method"><summary>How to read the capability map</summary><p>Each task has three capability descriptions in the catalog. These are manually assigned to one or more of the seven dimensions. A task’s vector counts how many descriptions mention each dimension; its point is the weighted average of those dimension anchors. Orbit is an illustrative 3D projection; Flat uses a radial 2D projection. Nearby points have similar projected mixes, but projection can hide differences. Position is neither difficulty nor model performance. Overlapping markers are separated slightly for selection.</p><div class="table-scroll" role="region" tabindex="0" aria-label="All task capability annotations; horizontally scrollable"><table class="atlas-annotation-table"><caption>Full task annotations · Counts out of three capability descriptions · No measured weights</caption><thead><tr><th scope="col">Task</th>${Insights.dimensions.map(d=>`<th scope="col">${d.name}</th>`).join('')}</tr></thead><tbody>${TASKS.map(t=>`<tr><th scope="row"><a href="${Site.href('tasks',{task:t.id})}">${t.id} · ${h(t.name)}</a></th>${Insights.profile(t).counts.map(v=>`<td>${v||'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>
 </section>`;}
 function mount(){
  const source=document.querySelector('#home-result-source');
  if(!source)return;
  const metric=document.querySelector('#home-result-metric');
  let imported=null,synthetic=false;
  try{
   const saved=sessionStorage.getItem('ai4robot-imported-report-v1');
   if(saved&&saved.length<=5*1024*1024){const raw=JSON.parse(saved);imported=Results.validate(raw.report||raw);synthetic=raw.synthetic===true||raw.website_data_source==='demo';}
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
    return `<figure><figcaption><strong>${c.name}</strong><span>${c.count} tasks · ${progress?'Progress / 100':'Success rate'}</span></figcaption><svg class="category-bar-chart" viewBox="0 0 270 260" role="img" aria-label="${h(c.name)}: ${empty?'five model positions awaiting results':`${label}; ${progress?'progress':'success rate'} for the top ${rows.length} models`}">
     ${[0,50,100].map(t=>`<line x1="35" x2="265" y1="${baseline-t*scale}" y2="${baseline-t*scale}" class="chart-grid"/><text x="29" y="${baseline-t*scale+4}" text-anchor="end" class="chart-axis">${t}</text>`).join('')}
     ${models.map((m,i)=>{const value=m.categories[ci]?.value??null,x=start+i*(barWidth+gap),height=value===null?0:value*100*scale;return `<g><title>${h(m.name)}: ${value===null?'Awaiting results':progress?(value*100).toFixed(1)+' / 100':pct(value)}</title>${value===null?`<rect x="${x}" y="43" width="${barWidth}" height="180" rx="5" class="chart-empty-bar"/><text x="${x+barWidth/2}" y="130" text-anchor="middle" class="chart-value">—</text>`:`<rect x="${x}" y="${baseline-height}" width="${barWidth}" height="${height}" rx="4" fill="var(--model-${i})"/><text x="${x+barWidth/2}" y="${baseline-height-9}" text-anchor="middle" class="chart-value">${(value*100).toFixed(1)}</text>`}<text x="${x+barWidth/2}" y="246" text-anchor="middle" class="chart-model-key">${String.fromCharCode(65+i)}</text></g>`;}).join('')}</svg></figure>`;
   }).join('')}</div><p class="insight-note">${empty?'Five model series are reserved. No rankings or scores have been published. Choose Synthetic preview to inspect the chart layout.':`Models are selected by overall balanced success; the same five appear in every category. Each category averages its task ${progress?'progress':'success rates'} equally. ${source.value==='demo'?'All values are synthetic examples and make no claim about real models.':source.value==='imported'?'Local imports have not been reviewed.':''}`}</p>
    ${empty?'':`<details class="home-chart-table"><summary>View chart values</summary><p class="insight-note">${h(report.benchmark_version)} · ${h(report.protocol)} · ${label}</p><div class="table-scroll" role="region" tabindex="0" aria-label="Model category results; horizontally scrollable"><table class="atlas-annotation-table"><caption>${label} · ${progress?'Progress / 100':'Success rate'} · Complete catalog coverage</caption><thead><tr><th scope="col">Model / agent</th><th scope="col">Overall success</th>${CATEGORIES.map(c=>`<th scope="col">${c.name}</th>`).join('')}</tr></thead><tbody>${rows.map(m=>`<tr><th scope="row">${h(m.name)}<small>${h(m.version)} · ${h(m.agent)}</small></th><td>${pct(m.score)}</td>${m.categories.map(c=>`<td>${progress?(c.value*100).toFixed(1):pct(c.value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`}`;
  }
  source.addEventListener('change',drawChart);metric.addEventListener('change',drawChart);drawChart();
  mountAtlas();
 }
 function mountAtlas(){
  const plot=document.querySelector('#atlas-plot'),category=document.querySelector('#atlas-category'),dimension=document.querySelector('#atlas-dimension'),taskSelect=document.querySelector('#atlas-task');
  let selected='T06',view='orbit',yaw=-.22,pitch=.12,drag=null,pending=0;
  const visibleTasks=()=>TASKS.filter(t=>(category.value==='all'||t.category===category.value)&&(dimension.value==='all'||Insights.profile(t).counts[Insights.dimensions.findIndex(d=>d.id===dimension.value)]>0));
  function showTask(){
   const task=TASKS.find(t=>t.id===selected),detail=document.querySelector('#atlas-task-detail');
   if(!task){detail.innerHTML='<p>No task matches both filters. Choose another category or capability.</p>';return;}
   const profile=Insights.profile(task),cat=categories.find(c=>c.id===task.category);
   detail.innerHTML=`<p class="atlas-task-category"><i class="atlas-key key-${cat.id}" style="--series-color:${cat.color}" aria-hidden="true"></i>${task.id} · ${cat.name}</p><h3>${h(task.name)}</h3><p>${h(task.goal)}</p><h4>Capability mix</h4><ul class="capability-mix">${Insights.dimensions.map((d,i)=>`<li><span>${d.name}</span><span class="capability-count" aria-label="${profile.counts[i]} of 3 capability descriptions"><i style="--capability-count:${profile.counts[i]}" aria-hidden="true"></i><b>${profile.counts[i]}/3</b></span></li>`).join('')}</ul><h4>What this task asks for</h4><ul class="atlas-requirements">${profile.tags.map(tag=>`<li><strong>${h(tag.name)}</strong><span>${h(tag.description)}</span></li>`).join('')}</ul><a class="text-link" href="${Site.href('tasks',{task:task.id})}">Open ${task.id} task details ↗</a>`;
  }
  function screen(point){const p=view==='flat'?point:Insights.project(point,yaw,pitch);return {x:380+p[0]*215,y:280+p[1]*215,z:p[2]};}
  function mark(task,x,y){
   if(task.category==='navigation')return `<path d="M${x} ${y-8}l8 8-8 8-8-8Z"/>`;
   if(task.category==='training')return `<rect x="${x-7}" y="${y-7}" width="14" height="14" rx="2"/>`;
   if(task.category==='construction')return `<path d="M${x} ${y-9}l9 16h-18Z"/>`;
   return `<circle cx="${x}" cy="${y}" r="7"/>`;
  }
  function drawPlot(){
   const tasks=visibleTasks(),flat=view==='flat';
   const nodes=tasks.map(t=>({task:t,...screen(Insights.position(t,flat))}));
   // Separate coincident/nearby markers for touch selection, retaining leader lines.
   nodes.forEach(n=>{n.originalX=n.x;n.originalY=n.y;});
   for(let pass=0;pass<30;pass++)for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
    const a=nodes[i],b=nodes[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
    if(d<44){const angle=d<.001?(i+j)*2.399:Math.atan2(dy,dx),shift=(44-d)/2+.05;const x=Math.cos(angle)*shift,y=Math.sin(angle)*shift;a.x-=x;a.y-=y;b.x+=x;b.y+=y;}
   }
   const active=nodes.find(n=>n.task.id===selected);
   const axes=Insights.dimensions.map((d,i)=>({dimension:d,...screen(Insights.anchor(i,flat))}));
   const grid=flat?`<circle cx="380" cy="280" r="215"/><circle cx="380" cy="280" r="143"/><circle cx="380" cy="280" r="72"/>`:[0,1,2].map(plane=>{
    const pts=Array.from({length:97},(_,i)=>{const a=i*2*Math.PI/96,p=plane===0?[Math.cos(a),Math.sin(a),0]:plane===1?[Math.cos(a),0,Math.sin(a)]:[0,Math.cos(a),Math.sin(a)];return screen(p);});
    return `<path d="M${pts.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join('L')}"/>`;
   }).join('');
   plot.innerHTML=`<svg class="capability-plot" viewBox="0 0 760 560" tabindex="0" aria-label="Task capability ${flat?'flat map':'orbit'}. Use arrow keys to rotate in orbit view. Select tasks using the task menu or labeled points."><title>22 tasks across seven capability directions</title><g class="atlas-grid" fill="none">${grid}</g><g class="atlas-axis-lines">${axes.map(a=>`<line x1="380" y1="280" x2="${a.x}" y2="${a.y}"/>`).join('')}</g><g class="atlas-axis-labels">${axes.map((a,i)=>{const dx=a.x-380,dy=a.y-280,length=Math.hypot(dx,dy)||1,x=a.x+dx/length*25,y=a.y+dy/length*22;return `<text x="${x}" y="${y}" text-anchor="${dx>35?'start':dx<-35?'end':'middle'}" dominant-baseline="middle" class="atlas-axis-name ${dimension.value===a.dimension.id?'is-highlighted':''}">${a.dimension.short}</text><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="atlas-axis-number">${i+1}</text>`;}).join('')}</g>
    ${active?`<g class="atlas-selected-directions">${axes.filter((a,i)=>Insights.profile(active.task).counts[i]>0).map(a=>`<line x1="${active.originalX}" y1="${active.originalY}" x2="${a.x}" y2="${a.y}"/>`).join('')}</g>`:''}<g class="atlas-leaders">${nodes.filter(n=>Math.hypot(n.x-n.originalX,n.y-n.originalY)>5).map(n=>`<line x1="${n.originalX}" y1="${n.originalY}" x2="${n.x}" y2="${n.y}"/>`).join('')}</g>
    ${nodes.sort((a,b)=>a.z-b.z).map(n=>{const c=categories.find(c=>c.id===n.task.category);return `<g class="atlas-point ${n.task.id===selected?'is-selected':''}" role="button" tabindex="0" data-atlas-task="${n.task.id}" aria-pressed="${n.task.id===selected}" aria-label="${h(n.task.id+': '+n.task.name)}" style="--series-color:${c.color}"><title>${h(n.task.id+' · '+n.task.name+' · '+c.name)}</title><circle class="atlas-point-target" cx="${n.x}" cy="${n.y}" r="22"/>${n.task.id===selected?`<circle class="atlas-selected-ring" cx="${n.x}" cy="${n.y}" r="16"/>`:''}<g class="atlas-marker">${mark(n.task,n.x,n.y)}</g><text x="${n.x+13}" y="${n.y-11}" class="atlas-point-label">${n.task.id}</text></g>`;}).join('')}
    <text x="24" y="537" class="atlas-plot-count">${tasks.length} / 22 tasks · ${flat?'Radial projection':'Capability orbit'}</text></svg>`;
   document.querySelectorAll('[data-atlas-turn]').forEach(b=>b.disabled=flat);
   document.querySelectorAll('[data-atlas-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasView===view)));
  }
  function refresh(){
   const tasks=visibleTasks();if(!tasks.some(t=>t.id===selected))selected=tasks[0]?.id||'';
   taskSelect.innerHTML=tasks.length?tasks.map(t=>`<option value="${t.id}">${t.id} · ${h(t.name)}</option>`).join(''):'<option value="">No matching tasks</option>';
   taskSelect.disabled=!tasks.length;taskSelect.value=selected;showTask();drawPlot();
  }
  function choose(id){selected=id;taskSelect.value=id;showTask();drawPlot();plot.querySelector(`[data-atlas-task="${id}"]`)?.focus({preventScroll:true});}
  function turn(direction){
   if(view==='flat')return;
   if(direction==='left')yaw-=.16;if(direction==='right')yaw+=.16;if(direction==='up')pitch=Math.max(-.8,pitch-.12);if(direction==='down')pitch=Math.min(.8,pitch+.12);drawPlot();
  }
  category.addEventListener('change',refresh);dimension.addEventListener('change',refresh);
  taskSelect.addEventListener('change',()=>{selected=taskSelect.value;showTask();drawPlot();});
  plot.addEventListener('click',event=>{const point=event.target.closest('[data-atlas-task]');if(point)choose(point.dataset.atlasTask);});
  plot.addEventListener('keydown',event=>{
   const point=event.target.closest('[data-atlas-task]');
   if(point&&['Enter',' '].includes(event.key)){event.preventDefault();choose(point.dataset.atlasTask);return;}
   const direction={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[event.key];
   if(direction&&view==='orbit'){event.preventDefault();turn(direction);plot.querySelector('svg')?.focus({preventScroll:true});}
  });
  document.querySelectorAll('[data-atlas-turn]').forEach(b=>b.addEventListener('click',()=>turn(b.dataset.atlasTurn)));
  document.querySelectorAll('[data-atlas-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.atlasView;drawPlot();}));
  document.querySelector('#atlas-reset').addEventListener('click',()=>{yaw=-.22;pitch=.12;drawPlot();});
  plot.addEventListener('pointerdown',event=>{
   if(view==='flat'||event.button!==0||event.target.closest('[data-atlas-task]'))return;
   drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch};plot.setPointerCapture(event.pointerId);
  });
  plot.addEventListener('pointermove',event=>{
   if(!drag||drag.id!==event.pointerId)return;
   yaw=drag.yaw+(event.clientX-drag.x)/180;pitch=Math.max(-.8,Math.min(.8,drag.pitch+(event.clientY-drag.y)/220));
   if(!pending)pending=requestAnimationFrame(()=>{pending=0;drawPlot();});
  });
  const endDrag=()=>{drag=null;};plot.addEventListener('pointerup',endDrag);plot.addEventListener('pointercancel',endDrag);plot.addEventListener('lostpointercapture',endDrag);
  refresh();
 }
 return {render,mount};
})();
