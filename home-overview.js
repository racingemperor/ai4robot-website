/* Home's research introduction and compact Overall board share the full report contract. */
window.HomeOverview = (() => {
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function introduction(){return `<section id="overview" class="home-paper-info" aria-labelledby="home-paper-title">
  <h2 id="home-paper-title">Embodied Generalist Exam</h2>
  <dl class="home-paper-meta" aria-label="Paper information">
   <div><dt>Authors</dt><dd class="home-metadata-pending">Author list to be announced</dd></div>
   <div><dt>Affiliations</dt><dd class="home-affiliations-pending">Institution logos and affiliations to be announced</dd></div>
   <div><dt>Published</dt><dd>Research preview · Paper forthcoming</dd></div>
   <div><dt>Report</dt><dd><a href="${Site.href('report')}">Read the research overview ↗</a></dd></div>
   <div><dt>Repository</dt><dd><a href="${RESEARCH_REPO}" target="_blank" rel="noopener">ALEXander22568 / AI4Robot ↗</a></dd></div>
   <div><dt>Leaderboard</dt><dd><a href="${Site.href('leaderboard')}">View the full leaderboard ↗</a></dd></div>
   <div class="home-paper-contact"><dt>Contact</dt><dd class="home-metadata-pending">Contact information forthcoming</dd></div>
  </dl>
 </section>
 <section id="home-news" class="home-news section" aria-labelledby="home-news-title"><h2 id="home-news-title">News</h2>
  <div class="home-news-list" role="region" aria-label="Project updates" tabindex="0"><ul>
   <li><time datetime="2026-10-27">Oct 27 <span>2026</span></time><p>Explore the five manuscript categories and all 22 tasks in the new <a href="${Site.href('leaderboard')}">interactive leaderboard</a>. Reviewed model results are forthcoming.</p></li>
   <li><time datetime="2026-10-27">Oct 27 <span>2026</span></time><p><a href="${Site.href('contribute')}">Contribution guidelines</a> are available for model evaluations, agent harnesses, task proposals and reproducible evidence.</p></li>
  </ul></div>
 </section>
 <section id="benchmark-video" class="home-overview-film" aria-label="Benchmark overview video">${Evidence.slot('VIDEO','Embodied Generalist Exam · Overview','Reserved for an overview assembled from the task demonstrations','home-film-slot')}</section>
 <section id="benchmark-introduction" class="section home-introduction" aria-labelledby="home-introduction-title"><h2 id="home-introduction-title">Beyond the digital world</h2><div class="home-introduction-copy">
  <p>The <strong>Embodied Generalist Exam (EGE)</strong> evaluates what general-purpose foundation models can do in the physical world. Its <strong>22 tasks</strong> span five categories: robotic manipulation, navigation, scene generation, scene and interaction reconstruction, and policy development. Each task pairs a concrete objective with an executable environment, an interaction interface and an independent evaluator.</p>
  <p>Models may reason, use tools, write control programs, construct artifacts or develop robot policies under task-specific constraints. The evaluated foundation model remains unchanged. Repeated trials and explicit success criteria are designed to reveal both capability and reliability, with video, observations, model responses and submitted code connected to the same episode.</p>
 </div></section>`;}
 function shell(){return `<section id="home-overall" class="section home-overall" aria-labelledby="home-overall-title">
  <div class="home-overall-heading"><div><h2 id="home-overall-title">Overall leaderboard</h2><p>One success rate across the five manuscript task categories.</p></div><a class="text-link" id="home-overall-link" href="${Site.href('leaderboard')}">Full leaderboard ↗</a></div>
  <div class="home-overall-panel"><div class="home-overall-toolbar"><label>Results<select id="home-overall-source"><option value="official">Official results</option><option value="demo">Synthetic preview</option></select></label><p id="home-overall-status" role="status" aria-live="polite"></p></div><div id="home-overall-chart"></div></div>
  <p class="home-overall-note">Overall averages task success rates within each category, then weights the five categories equally. A rank requires all 22 tasks; a dash means no complete result.</p>
 </section>`;}
 function board(report,source='official',synthetic=false){
  const rows=Results.summarize(report,TASKS.map(t=>t.id));
  rows.sort((a,b)=>Number(b.complete)-Number(a.complete)||(b.score??-1)-(a.score??-1)||a.id.localeCompare(b.id));
  const models=source==='official'&&!rows.length?Leaderboard.roster:rows;
  let rank=0,previous;
  const data=source==='official'?null:source;
  const links={data,category:null,group:null,robot:null,track:null,section:null};
  const provenance=source==='demo'||synthetic?'Synthetic preview · Not measured':source==='imported'?'Local report · Unreviewed':'Official results · Awaiting evaluation';
  return `<div class="home-rank-axis" aria-hidden="true"><span></span><span class="home-rank-ticks">${[0,25,50,75,100].map(n=>`<i style="left:${n}%">${n}%</i>`).join('')}</span><span>22 tasks</span></div><div class="home-rank-rows" aria-label="${h(provenance)} · Overall success rates">${models.map((model,index)=>{
   const value=model.complete?model.score:null;
   if(value!==null){if(previous!==value)rank=index+1;previous=value;}
   const score=value===null?'—':`${(value*100).toFixed(1)}%`;
   const coverage=model.complete?'22 / 22':model.scheduled?'Pending':`${model.coverage} / 22`;
   const mark=model.mark||model.name.trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
   return `<a class="home-rank-row${value===null?' is-pending':''}" href="${h(Site.href('leaderboard',{...links,model:model.id,detail:1}))}" data-overall-model="${h(model.id)}" aria-label="${h(model.name)} · ${h(provenance)} · ${value===null?'Unranked, awaiting complete results':`Rank ${rank}, Overall success ${score}`} · Open model results" style="--model-color:${Leaderboard.colorFor(model)}">
    <span class="home-rank-number">${value===null?'—':rank}</span><span class="home-rank-mark" aria-hidden="true">${h(mark)}</span><span class="home-rank-name"><strong>${h(model.name)}</strong><span>${h(model.agent)}</span></span>
    <span class="home-rank-track" aria-hidden="true">${value===null?'':`<span style="width:${value*100}%"></span>`}</span><span class="home-rank-value"><strong>${score}</strong><small>${coverage}</small></span>
   </a>`;
  }).join('')||'<p class="home-rank-empty">No models in this report. Import a report from the full leaderboard.</p>'}</div>`;
 }
 function mount(){
  const source=document.querySelector('#home-result-source'),select=document.querySelector('#home-overall-source');
  if(!source||!select)return;
  let saved=null;try{saved=Results.readSaved(sessionStorage);}catch{/* Storage is optional. */}
  if(saved)select.insertAdjacentHTML('beforeend','<option value="imported">Local report · unreviewed</option>');
  function draw(){
   select.value=source.value;
   const report=source.value==='demo'?Results.demo:source.value==='imported'&&saved?saved.report:Results.official;
   document.querySelector('#home-overall-chart').innerHTML=board(report,source.value,!!saved?.synthetic&&source.value==='imported');
   document.querySelector('#home-overall-status').textContent=source.value==='demo'?'Synthetic preview · Not measured':source.value==='imported'?`Local report · ${saved?.synthetic?'Synthetic · ':''}Unreviewed`:'Official results · Awaiting evaluation';
   document.querySelector('#home-overall-link').href=Site.href('leaderboard',{data:source.value==='official'?null:source.value,category:null,group:null,robot:null,track:null});
  }
  select.addEventListener('change',()=>{source.value=select.value;source.dispatchEvent(new Event('change'));});
  source.addEventListener('change',draw);draw();
 }
 return {introduction,shell,board,mount};
})();
