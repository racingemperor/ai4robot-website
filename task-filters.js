/* Shared paper categories, embodiments and deliverables for both task views. */
window.TaskFilters=(()=>{
 const fields=[
  {key:'category',label:'Task category',all:'All categories',options:CATEGORIES.map(c=>[c.id,c.name])},
  {key:'robot',label:'Embodiment / scene',all:'All embodiments',options:[...new Set(TASKS.map(t=>t.robot))].map(name=>[name,name])},
  {key:'track',label:'Delivery mode',all:'All delivery modes',options:[['A','Control program'],['B','Training'],['C','Artifact construction']]}
 ];
 const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=values=>Object.fromEntries(fields.map(f=>[f.key,f.options.some(([id])=>id===values?.[f.key])?values[f.key]:'all']));
 const matches=(task,values)=>fields.every(({key})=>!values[key]||values[key]==='all'||task[key]===values[key]);
 function render({id,values,count,search}){
  return `<section class="task-scope" aria-labelledby="${id}-scope-title"><div class="task-scope-heading"><h2 id="${id}-scope-title">Evaluation scope <span aria-hidden="true">·</span> <span id="${id}-scope-count" role="status" aria-live="polite">${count} / ${TASKS.length} tasks</span></h2><button type="button" class="text-link" data-scope-reset>Reset filters</button></div><div class="task-scope-fields${search===undefined?'':' has-search'}">${search===undefined?'':`<label>Find a task<input id="task-search" type="search" placeholder="Task, category or robot" autocomplete="off" value="${h(search)}"></label>`}${fields.map(f=>`<label for="${id}-${f.key}">${f.label}<select id="${id}-${f.key}" data-scope-filter="${f.key}"><option value="all">${f.all}</option>${f.options.map(([value,label])=>`<option value="${h(value)}"${values[f.key]===value?' selected':''}>${h(label)}</option>`).join('')}</select></label>`).join('')}</div></section>`;
 }
 return {normalize,matches,render};
})();
