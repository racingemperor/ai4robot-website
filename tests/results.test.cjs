const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../tasks.js'),'utf8'),context);
context.TASKS=context.window.TASKS;
vm.runInContext(fs.readFileSync(path.join(__dirname,'../results.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../evidence.js'),'utf8'),context);
const R=context.window.Results;
const clone=value=>JSON.parse(JSON.stringify(value));

test('official data has no fabricated model scores; examples cover all 23 tasks',()=>{
  assert.equal(R.official.results.length,0);assert.equal(R.official.models.length,0);
  const d=R.validate(R.demo);assert.equal(d.models.length,8);assert.equal(d.results.length,184);assert.equal(d.episodes.length,184);
  assert.deepEqual(Array.from(d.models,m=>m.id),Array.from(R.roster,m=>m.id));
});
test('scores average trials within a task and then weight each task equally across categories',()=>{
  const result=(task,trials,successes,progress)=>({model_id:'a',task_id:task,trials,successes,score_sum:progress,duration_sum_s:trials*15});
  const data={models:[{id:'a'}],results:[result('T01',2,1,1.5),result('T02',8,2,4),result('T21',10,10,10),result('T16',5,0,1),result('T13',5,0,1),result('T14',5,5,5),result('T15',5,0,2),result('T23',2,1,1.5),result('T12',2,0,1),result('T18',2,2,2)]};
  const row=R.summarize(data,['T01','T02','T21','T16','T13','T14','T15','T23','T12','T18'])[0];
  assert.ok(Math.abs(row.score-.63)<1e-12);
  assert.equal(row.duration,15);assert.equal(row.complete,true);
  const partial=R.summarize(data,['T01','T02','T03'])[0];assert.equal(partial.complete,false);assert.equal(partial.coverage,2);assert.equal(partial.score,.625);
  const missing=R.summarize(data,['T01','T17'])[0];assert.equal(missing.score,.75);assert.equal(missing.complete,false);
  assert.equal(R.summarize(data,[])[0].score,null);
});
test('partial trial scores determine the result even when no trial is marked successful',()=>{
  const report={models:[{id:'a'}],results:[
    {model_id:'a',task_id:'T01',trials:1,successes:0,score_sum:.2,duration_sum_s:1},
    {model_id:'a',task_id:'T02',trials:10,successes:0,score_sum:4,duration_sum_s:10},
    {model_id:'a',task_id:'T21',trials:2,successes:0,score_sum:1.8,duration_sum_s:2}
  ]};
  assert.equal(R.taskScore(report.results[1]),.4);
  assert.equal(R.summarize(report,['T01','T02','T21'])[0].score,.5);
  assert.ok(Math.abs(R.summarize(report,['T01','T02'])[0].score-.3)<1e-12);
  assert.equal(R.taskScore(null),null);
});
test('legacy normalized score aggregates remain readable and exports use the canonical score field',()=>{
  const report=clone(R.demo),row=report.results[0];
  row.progress_sum=row.score_sum;delete row.score_sum;
  const clean=R.validate(report).results[0];
  assert.equal(clean.score_sum,row.progress_sum);assert.equal(clean.progress_sum,undefined);
  assert.equal(R.taskScore(row),R.taskScore(clean));
  for(const value of [-1,21,NaN]){const bad=clone(R.demo);bad.results[0].score_sum=value;assert.throws(()=>R.validate(bad));}
});
test('catalog follows all six manuscript categories and restores T18 and trajectory collection',()=>{
  const ts=context.TASKS;assert.equal(ts.length,23);
  assert.deepEqual(Array.from(ts,t=>t.id),Array.from({length:23},(_,i)=>'T'+String(i+1).padStart(2,'0')));
  assert.deepEqual(Array.from(context.window.CATEGORIES,c=>[c.id,c.name,c.count]),[
    ['manipulation','Robotic manipulation',13],['navigation','Navigation',2],
    ['scene-generation','Scene generation and interaction reconstruction',3],
    ['policy-development','Policy development and training',2],
    ['training-data','Training data collection',1],['in-context-learning','In-context learning',2]
  ]);
  assert.deepEqual(Array.from(context.window.CATEGORIES,c=>ts.filter(t=>t.category===c.id).length),[13,2,3,2,1,2]);
  assert.equal(ts.find(t=>t.id==='T13').category,'scene-generation');
  assert.equal(ts.find(t=>t.id==='T14').category,'scene-generation');
  assert.equal(ts.find(t=>t.id==='T15').category,'scene-generation');
  assert.equal(ts.find(t=>t.id==='T12').category,'in-context-learning');
  assert.equal(ts.find(t=>t.id==='T18').category,'in-context-learning');
  assert.equal(ts.find(t=>t.id==='T18').name,'Unfamiliar robot adaptation');
  assert.equal(ts.find(t=>t.id==='T23').category,'training-data');
  assert.equal(ts.find(t=>t.id==='T23').name,'Training trajectory collection');
  assert.equal(ts.find(t=>t.id==='T23').track,'D');
  assert.equal(ts.find(t=>t.id==='T17').category,'policy-development');
  assert.equal(ts.find(t=>t.id==='T11').track,'A');assert.equal(ts.find(t=>t.id==='T21').robot,'Unitree Go2');assert.equal(ts.find(t=>t.id==='T03').robot,'Franka Panda');
});
test('reject duplicate, unknown, malformed or contradictory results',()=>{
  const changes=[d=>d.results.push(d.results[0]),d=>d.results[0].task_id='T24',d=>d.results[0].successes=21,d=>d.results[0].trials=1.5,d=>d.results[0].duration_sum_s=NaN,d=>d.models[0].id='bad"id',d=>d.results[0].score_sum=-1,d=>d.environment='real'];
  for(const change of changes){const data=clone(R.demo);change(data);assert.throws(()=>R.validate(data));}
});
test('reject invalid episode references and out-of-order times; strip unknown fields',()=>{
  for(const change of [d=>d.episodes[0].task_id='T24',d=>d.episodes[0].events[1].time_s=-1,d=>d.episodes[0].events[2].time_s=0,d=>d.episodes[0].duration_s=0,d=>d.episodes.push(d.episodes[0]),d=>{d.results[0].trials=1;d.results[0].successes=0;d.results[0].score_sum=0;d.episodes[0].status='success';}]){const d=clone(R.demo);change(d);assert.throws(()=>R.validate(d));}
  const d=clone(R.demo);d.episodes[0].video_url='https://example.com/private.mp4';d.models[0].html='<script>bad</script>';const clean=R.validate(d);assert.equal(clean.episodes[0].video_url,undefined);assert.equal(clean.models[0].html,undefined);
});
test('CSV escapes quotes and spreadsheet formulas while preserving numeric negatives',()=>{
  const text=R.csv([['a,"b','=1+1','@SUM(A1)',-2]]);assert.ok(text.startsWith('\uFEFF'));assert.ok(text.includes('a,""b'));assert.ok(text.includes("'=1+1"));assert.ok(text.includes("'@SUM"));assert.ok(text.includes('"-2"'));
});

