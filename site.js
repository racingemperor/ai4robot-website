/* Each URL owns one page. Shared navigation and task dossiers. */
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const tracks={A:{name:'Execute a program',en:'CONTROL',output:'Control program',count:17},B:{name:'Train a policy',en:'TRAIN',output:'Code + weights',count:2},C:{name:'Build an artifact',en:'BUILD',output:'Scene / motion files',count:3}};
const task=id=>TASKS.find(t=>t.id===id);
const group=id=>GROUPS.find(g=>g.id===id);
const category=id=>CATEGORIES.find(c=>c.id===id);
const arrow='<span aria-hidden="true">↗</span>';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RESEARCH_REPO='https://github.com/ALEXander22568/AI4Robot';
const RESEARCH_NOTES='https://app.notion.com/p/gpt-robotllm-as-policy-benchmark-3f3238c5ee428004a459fc5962a8af85';
window.Site=(()=>{
 const pages={
  home:['index.html','Overview','AI4Robot','Code meets the physical world.','LLM EMBODIMENT BENCHMARK'],
  tasks:['tasks.html','Tasks','Inside each task.','Explore the goal, the capabilities it tests and how models perform. 22 tasks across the five categories defined in the EGE abstract.','THE TASK COLLECTION'],
  leaderboard:['leaderboard.html','Leaderboard','How do models perform?','Measure reliability across repeated trials. Compare success, progress and coverage under one recorded evaluation protocol.','MODEL PERFORMANCE'],
  episodes:['episodes.html','Episodes','Follow an action to its outcome.','Inspect observations, model inputs and outputs, code revisions and judgments on a shared timeline.','PROCESS EVIDENCE'],
  documents:['documents.html','Documents','Understand, reproduce, contribute.','Explore the EGE manuscript, benchmark design and evaluation method, then configure a run or access the research resources.','RESEARCH DOCUMENTATION']
 };
 const page=document.body.dataset.page,resultPages=['tasks','leaderboard','compare','matrix','episodes'];
 const sections={tasks:[['catalog','Task catalog'],['matrix','Results matrix']],leaderboard:[['ranking','Ranking'],['comparison','Model comparison']],documents:[['method','Method'],['run','Run'],['resources','Resources']]};
 const section=()=>sections[page]?.find(([id])=>id===new URLSearchParams(location.search).get('section'))?.[0]||sections[page]?.[0][0];
 function href(id,overrides={}){
  const current=new URLSearchParams(location.search),p=new URLSearchParams();
  for(const key of ['data',...(resultPages.includes(id)?['track','category','group','robot']:[])])if(current.has(key))p.set(key,current.get(key));
  for(const [key,value]of Object.entries(overrides))if(value===null||value===undefined||value==='')p.delete(key);else p.set(key,String(value));
  const aliases={compare:['leaderboard','comparison'],matrix:['tasks','matrix'],method:['documents','method'],run:['documents','run'],about:['documents','resources']};
  if(page==='documents'&&['documents','method','run','about'].includes(id)&&current.has('task')&&!Object.hasOwn(overrides,'task'))p.set('task',current.get('task'));
  if(aliases[id]){p.set('section',aliases[id][1]);id=aliases[id][0];}
  return pages[id][0]+(p.size?'?'+p:'');
 }
 function link(id,label){return `<a data-site-page="${id}" href="${esc(href(id))}" ${page===id?'aria-current="page"':''}>${label||({method:'Method',run:'Run',about:'Resources'})[id]||pages[id][1]}</a>`;}
 function refreshLinks(){$$('[data-site-page]').forEach(a=>a.href=href(a.dataset.sitePage));}
 const legacy=new URLSearchParams(location.search),old={board:'leaderboard',compare:'compare',matrix:'matrix',episodes:'episodes',run:'run',about:'about'};
 if(page==='home'&&Object.hasOwn(old,legacy.get('lab'))){const target=old[legacy.get('lab')];legacy.delete('lab');legacy.delete('variant');location.replace(href(target,Object.fromEntries(legacy))+location.hash);}
 const nav=['tasks','leaderboard','episodes','documents'];
 $('#app').innerHTML=`<header class="site-header"><a class="brand" data-site-page="home" href="${href('home')}" aria-label="AI4Robot overview"><span class="brand-mark" aria-hidden="true">a<span>4</span>r</span>AI4Robot<span class="brand-sub">RESEARCH PROJECT</span></a><button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu <span aria-hidden="true">☰</span></button><nav id="primary-nav" aria-label="Primary navigation">${nav.map(id=>link(id)).join('')}</nav><button type="button" class="theme-toggle" aria-label="Switch to dark theme" aria-pressed="false"><svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg><svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg></button></header><main id="main" tabindex="-1">${page==='home'?'':`<div class="page-heading"><div class="page-heading-meta"><span>${pages[page][4]}</span><span>AI4ROBOT / ${page.toUpperCase()}</span></div><h1>${pages[page][2]}</h1><p>${pages[page][3]}</p></div>`}<div id="page-content"></div></main><footer class="site-footer"><div><a class="brand" data-site-page="home" href="${href('home')}">AI4Robot ↗</a><p>Embodied Generalist Exam · Beyond robot control.</p></div><div class="footer-right"><div class="footer-links">${['method','run','about'].map(id=>link(id)).join('')}<a href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository ↗</a></div><span>RESEARCH PREVIEW · 2026</span><p>22 task specifications · Reviewed model results and footage forthcoming</p></div></footer>`;
 window.Theme.mount($('.theme-toggle'));
 if(sections[page]){
  $('#page-content').innerHTML=`<div class="section-switch" role="group" aria-label="${pages[page][1]} views">${sections[page].map(([id,label])=>`<button type="button" data-section="${id}" aria-controls="${page}-${id}-panel" aria-pressed="${section()===id}">${label}</button>`).join('')}</div>${sections[page].map(([id,label])=>`<div id="${page}-${id}-panel" role="region" aria-label="${label}" ${section()===id?'':'hidden'}></div>`).join('')}`;
 }
 function updateSection(){
  if(!sections[page])return;
  const active=section();
  $$('[data-section]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.section===active)));
  sections[page].forEach(([id])=>{$(`#${page}-${id}-panel`).hidden=id!==active;});
  document.dispatchEvent(new CustomEvent('site:sectionchange',{detail:{section:active}}));
 }
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-section]');
  if(button){
   if(button.dataset.section===section())return;
   const url=new URL(location.href);url.searchParams.set('section',button.dataset.section);url.hash='';
   history.pushState({},'',url);updateSection();refreshLinks();return;
  }
  const anchor=e.target.closest('a[href]');
  if(page!=='documents'||!anchor||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||anchor.target||anchor.hasAttribute('download'))return;
  const url=new URL(anchor.href),active=url.searchParams.get('section');
  if(url.origin!==location.origin||url.pathname!==location.pathname||!sections[page].some(([id])=>id===active)||active===section())return;
  e.preventDefault();$('#dossier').close();history.pushState({},'',url);updateSection();refreshLinks();
  const destination=url.hash?document.getElementById(url.hash.slice(1)):$('#main');
  if(destination){destination.tabIndex=-1;destination.focus({preventScroll:true});destination.scrollIntoView();}
 });
 window.addEventListener('popstate',()=>{updateSection();refreshLinks();});
 const navEl=$('#primary-nav'),toggle=$('.nav-toggle');
 const close=()=>{navEl.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');};
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));navEl.classList.toggle('is-open',open);});
 navEl.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 $('.site-header').addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
 return {href,refreshLinks,page,get section(){return section();}};
})();
function showDialog(html){$('#dialog-content').innerHTML=`<button class="dialog-close" data-action="close-dialog" aria-label="Close dialog">×</button>${html}`;$('#dossier').showModal();}
function showTask(id){const t=task(id);showDialog(`<p class="eyebrow">${t.id} / TASK DOSSIER</p><h2 id="dialog-title">${t.name}</h2><p class="dialog-subtitle">${category(t.category).name} · ${t.robot} · ${tracks[t.track].output}</p><div class="dossier-grid"><div><h3>The goal</h3><p>${t.goal}</p><h3>Evidence to capture</h3><p>${t.video}</p><h3>What the viewer should verify</h3><p>${t.proof}</p></div><div class="shot-sheet"><span class="mono">SHOT LIST / ${t.id}</span>${t.beats.map((b,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${b}</strong></div>`).join('')}<p>Target edit: 12–25 seconds. Keep the full episode and all original camera streams. Label success, failure and incomplete outcomes from the actual judgment.</p></div></div><p class="dossier-notice"><strong>Current scope.</strong> ${t.note}</p><div class="task-crosslinks"><a href="${Site.href('episodes',{episodeTask:t.id})}">Episode evidence ↗</a><a href="${Site.href('run',{task:t.id})}">Configure a run ↗</a></div><p class="source-path">Task specification and filming plan · Research snapshot: October 23, 2026</p>`);}
function showProtocol(){showDialog(`<p class="eyebrow">EVALUATION PROTOCOL</p><h2 id="dialog-title">Separate the agent from the judge.</h2><div class="protocol-notes"><article><h3>Two evaluation routes</h3><p>A coding agent can submit a control program. In the direct-policy route, the model repeatedly reads observations and issues a bounded action. Results from the two routes require distinct protocol labels.</p></article><article><h3>Visible inputs</h3><p>The current ARX direct-policy harness supplies RGB, measured body state and camera calibration. It withholds depth, object poses, layout metadata and judge internals. T12 explicitly supplies demonstrations as task context.</p></article><article><h3>Hidden evaluation</h3><p>The current plan uses three layouts from a hidden seed with repeated manipulation/navigation trials. Policy development uses a fixed hidden evaluator; scene generation and scene and interaction reconstruction use held-out instances.</p></article><article><h3>Success and progress</h3><p>Each task defines success and a 0–100 progress score. Overall reporting averages tasks within each category, then averages the represented categories. Task coverage is shown explicitly.</p></article></div><a class="text-link" href="${Site.href('method')}">Read the full method ↗</a>`);}
function showResources(){showDialog(`<p class="eyebrow">RESEARCH MATERIALS</p><h2 id="dialog-title">Go to the research sources.</h2><div class="resource-list"><a href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository <span>GitHub ↗</span></a><a href="${RESEARCH_NOTES}" target="_blank" rel="noopener">Project research notes <span>Notion ↗</span></a><a href="${Site.href('about')}">Project resources <span>Documents ↗</span></a></div><p>The research repository currently requires access. Notion may require a workspace sign-in. Website source is linked in Documents → Resources.</p>`);}
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.task&&task(b.dataset.task)){if($('#dossier').open)$('#dossier').close();showTask(b.dataset.task);}const actions={protocol:showProtocol,resources:showResources,'close-dialog':()=>$('#dossier').close()};if(actions[b.dataset.action])actions[b.dataset.action]();});
$('#dossier').addEventListener('click',e=>{if(e.target===$('#dossier')){const r=$('#dossier').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#dossier').close();}});
