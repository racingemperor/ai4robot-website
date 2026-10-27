/* Home's paper information, news, overview video and research introduction. */
window.HomeOverview = (() => {
 function introduction(){return `<section id="overview" class="home-paper-info" aria-labelledby="home-paper-title">
  <h2 id="home-paper-title">Embodied Generalist Exam</h2>
  <dl class="home-paper-meta" aria-label="Paper information">
   <div><dt>Authors</dt><dd class="home-metadata-pending">Author list to be announced</dd></div>
   <div><dt>Affiliations</dt><dd class="home-affiliations-pending">Institution logos and affiliations to be announced</dd></div>
   <div><dt>Published</dt><dd>Research preview · Paper forthcoming</dd></div>
   <div><dt>Report</dt><dd><a href="${Site.href('report')}">Read the research overview ↗</a></dd></div>
   <div><dt>Repository</dt><dd><a href="${RESEARCH_REPO}" target="_blank" rel="noopener">ALEXander22568 / AI4Robot ↗</a></dd></div>
   <div><dt>Leaderboard</dt><dd><a href="${Site.href('leaderboard')}">View the full leaderboard ↗</a></dd></div>
   <div class="home-paper-contact"><dt>Contact</dt><dd class="home-metadata-pending">Contact information forthcoming</dd></div>
  </dl>
 </section>
 <section id="home-news" class="home-news section" aria-labelledby="home-news-title"><h2 id="home-news-title">News</h2>
  <div class="home-news-list" role="region" aria-label="Project updates" tabindex="0"><ul>
   <li><time datetime="2026-10-27">Oct 27 <span>2026</span></time><p>Explore the five manuscript categories and all 22 tasks in the new <a href="${Site.href('leaderboard')}">interactive leaderboard</a>. Reviewed model results are forthcoming.</p></li>
   <li><time datetime="2026-10-27">Oct 27 <span>2026</span></time><p><a href="${Site.href('contribute')}">Contribution guidelines</a> are available for model evaluations, agent harnesses, task proposals and reproducible evidence.</p></li>
  </ul></div>
 </section>
 <section id="benchmark-video" class="home-overview-film" aria-label="Benchmark overview video">${Evidence.slot('VIDEO','Embodied Generalist Exam · Overview','Reserved for an overview assembled from the task demonstrations','home-film-slot')}</section>
 <section id="benchmark-introduction" class="section home-introduction" aria-labelledby="home-introduction-title"><h2 id="home-introduction-title">Beyond the digital world</h2><div class="home-introduction-copy">
  <p>The <strong>Embodied Generalist Exam (EGE)</strong> evaluates what general-purpose foundation models can do in the physical world. Its <strong>22 tasks</strong> span five categories: robotic manipulation, navigation, scene generation, scene and interaction reconstruction, and policy development. Each task pairs a concrete objective with an executable environment, an interaction interface and an independent evaluator.</p>
  <p>Models may reason, use tools, write control programs, construct artifacts or develop robot policies under task-specific constraints. The evaluated foundation model remains unchanged. Repeated trials and explicit success criteria are designed to reveal both capability and reliability, with video, observations, model responses and submitted code connected to the same episode.</p>
 </div></section>`;}
 return {introduction};
})();
