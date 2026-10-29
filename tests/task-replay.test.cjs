const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function replay({withVideo=false,withResults=false,search,events=[]}={}){
 const empty={models:[],results:[],episodes:[]},elements=new Map(),playFailures=[];
 const recorded={models:[{id:'model-a',name:'Test model',agent:'Test harness'},{id:'model-b',name:'Zero model',agent:'Test harness'},{id:'model-c',name:'Pending model',agent:'Test harness'}],results:[],episodes:[{id:'recording-1',model_id:'model-a',task_id:'T06',duration_s:4,events,video:{src:'https://example.test/recording.mp4'}}]};
 const video={currentTime:0,playbackRate:1,pauseCount:0,listeners:{},pause(){this.pauseCount++;},addEventListener(name,listener){this.listeners[name]=listener;},play(){return {catch(callback){playFailures.push(callback);}};}};
 function element(selector){
  if(!elements.has(selector))elements.set(selector,{dataset:{},attributes:{},style:{setProperty(){}},querySelectorAll:()=>[],setAttribute(k,v){this.attributes[k]=v;},focus(){this.focused=true;},scrollIntoView(){}});
  return elements.get(selector);
 }
 const context={
  window:{addEventListener(){}},document:{addEventListener(){}},URL,URLSearchParams,
  location:new URL('https://example.test/tasks.html'+(search??`?data=demo${withVideo?'&episodeModel=model-a':''}`)),
  Site:{refreshLinks(){}},Leaderboard:{roster:[]},cancelAnimationFrame(){},
  Results:{sourceFor:v=>v==='official'?'official':'demo',defaultSource:()=>'demo',logo:()=>'',official:empty,demo:withVideo||withResults?recorded:empty,summarize:()=>[{id:'model-a',score:.6,progress:.8,trials:10},{id:'model-b',score:0,progress:0,trials:10}]},
  sessionStorage:{getItem(){throw new Error('Published recordings must not read local reports');}}
 };
 context.history={replaceState(_a,_b,url){context.location=new URL(url,context.location);}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../evidence.js'),'utf8'),context);
 context.Evidence=context.window.Evidence;
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../task-replay.js'),'utf8'),context);
 const host={isConnected:true,innerHTML:'',querySelector:s=>s==='video'?(withVideo?video:null):element(s),querySelectorAll:s=>s==='[data-replay-model]'?[...host.innerHTML.matchAll(/data-replay-model="([^"]+)"/g)].map(m=>Object.assign(element('model:'+m[1]),{dataset:{replayModel:m[1]}})):[]};
 const controller=context.window.TaskReplay;
 controller.mount(host,{id:'T06'});
 const clickAction=action=>host.onclick({target:{closest:s=>s==='button'?{dataset:{replayAction:action}}:null}});
 const clickPlay=()=>clickAction('play');
 const clickModel=id=>host.onclick({target:{closest:s=>s==='[data-replay-model]'?{dataset:{replayModel:id}}:null}});
 return {context,controller,host,playFailures,clickPlay,clickAction,clickModel,element,video};
}
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
 r.controller.mountRecording(r.host,{id:'T21'},{modelId:'chosen',source:'official',report});
 assert.equal(r.context.location.href,before);
 assert.match(r.host.innerHTML,/chosen-run/);
 assert.doesNotMatch(r.host.innerHTML,/data-replay-model|task-report-upload/);
 r.host.oninput({target:{id:'task-episode-seek',value:'3.2'}});
 r.controller.unmount();
 r.controller.mountRecording(r.host,{id:'T21'},{modelId:'chosen',source:'official',report});
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

test('step buttons and channel keys inspect same-time messages without revealing future code',()=>{
 const events=[{time_s:0,input:'instruction'},{time_s:0,output:'first response'},{time_s:0,output:'second response',code:{filename:'tool.txt',content:'later code'}},{time_s:4,type:'Judgment',text:'score'}];
 const r=replay({withVideo:true,events});
 r.clickPlay();r.clickAction('previous');
 assert.equal(r.element('[data-replay-action="play"]').attributes['aria-label'],'Play');
 assert.equal(r.element('#task-step-label').textContent,'Step 2 / 4');
 assert.doesNotMatch(r.element('#task-sync-content').innerHTML,/second response/);
 assert.doesNotMatch(r.element('#task-code-content').innerHTML,/later code/);
 r.clickAction('previous');assert.equal(r.element('#task-step-label').textContent,'Step 1 / 4');
 assert.equal(r.element('[data-replay-action="previous"]').disabled,true);
 const key=key=>r.host.onkeydown({key,preventDefault(){},target:{closest:()=>({dataset:{replayChannel:'output'}})}});
 key('ArrowRight');assert.equal(r.element('#task-step-label').textContent,'Step 2 / 4');
 key('ArrowRight');assert.equal(r.element('#task-step-label').textContent,'Step 3 / 4');
 key('Home');assert.equal(r.element('#task-step-label').textContent,'Step 2 / 4');
 key('End');assert.equal(r.element('#task-step-label').textContent,'Step 3 / 4');
 r.clickAction('next');assert.equal(r.element('#task-step-label').textContent,'Step 4 / 4');
 assert.equal(r.element('[data-replay-action="next"]').disabled,true);
});

test('media seek rounding retains the explicitly selected event until the playhead moves away',()=>{
 const r=replay({withVideo:true,events:[{time_s:0,input:'instruction'},{time_s:.3,output:'response'},{time_s:4,type:'Judgment'}]});
 r.video.duration=4;r.video.readyState=4;r.video.listeners.loadedmetadata();
 r.clickAction('next');r.video.currentTime=.299999;r.video.listeners.timeupdate();
 assert.equal(r.element('#task-step-label').textContent,'Step 2 / 3');
 assert.match(r.element('#task-sync-content').innerHTML,/response/);
 assert.equal(r.element('#task-episode-seek').value,.3);
 r.video.currentTime=.1;r.video.listeners.timeupdate();
 assert.equal(r.element('#task-step-label').textContent,'Step 1 / 3');
 assert.doesNotMatch(r.element('#task-sync-content').innerHTML,/response/);
});
