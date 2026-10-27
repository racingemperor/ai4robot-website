const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function replay({withVideo=false,withResults=false,search}={}){
 const empty={models:[],results:[],episodes:[]},writes=[],notices={textContent:''},elements=new Map(),playFailures=[];
 const recorded={models:[{id:'model-a',name:'Test model',agent:'Test harness'},{id:'model-b',name:'Zero model',agent:'Test harness'},{id:'model-c',name:'Pending model',agent:'Test harness'}],results:[],episodes:[{id:'recording-1',model_id:'model-a',task_id:'T06',duration_s:4,events:[],video:{src:'https://example.test/recording.mp4'}}]};
 const video={currentTime:0,playbackRate:1,pauseCount:0,pause(){this.pauseCount++;},addEventListener(){},play(){return {catch(callback){playFailures.push(callback);}};}};
 function element(selector){
  if(!elements.has(selector))elements.set(selector,{dataset:{},attributes:{},setAttribute(k,v){this.attributes[k]=v;},focus(){this.focused=true;},scrollIntoView(){}});
  return elements.get(selector);
 }
 const context={
  window:{addEventListener(){}},document:{addEventListener(){}},URL,URLSearchParams,
  location:new URL('https://example.test/tasks.html'+(search??`?data=demo${withVideo?'&episodeModel=model-a':''}`)),
  Site:{refreshLinks(){}},Leaderboard:{roster:[]},cancelAnimationFrame(){},
  Results:{sourceFor:v=>v==='official'?'official':'demo',defaultSource:()=>'demo',logo:()=>'',official:empty,demo:withVideo||withResults?recorded:empty,readSaved:()=>null,validate:v=>v,summarize:()=>[{id:'model-a',score:.6,progress:.8,trials:10},{id:'model-b',score:0,progress:0,trials:10}],storageKey:'test-report'},
  sessionStorage:{setItem(key,value){writes.push({key,value});},removeItem(){}}
 };
 context.history={replaceState(_a,_b,url){context.location=new URL(url,context.location);}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../evidence.js'),'utf8'),context);
 context.Evidence=context.window.Evidence;
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../task-replay.js'),'utf8'),context);
 const host={isConnected:true,innerHTML:'',querySelector:s=>s==='video'?(withVideo?video:null):s==='#task-replay-notice'?notices:element(s),querySelectorAll:s=>s==='[data-replay-model]'?[...host.innerHTML.matchAll(/data-replay-model="([^"]+)"/g)].map(m=>Object.assign(element('model:'+m[1]),{dataset:{replayModel:m[1]}})):[]};
 const controller=context.window.TaskReplay;
 controller.mount(host,{id:'T06'});
 function importLater(){
  let resolve,reject;
  const text=new Promise((yes,no)=>{resolve=yes;reject=no;});
  const done=host.onchange({target:{id:'task-report-upload',files:[{size:10,text:()=>text}]}});
  return {done,resolve,reject};
 }
 const clickPlay=()=>host.onclick({target:{closest:s=>s==='button'?{dataset:{replayAction:'play'}}:null}});
 const clickModel=id=>host.onclick({target:{closest:s=>s==='[data-replay-model]'?{dataset:{replayModel:id}}:null}});
 return {context,controller,host,writes,notices,importLater,playFailures,clickPlay,clickModel,element,video};
}
const report={models:[{id:'model-a',name:'Test model',agent:'Test harness'}],results:[],episodes:[]};

test('closing a task cancels a pending import even though the dialog remains connected',async()=>{
 const r=replay(),pending=r.importLater();
 r.controller.unmount();
 r.context.location.searchParams.delete('task');
 const closedURL=r.context.location.href;
 pending.resolve(JSON.stringify(report));await pending.done;
 assert.equal(r.context.location.href,closedURL,'a late import must not reopen the task on reload');
 assert.equal(r.writes.length,0,'a canceled import must not replace the saved report');
});

test('reopening the same task rejects results from the previous pending import',async()=>{
 const r=replay(),pending=r.importLater();
 r.controller.unmount();r.controller.mount(r.host,{id:'T06'});
 pending.resolve(JSON.stringify(report));await pending.done;
 assert.equal(r.context.location.searchParams.get('data'),'demo');
 assert.equal(r.writes.length,0);
});

test('a pending file error after closing leaves the next task untouched',async()=>{
 const r=replay(),pending=r.importLater();
 r.controller.unmount();r.controller.mount(r.host,{id:'T07'});
 pending.reject(new Error('The old file became unavailable'));await pending.done;
 assert.equal(r.notices.textContent,'');
 assert.equal(r.context.location.searchParams.get('task'),'T07');
});

test('an import that finishes in the active task still stores and selects its report',async()=>{
 const r=replay(),pending=r.importLater();
 pending.resolve(JSON.stringify(report));await pending.done;
 assert.equal(r.writes.length,1);
 assert.equal(r.context.location.searchParams.get('data'),'imported');
 assert.equal(r.context.location.searchParams.get('episodeModel'),null,'importing does not force a recording open');
 r.clickModel('model-a');
 assert.equal(r.context.location.searchParams.get('episodeModel'),'model-a');
});

test('closing a task ignores a delayed playback rejection',()=>{
 const r=replay({withVideo:true});r.clickPlay();r.controller.unmount();
 assert.doesNotThrow(()=>r.playFailures[0](new Error('Playback interrupted')));
});

test('an old playback rejection cannot pause a reopened task recording',()=>{
 const r=replay({withVideo:true});r.clickPlay();r.controller.unmount();
 r.controller.mount(r.host,{id:'T06'});r.clickPlay();r.playFailures[0](new Error('Old recording interrupted'));
 assert.equal(r.element('[data-replay-action="play"]').attributes['aria-label'],'Pause');
 assert.equal(r.element('#task-video-status').textContent,undefined);
});

test('an interrupted play request cannot override a newer play request in the same recording',()=>{
 const r=replay({withVideo:true});r.clickPlay();r.clickPlay();r.clickPlay();
 r.playFailures[0](new Error('Old request interrupted'));
 assert.equal(r.element('[data-replay-action="play"]').attributes['aria-label'],'Pause');
});

test('failure of the active playback request remains visible',()=>{
 const r=replay({withVideo:true});r.clickPlay();r.playFailures[0](new Error('Video unavailable'));
 assert.equal(r.element('[data-replay-action="play"]').attributes['aria-label'],'Play');
 assert.match(r.element('#task-video-status').textContent,/Playback failed/);
});

test('task model rows distinguish a 60% fill, measured zero and missing results',()=>{
 const r=replay({withResults:true});
 assert.match(r.host.innerHTML,/width:60%/);
 assert.match(r.host.innerHTML,/60\.0%/);
 assert.match(r.host.innerHTML,/width:0%/);
 assert.match(r.host.innerHTML,/0\.0%/);
 assert.match(r.host.innerHTML,/task-success-track is-pending/);
 assert.equal([...r.host.innerHTML.matchAll(/aria-expanded="false"/g)].length,3);
 assert.doesNotMatch(r.host.innerHTML,/id="task-episode-seek"/,'ordinary task visits start compact');
});

test('a model expands its recording in the same row and switching keeps only one panel open',()=>{
 const r=replay({withResults:true});r.clickModel('model-a');
 assert.equal([...r.host.innerHTML.matchAll(/aria-expanded="true"/g)].length,1);
 assert.match(r.host.innerHTML,/id="task-model-panel-0"[^>]*><div class="task-model-panel-content"><div class="replay-recording-heading"/);
 assert.match(r.host.innerHTML,/id="task-episode-seek"/);
 assert.equal(r.element('model:model-a').focused,true);
 r.clickModel('model-b');
 assert.equal([...r.host.innerHTML.matchAll(/aria-expanded="true"/g)].length,1);
 assert.match(r.host.innerHTML,/id="task-model-panel-0"[^>]* hidden/);
 assert.match(r.host.innerHTML,/No recordings for this model/);
 assert.equal(r.context.location.searchParams.get('episodeModel'),'model-b');
});

test('collapsing a playing model pauses it, clears its deep link and restores its playhead on reopening',()=>{
 const r=replay({withVideo:true});
 r.host.oninput({target:{id:'task-episode-seek',value:'2.4'}});r.clickPlay();
 r.video.readyState=4;r.video.currentTime=2.8;
 const pauses=r.video.pauseCount;r.clickModel('model-a');
 assert.equal(r.video.pauseCount,pauses+1);
 assert.doesNotMatch(r.host.innerHTML,/id="task-episode-seek"/);
 assert.equal(r.context.location.searchParams.get('episodeModel'),null);
 assert.equal(r.context.location.searchParams.get('episode'),null);
 r.clickModel('model-a');
 assert.equal(r.element('#task-episode-seek').value,2.8,'capture the video clock even between timeupdate events');
 assert.equal(r.context.location.searchParams.get('episode'),'recording-1');
});

test('a direct model recording link expands the requested row on arrival',()=>{
 const r=replay({withResults:true,search:'?data=demo&episode=recording-1'});
 assert.match(r.host.innerHTML,/data-replay-model="model-a" aria-expanded="true"/);
 assert.match(r.host.innerHTML,/id="task-episode-seek"/);
});

test('a fixed-model recording keeps leaderboard URL state and only renders that model’s episode',()=>{
 const r=replay({withVideo:true});
 const report={models:[{id:'chosen',name:'Chosen',agent:'Harness'}],results:[],episodes:[{id:'chosen-run',task_id:'T21',model_id:'chosen',duration_s:8,status:'success',seed:1,layout:0,events:[]}]};
 r.context.location=new URL('https://example.test/leaderboard.html?model=chosen&detail=1&replayTask=T21');
 const before=r.context.location.href;
 r.controller.mountRecording(r.host,{id:'T21'},{modelId:'chosen',source:'imported',report});
 assert.equal(r.context.location.href,before);
 assert.match(r.host.innerHTML,/chosen-run/);
 assert.doesNotMatch(r.host.innerHTML,/data-replay-model|task-report-upload/);
 r.host.oninput({target:{id:'task-episode-seek',value:'3.2'}});
 r.controller.unmount();
 r.controller.mountRecording(r.host,{id:'T21'},{modelId:'chosen',source:'imported',report});
 assert.equal(r.element('#task-episode-seek').value,3.2);
 assert.equal(r.context.location.href,before);
});

test('switching fixed-model recordings pauses the old player and ignores its delayed rejection',()=>{
 const r=replay({withVideo:true});
 const report=r.context.Results.demo;
 r.controller.mountRecording(r.host,{id:'T06'},{modelId:'model-a',source:'demo',report});
 r.clickPlay();const pauses=r.video.pauseCount;
 r.controller.mountRecording(r.host,{id:'T21'},{modelId:'model-b',source:'demo',report});
 assert.equal(r.video.pauseCount,pauses+1);
 assert.match(r.host.innerHTML,/No recordings for this model on this task/);
 assert.doesNotThrow(()=>r.playFailures[0](new Error('Old playback interrupted')));
 r.controller.mount(r.host,{id:'T06'});
 assert.match(r.host.innerHTML,/data-replay-model/,'normal Task view is restored after leaving the fixed-model mode');
});

test('replacing or clearing an imported report revokes its media and resets reused episode identities',async()=>{
 const r=replay({withVideo:true}),revoked=[];
 r.context.URL=class extends URL{static createObjectURL(){return 'blob:old-report';}static revokeObjectURL(url){revoked.push(url);}};
 const report=r.context.Results.demo;
 r.controller.mountRecording(r.host,{id:'T06'},{modelId:'model-a',source:'demo',report});
 r.host.oninput({target:{id:'task-episode-seek',value:'1.2'}});
 r.controller.mountRecording(r.host,{id:'T06'},{modelId:'model-a',source:'imported',report});
 await r.host.onchange({target:{id:'task-video-upload',files:[{type:'video/webm',name:'old.webm'}]}});
 r.host.oninput({target:{id:'task-episode-seek',value:'2.4'}});
 assert.match(r.host.innerHTML,/blob:old-report/);
 r.controller.unmount();r.controller.clearImportedRecordings();
 r.controller.mountRecording(r.host,{id:'T06'},{modelId:'model-a',source:'imported',report});
 assert.deepEqual(revoked,['blob:old-report']);assert.doesNotMatch(r.host.innerHTML,/blob:old-report|old.webm/);
 assert.equal(r.element('#task-episode-seek').value,0);
 r.controller.mountRecording(r.host,{id:'T06'},{modelId:'model-a',source:'demo',report});
 assert.equal(r.element('#task-episode-seek').value,1.2,'clearing imported data preserves other sources');
});
