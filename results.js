/* Public reporting contract. Demo values are synthetic and never model claims. */
window.Results = (() => {
  const version = 'preview-v1';
  const official = {schema_version:1,benchmark_version:version,protocol:'preview-v1 / simulation / fixed-interface',environment:'simulation',models:[],results:[],episodes:[]};
  const roster = Object.freeze([
    ['gpt6-astra','GPT-6-Astra','Codex','openai','svg'],
    ['opus5-5','Claude Opus 5.5','Claude Code','claude','svg'],
    ['gemini-4','Gemini 4','Argon','gemini','png'],
    ['grok-4-7','Grok 4.7','Grok Build','grok','png'],
    ['deepseek-v4-1-flash','DeepSeek V4.1 Flash','DSH','deepseek','png'],
    ['glm-5-3-flash','GLM-5.3-Flash','ZCode','glm','png'],
    ['kimi-k3-1-pro','Kimi K3.1 Pro','Kimi Code','kimi','png'],
    ['minimax-m3-1-flash','MiniMax-M3.1-Flash','MiniMax Code','minimax','png']
  ].map(([id,name,agent,brand,extension])=>Object.freeze({id,name,agent,brand,logo:`assets/model-logos/${brand}.${extension}`,version:name})));
  const brandPatterns=[/gpt|openai|codex/i,/claude|opus|anthropic/i,/gemini|argon/i,/grok|xai/i,/deepseek|\bdsh\b/i,/\bglm|zhipu|zcode/i,/kimi|moonshot/i,/minimax/i];
  function logoPath(model){
    const exact=roster.find(m=>m.id===model.id);
    if(exact)return exact.logo;
    const index=brandPatterns.findIndex(pattern=>pattern.test(`${model.name||''} ${model.id||''}`));
    return index<0?'':roster[index].logo;
  }
  function logo(model){
    const src=logoPath(model);
    return src?`<span class="model-logo" aria-hidden="true"><img src="${src}" alt="" width="28" height="28"></span>`:'';
  }
  const defaultSource=()=>official.models.length?'official':'demo';
  const sourceFor=value=>official.results.length?'official':['official','demo'].includes(value)?value:defaultSource();
  const demoModels = roster.map(({id,name,agent,version})=>({id,name,agent,version}));
  const demo = {...official,models:demoModels,results:[],episodes:[]};
  demoModels.forEach((m,mi)=>TASKS.forEach((t,ti)=>{
    const trials=20,successes=Math.max(0,18-mi-((ti*3+mi*2)%7));
    const progress = successes+(trials-successes)*(0.2+((ti+mi)%5)*0.1);
    const duration = 35+ti*7+mi*11;
    demo.results.push({model_id:m.id,task_id:t.id,trials,successes,progress_sum:Number(progress.toFixed(3)),duration_sum_s:duration*trials});
    const success=successes>=trials/2;
    const texts=[`Initial state and goal: ${t.goal}`,`Allowed observation: cameras and measured body state.`,`Key action: ${t.beats[1]}.`,`${success?'Success':'Failure'} criterion: ${t.proof}`];
    demo.episodes.push({id:`${m.id}-${t.id.toLowerCase()}`,model_id:m.id,task_id:t.id,status:success?'success':'failure',duration_s:duration,seed:0,layout:0,events:texts.map((text,i)=>({time_s:Math.round(duration*i/3),type:['Goal','Observation','Action','Judgment'][i],text,input:i===0?t.goal:'Camera observation and permitted measured state.',output:text,...(i===2?{code:{filename:'policy.py',content:'# policy.py\n# Control program'}}:{})}))});
  }));
  function validate(raw){
    const fail=m=>{throw new Error(m);};
    if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('The report must be a JSON object.');
    if(raw.schema_version!==1)fail('schema_version must be 1.');
    const str=(v,label,max=160)=>{if(typeof v!=='string'||!v.trim()||v.length>max||/[\u0000-\u001f]/.test(v))fail(`${label} must contain 1–${max} text characters.`);return v;};
    const mediaURL=(value,label)=>{
      str(value,label,2048);
      if(!/^https?:\/\/[^\s<>"\\]+$/i.test(value)&&!(/^[a-zA-Z0-9_./%~-][^\s:<>"\\]*$/.test(value)&&!value.startsWith('//')))fail(`${label} must be an HTTP(S) or relative media URL.`);
      return value;
    };
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
    if(!Array.isArray(raw.results)||raw.results.length>30*TASKS.length)fail(`results must be an array of at most ${30*TASKS.length} aggregates.`);
    for(const r of raw.results){
      if(!r||!modelIds.has(r.model_id)||!TASKS.some(t=>t.id===r.task_id))fail('A result references an unknown model or task.');
      const key=`${r.model_id}/${r.task_id}`;if(pairs.has(key))fail(`Duplicate result: ${key}. Combine trial aggregates first.`);pairs.add(key);
      const trials=integer(r.trials,'trials',1),successes=integer(r.successes,'successes',0,trials);
      clean.results.push({model_id:r.model_id,task_id:r.task_id,trials,successes,progress_sum:num(r.progress_sum,'progress_sum',successes,trials),duration_sum_s:num(r.duration_sum_s,'duration_sum_s')});
    }
    if(raw.episodes!==undefined&&!Array.isArray(raw.episodes))fail('episodes must be an array.');
    if((raw.episodes||[]).length>500)fail('A report supports at most 500 episodes.');
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
      if(!Array.isArray(e.events)||!e.events.length||e.events.length>2000)fail('Each episode requires 1–2000 events.');
      let previous=-1;
      const multiline=(value,label,max)=>{if(typeof value!=='string'||!value.trim()||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))fail(`${label} must be nonempty text of at most ${max} characters.`);return value;};
      const events=e.events.map(event=>{
        if(!event)fail('Invalid event.');
        const time=num(event.time_s,'event.time_s',0,duration);
        if(time<previous)fail('Event times must be ordered and within the episode duration.');previous=time;
        const cleanEvent={time_s:time,type:str(event.type,'event.type',30),text:str(event.text,'event.text',1000)};
        for(const key of ['input','output'])if(event[key]!==undefined)cleanEvent[key]=multiline(event[key],`event.${key}`,64000);
        if(event.recorded_at!==undefined){
          const recorded=str(event.recorded_at,'event.recorded_at',40);
          if(!/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(recorded)||!Number.isFinite(Date.parse(recorded)))fail('event.recorded_at must be a UTC timestamp.');
          cleanEvent.recorded_at=recorded;
        }
        if(event.code!==undefined){
          if(!event.code||typeof event.code!=='object'||Array.isArray(event.code))fail('event.code must contain a filename and content.');
          cleanEvent.code={filename:str(event.code.filename,'code.filename',160),content:multiline(event.code.content,'code.content',64000)};
        }
        if(event.images!==undefined){
          if(!Array.isArray(event.images)||event.images.length>4)fail('event.images must contain at most 4 observation frames.');
          cleanEvent.images=event.images.map(image=>({src:mediaURL(image?.src,'image.src'),alt:str(image?.alt,'image.alt',300)}));
        }
        return cleanEvent;
      });
      let video;
      if(e.video!==undefined){
        if(!e.video||typeof e.video!=='object'||Array.isArray(e.video))fail('episode.video requires a media URL.');
        video={src:mediaURL(e.video.src,'video.src')};
        if(e.video.poster!==undefined)video.poster=mediaURL(e.video.poster,'video.poster');
      }
      clean.episodes.push({id,model_id:e.model_id,task_id:e.task_id,status:e.status,duration_s:duration,seed:integer(e.seed,'seed'),layout:integer(e.layout,'layout'),events,...(video?{video}:{})});
    }
    return clean;
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
  if(window.PUBLISHED_RESULTS)Object.assign(official,validate(window.PUBLISHED_RESULTS));
  return {version,official,demo,validate,summarize,csv,roster,logo,logoPath,defaultSource,sourceFor};
})();
