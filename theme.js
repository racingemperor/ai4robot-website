/* Runs before styles so every page starts in the saved or system theme. */
window.Theme = (() => {
 const root=document.documentElement,key='ege-theme';
 const system=matchMedia('(prefers-color-scheme: dark)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let choice=null,button=null,transition=null;
 const valid=value=>value==='light'||value==='dark';
 try{const saved=localStorage.getItem(key);if(valid(saved))choice=saved;}catch{}
 function apply(){
  const dark=(choice|| (system.matches?'dark':'light'))==='dark';
  root.dataset.theme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#151b19':'#f5f3ed');
  if(button){
   const label=`Switch to ${dark?'light':'dark'} theme`;
   button.setAttribute('aria-label',label);button.title=label;
   button.setAttribute('aria-pressed',String(dark));
  }
 }
 function change(){
  transition?.skipTransition();
  if(!document.startViewTransition||reduced.matches||!root.classList.contains('theme-ready')){apply();return;}
  root.classList.add('theme-snapshot');
  const next=document.startViewTransition(apply);transition=next;
  next.finished.catch(()=>{}).finally(()=>{
   if(transition===next){transition=null;root.classList.remove('theme-snapshot');}
  });
 }
 apply();
 system.addEventListener('change',()=>{if(!choice)change();});
 window.addEventListener('storage',event=>{
  if(event.key===key||event.key===null){choice=valid(event.newValue)?event.newValue:null;change();}
 });
 reduced.addEventListener('change',event=>{if(event.matches)transition?.skipTransition();});
 function mount(control){
  button=control;apply();
  button.addEventListener('click',()=>{
   choice=(choice||root.dataset.theme)==='dark'?'light':'dark';
   try{localStorage.setItem(key,choice);}catch{}
   change();
  });
  // Initial paint is immediate; only later user/system changes interpolate.
  requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('theme-ready')));
 }
 return {mount};
})();
