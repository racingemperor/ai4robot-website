const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function site(page='home',search=''){
 const elements=new Map();
 const element=selector=>{
  if(!elements.has(selector))elements.set(selector,{innerHTML:'',open:false,addEventListener(){},setAttribute(){},classList:{remove(){},toggle(){}}});
  return elements.get(selector);
 };
 const context={window:{Theme:{mount(){}},addEventListener(){}},document:{body:{dataset:{page}},querySelector:element,querySelectorAll(){return[];},addEventListener(){}},location:new URL('https://example.test/'+(page==='home'?'index':page)+'.html'+search),URL,URLSearchParams};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../site.js'),'utf8'),context);
 return {Site:context.window.Site,shell:element('#app').innerHTML,sections:element('#page-content').innerHTML};
}

test('all four parent pages expose Home, Task, Leaderboard and Report with one current item and a static logo',()=>{
 for(const page of ['home','tasks','leaderboard','report']){
  const {shell}=site(page);
  const nav=shell.match(/<nav id="primary-nav"[^>]*>(.*?)<\/nav>/)[1];
  assert.deepEqual([...nav.matchAll(/>([^<]+)<\/a>/g)].map(m=>m[1]),['Home','Task','Leaderboard','Report']);
  assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
  assert.match(shell,/<header[^>]*><span class="brand"/);
  assert.doesNotMatch(shell,/<a class="brand"/);
 }
});

test('episode links resolve inside Task with model, category and synthetic source intact',()=>{
 const {Site,sections}=site('tasks','?data=demo&category=manipulation');
 const url=new URL(Site.href('episodes',{episodeTask:'T06',episodeModel:'model-a'}),'https://example.test/');
 assert.equal(url.pathname,'/tasks.html');
 assert.equal(url.searchParams.get('section'),'episodes');
 assert.equal(url.searchParams.get('data'),'demo');
 assert.equal(url.searchParams.get('category'),'manipulation');
 assert.equal(url.searchParams.get('episodeTask'),'T06');
 assert.equal(url.searchParams.get('episodeModel'),'model-a');
 assert.match(sections,/data-section="episodes"/);
 assert.equal(Site.section,'catalog');
 assert.equal(site('tasks','?section=episodes').Site.section,'episodes');
});

test('research aliases resolve to Report and retain the configured task across its views',()=>{
 const {Site}=site('report','?section=run&task=T19');
 for(const [alias,section]of [['method','method'],['run','run'],['about','resources']]){
  const url=new URL(Site.href(alias),'https://example.test/');
  assert.equal(url.pathname,'/report.html');
  assert.equal(url.searchParams.get('section'),section);
  assert.equal(url.searchParams.get('task'),'T19');
 }
 assert.equal(Site.href('home'),'index.html');
 assert.equal(Site.href('documents'),'report.html?task=T19');
});
