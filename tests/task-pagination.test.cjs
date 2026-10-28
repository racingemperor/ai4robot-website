const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context={window:{}};vm.createContext(context);
for(const file of ['tasks','task-pagination'])vm.runInContext(fs.readFileSync(path.join(__dirname,`../${file}.js`),'utf8'),context);
const {TASKS,TaskPagination}=context.window;

test('all 23 tasks occupy three pages of 8, 8 and 7 without repeats or omissions',()=>{
 const pages=[1,2,3].map(page=>TaskPagination.select(TASKS,page));
 assert.deepEqual(pages.map(p=>p.items.length),[8,8,7]);
 assert.deepEqual(pages.map(p=>[p.start,p.end,p.pages]),[[1,8,3],[9,16,3],[17,23,3]]);
 assert.deepEqual(pages.flatMap(p=>[...p.items].map(t=>t.id)),[...TASKS].map(t=>t.id));
});

test('filtered and empty selections clamp pages without showing stale or unrelated tasks',()=>{
 const filtered=TASKS.filter(t=>t.category==='navigation');
 const page=TaskPagination.select(filtered,3);
 assert.equal(page.page,1);assert.equal(page.pages,1);
 assert.deepEqual([...page.items].map(t=>t.id),['T21','T22']);
 const empty=TaskPagination.select([],3);
 assert.equal(empty.page,1);assert.equal(empty.start,0);assert.equal(empty.end,0);assert.equal(empty.items.length,0);
});

test('URL page values normalize safely and overlarge pages land on the last page',()=>{
 for(const value of ['garbage',-1,0,1.5,Infinity,Number.MAX_SAFE_INTEGER+1])assert.equal(TaskPagination.select(TASKS,value).page,1);
 assert.equal(TaskPagination.select(TASKS,'2').page,2);
 assert.equal(TaskPagination.select(TASKS,999).page,3);
});
