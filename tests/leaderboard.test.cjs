const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context={window:{}};vm.createContext(context);
for(const file of ['tasks','results','leaderboard']){
 vm.runInContext(fs.readFileSync(path.join(__dirname,`../${file}.js`),'utf8'),context);
 if(file==='tasks'){context.TASKS=context.window.TASKS;context.CATEGORIES=context.window.CATEGORIES;}
 if(file==='results')context.Results=context.window.Results;
}
const Results=context.Results;
const render=options=>context.window.Leaderboard.render({report:Results.official,rows:[],tasks:context.TASKS,source:'official',href:(page,params)=>`${page}.html?${new URLSearchParams(params)}`,...options});

test('the eight requested model/harness pairs are selectable without becoming measured or exported results',()=>{
 const view=render({});
 for(const [model,harness]of [['gpt6-astra','codex'],['opus5.5','claude code'],['gemini 4','argon'],['Grok 4.7','Grok Build'],['deepseek v4.1 flash','dsh'],['glm 5.3 flash','zcode'],['kimi k3.1 pro','kimi code'],['MiniMax-M3.1-Flash','MiniMax Code']]){
  assert(view.html.includes(model));assert(view.html.includes(harness));
 }
 assert.equal((view.html.match(/data-chart-model=/g)||[]).length,8);
 assert(!view.html.includes('class="model-curve"'));
 assert.deepEqual([...view.html.matchAll(/<td class="rank-column">([^<]+)/g)].map(m=>m[1]),Array(8).fill('—'));
 assert.equal((view.detailHTML.match(/data-model-task=/g)||[]).length,22);
 assert(!view.detailHTML.includes('data-model-task="T18"'));assert(view.detailHTML.includes('data-model-task="T23"'));
 assert.equal(Results.official.models.length,0);assert.equal(Results.official.results.length,0);
 assert(!view.detailHTML.includes('class="model-episode-link"'));
});

test('model selection and task filtering preserve the exact task scope and safely recover invalid selections',()=>{
 const view=render({selectedModel:'grok-4-7',taskCategory:'navigation'});
 assert.equal(view.selectedModel,'grok-4-7');assert.equal(view.taskCategory,'navigation');
 assert.deepEqual([...view.detailHTML.matchAll(/data-model-task="(T\d+)"/g)].map(m=>m[1]),['T21','T22','T23']);
 assert.equal(render({selectedModel:'missing',taskCategory:'missing'}).selectedModel,'gpt6-astra');
 assert.equal(render({selectedModel:'missing',taskCategory:'missing'}).taskCategory,'all');
 const legacy=render({modelQuery:'nonexistent'});assert.equal(legacy.selectedModel,'gpt6-astra');assert.equal((legacy.html.match(/data-chart-model=/g)||[]).length,8);assert(!legacy.html.includes('model-search'));
});

test('partial results distinguish zero success from missing data and never receive a rank',()=>{
 const tasks=context.TASKS.filter(t=>['T01','T21'].includes(t.id));
 const report={models:[{id:'partial',name:'Partial model',agent:'Harness',version:'v1'}],results:[{model_id:'partial',task_id:'T01',trials:4,successes:0,progress_sum:1,duration_sum_s:40}],episodes:[]};
 const rows=Results.summarize(report,tasks.map(t=>t.id));
 const view=render({report,rows,tasks,source:'imported'});
 assert.match(view.html,/<td class="rank-column">—/);assert.equal(rows[0].complete,false);assert.match(view.html,/curve-unbranded/);
 const measured=view.detailHTML.match(/data-model-task="T01"[\s\S]*?<\/tr>/)[0];
 const missing=view.detailHTML.match(/data-model-task="T21"[\s\S]*?<\/tr>/)[0];
 assert(measured.includes('0.0%'));assert(measured.includes('25.0'));assert(measured.includes('0 / 4'));
 assert(!missing.includes('0.0%'));assert(missing.includes('overall-track is-pending'));assert(!missing.includes('Awaiting evidence'));
});

