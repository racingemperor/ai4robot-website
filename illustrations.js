/* Concept diagrams shared by task and episode pages. */
function drawing(id='T11', compact=false){
 const t=task(id); const c=group(t.group).color;
 const art=t.group==='navigate'?`<path d="M90 220V70h160v65h130V75h150v165H350v-55H200v55Z"/><path class="art-path" d="M110 202h70v-80h115v40h100v40h100" stroke="${c}"/><circle cx="110" cy="202" r="6" fill="${c}"/><circle cx="495" cy="202" r="9"/>`
 :t.group==='construct'?`<path d="M160 215V100l145-58 145 58v115l-145 60Z M160 100l145 60 145-60 M305 160v115 M230 130v115 M380 130v115 M160 158l145 60 145-60"/><path class="art-path" d="M230 130v115l75 30" stroke="${c}"/><path d="m465 102 55-22v115l-55 22Z"/>`
 :t.group==='dexterity'?`<path d="M235 247v-75l-32-54q-8-18 5-24t23 8l33 48v-91q0-23 15-23t15 23v77-105q0-20 15-20t15 20v108-89q0-20 15-20t15 20v104-60q0-19 15-19t15 19v109l-32 49Z"/><path class="art-path" d="m185 140 220-25" stroke="${c}"/><circle cx="309" cy="128" r="36" stroke-dasharray="3 6"/>`
 :t.id==='T06'?`<path d="M70 245h470 M98 245v-28h410v28 M370 170l125-6-17 57H386Z M375 184l110-5 M380 200l101-5 M395 173l9 46m20-48 4 48m19-49 1 48m20-49-3 49"/><rect x="135" y="179" width="139" height="25" rx="12" transform="rotate(-12 135 179)"/><rect x="145" y="135" width="101" height="22" rx="11" transform="rotate(8 145 135)"/><path class="art-path" d="M92 90h33v30l95-44 68 46 45 4 M307 116l-5 22m39-15 2 22 M175 174l8 10m16-15 8 10m17-15 8 10m17-15 8 10" stroke="${c}"/><circle cx="220" cy="76" r="11"/><circle cx="288" cy="122" r="9"/><path d="M280 176c34-42 62-40 97-20" stroke-dasharray="4 6"/>` :t.id==='T11'?`<path d="M290 58h234v171H290Z M300 68h214v151H300Z M355 229v32m110-32v32 M78 264h128 M120 264v-39h44v39 M145 224v-74l61-43 72 30 34-23"/><circle cx="145" cy="150" r="13"/><circle cx="206" cy="107" r="12"/><circle cx="278" cy="137" r="9"/><path d="m312 114 18-11"/><path class="art-path" d="M341 102h20v18h-20v20h24m17-38v38m0-38h20v38m18-38v38m-79 20h22m18 0h19m20 0h22m-102 18h60" stroke="${c}"/>`
 :`<path d="M85 245h440 M130 245v-40h40v40 M150 205v-70l65-48 65 45 27 29 M450 245v-40h-40v40 M430 205v-70l-65-48-65 45-16 27"/><circle cx="150" cy="135" r="12"/><circle cx="215" cy="87" r="11"/><circle cx="280" cy="132" r="9"/><circle cx="430" cy="135" r="12"/><circle cx="365" cy="87" r="11"/><circle cx="300" cy="132" r="9"/><path class="art-path" d="m285 173 25-16 19 24-25 16Z" stroke="${c}"/>`;
 return `<svg class="technical-art ${compact?'compact':''}" viewBox="0 0 610 300" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path class="art-grid" d="M40 50H570M40 100H570M40 150H570M40 200H570M40 250H570M100 25V280M200 25V280M300 25V280M400 25V280M500 25V280"/>${art}<path stroke-width="1" d="M50 40h12m-6-6v12 M550 260h12m-6-6v12"/></svg>`;
}

function media(id,extra='') {const t=task(id);return Evidence.slot('VIDEO',t.name,`${t.id} · Representative task episode · 16:9`,extra);}

