/* Shared document shell and navigation; each URL owns one page. */
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const tracks = {A:{name:'闭环操作',en:'ACT',desc:'理解观测，执行动作，在反馈中继续。',output:'回合轨迹',count:16},B:{name:'开发与训练',en:'DEVELOP',desc:'编写控制或训练程序，让机器人执行。',output:'控制程序 / 策略',count:3},C:{name:'构建与重建',en:'BUILD',desc:'从语言、图像与视频构建可交互场景。',output:'场景 / 重建轨迹',count:3}};
const task = id => TASKS.find(t=>t.id===id);
const group = id => GROUPS.find(g=>g.id===id);
const arrow = '<span aria-hidden="true">↗</span>';
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

window.Site=(()=>{
 const pages={
  home:['index.html','首页','AI4Robot','从代码，到物理结果。','RESEARCH PROJECT'],
  tasks:['tasks.html','任务','任务图谱','浏览 22 项任务的目标、本体与完成依据。','THE TASK ATLAS'],
  leaderboard:['leaderboard.html','排行榜','模型排行榜','在同一协议与任务范围内，比较模型的整体表现。','MODEL PERFORMANCE'],
  compare:['compare.html','模型对比','模型之间，差在哪里？','把最多三个模型放回共同覆盖的任务，比较不同能力。','SIDE BY SIDE'],
  matrix:['matrix.html','任务矩阵','逐项检查每一份结果。','从整体名次展开到具体任务，找到优势、缺失与待核查的回合。','TASK × MODEL'],
  episodes:['episodes.html','回合','追溯一次行动。','从任务、事件与时间，查看一条结果如何发生。','EPISODE ARCHIVE'],
  method:['method.html','评测方法','我们如何检验具身能力。','从输入接口到交付物与判定，明确一次评测的边界。','EVALUATION METHOD'],
  run:['run.html','运行配置','准备一次可复现运行。','选择任务与初始状态，生成研究仓库现有的开发与参考解命令。','RUN CONFIGURATOR'],
  about:['about.html','参与与资料','让研究可以被核查与参与。','报告格式、公开提交、项目更新与常见问题。','OPEN RESEARCH'],
  footage:['footage.html','拍摄清单','什么影像，能说明能力？','在接入真实素材前，明确每一类视频要回答的问题。','PRODUCTION NOTES']
 };
 const page=document.body.dataset.page;
 const resultPages=['leaderboard','compare','matrix','episodes'];
 function href(id,overrides={}){
  const current=new URLSearchParams(location.search),p=new URLSearchParams();
  const keys=['data',...(resultPages.includes(id)?['track','group','robot']:[])];
  for(const key of keys){if(current.has(key))p.set(key,current.get(key));}
  for(const [key,value] of Object.entries(overrides)){if(value===null||value===undefined||value==='')p.delete(key);else p.set(key,String(value));}
  return pages[id][0]+(p.size?'?'+p:'');
 }
 function link(id,label){return `<a data-site-page="${id}" href="${esc(href(id))}" ${page===id?'aria-current="page"':''}>${label||pages[id][1]}</a>`;}
 function refreshLinks(){$$('[data-site-page]').forEach(a=>a.href=href(a.dataset.sitePage));}
 // Preserve bookmarks from the former single-page research panels.
 const legacy=new URLSearchParams(location.search),legacyPages={board:'leaderboard',compare:'compare',matrix:'matrix',episodes:'episodes',run:'run',about:'about'};
 if(page==='home'&&Object.hasOwn(legacyPages,legacy.get('lab'))){
  const target=legacyPages[legacy.get('lab')];legacy.delete('lab');legacy.delete('variant');
  location.replace(pages[target][0]+(legacy.size?'?'+legacy:''));
 }
 const nav=['tasks','leaderboard','episodes','method','run','about','footage'];
 $('#app').innerHTML=`<header class="site-header"><a class="brand" data-site-page="home" href="${href('home')}" aria-label="AI4Robot 首页"><span class="brand-mark" aria-hidden="true">a<span>4</span>r</span>AI4Robot<span class="brand-sub">RESEARCH PROJECT</span></a><button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">菜单 <span aria-hidden="true">☰</span></button><nav id="primary-nav" aria-label="主导航">${nav.map(id=>link(id)).join('')}</nav></header><main id="main" tabindex="-1">${page==='home'?'':`<div class="page-heading"><div class="page-heading-meta"><span>${pages[page][4]}</span><span>AI4ROBOT / ${page.toUpperCase()}</span></div><h1>${pages[page][2]}</h1><p>${pages[page][3]}</p></div>`}${resultPages.includes(page)?`<nav class="result-nav" aria-label="结果页面">${resultPages.map(id=>link(id)).join('')}</nav>`:''}<div id="page-content"></div></main><footer class="site-footer"><div><a class="brand" data-site-page="home" href="${href('home')}">AI4Robot <span aria-hidden="true">↗</span></a><p>从代码，到物理结果。</p></div><div class="footer-right"><div class="footer-links">${['method','about','footage'].map(id=>link(id)).join('')}<a href="https://github.com/racingemperor/ai4robot-website" target="_blank" rel="noopener">GitHub ↗</a></div><span>RESEARCH WEBSITE DEMO · 2026</span><p>任务定义展示 · 实测报告与影像待发布</p></div></footer>`;
 const navEl=$('#primary-nav'),toggle=$('.nav-toggle');
 const close=()=>{navEl.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');};
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));navEl.classList.toggle('is-open',open);});
 navEl.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 $('.site-header').addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
 return {href,refreshLinks,page};
})();
function showDialog(html){$('#dialog-content').innerHTML=`<button class="dialog-close" data-action="close-dialog" aria-label="关闭">×</button>${html}`;$('#dossier').showModal();}
function showTask(id){const t=task(id);showDialog(`<p class="eyebrow">${t.id} / TASK DOSSIER</p><h2 id="dialog-title">${t.name}</h2><p class="dialog-subtitle">${t.en} · ${t.robot} · ${tracks[t.track].name}</p><div class="dossier-grid"><div><h3>任务要求</h3><p>${t.goal}</p><h3>需要拍什么</h3><p>${t.video}</p><h3>观众应看懂什么</h3><p>${t.proof}</p></div><div class="shot-sheet"><span class="mono">SHOT LIST / ${t.id}</span>${t.beats.map((b,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${b}</strong></div>`).join('')}<p>建议成片 12–25 秒。另保留完整回合与各机位原始视频。成功、失败、未完成须据真实记录标注。</p></div></div>${t.id==='T04'?'<p class="dossier-notice">任务限制：当前方案使用预分段与约束解除，不能描述为连续软体切割。</p>':''}${t.id==='T23'?'<p class="dossier-notice">展示时说明行人资产类型；胶囊体代理与真人动画不可混淆。</p>':''}<p class="source-path">以上为任务定义与拍摄策划，实测影像待接入。</p>`);}
function showMedia(){showDialog(`<p class="eyebrow">PRODUCTION BRIEF</p><h2 id="dialog-title">用视频回答问题。</h2><p class="dialog-subtitle">先拍清楚证据，再剪成宣传片。详细清单见同目录 VIDEO-BRIEF.md。</p><div class="brief-priorities"><article><span class="mono">P0 / 首批</span><h3>5 个代表任务 + 2 组对照</h3><p>T02 精密插接、T08 果柄抓取、T11 接触书写、T23 动态避让、T14 可交互重建。优先挑选已有可信完整记录的任务；未就绪项暂留占位。</p></article><article><span class="mono">P1 / 完整任务集</span><h3>22 条任务短片</h3><p>每项 12–25 秒，保留指令、关键动作、终态。长任务明确标注加速倍数与省略片段。</p></article></div><h3>同场景对照规范</h3><p>同任务版本、同初态和同观测权限。记录模型及 harness 版本，分别标注墙钟时间、仿真时间与播放倍速。不得通过不同回合拼接暗示一次完成。</p><h3>每条视频需要交付</h3><p>无字幕原片、网页短版、封面帧、完整回合、判定记录；附任务 ID、seed / layout、版本、模型、智能体、真实结果、时间尺度及关键事件时间戳。</p><div class="brief-task-list">${TASKS.map(t=>`<button data-task="${t.id}"><span>${t.id}</span>${t.name} ${arrow}</button>`).join('')}</div>`);}
function showProtocol(){showDialog(`<p class="eyebrow">EVALUATION PROTOCOL</p><h2 id="dialog-title">行动可以不同，证据应可核查。</h2><div class="protocol-notes"><article><h3>观测与接口</h3><p>模型通过说明书、允许的相机观测与本体状态操作机器人。开发用真值参考解与模型评测分开，具体可见信息以冻结的任务协议为准。</p></article><article><h3>留出初始状态</h3><p>仓库规划采用确定性的 seed / layout 生成初态，正式评测更换隐藏 seed。网页中的任务数量不等于已完成全部模型评测。</p></article><article><h3>三类交付物</h3><p>A 检查闭环操作回合；B 使用固定评测脚本验证程序或训练策略；C 验证场景能加载、能步进且符合任务约束。</p></article><article><h3>成绩与过程</h3><p>成功率和进度分需来自正式评测。网页同步保留任务版本、完整回合和判定依据，当前 demo 不展示虚构分数。</p></article></div>`);}
function showResources(){const repo='https://github.com/racingemperor/ai4robot-website/blob/codex/website-publication';showDialog(`<p class="eyebrow">RESEARCH MATERIALS</p><h2 id="dialog-title">从任务开始了解研究。</h2><p class="dialog-subtitle">AI4Robot 为当前工作名，正式题名、作者、论文与研究代码公开地址待确定。</p><div class="resource-list"><a href="${repo}/tasks.js" target="_blank" rel="noopener">22 项任务与镜头配置 <span>GitHub ↗</span></a><a href="${repo}/DESIGN-NOTES.md" target="_blank" rel="noopener">网页设计与参考研究 <span>GitHub ↗</span></a><a href="${repo}/VIDEO-BRIEF.md" target="_blank" rel="noopener">完整视频拍摄清单 <span>GitHub ↗</span></a></div><p>后续在此接入已确认的论文、研究代码、评测协议与完整实验记录。</p>`);}


document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.task&&task(b.dataset.task)){if($('#dossier').open)$('#dossier').close();showTask(b.dataset.task);}
 const actions={media:showMedia,protocol:showProtocol,resources:showResources,'close-dialog':()=>$('#dossier').close()};
 if(actions[b.dataset.action])actions[b.dataset.action]();
});
$('#dossier').addEventListener('click',e=>{if(e.target===$('#dossier')){const r=$('#dossier').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#dossier').close();}});
