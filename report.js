/* Published items and coverage only; no evaluation tools are mounted here. */
window.Publications=(()=>{
 function render(){return `<div class="publication-feed"><article class="publication-entry"><div class="publication-cover">${Evidence.slot('DOCUMENT','Embodied Generalist Exam','Research paper','publication-cover-slot')}</div><div class="publication-copy"><p class="publication-meta">RESEARCH PAPER</p><h2>Embodied Generalist Exam</h2><p>Evaluating general-purpose foundation models across 22 physical-world tasks: manipulation, navigation, scene generation, reconstruction and policy development.</p><div class="publication-actions"><a class="text-link" href="${RESEARCH_REPO}" target="_blank" rel="noopener">Research repository ↗</a><a class="text-link" href="${Site.href('tasks')}">Explore the tasks ↗</a></div></div></article>
 <article class="publication-entry publication-announcement"><div class="publication-date"><time datetime="2026-10-27"><span>OCT</span><strong>27</strong><span>2026</span></time></div><div class="publication-copy"><p class="publication-meta">PROJECT ANNOUNCEMENT</p><h2>The research website is available</h2><p>Explore the 22-task collection, the interactive leaderboard and the task recordings interface.</p><a class="text-link" href="${Site.href('home')}">Visit the project overview ↗</a></div></article>
</div>`;}
 return {render};
})();
document.querySelector('#page-content').innerHTML=Publications.render();
