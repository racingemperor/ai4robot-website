const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function href(page,overrides={}){
 const params=new URLSearchParams();
 if(page==='episodes'){page='tasks';params.set('section','episodes');}
 for(const [key,value]of Object.entries(overrides))if(value!==null&&value!==undefined&&value!=='')params.set(key,String(value));
 return `${page}.html${params.size?`?${params}`:''}`;
}
function loadHome(){
 const context={window:{},URL,URLSearchParams,location:{href:'https://example.test/',search:'',pathname:'/'},history:{replaceState(){}},sessionStorage:{getItem(){return null}},Site:{href,refreshLinks(){}}};
 vm.createContext(context);
 for(const file of ['tasks','results','insights']){
  vm.runInContext(fs.readFileSync(path.join(__dirname,`../${file}.js`),'utf8'),context);
  if(file==='tasks'){context.TASKS=context.window.TASKS;context.CATEGORIES=context.window.CATEGORIES;}
  if(file==='results')context.Results=context.window.Results;
  if(file==='insights')context.Insights=context.window.Insights;
 }
 return context;
}

test('every evaluation route exposes four selectable stages with detail and all three destinations',()=>{
 const context=loadHome();
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../home-flow.js'),'utf8'),context);
 const flow=context.window.HomeFlow;
 for(const route of ['program','direct'])for(let step=0;step<4;step++){
  const html=flow.render(route,step);
  assert.match(html,new RegExp(`data-route-step="${step}"[^>]*aria-pressed="true"`));
  assert.match(html,/class="route-stage-detail"[^>]*aria-live="polite"/);
  assert.match(html,/href="tasks\.html\?task=T06/);
  assert.match(html,/href="leaderboard\.html\?category=manipulation/);
  assert.match(html,/href="tasks\.html\?section=episodes&episodeTask=T06&category=manipulation/);
 }
});

class Element{
 constructor(dataset={}){this.dataset=dataset;this.attributes={};this.handlers={};this.innerHTML='';this.textContent='';this.value='';this.href='';}
 addEventListener(type,handler){this.handlers[type]=handler;}
 setAttribute(key,value){this.attributes[key]=String(value);}
 getAttribute(key){return this.attributes[key]??null;}
 focus(){this.focused=true;}
 insertAdjacentHTML(){}
 fire(type,target={closest(){return null;}}){this.handlers[type]?.({target,preventDefault(){}});}
}
function clickTarget(selector,element){return {closest(candidate){return candidate===selector?element:null;}};}

test('choosing a category and model updates the in-place result and scoped deep links',()=>{
 const context=loadHome();
 const chartCategoryButtons=context.window.CATEGORIES.map(c=>new Element({homeCategory:c.id}));
 const demoRows=context.window.Insights.topModels(context.window.Results.demo);
 const chartModelButtons=demoRows.map(model=>new Element({homeModel:model.id}));
 const elements={
  '#home-result-source':new Element(),
  '#home-result-metric':new Element(),
  '#home-chart-status':new Element(),
  '#home-leaderboard-link':new Element(),
  '#home-category-chart':new Element(),
  '#home-category-picker':new Element(),
  '#home-category-detail':new Element(),
  '#home-category-selection-status':new Element()
 };
 elements['#home-result-source'].value='official';
 elements['#home-result-metric'].value='score';
 const categoryButtons=context.window.CATEGORIES.map(c=>new Element({homeCategory:c.id}));
 context.document={querySelector(selector){
  const category=selector.match(/^#home-category-chart \[data-home-category="([^"]+)"\]$/)?.[1];
  const model=selector.match(/^#home-category-chart \[data-home-model="([^"]+)"\]$/)?.[1];
  if(category)return chartCategoryButtons.find(button=>button.dataset.homeCategory===category)||null;
  if(model)return chartModelButtons.find(button=>button.dataset.homeModel===model)||null;
  return elements[selector]||null;
 },querySelectorAll(selector){return selector==='[data-home-category]'?[...categoryButtons,...chartCategoryButtons]:[];}};
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../home-insights.js'),'utf8'),context);
 const HomeInsights=context.window.HomeInsights;
 assert.match(HomeInsights.render(),/id="home-category-picker"/);
 HomeInsights.mount();

 const chosen=categoryButtons.find(button=>button.dataset.homeCategory==='scene-generation');
 elements['#home-category-picker'].fire('click',clickTarget('[data-home-category]',chosen));
 assert.equal(chosen.getAttribute('aria-pressed'),'true');
 assert.match(elements['#home-category-detail'].innerHTML,/Scene generation/);
 assert.match(elements['#home-category-detail'].innerHTML,/category=scene-generation/);

 elements['#home-result-source'].value='demo';
 elements['#home-result-source'].fire('change');
 const chartCategory=chartCategoryButtons.find(button=>button.dataset.homeCategory==='navigation');
 elements['#home-category-chart'].fire('click',clickTarget('[data-home-category]',chartCategory));
 assert.equal(chartCategory.focused,true,'the selected chart category should retain keyboard focus after redraw');
 const model=demoRows[0];
 const modelButton=chartModelButtons[0];
 elements['#home-category-chart'].fire('click',clickTarget('[data-home-model]',modelButton));
 assert.equal(modelButton.focused,true,'the selected model should retain keyboard focus after redraw');
 const detail=elements['#home-category-detail'].innerHTML;
 assert.match(detail,new RegExp(model.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 assert.match(detail,/modelQuery=/);
 assert.match(detail,/episodeModel=/);
 assert.doesNotMatch(detail,/tasks\.html[^"\s]*section=episodes[^"\s]*episodeTask=/,'a category episode link should not hide available runs by forcing its first task');
 assert.match(detail,/Synthetic preview · not measured/);
});
