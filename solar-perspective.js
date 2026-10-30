/* Independent solar close-up study. Model order is illustrative; measured results stay unchanged. */
(()=>{
 const models=Results.roster,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelector('#page-content').innerHTML=`
  <div class="study-heading"><h1>Overall leaderboard</h1></div>
  <section class="stellar-scene" aria-label="A view from beside the Sun toward the outer solar system. The leading model occupies the Sun; the other models occupy successive planetary orbits.">
   <canvas aria-hidden="true"></canvas><div class="star-nodes" aria-label="Models in preview display order"></div>
  </section>
  <section class="preview-detail" aria-label="Selected model" aria-live="polite"></section>`;
 const scene=document.querySelector('.stellar-scene'),canvas=scene.querySelector('canvas'),ctx=canvas.getContext('2d'),nodes=scene.querySelector('.star-nodes');
 let width=0,height=0,dpr=1,background,layout,selected=models[0].id,elapsed=0,last=0,raf=0;
 const mobile=()=>width<650;
 function random(seed){let n=seed;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
 function glow(c,x,y,r,color,alpha){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(.3,`rgba(${color},${alpha*.26})`);g.addColorStop(1,`rgba(${color},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
 function geometry(){
  const sun=mobile()?{x:width*.28-height*1.45,y:height*.51,r:height*1.45}:{x:-width*.20,y:height*.53,r:width*.46};
  const angles=[-.55,.56,-.56,.42,-.47,.50,-.28],radii=[.66,.75,.86,.96,1.07,1.13,1.16];
  const targets=mobile()?[[.46,.14],[.77,.25],[.48,.36],[.77,.47],[.48,.59],[.77,.71],[.49,.84]]:null;
  const orbits=angles.map((angle,i)=>{
   if(targets){const [u,v]=targets[i],x=u*width,y=v*height,ry=height*(.43+i*.045);angle=Math.asin((y-sun.y)/ry);return {x,y,angle,rx:(x-sun.x)/Math.cos(angle),ry};}
   const rx=width*radii[i],ry=height*(.37+i*.03);return {rx,ry,angle,x:sun.x+rx*Math.cos(angle),y:sun.y+ry*Math.sin(angle)};
  });
  return {sun,orbits,points:[{x:width*(mobile()?.12:.105),y:height*(mobile()?.50:.49)},...orbits]};
 }
 function starfield(c,rand){
  const sky=c.createLinearGradient(0,height,width,0);sky.addColorStop(0,'#151126');sky.addColorStop(.45,'#080e22');sky.addColorStop(1,'#030814');c.fillStyle=sky;c.fillRect(0,0,width,height);
  glow(c,width*.61,height*.26,width*.45,'66,76,137',.15);glow(c,width*.86,height*.69,width*.35,'72,48,114',.13);
  const palette=['193,215,255','255,221,173','196,186,244','230,237,255'];
  for(let i=0;i<(mobile()?2200:7000);i++){
   const x=rand()*width,y=rand()*height,r=rand()>.993?1.2:.22+rand()*.52,color=palette[i%4];
   c.fillStyle=`rgba(${color},${.15+rand()*.7})`;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
   if(r>1){glow(c,x,y,9,color,.21);c.strokeStyle=`rgba(${color},.4)`;c.lineWidth=.5;c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.moveTo(x,y-4);c.lineTo(x,y+4);c.stroke();}
  }
  // A distant, irregular band of stars gives the empty space a second depth layer.
  for(let i=0;i<(mobile()?2000:6500);i++){
   const t=rand(),x=width*t,y=height*(.18+t*.35)+(rand()+rand()+rand()-1.5)*height*.14;
   c.fillStyle=`rgba(156,177,224,${rand()*.16})`;c.fillRect(x,y,.5,.5);
  }
 }
 function paintOrbits(c){
  const {sun,orbits}=layout;
  orbits.forEach((orbit,i)=>{
   c.beginPath();c.ellipse(sun.x,sun.y,orbit.rx,orbit.ry,0,0,Math.PI*2);c.strokeStyle=`rgba(242,247,255,${.48-i*.025})`;c.lineWidth=.65;c.stroke();
  });
 }
 function paintAsteroids(c,rand){
  const {sun}=layout;
  for(let i=0;i<(mobile()?260:1100);i++){
   const angle=rand()*Math.PI*2,rx=width*(.92+rand()*.13),ry=height*(.45+rand()*.08),x=sun.x+Math.cos(angle)*rx,y=sun.y+Math.sin(angle)*ry;
   if(x<width*.29||x>width||y<0||y>height)continue;
   const r=.4+rand()**5*2.7;c.fillStyle=`rgba(152,146,144,${.2+rand()*.45})`;c.beginPath();c.ellipse(x,y,r*1.4,r,-.3,0,Math.PI*2);c.fill();
   c.fillStyle='#f4d4a46b';c.fillRect(x-r,y-r,.5+r*.4,.6);
  }
 }
 function paintSun(c,rand){
  const {x,y,r}=layout.sun;
  const corona=c.createRadialGradient(x,y,r*.96,x,y,r*1.22);corona.addColorStop(0,'#fff2a600');corona.addColorStop(.12,'#ffc35a65');corona.addColorStop(.27,'#f7a02d24');corona.addColorStop(1,'#e6892700');c.fillStyle=corona;c.fillRect(0,0,width,height);
  for(let i=0;i<40;i++){
   const a=-1.1+rand()*2.2,reach=9+rand()*(mobile()?18:50),arc=.014+rand()*.026;
   c.beginPath();c.moveTo(x+Math.cos(a-arc)*r,y+Math.sin(a-arc)*r);c.bezierCurveTo(x+Math.cos(a-arc)*(r+reach),y+Math.sin(a-arc)*(r+reach),x+Math.cos(a+arc)*(r+reach),y+Math.sin(a+arc)*(r+reach),x+Math.cos(a+arc)*r,y+Math.sin(a+arc)*r);
   c.strokeStyle=i%2?'#ffac3b7a':'#f8d57d55';c.lineWidth=1+rand()*2;c.stroke();
  }
  c.save();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.clip();
  const surface=c.createRadialGradient(x+r*.25,y-r*.12,0,x,y,r);surface.addColorStop(0,'#fff3ad');surface.addColorStop(.50,'#ffe17d');surface.addColorStop(.82,'#f9a42b');surface.addColorStop(.97,'#f29b35');surface.addColorStop(1,'#ffdb87');c.fillStyle=surface;c.fillRect(0,0,width,height);
  // Cached granular photosphere: a warped noise field, clipped to the near solar limb.
  const texture=document.createElement('canvas');texture.width=mobile()?130:420;texture.height=Math.round(texture.width*height/(width*.29));
  const tc=texture.getContext('2d'),data=tc.createImageData(texture.width,texture.height),grid=new Float32Array(128*128);
  for(let i=0;i<grid.length;i++)grid[i]=rand();
  function noise(u,v){const ix=Math.floor(u),iy=Math.floor(v);let a=u-ix,b=v-iy;a=a*a*(3-2*a);b=b*b*(3-2*b);const n=(xx,yy)=>grid[(yy&127)*128+(xx&127)];return (n(ix,iy)*(1-a)+n(ix+1,iy)*a)*(1-b)+(n(ix,iy+1)*(1-a)+n(ix+1,iy+1)*a)*b;}
  for(let py=0;py<texture.height;py++)for(let px=0;px<texture.width;px++){
   const u=px/texture.width,v=py/texture.height,warp=noise(u*12,v*30),n=noise(u*69+warp*3,v*140+warp*4),fine=noise(u*155,v*330),a=(py*texture.width+px)*4;
   const dark=(n*.7+fine*.3);data.data[a]=dark>.54?255:175;data.data[a+1]=dark>.54?231:67;data.data[a+2]=dark>.54?132:12;data.data[a+3]=Math.min(.48,Math.abs(dark-.5)*1.55)*255;
  }
  tc.putImageData(data,0,0);c.drawImage(texture,0,0,width*.29,height);
  for(let i=0;i<(mobile()?400:1300);i++){
   const a=-1.25+rand()*2.5,radius=r*(.70+rand()*.3),xx=x+Math.cos(a)*radius,yy=y+Math.sin(a)*radius;
   c.strokeStyle=`rgba(255,242,156,${.06+rand()*.18})`;c.lineWidth=.6;c.beginPath();c.ellipse(xx,yy,2+rand()*7,1+rand()*2,a+Math.PI/2,0,Math.PI*1.6);c.stroke();
  }
  c.restore();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.strokeStyle='#ffe6a9c7';c.lineWidth=1.2;c.stroke();
  glow(c,width*.255,height*.44,mobile()?55:150,'255,206,108',.16);
 }
 function paintPlanet(c,p,i,rand){
  const base=mobile()?23:31,r=base*[1.08,.85,1.12,.94,1.03,.91,.76][i];
  const colors=[['#e7c594','#86694a','#241c1a'],['#d5a386','#986348','#201820'],['#98c4da','#3c7396','#0b182a'],['#cebea0','#8a6d53','#211e24'],['#9bbabc','#4f7d86','#111d2b'],['#b3bce1','#636d9b','#17172f'],['#c4bad8','#6b6384','#1b1929']][i];
  if(i===3||i===5){c.save();c.translate(p.x,p.y);c.rotate(-.32);c.beginPath();c.ellipse(0,0,r*1.7,r*.4,0,0,Math.PI*2);c.strokeStyle='#d7c8b45c';c.lineWidth=r*.18;c.stroke();c.restore();}
  glow(c,p.x-r*.3,p.y,r*1.8,'145,167,208',.1);
  c.save();c.beginPath();c.arc(p.x,p.y,r,0,Math.PI*2);c.clip();
  const sphere=c.createRadialGradient(p.x-r*.66,p.y-r*.32,r*.08,p.x-r*.18,p.y,r*1.15);sphere.addColorStop(0,colors[0]);sphere.addColorStop(.45,colors[1]);sphere.addColorStop(1,colors[2]);c.fillStyle=sphere;c.fillRect(p.x-r,p.y-r,r*2,r*2);
  for(let n=0;n<100;n++){const xx=p.x+(rand()-.5)*r*2,yy=p.y+(rand()-.5)*r*2;c.fillStyle=n%3?'#e6dac012':'#040c1c24';c.beginPath();c.ellipse(xx,yy,rand()*r*.13+.5,rand()*r*.05+.3,-.2,0,Math.PI*2);c.fill();}
  c.restore();c.beginPath();c.arc(p.x,p.y,r,Math.PI*.58,Math.PI*1.46);c.strokeStyle=colors[0]+'99';c.lineWidth=.8;c.stroke();
 }
 function build(){
  background=document.createElement('canvas');background.width=canvas.width;background.height=canvas.height;const c=background.getContext('2d');c.scale(dpr,dpr);const rand=random(627041);
  starfield(c,rand);paintOrbits(c);paintAsteroids(c,rand);paintSun(c,rand);layout.orbits.forEach((p,i)=>paintPlanet(c,p,i,rand));
 }
 function detail(){
  const model=models.find(m=>m.id===selected),hasResults=Results.official.results.some(r=>r.model_id===selected);
  document.querySelector('.preview-detail').innerHTML=`<div class="selected-identity"><img src="${model.logo}" alt="" width="32" height="32"><h3>${model.name}</h3></div>${hasResults?`<a class="detail-link" href="leaderboard.html?model=${model.id}&detail=1">View model results <span aria-hidden="true">↗</span></a>`:''}`;
  nodes.querySelectorAll('[data-star]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.star===selected)));
 }
 function resize(){
  const rect=scene.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);layout=geometry();
  nodes.innerHTML=models.map((m,i)=>`<button type="button" class="model-star${i===0?' is-leader':''}" data-star="${m.id}" aria-label="${m.name}, preview position ${i+1}" style="transform:translate3d(${layout.points[i].x}px,${layout.points[i].y}px,0)"><span class="star-emblem"><img src="${m.logo}" alt="" width="32" height="32"><span class="star-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></span><span class="star-name">${m.name}${i===0?'<small>LEADING MODEL</small>':''}</span></button>`).join('');
  build();detail();draw();
 }
 function draw(){
  if(!background)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.drawImage(background,0,0,width,height);
  const rand=random(74812);for(let i=0;i<18;i++){const x=width*(.32+rand()*.66),y=height*(.07+rand()*.85),alpha=.13+(Math.sin(elapsed*.55+i*1.7)+1)*.12;glow(ctx,x,y,3.5,'204,222,255',alpha);}
 }
 function frame(now){const delta=Math.min((now-last)/1000||0,.05);last=now;if(!document.hidden&&!reduced.matches){elapsed+=delta;draw();}raf=requestAnimationFrame(frame);}
 nodes.addEventListener('click',event=>{const button=event.target.closest('[data-star]');if(button){selected=button.dataset.star;detail();}});
 reduced.addEventListener('change',draw);window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));new ResizeObserver(resize).observe(scene);resize();raf=requestAnimationFrame(frame);
})();
