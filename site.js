/* Each URL owns one page. Shared navigation and task dossiers. */
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const tracks={A:{name:'Execute a program',en:'CONTROL',output:'Control program',count:17},B:{name:'Train a policy',en:'TRAIN',output:'Code + weights',count:2},C:{name:'Build an artifact',en:'BUILD',output:'Scene / motion files',count:3},D:{name:'Collect training data',en:'COLLECT',output:'Trajectory dataset',count:1}};
const task=id=>TASKS.find(t=>t.id===id);
const group=id=>GROUPS.find(g=>g.id===id);
const category=id=>CATEGORIES.find(c=>c.id===id);
const arrow='<span aria-hidden="true">↗</span>';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RESEARCH_REPO='https://github.com/ALEXander22568/AI4Robot';
const RESEARCH_NOTES='https://app.notion.com/p/gpt-robotllm-as-policy-benchmark-3f3238c5ee428004a459fc5962a8af85';
window.Site=(()=>{
 const pages={
  home:['index.html','Home','AI4Robot','Code meets the physical world.','LLM EMBODIMENT BENCHMARK'],
  tasks:['tasks.html','Task','Inside each task.','Explore 23 tasks across six embodied categories, with model performance, recordings, inputs, outputs and submitted artifacts in one place.','THE TASK COLLECTION'],
  leaderboard:['leaderboard.html','Leaderboard','Leaderboard','Compare eight foundation models across six task categories and 23 tasks. Overall gives each category equal weight. Select a model to inspect its results.','MODEL PERFORMANCE'],
  report:['report.html','Report','Report','The Embodied Generalist Exam research paper.','RESEARCH PAPER'],
  contribute:['contribute.html','Contribute','Contribute','Bring a new task, method or model to the Embodied Generalist Exam.','CONTRIBUTE'],
  community:['community.html','Community','Community','Connect with the Embodied Generalist Exam team and community.','COMMUNITY']
 };
 const page=document.body.dataset.page,resultPages=['tasks','leaderboard'];
 function href(id,overrides={}){
  const original=id;
  const aliases={episodes:'tasks',documents:'report',compare:'leaderboard',matrix:'leaderboard',method:'report',run:'report',about:'report'};
  id=aliases[id]||id;
  const current=new URLSearchParams(location.search),p=new URLSearchParams();
  if(['home','tasks','leaderboard'].includes(id)){
   if(current.has('data'))p.set('data',current.get('data'));
   if(resultPages.includes(id))for(const key of ['category','group','robot','track'])if(current.has(key))p.set(key,current.get(key));
  }
  for(const [key,value]of Object.entries(overrides))if(value===null||value===undefined||value==='')p.delete(key);else p.set(key,String(value));
  if(original==='episodes'){
   const taskId=p.get('episodeTask')||p.get('task')||'T06';
   p.set('task',taskId);p.delete('episodeTask');
   for(const key of ['category','group','robot','track'])p.delete(key);
  }
  p.delete('section');
  return pages[id][0]+(p.size?'?'+p:'');
 }
 const canonical=new URL(location.href);
 if(page==='tasks'&&canonical.searchParams.get('section')==='matrix'){
  canonical.pathname=canonical.pathname.replace(/tasks\.html$/,'leaderboard.html');canonical.searchParams.delete('section');canonical.hash='';location.replace(canonical.href);
 }else if(canonical.searchParams.has('section')||canonical.searchParams.has('episodeTask')){
  if(page==='tasks'&&canonical.searchParams.get('section')==='episodes'&&!canonical.searchParams.has('task')&&!canonical.searchParams.has('episode'))canonical.searchParams.set('task',canonical.searchParams.get('episodeTask')||'T06');
  if(page==='tasks'&&/^T\d{2}$/.test(canonical.searchParams.get('episodeTask')||''))canonical.searchParams.set('task',canonical.searchParams.get('episodeTask'));
  canonical.searchParams.delete('section');canonical.searchParams.delete('episodeTask');
  if(page==='report')canonical.search='';
  history.replaceState({},'',canonical);
 }
 function link(id,label){return `<a data-site-page="${id}" href="${esc(href(id))}" ${page===id?'aria-current="page"':''}>${label||({method:'Method',run:'Run',about:'Resources'})[id]||pages[id][1]}</a>`;}
 function refreshLinks(){$$('[data-site-page]').forEach(a=>a.href=href(a.dataset.sitePage));}
 const legacy=new URLSearchParams(location.search),old={board:'leaderboard',compare:'compare',matrix:'matrix',episodes:'episodes',run:'run',about:'about'};
 if(page==='home'&&Object.hasOwn(old,legacy.get('lab'))){const target=old[legacy.get('lab')];legacy.delete('lab');legacy.delete('variant');location.replace(href(target,Object.fromEntries(legacy))+location.hash);}
 const nav=['home','tasks','leaderboard','report','contribute'];
 $('#app').innerHTML=`<header class="site-header"><span class="brand">Embodied Generalist Exam</span><nav class="header-resource-links" aria-label="Project links"><a href="${RESEARCH_REPO}" target="_blank" rel="noopener" aria-label="Code on GitHub"><img class="header-github-icon" src="assets/icons/github.svg" width="16" height="16" alt="">Code</a><span class="dataset-link" role="link" aria-disabled="true"><img src="assets/icons/huggingface.svg" width="16" height="16" alt="">Datasets</span>${link('community')}</nav><button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu <span aria-hidden="true">☰</span></button><nav id="primary-nav" aria-label="Primary navigation">${nav.map(id=>link(id)).join('')}</nav><button type="button" class="theme-toggle" aria-label="Switch to dark theme" aria-pressed="false"><svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg><svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg></button></header><main id="main" tabindex="-1">${page==='home'?'':`<div class="page-heading"><div class="page-heading-meta"><span>${pages[page][4]}</span><span>AI4ROBOT / ${page.toUpperCase()}</span></div><h1>${pages[page][2]}</h1><p>${pages[page][3]}</p></div>`}<div id="page-content"></div></main><footer class="site-footer"><div><span class="brand">AI for Robots</span><p>Embodied Generalist Exam · Beyond robot control.</p></div><div class="footer-right"><div class="footer-links">${['tasks','leaderboard','report','contribute','community'].map(id=>link(id)).join('')}<a href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository ↗</a></div><span>EMBODIED GENERALIST EXAM · 2026</span><p>23 tasks · 6 categories · 8 models</p></div></footer>`;
 window.Theme.mount($('.theme-toggle'));
 window.addEventListener('popstate',refreshLinks);
 const navEl=$('#primary-nav'),toggle=$('.nav-toggle');
 const close=()=>{navEl.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');};
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));navEl.classList.toggle('is-open',open);});
 navEl.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 $('.site-header').addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
 function news(id){return `<section id="${id}" class="project-news" aria-labelledby="${id}-title"><h2 id="${id}-title">News</h2><div class="project-news-list"><ul><li><time datetime="2026-10-28">Oct 28, 2026</time><p>The EGE task collection now follows the updated manuscript: 23 tasks, six categories and five classes of robot embodiments.</p></li><li><time datetime="2026-10-27">Oct 27, 2026</time><p>Open a task in a model’s results to inspect its video, inputs, outputs and code on one timeline.</p></li></ul></div></section>`;}
 return {href,refreshLinks,page,news};
})();
function showDialog(html){$('#dialog-content').innerHTML=`<button class="dialog-close" data-action="close-dialog" aria-label="Close dialog">×</button>${html}`;$('#dossier').showModal();}
function showTask(id){const t=task(id);showDialog(`<p class="eyebrow">${t.id} / TASK DOSSIER</p><h2 id="dialog-title">${t.name}</h2><p class="dialog-subtitle">${category(t.category).name} · ${t.robot} · ${tracks[t.track].output}</p><div class="dossier-grid"><div><h3>The goal</h3><p>${t.goal}</p><h3>Evidence to capture</h3><p>${t.video}</p><h3>What the viewer should verify</h3><p>${t.proof}</p></div><div class="shot-sheet"><span class="mono">SHOT LIST / ${t.id}</span>${t.beats.map((b,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${b}</strong></div>`).join('')}<p>Target edit: 12–25 seconds. Keep the full episode and all original camera streams. Label success, failure and incomplete outcomes from the actual judgment.</p></div></div><div class="task-crosslinks"><a href="${Site.href('episodes',{episodeTask:t.id})}">Episode evidence ↗</a><a href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research code ↗</a></div><p class="source-path">Task specification and filming plan · Research snapshot: October 23, 2026</p>`);}
function showProtocol(){showDialog(`<p class="eyebrow">EVALUATION PROTOCOL</p><h2 id="dialog-title">Separate the agent from the judge.</h2><div class="protocol-notes"><article><h3>Two evaluation routes</h3><p>A coding agent can submit a control program. In the direct-policy route, the model repeatedly reads observations and issues a bounded action. Results from the two routes require distinct protocol labels.</p></article><article><h3>Visible inputs</h3><p>The current ARX direct-policy harness supplies RGB, measured body state and camera calibration. It withholds depth, object poses, layout metadata and judge internals. T12 explicitly supplies demonstrations as task context.</p></article><article><h3>Hidden evaluation</h3><p>The manuscript specifies three independent trials per task and model under matched initial states, tools, time limits and attempt budgets. Failures and timeouts remain in the results.</p></article><article><h3>Success and progress</h3><p>Each task defines success and a 0–100 progress score. Overall reporting averages tasks within each category, then equally averages the six task-category scores. Task coverage is shown explicitly.</p></article></div><a class="text-link" href="${RESEARCH_REPO}">View the research repository ↗</a>`);}
function showResources(){showDialog(`<p class="eyebrow">RESEARCH MATERIALS</p><h2 id="dialog-title">Go to the research sources.</h2><div class="resource-list"><a href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository <span>GitHub ↗</span></a><a href="${RESEARCH_NOTES}" target="_blank" rel="noopener">Project research notes <span>Notion ↗</span></a><a href="${Site.href('about')}">Project publications <span>Report ↗</span></a></div><p>The research repository currently requires access. Notion may require a workspace sign-in. Website source: github.com/racingemperor/ai4robot-website.</p>`);}
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.task&&task(b.dataset.task)){if($('#dossier').open)$('#dossier').close();showTask(b.dataset.task);}const actions={protocol:showProtocol,resources:showResources,'close-dialog':()=>$('#dossier').close()};if(actions[b.dataset.action])actions[b.dataset.action]();});
$('#dossier').addEventListener('click',e=>{if(e.target===$('#dossier')){const r=$('#dossier').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#dossier').close();}});
