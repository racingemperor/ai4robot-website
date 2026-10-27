const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context={window:{}};vm.createContext(context);
for(const file of ['tasks','results','insights']){
 vm.runInContext(fs.readFileSync(path.join(__dirname,`../${file}.js`),'utf8'),context);
 if(file==='tasks'){context.TASKS=context.window.TASKS;context.CATEGORIES=context.window.CATEGORIES;}
 if(file==='results')context.Results=context.window.Results;
}
const {Insights,Results}=context.window;
const tasks=context.TASKS;

test('Home selects the same five complete models by balanced success, retaining that cohort for progress',()=>{
 const rows=Insights.topModels(Results.demo),progress=Insights.topModels(Results.demo,'progress');
 const expected=Results.summarize(Results.demo,tasks.map(t=>t.id)).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 assert.equal(rows.length,5);assert.deepEqual(Array.from(rows,m=>m.id),Array.from(expected.slice(0,5),m=>m.id));
 assert.deepEqual(Array.from(progress,m=>m.id),Array.from(rows,m=>m.id));
 for(const model of rows)for(const category of context.CATEGORIES){
  const expected=Results.summarize(Results.demo,tasks.filter(t=>t.category===category.id).map(t=>t.id)).find(m=>m.id===model.id);
  assert.equal(model.categories.find(c=>c.id===category.id).value,expected.score);
 }
});
test('missing categories and incomplete reports never become top-five model claims',()=>{
 assert.equal(Insights.topModels(Results.official).length,0);
 const partial=JSON.parse(JSON.stringify(Results.demo));
 partial.results=partial.results.filter(r=>!(r.model_id===Results.demo.models[0].id&&r.task_id==='T01'));
 assert.equal(Insights.topModels(partial).length,5);assert.ok(!Insights.topModels(partial).some(m=>m.id===Results.demo.models[0].id));
 for(const category of ['scene-generation','reconstruction','policy-development']){
  const missingCategory=JSON.parse(JSON.stringify(Results.demo));
  missingCategory.results=missingCategory.results.filter(r=>tasks.find(t=>t.id===r.task_id).category!==category);
  assert.equal(Insights.topModels(missingCategory).length,0);
 }
});
test('all 22 tasks have explained qualitative demands across the same seven capabilities',()=>{
 assert.equal(tasks.length,22);assert.equal(Insights.dimensions.length,7);
 assert.ok(!tasks.some(t=>t.id==='T18'));
 for(const task of tasks){
  const profile=Insights.profile(task);assert.equal(profile.length,7);
  assert.deepEqual(Array.from(profile,d=>d.id),Array.from(Insights.dimensions,d=>d.id));
  for(const demand of profile){
   assert.ok(Number.isInteger(demand.value)&&demand.value>=0&&demand.value<=3);
   assert.equal(demand.level,Insights.levels[demand.value].name);
   assert.ok(demand.reason.length>20,`${task.id}: ${demand.id} needs a rationale`);
   if(demand.value>0)assert.notEqual(demand.reason,Insights.levels[0].description);
  }
 }
 // Independent examples from the task goals, not a count of capability tags.
 const pick=Insights.profile(tasks.find(t=>t.id==='T06'));
 assert.equal(pick.find(d=>d.id==='grounding').value,3);
 assert.equal(pick.find(d=>d.id==='learning').value,0);
 assert.equal(Insights.profile(tasks.find(t=>t.id==='T14')).find(d=>d.id==='construction').value,3);
 assert.equal(Insights.profile(tasks.find(t=>t.id==='T16')).find(d=>d.id==='learning').value,3);
});
test('switching capabilities keeps every task in the same clockwise position, including zero-demand tasks',()=>{
 const order=Array.from(tasks,t=>t.id);
 for(const dimension of Insights.dimensions){
  const wave=Insights.waveform(dimension.id);
  assert.deepEqual(Array.from(wave,d=>d.task.id),order);
  assert.equal(wave.length,22);
 }
 const learning=Insights.waveform('learning');
 assert.equal(learning.find(d=>d.task.id==='T12').value,3);
 assert.equal(learning.find(d=>d.task.id==='T21').value,0);
});
