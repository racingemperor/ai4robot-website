const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context={window:{},Site:{href(page,params={}){return `${page}.html?${new URLSearchParams(Object.entries(params).filter(([,v])=>v!==null&&v!==undefined))}`;}}};
vm.createContext(context);
for(const file of ['tasks','results','leaderboard','home-overview']){
 vm.runInContext(fs.readFileSync(path.join(__dirname,`../${file}.js`),'utf8'),context);
 if(file==='tasks'){context.TASKS=context.window.TASKS;context.CATEGORIES=context.window.CATEGORIES;}
 else context[file==='home-overview'?'HomeOverview':file==='results'?'Results':'Leaderboard']=context.window[file==='home-overview'?'HomeOverview':file==='results'?'Results':'Leaderboard'];
}
const {TASKS,Results,HomeOverview}=context;
const model=id=>({id,name:id,version:'v1',agent:'Test harness'});
const result=(id,task,successes)=>({model_id:id,task_id:task.id,trials:10,successes,score_sum:successes,duration_sum_s:10});

test('the empty official Home board reserves models without inventing scores, bars or ranks',()=>{
 const html=HomeOverview.board(Results.official);
 assert.equal((html.match(/data-overall-model=/g)||[]).length,8);
 assert.equal((html.match(/home-rank-number">—/g)||[]).length,8);
 assert.equal((html.match(/is-pending/g)||[]).length,8);
 assert.doesNotMatch(html,/style="width:/);
 assert.match(html,/model=gpt6-astra&amp;detail=1/);
 assert.doesNotMatch(html,/Awaiting evaluation|forthcoming|Synthetic/i);
 assert.equal(Results.official.models.length,0);
});

test('Home ranks by average task score, preserves ties and links to the exact report model',()=>{
 const report={models:['many-manipulation','balanced','tied'].map(model),results:TASKS.flatMap(t=>[
  result('many-manipulation',t,t.category==='manipulation'?10:0),
  result('balanced',t,4),result('tied',t,4)
 ])};
 const html=HomeOverview.board(report,'demo');
 assert.deepEqual([...html.matchAll(/data-overall-model="([^"]+)"/g)].map(m=>m[1]),['many-manipulation','balanced','tied']);
 assert.deepEqual([...html.matchAll(/home-rank-number">([^<]+)/g)].map(m=>m[1]),['1','2','2']);
 assert.match(html,/<strong>40\.0<\/strong>/);assert.match(html,/<strong>56\.5<\/strong>/);
 assert.doesNotMatch(html,/success rate|\d%<\/i>|\d\.\d%<\/strong>/i);
 assert.match(html,/data=demo&amp;model=balanced&amp;detail=1/);
 assert.doesNotMatch(html,/Synthetic|Not measured|Unreviewed/i);
});

test('a genuine zero is drawn, incomplete results stay unranked and report model links remain exact',()=>{
 const report={models:['zero','partial','<unsafe>'].map(model),results:[...TASKS.map(t=>result('zero',t,0)),...TASKS.slice(1).map(t=>result('partial',t,10))]};
 const html=HomeOverview.board(report,'official');
 assert.match(html,/style="width:0%"/);
 assert.match(html,/<strong>0\.0<\/strong>/);
 assert.equal((html.match(/home-rank-number">—/g)||[]).length,2);
 assert.match(html,/22 \/ 23/);
 assert.doesNotMatch(html,/Synthetic|Not measured|Unreviewed/i);
 assert.match(html,/&lt;unsafe&gt;/);assert.doesNotMatch(html,/<unsafe>/);
 assert.match(html,/data=official/);
 assert.equal((html.match(/class="home-rank-logo"/g)||[]).length,3);
});
