/* Home's research introduction and compact Overall board share the full report contract. */
window.HomeOverview = (() => {
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function introduction(){return `<section id="overview" class="home-paper-info" aria-labelledby="home-paper-title">
  <h2 id="home-paper-title">Embodied Generalist Exam</h2>
  <dl class="home-paper-meta" aria-label="Paper information">
   <div><dt>Report</dt><dd><a href="${Site.href('report')}">Publications &amp; updates ↗</a></dd></div>
   <div><dt>Repository</dt><dd><a href="${RESEARCH_REPO}" target="_blank" rel="noopener">ALEXander22568 / AI4Robot ↗</a></dd></div>
   <div><dt>Leaderboard</dt><dd><a href="${Site.href('leaderboard')}">View the full leaderboard ↗</a></dd></div>
  </dl>
 </section>
 <section id="home-news" class="home-news section" aria-labelledby="home-news-title"><h2 id="home-news-title">News</h2>
  <div class="home-news-list" role="region" aria-label="Project updates" tabindex="0"><ul>
   <li><time datetime="2026-10-28">Oct 28 <span>2026</span></time><p>The updated manuscript defines <strong>23 tasks in six categories</strong>, including training data collection and in-context learning. Explore the <a href="${Site.href('leaderboard')}">interactive leaderboard</a>.</p></li>
   <li><time datetime="2026-10-27">Oct 27 <span>2026</span></time><p><a href="${Site.href('contribute')}">Contribution guidelines</a> are available for model evaluations, agent harnesses, task proposals and reproducible evidence.</p></li>
  </ul></div>
 </section>
 <section id="benchmark-video" class="home-overview-film" aria-label="Benchmark overview video">${Evidence.slot('VIDEO','Embodied Generalist Exam · Overview','','home-film-slot')}</section>
 <section id="benchmark-introduction" class="section home-introduction" aria-labelledby="home-introduction-title"><h2 id="home-introduction-title">Beyond the digital world</h2><div class="home-introduction-copy">
  <p>The <strong>Embodied Generalist Exam (EGE)</strong> evaluates the breadth of foundation models’ embodied capabilities beyond robot control. Its <strong>23 tasks</strong> span six categories: robotic manipulation, navigation, scene generation and interaction reconstruction, policy development and training, training data collection, and in-context learning. The tasks cover five classes of robot embodiments: robotic arms, dexterous hands, mobile robots, quadrupeds and humanoids.</p>
  <p>Built with <strong>NVIDIA Isaac Sim 5.1 and Isaac Lab</strong>, each task combines an instruction, an executable environment, available observations and tools, interaction constraints and independent success criteria. Eight foundation models use their corresponding agent harnesses without task-specific fine-tuning, under matched initial conditions and resource budgets. The protocol specifies <strong>three independent trials per task and model</strong>, including failures and timeouts, and reports average task scores, full-process wall-clock time and token consumption.</p>
 </div></section>`;}
 function shell(){return `<section id="home-overall" class="section home-overall" aria-labelledby="home-overall-title">
  <div class="home-overall-heading"><div><h2 id="home-overall-title">Overall leaderboard</h2></div><a class="text-link" id="home-overall-link" href="${Site.href('leaderboard')}">Full leaderboard ↗</a></div>
  <div class="home-overall-panel"><div id="home-overall-chart"></div></div>
 </section>`;}
 function board(report,source='official'){
  const rows=Results.summarize(report,TASKS.map(t=>t.id));
  rows.sort((a,b)=>Number(b.complete)-Number(a.complete)||(b.score??-1)-(a.score??-1)||a.id.localeCompare(b.id));
  const models=source==='official'&&!rows.length?Leaderboard.roster:rows;
  let rank=0,previous;
  const data=source;
  const links={data,category:null,group:null,robot:null,track:null,section:null};
  return `<div class="home-rank-axis" aria-hidden="true"><span></span><span class="home-rank-ticks">${[0,25,50,75,100].map(n=>`<i style="left:${n}%">${n}</i>`).join('')}</span><span>${TASKS.length} tasks</span></div><div class="home-rank-rows" aria-label="Overall scores">${models.map((model,index)=>{
   const value=model.score;
   const ranked=model.complete&&value!==null;
   if(ranked){if(previous!==value)rank=index+1;previous=value;}
   const score=value===null?'—':(value*100).toFixed(1);
   const coverage=`${model.complete?TASKS.length:model.scheduled?0:model.coverage} / ${TASKS.length}`;
   return `<a class="home-rank-row${value===null?' is-pending':''}" href="${h(Site.href('leaderboard',{...links,model:model.id,detail:1}))}" data-overall-model="${h(model.id)}" aria-label="${h(model.name)} · ${ranked?`Rank ${rank}`:'Unranked'}, Overall score ${score} · Open model results" style="--model-color:${Leaderboard.colorFor(model)}">
    <span class="home-rank-number">${ranked?rank:'—'}</span><span class="home-rank-logo">${Results.logo(model)}</span><span class="home-rank-name"><strong>${h(model.name)}</strong><span>${h(model.agent)}</span></span>
    <span class="home-rank-track" aria-hidden="true">${value===null?'':`<span style="width:${value*100}%"></span>`}</span><span class="home-rank-value"><strong>${score}</strong><small>${coverage}</small></span>
   </a>`;
  }).join('')||'<p class="home-rank-empty">No models in this report.</p>'}</div>`;
 }
 function citation(){
  const bibtex=`@misc{embodiedgeneralistexam2026,
  title = {Embodied Generalist Exam},
  year = {2026},
  howpublished = {GitHub repository},
  url = {${RESEARCH_REPO}}
}`;
  return `<section id="citation" class="section home-citation" aria-labelledby="home-citation-title"><h2 id="home-citation-title">Citation</h2><div class="home-citation-card"><button type="button" class="home-citation-copy" aria-label="Copy BibTeX" title="Copy BibTeX"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg><span>Copy</span></button><pre class="home-citation-code" tabindex="0" aria-label="BibTeX citation"><code>${h(bibtex)}</code></pre></div><p class="sr-only" id="home-citation-status" role="status" aria-live="polite"></p></section>`;
 }
 function mountCitation(){
  const button=document.querySelector('.home-citation-copy');
  if(!button)return;
  const code=document.querySelector('.home-citation-code');
  const status=document.querySelector('#home-citation-status');
  let timer;
  button.addEventListener('click',async()=>{
   if(button.getAttribute('aria-busy')==='true')return;
   clearTimeout(timer);button.setAttribute('aria-busy','true');
   try{
    await navigator.clipboard.writeText(code.textContent.trim());
    button.querySelector('span').textContent='Copied';button.setAttribute('aria-label','BibTeX copied');
    status.className='sr-only';status.textContent='Citation copied to clipboard.';
    timer=setTimeout(()=>{button.querySelector('span').textContent='Copy';button.setAttribute('aria-label','Copy BibTeX');status.textContent='';},2500);
   }catch{
    button.querySelector('span').textContent='Copy';button.setAttribute('aria-label','Copy BibTeX');
    status.className='home-citation-status';status.textContent='Select the citation text and copy it manually.';
    const range=document.createRange();range.selectNodeContents(code);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);code.focus();
   }finally{button.removeAttribute('aria-busy');}
  });
 }
 function mount(){
  mountCitation();
  const host=document.querySelector('#home-overall-chart');
  if(!host)return;
  const initial=new URLSearchParams(location.search).get('data');
  const source=Results.sourceFor(initial);
  const report=Results[source];
  host.innerHTML=board(report,source);
  const url=new URL(location.href);
  url.searchParams.set('data',source);
  history.replaceState({},'',url);Site.refreshLinks();
  document.querySelector('#home-overall-link').href=Site.href('leaderboard',{data:source,category:null,group:null,robot:null,track:null});
 }

 return {introduction,shell,citation,board,mount};
})();
