/* A task owns its model results, episode recordings and synchronized traces. */
window.TaskReplay=(()=>{
 const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pct=v=>v==null?'—':`${(v*100).toFixed(1)}%`;
 const positions=new Map(),selections=new Map();
 let selectedEvent=null,channels={input:[],output:[]};
 let host=null,activeTask=null,recordingContext=null,mountVersion=0,playVersion=0,activeModel='',activeEpisode='',modelOpen=false,source='official',playing=false,raf=0,last=0,speed=1,time=0;
 const report=()=>recordingContext?.report||Results[source];
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
  playVersion++;if(!host)return;const e=episode(),video=host.querySelector('video');
  if(e&&video?.readyState>=2)time=Math.min(video.currentTime,e.duration_s);
  if(e)positions.set(key(e),time);
  playing=false;cancelAnimationFrame(raf);video?.pause();
  const button=host.querySelector('[data-replay-action="play"]');if(button){button.innerHTML=Evidence.playbackIcon(false);button.setAttribute('aria-label','Play');}
 }
 function unmount(){suspend();mountVersion++;host=null;activeTask=null;recordingContext=null;}
 function syncURL(){
  if(recordingContext)return;
  const url=new URL(location.href);url.searchParams.set('task',activeTask.id);url.searchParams.delete('section');
  url.searchParams.set('data',source);
  modelOpen&&activeModel?url.searchParams.set('episodeModel',activeModel):url.searchParams.delete('episodeModel');
  const e=episode();modelOpen&&e&&!e.preview?url.searchParams.set('episode',e.id):url.searchParams.delete('episode');
  history.replaceState({},'',url);Site.refreshLinks();
 }
 function chooseEpisode(id){
  suspend();selectedEvent=null;const rows=episodes();activeEpisode=rows.some(e=>e.id===id)?id:rows[0]?.id||'';
  time=episode()?positions.get(key(episode()))||0:0;
  selections.set(taskKey(),{model:activeModel,open:modelOpen});selections.set(modelKey(),{episode:activeEpisode});draw();syncURL();
 }
 function chooseModel(id){
  suspend();activeModel=models().some(m=>m.id===id)?id:models()[0]?.id||'';activeEpisode='';chooseEpisode(selections.get(modelKey())?.episode||'');
 }
 function toggleModel(id){
  if(modelOpen&&id===activeModel){suspend();modelOpen=false;selections.set(taskKey(),{model:activeModel,open:false});draw();syncURL();}
  else{modelOpen=true;chooseModel(id);}
  const button=[...host.querySelectorAll('[data-replay-model]')].find(b=>b.dataset.replayModel===id);
  button?.focus({preventScroll:true});button?.scrollIntoView({block:'nearest',behavior:'instant'});
 }
 function modelList(){
  const stats=Results.summarize(report(),[activeTask.id]);
  return `<section class="task-model-results" aria-labelledby="task-model-results-title"><div class="task-model-results-heading"><h3 id="task-model-results-title">Model performance</h3><p>Select a model to expand its video and trace.</p></div><div class="task-model-columns" aria-hidden="true"><span>Model / harness</span><span>Success rate</span><span>Progress / 100</span><span>Trials</span><span>Recordings</span><span></span></div><div class="task-model-list">${models().map((m,index)=>{
   const s=stats.find(x=>x.id===m.id),count=report().episodes.filter(e=>e.task_id===activeTask.id&&e.model_id===m.id).length,open=modelOpen&&m.id===activeModel;
   const pending=s?.score==null,fill=pending?'':`<i style="width:${Math.max(0,Math.min(100,s.score*100))}%"></i>`,panel=`task-model-panel-${index}`,button=`task-model-toggle-${index}`;
   const e=open?episode():null;
   return `<article class="task-model-item${open?' is-expanded':''}"><h4 class="task-model-heading"><button type="button" class="task-model-summary" id="${button}" data-replay-model="${h(m.id)}" aria-expanded="${open}" aria-controls="${panel}"><span class="task-model-identity">${Results.logo(m)}<span><strong>${h(m.name)}</strong><small>${h(m.agent)}</small></span></span><span class="task-model-success"><span class="sr-only">Success rate: </span><span class="task-success-track${pending?' is-pending':''}" aria-hidden="true">${fill}</span><strong>${pending?'—':pct(s.score)}</strong></span><span class="task-model-stat task-model-progress"><span class="sr-only">Progress out of 100: </span>${s?.progress==null?'—':(s.progress*100).toFixed(1)}</span><span class="task-model-stat task-model-trials"><span class="sr-only">Trials: </span>${s?.trials||'—'}</span><span class="task-model-recordings">${count?`${count} recording${count===1?'':'s'}`:'—'}</span><svg class="task-model-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5"/></svg></button></h4><div class="task-model-panel" id="${panel}" role="region" aria-labelledby="${button}"${open?'':' hidden'}><div class="task-model-panel-content">${open?(e?viewer(e):'<p class="task-recording-empty">No recordings for this model on this task yet.</p>'):''}</div></div></article>`;
  }).join('')||'<p class="task-recording-empty">No models in this report.</p>'}</div></section>`;
 }
 function viewer(e){
  const src=e.video?.src,poster=e.video?.poster;
  channels=Evidence.timeline(e);
  const lane=kind=>`<div class="replay-event-lane replay-${kind}"><span class="replay-lane-label">${kind==='input'?'Input':'Output'}<small>${channels[kind].length}</small></span><div class="replay-event-track" data-replay-channel="${kind}" role="slider" tabindex="${channels[kind].length?'0':'-1'}" aria-label="Model ${kind} events" aria-valuemin="0" aria-valuemax="${channels[kind].length}" aria-valuenow="0"${channels[kind].length?'':' aria-disabled="true"'}><div class="replay-marker-field" aria-hidden="true">${[...new Set(channels[kind].map(ev=>ev.time_s))].map(t=>`<i class="replay-event-mark" data-marker-time="${t}" style="left:${t/e.duration_s*100}%"></i>`).join('')}<i class="replay-lane-cursor"></i></div></div></div>`;
  const stepArrow=direction=>`<svg viewBox="0 0 20 20" aria-hidden="true"><path d="${direction==='previous'?'m12 5-5 5 5 5':'m8 5 5 5-5 5'}"/></svg>`;
  return `<div class="replay-recording-heading"><label>Episode<select id="task-episode-select">${episodes().map(r=>`<option value="${h(r.id)}"${r.id===e.id?' selected':''}>${r.preview?r.id:`${r.id} · ${r.status}`}</option>`).join('')}</select></label><p>${e.preview?'':`${h(e.status)} · seed ${e.seed} · layout ${e.layout}`}</p></div>
   <div class="episode-timeline replay-timeline"><div class="replay-toolbar"><button type="button" class="lab-button playback-toggle" data-replay-action="play" aria-label="Play" title="Play">${Evidence.playbackIcon(false)}</button><output id="task-episode-clock"></output><div class="replay-timeline-legend"><span class="replay-input"><i aria-hidden="true"></i>Model input</span><span class="replay-output"><i aria-hidden="true"></i>Model output</span></div><label>Speed<select id="task-episode-speed">${[0.5,1,2,4].map(v=>`<option value="${v}"${v===speed?' selected':''}>${v}×</option>`).join('')}</select></label></div><div class="replay-event-lanes">${lane('input')}${lane('output')}<div class="replay-scrubber"><input id="task-episode-seek" type="range" min="0" max="${e.duration_s}" step="0.01" value="${time}" aria-label="Episode time"></div><div class="replay-ruler" aria-hidden="true">${[0,.25,.5,.75,1].map(f=>`<span style="left:${f*100}%">${(e.duration_s*f).toFixed(1)}s</span>`).join('')}</div></div></div>
   <div class="episode-synchronized task-recording-layout"><section class="episode-visuals${e.events.some(ev=>ev.images?.length)?' has-observations':''}"><div class="evidence-panel-heading"><h4>Episode video</h4><output id="task-frame-time"></output></div><div class="episode-stage">${src?`<video id="task-episode-video" src="${h(src)}"${poster?` poster="${h(poster)}"`:''} preload="metadata" playsinline controls></video>`:Evidence.slot('VIDEO','Model episode recording','This model’s continuous recording follows the shared timeline','episode-video-slot')}</div><p id="task-video-status" role="status"></p><div id="task-observations" class="task-replay-observations"></div></section>
   <section class="episode-trace" aria-label="Synchronized model input and output"><div class="evidence-panel-heading"><h4>Model trace</h4><div class="replay-step-controls"><button type="button" data-replay-action="previous" aria-label="Previous step" title="Previous step">${stepArrow('previous')}</button><span id="task-step-label"></span><button type="button" data-replay-action="next" aria-label="Next step" title="Next step">${stepArrow('next')}</button></div></div><div id="task-event" class="current-event"></div><div id="task-sync-content"></div></section>
   <section id="task-code-content" class="trace-code-block" aria-label="Submitted code"></section><section class="trace-feedback"><h4>Execution feedback</h4><p id="task-feedback" tabindex="0" aria-label="Execution feedback"></p></section></div>
   <details class="episode-step-directory"><summary>All steps and code revisions · ${e.events.length}</summary><div class="event-list">${e.events.map((ev,i)=>`<button type="button" data-replay-event="${i}"><time>${ev.time_s.toFixed(1)}s</time><strong>${h(ev.type)}</strong><span>${h(ev.code?.filename||ev.text)}</span></button>`).join('')}</div></details>`;
 }
 function draw(){
  const e=episode();
  if(recordingContext){host.innerHTML=e?viewer(e):'<p class="task-recording-empty">No recordings for this model on this task.</p>';if(e){updateTime();wireVideo();}return;}
  host.innerHTML=modelList();
  if(modelOpen&&e){updateTime();wireVideo();}
 }
 function updateTime(){
  const e=episode();if(!e||!host?.querySelector('#task-episode-seek'))return;
  time=Math.min(Math.max(time,0),e.duration_s);
  // Media clocks can land a fraction of a frame before an explicitly selected step.
  if(selectedEvent!==null){const selectedTime=e.events[selectedEvent].time_s;if(Math.abs(selectedTime-time)>.02)selectedEvent=null;else time=selectedTime;}
  positions.set(key(e),time);
  const seek=host.querySelector('#task-episode-seek');seek.value=time;seek.setAttribute('aria-valuetext',`${time.toFixed(1)} of ${e.duration_s} seconds`);
  host.querySelector('#task-episode-clock').textContent=`${time.toFixed(2)} / ${e.duration_s.toFixed(2)}s`;
  host.querySelector('#task-frame-time').textContent=`${time.toFixed(1)}s`;
  const snapshot=Evidence.atTime(e,time,selectedEvent),event=snapshot.event;
  host.querySelector('.replay-timeline').style.setProperty('--timeline-progress',`${time/e.duration_s*100}%`);
  for(const kind of ['input','output']){
   const track=host.querySelector(`[data-replay-channel="${kind}"]`),record=snapshot[kind];
   const position=record?channels[kind].findIndex(ev=>e.events[ev.index]===record)+1:0;
   track.setAttribute('aria-valuenow',position);
   track.setAttribute('aria-valuetext',position?`${kind==='input'?'Input':'Output'} ${position} of ${channels[kind].length}, ${record.time_s.toFixed(2)} seconds, step ${channels[kind][position-1].index+1}`:`No model ${kind} at this time`);
   track.querySelectorAll('[data-marker-time]').forEach(mark=>mark.classList.toggle('is-current',!!record&&Number(mark.dataset.markerTime)===record.time_s));
  }
  host.querySelector('[data-replay-action="previous"]').disabled=snapshot.index<=0;
  host.querySelector('[data-replay-action="next"]').disabled=snapshot.index>=e.events.length-1;
  host.querySelector('#task-step-label').textContent=snapshot.index<0?'Before first step':`Step ${snapshot.index+1} / ${e.events.length}`;
  host.querySelector('#task-event').textContent=event?`${event.time_s.toFixed(2)}s · ${event.type}${event.recorded_at?' · '+event.recorded_at:''}`:'Before the first recorded step';
  host.querySelector('#task-event').title=event?.recorded_at||'';
  const content=host.querySelector('#task-sync-content'),stamp=`${e.id}:${snapshot.index}`;
  if(content.dataset.step!==stamp){
   content.dataset.step=stamp;
   const frames=snapshot.images;host.querySelector('#task-observations').innerHTML=frames?`<h4>Model observations · ${frames.time_s.toFixed(1)}s</h4><div class="replay-frame-grid">${frames.images.map(frame=>`<figure><img src="${h(frame.src)}" alt="${h(frame.alt)}" loading="lazy"><figcaption>${h(frame.alt)}</figcaption></figure>`).join('')}</div>`:'';
   const block=(title,record,field)=>`<section class="trace-text-block replay-${field}"><div><h4><i class="replay-trace-key" aria-hidden="true"></i>${title}</h4><span>${record?`${record.time_s.toFixed(2)}s`:'Not supplied'}</span></div>${record?`<pre tabindex="0" aria-label="${title} at ${record.time_s} seconds">${h(record[field])}</pre>`:Evidence.slot('TEXT',title,'The exact recorded message at this time','trace-missing')}</section>`;
   const codeLabel=snapshot.code?`${snapshot.code.code.filename} · ${snapshot.code.time_s.toFixed(1)}s`:'No code submitted yet';
   content.innerHTML=block('Model input',snapshot.input,'input')+block('Model output',snapshot.output,'output');
   host.querySelector('#task-code-content').innerHTML=`<div><h4>Code / tool call</h4><span title="${h(codeLabel)}">${h(codeLabel)}</span></div>${snapshot.code?`<pre tabindex="0" aria-label="Code snapshot at ${snapshot.code.time_s} seconds"><code>${h(snapshot.code.code.content)}</code></pre>`:Evidence.slot('CODE','Submitted code','Code appears at its recorded submission time','trace-missing')}`;
   host.querySelector('#task-feedback').textContent=event?.text||'';
  }
  host.querySelectorAll('[data-replay-event]').forEach(b=>{if(Number(b.dataset.replayEvent)===snapshot.index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  const b=host.querySelector('[data-replay-action="play"]');b.innerHTML=Evidence.playbackIcon(playing);b.setAttribute('aria-label',playing?'Pause':'Play');b.title=playing?'Pause':'Play';
 }
 function seek(value,eventIndex=null){
  const e=episode();if(!e)return;selectedEvent=eventIndex;time=Math.min(Math.max(Number(value)||0,0),e.duration_s);
  const video=host.querySelector('video');if(video?.readyState>=1)video.currentTime=time;updateTime();
 }
 function selectStep(index){
  const e=episode();if(!e||index<0||index>=e.events.length)return;
  suspend();seek(e.events[index].time_s,index);
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
  video.addEventListener('error',()=>{if(active())host.querySelector('#task-video-status').textContent='Video could not be loaded.';});
 }
 function play(){
  if(playing){suspend();updateTime();return;}const e=episode();if(!e)return;
  if(time>=e.duration_s)seek(0);playing=true;
  const video=host.querySelector('video');
  if(video){const attempt=++playVersion,version=mountVersion;video.currentTime=time;video.playbackRate=speed;video.play().catch(()=>{if(attempt!==playVersion||version!==mountVersion||host?.querySelector('video')!==video)return;playing=false;updateTime();host.querySelector('#task-video-status').textContent='Playback failed. Check the recording or use its video controls.';});updateTime();return;}
  last=performance.now();const tick=now=>{if(!playing||!host?.isConnected)return;time+=(now-last)/1000*speed;last=now;if(time>=e.duration_s){time=e.duration_s;playing=false;}updateTime();if(playing)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);updateTime();
 }
 function mountView(element,task,context=null){
  suspend();selectedEvent=null;mountVersion++;host=element;activeTask=task;recordingContext=context;
  const p=new URLSearchParams(context?'':location.search);source=context?.source||Results.sourceFor(p.get('data'));
  const selection=selections.get(taskKey());activeModel=context?.modelId||p.get('episodeModel')||selection?.model||models()[0]?.id||'';
  if(!models().some(m=>m.id===activeModel))activeModel=models()[0]?.id||'';
  const linkedEpisode=report().episodes.find(e=>e.task_id===activeTask.id&&e.id===p.get('episode'));
  if(linkedEpisode)activeModel=linkedEpisode.model_id;
  modelOpen=!!activeModel&&(!!context||p.has('episodeModel')||!!linkedEpisode||selection?.open===true);
  const id=p.get('episode')||selections.get(modelKey())?.episode;activeEpisode=episodes().some(e=>e.id===id)?id:episodes()[0]?.id||'';
  time=episode()?positions.get(key(episode()))||0:0;
  host.onclick=event=>{
   const m=event.target.closest('[data-replay-model]');if(m){toggleModel(m.dataset.replayModel);return;}
   const track=event.target.closest('[data-replay-channel]');
   if(track){
    const rows=channels[track.dataset.replayChannel];if(!rows.length)return;
    const field=track.querySelector('.replay-marker-field').getBoundingClientRect();
    const target=Math.max(0,Math.min(1,(event.clientX-field.left)/field.width))*episode().duration_s;
    const nearest=rows.reduce((best,row)=>Math.abs(row.time_s-target)<Math.abs(best.time_s-target)?row:best,rows[0]);
    selectStep(nearest.index);track.focus({preventScroll:true});return;
   }
   const b=event.target.closest('button');if(!b)return;
   if(b.dataset.replayEvent!==undefined){selectStep(Number(b.dataset.replayEvent));return;}
   const action=b.dataset.replayAction;
   if(action==='play')play();
   if(action==='previous'||action==='next')selectStep(Evidence.atTime(episode(),time,selectedEvent).index+(action==='next'?1:-1));
  };
  host.onkeydown=event=>{
   const track=event.target.closest('[data-replay-channel]');if(!track)return;
   const rows=channels[track.dataset.replayChannel];if(!rows.length)return;
   const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];if(!keys.includes(event.key))return;
   event.preventDefault();
   const current=Evidence.atTime(episode(),time,selectedEvent).index,position=rows.findLastIndex(row=>row.index<=current);
   const target=event.key==='Home'?0:event.key==='End'?rows.length-1:Math.max(0,Math.min(rows.length-1,position+(['ArrowRight','ArrowUp'].includes(event.key)?1:-1)));
   selectStep(rows[target].index);
  };
  host.oninput=event=>{if(event.target.id==='task-episode-seek')seek(event.target.value);};
  host.onchange=event=>{
   const el=event.target;
   if(el.id==='task-episode-select')chooseEpisode(el.value);
   if(el.id==='task-episode-speed'){speed=Number(el.value);const v=host.querySelector('video');if(v)v.playbackRate=speed;}
   if(el.id==='task-episode-select')host.querySelector('#'+el.id)?.focus({preventScroll:true});
  };
  draw();syncURL();
 }
 const mount=(element,task)=>mountView(element,task);
 const mountRecording=(element,task,context)=>mountView(element,task,context);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();});
 window.addEventListener('pagehide',suspend);
 return {mount,mountRecording,suspend,unmount};
})();
