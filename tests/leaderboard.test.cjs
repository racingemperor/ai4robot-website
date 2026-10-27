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
 assert.equal((view.html.match(/data-board-model=/g)||[]).length,8);
 assert.deepEqual([...view.html.matchAll(/class="overall-rank">([^<]+)/g)].map(m=>m[1]),Array(8).fill('—'));
 assert.equal((view.html.match(/data-model-task=/g)||[]).length,22);
 assert(!view.html.includes('data-model-task="T18"'));assert(view.html.includes('data-model-task="T23"'));
 assert.equal(Results.official.models.length,0);assert.equal(Results.official.results.length,0);
 assert(!view.html.includes('class="model-episode-link"'));
});

test('model selection and task filtering preserve the exact task scope and safely recover invalid selections',()=>{
 const view=render({selectedModel:'grok-4-7',taskCategory:'navigation'});
 assert.equal(view.selectedModel,'grok-4-7');assert.equal(view.taskCategory,'navigation');
 assert.deepEqual([...view.html.matchAll(/data-model-task="(T\d+)"/g)].map(m=>m[1]),['T21','T22','T23']);
 assert.equal(render({selectedModel:'missing',taskCategory:'missing'}).selectedModel,'gpt6-astra');
 assert.equal(render({selectedModel:'missing',taskCategory:'missing'}).taskCategory,'all');
 const empty=render({modelQuery:'nonexistent'});assert.equal(empty.selectedModel,'');assert(!empty.html.includes('data-model-task='));
});

test('partial results distinguish zero success from missing data and never receive a rank',()=>{
 const tasks=context.TASKS.filter(t=>['T01','T21'].includes(t.id));
 const report={models:[{id:'partial',name:'Partial model',agent:'Harness',version:'v1'}],results:[{model_id:'partial',task_id:'T01',trials:4,successes:0,progress_sum:1,duration_sum_s:40}],episodes:[]};
 const rows=Results.summarize(report,tasks.map(t=>t.id));
 const view=render({report,rows,tasks,source:'imported'});
 assert.match(view.html,/class="overall-rank">—/);assert.match(view.html,/Incomplete coverage; this model is unranked/);
 const measured=view.html.match(/data-model-task="T01"[\s\S]*?<\/tr>/)[0];
 const missing=view.html.match(/data-model-task="T21"[\s\S]*?<\/tr>/)[0];
 assert(measured.includes('0.0%'));assert(measured.includes('25.0'));assert(measured.includes('0 / 4'));
 assert(!missing.includes('0.0%'));assert(missing.includes('Awaiting evidence'));
});

test('search preserves the global rank and replay links retain the selected model and task',()=>{
 const tasks=[context.TASKS[0]],report={models:[{id:'first',name:'First model',agent:'Harness',version:'v1'},{id:'second',name:'Second model',agent:'Harness',version:'v1'}],results:[{model_id:'first',task_id:'T01',trials:2,successes:2,progress_sum:2,duration_sum_s:10},{model_id:'second',task_id:'T01',trials:2,successes:1,progress_sum:1.5,duration_sum_s:20}],episodes:[{model_id:'second',task_id:'T01'}]};
 const view=render({report,rows:Results.summarize(report,['T01']),tasks,source:'imported',modelQuery:'Second'});
 assert.equal(view.selectedModel,'second');assert.match(view.html,/class="overall-rank">02/);
 assert.match(view.html,/episodes\.html\?episodeTask=T01&amp;episodeModel=second/);
 assert(view.html.includes('50.0%'));assert(view.html.includes('75.0'));
});

test('known synthetic imports retain their provenance in the model dossier and task table',()=>{
 const view=render({report:Results.demo,rows:Results.summarize(Results.demo,context.TASKS.map(t=>t.id)),source:'imported',synthetic:true});
 assert.match(view.html,/class="model-detail-status"[^>]*>Synthetic example · Local report · unreviewed/);
 assert.match(view.html,/<caption>[^<]*Synthetic example · Local report · unreviewed/);
});