test('model selection preserves global ranks and each task has an inline recording disclosure',()=>{
 const tasks=[context.TASKS[0]],report={models:[{id:'first',name:'First model',agent:'Harness',version:'v1'},{id:'second',name:'Second model',agent:'Harness',version:'v1'}],results:[{model_id:'first',task_id:'T01',trials:2,successes:2,progress_sum:2,duration_sum_s:10},{model_id:'second',task_id:'T01',trials:2,successes:1,progress_sum:1.5,duration_sum_s:20}],episodes:[{model_id:'second',task_id:'T01'}]};
 const view=render({report,rows:Results.summarize(report,['T01']),tasks,source:'imported',selectedModel:'second'});
 assert.equal(view.selectedModel,'second');assert.match(view.html,/<td class="rank-column">2/);
 assert.match(view.detailHTML,/data-model-task-toggle="T01" aria-expanded="false" aria-controls="model-task-panel-T01"/);
 assert.match(view.detailHTML,/id="model-task-panel-T01" hidden/);
 assert.match(view.detailHTML,/data-board-task-replay="T01"/);
 assert.doesNotMatch(view.detailHTML,/episodes\.html/);
 assert(view.html.includes('50.0%'));assert(view.detailHTML.includes('75.0'));
});

test('model dossiers and tables omit data-status notices',()=>{
 const view=render({report:Results.demo,rows:Results.summarize(Results.demo,context.TASKS.map(t=>t.id)),source:'imported',synthetic:true});
 assert.doesNotMatch(view.html+view.detailHTML,/Synthetic|unreviewed|forthcoming|model-search|board-search/i);
 assert.match(view.detailHTML,/model-breakdown-title/);
});


test('chart category rates and Overall preserve equal category weighting and the matrix uses all task headers',()=>{
 const tasks=context.TASKS.filter(t=>['T01','T02','T21'].includes(t.id));
 const report={models:[{id:'one',name:'One',agent:'Harness',version:'v1'}],results:[
 {model_id:'one',task_id:'T01',trials:10,successes:0,progress_sum:0,duration_sum_s:10},
 {model_id:'one',task_id:'T02',trials:10,successes:10,progress_sum:10,duration_sum_s:10},
 {model_id:'one',task_id:'T21',trials:10,successes:10,progress_sum:10,duration_sum_s:10}],episodes:[]};
 const options={report,rows:Results.summarize(report,tasks.map(t=>t.id)),tasks,source:'imported'};
 const view=render(options);
 assert.match(view.html,/Robotic manipulation: 50.0%/);assert.match(view.html,/Navigation: 100.0%/);assert.match(view.html,/Overall: 75.0%/);
 for(const id of ['T01','T02','T21'])assert(view.html.includes('data-table-sort="'+id+'"'));
 assert(!render({...options,hiddenModels:['one']}).html.includes('class="model-curve"'));
 assert(render({...options,hiddenModels:['one']}).html.includes('No models selected'));
});

test('task sorting puts missing results last in both directions without changing Overall ranks',()=>{
 const tasks=[context.TASKS[0]],report={models:[{id:'missing',name:'Missing',agent:'H',version:'v1'},{id:'zero',name:'Zero',agent:'H',version:'v1'},{id:'full',name:'Full',agent:'H',version:'v1'}],results:[{model_id:'zero',task_id:'T01',trials:2,successes:0,progress_sum:0,duration_sum_s:2},{model_id:'full',task_id:'T01',trials:2,successes:2,progress_sum:2,duration_sum_s:2}],episodes:[]};
 const options={report,rows:Results.summarize(report,['T01']),tasks,source:'imported',tableSort:'T01'};
 const modelOrder=direction=>[...render({...options,tableDirection:direction}).html.match(/<table class="task-comparison-table">[\s\S]*?<\/table>/)[0].matchAll(/class="table-model" data-board-model="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(modelOrder(-1),['full','zero','missing']);
 assert.deepEqual(modelOrder(1),['zero','full','missing']);
 const ascending=render({...options,tableDirection:1}).html;
 assert.match(ascending,/<td class="rank-column">2<\/td>[\s\S]*?data-board-model="zero"/);
 assert.match(ascending,/<td class="rank-column">1<\/td>[\s\S]*?data-board-model="full"/);
});

test('model logos replace graph markers and table monograms for all eight models',()=>{
 const view=render({report:Results.demo,rows:Results.summarize(Results.demo,context.TASKS.map(t=>t.id)),source:'demo'});
 assert.equal((view.html.match(/class="curve-logo"/g)||[]).length,48);
 assert.doesNotMatch(view.html,/chip-swatch|model-monogram|<circle|model-search/);
 for(const m of Results.roster)assert(view.html.includes(Results.logoPath(m)));
 assert(view.detailHTML.includes(Results.logoPath(Results.roster[0])));
 for(const chip of view.html.matchAll(/<label class="chart-model-chip"[\s\S]*?<\/label>/g))assert.doesNotMatch(chip[0],/data-board-model|<button|<a /);
});
