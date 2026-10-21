/* Public reporting contract. Demo values are synthetic and never model claims. */
window.Results = (() => {
  const version = 'preview-v1';
  const official = {schema_version:1,benchmark_version:version,protocol:'preview-v1 / simulation / fixed-interface',environment:'simulation',models:[],results:[],episodes:[]};
  const demoModels = ['A','B','C','D'].map((n,i)=>({id:`example-${n.toLowerCase()}`,name:`示例模型 ${n}`,version:'synthetic-v1',agent:['示例编码智能体','示例视觉智能体','示例编码智能体','示例基线'][i]}));
  const demo = {...official,models:demoModels,results:[],episodes:[]};
  demoModels.forEach((m,mi)=>TASKS.forEach((t,ti)=>{
    const successes = Math.max(0,Math.min(10,9-mi-((ti*3+mi*2)%6)));
    const progress = successes+(10-successes)*(0.2+((ti+mi)%5)*0.1);
    const duration = 35+ti*7+mi*11;
    demo.results.push({model_id:m.id,task_id:t.id,trials:10,successes,progress_sum:Number(progress.toFixed(3)),duration_sum_s:duration*10});
    const success=successes>=5;
    const texts=[`初态与任务：${t.goal}`,`允许的观测：相机与本体状态。`,`关键动作：${t.beats[1]}。`,`${success?'完成':'未完成'}的示例终态；实际判据：${t.proof}`];
    demo.episodes.push({id:`example-${mi+1}-${t.id.toLowerCase()}`,model_id:m.id,task_id:t.id,status:success?'success':'failure',duration_s:duration,seed:0,layout:0,events:texts.map((text,i)=>({time_s:Math.round(duration*i/3),type:['任务','观测','动作','判定'][i],text}))});
  }));
  function validate(raw){
    const fail=m=>{throw new Error(m);};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('报告必须是 JSON 对象。');
    if(raw.schema_version!==1)fail('schema_version 必须为 1。');
    const str=(v,label,max=160)=>{if(typeof v!=='string'||!v.trim()||v.length>max||/[\u0000-\u001f]/.test(v))fail(`${label} 必须是 1–${max} 字符的文本。`);return v;};
    const num=(v,label,min=0,max=1e12)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)fail(`${label} 超出有效范围。`);return v;};
    const integer=(v,label,min=0,max=1000000)=>{num(v,label,min,max);if(!Number.isInteger(v))fail(`${label} 必须为整数。`);return v;};
    if(raw.environment!=='simulation')fail('当前报告仅支持 simulation，不能混合真实与仿真结果。');
    const clean={schema_version:1,benchmark_version:str(raw.benchmark_version,'benchmark_version'),protocol:str(raw.protocol,'protocol'),environment:'simulation',models:[],results:[],episodes:[]};
    if(!Array.isArray(raw.models)||!raw.models.length||raw.models.length>30)fail('models 需要包含 1–30 个模型。');
    const modelIds=new Set(),pairs=new Set(),episodeIds=new Set();
    for(const m of raw.models){
      if(!m||typeof m!=='object')fail('模型定义无效。');
      const id=str(m.id,'model.id',64);if(!/^[a-zA-Z0-9_-]+$/.test(id)||modelIds.has(id))fail('模型 ID 只能含字母、数字、横线或下划线，且必须唯一。');modelIds.add(id);
      clean.models.push({id,name:str(m.name,'model.name',80),version:str(m.version,'model.version',80),agent:str(m.agent,'model.agent',80)});
    }
    if(!Array.isArray(raw.results)||raw.results.length>660)fail('results 应为最多 660 条的数组。');
    for(const r of raw.results){
      if(!r||!modelIds.has(r.model_id)||!TASKS.some(t=>t.id===r.task_id))fail('结果引用了未知模型或任务（不接受 T18）。');
      const key=`${r.model_id}/${r.task_id}`;if(pairs.has(key))fail(`重复结果：${key}。请先合并回合统计。`);pairs.add(key);
      const trials=integer(r.trials,'trials',1),successes=integer(r.successes,'successes',0,trials);
      clean.results.push({model_id:r.model_id,task_id:r.task_id,trials,successes,progress_sum:num(r.progress_sum,'progress_sum',successes,trials),duration_sum_s:num(r.duration_sum_s,'duration_sum_s')});
    }
    if(raw.episodes!==undefined&&!Array.isArray(raw.episodes))fail('episodes 必须为数组。');
    if((raw.episodes||[]).length>500)fail('一次最多导入 500 条回合。');
    const seenCounts=new Map();
    for(const e of raw.episodes||[]){
      if(!e||!modelIds.has(e.model_id)||!TASKS.some(t=>t.id===e.task_id))fail('回合引用了未知模型或任务。');
      const id=str(e.id,'episode.id',100);if(episodeIds.has(id))fail('回合 ID 重复。');episodeIds.add(id);
      if(!pairs.has(`${e.model_id}/${e.task_id}`))fail('回合必须关联一条汇总结果。');
      if(!['success','failure','incomplete'].includes(e.status))fail('回合状态必须为 success、failure 或 incomplete。');
      const pairKey=`${e.model_id}/${e.task_id}`,aggregate=clean.results.find(r=>r.model_id===e.model_id&&r.task_id===e.task_id);
      const count=seenCounts.get(pairKey)||{total:0,success:0};count.total++;if(e.status==='success')count.success++;seenCounts.set(pairKey,count);
      if(count.total>aggregate.trials||count.success>aggregate.successes||count.total-count.success>aggregate.trials-aggregate.successes)fail('回合数量或结果状态与对应汇总不一致。');
      const duration=num(e.duration_s,'duration_s',0.001,10000000);
      if(!Array.isArray(e.events)||!e.events.length||e.events.length>200)fail('每回合需要 1–200 条事件。');
      let previous=-1;
      const events=e.events.map(event=>{if(!event)fail('事件无效。');const time=num(event.time_s,'event.time_s',0,duration);if(time<previous)fail('事件时间须递增且位于回合时长内。');previous=time;return {time_s:time,type:str(event.type,'event.type',30),text:str(event.text,'event.text',1000)};});
      clean.episodes.push({id,model_id:e.model_id,task_id:e.task_id,status:e.status,duration_s:duration,seed:integer(e.seed,'seed'),layout:integer(e.layout,'layout'),events});
    }
    return clean;
  }
  function summarize(data,ids){
    return data.models.map(model=>{
      const rows=data.results.filter(r=>r.model_id===model.id&&ids.includes(r.task_id));
      const trials=rows.reduce((n,r)=>n+r.trials,0),successes=rows.reduce((n,r)=>n+r.successes,0);
      const score=trials?successes/trials:null,coverage=rows.length;
      const z=1.96,den=trials?1+z*z/trials:1;
      const center=trials?(score+z*z/(2*trials))/den:0;
      const margin=trials?z*Math.sqrt(score*(1-score)/trials+z*z/(4*trials*trials))/den:0;
      return {...model,trials,successes,score,coverage,complete:ids.length>0&&coverage===ids.length,progress:trials?rows.reduce((n,r)=>n+r.progress_sum,0)/trials:null,duration:trials?rows.reduce((n,r)=>n+r.duration_sum_s,0)/trials:null,ci:trials?[center-margin,center+margin]:null};
    });
  }
  function csv(rows){return '\uFEFF'+rows.map(row=>row.map(v=>{let value=String(v??'');if(typeof v==='string'&&/^[=+\-@\t\r]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"';}).join(',')).join('\r\n');}
  return {version,official,demo,validate,summarize,csv};
})();
