/* Public reporting contract. Demo values are synthetic and never model claims. */
window.Results = (() => {
  const version = 'preview-v1';
  const storageKey='ai4robot-imported-report-v1';
  const official = {schema_version:1,benchmark_version:version,protocol:'preview-v1 / simulation / fixed-interface',environment:'simulation',models:[],results:[],episodes:[]};
  const demoModels = ['A','B','C','D','E'].map((n,i)=>({id:`example-${n.toLowerCase()}`,name:`Example model ${n}`,version:'synthetic-v1',agent:['Synthetic coding agent','Synthetic visual agent','Synthetic coding agent','Synthetic baseline','Synthetic visual agent'][i]}));
  const demo = {...official,models:demoModels,results:[],episodes:[]};
  demoModels.forEach((m,mi)=>TASKS.forEach((t,ti)=>{
    const successes = Math.max(0,Math.min(10,9-mi-((ti*3+mi*2)%6)));
    const progress = successes+(10-successes)*(0.2+((ti+mi)%5)*0.1);
    const duration = 35+ti*7+mi*11;
    demo.results.push({model_id:m.id,task_id:t.id,trials:10,successes,progress_sum:Number(progress.toFixed(3)),duration_sum_s:duration*10});
    const success=successes>=5;
    const texts=[`Initial state and goal: ${t.goal}`,`Allowed observation: cameras and measured body state.`,`Key action: ${t.beats[1]}.`,`${success?'Success':'Failure'} synthetic outcome; actual criterion: ${t.proof}`];
    demo.episodes.push({id:`example-${mi+1}-${t.id.toLowerCase()}`,model_id:m.id,task_id:t.id,status:success?'success':'failure',duration_s:duration,seed:0,layout:0,events:texts.map((text,i)=>({time_s:Math.round(duration*i/3),type:['Goal','Observation','Action','Judgment'][i],text}))});
  }));
  function validate(raw){
    const fail=m=>{throw new Error(m);};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('The report must be a JSON object.');
    if(raw.schema_version!==1)fail('schema_version must be 1.');
    const str=(v,label,max=160)=>{if(typeof v!=='string'||!v.trim()||v.length>max||/[\u0000-\u001f]/.test(v))fail(`${label} must contain 1–${max} text characters.`);return v;};
    const num=(v,label,min=0,max=1e12)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)fail(`${label} is outside its valid range.`);return v;};
    const integer=(v,label,min=0,max=1000000)=>{num(v,label,min,max);if(!Number.isInteger(v))fail(`${label} must be an integer.`);return v;};
    if(raw.environment!=='simulation')fail('Only simulation reports are supported; physical and simulated results cannot be mixed.');
    const clean={schema_version:1,benchmark_version:str(raw.benchmark_version,'benchmark_version'),protocol:str(raw.protocol,'protocol'),environment:'simulation',models:[],results:[],episodes:[]};
    if(!Array.isArray(raw.models)||!raw.models.length||raw.models.length>30)fail('models must contain 1–30 models.');
    const modelIds=new Set(),pairs=new Set(),episodeIds=new Set();
    for(const m of raw.models){
      if(!m||typeof m!=='object')fail('Invalid model definition.');
      const id=str(m.id,'model.id',64);if(!/^[a-zA-Z0-9_-]+$/.test(id)||modelIds.has(id))fail('Model IDs must be unique and use only letters, digits, hyphens or underscores.');modelIds.add(id);
      clean.models.push({id,name:str(m.name,'model.name',80),version:str(m.version,'model.version',80),agent:str(m.agent,'model.agent',80)});
    }
    if(!Array.isArray(raw.results)||raw.results.length>660)fail('results must be an array of at most 660 aggregates.');
    for(const r of raw.results){
      if(!r||!modelIds.has(r.model_id)||!TASKS.some(t=>t.id===r.task_id))fail('A result references an unknown model or task; T18 is excluded.');
      const key=`${r.model_id}/${r.task_id}`;if(pairs.has(key))fail(`Duplicate result: ${key}. Combine trial aggregates first.`);pairs.add(key);
      const trials=integer(r.trials,'trials',1),successes=integer(r.successes,'successes',0,trials);
      clean.results.push({model_id:r.model_id,task_id:r.task_id,trials,successes,progress_sum:num(r.progress_sum,'progress_sum',successes,trials),duration_sum_s:num(r.duration_sum_s,'duration_sum_s')});
    }
    if(raw.episodes!==undefined&&!Array.isArray(raw.episodes))fail('episodes must be an array.');
    if((raw.episodes||[]).length>500)fail('Import at most 500 episodes.');
    const seenCounts=new Map();
    for(const e of raw.episodes||[]){
      if(!e||!modelIds.has(e.model_id)||!TASKS.some(t=>t.id===e.task_id))fail('An episode references an unknown model or task.');
      const id=str(e.id,'episode.id',100);if(episodeIds.has(id))fail('Duplicate episode ID.');episodeIds.add(id);
      if(!pairs.has(`${e.model_id}/${e.task_id}`))fail('Each episode must reference an aggregate result.');
      if(!['success','failure','incomplete'].includes(e.status))fail('Episode status must be success, failure or incomplete.');
      const pairKey=`${e.model_id}/${e.task_id}`,aggregate=clean.results.find(r=>r.model_id===e.model_id&&r.task_id===e.task_id);
      const count=seenCounts.get(pairKey)||{total:0,success:0};count.total++;if(e.status==='success')count.success++;seenCounts.set(pairKey,count);
      if(count.total>aggregate.trials||count.success>aggregate.successes||count.total-count.success>aggregate.trials-aggregate.successes)fail('Episode counts or outcomes contradict their aggregate.');
      const duration=num(e.duration_s,'duration_s',0.001,10000000);
      if(!Array.isArray(e.events)||!e.events.length||e.events.length>200)fail('Each episode requires 1–200 events.');
      let previous=-1;
      const multiline=(value,label,max)=>{if(typeof value!=='string'||!value.trim()||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))fail(`${label} must be nonempty text of at most ${max} characters.`);return value;};
      const events=e.events.map(event=>{
        if(!event)fail('Invalid event.');
        const time=num(event.time_s,'event.time_s',0,duration);
        if(time<previous)fail('Event times must be ordered and within the episode duration.');previous=time;
        const cleanEvent={time_s:time,type:str(event.type,'event.type',30),text:str(event.text,'event.text',1000)};
        for(const key of ['input','output'])if(event[key]!==undefined)cleanEvent[key]=multiline(event[key],`event.${key}`,16000);
        if(event.code!==undefined){
          if(!event.code||typeof event.code!=='object'||Array.isArray(event.code))fail('event.code must contain a filename and content.');
          cleanEvent.code={filename:str(event.code.filename,'code.filename',160),content:multiline(event.code.content,'code.content',64000)};
        }
        return cleanEvent;
      });
      clean.episodes.push({id,model_id:e.model_id,task_id:e.task_id,status:e.status,duration_s:duration,seed:integer(e.seed,'seed'),layout:integer(e.layout,'layout'),events});
    }
    return clean;
  }
  function readSaved(storage){
    const saved=storage.getItem(storageKey);
    if(!saved)return null;
    if(saved.length>5*1024*1024)throw new Error('The saved report exceeds 5 MB.');
    const parsed=JSON.parse(saved);
    return {report:validate(parsed.report||parsed),synthetic:parsed.synthetic===true||parsed.website_data_source==='demo'};
  }
  function summarize(data,ids){
    const taskIds=[...new Set(ids)].filter(id=>TASKS.some(t=>t.id===id));
    const categories=[...new Set(taskIds.map(id=>TASKS.find(t=>t.id===id).category))];
    const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
    return data.models.map(model=>{
      const rows=data.results.filter(r=>r.model_id===model.id&&taskIds.includes(r.task_id));
      const trials=rows.reduce((n,r)=>n+r.trials,0),successes=rows.reduce((n,r)=>n+r.successes,0);
      const pooled=trials?successes/trials:null,coverage=rows.length;
      const categoryRows=categories.map(c=>rows.filter(r=>TASKS.find(t=>t.id===r.task_id).category===c));
      const hasCategories=categoryRows.length>0&&categoryRows.every(rs=>rs.length>0);
      const score=hasCategories?mean(categoryRows.map(rs=>mean(rs.map(r=>r.successes/r.trials)))):null;
      const progress=hasCategories?mean(categoryRows.map(rs=>mean(rs.map(r=>r.progress_sum/r.trials)))):null;
      const z=1.96,den=trials?1+z*z/trials:1;
      const center=trials?(pooled+z*z/(2*trials))/den:0;
      const margin=trials?z*Math.sqrt(pooled*(1-pooled)/trials+z*z/(4*trials*trials))/den:0;
      return {...model,trials,successes,score,pooled,coverage,complete:taskIds.length>0&&coverage===taskIds.length,progress,duration:trials?rows.reduce((n,r)=>n+r.duration_sum_s,0)/trials:null,ci:trials?[center-margin,center+margin]:null};
    });
  }
  function csv(rows){return '\uFEFF'+rows.map(row=>row.map(v=>{let value=String(v??'');if(typeof v==='string'&&/^[=+\-@\t\r]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"';}).join(',')).join('\r\n');}
  return {version,official,demo,validate,summarize,csv,storageKey,readSaved};
})();
