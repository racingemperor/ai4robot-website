/* A short invitation with email proposal links and community contact. */
window.Contribute=(()=>{
 const routes=[
  {id:'task',name:'New tasks',text:'Propose a physical-world challenge with a clear goal and a way to verify the result.'},
  {id:'method',name:'New methods',text:'Share an agent, control method or evaluation approach with a short description and code.'},
  {id:'model',name:'New models',text:'Suggest a model to evaluate, or share model access, results and representative recordings.'}
 ];
 function proposalLink(route){return `mailto:racingemperor@outlook.com?subject=${encodeURIComponent(`[Contribution] ${route.name}`)}&body=${encodeURIComponent(`What would you like to contribute?

Relevant code, task or model:

How can we contact you?
`)}`;}
 function render(){return `<section class="contribution-simple" aria-label="Ways to contribute"><div class="contribution-routes">${routes.map(route=>`<article><h2>${route.name}</h2><p>${route.text}</p><a class="text-link" href="${proposalLink(route)}">Share a proposal ↗</a></article>`).join('')}</div><div class="contribution-contact"><h2>Talk to us</h2><p>Have an idea or want to collaborate? Get in touch with the team.</p><div><a class="button primary" href="${Site.href('community')}">Contact &amp; community ↗</a><a class="text-link" href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research code ↗</a></div></div></section>`;}
 return {render};
})();
document.querySelector('#page-content').innerHTML=Contribute.render();
