(()=>{
  const $=id=>document.getElementById(id),providers=()=>window.PROVIDERS||[];
  const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const evidenceTypeLabel={disease_focus:"Disease focus",procedure:"Procedure",specialist_clinic:"Specialist clinic",second_opinion:"Second opinion",service:"Service",research_focus:"Research focus",legacy:"Expertise evidence"};
  const routeLabel={"direct-physician-english":"Direct physician English","interpreter":"Interpreter pathway","external-interpreter":"External interpreter arrangement","language-support":"Documented language support"};
  const stop=new Set(["the","and","for","with","care","clinic","hospital","medical","disease","treatment","specialist"]);
  const tokens=q=>String(q||"").toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>2&&!stop.has(x));
  const isHttps=v=>/^https:\/\//i.test(String(v||""));
  function normalizeServiceAccess(a){
    if(!a||typeof a!=="object")return null;
    const status=a.evidenceStatus||a.status||"unverified",source=a.sourceUrl||a.source||null;
    return{route:a.route||"language-support",status,source,verified:a.verifiedDate||a.verified||null,notes:a.notes||"",sourceBacked:status==="official-source-verified"&&isHttps(source)};
  }
  function normalizeAccessRequirements(a){
    if(!a||typeof a!=="object")return null;
    const source=a.sourceUrl||a.source||null;
    return{audience:Array.isArray(a.audience)?a.audience.slice(0,3):[],audienceDetail:a.audienceDetail||"",referral:a.referral||"unknown",referralDetail:a.referralDetail||"",bookingStart:a.bookingStart||"",coordinator:a.coordinator||"unknown",coordinatorDetail:a.coordinatorDetail||"",source,verified:a.verifiedDate||a.verified||null,sourceBacked:isHttps(source)};
  }
  const normalizeEvidence=p=>(Array.isArray(p?.expertiseEvidence)?p.expertiseEvidence:[]).map((e,i)=>typeof e==="string"?{type:"legacy",label:e,status:"demo",source:null,id:`legacy-${i}`,serviceAccess:null,accessRequirements:null}:{type:e?.type||"legacy",label:e?.label||e?.name||"",status:e?.evidenceStatus||e?.status||"unverified",source:e?.sourceUrl||e?.source||null,verified:e?.verifiedDate||e?.verified||null,id:e?.id||`evidence-${i}`,serviceAccess:normalizeServiceAccess(e?.serviceAccess),accessRequirements:normalizeAccessRequirements(e?.accessRequirements)}).filter(e=>e.label).map(e=>({...e,sourceBacked:e.status==="official-source-verified"&&isHttps(e.source)}));
  function evidenceMatches(p,q){
    const needle=String(q||"").trim().toLowerCase(),ts=tokens(q);
    if(!needle)return[];
    return normalizeEvidence(p).filter(e=>{const h=e.label.toLowerCase();return h.includes(needle)||ts.some(t=>h.includes(t));});
  }
  function specialtyMatch(p,q){
    const needle=String(q||"").trim().toLowerCase(),ts=tokens(q),h=(p?.specialties||[]).join(" ").toLowerCase();
    return Boolean(needle&&(h.includes(needle)||ts.some(t=>h.includes(t))));
  }
  function providerRoute(p){
    const checked=p?.recordStatus==="official-source-verified",prefix=checked?"Source-checked provider record":"DEMO · UNVERIFIED provider record";
    if(p?.doctorEnglish==="yes")return{code:"direct-physician-english",strength:4,label:"Direct physician English recorded",detail:`${prefix}; this does not confirm the language route for a specific specialist service.`,verified:checked};
    if(["yes","available"].includes(p?.interpreter))return{code:"interpreter",strength:4,label:"Interpreter pathway recorded",detail:`${prefix}; confirm that the interpreter applies to the requested specialist service.`,verified:checked};
    if(p?.interpreter==="external")return{code:"external-interpreter",strength:2,label:"External interpreter arrangement recorded",detail:`${prefix}; this is not confirmation of an in-house specialist interpreter.`,verified:checked};
    if(["partial","limited"].includes(p?.doctorEnglish))return{code:"partial-or-limited-english",strength:1,label:"Partial / limited physician English recorded",detail:`${prefix}; communication suitability still needs confirmation.`,verified:checked};
    return{code:"no-documented-route",strength:0,label:"No provider-level language route confirmed",detail:"The current provider record does not confirm direct physician English or an interpreter route.",verified:false};
  }
  function serviceAccessState(matches,pRoute){
    const attached=matches.filter(e=>e.serviceAccess),confirmed=attached.filter(e=>e.serviceAccess?.sourceBacked);
    if(confirmed.length){const e=confirmed[0],a=e.serviceAccess;return{state:"service-level-confirmed",strength:6,label:`Service-level confirmed · ${routeLabel[a.route]||a.route}`,detail:"The matched disease/procedure evidence has its own official-source access evidence. Re-check current availability before booking.",route:a.route,sourceUrl:a.source,verifiedDate:a.verified,evidenceLabel:e.label};}
    if(attached.length){const e=attached[0],a=e.serviceAccess;return{state:"service-level-unverified",strength:2,label:`Service-level access needs verification · ${routeLabel[a.route]||a.route}`,detail:"A service-level access field exists, but it is not backed by an official source in the current record.",route:a.route,sourceUrl:null,verifiedDate:null,evidenceLabel:e.label};}
    if(pRoute.verified&&["direct-physician-english","interpreter","external-interpreter"].includes(pRoute.code))return{state:"provider-level-only",strength:3,label:`Provider-level only · ${pRoute.label}`,detail:"Language access is documented for the provider, not for the matched specialist service. Confirm applicability before booking.",route:pRoute.code,sourceUrl:null,verifiedDate:null,evidenceLabel:null};
    return{state:"needs-verification",strength:0,label:"Needs verification for this specialist service",detail:"No source-backed service-level language route is attached to the matched disease/procedure evidence.",route:pRoute.code,sourceUrl:null,verifiedDate:null,evidenceLabel:null};
  }
  function bookingRequirements(matches){
    const exact=matches.find(e=>e.accessRequirements?.sourceBacked)||matches.find(e=>e.accessRequirements);
    return exact?exact.accessRequirements:null;
  }
  function snapshot(p,q){
    const matches=evidenceMatches(p,q),backed=matches.filter(e=>e.sourceBacked),specialty=specialtyMatch(p,q),r=providerRoute(p),serviceAccess=serviceAccessState(matches,r),requirements=bookingRequirements(matches);
    const evidenceState=!String(q||"").trim()?"no-query":backed.length?"source-backed":matches.length?"record-only":specialty?"specialty-only":"no-match";
    const evidenceStrength={"source-backed":4,"record-only":2,"specialty-only":1,"no-match":0,"no-query":0}[evidenceState]||0;
    return{query:String(q||"").trim(),evidenceState,evidenceStrength,sourceBackedCount:backed.length,matches:matches.slice(0,6),route:r,serviceAccess,requirements,providerProvenance:p?.recordStatus==="official-source-verified"?"official-source-checked":"demo-unverified",rank:evidenceStrength*100+serviceAccess.strength*18+r.strength*4+(requirements?.sourceBacked?8:0)+(p?.recordStatus==="official-source-verified"?10:0)};
  }
  function currentQuery(){return $("q")?.value?.trim()||"";}
  function providerForCard(card){const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name);}
  function evidenceMarkup(s){if(s.evidenceState==="source-backed")return `<span class="specialist-state backed">SOURCE-BACKED MATCH</span>`;if(s.evidenceState==="record-only")return `<span class="specialist-state verify">UNVERIFIED EVIDENCE MATCH</span>`;if(s.evidenceState==="specialty-only")return `<span class="specialist-state verify">SPECIALTY TEXT MATCH ONLY</span>`;return `<span class="specialist-state none">NO SPECIFIC EVIDENCE MATCH</span>`;}
  function serviceBadge(s){if(s.serviceAccess.state==="service-level-confirmed")return '<span class="service-state confirmed">SERVICE-LEVEL CONFIRMED</span>';if(s.serviceAccess.state==="provider-level-only")return '<span class="service-state provider">PROVIDER-LEVEL ONLY</span>';if(s.serviceAccess.state==="service-level-unverified")return '<span class="service-state verify">SERVICE ACCESS · VERIFY</span>';return '<span class="service-state unknown">NEEDS VERIFICATION</span>';}
  const audienceText=r=>!r||!r.audience?.length?"Audience unknown":r.audience.includes("unknown")?"Visitor vs resident eligibility not stated":r.audience.map(x=>x==="visitor"?"Visitor / overseas":"Resident").join(" + ");
  const referralText=r=>({required:"Referral required",recommended:"Referral recommended",["not-required"]:"No referral prerequisite stated",conditional:"Referral conditional",varies:"Referral varies",unknown:"Referral unknown"}[r?.referral]||"Referral unknown");
  const coordinatorText=r=>({required:"Coordinator required",conditional:"Coordinator conditional",["not-required"]:"No coordinator requirement stated",unknown:"Coordinator unknown"}[r?.coordinator]||"Coordinator unknown");
  function requirementsMarkup(s){
    const r=s.requirements;if(!r)return `<div><small>SERVICE BOOKING REQUIREMENTS</small><b>Needs verification</b><span>No source-backed service-level audience / referral / booking / coordinator record matched this search.</span></div>`;
    const source=r.source?`<a href="${escapeHtml(r.source)}" target="_blank" rel="noopener noreferrer">Booking requirements source ↗</a>`:"";
    return `<div class="service-booking-box"><small>SERVICE BOOKING REQUIREMENTS</small><b>${escapeHtml(audienceText(r))}</b><span>${escapeHtml(referralText(r))}</span><span>${escapeHtml(coordinatorText(r))}</span><span><strong>Start:</strong> ${escapeHtml(r.bookingStart||"Booking start not documented")}</span>${r.referralDetail?`<span>${escapeHtml(r.referralDetail)}</span>`:""}${r.coordinatorDetail?`<span>${escapeHtml(r.coordinatorDetail)}</span>`:""}${source}</div>`;
  }
  function panel(p,q){
    const s=snapshot(p,q),matched=s.matches.map(e=>e.sourceBacked?`<a href="${escapeHtml(e.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(evidenceTypeLabel[e.type]||e.type)}: ${escapeHtml(e.label)} ↗</a>`:`<span>${escapeHtml(evidenceTypeLabel[e.type]||e.type)}: ${escapeHtml(e.label)} · ${p.recordStatus==="official-source-verified"?"not source-linked":"DEMO / unverified"}</span>`).join("");
    const serviceSource=s.serviceAccess.sourceUrl?`<a href="${escapeHtml(s.serviceAccess.sourceUrl)}" target="_blank" rel="noopener noreferrer">Service access source ↗</a>`:"";
    return `<section class="specialist-access-panel" aria-label="Searched expertise and service-level access pathway"><div class="specialist-head"><small>SEARCHED EXPERTISE + SERVICE ACCESS</small>${evidenceMarkup(s)}</div><div class="specialist-grid"><div><small>EXPERTISE EVIDENCE</small><b>${s.sourceBackedCount?`${s.sourceBackedCount} source-backed match${s.sourceBackedCount===1?"":"es"}`:s.matches.length?`${s.matches.length} match${s.matches.length===1?"":"es"} needing source verification`:s.evidenceState==="specialty-only"?"Specialty-level match only":"No specific evidence match"}</b><div class="specialist-evidence-list">${matched||"No disease/procedure evidence in the current record matched this search."}</div></div><div><small>REQUESTED SERVICE LANGUAGE ROUTE</small>${serviceBadge(s)}<b>${escapeHtml(s.serviceAccess.label)}</b><span>${escapeHtml(s.serviceAccess.detail)}</span>${serviceSource}</div>${requirementsMarkup(s)}<div><small>PROVIDER-LEVEL FALLBACK</small><b>${escapeHtml(s.route.label)}</b><span>${escapeHtml(s.route.detail)}</span></div></div><p>Service-level confirmation requires evidence attached to the matched disease/procedure/service record itself. Audience, referral, booking and coordinator fields are shown only when specifically documented; unknown stays unknown. These checks do not rank clinical quality or determine medical appropriateness.</p></section>`;
  }
  function ensureStyles(){
    if($("jh-specialist-access-styles"))return;
    const s=document.createElement("style");s.id="jh-specialist-access-styles";s.textContent=`.specialist-access-panel{margin:12px 0;padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#f9fbfd}.specialist-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.specialist-head>small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#607487}.specialist-state,.service-state{display:inline-flex;padding:4px 7px;border-radius:999px;font-size:7px;font-weight:900;margin-bottom:4px}.specialist-state.backed,.service-state.confirmed{background:#e8f7f2;color:#176b58}.specialist-state.verify,.service-state.verify{background:#fff2df;color:#8a5a18}.specialist-state.none,.service-state.unknown{background:#eef3f8;color:#607487}.service-state.provider{background:#eef6ff;color:#245f9d}.specialist-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.specialist-grid>div{padding:9px;border:1px solid #e4ebf1;border-radius:9px;background:#fff}.service-booking-box{border-color:#cfe1f5!important;background:#fbfdff!important}.specialist-grid small,.specialist-grid b,.specialist-grid span,.specialist-grid a,.specialist-evidence-list a{display:block}.specialist-grid small{font-size:7px;color:#718295}.specialist-grid b{font-size:9px;margin:3px 0}.specialist-grid span,.specialist-grid a,.specialist-evidence-list a{font-size:7px;line-height:1.45;color:#607487}.specialist-grid strong{color:#173c5f}.specialist-grid a,.specialist-evidence-list a{font-weight:800;color:#176df0}.specialist-evidence-list{display:grid;gap:3px;margin-top:5px}.specialist-access-panel>p{font-size:7px;line-height:1.45;color:#718295;margin:8px 0 0}.specialist-directory-summary{margin:10px 0;padding:10px 12px;border:1px solid #dce6ef;border-radius:10px;background:#fff;font-size:8px;line-height:1.45;color:#526579}.specialist-directory-summary b{color:#173c5f}.specialist-sort-note{font-size:7px;color:#718295;margin-top:5px}@media(max-width:850px){.specialist-grid{grid-template-columns:1fr}}@media(max-width:650px){.specialist-head{align-items:flex-start;flex-direction:column}}`;
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
      const backed=snaps.filter(s=>s.sourceBackedCount>0).length,serviceConfirmed=snaps.filter(s=>s.serviceAccess.state==="service-level-confirmed").length,bookingConfirmed=snaps.filter(s=>s.requirements?.sourceBacked).length,providerOnly=snaps.filter(s=>s.serviceAccess.state==="provider-level-only").length,needsVerification=snaps.filter(s=>["needs-verification","service-level-unverified"].includes(s.serviceAccess.state)).length;
      summary.innerHTML=`<b>${serviceConfirmed} service-level language confirmed</b> · ${bookingConfirmed} have source-backed service booking requirements · ${providerOnly} have provider-level language access only · ${needsVerification} need service-specific language verification · ${backed} have source-backed expertise evidence.`;
    }finally{busy=false;}
  }
  function ensureSort(){const sort=$("sort");if(!sort||[...sort.options].some(o=>o.value==="specialist-access"))return;const o=document.createElement("option");o.value="specialist-access";o.textContent="Service-level expertise + access evidence";sort.appendChild(o);}
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
        if(snap&&q)body.specialistAccessSnapshot={query:q,evidenceState:snap.evidenceState,sourceBackedCount:snap.sourceBackedCount,matches:snap.matches.map(e=>({type:e.type,label:e.label,status:e.status,sourceUrl:e.sourceBacked?e.source:null,verifiedDate:e.sourceBacked?e.verified:null,accessRequirements:e.accessRequirements?{audience:e.accessRequirements.audience,audienceDetail:e.accessRequirements.audienceDetail,referral:e.accessRequirements.referral,referralDetail:e.accessRequirements.referralDetail,bookingStart:e.accessRequirements.bookingStart,coordinator:e.accessRequirements.coordinator,coordinatorDetail:e.accessRequirements.coordinatorDetail,sourceUrl:e.accessRequirements.source,verifiedDate:e.accessRequirements.verified}:null})),providerAccessRoute:snap.route.code,providerAccessRouteVerified:snap.route.verified,serviceAccess:{state:snap.serviceAccess.state,route:snap.serviceAccess.route,sourceUrl:snap.serviceAccess.sourceUrl,verifiedDate:snap.serviceAccess.verifiedDate,evidenceLabel:snap.serviceAccess.evidenceLabel},serviceBookingRequirements:snap.requirements?{audience:snap.requirements.audience,audienceDetail:snap.requirements.audienceDetail,referral:snap.requirements.referral,referralDetail:snap.requirements.referralDetail,bookingStart:snap.requirements.bookingStart,coordinator:snap.requirements.coordinator,coordinatorDetail:snap.requirements.coordinatorDetail,sourceUrl:snap.requirements.source,verifiedDate:snap.requirements.verified}:null,provenance:snap.providerProvenance,disclaimer:"Search-evidence, service-language and service-booking logistics context only; not medical advice, clinical quality, outcomes, case acceptance, or a guarantee of current access."};
        init={...init,body:JSON.stringify(body)};
      }
    }catch(_){/* keep original request if optional enrichment fails */}
    return nativeFetch(input,init);
  };
})();