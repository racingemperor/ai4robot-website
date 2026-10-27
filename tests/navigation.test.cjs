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
 const location=new URL('https://example.test/'+(page==='home'?'index':page)+'.html'+search);
 let redirected;
 location.replace=url=>{redirected=new URL(url,location.href);};
 const context={window:{Theme:{mount(){}},addEventListener(){}},document:{body:{dataset:{page}},querySelector:element,querySelectorAll(){return[];},addEventListener(){}},location,URL,URLSearchParams};
 context.history={replaceState(_a,_b,url){context.location=new URL(url,context.location.href);}};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../site.js'),'utf8'),context);
 return {Site:context.window.Site,shell:element('#app').innerHTML,location:context.location,redirected};
}

test('all six pages separate three project resources from five primary pages',()=>{
 for(const page of ['home','tasks','leaderboard','report','contribute','community']){
  const {shell}=site(page);
  const nav=shell.match(/<nav id="primary-nav"[^>]*>(.*?)<\/nav>/)[1];
  assert.deepEqual([...nav.matchAll(/>([^<]+)<\/a>/g)].map(m=>m[1]),['Home','Task','Leaderboard','Report','Contribute']);
  assert.equal([...nav.matchAll(/aria-current="page"/g)].length,page==='community'?0:1);
  const resources=shell.match(/<nav class="header-resource-links"[^>]*>(.*?)<\/nav>/)[1];
  assert.match(resources,/github.svg/);assert.match(resources,/huggingface.svg/);
  assert.match(resources,/Code<\/a>[\s\S]*Datasets<\/span>[\s\S]*data-site-page="community"/);
  assert.equal([...resources.matchAll(/aria-current="page"/g)].length,page==='community'?1:0);
  assert.match(shell,/<header[^>]*><span class="brand"/);
  assert.doesNotMatch(shell,/<a class="brand"/);
  assert.doesNotMatch(shell,/section-switch|data-section=|board-page-index/);
  assert.match(resources,/href="https:\/\/github.com\/ALEXander22568\/AI4Robot"/);
  assert.match(resources,/<span class="dataset-link" role="link" aria-disabled="true">[\s\S]*Datasets<\/span>/);
  assert.match(shell,/AI for Robots/);
 }
});

test('episode links open the matching task and model directly without a secondary view',()=>{
 const {Site}=site('tasks','?data=demo&category=manipulation');
 const url=new URL(Site.href('episodes',{episodeTask:'T06',episodeModel:'model-a'}),'https://example.test/');
 assert.equal(url.pathname,'/tasks.html');assert.equal(url.searchParams.get('task'),'T06');
 assert.equal(url.searchParams.get('section'),null);assert.equal(url.searchParams.get('episodeTask'),null);
 assert.equal(url.searchParams.get('data'),'demo');assert.equal(url.searchParams.get('episodeModel'),'model-a');
 assert.equal(url.searchParams.get('category'),null,'a recording link must not exclude its target task');
});

test('retired research and comparison aliases open their single parent page without subviews',()=>{
 const {Site}=site('report','?section=run&task=T19');
 for(const alias of ['documents','method','run','about'])assert.equal(Site.href(alias),'report.html');
 assert.equal(Site.href('home'),'index.html');assert.equal(Site.href('compare'),'leaderboard.html');assert.equal(Site.href('matrix'),'leaderboard.html');
});

test('legacy task matrix URLs redirect to the leaderboard with their data source and scope',()=>{
 const {redirected}=site('tasks','?section=matrix&data=demo&category=navigation');
 assert.equal(redirected.pathname,'/leaderboard.html');
 assert.equal(redirected.searchParams.get('section'),null);
 assert.equal(redirected.searchParams.get('data'),'demo');
 assert.equal(redirected.searchParams.get('category'),'navigation');
});

test('legacy replay URLs preserve the episode identity so its task can be resolved before fallback',()=>{
 const {location}=site('tasks','?section=episodes&data=demo&episode=example-1-t21');
 assert.equal(location.searchParams.get('episode'),'example-1-t21');
 assert.equal(location.searchParams.get('task'),null);
 assert.equal(location.searchParams.get('section'),null);
 const explicit=site('tasks','?section=episodes&episodeTask=T23').location;
 assert.equal(explicit.searchParams.get('task'),'T23');
 assert.equal(explicit.searchParams.get('episodeTask'),null);
 assert.equal(site('tasks','?section=episodes').location.searchParams.get('task'),'T06');
});
