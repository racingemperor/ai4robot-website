/* Presentation only: scroll reveals and a card-to-window transition. */
window.Motion = (() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 function revealHome(root) {
  const sections=[...root.querySelectorAll(':scope > section:not(.hero)')];
  if(!('IntersectionObserver' in window)||preference.matches)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}
  }),{threshold:0.08,rootMargin:'0px 0px -35px 0px'});
  sections.forEach(section=>{section.classList.add('scroll-reveal');observer.observe(section);});
  root.addEventListener('focusin',event=>event.target.closest('.scroll-reveal')?.classList.add('is-revealed'));
  preference.addEventListener('change',event=>{if(event.matches){observer.disconnect();sections.forEach(section=>section.classList.add('is-revealed'));}});
 }
 // CSS moves the wall; this controller pauses it and decodes only visible clips.
 function videoWall(hero) {
  if(!hero)return;
  const wall=hero.querySelector('.hero-wall'),toggle=hero.querySelector('.wall-motion-toggle');
  const videos=[...wall.querySelectorAll('video')],visibleVideos=new Set();
  let requested=!preference.matches,inView=true,focused=false;
  function sync() {
   const running=requested&&inView&&!document.hidden&&!focused;
   hero.dataset.motion=running?'running':'paused';
   toggle.setAttribute('aria-pressed',String(requested));
   const label=requested?'Pause video wall':'Play video wall';
   toggle.setAttribute('aria-label',label);toggle.title=label;
   toggle.firstElementChild.textContent=requested?'Ⅱ':'▶';
   videos.forEach(video=>{
    if(running&&visibleVideos.has(video)){
     if(video.paused)video.play().catch(()=>{});
    }else video.pause();
   });
  }
  toggle.addEventListener('click',()=>{requested=!requested;sync();});
  wall.addEventListener('focusin',()=>{focused=true;sync();});
  wall.addEventListener('focusout',event=>{if(!wall.contains(event.relatedTarget)){focused=false;sync();}});
  // Bring a clipped tile into the wall viewport when reached by keyboard.
  wall.addEventListener('focusin',event=>{
   const tile=event.target.closest('.wall-tile');
   if(tile?.matches(':focus-visible'))tile.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  });
  videos.forEach(video=>{
   const tile=video.closest('.wall-tile');
   video.addEventListener('playing',()=>tile.classList.add('has-playing-video'));
   video.addEventListener('error',()=>{
    tile.classList.remove('has-playing-video');
    tile.querySelector('[data-wall-media-label]').textContent='CONCEPT PREVIEW';
   });
  });
  if('IntersectionObserver' in window){
   const heroObserver=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});
   heroObserver.observe(hero);
   const clipObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)visibleVideos.add(entry.target);else visibleVideos.delete(entry.target);});sync();
   },{root:hero,threshold:0.01});
   videos.forEach(video=>clipObserver.observe(video));
  }else videos.forEach(video=>visibleVideos.add(video));
  preference.addEventListener('change',event=>{requested=!event.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',()=>{inView=false;sync();});
  window.addEventListener('pageshow',()=>{inView=hero.getBoundingClientRect().bottom>0;sync();});
  sync();
 }
 function taskWindow(dialog,onClose) {
  let opener=null,phase='closed',animation=null;
  const finish=()=>{
   animation?.cancel();animation=null;phase='closed';dialog.close();
   dialog.querySelector('.task-window-preview')?.remove();
   document.documentElement.classList.remove('task-modal-open');
   onClose();if(opener?.isConnected)opener.focus({preventScroll:true});
  };
  function close(instant=false) {
   if(!dialog.open||phase==='closing')return;
   animation?.cancel();phase='closing';dialog.classList.remove('is-opening');
   const target=opener?.isConnected?opener.getBoundingClientRect():null;
   if(instant||preference.matches||!dialog.animate||!target||target.bottom<0||target.top>innerHeight){finish();return;}
   const rect=dialog.getBoundingClientRect();
   animation=dialog.animate([{transform:'none',opacity:1},{transform:`translate(${target.left-rect.left}px,${target.top-rect.top}px) scale(${target.width/rect.width},${target.height/rect.height})`,opacity:0}],{duration:260,easing:'cubic-bezier(.4,0,.7,1)'});
   animation.onfinish=finish;
  }
  function open(source=null) {
   if(dialog.open)return;
   const from=source?.getBoundingClientRect();
   opener=source;phase='opening';dialog.showModal();
   document.documentElement.classList.add('task-modal-open');
   dialog.querySelector('.task-focus-scroll').scrollTop=0;
   dialog.querySelector('#task-title')?.focus({preventScroll:true});
   const rect=dialog.getBoundingClientRect();
   if(preference.matches||!dialog.animate){phase='open';return;}
   if(source){const preview=document.createElement('div');preview.className='task-window-preview';preview.style.setProperty('--task-color',source.style.getPropertyValue('--task-color'));preview.setAttribute('aria-hidden','true');preview.innerHTML=source.innerHTML;dialog.append(preview);}
   dialog.classList.add('is-opening');
   const dx=from?from.left-rect.left:0,dy=from?from.top-rect.top:26;
   const sx=from?from.width/rect.width:.96,sy=from?from.height/rect.height:.96;
   animation=dialog.animate([
    {transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,opacity:1,offset:0},
    {transform:`translate(${dx*.25}px,${dy*.25-8}px) scale(${sx+(1-sx)*.77},${sy+(1-sy)*.77})`,opacity:1,offset:.62},
    {transform:'none',opacity:1,offset:1}
   ],{duration:620,easing:'cubic-bezier(.22,.75,.2,1)'});
   animation.onfinish=()=>{animation=null;phase='open';dialog.classList.remove('is-opening');dialog.querySelector('.task-window-preview')?.remove();};
  }
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('click',event=>{
   if(event.target.closest('[data-close-task]'))close();
   if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}
  });
  preference.addEventListener('change',event=>{if(event.matches&&phase==='opening'){animation?.finish();}else if(event.matches&&phase==='closing')finish();});
  return {open,close};
 }
 return {revealHome,videoWall,taskWindow};
})();
