/* The benchmark research paper. */
window.Publications=(()=>{
 function render(){return `<div class="publication-feed"><article class="publication-entry"><div class="publication-cover">${Evidence.slot('DOCUMENT','Embodied Generalist Exam','Research paper','publication-cover-slot')}</div><div class="publication-copy"><p class="publication-meta">RESEARCH PAPER</p><h2>Embodied Generalist Exam</h2><p>A benchmark of foundation models’ embodied capabilities beyond robot control: 23 tasks across six categories, spanning five classes of robot embodiments and eight foundation models with their corresponding agent harnesses.</p><div class="publication-actions"><a class="text-link" href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository ↗</a></div></div></article></div>`;}
 return {render};
})();
document.querySelector('#page-content').innerHTML=Publications.render();
