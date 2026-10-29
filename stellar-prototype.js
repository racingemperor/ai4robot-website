/* Four Overall leaderboard layout studies, switchable via ?variant=solar|andromeda|voyage|vault.
   Positions are a preview arrangement, not measured rankings. Official report data stays untouched. */
(()=>{
 const variants=[
  {id:'solar',name:'Solar System',title:'A center of gravity.',text:'One leading star. Seven worlds in its orbit.',direction:'Stronger models move toward the center.',description:'The leading model becomes the sun. The others orbit it in ranked rings. A strong identity for the model in first place.'},
  {id:'andromeda',name:'Andromeda',title:'Intelligence at the core.',text:'One leading model at the heart of the galaxy.',direction:'Closer to the galactic core means stronger.',description:'A tilted galaxy with luminous spiral arms. The leading model occupies the core; the others spread outward with decreasing performance.'},
  {id:'voyage',name:'Deep Space',title:'How far can intelligence go?',text:'A shared starting point. Different frontiers.',direction:'Longer journeys mean stronger performance.',description:'Eight comet trails depart from one origin. The farthest model leads. The clearest overall comparison at a glance.'},
  {id:'vault',name:'Celestial Vault',title:'The next frontier is overhead.',text:'An ascending constellation across an open sky.',direction:'Higher in the sky means stronger performance.',description:'Models form an ascending constellation above a planetary horizon. The leader sits highest in the celestial vault.'}
 ];
 const models=Results.roster;
 const colors=['#ffcf8b','#a8cfff','#c6b6ff','#7dd7df','#8daeff','#f6b4c0','#9ee0c8','#e6c895'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const params=new URLSearchParams(location.search);
 let variant=variants.find(v=>v.id===params.get('variant'))||variants[1];
 let order=[...models],selected=models[0].id,playing=!reduced.matches,elapsed=0,orbitTime=0,last=0,raf=0,width=0,height=0,dpr=1,hold=false;
 let pointer={x:0,y:0},pan={x:0,y:0},background,starButtons=[];
 const sceneTitle=()=>`${variants.indexOf(variant)+1} / ${String(variants.length).padStart(2,'0')} · ${variant.name}`;
 const icons={play:'<path d="m6 3 13 8-13 8z"/>',pause:'<path d="M5 3h4v16H5zM13 3h4v16h-4z"/>',cycle:'<path d="M4 9a7 7 0 0 1 12-4l2 2M18 3v4h-4M18 13A7 7 0 0 1 6 17l-2-2M4 19v-4h4"/>'};
 const urlFor=id=>{const url=new URL(location.href);url.searchParams.set('variant',id);return url.pathname+url.search;};
 document.querySelector('#page-content').innerHTML=`
  <div class="study-heading"><div><span class="study-label">LEADERBOARD / VISUAL STUDIES</span><h1>A universe of embodied intelligence.</h1><p>Four views of an Overall leaderboard. Select a star to explore its model.</p></div><a href="leaderboard.html">View measured results <span aria-hidden="true">↗</span></a></div>
  <section class="stellar-scene" aria-labelledby="scene-title"><canvas aria-hidden="true"></canvas><div class="scene-caption"><span class="study-label" id="scene-label"></span><h2 id="scene-title"></h2><p id="scene-description"></p></div><div class="scene-badge">EMBODIED GENERALIST EXAM<strong>OVERALL · CONCEPT PREVIEW</strong></div><div class="star-nodes" aria-label="Models in preview display order"></div><span class="scene-orientation">23 TASKS / 6 CATEGORIES / 8 MODELS</span><div class="scene-bottom"><span class="direction-key"><i aria-hidden="true"></i><span id="direction-text"></span></span><div class="scene-actions"><button type="button" data-action="cycle" aria-label="Cycle the preview leader" title="Cycle the preview leader"><svg viewBox="0 0 22 22" aria-hidden="true">${icons.cycle}</svg></button><button type="button" data-action="motion"></button></div></div></section>
  <section class="preview-detail" aria-label="Selected model's measured evaluation coverage" aria-live="polite"></section>
  <div class="study-models" aria-label="Select a model">${models.map(m=>`<button type="button" data-select-model="${m.id}"><img src="${m.logo}" alt="" width="20" height="20">${m.name}</button>`).join('')}</div>
  <div class="concept-guide" aria-label="Compare the four visual concepts">${variants.map((v,i)=>`<a href="${urlFor(v.id)}" data-variant="${v.id}"><small>0${i+1} / OVERALL</small><h3>${v.name}</h3><p>${v.description}</p></a>`).join('')}</div>
  <div class="prototype-switcher" role="group" aria-label="Switch visual concept"><button type="button" data-switch="-1" aria-label="Previous concept">‹</button><div><strong id="switcher-title"></strong><span>DESIGN EXPLORATION · ← / →</span></div><button type="button" data-switch="1" aria-label="Next concept">›</button><nav class="prototype-dots" aria-label="Visual concepts">${variants.map((v,i)=>`<a href="${urlFor(v.id)}" data-variant="${v.id}" aria-label="${v.name}">0${i+1}</a>`).join('')}</nav></div>`;
 const scene=document.querySelector('.stellar-scene'),canvas=scene.querySelector('canvas'),ctx=canvas.getContext('2d'),nodes=scene.querySelector('.star-nodes');
 const mobile=()=>width<650;
 const isAndromeda=()=>variant.id==='andromeda';
 function random(seed){let value=seed;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}
 function gaussian(rand){return (rand()+rand()+rand()+rand()+rand()+rand()-3)*1.42;}
 function bloom(c,x,y,r,color,opacity=1){const gradient=c.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,`rgba(${color},${opacity})`);gradient.addColorStop(.15,`rgba(${color},${opacity*.36})`);gradient.addColorStop(.55,`rgba(${color},${opacity*.08})`);gradient.addColorStop(1,`rgba(${color},0)`);c.fillStyle=gradient;c.fillRect(x-r,y-r,r*2,r*2);}
 function line(c,points,color,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 function galaxyPoint(radius,angle,jitter=0){
  const cx=width*(mobile()?.50:.51),cy=height*(mobile()?.57:.54),rx=width*(mobile()?.42:.43),ry=height*(mobile()?.34:.32),tilt=mobile()?-.18:-.25;
  const x=Math.cos(angle)*radius*rx,y=Math.sin(angle)*radius*ry+jitter;
  return {x:cx+x*Math.cos(tilt)-y*Math.sin(tilt),y:cy+x*Math.sin(tilt)+y*Math.cos(tilt)};
 }
 function paintNebula(c,rand){
  // Cloud structure is baked once; animation never reruns these fractal samples.
  const texture=document.createElement('canvas');
  texture.width=mobile()?340:1000;texture.height=Math.round(texture.width*height/width);
  const tc=texture.getContext('2d'),pixels=tc.createImageData(texture.width,texture.height),grid=new Float32Array(256*256);
  for(let i=0;i<grid.length;i++)grid[i]=rand();
  const noise=(x,y)=>{
   const ix=Math.floor(x),iy=Math.floor(y);let fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
   const a=grid[(iy&255)*256+(ix&255)],b=grid[(iy&255)*256+((ix+1)&255)],d=grid[((iy+1)&255)*256+(ix&255)],e=grid[((iy+1)&255)*256+((ix+1)&255)];
   return (a+(b-a)*fx)*(1-fy)+(d+(e-d)*fx)*fy;
  };
  const fbm=(x,y)=>{let value=0,amp=.54;for(let o=0;o<5;o++){value+=noise(x,y)*amp;x=x*2.03+13.7;y=y*2.03+7.2;amp*=.49;}return value;};
  const palettes={solar:[[29,78,153],[113,42,158],[221,75,58]],andromeda:[[30,117,183],[127,51,178],[221,63,126]],voyage:[[15,127,143],[55,66,180],[213,46,133]],vault:[[28,109,163],[125,47,178],[228,69,114]]};
  const palette=palettes[variant.id];
  for(let py=0;py<texture.height;py++)for(let px=0;px<texture.width;px++){
   const u=px/texture.width,v=py/texture.height;
   const warp=fbm(u*3+19,v*3+41),n=fbm(u*6+warp*2,v*5+warp*2),fine=fbm(u*24+4,v*22+9);
   const middle=variant.id==='vault'?.59-.26*u:variant.id==='voyage'?.86-.60*u:.70-.32*u;
   const ribbon=Math.exp(-(((v-middle+(warp-.5)*.5)/.25)**2));
   const wisps=Math.max(0,n-.27)*2.6,ridge=Math.max(0,1-Math.abs(fine-.51)*8);
   const dust=1-Math.max(0,fbm(u*11+60,v*9)-.48)*2.7;
   const density=Math.min(1.4,wisps*wisps*ribbon*(.5+ridge*.75))*dust;
   const mix=Math.max(0,Math.min(1,(warp-.31)*3.8)),p0=palette[mix<.5?0:1],p1=palette[mix<.5?1:2],t=mix<.5?mix*2:(mix-.5)*2;
   let red=(p0[0]*(1-t)+p1[0]*t)*density,green=(p0[1]*(1-t)+p1[1]*t)*density,blue=(p0[2]*(1-t)+p1[2]*t)*density;
   if(variant.id==='andromeda'){
    const dx=u-.51,dy=(v-.54)*height/width,tilt=-.25;
    const gx=(dx*Math.cos(tilt)+dy*Math.sin(tilt))/.43,gy=(-dx*Math.sin(tilt)+dy*Math.cos(tilt))/(height/width*.32);
    const r=Math.hypot(gx,gy),a=Math.atan2(gy,gx),arms=(.5+.5*Math.cos((a-r*5.3)*3+(n-.5)*2))**5;
    const disc=Math.exp(-r*r*1.8),structure=(.22+arms*.95)*(fine*.7+.3)*disc;
    const core=Math.exp(-r*r*28)*.95,young=structure*Math.min(1,r*2),gas=arms*disc*Math.max(0,warp-.5)*2;
    red=red*.52+core*255+young*83+gas*220;green=green*.52+core*183+young*124+gas*36;blue=blue*.52+core*105+young*236+gas*121;
    const lane=1-Math.max(0,noise(gx*20+100,gy*20+100)-.45)*disc*.85;red*=lane;green*=lane;blue*=lane;
   }
   const edge=Math.min(1,u*5,(1-u)*5)*Math.min(1,v*5,(1-v)*5),index=(py*texture.width+px)*4;
   pixels.data[index]=red*edge;pixels.data[index+1]=green*edge;pixels.data[index+2]=blue*edge;pixels.data[index+3]=255;
  }
  tc.putImageData(pixels,0,0);c.save();c.globalCompositeOperation='screen';c.drawImage(texture,0,0,width,height);c.restore();
 }
 function baseStars(c,rand){
  const bg=c.createLinearGradient(0,0,width,height);bg.addColorStop(0,'#040512');bg.addColorStop(.6,'#0b0b21');bg.addColorStop(1,'#020812');c.fillStyle=bg;c.fillRect(0,0,width,height);
  paintNebula(c,rand);
  const count=mobile()?2600:10500,starColors=['177,210,255','254,219,168','223,192,255','255,173,190','165,243,236'];
  for(let i=0;i<count;i++){
   const x=rand()*width,y=rand()*height,r=rand(),alpha=.12+rand()*.65,color=starColors[i%starColors.length];
   c.fillStyle=`rgba(${color},${alpha})`;
   c.beginPath();c.arc(x,y,r>.996?1.6:r>.96?.9:.25+rand()*.4,0,Math.PI*2);c.fill();
   if(r>.997){bloom(c,x,y,13,color,.55);line(c,[{x:x-7,y},{x:x+7,y}],'#d2e5ff77',.5);line(c,[{x,y:y-7},{x,y:y+7}],'#d2e5ff77',.5);}
  }
  // Small foreground clusters and distant island galaxies give the field several scales.
  for(let cluster=0;cluster<(mobile()?8:19);cluster++){
   const cx=rand()*width,cy=height*(.20+rand()*.65),radius=7+rand()*28,color=starColors[cluster%starColors.length];
   bloom(c,cx,cy,radius*2,color,.10);
   for(let j=0;j<75;j++){const x=cx+gaussian(rand)*radius*.45,y=cy+gaussian(rand)*radius*.28;c.fillStyle=`rgba(${color},${.15+rand()*.55})`;c.fillRect(x,y,.6,.6);}
  }
  for(let i=0;i<4;i++){
   c.save();c.translate(width*(.12+i*.25),height*(i%2?.20:.80));c.rotate(-.5+i*.3);c.scale(1,.27);bloom(c,0,0,14+i*3,'220,195,162',.36);c.restore();
  }
 }
 function paintSolar(c,rand){
  const cx=width*.5,cy=height*.54,scale=mobile()?width/2.1:width*.43;
  bloom(c,cx,cy,scale*.7,'255,195,99',.25);bloom(c,cx,cy,scale*.30,'255,220,157',.4);
  for(let ring=1;ring<=7;ring++){
   const radius=[.30,.45,.57,.70,.82,.94,1.04][ring-1],rx=scale*radius,ry=height*.37*radius;
   c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);c.strokeStyle=ring<3?'#cbd7f232':'#a9bfde26';c.lineWidth=1;c.stroke();
  }
  for(let i=0;i<1300;i++){
   const a=rand()*Math.PI*2,r=.84+gaussian(rand)*.025,x=cx+Math.cos(a)*scale*r,y=cy+Math.sin(a)*height*.35*r;
   c.fillStyle=`rgba(190,190,179,${rand()*.24})`;c.fillRect(x,y,1,1);
  }
  c.save();c.globalCompositeOperation='screen';bloom(c,cx,cy,mobile()?65:95,'255,207,134',.7);c.restore();
 }
 function paintGalaxy(c,rand){
  const core=galaxyPoint(0,0),extent=mobile()?width*.7:width*.37;
  c.save();c.globalCompositeOperation='screen';bloom(c,core.x,core.y,extent,'89,104,190',.22);
  for(let arm=0;arm<3;arm++)for(let step=1;step<=48;step++){
   const r=step/48,p=galaxyPoint(r,arm*Math.PI*2/3+r*5.3);
   bloom(c,p.x,p.y,12+r*(mobile()?12:30),r>.5?'111,137,228':'213,163,123',.035);
  }
  for(let arm=0;arm<3;arm++)for(let i=0;i<(mobile()?3700:6400);i++){
   const r=Math.pow(rand(),.68),a=arm*Math.PI*2/3+r*5.3+gaussian(rand)*(.08+r*.12),p=galaxyPoint(r,a,gaussian(rand)*(2+r*9));
   const warm=r<.30,alpha=(.07+rand()*.23)*(1-r*.45),size=.35+rand()*(warm?1.65:1.25);
   c.fillStyle=warm?`rgba(255,209,147,${alpha})`:r>.6?`rgba(151,181,247,${alpha})`:`rgba(212,199,241,${alpha})`;
   c.fillRect(p.x,p.y,size,size);
   if(i%147===0)bloom(c,p.x,p.y,4+rand()*9,i%3===0?'255,102,168':'130,196,255',.3);
  }
  for(let i=0;i<2800;i++){
   const a=rand()*Math.PI*2,r=Math.abs(gaussian(rand))*.13,p=galaxyPoint(r,a,gaussian(rand)*3);
   c.fillStyle=`rgba(255,225,169,${.05+rand()*.24})`;c.fillRect(p.x,p.y,1.2,1.2);
  }
  bloom(c,core.x,core.y,mobile()?90:140,'255,191,119',.7);bloom(c,core.x,core.y,25,'255,239,195',.85);c.restore();
 }
 function positions(){
  if(isAndromeda()){
   const core=galaxyPoint(0,0);
   const outer=mobile()
    ? [[.78,.57],[.22,.48],[.22,.71],[.78,.34],[.78,.84],[.44,.93],[.44,.16]].map(([x,y])=>({x:x*width,y:y*height}))
    : [.4,.5,.6,.7,.8,.9,1.02].map((r,i)=>galaxyPoint(r,i%3*Math.PI*2/3+r*5.3));
   // Sort by visible distance, accounting for the tilted galaxy and viewport shape.
   outer.sort((a,b)=>Math.hypot(a.x-core.x,a.y-core.y)-Math.hypot(b.x-core.x,b.y-core.y));
   return [core,...outer];
  }
  if(mobile()){
   const coords={
    solar:[[.50,.51],[.78,.61],[.22,.64],[.50,.30],[.80,.36],[.78,.79],[.21,.81],[.18,.40]],
    voyage:[[.76,.28],[.30,.355],[.75,.43],[.29,.505],[.74,.58],[.28,.655],[.73,.73],[.27,.805]],
    vault:[[.52,.28],[.22,.40],[.79,.43],[.36,.54],[.76,.61],[.22,.66],[.54,.75],[.20,.84]]
   }[variant.id];
   return coords.map(([x,y])=>({x:x*width,y:y*height}));
  }
  if(variant.id==='solar'){
   const radii=[0,.30,.45,.57,.70,.82,.94,1.04],angles=[0,.32,2.25,4.55,5.6,.8,2.85,3.8];
   return radii.map((r,i)=>({x:width*.5+Math.cos(angles[i]+(i?orbitTime*.004:0))*width*.43*r,y:height*.54+Math.sin(angles[i]+(i?orbitTime*.004:0))*height*.37*r}));
  }
  if(variant.id==='voyage')return Array.from({length:8},(_,i)=>{const r=.96-i*.105;return {x:width*(.085+.83*r),y:height*(.54-.23*r+(i%2?.13:-.06))};});
  return [[.64,.26],[.40,.39],[.82,.43],[.23,.54],[.59,.56],[.89,.68],[.40,.73],[.15,.78]].map(([x,y])=>({x:x*width,y:y*height}));
 }
 function paintVoyage(c,rand){
  const ox=width*(mobile()?.5:.085),oy=height*(mobile()?.93:.85);
  c.save();c.globalCompositeOperation='screen';
  bloom(c,width*.87,height*.27,width*.34,'44,97,145',.3);bloom(c,ox,oy,width*.20,'119,172,204',.24);
  for(let i=0;i<800;i++){
   const t=rand(),a=rand()*1.8-1.5,x=ox+Math.cos(a)*width*t*1.2,y=oy+Math.sin(a)*height*t;
   c.fillStyle=`rgba(112,159,193,${rand()*.06})`;c.fillRect(x,y,1,1);
  }
  const points=positions();
  points.forEach((p,i)=>{
   const gradient=c.createLinearGradient(ox,oy,p.x,p.y);gradient.addColorStop(0,'#91bce300');gradient.addColorStop(.6,colors[i]+'14');gradient.addColorStop(1,colors[i]+'9a');
   c.beginPath();c.moveTo(ox,oy);c.bezierCurveTo(ox+(p.x-ox)*.4,oy-15,p.x-70,p.y+55,p.x,p.y);c.strokeStyle=gradient;c.lineWidth=1.2;c.stroke();
   for(let j=0;j<130;j++){
    const t=rand(),inv=1-t,x=inv**3*ox+3*inv*inv*t*(ox+(p.x-ox)*.4)+3*inv*t*t*(p.x-70)+t**3*p.x,y=inv**3*oy+3*inv*inv*t*(oy-15)+3*inv*t*t*(p.y+55)+t**3*p.y;
    c.fillStyle=colors[i]+Math.round((.02+t*.18)*255).toString(16).padStart(2,'0');c.fillRect(x+gaussian(rand)*3,y+gaussian(rand)*3,.8,.8);
   }
   bloom(c,p.x,p.y,mobile()?23:45,i===0?'255,208,135':'111,169,228',.35);
  });
  c.restore();
  c.beginPath();c.arc(ox,oy,5,0,Math.PI*2);c.fillStyle='#b5daec';c.fill();
  c.fillStyle='#8ea8bf';c.font='10px Lato,sans-serif';c.fillText('SHARED ORIGIN',ox-30,oy+25);
  if(!mobile()){
   for(let n=1;n<=4;n++){c.beginPath();c.ellipse(ox,oy,width*.24*n,height*.25*n,0,-1.3,-.1);c.strokeStyle='#b3cdea0c';c.stroke();}
  }
 }
 function paintVault(c,rand){
  const cx=width*.5,cy=height*1.4,rx=width*(mobile()?1.8:.8),ry=height*.65;
  c.save();c.globalCompositeOperation='screen';bloom(c,width*.53,height*.92,width*.50,'73,112,167',.3);
  const horizon=c.createRadialGradient(cx,cy,ry*.8,cx,cy,rx*1.2);horizon.addColorStop(0,'#243c61');horizon.addColorStop(.5,'#426388');horizon.addColorStop(1,'#090e1b');
  c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);c.fillStyle=horizon;c.fill();c.strokeStyle='#9ec8ff99';c.lineWidth=2;c.stroke();c.restore();
  for(let ring=0;ring<4;ring++){
   c.beginPath();c.ellipse(cx,height*.86,width*(.25+ring*.22),height*(.20+ring*.19),0,Math.PI,Math.PI*2);c.strokeStyle='#b5ccec13';c.lineWidth=.75;c.stroke();
  }
  const points=positions(),chain=[7,6,3,1,0,2,4,5];
  line(c,chain.map(i=>points[i]),'#b8cef16b',.8);
  [[3,6],[1,4],[2,5],[1,2],[6,4]].forEach(([a,b])=>line(c,[points[a],points[b]],'#b8cef124',.7));
  points.forEach((p,i)=>bloom(c,p.x,p.y,i===0?75:22,i===0?'255,208,139':'136,184,239',i===0?.35:.15));
  for(let i=0;i<160;i++){
   const x=rand()*width,y=height*(.76+rand()*.18);c.fillStyle=`rgba(121,164,217,${rand()*.16})`;c.fillRect(x,y,.8,.8);
  }
 }
 function buildBackground(){
  background=document.createElement('canvas');background.width=width*dpr;background.height=height*dpr;
  const c=background.getContext('2d');c.scale(dpr,dpr);const rand=random(4119+variants.indexOf(variant)*112);
  baseStars(c,rand);
  ({solar:paintSolar,andromeda:paintGalaxy,voyage:paintVoyage,vault:paintVault})[variant.id](c,rand);
  const vignette=c.createRadialGradient(width*.5,height*.5,width*.12,width*.5,height*.5,width*.7);vignette.addColorStop(0,'#02071100');vignette.addColorStop(1,'#02071166');c.fillStyle=vignette;c.fillRect(0,0,width,height);
 }
 function renderNodes(){
  nodes.innerHTML=order.map((m,i)=>`<button type="button" class="model-star${i===0?' is-leader':''}" data-star="${m.id}" aria-label="${m.name}, preview position ${i+1}" aria-pressed="${m.id===selected}" style="--star-size:${mobile()?(i===0?48:34):(i===0?65:43)}px;--star-glow:${colors[i]}70"><span class="star-emblem"><img src="${m.logo}" alt="" width="32" height="32"><span class="star-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></span><span class="star-name">${m.name}<small>${i===0?'LEADING POSITION':m.agent}</small></span></button>`).join('');
  starButtons=[...nodes.querySelectorAll('[data-star]')];
 }
 function detail(){
  const model=models.find(m=>m.id===selected),rows=Results.official.results.filter(r=>r.model_id===selected),covered=new Set(rows.map(r=>r.task_id));
  document.querySelector('.preview-detail').innerHTML=`<div class="selected-identity"><img src="${model.logo}" alt="" width="32" height="32"><div><span class="study-label">SELECTED MODEL</span><h3>${model.name}</h3><p>${model.agent} · Preview position ${String(order.findIndex(m=>m.id===selected)+1).padStart(2,'0')}</p></div></div><div class="preview-coverage"><div class="coverage-heading"><span>Measured task coverage</span><strong>${covered.size} / 23 tasks</strong></div><div class="coverage-grid" role="img" aria-label="${covered.size} of 23 tasks evaluated">${TASKS.map(t=>`<span class="${covered.has(t.id)?'is-evaluated':''}" title="${t.id}: ${covered.has(t.id)?'evaluated':'no measurement'}"></span>`).join('')}</div></div><a class="detail-link" href="leaderboard.html?model=${model.id}&detail=1">Explore measured results <span aria-hidden="true">↗</span></a>`;
  if(!covered.size){const link=document.querySelector('.preview-detail .detail-link');link.removeAttribute('href');link.setAttribute('aria-disabled','true');}
  document.querySelectorAll('[data-select-model],[data-star]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.selectModel||b.dataset.star)===selected)));
  if(isAndromeda())document.querySelector('.preview-detail').innerHTML=`<div class="selected-identity"><img src="${model.logo}" alt="" width="32" height="32"><h3>${model.name}</h3></div>${covered.size?`<a class="detail-link" href="leaderboard.html?model=${model.id}&detail=1">View model results <span aria-hidden="true">↗</span></a>`:''}`;
 }
 function select(id){selected=id;detail();draw();}
 function motionButton(){
  const button=document.querySelector('[data-action=motion]'),label=playing?'Pause motion':'Play motion';
  button.innerHTML=`<svg viewBox="0 0 22 22" aria-hidden="true">${icons[playing?'pause':'play']}</svg>`;button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(playing));
 }
 function updateVariant(id,writeURL=true){
  variant=variants.find(v=>v.id===id)||variants[1];elapsed=0;orbitTime=0;pan={x:0,y:0};pointer={x:0,y:0};
  if(writeURL){history.pushState({},'',urlFor(variant.id));}
  document.querySelector('#scene-label').textContent=sceneTitle();document.querySelector('#scene-title').textContent=variant.title;document.querySelector('#scene-description').textContent=variant.text;document.querySelector('#direction-text').textContent=variant.direction;document.querySelector('#switcher-title').textContent=`0${variants.indexOf(variant)+1} · ${variant.name}`;
  document.querySelectorAll('[data-variant]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.variant===variant.id)));
  scene.dataset.variant=variant.id;document.body.dataset.stellarVariant=variant.id;
  document.querySelector('.study-heading h1').textContent=isAndromeda()?'Overall leaderboard':'A universe of embodied intelligence.';
  scene.setAttribute('aria-label',isAndromeda()?'Overall model galaxy. The leading model is at the core; models closer to the core have stronger performance.':variant.title);
  scene.removeAttribute('aria-labelledby');renderNodes();buildBackground();detail();draw();
  if(writeURL&&!reduced.matches)scene.animate([{opacity:.55},{opacity:1}],{duration:450,easing:'ease-out'});
 }
 function resize(){
  const rect=scene.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);renderNodes();buildBackground();draw();
 }
 function draw(){
  if(!width)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.drawImage(background,0,0,width,height);
  const points=positions(),amount=mobile()||isAndromeda()?0:1;
  pan.x+=(pointer.x-pan.x)*.06;pan.y+=(pointer.y-pan.y)*.06;
  for(let i=0;i<12;i++){
   const x=((i*173.71+67)%1200)/1200*width,y=((i*87.37+19)%500)/500*height;
   const alpha=.12+(Math.sin(elapsed*.7+i*2)+1)*.12;ctx.fillStyle=`rgba(203,220,255,${alpha})`;ctx.beginPath();ctx.arc(x+pan.x*amount*1.8,y+pan.y*amount*1.8,.9,0,Math.PI*2);ctx.fill();
  }
  if(variant.id==='voyage'){
   const ox=width*(mobile()?.5:.085),oy=height*(mobile()?.93:.85);
   points.forEach((p,i)=>{
    for(let n=0;n<3;n++){
     const t=(elapsed*.035+n/3+i*.07)%1,inv=1-t;
     const x=inv**3*ox+3*inv*inv*t*(ox+(p.x-ox)*.4)+3*inv*t*t*(p.x-70)+t**3*p.x;
     const y=inv**3*oy+3*inv*inv*t*(oy-15)+3*inv*t*t*(p.y+55)+t**3*p.y;
     ctx.fillStyle=colors[i]+'99';ctx.beginPath();ctx.arc(x,y,1.1,0,Math.PI*2);ctx.fill();
    }
   });
  }
  if(variant.id==='andromeda'){
   for(let arm=0;arm<3;arm++)for(let n=0;n<24;n++){
    const r=.12+n*.034,a=arm*Math.PI*2/3+r*5.3+elapsed*.008,p=galaxyPoint(r,a);
    ctx.fillStyle=`rgba(185,204,255,${.14+Math.sin(elapsed*.4+n)*.07})`;
    ctx.beginPath();ctx.arc(p.x,p.y,.7,0,Math.PI*2);ctx.fill();
   }
  }
  points.forEach((point,i)=>{
   const x=point.x+pan.x*amount*(.6+i*.03),y=point.y+pan.y*amount*(.6+i*.03);
   if(variant.id==='solar'&&i===0){ctx.save();ctx.globalCompositeOperation='screen';bloom(ctx,x,y,mobile()?43:74,'255,209,144',.22+Math.sin(elapsed)*.035);ctx.restore();}
   const selectedNode=order[i].id===selected;
   if(selectedNode){ctx.beginPath();ctx.arc(x,y,mobile()?32:i===0?49:36,elapsed*.12,elapsed*.12+Math.PI*1.65);ctx.strokeStyle=i===0?'#ffe3ac77':'#c2d8ff66';ctx.lineWidth=.7;ctx.stroke();}
   starButtons[i].style.transform=`translate3d(${x}px,${y}px,0)`;
  });
 }
 function frame(now){
  const delta=Math.min((now-last)/1000||0,.05);last=now;
  if(playing&&!document.hidden&&!reduced.matches){elapsed+=delta;if(!hold)orbitTime+=delta;draw();}
  raf=requestAnimationFrame(frame);
 }
 scene.addEventListener('pointermove',event=>{if(mobile()||reduced.matches)return;const rect=scene.getBoundingClientRect();pointer={x:(event.clientX-rect.left-width/2)/width*12,y:(event.clientY-rect.top-height/2)/height*8};});
 scene.addEventListener('pointerleave',()=>{pointer={x:0,y:0};hold=false;});
 nodes.addEventListener('pointerover',event=>{if(event.target.closest('[data-star]'))hold=true;});
 nodes.addEventListener('pointerout',event=>{if(!event.relatedTarget?.closest?.('[data-star]'))hold=false;});
 nodes.addEventListener('focusin',()=>{hold=true;});nodes.addEventListener('focusout',()=>{hold=false;});
 document.addEventListener('click',event=>{
  const star=event.target.closest('[data-star],[data-select-model]');if(star){select(star.dataset.star||star.dataset.selectModel);return;}
  const choice=event.target.closest('a[data-variant]');if(choice&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey){event.preventDefault();updateVariant(choice.dataset.variant);return;}
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.switch){const index=variants.indexOf(variant);updateVariant(variants[(index+Number(button.dataset.switch)+variants.length)%variants.length].id);}
  if(button.dataset.action==='motion'){playing=!playing;motionButton();if(!playing)draw();}
  if(button.dataset.action==='cycle'){order.push(order.shift());selected=order[0].id;orbitTime=0;renderNodes();buildBackground();detail();draw();}
 });
 document.addEventListener('keydown',event=>{
  if(isAndromeda())return;
  if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable=true],[role=slider]'))return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();const index=variants.indexOf(variant),direction=event.key==='ArrowRight'?1:-1;
   updateVariant(variants[(index+direction+variants.length)%variants.length].id);
  }
 });
 window.addEventListener('popstate',()=>updateVariant(new URLSearchParams(location.search).get('variant'),false));
 reduced.addEventListener('change',()=>{playing=!reduced.matches;motionButton();draw();});
 window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));
 new ResizeObserver(resize).observe(scene);
 resize();updateVariant(variant.id,false);motionButton();raf=requestAnimationFrame(frame);
})();
