(()=>{
  const $=id=>document.getElementById(id),providers=()=>window.PROVIDERS||[];
  const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const evidenceTypeLabel={disease_focus:"Disease focus",procedure:"Procedure",specialist_clinic:"Specialist clinic",second_opinion:"Second opinion",service:"Service",research_focus:"Research focus",legacy:"Expertise evidence"};
  const stop=new Set(["the","and","for","with","care","clinic","hospital","medical","disease","treatment","specialist"]);
  const tokens=q=>String(q||"").toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>2&&!stop.has(x));
  const normalizeEvidence=p=>(Array.isArray(p?.expertiseEvidence)?p.expertiseEvidence:[]).map((e,i)=>typeof e==="string"?{type:"legacy",label:e,status:"demo",source:null,id:`legacy-${i}`}:{type:e?.type||"legacy",label:e?.label||e?.name||"",status:e?.evidenceStatus||e?.status||"unverified",source:e?.sourceUrl||e?.source||null,id:e?.id||`evidence-${i}`}).filter(e=>e.label);
  const isHttps=v=>/^https:\/\//i.test(String(v||""));
  function evidenceMatches(p,q){
    const needle=String(q||"").trim().toLowerCase(),ts=tokens(q);
    if(!needle)return[];
    return normalizeEvidence(p).filter(e=>{const h=e.label.toLowerCase();return h.includes(needle)||ts.some(t=>h.includes(t));}).map(e=>({...e,sourceBacked:e.status==="official-source-verified"&&isHttps(e.source)}));
  }
  function specialtyMatch(p,q){
    const needle=String(q||"").trim().toLowerCase(),ts=tokens(q),h=(p?.specialties||[]).join(" ").toLowerCase();
    return Boolean(needle&&(h.includes(needle)||ts.some(t=>h.includes(t))));
  }
  function route(p){
    const checked=p?.recordStatus==="official-source-verified",prefix=checked?"Source-checked record":"DEMO · UNVERIFIED record";
    if(p?.doctorEnglish==="yes")return{code:"direct-physician-english",strength:4,label:"Direct physician English recorded",detail:`${prefix}; confirm current availability before booking.`,verified:checked};
    if(["yes","available"].includes(p?.interpreter))return{code:"interpreter",strength:4,label:"Interpreter pathway recorded",detail:`${prefix}; confirm the interpreter applies to the requested specialist visit.`,verified:checked};
    if(p?.interpreter==="external")return{code:"external-interpreter",strength:2,label:"External interpreter arrangement recorded",detail:`${prefix}; this is not confirmation of an in-house specialist interpreter.`,verified:checked};
    if(["partial","limited"].includes(p?.doctorEnglish))return{code:"partial-or-limited-english",strength:1,label:"Partial / limited physician English recorded",detail:`${prefix}; communication suitability still needs confirmation.`,verified:checked};
    return{code:"no-documented-route",strength:0,label:"No specialist language route confirmed",detail:"The current record does not confirm direct physician English or an interpreter route for this visit.",verified:false};
  }
  function snapshot(p,q){
    const matches=evidenceMatches(p,q),backed=matches.filter(e=>e.sourceBacked),specialty=specialtyMatch(p,q),r=route(p);
    const evidenceState=!String(q||"").trim()?"no-query":backed.length?"source-backed":matches.length?"record-only":specialty?"specialty-only":"no-match";
    const evidenceStrength={"source-backed":4,"record-only":2,"specialty-only":1,"no-match":0,"no-query":0}[evidenceState]||0;
    return{query:String(q||"").trim(),evidenceState,evidenceStrength,sourceBackedCount:backed.length,matches:matches.slice(0,6),route:r,providerProvenance:p?.recordStatus==="official-source-verified"?"official-source-checked":"demo-unverified",rank:evidenceStrength*100+r.strength*15+(p?.recordStatus==="official-source-verified"?10:0)};
  }
  function currentQuery(){return $("q")?.value?.trim()||"";}
  function providerForCard(card){const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name);}
  function evidenceMarkup(s){
    if(s.evidenceState==="source-backed")return `<span class="specialist-state backed">SOURCE-BACKED MATCH</span>`;
    if(s.evidenceState==="record-only")return `<span class="specialist-state verify">UNVERIFIED EVIDENCE MATCH</span>`;
    if(s.evidenceState==="specialty-only")return `<span class="specialist-state verify">SPECIALTY TEXT MATCH ONLY</span>`;
    return `<span class="specialist-state none">NO SPECIFIC EVIDENCE MATCH</span>`;
  }
  function panel(p,q){
    const s=snapshot(p,q),matched=s.matches.map(e=>e.sourceBacked?`<a href="${escapeHtml(e.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(evidenceTypeLabel[e.type]||e.type)}: ${escapeHtml(e.label)} ↗</a>`:`<span>${escapeHtml(evidenceTypeLabel[e.type]||e.type)}: ${escapeHtml(e.label)} · ${p.recordStatus==="official-source-verified"?"not source-linked":"DEMO / unverified"}</span>`).join("");
    return `<section class="specialist-access-panel" aria-label="Searched expertise and access pathway"><div class="specialist-head"><small>SEARCHED EXPERTISE + ACCESS</small>${evidenceMarkup(s)}</div><div class="specialist-grid"><div><small>EXPERTISE EVIDENCE</small><b>${s.sourceBackedCount?`${s.sourceBackedCount} source-backed match${s.sourceBackedCount===1?"":"es"}`:s.matches.length?`${s.matches.length} match${s.matches.length===1?"":"es"} needing source verification`:s.evidenceState==="specialty-only"?"Specialty-level match only":"No specific evidence match"}</b><div class="specialist-evidence-list">${matched||"No disease/procedure evidence in the current record matched this search."}</div></div><div><small>LANGUAGE ACCESS ROUTE</small><b>${escapeHtml(s.route.label)}</b><span>${escapeHtml(s.route.detail)}</span></div></div><p>These are separate logistics/evidence checks. A match does not indicate better medical quality, outcomes, or that this provider is appropriate for an individual patient.</p></section>`;
  }
  function ensureStyles(){
    if($("jh-specialist-access-styles"))return;
    const s=document.createElement("style");s.id="jh-specialist-access-styles";s.textContent=`.specialist-access-panel{margin:12px 0;padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#f9fbfd}.specialist-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.specialist-head>small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#607487}.specialist-state{padding:4px 7px;border-radius:999px;font-size:7px;font-weight:900}.specialist-state.backed{background:#e8f7f2;color:#176b58}.specialist-state.verify{background:#fff2df;color:#8a5a18}.specialist-state.none{background:#eef3f8;color:#607487}.specialist-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:8px}.specialist-grid>div{padding:9px;border:1px solid #e4ebf1;border-radius:9px;background:#fff}.specialist-grid small,.specialist-grid b,.specialist-grid span,.specialist-evidence-list a{display:block}.specialist-grid small{font-size:7px;color:#718295}.specialist-grid b{font-size:9px;margin:3px 0}.specialist-grid span,.specialist-evidence-list a{font-size:7px;line-height:1.4;color:#607487}.specialist-evidence-list{display:grid;gap:3px;margin-top:5px}.specialist-evidence-list a{font-weight:800;color:#176df0}.specialist-access-panel>p{font-size:7px;line-height:1.45;color:#718295;margin:8px 0 0}.specialist-directory-summary{margin:10px 0;padding:10px 12px;border:1px solid #dce6ef;border-radius:10px;background:#fff;font-size:8px;line-height:1.45;color:#526579}.specialist-directory-summary b{color:#173c5f}.specialist-sort-note{font-size:7px;color:#718295;margin-top:5px}@media(max-width:650px){.specialist-head{align-items:flex-start;flex-direction:column}.specialist-grid{grid-template-columns:1fr}}`;
    document.head.appendChild(s);
  }
  let busy=false;
  function decorate(){
    if(busy)return;busy=true;
    try{
      const q=currentQuery(),grid=$("providerGrid");if(!grid)return;
      const cards=[...grid.querySelectorAll(":scope > .provider-card")];
      cards.forEach(card=>{card.querySelector(".specialist-access-panel")?.remove();const p=providerForCard(card);if(!p||!q){delete card.dataset.specialistRank;return}const s=snapshot(p,q);card.dataset.specialistRank=String(s.rank);const target=card.querySelector(".match-panel")||card.querySelector(".provider-meta");target?.insertAdjacentHTML("afterend",panel(p,q));});
      const sort=$("sort")?.value;
      if(q&&sort==="specialist-access"&&cards.length>1){const ordered=[...cards].sort((a,b)=>(Number(b.dataset.specialistRank)||0)-(Number(a.dataset.specialistRank)||0));if(ordered.some((c,i)=>c!==cards[i]))ordered.forEach(c=>grid.appendChild(c));}
      let summary=$("specialistDirectorySummary");
      if(!summary){summary=document.createElement("div");summary.id="specialistDirectorySummary";summary.className="specialist-directory-summary";summary.setAttribute("aria-live","polite");document.querySelector(".results-bar")?.insertAdjacentElement("beforebegin",summary);}
      if(!q){summary.hidden=true;return}summary.hidden=false;
      const snaps=cards.map(providerForCard).filter(Boolean).map(p=>snapshot(p,q));
      const backed=snaps.filter(s=>s.sourceBackedCount>0).length,verifiedRoute=snaps.filter(s=>s.route.verified&&["direct-physician-english","interpreter"].includes(s.route.code)).length,both=snaps.filter(s=>s.sourceBackedCount>0&&s.route.verified&&["direct-physician-english","interpreter"].includes(s.route.code)).length;
      summary.innerHTML=`<b>${both} result${both===1?"":"s"}</b> currently combine source-backed searched expertise evidence with a source-checked direct-English/interpreter route · ${backed} have source-backed expertise evidence · ${verifiedRoute} have a source-checked direct-English/interpreter route. Verify that the language route applies to the requested specialist service before booking.`;
    }finally{busy=false;}
  }
  function ensureSort(){
    const sort=$("sort");if(!sort||[...sort.options].some(o=>o.value==="specialist-access"))return;
    const o=document.createElement("option");o.value="specialist-access";o.textContent="Searched expertise + access evidence";sort.appendChild(o);
  }
  function snapshotForId(id,q=currentQuery()){const p=providers().find(x=>x.id===id);return p?snapshot(p,q):null;}
  window.JapanHealthSpecialistAccess={snapshot,snapshotForId};
  ensureStyles();ensureSort();decorate();
  ["q","audience","language","sort"].forEach(id=>$(id)?.addEventListener("input",()=>requestAnimationFrame(decorate)));
  const grid=$("providerGrid");if(grid)new MutationObserver(()=>requestAnimationFrame(decorate)).observe(grid,{childList:true});
  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    try{
      const url=typeof input==="string"?input:input?.url;
      if(url==="/api/lead"&&String(init.method||"GET").toUpperCase()==="POST"&&typeof init.body==="string"){
        const body=JSON.parse(init.body),q=String(body?.accessConstraints?.q||"").trim(),snap=snapshotForId(body.providerId,q);
        if(snap&&q)body.specialistAccessSnapshot={query:q,evidenceState:snap.evidenceState,sourceBackedCount:snap.sourceBackedCount,matches:snap.matches.map(e=>({type:e.type,label:e.label,status:e.status,sourceUrl:e.sourceBacked?e.source:null})),accessRoute:snap.route.code,accessRouteVerified:snap.route.verified,provenance:snap.providerProvenance,disclaimer:"Search-evidence and language-route context only; not medical advice, clinical quality, outcomes, or a guarantee the access route applies to the requested service."};
        init={...init,body:JSON.stringify(body)};
      }
    }catch(_){/* keep original request if optional enrichment fails */}
    return nativeFetch(input,init);
  };
})();
