const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../tasks.js'),'utf8'),context);
context.TASKS=context.window.TASKS;context.CATEGORIES=context.window.CATEGORIES;
vm.runInContext(fs.readFileSync(path.join(__dirname,'../task-filters.js'),'utf8'),context);
const {normalize,matches}=context.window.TaskFilters;

test('task category, embodiment and delivery mode intersect using the same catalog',()=>{
 const ids=values=>context.TASKS.filter(t=>matches(t,normalize(values))).map(t=>t.id);
 assert.equal(ids({}).length,22);assert(!ids({}).includes('T18'));
 assert.deepEqual([...ids({category:'navigation'})],['T21','T22','T23']);
 assert.deepEqual([...ids({category:'navigation',robot:'Unitree Go2',track:'A'})],['T21']);
 assert.equal(ids({category:'navigation',track:'B'}).length,0);
 assert.equal(ids({category:'policy-development',track:'B'}).length,2);
});

test('invalid and retired filter values recover to the complete selection',()=>{
 assert.deepEqual(JSON.parse(JSON.stringify(normalize({category:'old',robot:'unknown',track:'training',group:'dexterity'}))),{category:'all',robot:'all',track:'all'});
 assert.deepEqual(JSON.parse(JSON.stringify(normalize({category:'navigation',robot:'Unitree Go2',track:'A'}))),{category:'navigation',robot:'Unitree Go2',track:'A'});
});
