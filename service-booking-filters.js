(()=>{
  const $=id=>document.getElementById(id),grid=$("providerGrid");
  if(!grid||!window.JapanHealthSpecialistAccess)return;
  const providers=()=>window.PROVIDERS||[];
  const providerForCard=card=>providers().find(p=>p.name===card.querySelector("h3")?.textContent?.trim());
  const active=()=>({
    audience:$("serviceAudience")?.value||"all",
    referral:$("serviceReferral")?.value||"all",
    coordinator:$("serviceCoordinator")?.value||"all"
  });
  const hasActive=c=>Object.values(c).some(v=>v!=="all");
  const query=()=>($("q")?.value||"").trim();
  const checkedRequirements=(p,q)=>{
    if(!p||!q)return null;
    const snap=window.JapanHealthSpecialistAccess.snapshotForId(p.id,q);
    const r=snap?.requirements;
    return r?.sourceBacked&&/^https:\/\//i.test(String(r.source||""))?r:null;
  };
  function matches(r,c){
    if(!r)return false;
    if(c.audience!=="all"&&(!Array.isArray(r.audience)||!r.audience.includes(c.audience)))return false;
    if(c.referral==="required"&&r.referral!=="required")return false;
    if(c.referral==="no-mandatory"&&!['recommended','not-required'].includes(r.referral))return false;
    if(c.coordinator==="required"&&r.coordinator!=="required")return false;
    if(c.coordinator==="conditional"&&r.coordinator!=="conditional")return false;
    if(c.coordinator==="not-required"&&r.coordinator!=="not-required")return false;
    return true;
  }
  function syncUrl(){
    const p=new URLSearchParams(location.search),c=active();
    [["serviceAudience",c.audience],["serviceReferral",c.referral],["serviceCoordinator",c.coordinator]].forEach(([k,v])=>v&&v!=="all"?p.set(k,v):p.delete(k));
    history.replaceState(null,"",`${location.pathname}${p.size?`?${p}`:""}${location.hash}`);
  }
  function restoreUrl(){
    const p=new URLSearchParams(location.search);
    [["serviceAudience","serviceAudience"],["serviceReferral","serviceReferral"],["serviceCoordinator","serviceCoordinator"]].forEach(([key,id])=>{
      const el=$(id),v=p.get(key);if(el&&v&&[...el.options].some(o=>o.value===v))el.value=v;
    });
  }
  function summary(count,verified,c,q){
    const el=$("serviceConstraintSummary");if(!el)return;
    if(!hasActive(c)){
      el.innerHTML=`<b>Service booking filters ready.</b><span>Search a disease or procedure, then filter only on official-source service-level audience, referral and coordinator requirements. Unknown fields never count as a match.</span>`;
      return;
    }
    if(!q){
      el.innerHTML=`<b>Search a service first.</b><span>Service booking filters are not applied until a disease or procedure search is present, because Japan Health will not transfer one service's booking rules to another service.</span>`;
      return;
    }
    el.innerHTML=`<b>${count} options match the selected service booking constraints.</b><span>${verified} have official-source provider records. Filters use only source-backed booking requirements attached to the searched service; unknown or provider-wide rules are excluded rather than assumed.</span>`;
  }
  function apply(){
    const c=active(),q=query(),cards=[...grid.querySelectorAll(":scope > .provider-card")];
    if(!hasActive(c)||!q){summary(cards.length,cards.filter(card=>providerForCard(card)?.recordStatus==="official-source-verified").length,c,q);return;}
    let kept=0,verified=0;
    for(const card of cards){
      const p=providerForCard(card),r=checkedRequirements(p,q);
      if(matches(r,c)){kept++;if(p?.recordStatus==="official-source-verified")verified++;card.dataset.serviceConstraintMatch="yes";}
      else card.remove();
    }
    const rc=$("resultCount");if(rc)rc.textContent=`${kept} options · ${verified} official-source checked · service booking filters applied`;
    if(!kept){
      grid.innerHTML='<div class="empty-state service-filter-empty"><h3>No source-backed service booking match.</h3><p>Japan Health did not relax your service-level audience, referral or coordinator requirements. Try a different service search or remove one service booking constraint.</p><button class="small-btn primary" onclick="openLeadModal()">Ask a coordinator</button></div>';
    }
    summary(kept,verified,c,q);
  }
  function mount(){
    if($("serviceBookingFilters"))return;
    const host=document.createElement("section");host.id="serviceBookingFilters";host.className="service-booking-filters";host.setAttribute("aria-label","Service-level booking constraints");
    host.innerHTML=`<div class="service-filter-head"><div><small>SERVICE-LEVEL BOOKING FILTERS</small><b>Filter the booking rules for the service you searched.</b></div><span>Official-source evidence only</span></div><div class="service-filter-grid"><label>Service audience<select id="serviceAudience"><option value="all">Any documented service audience</option><option value="visitor">Visitor / overseas explicitly listed</option><option value="resident">Resident explicitly listed</option></select></label><label>Service referral<select id="serviceReferral"><option value="all">Any documented referral rule</option><option value="required">Referral required</option><option value="no-mandatory">No mandatory referral documented</option></select></label><label>Service coordinator<select id="serviceCoordinator"><option value="all">Any documented coordinator rule</option><option value="required">Coordinator required</option><option value="conditional">Coordinator conditionally required</option><option value="not-required">No coordinator requirement stated</option></select></label></div><p id="serviceConstraintSummary" class="service-constraint-summary" aria-live="polite"></p>`;
    const anchor=$("activeConstraintSummary")||document.querySelector(".filters");anchor?.insertAdjacentElement("afterend",host);
    const style=document.createElement("style");style.id="jh-service-booking-filter-styles";style.textContent=`.service-booking-filters{margin:12px 0;padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#fbfdff}.service-filter-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}.service-filter-head small,.service-filter-head b{display:block}.service-filter-head small{font-size:7px;font-weight:900;letter-spacing:.07em;color:#607487}.service-filter-head b{font-size:10px;margin-top:3px;color:#173c5f}.service-filter-head>span{font-size:7px;font-weight:900;padding:5px 7px;border-radius:999px;background:#e8f7f2;color:#176b58;white-space:nowrap}.service-filter-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.service-filter-grid label{font-size:8px;font-weight:800;color:#526579}.service-filter-grid select{width:100%;margin-top:4px}.service-constraint-summary{margin:9px 0 0;padding:8px 9px;border-radius:9px;background:#f5f8fb;font-size:8px;line-height:1.45;color:#607487}.service-constraint-summary b,.service-constraint-summary span{display:block}.service-constraint-summary b{color:#173c5f}.service-filter-empty{grid-column:1/-1}@media(max-width:760px){.service-filter-grid{grid-template-columns:1fr}.service-filter-head{flex-direction:column}.service-filter-head>span{white-space:normal}}`;
    document.head.appendChild(style);
    restoreUrl();
    ["serviceAudience","serviceReferral","serviceCoordinator"].forEach(id=>$(id)?.addEventListener("input",()=>{syncUrl();window.render?.();requestAnimationFrame(apply)}));
    ["q","audience","city","language","coord","referral","sort","verifiedOnly"].forEach(id=>$(id)?.addEventListener("input",()=>requestAnimationFrame(()=>{syncUrl();apply()})));
    $("resetFilters")?.addEventListener("click",()=>{["serviceAudience","serviceReferral","serviceCoordinator"].forEach(id=>{if($(id))$(id).value="all"});syncUrl();requestAnimationFrame(apply)});
  }
  mount();
  const observer=new MutationObserver(()=>requestAnimationFrame(apply));observer.observe(grid,{childList:true});
  requestAnimationFrame(apply);
  window.JapanHealthServiceBookingFilters={active,apply,checkedRequirements};
})();