test('episode input, output and code preserve multiline text and strip unknown fields',()=>{
  const d=clone(R.demo),event=d.episodes[0].events[1];
  event.input='Observation\nMeasured state\t0.5';event.output='<script>display only</script>\nResponse';
  event.code={filename:'policy.py',content:'def policy():\n    pass\n',execute:true};event.private_token='not retained';
  const clean=R.validate(d).episodes[0].events[1];
  assert.equal(clean.input,event.input);assert.equal(clean.output,event.output);assert.equal(clean.code.content,event.code.content);
  assert.equal(clean.code.execute,undefined);assert.equal(clean.private_token,undefined);
  for(const change of [e=>e.output='x'.repeat(64001),e=>e.code.content='x'.repeat(64001),e=>e.input='bad\u0000text',e=>e.code=[],e=>e.code.filename='']){
    const invalid=clone(d);change(invalid.episodes[0].events[1]);assert.throws(()=>R.validate(invalid));
  }
});

test('timeline selection never exposes future output or code and retains the latest revision',()=>{
  const E=context.window.Evidence;
  const episode={events:[{time_s:5,type:'Input',input:'first'},{time_s:12,type:'Code',output:'response one',code:{filename:'policy.py',content:'revision one'}},{time_s:20,type:'Feedback',text:'feedback'},{time_s:35,type:'Code',output:'response two',code:{filename:'policy.py',content:'revision two'}}]};
  assert.equal(E.atTime(episode,0).index,-1);assert.equal(E.atTime(episode,0).code,undefined);
  assert.equal(E.atTime(episode,11).output,undefined);
  assert.equal(E.atTime(episode,12).code.code.content,'revision one');
  assert.equal(E.atTime(episode,30).code.code.content,'revision one');
  assert.equal(E.atTime(episode,35).output.output,'response two');
  assert.equal(E.atTime(episode,6).code,undefined);
  const preview=E.preview(context.TASKS.find(t=>t.id==='T06'));
  assert.equal(preview.preview,true);assert.equal(preview.status,'pending');
  assert.equal(E.atTime(preview,58).code.code.content.includes('REVISION 02'),true);
  assert.equal(R.official.episodes.length,0);
});

