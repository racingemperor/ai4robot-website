/* A task owns its model results, episode recordings and synchronized traces. */
window.TaskReplay=(()=>{
 const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pct=v=>v==null?'—':`${(v*100).toFixed(1)}%`;
 const localVideos=new Map(),positions=new Map(),selections=new Map();
 let host=null,activeTask=null,mountVersion=0,playVersion=0,activeModel='',activeEpisode='',source='official',saved=null,memoryImport=false,ignoreStored=false,playing=false,raf=0,last=0,speed=1,time=0,notice='';
 const report=()=>source==='demo'?Results.demo:source==='imported'&&saved?saved.report:Results.official;
 const provenance=()=>source==='demo'?'Synthetic preview · Not measured':source==='imported'?`Local report · ${saved?.synthetic?'Synthetic · ':''}Unreviewed`:'Official results · Awaiting evaluation';
 const models=()=>source==='official'&&!report().models.length?Leaderboard.roster:report().models;
 const key=e=>`${source}:${e.model_id}:${e.id}`;
 const taskKey=()=>`${source}:${activeTask.id}`;
 const modelKey=()=>`${taskKey()}:${activeModel}`;
 function episodes(){
  if(source==='official'&&!report().episodes.length){const e=Evidence.preview(activeTask);return [{...e,id:`${e.id}-${activeModel}`,model_id:activeModel}];}
  return report().episodes.filter(e=>e.task_id===activeTask.id&&e.model_id===activeModel);
 }
 const episode=()=>episodes().find(e=>e.id===activeEpisode)||null;
 function suspend(){
  playVersion++;if(!host)return;const e=episode();if(e)positions.set(key(e),time);
  playing=false;cancelAnimationFrame(raf);const video=host.querySelector('video');video?.pause();
  const button=host.querySelector('[data-replay-action="play"]');if(button){button.innerHTML=Evidence.playbackIcon(false);button.setAttribute('aria-label','Play');}
 }
 function unmount(){suspend();mountVersion++;host=null;activeTask=null;}
 function syncURL(){
  const url=new URL(location.href);url.searchParams.set('task',activeTask.id);url.searchParams.delete('section');
  source==='official'?url.searchParams.delete('data'):url.searchParams.set('data',source);
  activeModel?url.searchParams.set('episodeModel',activeModel):url.searchParams.delete('episodeModel');
  const e=episode();e&&!e.preview?url.searchParams.set('episode',e.id):url.searchParams.delete('episode');
  history.replaceState({},'',url);Site.refreshLinks();
 }
 function chooseEpisode(id){
  suspend();const rows=episodes();activeEpisode=rows.some(e=>e.id===id)?id:rows[0]?.id||'';
  time=episode()?positions.get(key(episode()))||0:0;
  selections.set(taskKey(),{model:activeModel});selections.set(modelKey(),{episode:activeEpisode});draw();syncURL();
 }
 function chooseModel(id){
  suspend();activeModel=models().some(m=>m.id===id)?id:models()[0]?.id||'';activeEpisode='';chooseEpisode(selections.get(modelKey())?.episode||'');
 }
 function resultTable(){
  const stats=Results.summarize(report(),[activeTask.id]);
  return `<div class="task-model-results"><h3>Model performance</h3><p>Task-level results across all valid trials. Choose a model to inspect its recordings below.</p><div class="table-scroll" role="region" tabindex="0" aria-label="Model performance on ${activeTask.id}"><table class="results-table"><caption>${h(provenance())} · ${activeTask.id}</caption><thead><tr><th scope="col">Model / harness</th><th scope="col">Success</th><th scope="col">Progress / 100</th><th scope="col">Trials</th><th scope="col">Recordings</th></tr></thead><tbody>${models().map(m=>{const s=stats.find(x=>x.id===m.id),count=report().episodes.filter(e=>e.task_id===activeTask.id&&e.model_id===m.id).length;return `<tr class="${m.id===activeModel?'is-selected-model':''}"><th scope="row"><button type="button" data-replay-model="${h(m.id)}" aria-pressed="${m.id===activeModel}">${h(m.name)}</button><small>${h(m.agent)}</small></th><td>${pct(s?.score)}</td><td>${s?.progress==null?'—':(s.progress*100).toFixed(1)}</td><td>${s?.trials||'—'}</td><td>${count?`<button type="button" data-replay-model="${h(m.id)}">${count} recording${count===1?'':'s'} ↗</button>`:'Awaiting recording'}</td></tr>`;}).join('')||'<tr><td colspan="5">No models in this report.</td></tr>'}</tbody></table></div></div>`;
 }
 function viewer(e){
  const recording=localVideos.get(key(e)),src=recording?.url||e.video?.src,poster=e.video?.poster;
  return `<div class="replay-recording-heading"><div><h3 id="task-recording-title" tabindex="-1">${h(models().find(m=>m.id===activeModel)?.name||'Model')} · Task recording</h3><p>${e.preview?'Layout preview · No recorded run':`${h(e.id)} · ${h(e.status)} · seed ${e.seed} · layout ${e.layout}`}</p></div><label>Episode<select id="task-episode-select">${episodes().map(r=>`<option value="${h(r.id)}"${r.id===e.id?' selected':''}>${r.preview?'Layout preview':`${r.id} · ${r.status}`}</option>`).join('')}</select></label></div>
   ${e.preview?'<p class="layout-preview-note">The video position, model messages and code below are placeholders. The preview is separate from model results.</p>':''}
   <div class="episode-timeline"><div class="playback"><button type="button" class="lab-button playback-toggle" data-replay-action="play" aria-label="Play" title="Play">${Evidence.playbackIcon(false)}</button><input id="task-episode-seek" type="range" min="0" max="${e.duration_s}" step="0.1" value="${time}" aria-label="Episode time"><output id="task-episode-clock"></output><label>Speed<select id="task-episode-speed">${[0.5,1,2,4].map(v=>`<option value="${v}"${v===speed?' selected':''}>${v}×</option>`).join('')}</select></label></div><div class="episode-time-markers">${e.events.map((ev,i)=>`<button type="button" data-replay-event="${i}" style="--event-position:${ev.time_s/e.duration_s*100}%" aria-label="Seek to ${ev.time_s} seconds: ${h(ev.type)}"><i aria-hidden="true"></i><span>${ev.time_s.toFixed(0)}s</span></button>`).join('')}</div></div>
   <div class="episode-synchronized task-recording-layout"><section class="episode-visuals"><div class="evidence-panel-heading"><h4>Episode video</h4><output id="task-frame-time"></output></div><div class="episode-stage">${src?`<video id="task-episode-video" src="${h(src)}"${poster?` poster="${h(poster)}"`:''} preload="metadata" playsinline controls></video>`:Evidence.slot('VIDEO','Model episode recording','This model’s continuous recording follows the shared timeline','episode-video-slot')}</div><div class="episode-attachments"><label class="lab-button video-upload">${recording?'Replace local video':'Attach local video'}<input type="file" id="task-video-upload" accept="video/*"></label>${recording?'<button type="button" class="lab-button" data-replay-action="remove-video">Remove local video</button>':''}</div><p class="replay-media-note">${recording?`Attached: ${h(recording.name)}. `:''}Local videos remain assigned to their model and episode while this page stays open. They are never uploaded and must be reattached after reload.</p><p id="task-video-status" role="status"></p><div id="task-observations" class="task-replay-observations"></div></section>
   <section class="episode-trace" aria-label="Synchronized model input, output and code"><div class="evidence-panel-heading"><h4>Model trace</h4><span id="task-step-label"></span></div><div id="task-event" class="current-event"></div><div id="task-sync-content"></div></section></div>
   <section class="episode-step-directory"><h4>Steps and code revisions</h4><div class="event-list">${e.events.map((ev,i)=>`<button type="button" data-replay-event="${i}"><time>${ev.time_s.toFixed(1)}s</time><strong>${h(ev.type)}</strong><span>${h(ev.code?.filename||ev.text)}</span></button>`).join('')}</div></section>`;
 }
 function draw(){
  const e=episode();
  host.innerHTML=`<div class="task-replay-toolbar"><label>Results<select id="task-result-source"><option value="official"${source==='official'?' selected':''}>Official results</option><option value="demo"${source==='demo'?' selected':''}>Synthetic preview</option>${saved?`<option value="imported"${source==='imported'?' selected':''}>Local report · unreviewed</option>`:''}</select></label><button type="button" class="lab-button" data-replay-action="import">Import results JSON</button>${saved?'<button type="button" class="text-link" data-replay-action="clear-import">Clear local report</button>':''}<input type="file" id="task-report-upload" accept=".json,application/json" hidden><span>${h(provenance())}</span></div><p id="task-replay-notice" role="status">${h(notice)}</p>${resultTable()}<div class="task-model-picker"><label>Model recording<select id="task-model-select">${models().map(m=>`<option value="${h(m.id)}"${m.id===activeModel?' selected':''}>${h(m.name)} · ${h(m.agent)}</option>`).join('')}</select></label><p>Every model has its own episodes, video attachments and playback position.</p></div>${e?viewer(e):'<div class="task-recording-empty"><h3>No recordings for this model on this task yet.</h3><p>Its performance results remain above. Episode video and timestamped messages will appear here when supplied.</p></div>'}`;
  if(e){updateTime();wireVideo();}
 }
 function updateTime(){
  const e=episode();if(!e||!host?.querySelector('#task-episode-seek'))return;
  time=Math.min(Math.max(time,0),e.duration_s);positions.set(key(e),time);
  const seek=host.querySelector('#task-episode-seek');seek.value=time;seek.setAttribute('aria-valuetext',`${time.toFixed(1)} of ${e.duration_s} seconds`);
  host.querySelector('#task-episode-clock').textContent=`${time.toFixed(1)} / ${e.duration_s}s`;
  host.querySelector('#task-frame-time').textContent=`${time.toFixed(1)}s`;
  const snapshot=Evidence.atTime(e,time),event=snapshot.event;
  host.querySelector('#task-step-label').textContent=snapshot.index<0?'Before first step':`Step ${snapshot.index+1} / ${e.events.length}`;
  host.querySelector('#task-event').textContent=event?`${event.time_s.toFixed(1)}s · ${event.type}`:'Before the first recorded step';
  const content=host.querySelector('#task-sync-content'),stamp=`${e.id}:${snapshot.index}`;
  if(content.dataset.step!==stamp){
   content.dataset.step=stamp;
   const frames=snapshot.images;host.querySelector('#task-observations').innerHTML=frames?`<h4>Model observations · ${frames.time_s.toFixed(1)}s</h4><div class="replay-frame-grid">${frames.images.map(frame=>`<figure><img src="${h(frame.src)}" alt="${h(frame.alt)}" loading="lazy"><figcaption>${h(frame.alt)}</figcaption></figure>`).join('')}</div>`:'';
   const block=(title,record,field)=>`<section class="trace-text-block"><div><h4>${title}</h4><span>${record?`${record.time_s.toFixed(1)}s`:'Not supplied'}</span></div>${record?`<pre>${h(record[field])}</pre>`:Evidence.slot('TEXT',title,'The exact recorded message at this time','trace-missing')}</section>`;
   content.innerHTML=block('Model input',snapshot.input,'input')+block('Model output',snapshot.output,'output')+`<section class="trace-code-block"><div><h4>Code revision</h4><span>${snapshot.code?`${h(snapshot.code.code.filename)} · ${snapshot.code.time_s.toFixed(1)}s`:'No code submitted yet'}</span></div>${snapshot.code?`<pre tabindex="0" aria-label="Code snapshot at ${snapshot.code.time_s} seconds"><code>${h(snapshot.code.code.content)}</code></pre>`:Evidence.slot('CODE','Submitted file snapshot','Code appears at its recorded submission time','trace-missing')}</section>`+(event?`<section class="trace-feedback"><h4>Execution feedback</h4><p>${h(event.text)}</p></section>`:'');
  }
  host.querySelectorAll('[data-replay-event]').forEach(b=>{if(Number(b.dataset.replayEvent)===snapshot.index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  const b=host.querySelector('[data-replay-action="play"]');b.innerHTML=Evidence.playbackIcon(playing);b.setAttribute('aria-label',playing?'Pause':'Play');b.title=playing?'Pause':'Play';
 }
 function seek(value){
  const e=episode();if(!e)return;time=Math.min(Math.max(Number(value)||0,0),e.duration_s);
  const video=host.querySelector('video');if(video?.readyState>=1)video.currentTime=time;updateTime();
 }
 function wireVideo(){
  const video=host.querySelector('video'),e=episode();if(!video)return;
  let restoring=true;const active=()=>host?.querySelector('video')===video;
  video.addEventListener('loadedmetadata',()=>{
   if(!active())return;video.playbackRate=speed;video.currentTime=Math.min(time,video.duration);restoring=false;
   if(Math.abs(video.duration-e.duration_s)>1)host.querySelector('#task-video-status').textContent=`Video duration ${video.duration.toFixed(1)}s differs from the episode’s ${e.duration_s}s. Use a recording on the same clock.`;
  },{once:true});
  video.addEventListener('timeupdate',()=>{if(active()&&!restoring){time=video.currentTime;if(time>=e.duration_s){video.pause();playing=false;}updateTime();}});
  video.addEventListener('play',()=>{if(active()){playing=true;updateTime();}});
  for(const name of ['pause','ended'])video.addEventListener(name,()=>{if(active()){playing=false;updateTime();}});
  video.addEventListener('error',()=>{if(active())host.querySelector('#task-video-status').textContent='Video could not be loaded. Attach an MP4 or WebM recording for this episode.';});
 }
 function play(){
  if(playing){suspend();updateTime();return;}const e=episode();if(!e)return;
  if(time>=e.duration_s)seek(0);playing=true;
  const video=host.querySelector('video');
  if(video){const attempt=++playVersion,version=mountVersion;video.currentTime=time;video.playbackRate=speed;video.play().catch(()=>{if(attempt!==playVersion||version!==mountVersion||host?.querySelector('video')!==video)return;playing=false;updateTime();host.querySelector('#task-video-status').textContent='Playback failed. Check the recording or use its video controls.';});updateTime();return;}
  last=performance.now();const tick=now=>{if(!playing||!host?.isConnected)return;time+=(now-last)/1000*speed;last=now;if(time>=e.duration_s){time=e.duration_s;playing=false;}updateTime();if(playing)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);updateTime();
 }
 function mount(element,task){
  suspend();mountVersion++;host=element;activeTask=task;notice='';
  if(!memoryImport&&!ignoreStored)try{saved=Results.readSaved(sessionStorage);}catch{saved=null;notice='Saved results are unavailable. You can import a report below.';}
  const p=new URLSearchParams(location.search);source=p.get('data')==='demo'?'demo':p.get('data')==='imported'&&saved?'imported':'official';
  const selection=selections.get(taskKey());activeModel=p.get('episodeModel')||selection?.model||models()[0]?.id||'';
  if(!models().some(m=>m.id===activeModel))activeModel=models()[0]?.id||'';
  const linkedEpisode=report().episodes.find(e=>e.task_id===activeTask.id&&e.id===p.get('episode'));
  if(linkedEpisode)activeModel=linkedEpisode.model_id;
  const id=p.get('episode')||selections.get(modelKey())?.episode;activeEpisode=episodes().some(e=>e.id===id)?id:episodes()[0]?.id||'';
  time=episode()?positions.get(key(episode()))||0:0;
  host.onclick=event=>{
   const m=event.target.closest('[data-replay-model]');if(m){chooseModel(m.dataset.replayModel);const title=host.querySelector('#task-recording-title');title?.focus({preventScroll:true});title?.scrollIntoView({block:'start',behavior:'instant'});return;}
   const b=event.target.closest('button');if(!b)return;
   if(b.dataset.replayEvent!==undefined){seek(episode().events[Number(b.dataset.replayEvent)].time_s);return;}
   const action=b.dataset.replayAction;
   if(action==='play')play();
   if(action==='import')host.querySelector('#task-report-upload').click();
   if(action==='remove-video'){suspend();const record=localVideos.get(key(episode()));if(record)URL.revokeObjectURL(record.url);localVideos.delete(key(episode()));draw();}
   if(action==='clear-import'){
    suspend();let removed=true;try{sessionStorage.removeItem(Results.storageKey);}catch{removed=false;}saved=null;memoryImport=false;ignoreStored=true;source='official';activeEpisode='';notice=removed?'Local report cleared.':'Report cleared from this page. Storage removal failed; close this tab to end the stored session.';chooseModel('');
   }
  };
  host.oninput=event=>{if(event.target.id==='task-episode-seek')seek(event.target.value);};
  host.onchange=async event=>{
   const el=event.target;
   if(el.id==='task-model-select')chooseModel(el.value);
   if(el.id==='task-episode-select')chooseEpisode(el.value);
   if(el.id==='task-episode-speed'){speed=Number(el.value);const v=host.querySelector('video');if(v)v.playbackRate=speed;}
   if(el.id==='task-result-source'){suspend();source=el.value;activeEpisode='';notice='';chooseModel('');}
   if(el.id==='task-video-upload'&&el.files[0]){
    const e=episode(),file=el.files[0];if(!file.type.startsWith('video/'))return;
    suspend();const old=localVideos.get(key(e));if(old)URL.revokeObjectURL(old.url);
    localVideos.set(key(e),{url:URL.createObjectURL(file),name:file.name});draw();
   }
   if(el.id==='task-report-upload'&&el.files[0]){
    const versionAtRead=mountVersion,file=el.files[0];
    try{
     if(file.size>5*1024*1024)throw new Error('The report exceeds 5 MB.');
     const raw=JSON.parse(await file.text()),checked=Results.validate(raw);
     if(mountVersion!==versionAtRead||!host?.isConnected)return;
     suspend();for(const [k,v]of localVideos)if(k.startsWith('imported:')){URL.revokeObjectURL(v.url);localVideos.delete(k);positions.delete(k);}
     for(const k of positions.keys())if(k.startsWith('imported:'))positions.delete(k);
     for(const k of selections.keys())if(k.startsWith('imported:'))selections.delete(k);
     saved={report:checked,synthetic:raw.website_data_source==='demo'};source='imported';activeEpisode='';
     notice=`Validated ${checked.models.length} models and ${checked.episodes.length} recordings. Local and unreviewed.`;
     ignoreStored=false;memoryImport=false;try{sessionStorage.setItem(Results.storageKey,JSON.stringify(saved));}catch{memoryImport=true;try{sessionStorage.removeItem(Results.storageKey);}catch{}notice+=' Storage unavailable; results remain on this page only.';}
     chooseModel('');
    }catch(error){if(mountVersion!==versionAtRead||!host?.isConnected)return;notice=`Import failed: ${error.message}`;host.querySelector('#task-replay-notice').textContent=notice;}
   }
   if(['task-model-select','task-episode-select','task-result-source'].includes(el.id))host.querySelector('#'+el.id)?.focus({preventScroll:true});
  };
  draw();syncURL();
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});
 window.addEventListener('pagehide',()=>{suspend();for(const v of localVideos.values())URL.revokeObjectURL(v.url);localVideos.clear();});
 return {mount,suspend,unmount};
})();