/* Original task concepts. These are reserved image positions, not experiment frames. */
function thumbnail(t) {
 const arm='<path d="M58 183v-26l37-40 43 18 17-25m-5-7 12 12m-6-12 8 4"/><circle cx="95" cy="117" r="8"/><circle cx="138" cy="135" r="6"/><path d="M42 183h32v13H42z"/>';
 const hand='<path d="m128 196-24-41-20-27q-6-12 4-15t17 13l16 18V88q0-15 9-15t9 15v49-69q0-14 9-14t9 14v68-59q0-14 9-14t9 14v65-36q0-13 9-13t9 13v64l-18 30Z"/>';
 const human='<circle cx="125" cy="61" r="14"/><path d="M111 79h28l11 64h-50ZM112 143l-15 50m39-50 18 50M107 92l-28 32 25 28m38-60 30 27 21-22"/>';
 const floor='<path d="M30 198h340" stroke-opacity=".35"/>';
 const scenes={
  T01:`${arm}<path d="M342 183v-26l-37-40-43 18-17-25m5-7-12 12"/><circle cx="305" cy="117" r="8"/><path d="m167 130 31-20 33 22-25 22-21-20m12 15-27 20-23-17" stroke-width="4"/><path d="M178 97q28-30 57 0" stroke-dasharray="4 5"/>`,
  T02:`${arm}<path d="m175 112 30-17 28 22-30 17ZM192 108v-22m9 17V80m9 18V84M239 160l67-10 23 25-66 13Z"/><circle cx="268" cy="166" r="3"/><circle cx="288" cy="163" r="3"/><circle cx="283" cy="176" r="3"/><path d="m215 137 28 18" stroke-dasharray="4 4"/>`,
  T03:`${arm}<path d="m158 155 137-13 41 43-137 13Z"/>${Array.from({length:3},(_,r)=>Array.from({length:7},(_,c)=>`<rect x="${179+c*18+r*8}" y="${153+r*12}" width="12" height="7" rx="1"/>`).join('')).join('')}<path d="M211 68h105v38H211z"/><text x="225" y="93">HELLO_</text>`,
  T04:`${arm}<path d="M342 183v-26l-37-40-43 18-17-25M174 175h102a12 12 0 0 0 0-24H174a12 12 0 0 0 0 24Z"/><path d="m213 107 13 8-15 51-14-5Zm-3 45 25 18m-53-19v23m66-23v23m20-23v23"/>`,
  T05:`${arm}<path d="m190 75 125 20-24 99-125-20ZM178 105l88 30-24 24-30-21-23 14"/><path d="m156 110 40 29" stroke-width="4"/>`,
  T06:`${arm}<rect x="167" y="161" width="99" height="17" rx="8" transform="rotate(-12 167 161)"/><rect x="177" y="122" width="65" height="15" rx="7" transform="rotate(8 177 122)"/><path d="m278 140 69-6-11 49-49 4Zm3 14 61-5m-56 19 53-5m-42-24 6 45m15-46-1 45"/><path d="M222 108q36-40 73 6" stroke-dasharray="4 5"/>`,
  T07:`${hand}<path d="m214 93 54-25 53 28v61l-53 27-54-27Zm0 0 54 29 53-26m-53 26v62m-54-61 54 29 53-27m-81-43v61m54-62v61"/><path d="M228 53q35-24 73 0" stroke-dasharray="4 5"/>`,
  T08:`${hand}<path d="M199 119q-23-38-35-27m33 23q28-15 43 8 16 33-12 56-15 17-32 0-23 12-34-13-16-39 15-49Z"/><path d="M207 104q4-17 23-16-4 17-23 16"/><path d="M266 173v-60m-7 9 7-11 7 11" stroke-dasharray="4 4"/>`,
  T09:`${human}<circle cx="239" cy="166" r="22"/><path d="M281 179h62v17h-62m-41-62q24-34 60-13" stroke-dasharray="4 5"/>`,
  T10:`${human}<path d="M223 58h103v120H223m0-80h103m-103 43h103"/><rect x="246" y="117" width="18" height="25" rx="3"/><path d="m173 184 30-37 42 39 43-25 42 31" stroke-dasharray="4 5"/>`,
  T11:`${human}<path d="M220 50h125v117H220zM234 63h97v89h-97zM237 167v28m91-28v28m-132-98 39-15"/><text x="248" y="95">def act():</text><text x="253" y="120">move()</text>`,
  T12:`${arm}<path d="M45 197v12h65v-12m15-147h57v37h-57zm72 0h57v37h-57zm72 0h57v37h-57zM210 149h42v43h-42z"/><circle cx="293" cy="170" r="22"/><path d="M182 105q61-17 87 28" stroke-dasharray="4 5"/>`,
  T13:`<path d="M43 73h106v87H43z"/><text x="55" y="101">A room.</text><text x="55" y="124">A door.</text><path d="m166 119 32 0m-8-7 8 7-8 7m31-36 65-31 68 35v77l-68 33-65-35Zm0 0 65 36 68-36m-68 36v77m-34-62v44m69-78v46"/>`,
  T14:`<path d="m83 100 108-56 130 59v85l-130 35-108-35Zm0 0 108 54 130-51m-130 51v69M83 144l108 43 130-42M110 115v79m56-52v72m61-80v79m53-102v85"/><path d="M41 60h42v30H41zm4 8 13 11 19-11" stroke-dasharray="3 4"/>`,
  T15:`${hand}<rect x="220" y="84" width="108" height="78" rx="2"/><path d="m260 104 26 18-26 18Z"/><path d="m212 184 18-14 21 18 23-19 20 18 24-18" stroke-dasharray="4 4"/>`,
  T16:`<path d="M100 122h120l18 23-11 9H113ZM115 153l-22 37m55-37 12 37m42-37-13 37m37-37 20 37M220 123l25-12 13 14-21 19"/><path d="M273 121V58h76m-67 48 18-17 17 5 23-27"/><path d="m42 201 41-8 63 8 48-5 60 1 44-16 50 1"/>`,
  T17:`${hand}<path d="m178 107 126-36" stroke-width="6"/><path d="M242 52q70 14 54 71t-71 18m0 0 16-1m-16 1 5-15" stroke-dasharray="4 5"/>`,
  T19:`${arm}<path d="m197 99 38-10 16 59-40 11Zm43-4q33-2 28 26l-16 5m16 19h47l-8 49h-31Zm4 28h38m-65-48 25 26" stroke-dasharray="3 3"/>`,
  T20:`${arm}<path d="M339 183v-26l-37-40-43 18-17-25"/><path d="M146 190q26-47 76-27l50 9 40 23H144m50-8 47-13m-36 14 24-21m-11 9q-50-55-45-9 2 22 45 9 48-10 32-39-14-22-32 39m0 0-30 22m30-22 40 16"/>`,
  T21:`<path d="M63 55h99v60h71V55h103v140H233v-42h-71v42H63z"/><path d="m84 174 34-24 3-64 56 46 85 0 32-45 24 87" stroke-dasharray="5 5"/>${[[113,76],[282,76],[317,174],[247,174],[83,174]].map(([x,y],i)=>`<rect x="${x-7}" y="${y-7}" width="14" height="14"/><text x="${x+11}" y="${y+4}">${i+1}</text>`).join('')}`,
  T22:`<path d="M64 59h116v57h40V59h116v137H220v-44h-40v44H64Z"/><path d="m90 169 47-32 102-1 62-37" stroke-dasharray="5 5"/><text x="88" y="91">START</text><text x="246" y="181">GOAL</text><circle cx="301" cy="99" r="12"/>`,
  T23:`<path d="M54 67h291v119H54z" stroke-opacity=".4"/><path d="M76 164q83-109 137-25t112-46" stroke-dasharray="5 5"/>${[[125,110],[221,85],[275,162]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9"/><path d="M${x-10} ${y+12}h20v25h-20Zm10 25v14m-20-1 10-13 10 13"/>`).join('')}<path d="m326 89 12-5v15"/>`
 };
 return `<svg class="task-thumbnail" viewBox="0 0 400 240" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><defs><pattern id="grid-${t.id}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" stroke="currentColor" stroke-opacity=".07" stroke-width="1"/></pattern></defs><path fill="url(#grid-${t.id})" stroke="none" d="M0 0h400v240H0z"/><g>${floor}${scenes[t.id]}</g><path d="M20 28h8m-4-4v8m348 180h8m-4-4v8" stroke-opacity=".45"/></svg>`;
}
