/* Contribution proposals stay in the visitor's browser until they open GitHub. */
window.Contribute = (() => {
 const routes=[
  {id:'model',name:'Evaluate a model',description:'Bring a foundation model to the same tasks, observations and evaluation budgets. Share the outcome and the evidence behind every run.',items:['Exact model version, harness version and evaluation route','Task IDs, seeds, layouts and all valid trial outcomes','Per-task success and normalized progress aggregates','Episode video with timestamped inputs, outputs and submitted code']},
  {id:'harness',name:'Integrate a harness',description:'Connect a coding agent or a direct-policy interface. Make model access, tool use and compute limits explicit so results can be compared fairly.',items:['Runnable integration code and pinned dependencies','Permitted observations, actions, tools and execution budgets','A minimal reproducible run and its complete trace','Clear separation of agent inputs and hidden evaluation state']},
  {id:'task',name:'Propose a task',description:'Add a physical challenge with a precise goal, an executable judge and a reference solution. Explain what a model must understand to solve it.',items:['Task goal, manuscript category and embodiment','Frozen scene configuration, seed handling and held-out conditions','Executable success/progress checks, reference solver and null baseline','Demonstration video, observation examples and installation instructions']},
  {id:'research',name:'Tools, evidence & analysis',description:'Help inspect failures, improve replay tools, document experiments or connect new embodiments. Start with one concrete contribution.',items:['The problem and the tasks or users it affects','A small reproducible example or a proposed analysis','Relevant code, evidence or documentation changes','Known limits and a way for a reviewer to verify the result']}
 ];
 function proposal(route){return `## Contribution type\n${route.name}\n\n## Summary\nDescribe what you would like to contribute.\n\n## Tasks, model or harness\nList the relevant IDs and exact versions.\n\n## Materials to prepare\n${route.items.map(item=>'- [ ] '+item).join('\n')}\n\n## Reproduction and evidence\nLink the code, configuration and evidence a reviewer can use.\n\n## Limitations\nDescribe missing materials and known limitations.\n`;}
 function render(){return `<div class="contribution-intro"><p>The Embodied Generalist Exam evaluates what general-purpose models can do in the physical world. Contributions can improve the models we test, the interfaces we use and the tasks that reveal their limits.</p><a class="button primary" href="#prepare-contribution">Prepare a contribution <span aria-hidden="true">↗</span></a><a class="text-link" href="${Site.href('method')}">Read the evaluation method ↗</a></div>
  <section class="contribution-section" id="ways-to-contribute" aria-labelledby="contribution-ways-title"><h2 id="contribution-ways-title">How to contribute</h2><div class="contribution-routes">${routes.map(route=>`<article><h3>${route.name}</h3><p>${route.description}</p><button type="button" class="text-link" data-contribution-route="${route.id}">See the materials to prepare <span aria-hidden="true">↗</span></button></article>`).join('')}</div></section>
  <section class="contribution-section" aria-labelledby="contribution-criteria-title"><h2 id="contribution-criteria-title">What a contribution should make possible</h2><div class="contribution-criteria">${[
   ['Verifiable','Judge outcomes with explicit, executable task checks. Keep success separate from intermediate progress.'],
   ['Solvable','Show a reference solution and check that doing nothing does not pass. A reference solver is never a model result.'],
   ['Reproducible','Record versions, seeds, layouts and budgets. Give reviewers enough information to rerun the same conditions.'],
   ['Fair','Declare the evaluation route and permitted observations. Keep hidden state, seeds and judge internals out of agent inputs.'],
   ['Inspectable','Keep videos, input/output events and code on one timeline. Include unsuccessful valid trials as well as successes.'],
   ['Clearly scoped','State what is implemented, what was measured and what remains pending. Label synthetic examples and local reports.']
  ].map(([name,text])=>`<article><h3>${name}</h3><p>${text}</p></article>`).join('')}</div></section>
  <section class="contribution-section" aria-labelledby="contribution-process-title"><h2 id="contribution-process-title">From proposal to benchmark</h2><ol class="contribution-process">${[
   ['Propose','Describe the model, harness, task or tool and its intended scope.'],['Prepare','Assemble code, configuration and the materials listed below.'],['Self-check','Validate the report and inspect the replay against its timestamps.'],['Review','Maintainers review reproducibility, evaluation boundaries and evidence.'],['Publish','Accepted, reviewed materials can be connected to the catalog and results.']
  ].map(([name,text])=>`<li><h3>${name}</h3><p>${text}</p></li>`).join('')}</ol></section>
  <section class="contribution-section contribution-prepare" id="prepare-contribution" aria-labelledby="prepare-title"><div><h2 id="prepare-title">Prepare your contribution</h2><p>Choose a contribution type to get its material checklist and a proposal draft. The GitHub button opens an editable issue; nothing is submitted automatically.</p><label for="contribution-type">Contribution type</label><select id="contribution-type">${routes.map(route=>`<option value="${route.id}">${route.name}</option>`).join('')}</select><p class="contribution-channel">Proposals use the website repository’s issue tracker. For research code or access, include your request in the proposal.</p><a class="text-link" href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository · access may be required ↗</a></div><div class="contribution-checklist-panel"><h3 id="contribution-checklist-title"></h3><ul id="contribution-checklist"></ul><div class="contribution-actions"><button type="button" class="button" id="download-proposal">Download proposal</button><a class="button primary" id="open-contribution" target="_blank" rel="noopener">Open a GitHub proposal <span aria-hidden="true">↗</span></a></div><p id="contribution-feedback" role="status" aria-live="polite"></p></div></section>`;}
 function mount(){
  document.querySelector('#page-content').innerHTML=render();
  const select=document.querySelector('#contribution-type');
  function update(){
   const route=routes.find(route=>route.id===select.value)||routes[0];
   document.querySelector('#contribution-checklist-title').textContent=route.name+' · Materials';
   document.querySelector('#contribution-checklist').innerHTML=route.items.map(item=>`<li>${item}</li>`).join('');
   const url=new URL('https://github.com/racingemperor/ai4robot-website/issues/new');url.searchParams.set('title','[Contribution] '+route.name);url.searchParams.set('body',proposal(route));
   document.querySelector('#open-contribution').href=url.href;
   document.querySelector('#contribution-feedback').textContent='';
  }
  select.addEventListener('change',update);
  document.querySelectorAll('[data-contribution-route]').forEach(button=>button.addEventListener('click',()=>{
   select.value=button.dataset.contributionRoute;update();
   document.querySelector('#prepare-contribution').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});select.focus({preventScroll:true});
  }));
  document.querySelector('#download-proposal').addEventListener('click',()=>{
   const route=routes.find(route=>route.id===select.value),url=URL.createObjectURL(new Blob([proposal(route)],{type:'text/markdown;charset=utf-8'})),link=document.createElement('a');
   link.href=url;link.download='ege-'+route.id+'-proposal.md';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   document.querySelector('#contribution-feedback').textContent='Downloaded the proposal draft.';
  });
  update();
 }
 return {mount};
})();
Contribute.mount();
