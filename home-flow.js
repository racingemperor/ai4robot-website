/* Selectable, evidence-linked stages for the two Home evaluation routes. */
window.HomeFlow=(()=>{
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const routes={
  program:{
   title:'The agent writes the policy.',
   text:'A coding agent develops a control program, then submits it to the hidden evaluator.',
   note:'The program route covers manipulation and navigation. Policy development, scene generation, and reconstruction use their own artifacts and checks.',
   stages:[
    {name:'Read',label:'Task + robot manual',input:'A natural-language goal, the robot manual and the allowed control interface.',action:'The agent identifies the requested outcome and the robot capabilities it can use.',evidence:'Capture the task definition, manual version and permitted inputs for each run.'},
    {name:'Develop',label:'Observe, test, write policy.py',input:'Permitted observations, simulator feedback and a fixed interaction budget.',action:'The coding agent explores through the SDK and writes the policy artifact.',evidence:'Retain the submitted source, tool calls and development trace for review.'},
    {name:'Execute',label:'Submitted program controls the body',input:'The submitted policy and held-out initial conditions.',action:'The evaluator runs the frozen program and records the robot’s physical actions.',evidence:'Align episode video, observations, program output and execution feedback on one timeline.'},
    {name:'Judge',label:'Hidden state → success + progress',input:'The settled scene and task-specific completion checks.',action:'The evaluator measures success and partial progress after execution.',evidence:'Report task coverage, protocol, success and partial progress with episode provenance.'}
   ]
  },
  direct:{
   title:'The model is the policy.',
   text:'At each step, the model reads an observation and chooses one bounded action; the resulting feedback becomes its next input.',
   note:'The current direct-policy tools cover ARX X5. T02, T06 and T19 have verified replay checks; this route does not yet cover every embodiment.',
   stages:[
    {name:'Observe',label:'RGB + state + calibration',input:'Head and wrist RGB images, measured end-effector state and camera calibration.',action:'The model grounds the instruction in the current observation.',evidence:'Timestamp the RGB images, measured state, calibration and available action budget.'},
    {name:'Decide',label:'Model chooses an action',input:'The latest permitted observation and the task instruction.',action:'The model emits one bounded tool action, such as a target pose or wait.',evidence:'Store the raw model response and parsed action in the same timestamped event.'},
    {name:'Execute',label:'Bounded end-effector command',input:'A validated action within the declared workspace and motion limits.',action:'The environment executes the command and settles before another decision.',evidence:'Align video, command timing and execution feedback on one episode timeline.'},
    {name:'Verify',label:'New observation → final judgment',input:'The next camera images and measured state, followed by the settled final scene.',action:'The model may continue, finish or give up; the judge independently checks the outcome.',evidence:'Record independent success and progress judgments; do not rely on the model’s claim of completion.'}
   ]
  }
 };
 const taskId='T06',categoryId='manipulation';
 function render(routeId='program',selected=0){
  const route=routes[routeId]||routes.program;
  const index=Math.max(0,Math.min(route.stages.length-1,Number(selected)||0));
  const stage=route.stages[index];
  return `<div class="route-copy"><h3>${esc(route.title)}</h3><p>${esc(route.text)}</p></div>
   <ol class="agent-loop" aria-label="${esc(route.title)} stages">${route.stages.map((item,i)=>`<li><button type="button" class="route-stage-button" data-route-step="${i}" aria-pressed="${i===index}" aria-controls="route-stage-detail"><span class="route-stage-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><strong>${esc(item.name)}</strong><span>${esc(item.label)}</span></button></li>`).join('')}</ol>
   <section id="route-stage-detail" class="route-stage-detail" aria-live="polite" aria-atomic="true" aria-label="${esc(stage.name)} stage details">
    <div class="route-stage-heading"><span>STAGE ${String(index+1).padStart(2,'0')} / 04</span><h4>${esc(stage.name)} · ${esc(stage.label)}</h4></div>
    <dl class="route-stage-facts"><div><dt>Input</dt><dd>${esc(stage.input)}</dd></div><div><dt>Model / system step</dt><dd>${esc(stage.action)}</dd></div><div><dt>Evidence to capture</dt><dd>${esc(stage.evidence)}</dd></div></dl>
    <div class="route-stage-links"><a class="text-link" href="${Site.href('tasks',{task:taskId})}">Tasks · inspect ${taskId} ↗</a><a class="text-link" href="${Site.href('leaderboard',{category:categoryId})}">Leaderboard · compare this category ↗</a><a class="text-link" href="${Site.href('episodes',{episodeTask:taskId,category:categoryId})}">Episodes · follow a run ↗</a></div>
   </section><div class="route-note"><strong>Evaluation boundary</strong><p>${esc(route.note)}</p></div>`;
 }
 return {render};
})();
