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
 assert.equal(rows.length,5);assert.deepEqual(Array.from(rows,m=>m.id),Array.from(expected,m=>m.id));
 assert.deepEqual(Array.from(progress,m=>m.id),Array.from(rows,m=>m.id));
 for(const model of rows)for(const category of context.CATEGORIES){
  const expected=Results.summarize(Results.demo,tasks.filter(t=>t.category===category.id).map(t=>t.id)).find(m=>m.id===model.id);
  assert.equal(model.categories.find(c=>c.id===category.id).value,expected.score);
 }
});
test('missing categories and incomplete reports never become top-five model claims',()=>{
 assert.equal(Insights.topModels(Results.official).length,0);
 const partial=JSON.parse(JSON.stringify(Results.demo));
 partial.results=partial.results.filter(r=>!(r.model_id==='example-a'&&r.task_id==='T01'));
 assert.equal(Insights.topModels(partial).length,4);assert.ok(!Insights.topModels(partial).some(m=>m.id==='example-a'));
 partial.results=partial.results.filter(r=>tasks.find(t=>t.id===r.task_id).category!=='training');
 assert.equal(Insights.topModels(partial).length,0);
});
test('every catalog capability has an explicit mapping and normalized task vector',()=>{
 const ids=Insights.dimensions.map(d=>d.id);assert.equal(ids.length,7);assert.equal(tasks.length,22);
 for(const task of tasks){
  const profile=Insights.profile(task);
  assert.equal(profile.tags.length,3);assert.equal(profile.counts.length,7);
  for(const tag of profile.tags){assert.ok(tag.dimensions.length,`${task.id}: ${tag.name}`);assert.ok(tag.dimensions.every(id=>ids.includes(id)));}
  assert.ok(profile.counts.every(n=>Number.isInteger(n)&&n>=0&&n<=3));
  assert.ok(Math.abs(profile.weights.reduce((a,b)=>a+b,0)-1)<1e-12);
 }
 const locomotion=Insights.profile(tasks.find(t=>t.id==='T16'));
 assert.equal(locomotion.counts[ids.indexOf('learning')],3);
 const navigation=Insights.profile(tasks.find(t=>t.id==='T23'));
 assert.equal(navigation.counts[ids.indexOf('planning')],2);
});
test('task points are derived from all annotated dimensions and rotation preserves geometry',()=>{
 for(const task of tasks){
  for(const flat of [false,true]){
   const weights=Insights.profile(task).weights;
   const expected=[0,1,2].map(axis=>weights.reduce((sum,w,i)=>sum+w*Insights.anchor(i,flat)[axis],0));
   const point=Insights.position(task,flat),rotated=Insights.project(point,.7,-.3);
   assert.deepEqual(Array.from(point),expected);assert.ok(point.every(Number.isFinite));
   assert.ok(Math.hypot(...point)<=1+1e-12);
   assert.ok(Math.abs(Math.hypot(...point)-Math.hypot(...rotated))<1e-12);
   if(flat)assert.equal(point[2],0);
  }
 }
});
