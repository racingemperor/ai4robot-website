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

test('official data has no fabricated model scores; examples cover all 22 tasks',()=>{
  assert.equal(R.official.results.length,0);assert.equal(R.official.models.length,0);
  const d=R.validate(R.demo);assert.equal(d.results.length,88);assert.equal(d.episodes.length,88);
  assert.ok(d.models.every(m=>m.name.startsWith('Example model')));
});
test('category-balanced metrics differ from pooled trials and do not hide missing categories',()=>{
  const result=(task,trials,successes,progress)=>({model_id:'a',task_id:task,trials,successes,progress_sum:progress,duration_sum_s:trials*15});
  const data={models:[{id:'a'}],results:[result('T01',2,1,1.5),result('T02',8,2,4),result('T21',10,10,10),result('T16',5,0,1),result('T14',5,5,5)]};
  const row=R.summarize(data,['T01','T02','T21','T16','T14'])[0];
  assert.equal(row.score,(.375+1+0+1)/4);
  assert.equal(row.progress,(.625+1+.2+1)/4);
  assert.equal(row.pooled,18/30);assert.equal(row.duration,15);assert.equal(row.complete,true);assert.ok(row.ci[0]<row.pooled&&row.ci[1]>row.pooled);
  const partial=R.summarize(data,['T01','T02','T03'])[0];assert.equal(partial.complete,false);assert.equal(partial.coverage,2);assert.equal(partial.score,.375);
  assert.equal(R.summarize(data,['T01','T17'])[0].score,null);
  assert.equal(R.summarize(data,[])[0].score,null);
});
test('catalog preserves the confirmed scope, four categories and latest embodiments',()=>{
  const ts=context.TASKS;assert.equal(ts.length,22);assert.ok(!ts.some(t=>t.id==='T18'));
  assert.deepEqual(['manipulation','navigation','training','construction'].map(c=>ts.filter(t=>t.category===c).length),[14,3,2,3]);
  assert.equal(ts.find(t=>t.id==='T11').track,'A');assert.equal(ts.find(t=>t.id==='T21').robot,'Unitree Go2');assert.equal(ts.find(t=>t.id==='T03').robot,'Franka Panda');
});
test('reject duplicate, excluded, malformed or contradictory results',()=>{
  const changes=[d=>d.results.push(d.results[0]),d=>d.results[0].task_id='T18',d=>d.results[0].successes=11,d=>d.results[0].trials=1.5,d=>d.results[0].duration_sum_s=NaN,d=>d.models[0].id='bad"id',d=>d.results[0].progress_sum=-1,d=>d.environment='real'];
  for(const change of changes){const data=clone(R.demo);change(data);assert.throws(()=>R.validate(data));}
});
test('reject invalid episode references and out-of-order times; strip unknown fields',()=>{
  for(const change of [d=>d.episodes[0].task_id='T18',d=>d.episodes[0].events[1].time_s=-1,d=>d.episodes[0].events[2].time_s=0,d=>d.episodes[0].duration_s=0,d=>d.episodes.push(d.episodes[0]),d=>{d.results[0].trials=1;d.results[0].successes=0;d.results[0].progress_sum=0;d.episodes[0].status='success';}]){const d=clone(R.demo);change(d);assert.throws(()=>R.validate(d));}
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
  for(const change of [e=>e.output='x'.repeat(16001),e=>e.code.content='x'.repeat(64001),e=>e.input='bad\u0000text',e=>e.code=[],e=>e.code.filename='']){
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