test('episode media and timestamped observations survive validation while unsafe URLs are rejected',()=>{
 const raw=clone(R.demo);raw.episodes[0].video={src:'media/T01/model-a.mp4',poster:'https://example.test/frame.jpg'};
 raw.episodes[0].events[1].images=[{src:'media/observation.png',alt:'Head camera input'}];
 const clean=R.validate(raw).episodes[0];assert.equal(clean.video.src,'media/T01/model-a.mp4');assert.equal(clean.events[1].images[0].alt,'Head camera input');
 const E=context.window.Evidence;assert.equal(E.atTime(clean,0).images,undefined);assert.equal(E.atTime(clean,clean.events[1].time_s).images.images[0].src,'media/observation.png');
 for(const src of ['javascript:alert(1)','data:text/html,hello','//unknown.test/file.mp4']){const bad=clone(raw);bad.episodes[0].video.src=src;assert.throws(()=>R.validate(bad),/media URL/);}
});

test('all eight roster models resolve to local official logos while unrelated models stay unbranded',()=>{
 for(const m of R.roster){
  const src=R.logoPath(m);assert.ok(fs.existsSync(path.join(__dirname,'..',src)));
  assert.match(R.logo(m),/aria-hidden="true"/);assert.match(R.logo(m),/alt=""/);
  assert.equal(R.logoPath({id:'other-model-id',name:m.name,agent:'Other harness'}),src);
 }
 const unknown={id:'unknown',name:'Unrelated model',agent:'Custom harness',logo:'javascript:alert(1)'};
 assert.equal(R.logoPath(unknown),'');assert.equal(R.logo(unknown),'');
 assert.equal(R.logoPath({id:'qwen',name:'Qwen',agent:'Claude Code'}),'');
 assert.equal(R.defaultSource(),'demo');assert.equal(R.official.models.length,0);
});

test('explicit report sources survive replacing the layout default with real models',()=>{
 assert.equal(R.sourceFor('official'),'official');assert.equal(R.sourceFor('demo'),'demo');
 assert.equal(R.sourceFor(null),'demo');assert.equal(R.sourceFor('imported'),'demo');
 R.official.models.push({id:'measured'});
 try{assert.equal(R.sourceFor('imported'),'official');assert.equal(R.sourceFor(null),'official');assert.equal(R.sourceFor('demo'),'demo');assert.equal(R.sourceFor('official'),'official');}
 finally{R.official.models.pop();}
});
