/* Research tools: validated aggregate reports, synthetic walkthroughs, local-only files. */
window.Lab = (() => {
  const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q=(s,r=document)=>r.querySelector(s);
  const tabs=[['board','排行榜'],['compare','模型对比'],['matrix','任务矩阵'],['episodes','回合浏览'],['run','运行配置'],['about','参与与资料']];
  const query=new URLSearchParams(location.search);
  const L={tab:tabs.some(t=>t[0]===query.get('lab'))?query.get('lab'):'board',source:query.get('data')==='demo'?'demo':'official',imported:null,track:'all',group:'all',robot:'all',sort:'score',direction:-1,modelQuery:'',compare:[],episode:'',episodeTask:'all',episodeModel:'all',status:'all',time:0,playing:false,raf:0,last:0,videoURL:'',videoEpisode:'',message:'',runTask:'T06',runMode:'solve',gpu:'0',seeds:'0',layouts:'0,1,2,3,4,5,6,7,8,9',camera:'head'};
  for(const key of ['track','group','robot','sort','modelQuery','episodeTask','episodeModel','status','episode']){const value=query.get(key);if(value&&value.length<160)L[key]=value;}
  if(!['all','A','B','C'].includes(L.track))L.track='all';
  if(!['all',...GROUPS.map(g=>g.id)].includes(L.group))L.group='all';
  if(!['all',...TASKS.map(t=>t.robot)].includes(L.robot))L.robot='all';
  if(!['score','progress','duration','trials','coverage'].includes(L.sort))L.sort='score';
  if(query.get('order')==='asc')L.direction=1;
  L.compare=(query.get('models')||'').split(',').filter(Boolean).slice(0,3);
  const data=()=>L.source==='demo'?Results.demo:L.source==='imported'?L.imported:Results.official;
  const sourceLabel=()=>({official:'正式结果 · 待发布',demo:'合成示例 · 非实测',imported:'本地导入 · 未审核'})[L.source];
  const pct=v=>v===null||v===undefined?'—':`${(v*100).toFixed(1)}%`;
  const fmt=v=>v===null||v===undefined?'—':`${v.toFixed(1)} s`;
  function selectedTasks(){return TASKS.filter(t=>(L.track==='all'||t.track===L.track)&&(L.group==='all'||t.group===L.group)&&(L.robot==='all'||t.robot===L.robot));}
  function summary(ids=selectedTasks().map(t=>t.id)){return Results.summarize(data(),ids);}
  function orderedRows(){return summary().filter(m=>`${m.name} ${m.agent} ${m.version}`.toLowerCase().includes(L.modelQuery.toLowerCase())).sort((a,b)=>Number(b.complete)-Number(a.complete)||((a[L.sort]??-Infinity)-(b[L.sort]??-Infinity))*L.direction||a.id.localeCompare(b.id));}
  function syncURL(){const p=new URLSearchParams(location.search);p.set('lab',L.tab);L.source==='demo'?p.set('data','demo'):p.delete('data');for(const key of ['track','group','robot','sort','modelQuery','episodeTask','episodeModel','status','episode']){const v=L[key];if(v&&v!=='all')p.set(key,v);else p.delete(key);}p.set('order',L.direction===1?'asc':'desc');if(L.compare.length)p.set('models',L.compare.join(','));else p.delete('models');history.replaceState({},'',`${location.pathname}?${p}${location.hash}`);}
  const option=(value,text,active)=>`<option value="${h(value)}"${value===active?' selected':''}>${h(text)}</option>`;
  function html(){return `<section class="research section" id="research" aria-labelledby="research-title"><div class="section-title"><div><p class="eyebrow">RESULTS, TOOLS & REPRODUCIBILITY</p><h2 id="research-title">从结果到回合，逐层展开。</h2></div><p>比较模型、检查任务与过程，<br>为一次可复现的评测做好准备。</p></div><div class="lab-overview">${[['22','具身任务'],['16 / 3 / 3','操作 / 开发 / 构建'],['5','能力分组'],['0','已公开实测报告']].map(([n,label])=>`<div><strong>${n}</strong><span>${label}</span></div>`).join('')}</div><nav class="lab-tabs" aria-label="研究工具">${tabs.map(([id,name])=>`<button data-lab-tab="${id}" aria-pressed="${L.tab===id}">${name}</button>`).join('')}</nav><div class="lab-source"><div><strong id="source-label">${sourceLabel()}</strong><span id="source-description"></span></div><div class="lab-actions"><button class="lab-button" data-lab-action="demo">${L.source==='demo'?'查看正式结果':'加载交互示例'}</button><button class="lab-button" data-lab-action="import">导入 JSON</button><button class="lab-button" data-lab-action="share">复制当前视图</button><input id="result-upload" type="file" accept=".json,application/json" hidden></div></div><p id="lab-message" class="lab-message" role="status" aria-live="polite">${h(L.message)}</p><div id="lab-filters"></div><div id="lab-panel"></div></section>`;}
  function filters(){return `<div class="lab-filters"><label>任务形态<select data-lab-filter="track">${option('all','全部形态',L.track)}${[['A','A · 闭环操作'],['B','B · 开发训练'],['C','C · 构建重建']].map(([v,t])=>option(v,t,L.track)).join('')}</select></label><label>能力分组<select data-lab-filter="group">${option('all','全部能力',L.group)}${GROUPS.map(g=>option(g.id,g.name,L.group)).join('')}</select></label><label>本体 / 场景<select data-lab-filter="robot">${option('all','全部本体与场景',L.robot)}${[...new Set(TASKS.map(t=>t.robot))].map(r=>option(r,r,L.robot)).join('')}</select></label><button class="lab-button" data-lab-action="reset">重置筛选</button><p>${selectedTasks().length} / 22 项任务<br><span>Simulation · 同报告协议</span></p></div>`;}
  function empty(text='正式评测报告尚未发布。'){return `<div class="lab-empty"><h3>${text}</h3><p>可以加载合成示例体验完整交互，或导入自己的报告。示例不代表 Codex、Claude 或其他真实模型成绩。</p><button class="lab-button solid" data-lab-action="demo">加载交互示例</button><button class="lab-button" data-lab-action="template">下载报告模板</button></div>`;}
  function board(){
    const rows=orderedRows();
    const ids=selectedTasks().map(t=>t.id);
    let rank=0,previous=null,position=0;
    const sortButton=(key,text)=>`<button data-sort="${key}">${text} <span aria-hidden="true">${L.sort===key?(L.direction===-1?'↓':'↑'):'↕'}</span></button>`;
    return `<div class="panel-heading"><div><h3>Leaderboard</h3><p>在相同协议与任务子集下比较；覆盖不足的报告不分配名次。</p></div><div class="lab-actions"><button class="lab-button" data-lab-action="csv">导出当前 CSV</button><button class="lab-button" data-lab-action="json">下载当前报告</button></div></div><label class="model-search">搜索模型或智能体<input id="model-search" type="search" placeholder="名称 / 版本 / 智能体" value="${h(L.modelQuery)}"></label>${data().models.length?`<div class="table-scroll" tabindex="0" role="region" aria-label="排行榜，可横向滚动"><table class="results-table"><caption>${sourceLabel()} · ${h(data().benchmark_version)} · ${h(data().protocol)}</caption><thead><tr><th scope="col">名次</th><th scope="col">模型 / 智能体</th>${[['score','成功率'],['progress','平均进度'],['duration','平均时长'],['trials','回合数'],['coverage','任务覆盖']].map(([k,n])=>`<th scope="col" aria-sort="${L.sort===k?(L.direction===-1?'descending':'ascending'):'none'}">${sortButton(k,n)}</th>`).join('')}<th scope="col">查看</th></tr></thead><tbody>${rows.length?rows.map(m=>{if(m.complete){position++;if(previous!==m[L.sort])rank=position;previous=m[L.sort];}return `<tr><td class="rank">${m.complete?String(rank).padStart(2,'0'):'—'}</td><th scope="row"><strong>${h(m.name)}</strong><small>${h(m.version)} · ${h(m.agent)}</small></th><td><strong>${pct(m.score)}</strong><small>${m.ci?`95% CI ${pct(m.ci[0])}–${pct(m.ci[1])}`:'无回合'}</small></td><td>${pct(m.progress)}</td><td>${fmt(m.duration)}</td><td>${m.trials}</td><td>${m.coverage} / ${ids.length}<small>${m.complete?'完整覆盖':'覆盖不足 · 不排名'}</small></td><td><button class="lab-button" data-compare-model="${h(m.id)}">对比</button></td></tr>`;}).join(''):'<tr><td colspan="8">没有匹配的模型。</td></tr>'}</tbody></table></div>`:empty()}<details class="metric-notes"><summary>排名与统计口径</summary><p>当前分数为所选任务的总成功回合数 / 总回合数；进度为 progress_sum / trials，时长为总仿真秒数 / trials。结果按报告内的 benchmark_version 与 protocol 分开导入，不合并跨报告数据。95% 区间使用 Wilson 二项区间；它不包含跨任务、seed 或模型采样相关性。完整覆盖模型优先排序；缺失任务不按失败补零，也不参与名次。并列值同名次。切换指标后名次代表该指标顺序；时长小值更优。正式最终口径仍需冻结。</p></details>`;
  }
  function compare(){
    const models=data().models;
    if(!models.length)return empty();
    L.compare=L.compare.filter(id=>models.some(m=>m.id===id));if(!L.compare.length)L.compare=models.slice(0,Math.min(2,models.length)).map(m=>m.id);
    const chosen=models.filter(m=>L.compare.includes(m.id));
    return `<div class="panel-heading"><div><h3>把差异放回同一组任务。</h3><p>选择最多 3 个模型；共同覆盖的任务才用于下面的分组比较。</p></div><button class="lab-button" data-lab-action="compare-csv">导出对比 CSV</button></div><fieldset class="model-choices"><legend>选择模型（最多 3 个）</legend>${models.map(m=>`<label><input type="checkbox" data-compare-choice="${h(m.id)}" ${L.compare.includes(m.id)?'checked':''}>${h(m.name)}</label>`).join('')}</fieldset><div class="compare-metrics">${chosen.map(m=>{const s=summary().find(s=>s.id===m.id);return `<article><span>${h(m.name)}</span><strong>${pct(s.score)}</strong><p>${s.coverage}/${selectedTasks().length} 项 · ${s.trials} 回合</p><small>${sourceLabel()}</small></article>`;}).join('')}</div><div class="capability-bars">${GROUPS.map(g=>{
      const ts=selectedTasks().filter(t=>t.group===g.id),ids=ts.filter(t=>chosen.every(m=>data().results.some(r=>r.task_id===t.id&&r.model_id===m.id))).map(t=>t.id);
      const summaries=Results.summarize(data(),ids);return `<article><div><h4>${g.name}</h4><span>共同覆盖 ${ids.length} / ${ts.length} 项</span></div>${chosen.map((m,i)=>{const s=summaries.find(s=>s.id===m.id);return `<div class="capability-row"><span>${h(m.name)}</span><div class="capability-track"><i class="series-${i}" style="width:${(s.score??0)*100}%"></i></div><strong>${pct(s.score)}</strong></div>`;}).join('')}</article>`;
    }).join('')}</div><p class="lab-note">概览卡片按各模型已覆盖任务计算；分组条形图仅比较共同覆盖任务。颜色同时配有模型名称和数值。可在任务矩阵查看缺失项。</p>`;
  }
  function matrix(){
    const models=data().models;
    if(!models.length)return empty();
    return `<div class="panel-heading"><div><h3>22 项任务 × 模型</h3><p>每格显示成功率与回合数，点击可查看对应回合。— 表示没有结果。</p></div><button class="lab-button" data-lab-action="matrix-csv">导出矩阵 CSV</button></div><div class="matrix-legend"><span>低</span>${[0,25,50,75,100].map(n=>`<i style="--intensity:${n/100}">${n}%</i>`).join('')}<span>高 · ${sourceLabel()}</span></div><div class="table-scroll" tabindex="0" role="region" aria-label="任务模型矩阵，可横向滚动"><table class="results-table matrix-table"><caption>${h(data().protocol)} · 格内数值可独立于颜色读取</caption><thead><tr><th scope="col">任务</th>${models.map(m=>`<th scope="col">${h(m.name)}</th>`).join('')}</tr></thead><tbody>${selectedTasks().map(t=>`<tr><th scope="row"><button data-task="${t.id}">${t.id} <strong>${t.name}</strong><small>${t.robot} · ${t.track}</small></button></th>${models.map(m=>{const r=data().results.find(r=>r.task_id===t.id&&r.model_id===m.id);return `<td>${r?`<button class="matrix-cell" style="--intensity:${r.successes/r.trials}" data-matrix-task="${t.id}" data-matrix-model="${h(m.id)}" aria-label="${h(m.name)}，${t.id}，成功率${pct(r.successes/r.trials)}，${r.trials}回合；查看回合">${pct(r.successes/r.trials)}<small>n=${r.trials}</small></button>`:'—'}</td>`;}).join('')}</tr>`).join('')||`<tr><td colspan="${models.length+1}">当前筛选没有任务。</td></tr>`}</tbody></table></div>`;
  }
  const statusName=s=>({success:'完成',failure:'失败',incomplete:'未完成'})[s];
  function clearVideo(){stop();if(L.videoURL)URL.revokeObjectURL(L.videoURL);L.videoURL='';L.videoEpisode='';}
  function episodeRows(){return data().episodes.filter(e=>selectedTasks().some(t=>t.id===e.task_id)&&(L.episodeTask==='all'||e.task_id===L.episodeTask)&&(L.episodeModel==='all'||e.model_id===L.episodeModel)&&(L.status==='all'||e.status===L.status));}
  function currentEpisode(){const rows=episodeRows();return rows.find(e=>e.id===L.episode)||rows[0];}
  function episodes(){
    const rows=episodeRows(),e=currentEpisode();if(e)L.episode=e.id;
    return `<div class="panel-heading"><div><h3>Episode browser</h3><p>${L.source==='demo'?'合成事件时间轴 · 非真实轨迹，示意图不表示实际机器人状态。':'按事件、时间和判定追溯结果；可在本机附加视频。'}</p></div><button class="lab-button" data-lab-action="episode-json" ${e?'':'disabled'}>下载当前回合</button></div><div class="episode-filters"><label>任务<select data-episode-filter="episodeTask">${option('all','全部任务',L.episodeTask)}${selectedTasks().map(t=>option(t.id,`${t.id} ${t.name}`,L.episodeTask)).join('')}</select></label><label>模型<select data-episode-filter="episodeModel">${option('all','全部模型',L.episodeModel)}${data().models.map(m=>option(m.id,m.name,L.episodeModel)).join('')}</select></label><label>状态<select data-episode-filter="status">${option('all','全部状态',L.status)}${['success','failure','incomplete'].map(s=>option(s,statusName(s),L.status)).join('')}</select></label></div>${e?`<div class="episode-layout"><div class="episode-index" role="group" aria-label="回合目录">${rows.map(r=>`<button data-episode="${h(r.id)}" aria-pressed="${r.id===e.id}"><strong>${r.task_id} · ${h(data().models.find(m=>m.id===r.model_id).name)}</strong><span>${statusName(r.status)} · ${r.duration_s}s</span><small>${h(r.id)}</small></button>`).join('')}</div><div class="episode-view"><div class="episode-caption"><strong>${e.task_id} / ${h(e.id)}</strong><span>${statusName(e.status)} · ${sourceLabel()}</span></div><div class="episode-stage">${L.videoURL&&L.videoEpisode===e.id?`<video id="episode-video" src="${h(L.videoURL)}" controls preload="metadata" playsinline></video>`:`<div class="episode-concept"><span>事件档案 · 无实验视频</span>${typeof drawing==='function'?drawing(e.task_id):''}<strong>${TASKS.find(t=>t.id===e.task_id).name}</strong></div>`}</div><div class="playback"><button class="lab-button" data-lab-action="play">播放事件</button><input id="episode-seek" type="range" min="0" max="${e.duration_s}" value="${Math.min(L.time,e.duration_s)}" step="0.1" aria-label="回合时间"><output id="episode-clock">0.0 / ${e.duration_s}s</output><label>倍速<select id="episode-speed"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div><div id="episode-event" class="current-event" aria-live="off"></div><div class="event-list">${e.events.map((event,i)=>`<button data-event-index="${i}"><time>${event.time_s.toFixed(1)}s</time><strong>${h(event.type)}</strong><span>${h(event.text)}</span></button>`).join('')}</div><div class="episode-meta"><span>seed ${e.seed} · layout ${e.layout}</span><span>${h(data().benchmark_version)} · ${h(data().protocol)}</span></div><label class="lab-button video-upload">附加本机视频<input id="episode-video-upload" type="file" accept="video/*"></label>${L.videoURL&&L.videoEpisode===e.id?'<button class="lab-button" data-lab-action="remove-video">移除视频</button>':''}<p class="lab-note">文件仅在当前浏览器会话使用，不上传。附加视频会替代事件时钟，以视频原始秒数定位；请确保它与该回合使用同一时钟。${L.source==='demo'?'示例结束状态仅用于界面演示。':''}</p></div></div>`:empty(data().models.length?'当前筛选没有回合记录。':'回合记录待发布。')}`;
  }
  function run(){return `<div class="panel-heading"><div><h3>配置一次可复现运行。</h3><p>命令对应研究仓库现有 CLI。需要已授权的代码、Isaac Sim 与资产环境。</p></div><button class="lab-button" data-lab-action="run-json">下载运行配置</button></div><div class="run-layout"><form id="run-form" class="run-form"><label>任务<select name="task">${TASKS.map(t=>option(t.id,`${t.id} · ${t.name}`,L.runTask)).join('')}</select></label><label>模式<select name="mode">${[['check','环境与判定自检'],['solve','脚本参考解与录制'],['play','场景交互查看']].map(([v,t])=>option(v,t,L.runMode)).join('')}</select></label><label>GPU 编号<input name="gpu" type="number" min="0" max="15" value="${h(L.gpu)}" required></label><label>Seed 列表<input name="seeds" value="${h(L.seeds)}" pattern="[0-9]+(,[0-9]+)*" required></label><label>Layout 列表（0–9）<input name="layouts" value="${h(L.layouts)}" pattern="[0-9](,[0-9])*" required></label><label>录制相机<select name="camera">${option('head','head（本体须提供该相机）',L.camera)}${option('none','不录制',L.camera)}</select></label></form><div class="command-box"><div><span>EXISTING CLI · ${Results.version}</span><button class="lab-button" data-lab-action="copy-command">复制命令</button></div><pre id="run-command"></pre><p id="run-feedback" role="status"></p><p>这是环境自检 / 参考解命令，不是模型排行榜评测。通用模型接入与冻结评分协议发布后，再接入正式评测入口。</p></div></div><div class="run-steps"><article><strong>环境</strong><p>使用已配置的 Isaac Sim 5.1 与研究仓库；本网页不会安装、执行或调用模型。</p></article><article><strong>运行</strong><p>固定任务版本、seed/layout 和观察接口；check 检查初态，solve 跑脚本参考解。</p></article><article><strong>归档</strong><p>保存回合、判定、时钟与版本。使用网站报告模板整理汇总，导入后核对覆盖和回合。</p></article></div>`;}
  function about(){return `<div class="panel-heading"><div><h3>参与、复现与提交。</h3><p>公开协议和证据，让结果可以核查。</p></div><a class="lab-button" href="https://github.com/racingemperor/ai4robot-website" target="_blank" rel="noopener">网站代码 ↗</a></div><div class="participate-grid"><article><h4>结果报告</h4><p>下载 JSON 模板，填写模型版本、agent、协议与逐任务汇总。校验成功后可在本机浏览，不会直接进入公开榜单。</p><div class="lab-actions"><button class="lab-button" data-lab-action="template">下载模板</button><button class="lab-button" data-lab-action="import">导入并校验</button></div></article><article><h4>公开提交</h4><p>在网站仓库发起 Pull Request，附协议、任务版本、完整回合与授权说明。维护者审核可复现性后再发布；网页不自动授予认证。</p><a class="text-link" href="https://github.com/racingemperor/ai4robot-website/compare" target="_blank" rel="noopener">前往提交 ↗</a></article><article><h4>贡献与反馈</h4><p>报告页面问题、提出任务/协议建议，或按逐任务拍摄清单准备素材。正式论文、作者与研究代码链接确认后补充。</p><a class="text-link" href="https://github.com/racingemperor/ai4robot-website/issues/new" target="_blank" rel="noopener">提交反馈 ↗</a></article></div><div class="research-updates"><h4>项目更新</h4><div><time datetime="2026-10-21">2026.10.21</time><p>公开网页 demo；22 项任务定义、三种版式与拍摄清单。</p></div><div><span>本轮更新</span><p>排行榜、模型对比、任务矩阵、回合事件浏览、运行配置与报告导入。</p></div></div><div class="faq"><h4>常见问题</h4>${[
      ['为什么还没有 Codex / Claude 的真实名次？','网页尚未收到经审核且符合统一协议的模型报告。合成示例仅说明交互，不表达任何真实模型能力判断。'],
      ['为什么不把缺失任务记作 0？','未评测和失败是不同状态。排行榜显示覆盖率，只有当前任务子集完整覆盖的模型参与排名；比较页面使用共同覆盖任务。'],
      ['示例、正式结果和导入报告可以混合吗？','不混合。每次只启用一个来源与协议。导入替换当前报告，始终标为本地未审核；刷新清除导入状态。'],
      ['支持真实机器人与仿真结果一起排名吗？','当前报告只支持 simulation。真实机器人结果应使用独立协议与榜单，待该评测发布后增加。'],
      ['回合浏览是实际仿真回放吗？','现在提供事件时间轴与可附加的本机视频，概念图不会随时间伪装成仿真轨迹。公开原始视频接入后可直接播放和定位。'],
      ['为什么是 22 项？','仓库共有 T01–T23，T18 陌生本体适应当前搁置，宣传页按确认口径排除它。']
    ].map(([a,b])=>`<details><summary>${a}</summary><p>${b}</p></details>`).join('')}</div><div class="downloads"><h4>数据与材料</h4><button class="lab-button" data-lab-action="tasks-json">下载22项任务 JSON</button><button class="lab-button" data-lab-action="demo-json">下载合成报告示例</button><button class="lab-button" data-lab-action="citation">复制网页引用</button><a class="lab-button" href="https://github.com/racingemperor/ai4robot-website/blob/codex/website-publication/FEATURES.md" target="_blank" rel="noopener">功能对照与报告格式 ↗</a><p class="lab-note">引用为网页 @misc 条目；正式论文题名与作者尚未确认。</p></div>`;}
  function renderPanel(){
    stop();const root=q('#research');if(!root)return;
    const focused=document.activeElement;
    const focusKey=focused?.id?`#${CSS.escape(focused.id)}`:focused?.dataset.labFilter?`[data-lab-filter="${focused.dataset.labFilter}"]`:focused?.dataset.sort?`[data-sort="${focused.dataset.sort}"]`:focused?.dataset.compareChoice?`[data-compare-choice="${CSS.escape(focused.dataset.compareChoice)}"]`:null;
    const d=data();q('#source-label').textContent=sourceLabel();
    q('#source-description').textContent=L.source==='demo'?'所有数值与事件为合成数据，不构成模型结论。':L.source==='imported'?'报告仅在当前页面内存中，无上传；来源与结果未经审核。':'真实结果发布后接入；现在可体验示例或导入本机报告。';
    root.dataset.source=L.source;
    const toggle=q('[data-lab-action="demo"]',q('.lab-source'));toggle.textContent=L.source==='demo'?'查看正式结果':'加载交互示例';
    root.querySelectorAll('[data-lab-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.labTab===L.tab)));
    q('#lab-filters').innerHTML=['board','compare','matrix','episodes'].includes(L.tab)?filters():'';
    q('#lab-panel').innerHTML=({board,compare,matrix,episodes,run,about})[L.tab]();
    q('#lab-message').textContent=L.message;
    if(L.tab==='run')updateCommand();if(L.tab==='episodes'){updateTime();wireVideo();}
    if(focusKey)q(focusKey)?.focus({preventScroll:true});
    document.dispatchEvent(new CustomEvent('labviewchange',{detail:L.tab}));
  }
  function stop(){L.playing=false;cancelAnimationFrame(L.raf);const v=q('#episode-video');if(v)v.pause();}
  function updateTime(){
    const e=currentEpisode();if(!e||!q('#episode-seek'))return;L.time=Math.min(Math.max(L.time,0),e.duration_s);
    q('#episode-seek').value=L.time;q('#episode-clock').textContent=`${L.time.toFixed(1)} / ${e.duration_s}s`;
    const i=Math.max(0,e.events.findLastIndex(event=>event.time_s<=L.time)),event=e.events[i];
    q('#episode-event').innerHTML=`<span>${event.time_s.toFixed(1)}s · ${h(event.type)}</span><p>${h(event.text)}</p>`;
    document.querySelectorAll('[data-event-index]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.eventIndex)===i)));
    const play=q('[data-lab-action="play"]');if(play)play.textContent=L.playing?'暂停':'播放事件';
  }
  function wireVideo(){const video=q('#episode-video');if(!video)return;video.addEventListener('timeupdate',()=>{L.time=video.currentTime;updateTime();});video.addEventListener('play',()=>{L.playing=true;updateTime();});video.addEventListener('ended',()=>{L.playing=false;updateTime();});video.addEventListener('pause',()=>{L.playing=false;updateTime();});video.addEventListener('error',()=>message('视频无法解码，请使用浏览器支持的 MP4 / WebM 文件。'));}
  function play(){
    const e=currentEpisode();if(!e)return;
    const video=q('#episode-video');if(L.playing){stop();updateTime();return;}
    if(L.time>=e.duration_s)L.time=0;L.playing=true;
    if(video){video.currentTime=L.time;video.playbackRate=Number(q('#episode-speed').value);video.play().catch(()=>{L.playing=false;message('视频无法播放，请检查格式或使用播放器控件。');updateTime();});updateTime();return;}
    L.last=performance.now();const step=now=>{if(!L.playing||!q('#episode-seek'))return;L.time+=(now-L.last)/1000*Number(q('#episode-speed').value);L.last=now;if(L.time>=e.duration_s){L.time=e.duration_s;L.playing=false;}updateTime();if(L.playing)L.raf=requestAnimationFrame(step);};L.raf=requestAnimationFrame(step);updateTime();
  }
  function runConfig(){return {task_id:L.runTask,mode:L.runMode,gpu:Number(L.gpu),seeds:L.seeds.split(',').map(Number).slice(0,L.runMode==='solve'?undefined:1),layouts:L.layouts.split(',').map(Number).slice(0,L.runMode==='play'?1:undefined),video_camera:L.runMode==='solve'&&L.camera!=='none'?L.camera:null,benchmark_version:Results.version,purpose:'development / reference solution; not model evaluation'};}
  function command(){
    const valid=/^(0|[1-9]\d?)$/.test(L.gpu)&&Number(L.gpu)<=15&&/^\d+(,\d+)*$/.test(L.seeds)&&L.seeds.split(',').length<=30&&L.seeds.split(',').every(s=>Number(s)<=1000000)&&/^[0-9](,[0-9])*$/.test(L.layouts)&&L.layouts.split(',').length<=30;
    if(!valid)return null;
    const task=L.runTask.toLowerCase();let args=`./scripts/ai4robot ${L.runMode} ${task} --gpu ${L.gpu}`;
    args+=L.runMode==='play'?` --seed ${Number(L.seeds.split(',')[0])} --layout ${Number(L.layouts.split(',')[0])}`:L.runMode==='check'?` --seed ${Number(L.seeds.split(',')[0])} --layouts ${L.layouts}`:` --seeds ${L.seeds} --layouts ${L.layouts}`;
    if(L.runMode==='solve'&&L.camera!=='none')args+=` --video ${L.camera}`;
    return args;
  }
  function updateCommand(){const c=command();q('#run-command').textContent=c||'请填写有效的 GPU / seed / layout。';q('#run-feedback').textContent=c?L.runMode==='play'?'交互查看使用列表的第一个 seed 与 layout。':L.runMode==='check'?'环境自检使用第一个 seed 和全部选中 layout。':'该命令只作用于现有任务实现；未实现任务仍需开发。':'GPU 为 0–15，seed 为 0–1000000 整数列表，layout 为 0–9 列表；每列表最多 30 项。';}
  function message(text){L.message=text;const host=q('#lab-message');if(host)host.textContent=text;}
  function download(name,content,type='application/json'){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message(`已下载 ${name}`);}
  async function copy(text){try{await navigator.clipboard.writeText(text);message('已复制。');}catch{showDialog(`<h2 id="dialog-title">复制内容</h2><p>浏览器未提供剪贴板权限，可选中下方文本手动复制。</p><textarea class="copy-fallback" readonly>${h(text)}</textarea>`);q('.copy-fallback').select();}}
  function exportRows(kind){
    const d=data(),ids=selectedTasks().map(t=>t.id);let rows;
    if(kind==='matrix-csv')rows=[['source','protocol','task_id','task',...d.models.map(m=>m.name)],...selectedTasks().map(t=>[sourceLabel(),d.protocol,t.id,t.name,...d.models.map(m=>{const r=d.results.find(r=>r.model_id===m.id&&r.task_id===t.id);return r?r.successes/r.trials:'';})])];
    else if(kind==='compare-csv')rows=[['source','protocol','group','model','common_tasks','trials','success_rate'],...GROUPS.flatMap(g=>{const common=selectedTasks().filter(t=>t.group===g.id&&L.compare.every(id=>d.results.some(r=>r.task_id===t.id&&r.model_id===id))).map(t=>t.id);return Results.summarize(d,common).filter(m=>L.compare.includes(m.id)).map(m=>[sourceLabel(),d.protocol,g.name,m.name,common.join(' '),m.trials,m.score]);})];
    else rows=[['source','benchmark_version','protocol','model','model_version','agent','trials','success_rate','progress','duration_s','task_coverage','eligible'],...orderedRows().map(m=>[sourceLabel(),d.benchmark_version,d.protocol,m.name,m.version,m.agent,m.trials,m.score,m.progress,m.duration,`${m.coverage}/${ids.length}`,m.complete])];
    download(`ai4robot-${L.source}-${kind}.csv`,Results.csv(rows),'text/csv;charset=utf-8');
  }
  function mount(){
    const root=q('#research');if(!root)return;renderPanel();
    root.addEventListener('click',event=>{
      const b=event.target.closest('button');if(!b)return;
      if(b.dataset.labTab){L.tab=b.dataset.labTab;syncURL();renderPanel();return;}
      if(b.dataset.sort){L.direction=L.sort===b.dataset.sort?-L.direction:b.dataset.sort==='duration'?1:-1;L.sort=b.dataset.sort;renderPanel();return;}
      if(b.dataset.compareModel){L.compare=[b.dataset.compareModel,...data().models.filter(m=>m.id!==b.dataset.compareModel).slice(0,1).map(m=>m.id)];L.tab='compare';syncURL();renderPanel();return;}
      if(b.dataset.matrixTask){L.episodeTask=b.dataset.matrixTask;L.episodeModel=b.dataset.matrixModel;L.status='all';L.episode='';L.time=0;L.tab='episodes';syncURL();renderPanel();return;}
      if(b.dataset.episode){L.episode=b.dataset.episode;L.time=0;renderPanel();return;}
      if(b.dataset.eventIndex!==undefined){L.time=currentEpisode().events[Number(b.dataset.eventIndex)].time_s;const video=q('#episode-video');if(video)video.currentTime=L.time;updateTime();return;}
      const action=b.dataset.labAction;
      if(action==='demo'){clearVideo();L.source=L.source==='demo'?'official':'demo';L.episode='';L.episodeTask=L.episodeModel=L.status='all';L.compare=[];L.message='';syncURL();renderPanel();}
      if(action==='reset'){L.track=L.group=L.robot='all';L.episodeTask=L.episodeModel=L.status='all';renderPanel();}
      if(action==='import')q('#result-upload').click();
      if(action==='share'){syncURL();copy(location.href);if(L.source==='imported')message('仅分享视图参数；本机导入报告不会上传或随链接分享。');}
      if(['csv','matrix-csv','compare-csv'].includes(action))exportRows(action);
      if(action==='json')download(`ai4robot-${L.source}-report.json`,JSON.stringify({...data(),website_data_source:L.source},null,2));
      if(action==='demo-json')download('ai4robot-SYNTHETIC-example.json',JSON.stringify({...Results.demo,website_data_source:'demo'},null,2));
      if(action==='tasks-json')download('ai4robot-22-tasks.json',JSON.stringify({scope:'T01–T23 excluding T18',tasks:TASKS},null,2));
      if(action==='template')download('ai4robot-report-template.json',JSON.stringify({...Results.official,models:[{id:'your-model',name:'填写模型名称',version:'填写精确版本',agent:'填写智能体版本'}],results:[],episodes:[]},null,2));
      if(action==='episode-json')download('ai4robot-episode.json',JSON.stringify({source:L.source,benchmark_version:data().benchmark_version,protocol:data().protocol,episode:currentEpisode()},null,2));
      if(action==='play')play();
      if(action==='remove-video'){stop();URL.revokeObjectURL(L.videoURL);L.videoURL='';L.videoEpisode='';renderPanel();}
      if(action==='copy-command'){const c=command();c?copy(c):message('请先修正运行配置。');}
      if(action==='run-json'){command()?download('ai4robot-run-config.json',JSON.stringify(runConfig(),null,2)):message('请先修正运行配置。');}
      if(action==='citation')copy('@misc{ai4robot_website_demo,\n  title = {AI4Robot Website Demo},\n  year = {2026},\n  url = {https://racingemperor.github.io/ai4robot-website/},\n  note = {Website prototype; not a published benchmark paper}\n}');
    });
    root.addEventListener('change',async event=>{
      const el=event.target;
      if(el.dataset.labFilter){L[el.dataset.labFilter]=el.value;renderPanel();}
      if(el.dataset.episodeFilter){L[el.dataset.episodeFilter]=el.value;L.time=0;renderPanel();}
      if(el.dataset.compareChoice){if(el.checked&&L.compare.length>=3){el.checked=false;message('最多同时对比 3 个模型。');return;}L.compare=el.checked?[...L.compare,el.dataset.compareChoice]:L.compare.filter(id=>id!==el.dataset.compareChoice);if(!L.compare.length){L.compare=[el.dataset.compareChoice];message('至少保留一个模型。');}renderPanel();}
      if(el.id==='result-upload'&&el.files[0]){
        const file=el.files[0];try{if(file.size>5*1024*1024)throw new Error('报告超过 5 MB。');const raw=JSON.parse(await file.text());const checked=Results.validate(raw);clearVideo();L.imported=checked;L.source='imported';L.compare=[];L.episode='';L.episodeTask=L.episodeModel=L.status='all';L.message=`校验通过：${L.imported.models.length} 模型，${L.imported.results.length} 项结果，${L.imported.episodes.length} 回合。仅本地未审核。${raw.website_data_source==='demo'?'文件标注为合成示例，不能用作真实评测结论。':''}`;syncURL();renderPanel();}catch(error){message(`导入失败：${error.message}`);}finally{el.value='';}
      }
      if(el.id==='episode-video-upload'&&el.files[0]){const file=el.files[0];if(!file.type.startsWith('video/')){message('请选择视频文件。');return;}stop();if(L.videoURL)URL.revokeObjectURL(L.videoURL);L.videoURL=URL.createObjectURL(file);L.videoEpisode=currentEpisode().id;L.time=0;renderPanel();}
      if(el.id==='episode-speed'){const video=q('#episode-video');if(video)video.playbackRate=Number(el.value);}
    });
    root.addEventListener('input',event=>{
      const el=event.target;
      if(el.id==='model-search'){L.modelQuery=el.value;const start=el.selectionStart;const panel=q('#lab-panel');panel.innerHTML=board();const input=q('#model-search');input.focus();input.setSelectionRange(start,start);}
      if(el.id==='episode-seek'){L.time=Number(el.value);const video=q('#episode-video');if(video)video.currentTime=L.time;updateTime();}
      if(el.closest('#run-form')){const keys={task:'runTask',mode:'runMode',gpu:'gpu',seeds:'seeds',layouts:'layouts',camera:'camera'};if(keys[el.name])L[keys[el.name]]=el.value;updateCommand();}
    });
    root.addEventListener('submit',e=>{if(e.target.id==='run-form')e.preventDefault();});
  }
  document.addEventListener('click',event=>{const a=event.target.closest('[data-lab-go]');if(!a)return;L.tab=a.dataset.labGo;syncURL();renderPanel();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();updateTime();}});
  return {html,mount,stop};
})();
