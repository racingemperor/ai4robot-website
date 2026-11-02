const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../tasks.js'),'utf8'),context);
context.TASKS=context.window.TASKS;context.CATEGORIES=context.window.CATEGORIES;
vm.runInContext(fs.readFileSync(path.join(__dirname,'../task-filters.js'),'utf8'),context);
const {normalize,matches,suites}=context.window.TaskFilters;

test('task category, embodiment and delivery mode intersect using the same catalog',()=>{
 const ids=values=>context.TASKS.filter(t=>matches(t,normalize(values))).map(t=>t.id);
 assert.equal(ids({}).length,23);assert(ids({}).includes('T18'));
 assert.deepEqual([...ids({category:'navigation'})],['T21','T22']);
 assert.deepEqual([...ids({category:'navigation',robot:'Unitree Go2',track:'A'})],['T21']);
 assert.equal(ids({category:'navigation',track:'B'}).length,0);
 assert.equal(ids({category:'policy-development',track:'B'}).length,2);
 assert.deepEqual([...ids({category:'in-context-learning'})],['T12','T18']);
 assert.deepEqual([...ids({category:'training-data',track:'D'})],['T23']);
});

test('invalid and retired filter values recover to the complete selection',()=>{
 assert.deepEqual(JSON.parse(JSON.stringify(normalize({category:'old',robot:'unknown',track:'training',group:'dexterity'}))),{category:'all',robot:'all',track:'all'});
 assert.deepEqual(JSON.parse(JSON.stringify(normalize({category:'navigation',robot:'Unitree Go2',track:'A'}))),{category:'navigation',robot:'Unitree Go2',track:'A'});
});

test('all 23 tasks appear once in the six paper suites, in paper order',()=>{
 const groups=suites(context.TASKS);
 assert.deepEqual(Array.from(groups,s=>[s.id,s.tasks.length]),[
  ['manipulation',13],['navigation',2],['scene-generation',3],
  ['policy-development',2],['training-data',1],['in-context-learning',2]
 ]);
 const ids=Array.from(groups,s=>Array.from(s.tasks,t=>t.id)).flat();
 assert.equal(new Set(ids).size,23);
 assert.deepEqual([...ids].sort(),Array.from(context.TASKS,t=>t.id).sort());
 for(const suite of groups){
  assert.equal(suite.count,suite.tasks.length);
  assert.ok(suite.description.length>0);
  assert.ok(suite.tasks.every(t=>t.category===suite.id));
 }
});

test('filtered suites omit empty groups and preserve membership, totals and task order',()=>{
 const filtered=context.TASKS.filter(t=>matches(t,normalize({robot:'Unitree Go2'})));
 const groups=suites(filtered);
 assert.deepEqual(Array.from(groups,s=>[s.id,s.count,Array.from(s.tasks,t=>t.id)]),[
  ['navigation',2,['T21']],['policy-development',2,['T16']]
 ]);
 assert.equal(suites([]).length,0);
 assert.deepEqual(Array.from(suites(context.TASKS.filter(t=>t.category==='in-context-learning'))[0].tasks,t=>t.id),['T12','T18']);
});
