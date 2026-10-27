/* Apply a saved/system palette before paint; crossfade the live viewport. */
window.Theme = (() => {
 const root=document.documentElement,key='ege-theme';
 const system=matchMedia('(prefers-color-scheme: dark)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const valid=value=>value==='light'||value==='dark';
 let choice=null,button=null,transition=null,revision=0,current;
 try{const saved=localStorage.getItem(key);if(valid(saved))choice=saved;}catch{}
 current=choice||(system.matches?'dark':'light');
 function apply(){
  root.dataset.theme=current;root.style.colorScheme=current;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',current==='dark'?'#121619':'#ffffff');
  if(button){const label=`Switch to ${current==='dark'?'light':'dark'} theme`;button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(current==='dark'));}
 }
 function change(next,animate=true){
  if(next===current)return;
  current=next;const version=++revision;
  transition?.skipTransition();transition=null;root.classList.remove('theme-snapshot');
  if(!animate||!document.startViewTransition||reduced.matches||document.hidden||document.fullscreenElement){apply();return;}
  root.classList.add('theme-snapshot');
  try{
   const view=document.startViewTransition(()=>{if(version===revision)apply();});transition=view;
   const finish=()=>{if(transition===view){transition=null;root.classList.remove('theme-snapshot');}};
   view.ready.catch(()=>{});
   view.finished.then(finish,()=>{if(version===revision)apply();finish();});
  }catch{root.classList.remove('theme-snapshot');apply();}
 }
 apply();
 system.addEventListener('change',()=>{if(!choice)change(system.matches?'dark':'light');});
 window.addEventListener('storage',event=>{
  if(event.key===key||event.key===null){choice=valid(event.newValue)?event.newValue:null;change(choice||(system.matches?'dark':'light'),false);}
 });
 reduced.addEventListener('change',event=>{if(event.matches){++revision;transition?.skipTransition();transition=null;root.classList.remove('theme-snapshot');apply();}});
 function mount(control){
  button=control;apply();
  button.addEventListener('click',()=>{choice=current==='dark'?'light':'dark';try{localStorage.setItem(key,choice);}catch{}change(choice);});
 }
 return {mount};
})();
