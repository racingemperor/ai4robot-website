/* Media positions and a separate layout preview; never evaluation results. */
window.Evidence = (() => {
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function slot(kind,title,note,extra='') {
  return `<div class="evidence-slot ${extra}" role="group" aria-label="${escape(title)}"><span class="evidence-kind">${escape(kind)}</span><div class="evidence-slot-center"><span class="evidence-cross ${kind==='VIDEO'?'evidence-play':''}" aria-hidden="true">${kind==='VIDEO'?playbackIcon(false):'+'}</span><strong>${escape(title)}</strong><p>${escape(note)}</p></div></div>`;
 }
 function playbackIcon(playing) {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">${playing?'<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>':'<path d="m8 4 12 8-12 8z"/>'}</svg>`;
 }
 function atTime(episode,time) {
  const index=episode.events.findLastIndex(event=>event.time_s<=time);
  const past=episode.events.slice(0,index+1);
  return {index,event:index<0?null:episode.events[index],input:past.findLast(event=>event.input),output:past.findLast(event=>event.output),code:past.findLast(event=>event.code),images:past.findLast(event=>event.images?.length)};
 }
 function preview(task) {
  const steps=[
   [0,'Task input','Instruction and initial context','The exact task instruction, robot manual and allowed context will appear here.'],
   [8,'Observation','First observation','The model receives its camera observations and permitted state.'],
   [22,'Code revision 01','First code submission','The first response and submitted file are reserved here.'],
   [38,'Execution feedback','First execution result','Tool output, errors and execution feedback belong at this time.'],
   [58,'Code revision 02','Revised code submission','A later response and a new file snapshot belong at this time.'],
   [74,'Verification','Verification output','The model checks the result; the video and outputs share this time.'],
   [90,'Final artifact','Final evidence','Final state, judge report and submitted artifact will be attached here.']
  ];
  return {id:`layout-${task.id.toLowerCase()}`,task_id:task.id,model_id:'model-slot-01',status:'pending',duration_s:90,preview:true,events:steps.map(([time_s,type,title,text],index)=>({time_s,type,text:`${title}. ${text}`,input:`[INPUT PLACEHOLDER · STEP ${index+1}]\n${index===0?task.goal:'Exact observations, messages and tool feedback supplied at this step.'}`,output:`[MODEL OUTPUT PLACEHOLDER · STEP ${index+1}]\nThe model's recorded response at ${time_s}s will appear here. This preview contains no model response.`,...(index===2||index===4?{code:{filename:task.track==='A'?'policy.py':task.track==='B'?'train.py':'build_scene.py',content:`# CODE PLACEHOLDER · REVISION ${index===2?'01':'02'}\n# Full file snapshot submitted at ${time_s}s.\n# This is a reserved display area, not generated robot code.`}}:{})}))};
 }
 return {slot,atTime,preview,playbackIcon};
})();
