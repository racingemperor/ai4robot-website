const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context={window:{}};
vm.createContext(context);
for(const name of ['tasks','gpt6-results','manuscript-results','results','evidence']){
 vm.runInContext(fs.readFileSync(path.join(__dirname,`../${name}.js`),'utf8'),context);
 if(name==='tasks')context.TASKS=context.window.TASKS;
}
const R=context.window.Results,E=context.window.Evidence;

test('original GPT-6 trial aggregates remain intact alongside the manuscript report',()=>{
 const original=R.validate(context.window.PUBLISHED_RESULTS);
 const expected=[['T01',0,.1],['T02',0,.15],['T05',0,.6018],['T06',1,1],['T07',0,.1],['T08',0,0],['T09',1,1],['T10',0,.3],['T11',0,.1],['T19',0,.5857],['T21',0,.322],['T22',0,0]];
 assert.equal(R.official.models.length,8);
 assert.equal(original.results.length,12);
 for(const [task,success,progress] of expected){
  const row=original.results.find(r=>r.task_id===task);
  assert.equal(row.model_id,'gpt6-astra');assert.equal(row.trials,1);
  assert.equal(row.successes,success);assert.ok(Math.abs(row.score_sum-progress)<1e-12);
 }
 const model=R.summarize(original,context.TASKS.map(t=>t.id)).find(m=>m.id==='gpt6-astra');
 assert.equal(model.coverage,12);assert.equal(model.trials,12);assert.equal(model.successes,2);
 assert.equal(model.complete,false);assert.ok(Math.abs(model.score-.3549583333333333)<1e-12);
 assert.equal(R.summarize(original,['T05'])[0].score,.6018);
 assert.equal(R.summarize(original,['T06'])[0].score,1);
 assert.equal(R.summarize(original,['T08'])[0].score,0);
 for(const m of R.summarize(original,['T06']).filter(m=>m.id!=='gpt6-astra'))assert.equal(m.score,null);
 assert.equal(R.defaultSource(),'official');assert.equal(R.sourceFor('demo'),'official');
});

test('the manuscript supplies 23 scores for every model and preserves its reported Overall values',()=>{
 const rows=R.summarize(R.official,context.TASKS.map(t=>t.id));
 assert.equal(R.official.results.length,184);
 const expected=[67,56.6,50.6,47.1,44.2,37.7,39.1,33];
 rows.forEach((m,i)=>{
  assert.ok(Math.abs(m.score*100-expected[i])<1e-10);
  assert.equal(m.coverage,23);assert.equal(m.complete,true);assert.equal(m.trials,69);
  assert.equal(m.duration,null);assert.equal(m.successes,null);
 });
 const scores=id=>R.summarize(R.official,[id]).map(m=>Math.round(m.score*100));
 assert.deepEqual(Array.from(scores('T01')),[78,78,77,62,66,59,45,47]);
 assert.deepEqual(Array.from(scores('T05')),[75,79,72,70,76,66,54,39]);
 assert.deepEqual(Array.from(scores('T23')),[57,39,49,22,53,33,48,25]);
 const navigation=R.summarize(R.official,['T21','T22']);
 assert.ok(Math.abs(navigation[0].score-.755)<1e-12);
 assert.equal(navigation[0].coverage,2);assert.equal(navigation[0].trials,6);
 assert.ok(R.official.results.every(r=>!('successes' in r)&&!('duration_sum_s' in r)));
 assert.deepEqual(JSON.parse(JSON.stringify(R.official.episodes)),JSON.parse(JSON.stringify(context.window.PUBLISHED_RESULTS.episodes)));
});

test('all twelve recordings have valid media, complete histories and original model turn timestamps',()=>{
 assert.equal(R.official.episodes.length,12);
 assert.equal(R.official.episodes.reduce((sum,e)=>sum+e.events.length,0),3001);
 for(const e of R.official.episodes){
  assert.ok(fs.existsSync(path.join(__dirname,'..',e.video.poster)));
  assert.ok(fs.existsSync(path.join(__dirname,'..',e.video.src)));
  assert.equal(e.events.at(-1).type,'Judgment');assert.equal(e.events.at(-1).time_s,e.duration_s);
  assert.equal(e.events.at(-1).input,undefined,'post-episode judging is never supplied to the model');
  assert.notEqual(E.atTime(e,e.duration_s).input?.type,'Judgment');
  assert.ok(e.events.filter(ev=>ev.type==='Model turn').every(ev=>ev.recorded_at&&ev.output));
  assert.ok(e.events.some(ev=>ev.code?.content));
  assert.ok(e.events.every((ev,index)=>!index||ev.time_s>=e.events[index-1].time_s));
 }
});

test('steps sharing a simulation timestamp can be inspected separately without showing later messages',()=>{
 const episode={events:[{time_s:0,input:'instruction'},{time_s:0,output:'first response'},{time_s:0,output:'second response',code:{content:'later code'}}]};
 assert.equal(E.atTime(episode,0,0).output,undefined);
 assert.equal(E.atTime(episode,0,1).output.output,'first response');
 assert.equal(E.atTime(episode,0,1).code,undefined);
 assert.equal(E.atTime(episode,0).output.output,'second response');
});

test('timeline channels preserve every input/output at its recorded time and exclude judging',()=>{
 for(const episode of R.official.episodes){
  const channels=E.timeline(episode);
  for(const kind of ['input','output']){
   assert.equal(channels[kind].length,episode.events.filter(ev=>ev[kind]).length);
   for(const item of channels[kind]){
    const ev=episode.events[item.index];assert.ok(ev[kind]);assert.equal(item.time_s,ev.time_s);
    assert.notEqual(ev.type,'Judgment');
   }
  }
 }
 const channels=E.timeline({events:[{time_s:0,input:'a'},{time_s:0,input:'b',output:'c'},{time_s:3,output:'d'},{time_s:4,type:'Judgment'}]});
 assert.deepEqual(Array.from(channels.input,x=>x.index),[0,1]);
 assert.deepEqual(Array.from(channels.output,x=>x.index),[1,2]);
});
