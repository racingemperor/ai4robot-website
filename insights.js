/* Home chart data. Capability annotations describe requirements, never measured difficulty. */
window.Insights = (() => {
 const dimensions=[
  {id:'grounding',name:'Perception & grounding',short:'Grounding'},
  {id:'spatial',name:'Spatial reasoning',short:'Spatial reasoning'},
  {id:'contact',name:'Contact & dexterity',short:'Contact'},
  {id:'control',name:'Motion & coordination',short:'Motion & control'},
  {id:'planning',name:'Planning & feedback',short:'Planning'},
  {id:'learning',name:'Learning & adaptation',short:'Learning'},
  {id:'construction',name:'World modeling',short:'World modeling'}
 ];
 // Each existing task capability is assigned to one or more named dimensions.
 // A dimension's count is the number of the task's three tags that mention it.
 const annotations={
  'Spatial reasoning':['spatial'],
  'Bimanual coordination':['control'],
  'Contact-aware control':['contact','control'],
  'Pose alignment':['spatial'],
  'Precision control':['control'],
  'Contact reasoning':['contact'],
  'Symbol-to-action mapping':['grounding'],
  'Sequential precision':['control','planning'],
  'Feedback and correction':['planning'],
  'Role assignment':['planning'],
  'Geometric planning':['spatial','planning'],
  'Visual-to-motor mapping':['grounding','spatial'],
  'Stroke planning':['planning'],
  'Contact precision':['contact','control'],
  'Language grounding':['grounding'],
  'Grasp and placement':['contact','control'],
  'Constraint preservation':['planning'],
  'Finger coordination':['contact','control'],
  'Relative-motion reasoning':['spatial'],
  'Grasp stability':['contact'],
  'Fine target localization':['grounding','spatial'],
  'Dexterous contact':['contact'],
  'Delicate manipulation':['contact','control'],
  'Whole-body coordination':['control'],
  'Object transport':['contact','control'],
  'Postural stability':['control'],
  'Long-horizon planning':['planning'],
  'Navigation and manipulation':['spatial','contact'],
  'Pose control':['control'],
  'Text-to-stroke planning':['grounding','planning'],
  'Surface contact control':['contact','control'],
  'Upper-body coordination':['control'],
  'In-context rule learning':['grounding','learning'],
  'Transfer to a new layout':['spatial','learning'],
  'Mobile manipulation':['contact','control'],
  'Constraint translation':['grounding','spatial'],
  'Scene construction':['construction'],
  'Physical validation':['construction','contact'],
  'Multi-view spatial reasoning':['grounding','spatial'],
  'Metric reconstruction':['spatial','construction'],
  'Interactive world modeling':['construction'],
  'Motion reconstruction':['construction','control'],
  'Temporal reasoning':['planning'],
  'Physical consistency':['construction','contact'],
  'Reward design':['learning'],
  'Learning-system development':['learning'],
  'Policy generalization':['learning'],
  'Reward and curriculum design':['learning'],
  'Dexterous policy learning':['contact','learning'],
  'Evaluation discipline':['learning','planning'],
  'Visual state estimation':['grounding'],
  'Dynamic control':['control'],
  'Multi-constraint execution':['planning'],
  'Topological reasoning':['spatial','planning'],
  'Deformable-object control':['contact','control'],
  'Exploration planning':['spatial','planning'],
  'Visual grounding':['grounding'],
  'Goal bookkeeping':['planning'],
  'Semantic grounding':['grounding'],
  'Route planning':['spatial','planning'],
  'Completion recognition':['grounding','planning'],
  'Dynamic spatial reasoning':['spatial'],
  'Reactive planning':['planning'],
  'Safe goal completion':['control','planning']
 };
 function profile(task){
  const tags=task.capabilities.map(([name,description])=>({name,description,dimensions:annotations[name]||[]}));
  const counts=dimensions.map(d=>tags.filter(tag=>tag.dimensions.includes(d.id)).length);
  const total=counts.reduce((a,b)=>a+b,0);
  return {tags,counts,weights:counts.map(count=>total?count/total:0)};
 }
 function anchor(index,flat=false){
  const angle=-Math.PI/2+index*2*Math.PI/dimensions.length;
  const z=flat?0:.55*Math.sin(angle*2+.65);
  const norm=Math.sqrt(1+z*z);
  return [Math.cos(angle)/norm,Math.sin(angle)/norm,z/norm];
 }
 function position(task,flat=false){
  return profile(task).weights.reduce((point,weight,i)=>{
   const axis=anchor(i,flat);
   return point.map((value,j)=>value+weight*axis[j]);
  },[0,0,0]);
 }
 function project(point,yaw=0,pitch=0){
  const [x,y,z]=point;
  const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw);
  return [xx,y*Math.cos(pitch)-zz*Math.sin(pitch),y*Math.sin(pitch)+zz*Math.cos(pitch)];
 }
 function topModels(report,metric='score',limit=5){
  const ids=TASKS.map(t=>t.id),key=metric==='progress'?'progress':'score';
  const models=Results.summarize(report,ids).filter(m=>m.complete&&m.score!==null)
   .sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,limit);
  return models.map(model=>({...model,categories:CATEGORIES.map(category=>{
   const row=Results.summarize(report,TASKS.filter(t=>t.category===category.id).map(t=>t.id)).find(m=>m.id===model.id);
   return {id:category.id,value:row?.complete?row[key]:null};
  })}));
 }
 return {dimensions,profile,anchor,position,project,topModels};
})();
