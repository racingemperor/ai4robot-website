const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function replay({withVideo=false}={}){
 const empty={models:[],results:[],episodes:[]},writes=[],notices={textContent:''},elements=new Map(),playFailures=[];
 const recorded={models:[{id:'model-a',name:'Test model',agent:'Test harness'}],results:[],episodes:[{id:'recording-1',model_id:'model-a',task_id:'T06',duration_s:4,events:[],video:{src:'https://example.test/recording.mp4'}}]};
 const video={currentTime:0,playbackRate:1,pause(){},addEventListener(){},play(){return {catch(callback){playFailures.push(callback);}};}};
 function element(selector){
  if(!elements.has(selector))elements.set(selector,{dataset:{},attributes:{},setAttribute(k,v){this.attributes[k]=v;}});
  return elements.get(selector);
 }
 const context={
  window:{addEventListener(){}},document:{addEventListener(){}},URL,URLSearchParams,
  location:new URL('https://example.test/tasks.html?data=demo'),
  Site:{refreshLinks(){}},Leaderboard:{roster:[]},cancelAnimationFrame(){},
  Results:{official:empty,demo:withVideo?recorded:empty,readSaved:()=>null,validate:v=>v,summarize:()=>[],storageKey:'test-report'},
  sessionStorage:{setItem(key,value){writes.push({key,value});},removeItem(){}}
 };
 context.history={replaceState(_a,_b,url){context.location=new URL(url,context.location);}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../evidence.js'),'utf8'),context);
 context.Evidence=context.window.Evidence;
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../task-replay.js'),'utf8'),context);
 const host={isConnected:true,innerHTML:'',querySelector:s=>s==='video'?(withVideo?video:null):s==='#task-replay-notice'?notices:element(s),querySelectorAll:()=>[]};
 const controller=context.window.TaskReplay;
 controller.mount(host,{id:'T06'});
 function importLater(){
  let resolve,reject;
  const text=new Promise((yes,no)=>{resolve=yes;reject=no;});
  const done=host.onchange({target:{id:'task-report-upload',files:[{size:10,text:()=>text}]}});
  return {done,resolve,reject};
 }
 const clickPlay=()=>host.onclick({target:{closest:s=>s==='button'?{dataset:{replayAction:'play'}}:null}});
 return {context,controller,host,writes,notices,importLater,playFailures,clickPlay,element};
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
